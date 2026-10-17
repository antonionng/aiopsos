import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Camera } from "@babylonjs/core/Cameras/camera";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { GlowLayer } from "@babylonjs/core/Layers/glowLayer";
import "@babylonjs/core/Layers/effectLayerSceneComponent";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { DynamicTexture } from "@babylonjs/core/Materials/Textures/dynamicTexture";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { CreateCylinder } from "@babylonjs/core/Meshes/Builders/cylinderBuilder";
import { CreatePlane } from "@babylonjs/core/Meshes/Builders/planeBuilder";
import { CreateDisc } from "@babylonjs/core/Meshes/Builders/discBuilder";
import { CreateCapsule } from "@babylonjs/core/Meshes/Builders/capsuleBuilder";
import { CreateTorus } from "@babylonjs/core/Meshes/Builders/torusBuilder";
import { ITEMS, type Basket, type Decision, type SorterLevel } from "@/lib/wonderlab/snack-sorter";

export type SorterEvents = {
  onReady: () => void;
  onError: (message: string) => void;
  onHold: (key: string) => void;
  onScan: () => void;
  onArrive: (key: string, outcome: "right" | "wrong" | "unsure") => void;
  onRunComplete: () => void;
};

type BeltItem = { key: string; decision: Decision; root: TransformNode; state: "belt" | "held" | "scan" | "fly" | "done"; t: number; from: Vector3; to: Vector3 };

const BELT_START = -8.6;
const BELT_END = 1.9;
const BELT_Y = 1.05;
const GAP = 2.1;
const PIP = new Vector3(3.8, 0, 2.4);
const BASKETS: Record<Basket, Vector3> = { yummy: new Vector3(1.4, 0, -1.9), yucky: new Vector3(6.1, 0, -1.9) };
const SHELF = new Vector3(3.8, 0, -3.3);

