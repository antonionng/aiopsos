import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Camera } from "@babylonjs/core/Cameras/camera";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import { GlowLayer } from "@babylonjs/core/Layers/glowLayer";
import "@babylonjs/core/Layers/effectLayerSceneComponent";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { DynamicTexture } from "@babylonjs/core/Materials/Textures/dynamicTexture";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import type { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { CreateCylinder } from "@babylonjs/core/Meshes/Builders/cylinderBuilder";
import { CreateTorus } from "@babylonjs/core/Meshes/Builders/torusBuilder";
import { CreatePlane } from "@babylonjs/core/Meshes/Builders/planeBuilder";
import { CreateDisc } from "@babylonjs/core/Meshes/Builders/discBuilder";
import { CreateCapsule } from "@babylonjs/core/Meshes/Builders/capsuleBuilder";
import { CreatePolyhedron } from "@babylonjs/core/Meshes/Builders/polyhedronBuilder";
import "@babylonjs/core/Culling/ray";
import { homeOf, type Creature, type CrossingLevel, type Decision, type Home } from "@/lib/wonderlab/creature-crossing";

export type CrossingEvents = {
  onReady: () => void;
  onError: (message: string) => void;
  onPick: (id: string) => void;
  onScan: (id: string) => void;
  /** A spotlighted creature has stopped under the gate and waits for release(). */
  onHold: (id: string) => void;
  onArrive: (id: string, outcome: "home" | "lost" | "unsure") => void;
  onRunComplete: () => void;
};

const BODY_COLOURS: Record<Creature["colour"], string> = { blue: "#4d9cff", orange: "#ff9636", green: "#4fcf6d", pink: "#ff78c0" };
const HOME_COLOURS: Record<Home | "unsure", string> = { river: "#46b6ff", woods: "#5fd36a", sky: "#fff4c9", unsure: "#c28cff" };
const PEN_CENTRE = new Vector3(-6.2, 0, -4.6);
const HOLLOW = new Vector3(7.6, 0, -7.2);
const GATE = new Vector3(0, 0, 0.6);
const RIVER = new Vector3(-7.2, 0, 6.6);
const WOODS = new Vector3(7.2, 0, 6.6);
const SKY_LIFT = new Vector3(0, 0, 6.8);
const SKY_NEST = new Vector3(0, 4.6, 10.2);
const UNSURE = new Vector3(2.9, 0, -0.4);

type Actor = {
  id: string;
  creature: Creature;
  root: TransformNode;
  body: TransformNode;
  wings: TransformNode[];
  legs: Mesh[];
  fins: TransformNode[];
  path: Vector3[];
  speed: number;
  flying: boolean;
  phase: number;
  celebrate: number;
  sad: boolean;
  badge: Mesh | null;
  ring: Mesh | null;
  onArrive: (() => void) | null;
  idleTimer: number;
  facing: number;
};

type Burst = { mesh: Mesh; velocity: Vector3; life: number };
type Trail = { orbs: Mesh[]; from: Vector3; to: Vector3; t: number };
type Memory = { id: string; orb: Mesh; angle: number; arrive: number; from: Vector3 };

function seeded(seed: number) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

/** The Creature Crossing island. React owns the game rules; this file only shows them. */
export function createCrossingWorld(canvas: HTMLCanvasElement, events: CrossingEvents, options: { reducedMotion: boolean }) {
  const engine = new Engine(canvas, true, { preserveDrawingBuffer: false, stencil: true, antialias: true });
  engine.setHardwareScalingLevel(Math.max(1, (window.devicePixelRatio || 1) / 1.5));
  const scene = new Scene(engine);
  scene.clearColor = Color4.FromHexString("#8fd0ffff");
  scene.fogMode = Scene.FOGMODE_EXP2;
  scene.fogDensity = 0.0065;
  scene.fogColor = Color3.FromHexString("#cfe7ff");

  const camera = new ArcRotateCamera("crossing-view", -Math.PI / 2 + 0.1, 0.8, 30, new Vector3(-0.8, 0, -4.2), scene);
  camera.lowerAlphaLimit = -Math.PI / 2 - 0.55;
  camera.upperAlphaLimit = -Math.PI / 2 + 0.55;
  camera.lowerBetaLimit = 0.55;
  camera.upperBetaLimit = 1.22;
  camera.lowerRadiusLimit = 12;
  camera.upperRadiusLimit = 40;
  camera.panningSensibility = 0;
  camera.wheelDeltaPercentage = 0.01;
  camera.pinchDeltaPercentage = 0.004;
  camera.angularSensibilityX = 2400;
  camera.angularSensibilityY = 2400;
  camera.minZ = 0.3;
  camera.attachControl(canvas, true);
  const homeView = { alpha: -Math.PI / 2 + 0.1, beta: 0.8, radius: 30, target: new Vector3(-0.8, 0, -4.2) };
  let viewGoal: { alpha: number; beta: number; radius: number; target: Vector3 } | null = null;

  const hemi = new HemisphericLight("sky-light", new Vector3(0.2, 1, -0.3), scene);
  hemi.intensity = 0.78;
  hemi.diffuse = Color3.FromHexString("#f3f8ff");
  hemi.groundColor = Color3.FromHexString("#6f8a72");
  const sun = new DirectionalLight("sun", new Vector3(-0.55, -1, 0.6), scene);
  sun.position = new Vector3(18, 30, -18);
  sun.intensity = 0.95;
  sun.diffuse = Color3.FromHexString("#fff0d6");
  const shadows = new ShadowGenerator(1024, sun);
  shadows.useBlurExponentialShadowMap = true;
  shadows.blurKernel = 16;
  shadows.darkness = 0.45;
  const glow = new GlowLayer("magic-glow", scene, { mainTextureSamples: 2, blurKernelSize: 48 });
  glow.intensity = 0.75;

  const materials = new Map<string, StandardMaterial>();
  const material = (colour: string, options: { glow?: number; alpha?: number; unlit?: boolean; specular?: number } = {}) => {
    const key = `${colour}|${options.glow ?? 0}|${options.alpha ?? 1}|${options.unlit ?? false}|${options.specular ?? 0}`;
    const existing = materials.get(key);
    if (existing) return existing;
    const result = new StandardMaterial(`m-${materials.size}`, scene);
    result.diffuseColor = Color3.FromHexString(colour);
    result.emissiveColor = Color3.FromHexString(colour).scale(options.glow ?? 0);
    result.specularColor = Color3.White().scale(options.specular ?? 0.04);
    result.alpha = options.alpha ?? 1;
    if (options.unlit) result.disableLighting = true;
    materials.set(key, result);
    return result;
  };
  // Below 1 darkens; above 1 blends towards white (scaling past 1 overflows the hex colour).
  const shade = (hex: string, amount: number) => {
    const colour = Color3.FromHexString(hex);
    return (amount <= 1 ? colour.scale(amount) : Color3.Lerp(colour, Color3.White(), Math.min(1, amount - 1))).toHexString();
  };

  const statics: AbstractMesh[] = [];
  const keep = <T extends AbstractMesh>(mesh: T, receive = true, cast = false) => {
    if (receive) mesh.receiveShadows = true;
    if (cast) shadows.addShadowCaster(mesh);
    mesh.isPickable = false;
    statics.push(mesh);
    return mesh;
  };

  // Sky dome with a soft sunrise gradient.
  const skyTexture = new DynamicTexture("sky-gradient", { width: 8, height: 256 }, scene, false);
  const skyContext = skyTexture.getContext() as CanvasRenderingContext2D;
  const gradient = skyContext.createLinearGradient(0, 0, 0, 256);
  gradient.addColorStop(0, "#5fb2ff");
  gradient.addColorStop(0.42, "#9fd6ff");
  gradient.addColorStop(0.5, "#ffe1bf");
  gradient.addColorStop(1, "#ffd0a8");
  skyContext.fillStyle = gradient;
  skyContext.fillRect(0, 0, 8, 256);
  skyTexture.update();
  const skyMaterial = new StandardMaterial("sky", scene);
  skyMaterial.emissiveTexture = skyTexture;
  skyMaterial.disableLighting = true;
  skyMaterial.backFaceCulling = false;
  skyMaterial.fogEnabled = false;
  const dome = CreateSphere("sky-dome", { diameter: 220, segments: 16, sideOrientation: Mesh.BACKSIDE }, scene);
  dome.material = skyMaterial;
  dome.isPickable = false;
  dome.infiniteDistance = true;

  // A sea of clouds under the island.
  const cloudMat = material("#ffffff", { glow: 0.35, alpha: 0.92 });
  const random = seeded(42);
  const drifting: Array<{ mesh: TransformNode; speed: number }> = [];
  const cloud = (x: number, y: number, z: number, scale: number) => {
    const node = new TransformNode("cloud", scene);
    node.position.set(x, y, z);
    for (let index = 0; index < 5; index += 1) {
      const puff = CreateSphere("puff", { diameter: 2.4 + random() * 1.6, segments: 8 }, scene);
      puff.material = cloudMat;
      puff.parent = node;
      puff.position.set((index - 2) * 1.3, random() * 0.6, random() * 1.2 - 0.6);
      puff.scaling.y = 0.62;
      puff.isPickable = false;
    }
    node.scaling.setAll(scale);
    return node;
  };
  for (let index = 0; index < 22; index += 1) {
    const angle = (index / 22) * Math.PI * 2;
    const distance = 22 + random() * 18;
    drifting.push({ mesh: cloud(Math.cos(angle) * distance, -7 - random() * 5, Math.sin(angle) * distance, 1.4 + random() * 1.8), speed: 0.15 + random() * 0.2 });
  }
  for (let index = 0; index < 6; index += 1) {
    drifting.push({ mesh: cloud(-30 + index * 12, 9 + random() * 6, 32 + random() * 10, 0.9 + random()), speed: 0.3 + random() * 0.2 });
  }

  // The floating island.
  const grass = material("#7fcf6e");
  const meadow = material("#94dc78");
  const rock = material("#8a7a6c");
  const darkRock = material("#5e5249");
  const island = keep(CreateCylinder("island-top", { diameterTop: 30, diameterBottom: 28.5, height: 1.2, tessellation: 48 }, scene));
  island.position.y = -0.6;
  island.material = grass;
  const underside = keep(CreateCylinder("island-rock", { diameterTop: 28.4, diameterBottom: 4, height: 9, tessellation: 18 }, scene), false);
  underside.position.y = -5.6;
  underside.material = rock;
  for (let index = 0; index < 14; index += 1) {
    const angle = (index / 14) * Math.PI * 2;
    const chunk = keep(CreatePolyhedron("rock-chunk", { type: 2, size: 0.9 + random() * 1.1 }, scene), false);
    chunk.position.set(Math.cos(angle) * (11 + random() * 3), -3 - random() * 4, Math.sin(angle) * (11 + random() * 3));
    chunk.rotation.set(random() * 3, random() * 3, 0);
    chunk.material = index % 3 ? rock : darkRock;
  }

  // Paths of stepping stones.
  const stoneMat = material("#efe4cf");
  const path = (from: Vector3, to: Vector3, step = 0.95) => {
    const distance = Vector3.Distance(from, to);
    const count = Math.floor(distance / step);
    for (let index = 1; index < count; index += 1) {
      const point = Vector3.Lerp(from, to, index / count);
      const stone = keep(CreateCylinder("stone", { diameter: 0.75 + random() * 0.2, height: 0.08, tessellation: 9 }, scene));
      stone.position.set(point.x + (random() - 0.5) * 0.25, 0.04, point.z + (random() - 0.5) * 0.25);
      stone.rotation.y = random() * 3;
      stone.material = stoneMat;
    }
  };
  path(HOLLOW, new Vector3(0, 0, -1.6));
  path(new Vector3(0, 0, 2.2), RIVER.add(new Vector3(2.6, 0, -1.6)));
  path(new Vector3(0, 0, 2.2), WOODS.add(new Vector3(-2.6, 0, -1.6)));

  // Meadow decoration: flowers and tufts.
  const petalColours = ["#ffd1e8", "#fff3a6", "#ffffff", "#c9b8ff", "#ffb38a"];
  const avoid = [PEN_CENTRE, HOLLOW, GATE, RIVER, WOODS, SKY_LIFT];
  for (let index = 0; index < 120; index += 1) {
    const angle = random() * Math.PI * 2;
    const distance = 2 + random() * 12.5;
    const x = Math.cos(angle) * distance, z = Math.sin(angle) * distance;
    if (avoid.some((spot) => Math.hypot(spot.x - x, spot.z - z) < 3.4)) continue;
    if (index % 3) {
      const tuft = keep(CreateCylinder("tuft", { diameterTop: 0, diameterBottom: 0.22, height: 0.4 + random() * 0.3, tessellation: 4 }, scene));
      tuft.position.set(x, 0.2, z);
      tuft.material = meadow;
    } else {
      const flower = keep(CreateSphere("flower", { diameter: 0.22, segments: 4 }, scene));
      flower.position.set(x, 0.18, z);
      flower.material = material(petalColours[index % petalColours.length], { glow: 0.15 });
    }
  }

  // Training pen with a fence.
  const wood = material("#b07a4f");
  const woodDark = material("#8b5b38");
  const penFloor = keep(CreateDisc("pen-floor", { radius: 3.7, tessellation: 40 }, scene));
  penFloor.rotation.x = Math.PI / 2;
  penFloor.position.set(PEN_CENTRE.x, 0.02, PEN_CENTRE.z);
  penFloor.material = material("#d9efa0");
  for (let index = 0; index < 20; index += 1) {
    const angle = (index / 20) * Math.PI * 2;
    if (Math.abs(angle - 0.35) < 0.25) continue;
    const post = keep(CreateCylinder("post", { diameter: 0.2, height: 0.9, tessellation: 6 }, scene), true, true);
    post.position.set(PEN_CENTRE.x + Math.cos(angle) * 3.9, 0.45, PEN_CENTRE.z + Math.sin(angle) * 3.9);
    post.material = wood;
  }
  const rail = keep(CreateTorus("rail", { diameter: 7.8, thickness: 0.1, tessellation: 48 }, scene));
  rail.position.set(PEN_CENTRE.x, 0.7, PEN_CENTRE.z);
  rail.material = woodDark;
  const sign = (text: string, colour: string, position: Vector3, rotationY = 0) => {
    const root = new TransformNode("sign", scene);
    root.position.copyFrom(position);
    root.rotation.y = rotationY;
    const pole = keep(CreateCylinder("sign-pole", { diameter: 0.14, height: 1.6, tessellation: 6 }, scene), true, true);
    pole.parent = root;
    pole.position.y = 0.8;
    pole.material = woodDark;
    const board = keep(CreatePlane("sign-board", { width: 2.6, height: 0.8, sideOrientation: Mesh.DOUBLESIDE }, scene));
    board.parent = root;
    board.position.y = 1.65;
    const texture = new DynamicTexture("sign-text", { width: 512, height: 160 }, scene, true);
    texture.hasAlpha = true;
    const context = texture.getContext() as CanvasRenderingContext2D;
    context.fillStyle = colour;
    context.beginPath();
    context.roundRect(4, 4, 504, 152, 40);
    context.fill();
    context.fillStyle = "#1e2c3a";
    context.font = "bold 66px system-ui, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, 256, 84);
    texture.update();
    const signMaterial = new StandardMaterial("sign-material", scene);
    signMaterial.diffuseTexture = texture;
    signMaterial.emissiveColor = Color3.White().scale(0.45);
    signMaterial.useAlphaFromDiffuseTexture = true;
    signMaterial.specularColor = Color3.Black();
    board.material = signMaterial;
    return root;
  };
  sign("Training pen", "#fff4d6", PEN_CENTRE.add(new Vector3(2.4, 0, -4.1)), 0.2);
  sign("Herd Hollow", "#ffe0c2", HOLLOW.add(new Vector3(-2.6, 0, -1.2)), -0.2);

  // Herd Hollow: a hill with a dark tunnel.
  const hill = keep(CreateSphere("hollow-hill", { diameter: 4.2, segments: 16 }, scene), true, true);
  hill.position.set(HOLLOW.x + 1.1, -0.2, HOLLOW.z - 1.1);
  hill.scaling.y = 0.55;
  hill.material = material("#6fbf62");
  const tunnel = keep(CreateDisc("tunnel", { radius: 1.05, tessellation: 24, arc: 0.5 }, scene), false);
  tunnel.position.set(HOLLOW.x - 0.15, 0.02, HOLLOW.z + 0.15);
  tunnel.rotation.set(0, -Math.PI * 0.75, 0);
  tunnel.material = material("#1d2a22", { unlit: true });
  const tunnelArch = keep(CreateTorus("tunnel-arch", { diameter: 2.15, thickness: 0.28, tessellation: 24 }, scene), false, true);
  tunnelArch.position.copyFrom(tunnel.position);
  tunnelArch.rotation.set(Math.PI / 2, -Math.PI * 0.75, 0);
  tunnelArch.material = stoneMat;

  // The Wonder Gate.
  const gateStone = material("#f1e7d4", { specular: 0.1 });
  const gateTrim = material("#c9a861", { glow: 0.08 });
  for (const side of [-1, 1]) {
    const pillar = keep(CreateBox("gate-pillar", { width: 0.9, depth: 0.9, height: 4.2 }, scene), true, true);
    pillar.position.set(GATE.x + side * 1.9, 2.1, GATE.z);
    pillar.material = gateStone;
    const cap = keep(CreateBox("gate-cap", { width: 1.15, depth: 1.15, height: 0.3 }, scene), true, true);
    cap.position.set(GATE.x + side * 1.9, 4.3, GATE.z);
    cap.material = gateTrim;
    const base = keep(CreateBox("gate-base", { width: 1.2, depth: 1.2, height: 0.35 }, scene), true, true);
    base.position.set(GATE.x + side * 1.9, 0.17, GATE.z);
    base.material = gateTrim;
  }
  const arch = keep(CreateTorus("gate-arch", { diameter: 3.8, thickness: 0.42, tessellation: 40 }, scene), true, true);
  arch.position.set(GATE.x, 4.3, GATE.z);
  arch.rotation.x = Math.PI / 2;
  arch.scaling.y = 0.55;
  arch.material = gateStone;
  const crystalColour = new StandardMaterial("crystal", scene);
  crystalColour.diffuseColor = Color3.FromHexString("#b9a3ff");
  crystalColour.emissiveColor = Color3.FromHexString("#8f73ff");
  crystalColour.specularColor = Color3.White();
  crystalColour.alpha = 0.95;
  const crystal = CreatePolyhedron("gate-crystal", { type: 1, size: 0.62 }, scene);
  crystal.position.set(GATE.x, 6.1, GATE.z);
  crystal.scaling.y = 1.5;
  crystal.material = crystalColour;
  crystal.isPickable = false;
  shadows.addShadowCaster(crystal);
  glow.addIncludedOnlyMesh(crystal);
  const halo = CreateTorus("crystal-halo", { diameter: 2.2, thickness: 0.05, tessellation: 48 }, scene);
  halo.position.copyFrom(crystal.position);
  halo.material = material("#ffffff", { glow: 1, unlit: true, alpha: 0.7 });
  halo.isPickable = false;
  glow.addIncludedOnlyMesh(halo);
  const scanRing = CreateTorus("scan-ring", { diameter: 2.4, thickness: 0.08, tessellation: 40 }, scene);
  scanRing.material = material("#ffffff", { glow: 1, unlit: true, alpha: 0.85 });
  scanRing.position.set(GATE.x, 0.1, GATE.z);
  scanRing.isPickable = false;
  scanRing.setEnabled(false);
  glow.addIncludedOnlyMesh(scanRing);
  const gateVeil = CreatePlane("gate-veil", { width: 3, height: 3.9, sideOrientation: Mesh.DOUBLESIDE }, scene);
  gateVeil.position.set(GATE.x, 1.95, GATE.z);
  const veilMaterial = material("#c7b6ff", { glow: 0.9, unlit: true, alpha: 0.18 });
  gateVeil.material = veilMaterial;
  gateVeil.isPickable = false;
  let crystalTint = Color3.FromHexString("#8f73ff");
  let crystalGoal = crystalTint.clone();
  let crystalPulse = 0;

  // River home: a pond with lily pads and reeds.
  const pond = keep(CreateDisc("pond", { radius: 3.4, tessellation: 40 }, scene));
  pond.rotation.x = Math.PI / 2;
  pond.position.set(RIVER.x, 0.03, RIVER.z);
  const water = new StandardMaterial("water", scene);
  water.diffuseColor = Color3.FromHexString("#3fa9f5");
  water.emissiveColor = Color3.FromHexString("#1e6fb8").scale(0.5);
  water.specularColor = Color3.White().scale(0.5);
  water.specularPower = 32;
  pond.material = water;
  const bank = keep(CreateTorus("pond-bank", { diameter: 7, thickness: 0.5, tessellation: 40 }, scene));
  bank.position.set(RIVER.x, 0.02, RIVER.z);
  bank.scaling.y = 0.4;
  bank.material = stoneMat;
  const ripples: Mesh[] = [];
  for (let index = 0; index < 3; index += 1) {
    const ripple = CreateTorus("ripple", { diameter: 1, thickness: 0.04, tessellation: 32 }, scene);
    ripple.position.set(RIVER.x + (index - 1) * 1.2, 0.06, RIVER.z + (index % 2) * 0.8);
    ripple.material = material("#d9f2ff", { glow: 0.5, alpha: 0.6 });
    ripple.isPickable = false;
    ripples.push(ripple);
  }
  for (let index = 0; index < 5; index += 1) {
    const angle = index * 1.3;
    const pad = keep(CreateCylinder("lily", { diameter: 0.7, height: 0.04, tessellation: 12, arc: 0.88 }, scene));
    pad.position.set(RIVER.x + Math.cos(angle) * 2.3, 0.06, RIVER.z + Math.sin(angle) * 2.3);
    pad.material = material("#4bb35c");
  }
  for (let index = 0; index < 9; index += 1) {
    const angle = Math.PI * 0.9 + index * 0.17;
    const reed = keep(CreateCylinder("reed", { diameterTop: 0.03, diameterBottom: 0.08, height: 1.3 + random() * 0.6, tessellation: 5 }, scene), true, true);
    reed.position.set(RIVER.x + Math.cos(angle) * 3.7, 0.65, RIVER.z + Math.sin(angle) * 3.7);
    reed.material = material("#5f9e48");
  }
  sign("River", "#cdeeff", RIVER.add(new Vector3(3.5, 0, -2.6)), 0.5);

  // Woods home: a ring of round trees around a clearing.
  const trunk = material("#8e5c39");
  const leafColours = ["#3fa34d", "#58bf5a", "#2f8f47", "#6fcf62"];
  for (let index = 0; index < 11; index += 1) {
    const angle = Math.PI * 0.05 + index * 0.52;
    const radius = 3.3 + random() * 0.8;
    const x = WOODS.x + Math.cos(angle) * radius, z = WOODS.z + Math.sin(angle) * radius;
    if (Math.hypot(x - (WOODS.x - 2.6), z - (WOODS.z - 1.6)) < 1.5) continue;
    const height = 1.4 + random() * 0.8;
    const stem = keep(CreateCylinder("trunk", { diameterTop: 0.22, diameterBottom: 0.34, height, tessellation: 7 }, scene), true, true);
    stem.position.set(x, height / 2, z);
    stem.material = trunk;
    for (let layer = 0; layer < 2; layer += 1) {
      const canopy = keep(CreateSphere("canopy", { diameter: 1.9 - layer * 0.5, segments: 6 }, scene), true, true);
      canopy.position.set(x, height + 0.5 + layer * 0.8, z);
      canopy.material = material(leafColours[(index + layer) % leafColours.length]);
    }
  }
  const clearing = keep(CreateDisc("clearing", { radius: 2.6, tessellation: 32 }, scene));
  clearing.rotation.x = Math.PI / 2;
  clearing.position.set(WOODS.x, 0.02, WOODS.z);
  clearing.material = material("#c9a978");
  sign("Woods", "#d8f5c8", WOODS.add(new Vector3(-3.6, 0, -2.6)), -0.5);

  // Sky nests, which appear only in levels that use them.
  const skyGroup = new TransformNode("sky-home", scene);
  const liftBeam = CreateCylinder("sky-lift", { diameter: 1.6, height: 4.8, tessellation: 24 }, scene);
  liftBeam.parent = skyGroup;
  liftBeam.position.set(SKY_LIFT.x, 2.4, SKY_LIFT.z);
  liftBeam.material = material("#ffe58a", { glow: 0.9, unlit: true, alpha: 0.35 });
  liftBeam.isPickable = false;
  glow.addIncludedOnlyMesh(liftBeam);
  const liftPad = CreateCylinder("sky-pad", { diameter: 1.8, height: 0.12, tessellation: 24 }, scene);
  liftPad.parent = skyGroup;
  liftPad.position.set(SKY_LIFT.x, 0.06, SKY_LIFT.z);
  liftPad.material = gateTrim;
  const skyCloud = cloud(SKY_NEST.x, SKY_NEST.y - 0.6, SKY_NEST.z, 1.5);
  skyCloud.parent = skyGroup;
  skyCloud.getChildMeshes().forEach((puff) => (puff.material = material("#fff1c2", { glow: 0.45 })));
  for (let index = 0; index < 4; index += 1) {
    const band = CreateTorus("sky-rainbow", { diameter: 7 - index * 0.5, thickness: 0.16, tessellation: 48 }, scene);
    band.parent = skyGroup;
    band.position.set(SKY_NEST.x, SKY_NEST.y - 0.4, SKY_NEST.z + 0.8);
    band.rotation.x = Math.PI / 2;
    band.material = material(["#ff9bb3", "#ffd36b", "#8fe39a", "#8cc8ff"][index], { glow: 0.6, unlit: true, alpha: 0.85 });
    band.isPickable = false;
  }
  for (let index = 0; index < 3; index += 1) {
    const nest = CreateTorus("nest", { diameter: 1.1, thickness: 0.34, tessellation: 16 }, scene);
    nest.parent = skyGroup;
    nest.position.set(SKY_NEST.x + (index - 1) * 1.6, SKY_NEST.y + 0.05, SKY_NEST.z + (index === 1 ? 0.6 : 0));
    nest.scaling.y = 0.5;
    nest.material = material("#c59a5c");
    nest.isPickable = false;
  }
  const skySign = sign("Sky nests", "#fff2c4", new Vector3(-1.9, 0, 5.4), 0);
  skySign.parent = skyGroup;
  skyGroup.setEnabled(false);
  path(new Vector3(0, 0, 2.2), SKY_LIFT.add(new Vector3(0, 0, -1)));

  // Fireflies for a bit of life.
  const fireflies: Array<{ mesh: Mesh; base: Vector3; offset: number }> = [];
  for (let index = 0; index < 18; index += 1) {
    const mesh = CreateSphere("firefly", { diameter: 0.12, segments: 4 }, scene);
    const base = new Vector3((random() - 0.5) * 24, 1 + random() * 2.5, (random() - 0.5) * 22);
    mesh.position.copyFrom(base);
    mesh.material = material("#fff6a8", { glow: 1, unlit: true });
    mesh.isPickable = false;
    glow.addIncludedOnlyMesh(mesh);
    fireflies.push({ mesh, base, offset: random() * 10 });
  }

  for (const mesh of statics) mesh.freezeWorldMatrix();

  // Billboard badges drawn once and shared.
  const badgeMaterials = new Map<string, StandardMaterial>();
  const badgeMaterial = (key: string) => {
    const existing = badgeMaterials.get(key);
    if (existing) return existing;
    const [fill, glyph] =
      key === "river" ? ["#46b6ff", "🌊"] : key === "woods" ? ["#5fd36a", "🌳"] : key === "sky" ? ["#ffe58a", "☁️"]
        : key === "home" ? ["#38c172", "✓"] : key === "lost" ? ["#ff7a59", "!"] : key === "unsure" ? ["#b48cff", "?"] : ["#ffd34d", key];
    const texture = new DynamicTexture(`badge-${key}`, { width: 128, height: 128 }, scene, true);
    texture.hasAlpha = true;
    const context = texture.getContext() as CanvasRenderingContext2D;
    context.clearRect(0, 0, 128, 128);
    context.fillStyle = "#ffffff";
    context.beginPath();
    context.arc(64, 64, 60, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = fill;
    context.beginPath();
    context.arc(64, 64, 50, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#ffffff";
    context.font = glyph.length > 1 ? "56px system-ui, 'Apple Color Emoji', sans-serif" : "bold 70px system-ui, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(glyph, 64, 70);
    texture.update();
    const result = new StandardMaterial(`badge-material-${key}`, scene);
    result.diffuseTexture = texture;
    result.emissiveColor = Color3.White();
    result.disableLighting = true;
    result.useAlphaFromDiffuseTexture = true;
    result.backFaceCulling = false;
    badgeMaterials.set(key, result);
    return result;
  };
  const setBadge = (actor: Actor, key: string | null, height = 2.1) => {
    actor.badge?.dispose();
    actor.badge = null;
    if (!key) return;
    const badge = CreatePlane("badge", { size: 0.75 }, scene);
    badge.billboardMode = Mesh.BILLBOARDMODE_ALL;
    badge.parent = actor.root;
    badge.position.y = height;
    badge.material = badgeMaterial(key);
    badge.metadata = { creatureId: actor.id };
    actor.badge = badge;
  };

  // Creatures built from their features.
  const cream = material("#fff5df");
  const eyeWhite = material("#ffffff", { specular: 0.4 });
  const pupil = material("#1c2333", { specular: 0.6 });
  const buildCreature = (creature: Creature): Actor => {
    const root = new TransformNode(`creature-${creature.id}`, scene);
    const body = new TransformNode("body", scene);
    body.parent = root;
    const skin = material(BODY_COLOURS[creature.colour], { specular: 0.12 });
    const dark = material(shade(BODY_COLOURS[creature.colour], 0.7));
    const parts: Mesh[] = [];
    const add = (mesh: Mesh, parent: TransformNode = body) => {
      mesh.parent = parent;
      mesh.metadata = { creatureId: creature.id };
      parts.push(mesh);
      return mesh;
    };
    let bodyHeight = 1;
    let bodyRadius = 0.5;
    if (creature.shape === "tall") {
      const torso = add(CreateCapsule("torso", { radius: 0.42, height: 1.45, tessellation: 16 }, scene));
      torso.position.y = 0.95;
      torso.material = skin;
      bodyHeight = 1.45;
      bodyRadius = 0.42;
    } else {
      const torso = add(CreateSphere("torso", { diameter: 1.05, segments: 16 }, scene));
      torso.position.y = 0.72;
      torso.scaling.y = creature.shape === "round" ? 0.9 : 0.95;
      torso.material = skin;
      if (creature.shape === "spiky") {
        for (let index = 0; index < 7; index += 1) {
          const spike = add(CreateCylinder("spike", { diameterTop: 0, diameterBottom: 0.22, height: 0.4, tessellation: 6 }, scene));
          const angle = -Math.PI / 2 + (index / 6) * Math.PI;
          spike.position.set(0, 0.72 + Math.sin(angle + Math.PI / 2) * 0.48, -Math.cos(angle + Math.PI / 2) * 0.48 - 0.05);
          spike.rotation.x = -(angle + Math.PI / 2) + Math.PI / 2;
          spike.material = dark;
        }
      }
    }
    const centreY = creature.shape === "tall" ? 0.95 : 0.72;
    const top = centreY + bodyHeight / 2;
    // Patterns sit on the body so they are readable from the camera.
    if (creature.pattern === "stripes") {
      for (let index = 0; index < 3; index += 1) {
        const offset = (index - 1) * (creature.shape === "tall" ? 0.32 : 0.22);
        const radiusAt = Math.sqrt(Math.max(0.01, bodyRadius * bodyRadius - offset * offset * (creature.shape === "tall" ? 0.1 : 1)));
        const band = add(CreateTorus("stripe", { diameter: radiusAt * 2 + 0.02, thickness: 0.09, tessellation: 24 }, scene));
        band.position.y = centreY + offset;
        band.material = cream;
      }
    } else if (creature.pattern === "spots") {
      const spots = [[0.3, 0.15, 0.36], [-0.32, 0.05, 0.33], [0.05, 0.3, 0.38], [0.38, -0.1, 0.1], [-0.4, 0.2, 0.0], [0.1, -0.2, -0.42], [-0.2, 0.25, -0.38]];
      for (const [x, y, z] of spots) {
        const spot = add(CreateSphere("spot", { diameter: 0.2, segments: 6 }, scene));
        const direction = new Vector3(x, y * (creature.shape === "tall" ? 2.4 : 1), z).normalize();
        spot.position.set(direction.x * bodyRadius, centreY + direction.y * (creature.shape === "tall" ? 0.6 : bodyRadius * 0.9), direction.z * bodyRadius);
        spot.scaling.set(1, 1, 0.35);
        spot.lookAt(new Vector3(0, centreY, 0));
        spot.material = cream;
      }
    } else {
      const belly = add(CreateSphere("belly", { diameter: 0.6, segments: 10 }, scene));
      belly.position.set(0, centreY - 0.08, bodyRadius - 0.14);
      belly.scaling.set(1, creature.shape === "tall" ? 1.6 : 1, 0.4);
      belly.material = material(shade(BODY_COLOURS[creature.colour], 1.25));
    }
    // Eyes face +z.
    for (const side of [-1, 1]) {
      const eye = add(CreateSphere("eye", { diameter: 0.28, segments: 10 }, scene));
      eye.position.set(side * 0.17, top - 0.32, bodyRadius - 0.08);
      eye.material = eyeWhite;
      const dot = add(CreateSphere("pupil", { diameter: 0.14, segments: 8 }, scene));
      dot.position.set(side * 0.17, top - 0.31, bodyRadius + 0.05);
      dot.material = pupil;
    }
    const wings: Mesh[] = [];
    const legs: Mesh[] = [];
    const fins: TransformNode[] = [];
    const fluff = material(shade(BODY_COLOURS[creature.colour], 1.35));
    if (creature.limbs === "legs") {
      // A little woodland animal: legs and paws, ears, a nose and a bushy tail.
      for (const [x, z] of [[-0.24, 0.18], [0.24, 0.18], [-0.24, -0.2], [0.24, -0.2]]) {
        const leg = add(CreateCylinder("leg", { diameter: 0.16, height: 0.42, tessellation: 8 }, scene), root);
        leg.position.set(x, 0.21, z);
        leg.material = dark;
        const foot = add(CreateSphere("paw", { diameter: 0.26, segments: 6 }, scene), leg);
        foot.position.set(0, -0.2, 0.06);
        foot.scaling.y = 0.5;
        foot.material = dark;
        legs.push(leg);
      }
      for (const side of [-1, 1]) {
        const ear = add(CreateCylinder("ear", { diameterTop: 0, diameterBottom: 0.3, height: 0.38, tessellation: 10 }, scene));
        ear.position.set(side * 0.24, top + 0.08, 0);
        ear.rotation.z = -side * 0.35;
        ear.scaling.z = 0.5;
        ear.material = dark;
        const inner = add(CreateCylinder("inner-ear", { diameterTop: 0, diameterBottom: 0.16, height: 0.24, tessellation: 8 }, scene));
        inner.position.set(side * 0.24, top + 0.05, 0.05);
        inner.rotation.z = -side * 0.35;
        inner.scaling.z = 0.3;
        inner.material = material("#ffb3c7");
      }
      const nose = add(CreateSphere("nose", { diameter: 0.14, segments: 8 }, scene));
      nose.position.set(0, top - 0.48, bodyRadius + 0.04);
      nose.material = pupil;
      const tail = add(CreateSphere("bushy-tail", { diameter: 0.55, segments: 10 }, scene));
      tail.position.set(0, centreY + 0.12, -bodyRadius - 0.18);
      tail.scaling.set(0.8, 1.15, 0.8);
      tail.material = fluff;
      body.position.y = 0.28;
    } else if (creature.limbs === "fins") {
      // A river creature: fish-shaped body, side fins, a forked tail, a back fin, a mouth and bubbles.
      body.scaling.z = 1.2;
      const water = material("#7fe0ff", { glow: 0.15, specular: 0.4 });
      for (const side of [-1, 1]) {
        const fin = add(CreateSphere("fin", { diameter: 0.6, segments: 8 }, scene));
        fin.position.set(side * (bodyRadius + 0.12), centreY - 0.1, 0);
        fin.scaling.set(0.25, 0.75, 1.1);
        fin.rotation.z = side * 0.5;
        fin.material = water;
        fins.push(fin);
      }
      const tail = new TransformNode("tail", scene);
      tail.parent = body;
      tail.position.set(0, centreY, -bodyRadius - 0.1);
      for (const side of [-1, 1]) {
        const lobe = add(CreateSphere("tail-lobe", { diameter: 0.6, segments: 8 }, scene), tail);
        lobe.position.set(0, side * 0.2, -0.22);
        lobe.rotation.x = side * 0.7;
        lobe.scaling.set(0.16, 0.9, 0.5);
        lobe.material = water;
      }
      fins.push(tail);
      const dorsal = add(CreateCylinder("back-fin", { diameterTop: 0, diameterBottom: 0.5, height: 0.42, tessellation: 3 }, scene));
      dorsal.position.set(0, top + 0.08, -0.12);
      dorsal.scaling.x = 0.25;
      dorsal.material = water;
      const mouth = add(CreateTorus("mouth", { diameter: 0.12, thickness: 0.04, tessellation: 12 }, scene));
      mouth.position.set(0, top - 0.55, bodyRadius + 0.02);
      mouth.rotation.x = Math.PI / 2;
      mouth.material = pupil;
      for (const [x, y, size] of [[0.12, 0.35, 0.12], [0.2, 0.62, 0.08]]) {
        const bubble = add(CreateSphere("bubble", { diameter: size, segments: 8 }, scene));
        bubble.position.set(x, top + y, bodyRadius - 0.1);
        bubble.material = material("#dff7ff", { glow: 0.4, alpha: 0.7, specular: 0.8 });
      }
    } else {
      // A sky creature: big feathered wings, a beak, a crest and tail feathers.
      const feather = material("#fffaf0", { glow: 0.2 });
      for (const side of [-1, 1]) {
        const pivot = new TransformNode("wing-pivot", scene);
        pivot.parent = body;
        pivot.position.set(side * (bodyRadius - 0.05), centreY + 0.1, -0.05);
        const wing = add(CreateSphere("wing", { diameter: 1.3, segments: 10 }, scene), pivot);
        wing.position.set(side * 0.58, 0.05, 0);
        wing.scaling.set(1, 0.13, 0.6);
        wing.material = feather;
        for (let tip = 0; tip < 3; tip += 1) {
          const quill = add(CreateSphere("wing-feather", { diameter: 0.5, segments: 6 }, scene), pivot);
          quill.position.set(side * (0.95 + tip * 0.05), 0.02, -0.18 + tip * 0.18);
          quill.scaling.set(1, 0.12, 0.3);
          quill.rotation.y = side * (tip - 1) * 0.35;
          quill.material = fluff;
        }
        wings.push(wing);
      }
      const beak = add(CreateCylinder("beak", { diameterTop: 0, diameterBottom: 0.2, height: 0.28, tessellation: 6 }, scene));
      beak.rotation.x = Math.PI / 2;
      beak.position.set(0, top - 0.5, bodyRadius + 0.1);
      beak.material = material("#ffb23f");
      for (let index = 0; index < 3; index += 1) {
        const crest = add(CreateSphere("crest-feather", { diameter: 0.36, segments: 6 }, scene));
        crest.position.set((index - 1) * 0.08, top + 0.12, -0.05 - index * 0.05);
        crest.rotation.z = (index - 1) * 0.4;
        crest.scaling.set(0.2, 1, 0.35);
        crest.material = fluff;
      }
      for (let index = 0; index < 3; index += 1) {
        const plume = add(CreateSphere("tail-feather", { diameter: 0.6, segments: 6 }, scene));
        plume.position.set((index - 1) * 0.16, centreY - 0.1, -bodyRadius - 0.2);
        plume.rotation.set(0.9, 0, (index - 1) * 0.45);
        plume.scaling.set(0.3, 1, 0.12);
        plume.material = feather;
      }
      for (const side of [-1, 1]) {
        const foot = add(CreateCylinder("bird-foot", { diameter: 0.07, height: 0.25, tessellation: 6 }, scene));
        foot.position.set(side * 0.15, centreY - bodyRadius - 0.05, 0.05);
        foot.material = material("#ffb23f");
      }
      body.position.y = 0.15;
    }
    const shadowBlob = add(CreateDisc("shadow", { radius: 0.55, tessellation: 20 }, scene), root);
    shadowBlob.rotation.x = Math.PI / 2;
    shadowBlob.position.y = 0.03;
    shadowBlob.material = material("#000000", { alpha: 0.18, unlit: true });
    shadowBlob.isPickable = false;
    for (const part of parts) if (part !== shadowBlob) shadows.addShadowCaster(part);
    root.scaling.setAll(baseScale());
    return {
      id: creature.id,
      creature,
      root,
      body,
      wings: wings.map((wing) => wing.parent as TransformNode),
      legs,
      fins,
      path: [],
      speed: 3.4,
      flying: creature.limbs === "wings",
      phase: Math.random() * 10,
      celebrate: 0,
      sad: false,
      badge: null,
      ring: null,
      onArrive: null,
      idleTimer: 1 + Math.random() * 3,
      facing: 0,
    };
  };

  const baseScale = () => (engine.getRenderWidth() < engine.getRenderHeight() ? 1.05 : 0.82);
  const actors = new Map<string, Actor>();
  const penActors: Actor[] = [];
  const herdActors: Actor[] = [];
  const disposeActor = (actor: Actor) => {
    actor.root.getChildMeshes().forEach((mesh) => shadows.removeShadowCaster(mesh));
    actor.root.dispose();
    actors.delete(actor.id);
  };

  // Particle-like bursts from a small pool of spheres.
  const bursts: Burst[] = [];
  const burst = (at: Vector3, colour: string, count = 14, power = 3) => {
    if (options.reducedMotion) count = Math.ceil(count / 3);
    const burstMaterial = material(colour, { glow: 0.9, unlit: true });
    for (let index = 0; index < count; index += 1) {
      const mesh = CreateSphere("spark", { diameter: 0.14 + Math.random() * 0.1, segments: 4 }, scene);
      mesh.material = burstMaterial;
      mesh.position.copyFrom(at);
      mesh.isPickable = false;
      glow.addIncludedOnlyMesh(mesh);
      const angle = Math.random() * Math.PI * 2;
      bursts.push({ mesh, velocity: new Vector3(Math.cos(angle) * power * Math.random(), power * (0.8 + Math.random()), Math.sin(angle) * power * Math.random()), life: 0.9 + Math.random() * 0.4 });
    }
  };

  // Memory orbs circle the crystal: one per example the gate has learned from.
  let memories: Memory[] = [];
  const memoryPosition = (memory: Memory, time: number) =>
    new Vector3(GATE.x + Math.cos(memory.angle + time * 0.8) * 1.15, crystal.position.y + Math.sin(time * 2 + memory.angle) * 0.15, GATE.z + Math.sin(memory.angle + time * 0.8) * 1.15);

  // Thought trails link a herd creature to the examples it was compared with.
  let trails: Trail[] = [];
  const clearTrails = () => {
    trails.forEach((trail) => trail.orbs.forEach((orb) => orb.dispose()));
    trails = [];
  };

  // Pen layout.
  const penSpots = (count: number) => {
    const spots: Vector3[] = [];
    const inner = Math.min(count, 4);
    for (let index = 0; index < inner; index += 1) {
      const angle = (index / inner) * Math.PI * 2 + 0.4;
      spots.push(PEN_CENTRE.add(new Vector3(Math.cos(angle) * 1.25, 0, Math.sin(angle) * 1.25)));
    }
    const outer = count - inner;
    for (let index = 0; index < outer; index += 1) {
      const angle = (index / outer) * Math.PI * 2;
      spots.push(PEN_CENTRE.add(new Vector3(Math.cos(angle) * 2.85, 0, Math.sin(angle) * 2.85)));
    }
    return spots;
  };

  // A bouncing arrow that points at the creature Pip asks for.
  let pointer: { id: string; mesh: Mesh } | null = null;
  const setPointer = (id: string | null) => {
    pointer?.mesh.dispose();
    pointer = null;
    if (!id || !actors.has(id)) return;
    const mesh = CreateCylinder("pip-pointer", { diameterTop: 0.7, diameterBottom: 0, height: 0.9, tessellation: 4 }, scene);
    mesh.material = material("#ffd23f", { glow: 0.9, unlit: true });
    mesh.isPickable = false;
    glow.addIncludedOnlyMesh(mesh);
    pointer = { id, mesh };
  };

  let level: CrossingLevel | null = null;
  let selected: string[] = [];
  let showLabels = true;
  const homeSlots: Record<Home | "unsure", number> = { river: 0, woods: 0, sky: 0, unsure: 0 };
  const destination = (home: Home | "unsure") => {
    const index = homeSlots[home]++;
    if (home === "river") {
      const angle = index * 2.1;
      const radius = 0.9 + (index % 3) * 0.75;
      return RIVER.add(new Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    if (home === "woods") {
      const angle = index * 2.3;
      const radius = 0.6 + (index % 3) * 0.7;
      return WOODS.add(new Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    if (home === "sky") return SKY_NEST.add(new Vector3(((index % 5) - 2) * 0.85, 0.15, Math.floor(index / 5) * 0.8 - 0.3));
    return UNSURE.add(new Vector3((index % 3) * 0.95, 0, Math.floor(index / 3) * 0.95));
  };

  // Scheduled steps for the herd run, advanced by game time so fast-forward works.
  let timeline: Array<{ at: number; run: () => void }> = [];
  let clock = 0;
  let speed = 1;
  let running = false;
  let pendingArrivals = 0;
  let held: string | null = null;
  let heldScan: (() => void) | null = null;
  // The herd lines up along the path; only the front creature steps up to the gate.
  type Queued = { actor: Actor; atGate: () => void };
  let toSpawn: Queued[] = [];
  let waiting: Queued[] = [];
  let gateBusy = false;
  let sinceSpawn = 0;
  const QUEUE_START = HOLLOW.add(new Vector3(0.4, 0, -0.4));
  const GATE_SPOT = new Vector3(0, 0, -1.7);
  const QUEUE_GAP = 1.6;
  const queueSlot = (index: number) => {
    const length = Vector3.Distance(GATE_SPOT, QUEUE_START);
    return Vector3.Lerp(GATE_SPOT, QUEUE_START, Math.min(1, (index * QUEUE_GAP) / length));
  };
  const maxQueue = Math.floor(Vector3.Distance(GATE_SPOT, QUEUE_START) / QUEUE_GAP);
  const stepQueue = (dt: number) => {
    sinceSpawn += dt;
    if (toSpawn.length && waiting.length < maxQueue && sinceSpawn >= 0.9) {
      const next = toSpawn.shift()!;
      next.actor.root.position.copyFrom(QUEUE_START);
      next.actor.root.setEnabled(true);
      waiting.push(next);
      sinceSpawn = 0;
    }
    // While a creature stands under the gate, the line waits one place further back.
    waiting.forEach((entry, index) => {
      const slot = queueSlot(index + (gateBusy ? 1 : 0));
      const goal = entry.actor.path[entry.actor.path.length - 1] ?? entry.actor.root.position;
      if (Vector3.Distance(goal, slot) > 0.05) entry.actor.path = [slot];
    });
    const front = waiting[0];
    if (!gateBusy && front && !front.actor.path.length && Vector3.Distance(front.actor.root.position, GATE_SPOT) < 0.05) {
      waiting.shift();
      gateBusy = true;
      front.atGate();
    }
  };
  let holding = new Set<string>();
  // Frames the gate and the training pen together, so the player can compare a creature with the examples.
  const predictView = () => {
    const portrait = engine.getRenderWidth() < engine.getRenderHeight();
    return portrait
      ? { alpha: -Math.PI / 2 + 0.2, beta: 0.82, radius: 19, target: new Vector3(-2.6, 0, -3.6) }
      : { alpha: -Math.PI / 2 + 0.15, beta: 0.86, radius: 21, target: new Vector3(-1.4, 0, -2.4) };
  };
  const runView = () => {
    const portrait = engine.getRenderWidth() < engine.getRenderHeight();
    return portrait
      ? { alpha: -Math.PI / 2, beta: 0.8, radius: 15.5, target: new Vector3(0.6, 0, -1.4) }
      : { alpha: -Math.PI / 2, beta: 0.82, radius: 27, target: new Vector3(0.6, 0, -0.6) };
  };

  const placePen = () => {
    for (const actor of penActors) disposeActor(actor);
    penActors.length = 0;
    if (!level) return;
    const spots = penSpots(level.pen.length);
    level.pen.forEach((creature, index) => {
      const actor = buildCreature(creature);
      actor.root.position.copyFrom(spots[index]);
      actor.facing = Math.atan2(-spots[index].x + PEN_CENTRE.x + 0.01, -spots[index].z + PEN_CENTRE.z - 4) + Math.PI;
      actor.root.rotation.y = Math.PI + (Math.random() - 0.5) * 0.8;
      actors.set(actor.id, actor);
      penActors.push(actor);
    });
    refreshPenBadges();
  };

  const refreshPenBadges = () => {
    for (const actor of penActors) {
      const chosen = selected.indexOf(actor.id);
      if (showLabels) setBadge(actor, homeOf(actor.creature), actor.creature.shape === "tall" ? 2.35 : 1.95);
      else setBadge(actor, null);
      if (chosen >= 0 && !actor.ring) {
        const ring = CreateTorus("chosen-ring", { diameter: 1.35, thickness: 0.09, tessellation: 32 }, scene);
        ring.parent = actor.root;
        ring.position.y = 0.06;
        ring.material = material("#ffd84d", { glow: 1, unlit: true });
        ring.isPickable = false;
        glow.addIncludedOnlyMesh(ring);
        actor.ring = ring;
      } else if (chosen < 0 && actor.ring) {
        actor.ring.dispose();
        actor.ring = null;
      }
    }
  };

  const clearHerd = () => {
    for (const actor of herdActors) disposeActor(actor);
    herdActors.length = 0;
    timeline = [];
    running = false;
    pendingArrivals = 0;
    held = null;
    heldScan = null;
    holding = new Set();
    toSpawn = [];
    waiting = [];
    gateBusy = false;
    sinceSpawn = 0;
    for (const key of Object.keys(homeSlots) as Array<Home | "unsure">) homeSlots[key] = 0;
    clearTrails();
  };

  const setCrystal = (key: Home | "unsure" | "idle") => {
    crystalGoal = Color3.FromHexString(key === "idle" ? "#8f73ff" : HOME_COLOURS[key]);
  };

  const run = (decisions: Decision[], hold: string[] = []) => {
    clearHerd();
    running = true;
    clock = 0;
    setCrystal("idle");
    holding = new Set(hold);
    viewGoal = holding.size ? predictView() : runView();
    decisions.forEach((decision) => {
      const actor = buildCreature(decision.creature);
      actor.root.position.copyFrom(QUEUE_START);
      actor.root.setEnabled(false);
      actors.set(actor.id, actor);
      herdActors.push(actor);
      pendingArrivals += 1;
      const outcome: "home" | "lost" | "unsure" = decision.sentTo === "unsure" ? "unsure" : decision.correct ? "home" : "lost";
      toSpawn.push({
        actor,
        // Called once this creature is at the front of the queue and the gate is free.
        atGate: () => {
          actor.path = [];
          if (holding.has(actor.id)) {
            // Freeze the herd so the player can predict before the gate decides.
            held = actor.id;
            heldScan = () => scan(true);
            actor.facing = Math.PI;
            events.onHold(actor.id);
          } else scan(false);
        },
      });
      function scan(predicted: boolean) {
        // Show which examples the gate compared this creature with, and make them hop.
        drawTrails(actor.id, decision.nearest.map((example) => example.id));
        decision.nearest.forEach((example) => {
          const match = actors.get(example.id);
          if (match) match.celebrate = 0.6;
        });
        // Pause under the gate while the crystal decides.
        scanRing.setEnabled(true);
        scanRing.position.set(GATE.x, 3.4, GATE.z);
        crystalPulse = 1;
        setCrystal(decision.sentTo);
        events.onScan(actor.id);
        const scanAt = clock;
        timeline.push({
          // A predicted creature waits longer so the player can see the gate's answer.
          at: scanAt + (predicted ? 1.6 : 0.7),
          run: () => {
            scanRing.setEnabled(false);
            clearTrails();
            const target = destination(decision.sentTo);
            const exit = new Vector3(0, 0, 2.3);
            if (decision.sentTo === "unsure") actor.path = [new Vector3(1.6, 0, -1.2), target];
            else if (decision.sentTo === "sky") actor.path = [exit, SKY_LIFT.clone(), new Vector3(SKY_LIFT.x, SKY_NEST.y + 0.15, SKY_LIFT.z + 0.5), target];
            else if (decision.sentTo === "river") actor.path = [exit, RIVER.add(new Vector3(2.4, 0, -1.6)), target];
            else actor.path = [exit, WOODS.add(new Vector3(-2.4, 0, -1.6)), target];
            // Let the next creature step up once this one has walked clear of the arch.
            timeline.push({ at: clock + 0.8, run: () => (gateBusy = false) });
            actor.onArrive = () => {
              actor.onArrive = null;
              pendingArrivals -= 1;
              const where = actor.root.position.add(new Vector3(0, 1, 0));
              if (outcome === "home") {
                actor.celebrate = 1.2;
                burst(where, "#ffe066", 16, 3.2);
              } else if (outcome === "lost") {
                actor.sad = true;
                burst(where, decision.sentTo === "river" ? "#9fe0ff" : decision.sentTo === "sky" ? "#ffffff" : "#8fdc7a", 12, 2.4);
              } else {
                actor.sad = true;
              }
              setBadge(actor, outcome, actor.creature.shape === "tall" ? 2.35 : 1.95);
              actor.root.rotation.y = Math.PI;
              actor.facing = Math.PI;
              events.onArrive(actor.id, outcome);
              setCrystal("idle");
              if (pendingArrivals === 0) {
                running = false;
                events.onRunComplete();
              }
            };
          },
        });
      }
    });
  };

  const drawTrails = (herdId: string, nearestIds: string[]) => {
    clearTrails();
    const from = actors.get(herdId);
    if (!from) return;
    for (const id of nearestIds) {
      const to = actors.get(id);
      if (!to) continue;
      const orbs: Mesh[] = [];
      for (let index = 0; index < 18; index += 1) {
        const orb = CreateSphere("thought", { diameter: 0.16, segments: 4 }, scene);
        orb.material = material("#ffe066", { glow: 1, unlit: true });
        orb.isPickable = false;
        glow.addIncludedOnlyMesh(orb);
        orbs.push(orb);
      }
      trails.push({ orbs, from: from.root.position.clone(), to: to.root.position.clone(), t: 0 });
    }
  };

  const showThinking = (herdId: string | null, nearestIds: string[]) => {
    clearTrails();
    if (!herdId) return;
    const from = actors.get(herdId);
    if (!from) return;
    drawTrails(herdId, nearestIds);
    // Keep both creatures clear of the result panel: it sits on the right, or along the bottom on narrow screens.
    const target = Vector3.Lerp(from.root.position, actors.get(nearestIds[0])?.root.position ?? from.root.position, 0.5);
    const portrait = engine.getRenderWidth() < engine.getRenderHeight();
    const offset = portrait ? new Vector3(0, 0, -6) : new Vector3(5.5, 0, 0);
    viewGoal = { alpha: -Math.PI / 2, beta: 0.86, radius: homeView.radius, target: new Vector3(target.x * 0.7, 0, target.z * 0.7).add(offset) };
  };

  // Input: a tap that does not drag picks a creature.
  let down: { x: number; y: number; id: number } | null = null;
  const pickAt = (clientX: number, clientY: number) => {
    const rect = canvas.getBoundingClientRect();
    const picked = scene.pick(clientX - rect.left, clientY - rect.top, (mesh) => Boolean(mesh.metadata?.creatureId) && mesh.isEnabled());
    return picked?.pickedMesh?.metadata?.creatureId as string | undefined;
  };
  const onPointerDown = (event: PointerEvent) => {
    down = { x: event.clientX, y: event.clientY, id: event.pointerId };
  };
  const onPointerUp = (event: PointerEvent) => {
    if (!down || down.id !== event.pointerId) return;
    const moved = Math.hypot(event.clientX - down.x, event.clientY - down.y);
    down = null;
    if (moved > 10) return;
    const id = pickAt(event.clientX, event.clientY);
    if (id) events.onPick(id);
  };
  let hovered: string | undefined;
  let lastHover = 0;
  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse" || down) return;
    const now = performance.now();
    if (now - lastHover < 60) return;
    lastHover = now;
    hovered = pickAt(event.clientX, event.clientY);
    canvas.style.cursor = hovered ? "pointer" : "grab";
  };
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointermove", onPointerMove);

  // Portrait screens keep the island in the top half, above the controls.
  const fitCamera = () => {
    const portrait = engine.getRenderWidth() < engine.getRenderHeight();
    camera.fovMode = portrait ? Camera.FOVMODE_HORIZONTAL_FIXED : Camera.FOVMODE_VERTICAL_FIXED;
    camera.fov = portrait ? 1.2 : 0.8;
    homeView.alpha = portrait ? -Math.PI / 2 : -Math.PI / 2 + 0.1;
    homeView.beta = portrait ? 0.78 : 0.8;
    homeView.radius = portrait ? 21 : 30;
    homeView.target = portrait ? new Vector3(0, 0, -6.5) : new Vector3(-0.8, 0, -4.2);
  };
  const resize = new ResizeObserver(() => {
    engine.resize();
    fitCamera();
  });
  resize.observe(canvas);
  fitCamera();
  camera.alpha = homeView.alpha;
  camera.beta = homeView.beta;
  camera.radius = homeView.radius;
  camera.target.copyFrom(homeView.target);

  const onContextLost = (event: Event) => {
    event.preventDefault();
    events.onError("The 3D view stopped. Reload the page to carry on.");
  };
  canvas.addEventListener("webglcontextlost", onContextLost);

  let time = 0;
  let notifiedReady = false;
  let frames = 0;
  let disposed = false;
  const step = (actor: Actor, dt: number) => {
    const t = time + actor.phase;
    const moving = actor.path.length > 0;
    if (moving) {
      const goal = actor.path[0];
      const flat = goal.subtract(actor.root.position);
      const distance = flat.length();
      const stride = actor.speed * dt;
      if (distance <= stride) {
        actor.root.position.copyFrom(goal);
        actor.path.shift();
        if (!actor.path.length) actor.onArrive?.();
      } else {
        actor.root.position.addInPlace(flat.scale(stride / distance));
        if (Math.abs(flat.x) + Math.abs(flat.z) > 0.01) actor.facing = Math.atan2(flat.x, flat.z);
      }
    }
    let turn = actor.facing - actor.root.rotation.y;
    turn = Math.atan2(Math.sin(turn), Math.cos(turn));
    actor.root.rotation.y += turn * Math.min(1, dt * 10);
    // Body motion depends on how the creature moves.
    const motion = options.reducedMotion ? 0.35 : 1;
    if (actor.flying) {
      const flap = Math.sin(t * (moving ? 18 : 6)) * (moving ? 0.7 : 0.35) * motion;
      actor.wings.forEach((pivot, index) => (pivot.rotation.z = (index ? -1 : 1) * flap));
      actor.body.position.y = 0.15 + (0.35 + Math.sin(t * 3) * 0.12) * motion;
    } else if (actor.legs.length) {
      const swing = moving ? Math.sin(t * 16) * 0.5 : 0;
      actor.legs.forEach((leg, index) => (leg.rotation.x = (index % 2 ? 1 : -1) * swing * motion));
      actor.body.position.y = 0.28 + (moving ? Math.abs(Math.sin(t * 16)) * 0.12 : Math.sin(t * 2) * 0.02) * motion;
    } else {
      const wiggle = Math.sin(t * (moving ? 14 : 4));
      actor.fins.forEach((fin, index) => (fin.rotation.y = (index === 2 ? 0.5 : 0.25) * wiggle * motion));
      actor.body.position.y = (moving ? Math.abs(Math.sin(t * 9)) * 0.28 : 0) * motion;
      actor.body.rotation.z = (moving ? wiggle * 0.12 : 0) * motion;
    }
    if (actor.celebrate > 0) {
      actor.celebrate = Math.max(0, actor.celebrate - dt);
      actor.body.position.y += Math.abs(Math.sin(actor.celebrate * 10)) * 0.6 * motion;
      actor.body.rotation.y = (1.2 - actor.celebrate) * Math.PI * 2 * motion;
    } else actor.body.rotation.y = 0;
    if (actor.sad && !moving) actor.body.rotation.z = Math.sin(t * 3) * 0.12 * motion;
    const target = baseScale() * (actor.id === hovered ? 1.2 : 1);
    const scale = actor.root.scaling.x + (target - actor.root.scaling.x) * Math.min(1, dt * 12);
    actor.root.scaling.setAll(scale);
    if (actor.ring) actor.ring.rotation.y += dt * 2;
    // Pen creatures idle: look around and hop now and then.
    if (!moving && penActors.includes(actor) && !options.reducedMotion) {
      actor.idleTimer -= dt;
      if (actor.idleTimer <= 0) {
        actor.idleTimer = 2 + Math.random() * 4;
        actor.facing = Math.PI + (Math.random() - 0.5) * 1.6;
        if (Math.random() < 0.4) actor.celebrate = 0.35;
      }
    }
  };

  let failed = false;
  engine.runRenderLoop(() => {
    if (disposed || failed || document.hidden) return;
    try {
      frame();
    } catch (error) {
      // Stop rather than throwing on every frame, and tell the player instead of loading forever.
      failed = true;
      console.error(error);
      events.onError("Something went wrong while drawing the island. Reload the page to try again.");
    }
  });
  function frame() {
    const realDt = Math.min(engine.getDeltaTime() / 1000, 0.05);
    time += realDt;
    const dt = realDt * (running ? speed : 1);
    if (running && !held) {
      stepQueue(dt);
      clock += dt;
      const due = timeline.filter((item) => item.at <= clock);
      timeline = timeline.filter((item) => item.at > clock);
      due.forEach((item) => item.run());
    }
    for (const actor of actors.values()) if (actor.root.isEnabled()) step(actor, held && herdActors.includes(actor) ? 0 : dt);
    if (pointer) {
      const owner = actors.get(pointer.id);
      if (owner) pointer.mesh.position.set(owner.root.position.x, owner.root.position.y + 2.9 + Math.abs(Math.sin(time * 4)) * 0.45, owner.root.position.z);
      pointer.mesh.rotation.y += realDt * 3;
    }
    // Crystal, memory orbs and scan ring.
    crystalTint = Color3.Lerp(crystalTint, crystalGoal, Math.min(1, realDt * 6));
    crystalColour.emissiveColor = crystalTint.scale(0.8 + crystalPulse * 0.8);
    crystalColour.diffuseColor = crystalTint;
    crystalPulse = Math.max(0, crystalPulse - realDt * 1.6);
    crystal.rotation.y += realDt * (0.6 + crystalPulse * 4);
    crystal.position.y = 6.1 + Math.sin(time * 1.6) * 0.12;
    halo.position.y = crystal.position.y;
    halo.rotation.z = Math.sin(time * 0.7) * 0.3;
    halo.rotation.x = Math.PI / 2 + Math.cos(time * 0.5) * 0.3;
    veilMaterial.alpha = 0.14 + crystalPulse * 0.25 + Math.sin(time * 2) * 0.03;
    veilMaterial.emissiveColor = crystalTint;
    if (scanRing.isEnabled()) {
      scanRing.position.y = Math.max(0.1, scanRing.position.y - dt * 6);
      scanRing.material!.alpha = 0.4 + Math.sin(time * 30) * 0.3;
    }
    memories.forEach((memory) => {
      const goal = memoryPosition(memory, time);
      memory.arrive = Math.min(1, memory.arrive + realDt * 1.4);
      const eased = 1 - Math.pow(1 - memory.arrive, 3);
      const arc = Vector3.Lerp(memory.from, goal, eased);
      arc.y += Math.sin(eased * Math.PI) * 3;
      memory.orb.position.copyFrom(arc);
    });
    // Ripples, fireflies and clouds.
    ripples.forEach((ripple, index) => {
      const cycle = (time * 0.5 + index * 0.33) % 1;
      ripple.scaling.setAll(0.5 + cycle * 2.4);
      (ripple.material as StandardMaterial).alpha = 0.6 * (1 - cycle);
    });
    if (!options.reducedMotion) {
      fireflies.forEach((fly) => {
        fly.mesh.position.set(fly.base.x + Math.sin(time * 0.7 + fly.offset) * 0.8, fly.base.y + Math.sin(time * 1.3 + fly.offset) * 0.4, fly.base.z + Math.cos(time * 0.6 + fly.offset) * 0.8);
      });
      drifting.forEach((item) => {
        item.mesh.position.x += item.speed * realDt;
        if (item.mesh.position.x > 45) item.mesh.position.x = -45;
      });
    }
    liftBeam.visibility = 0.7 + Math.sin(time * 3) * 0.3;
    // Bursts.
    for (let index = bursts.length - 1; index >= 0; index -= 1) {
      const item = bursts[index];
      item.life -= realDt;
      item.velocity.y -= 9 * realDt;
      item.mesh.position.addInPlace(item.velocity.scale(realDt));
      item.mesh.scaling.setAll(Math.max(0.01, item.life));
      if (item.life <= 0) {
        item.mesh.dispose();
        bursts.splice(index, 1);
      }
    }
    // Thought trails travel from the herd creature to the example it resembled.
    for (const trail of trails) {
      trail.t = (trail.t + realDt * 0.6) % 1;
      trail.orbs.forEach((orb, index) => {
        const u = (index / trail.orbs.length + trail.t) % 1;
        const point = Vector3.Lerp(trail.from, trail.to, u);
        point.y += 1 + Math.sin(u * Math.PI) * 4;
        orb.position.copyFrom(point);
        orb.scaling.setAll(0.6 + Math.sin(u * Math.PI) * 0.8);
      });
    }
    // Ease the camera towards a requested view.
    if (viewGoal) {
      const k = Math.min(1, realDt * 2.5);
      camera.alpha += (viewGoal.alpha - camera.alpha) * k;
      camera.beta += (viewGoal.beta - camera.beta) * k;
      camera.radius += (viewGoal.radius - camera.radius) * k;
      // Move the target in place: assigning camera.target recalculates the radius from the old position.
      camera.target.copyFrom(Vector3.Lerp(camera.target, viewGoal.target, k));
      if (Math.abs(viewGoal.radius - camera.radius) < 0.05 && Vector3.Distance(camera.target, viewGoal.target) < 0.05) viewGoal = null;
    }
    scene.render();
    frames += 1;
    // Shaders can keep compiling in the background; the island is playable once it has drawn for a moment.
    if (!notifiedReady && (scene.isReady() || frames > 90)) {
      notifiedReady = true;
      events.onReady();
    }
  }

  return {
    setLevel(next: CrossingLevel) {
      setPointer(null);
      clearHerd();
      memories.forEach((memory) => memory.orb.dispose());
      memories = [];
      level = next;
      selected = [];
      skyGroup.setEnabled(next.homes.includes("sky"));
      placePen();
      setCrystal("idle");
    },
    setSelected(ids: string[]) {
      const added = ids.filter((id) => !selected.includes(id));
      const removed = selected.filter((id) => !ids.includes(id));
      selected = [...ids];
      for (const id of added) {
        const actor = actors.get(id);
        if (!actor) continue;
        actor.celebrate = 0.5;
        const orb = CreateSphere("memory", { diameter: 0.34, segments: 8 }, scene);
        orb.material = material(HOME_COLOURS[homeOf(actor.creature)], { glow: 1, unlit: true });
        orb.isPickable = false;
        glow.addIncludedOnlyMesh(orb);
        memories.push({ id, orb, angle: 0, arrive: options.reducedMotion ? 1 : 0, from: actor.root.position.add(new Vector3(0, 1.2, 0)) });
        crystalPulse = 1;
      }
      for (const id of removed) {
        const memory = memories.find((item) => item.id === id);
        if (memory) {
          burst(memory.orb.position.clone(), "#ffffff", 6, 1.5);
          memory.orb.dispose();
        }
      }
      memories = memories.filter((memory) => ids.includes(memory.id));
      memories.forEach((memory, index) => (memory.angle = (index / Math.max(1, memories.length)) * Math.PI * 2));
      refreshPenBadges();
    },
    setLabels(value: boolean) {
      showLabels = value;
      refreshPenBadges();
    },
    run,
    resetHerd() {
      clearHerd();
      setCrystal("idle");
    },
    release() {
      if (!held || !heldScan) return;
      const scan = heldScan;
      held = null;
      heldScan = null;
      scan();
    },
    /** Stop asking for predictions and let the rest of the herd cross. */
    releaseAll() {
      holding.clear();
      viewGoal = runView();
      if (!held || !heldScan) return;
      const scan = heldScan;
      held = null;
      heldScan = null;
      scan();
    },
    setPointer,
    setSpeed(value: number) {
      speed = value;
    },
    showThinking,
    resetView() {
      clearTrails();
      viewGoal = { ...homeView, target: homeView.target.clone() };
    },
    dispose() {
      disposed = true;
      resize.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      engine.stopRenderLoop();
      // Release the GPU context now rather than waiting for garbage collection, so leaving and
      // reopening the game cannot run out of WebGL contexts.
      const context = engine._gl as WebGLRenderingContext | null;
      scene.dispose();
      engine.dispose();
      context?.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}

export type CrossingWorld = ReturnType<typeof createCrossingWorld>;