/** Pip's lunch belt. React decides what Pip learned; this file only shows it. */
export function createSorterWorld(canvas: HTMLCanvasElement, events: SorterEvents, options: { reducedMotion: boolean }) {
  const engine = new Engine(canvas, true, { preserveDrawingBuffer: false, stencil: true, antialias: true });
  engine.setHardwareScalingLevel(Math.max(1, (window.devicePixelRatio || 1) / 1.5));
  const scene = new Scene(engine);
  scene.clearColor = Color4.FromHexString("#9ad8ffff");

  const camera = new ArcRotateCamera("view", -Math.PI / 2 + 0.08, 1.1, 17, new Vector3(-1, 1, -0.6), scene);
  camera.inputs.clear();
  const fit = () => {
    const portrait = engine.getRenderWidth() < engine.getRenderHeight();
    camera.fovMode = portrait ? Camera.FOVMODE_HORIZONTAL_FIXED : Camera.FOVMODE_VERTICAL_FIXED;
    camera.fov = portrait ? 1.35 : 0.85;
    camera.radius = portrait ? 14 : 17;
    camera.beta = portrait ? 1.0 : 1.1;
    camera.target.copyFrom(portrait ? new Vector3(-1.6, 0.8, -0.6) : new Vector3(-1, 1, -0.6));
    // On phones the controls cover the lower half, so the picnic is lifted into the top of the screen.
    camera.targetScreenOffset.set(0, portrait ? 8 : 0);
  };
  fit();

  const hemi = new HemisphericLight("sky", new Vector3(0.2, 1, -0.4), scene);
  hemi.intensity = 0.9;
  hemi.groundColor = Color3.FromHexString("#8cb06f");
  const sun = new DirectionalLight("sun", new Vector3(-0.4, -1, 0.5), scene);
  sun.intensity = 0.6;
  const glow = new GlowLayer("glow", scene, { blurKernelSize: 32 });
  glow.intensity = 0.6;

  const materials = new Map<string, StandardMaterial>();
  const material = (colour: string, emissive = 0, alpha = 1) => {
    const key = `${colour}|${emissive}|${alpha}`;
    const found = materials.get(key);
    if (found) return found;
    const made = new StandardMaterial(`m${materials.size}`, scene);
    made.diffuseColor = Color3.FromHexString(colour);
    made.emissiveColor = Color3.FromHexString(colour).scale(emissive);
    made.specularColor = Color3.Black();
    made.alpha = alpha;
    materials.set(key, made);
    return made;
  };
  // Static scenery is frozen for speed once it has been positioned (see the end of setup).
  const statics: Mesh[] = [];
  const still = (mesh: Mesh) => {
    mesh.isPickable = false;
    statics.push(mesh);
    return mesh;
  };

  // Picture sprites, drawn once per emoji and shared.
  const spriteMaterials = new Map<string, StandardMaterial>();
  const sprite = (emoji: string) => {
    const found = spriteMaterials.get(emoji);
    if (found) return found;
    const texture = new DynamicTexture(`sprite-${emoji}`, { width: 256, height: 256 }, scene, true);
    texture.hasAlpha = true;
    const context = texture.getContext() as CanvasRenderingContext2D;
    context.clearRect(0, 0, 256, 256);
    context.font = "200px 'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(emoji, 128, 140);
    texture.update();
    const made = new StandardMaterial(`sprite-material-${emoji}`, scene);
    made.diffuseTexture = texture;
    made.useAlphaFromDiffuseTexture = true;
    made.emissiveColor = Color3.White();
    made.disableLighting = true;
    made.backFaceCulling = false;
    spriteMaterials.set(emoji, made);
    return made;
  };
  const picture = (emoji: string, size: number, parent?: TransformNode) => {
    const plane = CreatePlane(`picture-${emoji}`, { size }, scene);
    plane.material = sprite(emoji);
    plane.billboardMode = Mesh.BILLBOARDMODE_Y;
    plane.isPickable = false;
    if (parent) plane.parent = parent;
    return plane;
  };

  // Meadow, hills and clouds.
  const ground = still(CreateDisc("meadow", { radius: 120, tessellation: 64 }, scene));
  ground.rotation.x = Math.PI / 2;
  ground.material = material("#86cf6c");
  [[-14, 22, 9], [6, 26, 12], [22, 20, 8], [-28, 30, 11]].forEach(([x, z, r]) => {
    const hill = still(CreateSphere("hill", { diameter: r * 2, segments: 16 }, scene));
    hill.position.set(x, -r * 0.55, z);
    hill.material = material("#6fbf5c");
  });
  const cloudMat = material("#ffffff", 0.4);
  const clouds: TransformNode[] = [];
  [[-16, 9, 24], [-2, 11, 28], [14, 8.5, 25], [26, 10, 30]].forEach(([x, y, z]) => {
    const node = new TransformNode("cloud", scene);
    node.position.set(x, y, z);
    for (let i = 0; i < 4; i += 1) {
      const puff = CreateSphere("puff", { diameter: 3 + (i % 2), segments: 8 }, scene);
      puff.parent = node;
      puff.position.set((i - 1.5) * 1.7, (i % 2) * 0.4, 0);
      puff.scaling.y = 0.6;
      puff.material = cloudMat;
      puff.isPickable = false;
    }
    clouds.push(node);
  });
  const blanket = still(CreateBox("blanket", { width: 18, depth: 9, height: 0.04 }, scene));
  blanket.position.set(-1, 0.02, -0.8);
  const checks = new DynamicTexture("checks", { width: 256, height: 128 }, scene, true);
  const checksContext = checks.getContext() as CanvasRenderingContext2D;
  for (let x = 0; x < 16; x += 1) for (let y = 0; y < 8; y += 1) {
    checksContext.fillStyle = (x + y) % 2 ? "#ff8a8a" : "#fff4e8";
    checksContext.fillRect(x * 16, y * 16, 16, 16);
  }
  checks.update();
  const blanketMat = new StandardMaterial("blanket", scene);
  blanketMat.diffuseTexture = checks;
  blanketMat.specularColor = Color3.Black();
  blanket.material = blanketMat;

  // The conveyor belt with moving stripes.
  const frame = still(CreateBox("belt-frame", { width: BELT_END - BELT_START + 1.6, depth: 1.9, height: 0.5 }, scene));
  frame.position.set((BELT_START + BELT_END) / 2, BELT_Y - 0.45, 0);
  frame.material = material("#7c8aa5");
  for (const x of [BELT_START + 0.3, BELT_END - 0.3, (BELT_START + BELT_END) / 2]) {
    for (const z of [-0.75, 0.75]) {
      const leg = still(CreateCylinder("belt-leg", { diameter: 0.22, height: BELT_Y - 0.5 }, scene));
      leg.position.set(x, (BELT_Y - 0.5) / 2, z);
      leg.material = material("#55607a");
    }
  }
  const stripes = new DynamicTexture("belt-stripes", { width: 256, height: 32 }, scene, true);
  const stripeContext = stripes.getContext() as CanvasRenderingContext2D;
  stripeContext.fillStyle = "#2f3442";
  stripeContext.fillRect(0, 0, 256, 32);
  stripeContext.fillStyle = "#454c5f";
  for (let x = 0; x < 256; x += 32) stripeContext.fillRect(x, 0, 12, 32);
  stripes.update();
  stripes.uScale = 6;
  const beltMat = new StandardMaterial("belt", scene);
  beltMat.diffuseTexture = stripes;
  beltMat.specularColor = Color3.Black();
  const belt = still(CreateBox("belt", { width: BELT_END - BELT_START + 1.4, depth: 1.5, height: 0.08 }, scene));
  belt.position.set((BELT_START + BELT_END) / 2, BELT_Y - 0.16, 0);
  belt.material = beltMat;
  for (const x of [BELT_START - 0.6, BELT_END + 0.6]) {
    const roller = still(CreateCylinder("roller", { diameter: 0.5, height: 1.6 }, scene));
    roller.rotation.x = Math.PI / 2;
    roller.position.set(x, BELT_Y - 0.25, 0);
    roller.material = material("#ffd23f");
  }
  // The food hatch the items come out of.
  const hatch = still(CreateBox("hatch", { width: 2.2, depth: 2.4, height: 3.2 }, scene));
  hatch.position.set(BELT_START - 1.2, 1.6, 0);
  hatch.material = material("#ffb347");
  const roof = still(CreateCylinder("hatch-roof", { diameterTop: 0, diameterBottom: 3.4, height: 1.3, tessellation: 4 }, scene));
  roof.position.set(BELT_START - 1.2, 3.85, 0);
  roof.rotation.y = Math.PI / 4;
  roof.material = material("#e2556f");
  const door = still(CreatePlane("hatch-door", { width: 1.5, height: 1.5 }, scene));
  door.position.set(BELT_START - 0.08, 1.3, 0);
  door.rotation.y = -Math.PI / 2;
  door.material = material("#3a2a3f");
  const hatchSign = picture("🍽️", 1.3);
  hatchSign.position.set(BELT_START - 1.2, 2.6, -1.25);

  // Baskets with signs.
  const basketSigns: Record<Basket, Mesh> = { yummy: picture("😋", 1.4), yucky: picture("🤢", 1.4) };
  (Object.keys(BASKETS) as Basket[]).forEach((basket) => {
    const at = BASKETS[basket];
    const colour = basket === "yummy" ? "#5cc96b" : "#e2556f";
    const body = still(CreateCylinder(`${basket}-basket`, { diameterTop: 2.5, diameterBottom: 1.9, height: 1.1, tessellation: 24 }, scene));
    body.position.set(at.x, 0.55, at.z);
    body.material = material("#d79a52");
    const rim = still(CreateTorus(`${basket}-rim`, { diameter: 2.5, thickness: 0.22, tessellation: 32 }, scene));
    rim.position.set(at.x, 1.1, at.z);
    rim.material = material(colour, 0.25);
    const inside = still(CreateDisc(`${basket}-inside`, { radius: 1.1, tessellation: 24 }, scene));
    inside.rotation.x = Math.PI / 2;
    inside.position.set(at.x, 0.95, at.z);
    inside.material = material("#8a5a2b");
    basketSigns[basket].position.set(at.x, 2.5, at.z);
  });
  const shelf = still(CreateBox("thinking-shelf", { width: 2.2, depth: 0.9, height: 0.25 }, scene));
  shelf.position.set(SHELF.x, 0.12, SHELF.z);
  shelf.material = material("#c9b8ff");
  // Things Pip cannot decide about are put here.
  const shelfSign = picture("🤔", 0.9);
  shelfSign.position.set(SHELF.x, 1.1, SHELF.z);

  // Pip, built from simple shapes.
  const pip = new TransformNode("pip", scene);
  pip.position.copyFrom(PIP);
  const cream = material("#fff9ee");
  const ink = material("#29203e");
  const body = CreateCapsule("pip-body", { radius: 0.75, height: 2 }, scene);
  body.parent = pip;
  body.position.y = 1.4;
  body.material = cream;
  const belly = CreateSphere("pip-belly", { diameter: 1.1, segments: 12 }, scene);
  belly.parent = pip;
  belly.position.set(0, 1.15, -0.55);
  belly.scaling.z = 0.4;
  belly.material = material("#9264ef");
  const head = new TransformNode("pip-head", scene);
  head.parent = pip;
  head.position.y = 3;
  const skull = CreateBox("pip-skull", { width: 1.9, height: 1.35, depth: 1.3 }, scene);
  skull.parent = head;
  skull.material = cream;
  const visor = CreateBox("pip-visor", { width: 1.55, height: 0.9, depth: 0.1 }, scene);
  visor.parent = head;
  visor.position.z = -0.66;
  visor.material = ink;
  const eyeMat = material("#72dcc7", 1);
  const eyes = [-0.36, 0.36].map((x) => {
    const eye = CreateCapsule("pip-eye", { radius: 0.13, height: 0.5 }, scene);
    eye.parent = head;
    eye.position.set(x, 0.02, -0.72);
    eye.material = eyeMat;
    glow.addIncludedOnlyMesh(eye);
    return eye;
  });
  const antenna = CreateCylinder("pip-antenna", { diameter: 0.08, height: 0.6 }, scene);
  antenna.parent = head;
  antenna.position.y = 0.95;
  antenna.material = ink;
  const bulb = CreateSphere("pip-bulb", { diameter: 0.32, segments: 10 }, scene);
  bulb.parent = head;
  bulb.position.y = 1.3;
  bulb.material = material("#faaa53", 0.6);
  glow.addIncludedOnlyMesh(bulb);
  const arms = [-1, 1].map((side) => {
    const shoulder = new TransformNode("pip-shoulder", scene);
    shoulder.parent = pip;
    shoulder.position.set(side * 0.85, 2, 0);
    const arm = CreateCapsule("pip-arm", { radius: 0.16, height: 1.2 }, scene);
    arm.parent = shoulder;
    arm.position.y = -0.5;
    arm.material = ink;
    return shoulder;
  });
  [body, belly, skull, visor, antenna, bulb].forEach((mesh) => (mesh.isPickable = false));
  const emote = picture("😊", 1.2, pip);
  emote.position.set(0, 4.6, 0);
  emote.setEnabled(false);
  let emoteTimer = 0;
  const showEmote = (emoji: string, seconds = 1.4) => {
    emote.material = sprite(emoji);
    emote.setEnabled(true);
    emoteTimer = seconds;
  };

  // Examples sitting in each basket: Pip's memory.
  let memory: Array<{ id: string; mesh: Mesh; basket: Basket; drop: number }> = [];
  const layoutMemory = () => {
    (["yummy", "yucky"] as const).forEach((basket) => {
      const inBasket = memory.filter((item) => item.basket === basket);
      inBasket.forEach((item, index) => {
        const angle = (index / Math.max(1, inBasket.length)) * Math.PI * 2;
        const radius = inBasket.length > 1 ? 0.55 : 0;
        item.mesh.position.set(BASKETS[basket].x + Math.cos(angle) * radius, 1.45, BASKETS[basket].z + Math.sin(angle) * radius * 0.5);
      });
    });
  };

  let level: SorterLevel | null = null;
  let items: BeltItem[] = [];
  let holding = false;
  let running = false;
  let speed = 1;
  let shelfCount = 0;
  let beltOffset = 0;
  const sparks: Array<{ mesh: Mesh; v: Vector3; life: number }> = [];
  const burst = (at: Vector3, colour: string) => {
    for (let i = 0; i < (options.reducedMotion ? 5 : 14); i += 1) {
      const spark = CreateSphere("spark", { diameter: 0.18, segments: 4 }, scene);
      spark.material = material(colour, 1);
      spark.position.copyFrom(at);
      spark.isPickable = false;
      glow.addIncludedOnlyMesh(spark);
      const a = Math.random() * Math.PI * 2;
      sparks.push({ mesh: spark, v: new Vector3(Math.cos(a) * 2.5 * Math.random(), 3 + Math.random() * 2, Math.sin(a) * 2.5 * Math.random()), life: 1 });
    }
  };

  const clearBelt = () => {
    items.forEach((item) => item.root.dispose());
    items = [];
    running = false;
    shelfCount = 0;
  };

  const frontItem = () => items.find((item) => item.state !== "done" && item.state !== "fly");

  statics.forEach((mesh) => mesh.freezeWorldMatrix());

  let failed = false;
  let frames = 0;
  let notified = false;
  let time = 0;
  let disposed = false;
  engine.runRenderLoop(() => {
    if (disposed || failed || document.hidden) return;
    try {
      const realDt = Math.min(engine.getDeltaTime() / 1000, 0.05);
      const dt = realDt * speed;
      time += realDt;
      // Move the queue of items along the belt until the front one reaches Pip.
      const front = frontItem();
      let beltMoving = false;
      if (running && front) {
        const onBelt = items.filter((item) => item.state === "belt");
        const ahead = front.state === "belt" ? front : null;
        if (ahead) {
          const step = Math.min(dt * 2.4, BELT_END - ahead.root.position.x);
          if (step > 0.0001) {
            beltMoving = true;
            onBelt.forEach((item) => (item.root.position.x = Math.min(item.root.position.x + step, BELT_END)));
          }
          if (ahead.root.position.x >= BELT_END - 0.001) {
            if (holding) {
              ahead.state = "held";
              head.rotation.y = 0.5;
              events.onHold(ahead.key);
            } else {
              ahead.state = "scan";
              ahead.t = 0;
            }
          }
        }
        if (front.state === "scan") {
          if (front.t === 0) {
            events.onScan();
            showEmote("🤔", 0.9);
          }
          front.t += dt;
          head.rotation.y = 0.5 + Math.sin(time * 10) * 0.08;
          if (front.t > 0.9) {
            const sentTo = front.decision.sentTo;
            front.state = "fly";
            front.t = 0;
            front.from = front.root.position.clone();
            front.to = sentTo === "unsure" ? SHELF.add(new Vector3((shelfCount++ % 3 - 1) * 0.6, 0.6, 0)) : BASKETS[sentTo].add(new Vector3((Math.random() - 0.5) * 0.8, 1.2, (Math.random() - 0.5) * 0.4));
            head.rotation.y = sentTo === "yummy" ? 0.7 : sentTo === "yucky" ? -0.5 : 0;
            arms[sentTo === "yucky" ? 1 : 0].rotation.z = sentTo === "yucky" ? -1.4 : 1.4;
          }
        }
      }
      for (const item of items) {
        if (item.state !== "fly") continue;
        item.t = Math.min(1, item.t + dt * 1.6);
        const position = Vector3.Lerp(item.from, item.to, item.t);
        position.y += Math.sin(item.t * Math.PI) * 2.2;
        item.root.position.copyFrom(position);
        if (item.t >= 1) {
          item.state = "done";
          arms.forEach((arm) => (arm.rotation.z = 0));
          const { decision } = item;
          const outcome = decision.sentTo === "unsure" ? "unsure" : decision.correct ? "right" : "wrong";
          if (outcome === "right") {
            burst(item.root.position.add(new Vector3(0, 0.4, 0)), "#ffe066");
            showEmote("😊");
          } else if (outcome === "wrong") {
            burst(item.root.position.add(new Vector3(0, 0.4, 0)), "#ff7a59");
            showEmote(decision.sentTo === "yummy" ? "😵" : "😢");
          } else showEmote("🤷");
          events.onArrive(item.key, outcome);
          if (items.every((entry) => entry.state === "done")) {
            running = false;
            events.onRunComplete();
          }
        }
      }
      if (beltMoving) beltOffset -= dt * 0.4;
      stripes.uOffset = beltOffset;
      // Pip's idle animation and emotes.
      const motion = options.reducedMotion ? 0.3 : 1;
      pip.position.y = Math.sin(time * 2) * 0.05 * motion;
      if (!front || front.state === "belt") head.rotation.y += (0 - head.rotation.y) * Math.min(1, realDt * 4);
      eyes.forEach((eye) => (eye.scaling.y = Math.sin(time * 1.3) > 0.97 ? 0.15 : 1));
      if (emoteTimer > 0) {
        emoteTimer -= realDt;
        emote.position.y = 4.6 + Math.sin(time * 6) * 0.08;
        if (emoteTimer <= 0) emote.setEnabled(false);
      }
      memory.forEach((item) => {
        if (item.drop < 1) {
          item.drop = Math.min(1, item.drop + realDt * 2);
          item.mesh.position.y = 1.45 + (1 - item.drop) * 3;
        } else item.mesh.position.y = 1.45 + Math.sin(time * 2 + item.mesh.uniqueId) * 0.05;
      });
      for (let i = sparks.length - 1; i >= 0; i -= 1) {
        const spark = sparks[i];
        spark.life -= realDt;
        spark.v.y -= 9 * realDt;
        spark.mesh.position.addInPlace(spark.v.scale(realDt));
        if (spark.life <= 0) {
          spark.mesh.dispose();
          sparks.splice(i, 1);
        }
      }
      if (!options.reducedMotion) clouds.forEach((cloud, index) => (cloud.position.x = ((cloud.position.x + realDt * (0.3 + index * 0.05) + 40) % 80) - 40));
      scene.render();
      frames += 1;
      if (!notified && (scene.isReady() || frames > 90)) {
        notified = true;
        events.onReady();
      }
    } catch (error) {
      failed = true;
      console.error(error);
      events.onError("Something went wrong while drawing Pip's picnic. Reload the page to try again.");
    }
  });

  const resize = new ResizeObserver(() => {
    engine.resize();
    fit();
  });
  resize.observe(canvas);
  const onContextLost = (event: Event) => {
    event.preventDefault();
    events.onError("The 3D view stopped. Reload the page to carry on.");
  };
  canvas.addEventListener("webglcontextlost", onContextLost);

  return {
    setLevel(next: SorterLevel) {
      level = next;
      clearBelt();
      memory.forEach((item) => item.mesh.dispose());
      memory = [];
    },
    setExamples(ids: string[]) {
      if (!level) return;
      const rule = level.rule;
      memory = memory.filter((item) => {
        if (ids.includes(item.id)) return true;
        item.mesh.dispose();
        return false;
      });
      for (const id of ids) {
        if (memory.some((item) => item.id === id)) continue;
        const mesh = picture(ITEMS[id].emoji, 1);
        memory.push({ id, mesh, basket: rule(ITEMS[id]), drop: options.reducedMotion ? 1 : 0 });
      }
      layoutMemory();
    },
    run(decisions: Array<Decision & { key: string }>, hold: boolean) {
      clearBelt();
      holding = hold;
      running = true;
      items = decisions.map((decision, index) => {
        const root = new TransformNode(`belt-${decision.key}`, scene);
        root.position.set(BELT_START - index * GAP, BELT_Y + 0.55, 0);
        picture(decision.item.emoji, 1.25, root);
        const shadow = CreateDisc("item-shadow", { radius: 0.45, tessellation: 16 }, scene);
        shadow.parent = root;
        shadow.rotation.x = Math.PI / 2;
        shadow.position.y = -0.5;
        shadow.material = material("#000000", 0, 0.2);
        shadow.isPickable = false;
        return { key: decision.key, decision, root, state: "belt" as const, t: 0, from: Vector3.Zero(), to: Vector3.Zero() };
      });
    },
    release() {
      const held = items.find((item) => item.state === "held");
      if (!held) return;
      held.state = "scan";
      held.t = 0;
    },
    releaseAll() {
      holding = false;
      const held = items.find((item) => item.state === "held");
      if (held) {
        held.state = "scan";
        held.t = 0;
      }
    },
    resetBelt() {
      clearBelt();
    },
    setSpeed(value: number) {
      speed = value;
    },
    celebrate() {
      showEmote("🥳", 2.5);
    },
    dispose() {
      disposed = true;
      resize.disconnect();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      engine.stopRenderLoop();
      const context = engine._gl as WebGLRenderingContext | null;
      scene.dispose();
      engine.dispose();
      context?.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}

export type SorterWorld = ReturnType<typeof createSorterWorld>;
