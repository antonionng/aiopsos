import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { DynamicTexture } from "@babylonjs/core/Materials/Textures/dynamicTexture";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { CreateCylinder } from "@babylonjs/core/Meshes/Builders/cylinderBuilder";
import { CreateTorus } from "@babylonjs/core/Meshes/Builders/torusBuilder";
import { CreatePlane } from "@babylonjs/core/Meshes/Builders/planeBuilder";
import { CreateDisc } from "@babylonjs/core/Meshes/Builders/discBuilder";
import "@babylonjs/core/Culling/ray";
import type { ArcadeDesign, AvatarLook } from "@/lib/wonderlab/first-person";

export type WorldState = {
  design: ArcadeDesign;
  avatar: AvatarLook;
  mode: "explore" | "play";
  runId: number;
  paused: boolean;
  reducedMotion: boolean;
  guided: boolean;
};

type WorldEvents = {
  onReady: () => void;
  onError: (message: string) => void;
  onInteract: () => void;
  onCollect: (count: number) => void;
  onKeyCollect?: () => void;
  onComplete: () => void;
  onStatus: (message: string) => void;
  onDestination: (destination: "workshop" | "collectible" | "key" | "portal") => void;
  onWalking: (walking: boolean) => void;
};

type Collectible = { root: TransformNode; position: Vector3; collected: boolean; baseY: number; bonus: boolean };

const ARENA_RADIUS = 13.8;
const EYE_HEIGHT = 1.68;
const WORKSHOP = new Vector3(0, EYE_HEIGHT, 1.1);
const PORTAL = new Vector3(0, EYE_HEIGHT, 10.9);
const GOLDEN_KEY = new Vector3(-8, EYE_HEIGHT, -7);
const ITEM_POSITIONS = [[-6, -4], [-9, 1], [-7, 7], [-3, 10], [5, 8], [9, 2], [7, -5], [1, -8]];

/** A finite, authored 3D world. The creator changes its design data, never executable scene code. */
export function createArcadeWorld(canvas: HTMLCanvasElement, initial: WorldState, events: WorldEvents) {
  const engine = new Engine(canvas, true, { preserveDrawingBuffer: false, stencil: false, antialias: true });
  engine.setHardwareScalingLevel(Math.max(1, (window.devicePixelRatio || 1) / 1.5));
  const scene = new Scene(engine);
  scene.clearColor = Color4.FromHexString("#10182fff");
  scene.ambientColor = Color3.FromHexString("#293650");
  scene.fogMode = Scene.FOGMODE_EXP2;
  scene.fogDensity = 0.008;
  scene.fogColor = Color3.FromHexString("#151e3a");
  const camera = new FreeCamera("your-view", new Vector3(0, EYE_HEIGHT, -10), scene);
  camera.minZ = 0.08;
  camera.maxZ = 150;
  camera.fov = 1.02;
  camera.rotation.set(0.025, 0, 0);
  // Input is managed here so a form, dialogue or touch cancellation cannot leave movement running.
  camera.inputs.clear();
  scene.activeCamera = camera;
  const ambient = new HemisphericLight("moonlight", new Vector3(0.15, 1, -0.3), scene);
  ambient.intensity = 0.62;
  ambient.groundColor = Color3.FromHexString("#283252");
  const sunlight = new DirectionalLight("warm-lantern-light", new Vector3(-0.5, -1, 0.5), scene);
  sunlight.intensity = 0.7;
  sunlight.diffuse = Color3.FromHexString("#ffe4ba");

  let state = initial;
  let disposed = false;
  let needsRender = true;
  let elapsed = 0;
  let complete = false;
  let collected = 0;
  let keyFound = false;
  let portalOpen = false;
  let destination: Vector3 | null = null;
  let waypoints: Vector3[] = [];
  let destinationKind: "workshop" | "collectible" | "key" | "portal" = "workshop";
  let guidedWalking = false;
  const keys = new Set<string>();
  let joystick = { x: 0, y: 0 };
  let pointer: { id: number; startX: number; startY: number; x: number; y: number; moved: boolean } | null = null;
  let pickups: Collectible[] = [];
  const staticMeshes = new Map<StandardMaterial, Mesh[]>();
  const flickers: Array<{ mesh: Mesh; base: number; offset: number }> = [];

  const material = (name: string, colour: string, glow = 0, alpha = 1) => {
    const result = new StandardMaterial(name, scene);
    result.diffuseColor = Color3.FromHexString(colour);
    result.emissiveColor = Color3.FromHexString(colour).scale(glow);
    result.specularColor = Color3.Black();
    result.alpha = alpha;
    return result;
  };
  const stone = material("warm-ivory-stone", "#ddd2ba");
  const edge = material("carved-slate", "#657b8f");
  const dark = material("deep-indigo", "#273653");
  const soil = material("floating-island-rock", "#293c54");
  const grass = material("velvet-moss", "#42787a");
  const lawn = material("mint-grass", "#64a79b");
  const gold = material("brushed-brass", "#ddb66b", 0.05);
  const purple = material("violet-enamel", "#8c71c9");
  const teal = material("aqua-enamel", "#56c4b0");
  const light = material("lantern-light", "#ffe1a2", 0.85);
  const cyanLight = material("magic-aqua", "#62dfd2", 0.85);
  const violetLight = material("magic-violet", "#a989e2", 0.85);
  // Emissive lights retain their colour instead of adding the full daylight contribution.
  for (const luminous of [light, cyanLight, violetLight]) luminous.disableLighting = true;
  const mineralPurple = material("decorative-mineral-slate", "#677098", 0.03);
  const mineralTeal = material("decorative-mineral-teal", "#427c87", 0.03);
  const pickupMaterials = {
    star: material("collectible-blue-star", "#68dfff", 1),
    crystal: material("collectible-orchid-crystal", "#d179ff", 1),
    firefly: material("collectible-lime-firefly", "#d5f76a", 1),
    bonus: material("collectible-golden-bonus", "#ffc648", 1),
  };
  const pickupHalos = {
    star: material("blue-star-aura", "#68dfff", 0.8, 0.12),
    crystal: material("orchid-crystal-aura", "#d179ff", 0.8, 0.12),
    firefly: material("lime-firefly-aura", "#d5f76a", 0.8, 0.12),
    bonus: material("golden-bonus-aura", "#ffc648", 0.8, 0.15),
  };
  for (const collectibleMaterial of [...Object.values(pickupMaterials), ...Object.values(pickupHalos)]) {
    collectibleMaterial.disableLighting = true;
    collectibleMaterial.backFaceCulling = false;
  }
  const softGlow = material("soft-glow", "#84f4de", 0.8, 0.12);
  softGlow.disableLighting = true;
  softGlow.backFaceCulling = false;
  const starMaterial = material("sky-starlight", "#f5e8c6", 1);
  starMaterial.disableLighting = true;
  const avatarMaterial = material("your-sleeves", initial.avatar.colour);
  const skin = material("glove-ivory", "#fff0ce");

  const place = (mesh: Mesh, mat: StandardMaterial, x: number, y: number, z: number, parent?: TransformNode, merge = true) => {
    mesh.material = mat;
    mesh.position.set(x, y, z);
    mesh.isPickable = false;
    if (parent) mesh.parent = parent;
    else if (merge) {
      const group = staticMeshes.get(mat) || [];
      group.push(mesh);
      staticMeshes.set(mat, group);
    }
    return mesh;
  };
  const box = (name: string, w: number, h: number, d: number, mat: StandardMaterial, x: number, y: number, z: number, parent?: TransformNode, merge = true) =>
    place(CreateBox(name, { width: w, height: h, depth: d }, scene), mat, x, y, z, parent, merge);
  const cylinder = (name: string, bottom: number, top: number, height: number, mat: StandardMaterial, x: number, y: number, z: number, parent?: TransformNode, sides = 12, merge = true) =>
    place(CreateCylinder(name, { diameterBottom: bottom, diameterTop: top, height, tessellation: sides }, scene), mat, x, y, z, parent, merge);
  const sphere = (name: string, diameter: number, mat: StandardMaterial, x: number, y: number, z: number, parent?: TransformNode, merge = true) =>
    place(CreateSphere(name, { diameter, segments: 8 }, scene), mat, x, y, z, parent, merge);
  const ring = (name: string, diameter: number, thickness: number, mat: StandardMaterial, x: number, y: number, z: number, parent?: TransformNode, merge = true) =>
    place(CreateTorus(name, { diameter, thickness, tessellation: 32 }, scene), mat, x, y, z, parent, merge);

  // The island is continuous ground, without a route editor or a second movement phase.
  cylinder("island-silhouette", 17, 31, 6, soil, 0, -3.5, 0, undefined, 12);
  cylinder("island-stone-rim", 31.4, 31.4, 0.6, edge, 0, -0.4, 0, undefined, 64);
  cylinder("island-lawn", 31, 31, 0.25, grass, 0, -0.04, 0, undefined, 64);
  cylinder("central-courtyard", 10, 10, 0.1, stone, 0, 0.1, 2.5, undefined, 48);
  ring("courtyard-brass-inlay", 9.4, 0.075, gold, 0, 0.17, 2.5);
  ring("courtyard-inner-inlay", 7.8, 0.04, gold, 0, 0.17, 2.5);
  for (let z = -12; z < 13; z += 1.25) {
    if (z > -2 && z < 7.5) continue;
    const paver = box("path-stone", 2.8, 0.075, 1.07, stone, 0, 0.1, z);
    paver.rotation.y = Math.sin(z * 6.3) * 0.07;
  }
  for (let i = 0; i < 28; i++) {
    const angle = (i / 28) * Math.PI * 2;
    const x = Math.sin(angle) * 10.6;
    const z = Math.cos(angle) * 10.6;
    const paver = box("orbit-path", 1.3, 0.06, 0.95, stone, x, 0.08, z);
    paver.rotation.y = angle;
  }
  // Low railings keep the horizon open and visually explain the walkable edge.
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * Math.PI * 2;
    const x = Math.sin(angle) * 14.65;
    const z = Math.cos(angle) * 14.65;
    cylinder("edge-post", 0.4, 0.3, 0.9, stone, x, 0.42, z);
    sphere("edge-light", 0.17, light, x, 0.95, z);
    const rail = box("edge-rail", 3.5, 0.12, 0.16, edge, Math.sin(angle + 0.13) * 14.65, 0.52, Math.cos(angle + 0.13) * 14.65);
    rail.rotation.y = angle + 0.13;
  }

  // The glowing portal is an unmistakable destination after the game is built.
  const portalRoot = new TransformNode("portal", scene);
  portalRoot.position.set(0, 0, 11);
  const portalFrame = ring("portal-stone-arch", 5.3, 0.48, stone, 0, 2.9, 0, portalRoot);
  portalFrame.rotation.x = Math.PI / 2;
  const portalGold = ring("portal-outer-brass", 5.7, 0.09, gold, 0, 2.9, 0.06, portalRoot);
  portalGold.rotation.x = Math.PI / 2;
  const portalGlow = ring("portal-active-ring", 4.85, 0.12, cyanLight, 0, 2.9, -0.16, portalRoot);
  portalGlow.rotation.x = Math.PI / 2;
  const portalSurfaceMaterial = material("portal-surface", "#ac8aff", 0.85, 0.18);
  portalSurfaceMaterial.backFaceCulling = false;
  const portalSurface = place(CreateDisc("portal-surface", { radius: 2.25, tessellation: 48 }, scene), portalSurfaceMaterial, 0, 2.75, 0, portalRoot);
  portalSurface.scaling.x = 0.85;
  cylinder("portal-left-foot", 1.4, 1.1, 0.5, stone, -2.3, 0.25, 11);
  cylinder("portal-right-foot", 1.4, 1.1, 0.5, stone, 2.3, 0.25, 11);
  const portalSymbol = sphere("portal-beacon", 0.45, violetLight, 0, 5.85, 11, undefined, false);
  // A physical lock shows why a key game has a different ending from a collection game.
  const lockedGate = new TransformNode("locked-portal-gate", scene);
  lockedGate.parent = portalRoot;
  for (let x = -1.8; x <= 1.8; x += 0.6) box("gate-bar", 0.1, 3.5, 0.16, gold, x, 2.05, -0.25, lockedGate);
  for (const y of [0.6, 3.5]) box("gate-crossbar", 3.9, 0.13, 0.18, gold, 0, y, -0.25, lockedGate);
  const lockLoop = ring("gate-lock-loop", 0.7, 0.12, gold, 0, 2.65, -0.38, lockedGate);
  lockLoop.rotation.x = Math.PI / 2;
  box("gate-lock-body", 0.88, 0.68, 0.27, gold, 0, 2.2, -0.4, lockedGate);
  sphere("gate-keyhole", 0.16, dark, 0, 2.28, -0.55, lockedGate).scaling.z = 0.25;
  box("gate-keyhole-stem", 0.09, 0.16, 0.025, dark, 0, 2.16, -0.55, lockedGate);

  const textSign = (text: string, width: number, height: number, x: number, y: number, z: number, colour = "#e8fff6") => {
    const texture = new DynamicTexture(`sign-${text}`, { width: 1024, height: 256 }, scene, false);
    texture.hasAlpha = true;
    const ctx = texture.getContext() as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, 1024, 256);
    ctx.font = "bold 66px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = colour;
    ctx.fillText(text, 512, 152);
    texture.update();
    const mat = new StandardMaterial(`sign-material-${text}`, scene);
    mat.diffuseTexture = texture;
    mat.emissiveTexture = texture;
    mat.opacityTexture = texture;
    mat.disableLighting = true;
    mat.backFaceCulling = false;
    const mesh = CreatePlane(`sign-${text}`, { width, height }, scene);
    mesh.position.set(x, y, z);
    mesh.material = mat;
    mesh.isPickable = false;
    return mesh;
  };
  textSign("THE STARLIGHT ARCADE", 6.4, 1.6, 0, 6.05, 10.8);

  // Festival lanterns light up in response to play rather than flashing continuously.
  const waitingLantern = material("festival-lantern-waiting", "#3c5264", 0.12);
  waitingLantern.disableLighting = true;
  const festivalLanterns: Mesh[] = [];
  for (const z of [-1.8, 7.8]) {
    for (const x of [-7, 7]) cylinder("festival-pole", 0.13, 0.13, 4.8, gold, x, 2.4, z);
    for (let i = 0; i <= 6; i++) {
      const x = -7 + i * (14 / 6);
      const y = 4.55 - Math.sin((i / 6) * Math.PI) * 0.7;
      const wire = box("festival-light-wire", 2.4, 0.025, 0.025, gold, x, y + 0.12, z);
      wire.rotation.z = -Math.cos((i / 6) * Math.PI) * 0.15;
      const lantern = sphere("festival-lantern", 0.25, waitingLantern, x, y - 0.12, z, undefined, false);
      lantern.scaling.y = 1.3;
      festivalLanterns.push(lantern);
    }
  }

  // The key sits at its own landmark and is collected by walking towards it.
  const keyLandmark = new TransformNode("golden-key-landmark", scene);
  keyLandmark.position.set(GOLDEN_KEY.x, 0, GOLDEN_KEY.z);
  cylinder("key-garden", 2.5, 2.5, 0.14, stone, 0, 0.09, 0, keyLandmark, 20);
  ring("key-garden-inlay", 2.1, 0.055, gold, 0, 0.18, 0, keyLandmark);
  for (const side of [-1, 1]) {
    cylinder("key-landmark-column", 0.22, 0.16, 2.5, gold, side * 1.1, 1.25, 0.35, keyLandmark);
    sphere("key-landmark-lantern", 0.24, light, side * 1.1, 2.65, 0.35, keyLandmark);
  }
  const goldenKey = new TransformNode("golden-key", scene);
  goldenKey.parent = keyLandmark;
  goldenKey.position.set(0, 1.4, -0.15);
  const keyBow = ring("golden-key-bow", 0.56, 0.12, pickupMaterials.bonus, 0, 0.32, 0, goldenKey);
  keyBow.rotation.x = Math.PI / 2;
  box("golden-key-shaft", 0.11, 0.68, 0.12, pickupMaterials.bonus, 0, -0.22, 0, goldenKey);
  for (const y of [-0.31, -0.48]) box("golden-key-tooth", 0.28, 0.1, 0.12, pickupMaterials.bonus, 0.1, y, 0, goldenKey);
  sphere("golden-key-aura", 1.45, pickupHalos.bonus, 0, 0.03, 0, goldenKey);
  const keyLabel = textSign("THE GOLDEN KEY GARDEN", 3.8, 0.95, GOLDEN_KEY.x, 3.2, GOLDEN_KEY.z + 0.4, "#ffe7a3");
  keyLabel.parent = keyLandmark;
  keyLabel.position.set(0, 3.2, 0.4);

  // Workshop: a real cabinet, glowing screen, big friendly controls and a canopy.
  box("workshop-plinth", 4, 0.18, 2.3, dark, 0, 0.18, 4.3);
  box("workshop-counter", 3.7, 0.2, 1.9, stone, 0, 1.02, 4.3);
  for (const x of [-1.48, 1.48]) box("workshop-leg", 0.18, 0.85, 0.18, gold, x, 0.52, 3.72);
  const cabinet = box("arcade-cabinet", 1.5, 1.95, 0.9, purple, 0, 1.5, 4.6, undefined, false);
  cabinet.isPickable = true;
  cabinet.metadata = { workshop: true };
  const screen = box("arcade-screen", 1.19, 0.9, 0.08, dark, 0, 1.91, 4.08, undefined, false);
  screen.isPickable = true;
  screen.metadata = { workshop: true };
  box("arcade-screen-glow", 0.95, 0.67, 0.015, cyanLight, 0, 1.91, 4.025);
  const screenStar = sphere("screen-emblem", 0.35, light, 0, 1.91, 3.99, undefined, false);
  screenStar.scaling.z = 0.04;
  box("cabinet-marquee", 1.66, 0.25, 0.97, gold, 0, 2.61, 4.52);
  cylinder("cabinet-joystick", 0.08, 0.08, 0.2, dark, -0.39, 1.18, 3.82);
  sphere("cabinet-joystick-top", 0.2, purple, -0.39, 1.31, 3.82);
  sphere("cabinet-button-one", 0.17, cyanLight, 0.31, 1.16, 3.82);
  sphere("cabinet-button-two", 0.17, violetLight, 0.62, 1.16, 3.82);
  textSign("MAKE YOUR OWN GAME", 3.1, 0.78, 0, 3.2, 4.4);
  for (const x of [-2.35, 2.35]) {
    cylinder("workshop-column", 0.32, 0.24, 3.7, stone, x, 1.85, 5.1);
    cylinder("workshop-column-base", 0.7, 0.7, 0.25, gold, x, 0.15, 5.1);
    sphere("workshop-column-lantern", 0.35, light, x, 3.9, 5.1);
  }
  const canopy = box("workshop-awning", 5.5, 0.18, 2.7, purple, 0, 3.78, 5.1);
  canopy.rotation.x = -0.12;
  for (let i = 0; i < 8; i++) box("awning-tassel", 0.55, 0.28, 0.1, i % 2 ? gold : teal, -2.3 + i * 0.65, 3.53, 3.75);

  function tower(x: number, z: number, height: number) {
    cylinder("observatory-base", 3.5, 3.5, 0.3, edge, x, 0.15, z);
    cylinder("observatory-wall", 2.8, 2.8, height, stone, x, height / 2, z);
    cylinder("observatory-roof-rim", 3.25, 3.25, 0.2, gold, x, height, z);
    cylinder("observatory-roof", 3.5, 0.12, 2.1, purple, x, height + 1.05, z);
    sphere("observatory-finial", 0.28, light, x, height + 2.2, z);
    for (let side = 0; side < 4; side++) {
      const a = side * Math.PI / 2;
      const window = box("observatory-window", 0.56, 1, 0.09, cyanLight, x + Math.sin(a) * 1.41, height * 0.62, z + Math.cos(a) * 1.41);
      window.rotation.y = a;
    }
  }
  tower(-11.3, 6.7, 4.8);
  tower(11.7, 6, 6.1);
  function mushroom(x: number, z: number, scale: number, cap: StandardMaterial) {
    cylinder("mushroom-stem", scale * 0.24, scale * 0.13, scale * 0.7, stone, x, scale * 0.35, z);
    const top = sphere("mushroom-cap", scale, cap, x, scale * 0.75, z);
    top.scaling.y = 0.43;
    for (let i = 0; i < 3; i++) {
      const a = i * 2.2;
      const dot = sphere("mushroom-speckle", scale * 0.13, light, x + Math.cos(a) * scale * 0.26, scale * 0.9, z + Math.sin(a) * scale * 0.22);
      dot.scaling.y = 0.25;
    }
  }
  function crystal(x: number, z: number, height: number, mat: StandardMaterial, parent?: TransformNode) {
    const bottom = cylinder("crystal-body", height * 0.37, height * 0.28, height * 0.67, mat, x, height * 0.36, z, parent, 5);
    bottom.rotation.z = -0.12;
    const top = cylinder("crystal-tip", height * 0.28, 0, height * 0.33, mat, x + 0.07, height * 0.85, z, parent, 5);
    top.rotation.z = -0.12;
  }
  for (const [x, z, s] of [[-4, -9, 1.4], [4, -10, 1], [-12, -4, 2], [11, -7, 1.8], [-5, 12, 1.4], [8, 10, 1.2], [12, 0, 1.5], [-12, 0, 0.8]]) {
    mushroom(x, z, s, x < 0 ? purple : teal);
    mushroom(x + 0.8, z + 0.4, s * 0.55, x < 0 ? teal : purple);
  }
  for (const [x, z] of [[-3.8, -6], [4.4, -7], [-11, -7], [11, -2], [-6, 11], [7.5, 10]]) {
    crystal(x, z, 1.2, mineralPurple);
    crystal(x + 0.4, z + 0.2, 0.65, mineralTeal);
    cylinder("crystal-garden", 1.6, 1.6, 0.14, lawn, x, 0.1, z);
  }
  // Lanterns and floating islands give the sky scale without a heavy environment texture.
  for (const [x, z] of [[-3, -7], [3, -7], [-8, 5], [8, 5], [-4, 9], [4, 9]]) {
    cylinder("lantern-post", 0.11, 0.11, 2.4, gold, x, 1.2, z);
    cylinder("lantern-base", 0.5, 0.36, 0.2, edge, x, 0.1, z);
    cylinder("lantern-housing", 0.48, 0.48, 0.6, light, x, 2.5, z, undefined, 6);
    cylinder("lantern-roof", 0.7, 0.1, 0.3, dark, x, 2.93, z, undefined, 6);
    const halo = sphere("lantern-halo", 0.85, softGlow, x, 2.5, z, undefined, false);
    flickers.push({ mesh: halo, base: 1, offset: x + z });
  }
  for (let i = 0; i < 11; i++) {
    const a = i * 2.399;
    const radius = 34 + (i % 3) * 8;
    const x = Math.sin(a) * radius;
    const z = Math.cos(a) * radius;
    const y = -5 + (i % 4) * 3.2;
    cylinder("distant-island", 1.5, 6 + (i % 3), 7, soil, x, y, z, undefined, 6);
    cylinder("distant-island-top", 6 + (i % 3), 6 + (i % 3), 0.5, grass, x, y + 3.6, z, undefined, 6);
    cylinder("distant-spire", 1, 0.05, 4, purple, x, y + 5.9, z, undefined, 6);
    sphere("distant-beacon", 0.3, cyanLight, x, y + 8, z);
  }
  const moon = sphere("crescent-moon", 7, light, -26, 29, 53);
  moon.scaling.z = 0.25;
  for (let i = 0; i < 90; i++) {
    const a = i * 2.39996;
    const height = 14 + ((i * 13) % 53);
    const radius = 50 + ((i * 7) % 35);
    sphere("sky-star", 0.065 + (i % 5) * 0.025, starMaterial, Math.sin(a) * radius, height, Math.cos(a) * radius);
  }

  // Pip is a floating character in the world, rather than a static illustration beside it.
  const pip = new TransformNode("pip", scene);
  pip.position.set(2.2, 1.8, 2.4);
  const pipBody = sphere("pip-head", 0.76, stone, 0, 0.35, 0, pip);
  pipBody.scaling.set(1.1, 0.83, 0.8);
  const pipFace = box("pip-face", 0.62, 0.35, 0.13, dark, 0, 0.37, -0.28, pip);
  pipFace.rotation.x = 0.08;
  sphere("pip-eye-left", 0.085, cyanLight, -0.14, 0.39, -0.36, pip);
  sphere("pip-eye-right", 0.085, cyanLight, 0.14, 0.39, -0.36, pip);
  cylinder("pip-neck", 0.22, 0.22, 0.18, gold, 0, -0.08, 0, pip);
  const pipTorso = cylinder("pip-body", 0.32, 0.52, 0.53, purple, 0, -0.32, 0, pip, 8);
  pipTorso.rotation.z = -0.06;
  sphere("pip-heart", 0.12, light, 0, -0.28, -0.23, pip);
  cylinder("pip-antenna", 0.045, 0.045, 0.22, gold, 0, 0.8, 0, pip);
  sphere("pip-antenna-light", 0.15, cyanLight, 0, 0.97, 0, pip);
  for (const side of [-1, 1]) {
    const arm = sphere("pip-arm", 0.2, teal, side * 0.36, -0.2, -0.03, pip);
    arm.scaling.y = 1.6;
    arm.rotation.z = side * 0.45;
    sphere("pip-foot", 0.17, gold, side * 0.15, -0.66, 0, pip);
  }
  const pipAura = ring("pip-hover-ring", 0.7, 0.035, cyanLight, 0, -0.88, 0, pip);

  // Your sleeve and a small magic compass make first-person identity visible.
  const hand = new TransformNode("your-hand", scene);
  hand.parent = camera;
  hand.position.set(0.47, -0.58, 0.78);
  hand.rotation.z = -0.32;
  const sleeve = cylinder("your-sleeve", 0.24, 0.2, 0.52, avatarMaterial, 0, -0.02, 0, hand);
  sleeve.rotation.x = -0.28;
  const glove = sphere("your-glove", 0.23, skin, 0, 0.29, -0.05, hand);
  const cuff = ring("your-cuff", 0.23, 0.05, gold, 0, 0.21, -0.03, hand);
  const compass = sphere("your-compass", 0.15, cyanLight, 0.01, 0.41, 0.01, hand);
  compass.scaling.y = 0.6;

  // Merge static geometry by material to keep mobile draw calls modest.
  for (const meshes of staticMeshes.values()) {
    if (meshes.length > 1) Mesh.MergeMeshes(meshes, true, true);
  }

  function stopGuidedWalk() {
    destination = null;
    waypoints = [];
    if (guidedWalking) {
      guidedWalking = false;
      events.onWalking(false);
    }
  }
  function resetInput() {
    keys.clear();
    joystick = { x: 0, y: 0 };
    pointer = null;
    stopGuidedWalk();
  }
  function applyPalette() {
    const palette = state.design.palette === "forest"
      ? { sky: "#15362eff", fog: "#28513f", moss: "#35704c", garden: "#57965a", stone: "#d0d0a8", roof: "#2e7761", trim: "#b69955", glow: "#a7e87d", edge: "#36695d", rock: "#253d35", ambient: "#9bc9b8", sun: "#e7f4cb", mineral: "#53716b" }
      : state.design.palette === "sunset"
        ? { sky: "#573649ff", fog: "#865064", moss: "#947762", garden: "#b89b6b", stone: "#eed0ad", roof: "#b55466", trim: "#da926c", glow: "#ffb56b", edge: "#775563", rock: "#482f49", ambient: "#c9a1c0", sun: "#ffbf7d", mineral: "#8a697e" }
        : { sky: "#111b35ff", fog: "#1f2946", moss: "#365c76", garden: "#4e8894", stone: "#d6cdbb", roof: "#8670be", trim: "#419caa", glow: "#62dfd2", edge: "#4d657f", rock: "#293b54", ambient: "#b7c9ff", sun: "#ffe3b8", mineral: "#677098" };
    scene.clearColor = Color4.FromHexString(palette.sky);
    scene.fogColor = Color3.FromHexString(palette.fog);
    grass.diffuseColor = Color3.FromHexString(palette.moss);
    lawn.diffuseColor = Color3.FromHexString(palette.garden);
    stone.diffuseColor = Color3.FromHexString(palette.stone);
    purple.diffuseColor = Color3.FromHexString(palette.roof);
    teal.diffuseColor = Color3.FromHexString(palette.trim);
    edge.diffuseColor = Color3.FromHexString(palette.edge);
    soil.diffuseColor = Color3.FromHexString(palette.rock);
    mineralPurple.diffuseColor = Color3.FromHexString(palette.mineral);
    cyanLight.emissiveColor = Color3.FromHexString(palette.glow).scale(0.85);
    ambient.diffuse = Color3.FromHexString(palette.ambient);
    sunlight.diffuse = Color3.FromHexString(palette.sun);
    avatarMaterial.diffuseColor = Color3.FromHexString(state.avatar.colour);
    const isSprite = state.avatar.kind === "sprite";
    sleeve.setEnabled(!isSprite);
    glove.setEnabled(!isSprite);
    cuff.setEnabled(!isSprite);
    skin.diffuseColor = Color3.FromHexString(state.avatar.kind === "robot" ? "#bdcfda" : "#fff0ce");
    compass.scaling.set(isSprite ? 1.8 : 1, isSprite ? 1.8 : 0.6, isSprite ? 1.8 : 1);
  }
  function createPickup(x: number, z: number, bonus = false) {
    const root = new TransformNode(bonus ? "golden-bonus" : "game-collectible", scene);
    root.position.set(x, 1.17, z);
    const pickupKind = bonus ? "bonus" : state.design.collectible;
    const mat = pickupMaterials[pickupKind];
    if (state.design.collectible === "crystal" && !bonus) {
      crystal(0, 0, 0.85, mat, root);
      root.position.y = 0.8;
    } else if (state.design.collectible === "firefly" && !bonus) {
      sphere("firefly-body", 0.36, mat, 0, 0, 0, root);
      for (const side of [-1, 1]) {
        const wing = sphere("firefly-wing", 0.4, teal, side * 0.22, 0.08, 0, root);
        wing.scaling.set(1, 0.18, 0.65);
        wing.rotation.z = side * 0.3;
      }
    } else {
      for (let i = 0; i < 5; i++) {
        const ray = cylinder("star-point", 0.28, 0, 0.45, mat, Math.sin(i * Math.PI * 0.4) * 0.25, Math.cos(i * Math.PI * 0.4) * 0.25, 0, root, 4);
        ray.rotation.z = -i * Math.PI * 0.4;
      }
      sphere("star-heart", 0.36, mat, 0, 0, 0, root);
    }
    const halo = sphere("collectible-halo", 1.3, pickupHalos[pickupKind], 0, 0.1, 0, root);
    halo.scaling.y = 0.8;
    const orbit = ring("collectible-orbit", 1.1, 0.026, mat, 0, 0.05, 0, root);
    orbit.rotation.x = Math.PI / 2;
    if (bonus) {
      const bonusOrbit = ring("bonus-second-orbit", 1.4, 0.026, mat, 0, 0.05, 0, root);
      bonusOrbit.rotation.x = Math.PI / 3;
    }
    const groundRing = ring("collectible-marker", 1.35, 0.065, mat, 0, -root.position.y + 0.08, 0, root);
    groundRing.rotation.z = 0;
    return { root, position: new Vector3(x, EYE_HEIGHT, z), collected: false, baseY: root.position.y, bonus };
  }
  function refreshPortal() {
    const wasOpen = portalOpen;
    portalOpen = collected >= state.design.target && (state.design.challenge !== "key" || keyFound);
    portalSurface.setEnabled(portalOpen);
    portalGlow.material = portalOpen ? cyanLight : purple;
    lockedGate.setEnabled(state.design.challenge === "key" && !portalOpen);
    const litCount = portalOpen ? festivalLanterns.length : Math.floor((collected / (state.design.target + 1)) * festivalLanterns.length);
    festivalLanterns.forEach((lantern, i) => { lantern.material = i < litCount ? (i % 2 ? cyanLight : light) : waitingLantern; });
    events.onDestination(portalOpen ? "portal" : collected >= state.design.target ? "key" : "collectible");
    return portalOpen && !wasOpen;
  }
  function beginRun() {
    resetInput();
    pickups.forEach((item) => item.root.dispose());
    pickups = [];
    complete = false;
    collected = 0;
    keyFound = false;
    portalOpen = false;
    camera.position.set(0, EYE_HEIGHT, -10);
    camera.rotation.set(0.025, 0, 0);
    portalSurface.setEnabled(false);
    portalGlow.material = state.mode === "play" ? purple : cyanLight;
    keyLandmark.setEnabled(state.mode === "play" && state.design.challenge === "key");
    goldenKey.setEnabled(true);
    goldenKey.position.y = 1.4;
    goldenKey.rotation.y = 0;
    lockedGate.setEnabled(state.mode === "play" && state.design.challenge === "key");
    festivalLanterns.forEach((lantern) => { lantern.material = waitingLantern; });
    if (state.mode === "play") {
      for (let i = 0; i < state.design.target; i++) {
        const [x, z] = ITEM_POSITIONS[Math.floor(i * ITEM_POSITIONS.length / state.design.target)];
        pickups.push(createPickup(x, z));
      }
      if (state.design.bonus) pickups.push(createPickup(10.5, -7.5, true));
      events.onCollect(0);
      events.onDestination("collectible");
      events.onStatus(`Your game is ready. Walk towards a glowing ${state.design.collectible} to collect it.${state.design.challenge === "key" ? " Find the golden key as well to open the locked portal." : ""}`);
    } else {
      events.onDestination("workshop");
      events.onStatus("Walk to the glowing arcade cabinet to create your game.");
    }
  }
  function goToNext() {
    if (state.paused || complete) return;
    keys.clear();
    joystick = { x: 0, y: 0 };
    if (!guidedWalking) {
      guidedWalking = true;
      events.onWalking(true);
    }
    if (state.mode === "explore") {
      destination = WORKSHOP.clone();
      destinationKind = "workshop";
    } else if (collected >= state.design.target && state.design.challenge === "key" && !keyFound) {
      destination = GOLDEN_KEY.clone();
      destinationKind = "key";
    } else if (collected >= state.design.target) {
      destination = PORTAL.clone();
      destinationKind = "portal";
    } else {
      const next = pickups.filter((item) => !item.collected && !item.bonus)
        .sort((a, b) => Vector3.DistanceSquared(a.position, camera.position) - Vector3.DistanceSquared(b.position, camera.position))[0];
      if (next) {
        destination = next.position.clone();
        destinationKind = "collectible";
      }
    }
    waypoints = [];
    if (destination) {
      const target = destination;
      const crossesWorkshop = Array.from({ length: 24 }, (_, i) => Vector3.Lerp(camera.position, target, i / 23))
        .some((point) => Math.abs(point.x) < 2.5 && point.z > 2.8 && point.z < 6);
      if (crossesWorkshop) {
        const side = camera.position.x < -0.5 ? -1 : camera.position.x > 0.5 ? 1 : target.x < 0 ? -1 : 1;
        const nearZ = camera.position.z < 4.5 ? 2.25 : 6.55;
        const farZ = target.z < 4.5 ? 2.25 : 6.55;
        waypoints = [new Vector3(side * 2.9, EYE_HEIGHT, nearZ), new Vector3(side * 2.9, EYE_HEIGHT, farZ), target];
        destination = waypoints.shift() ?? target;
      }
    }
  }
  function toggleGuidedWalk() {
    if (guidedWalking) stopGuidedWalk();
    else goToNext();
  }
  function interact() {
    if (state.paused || state.mode !== "explore") return;
    if (Vector3.Distance(camera.position, WORKSHOP) < 4) events.onInteract();
    else goToNext();
  }
  const isTyping = () => {
    const el = document.activeElement;
    return el instanceof HTMLElement && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (state.paused || isTyping() || event.metaKey || event.ctrlKey || event.altKey) return;
    const key = event.key.toLowerCase();
    if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
      event.preventDefault();
      stopGuidedWalk();
      keys.add(key);
    }
    if (key === "e" && !event.repeat) interact();
  };
  const onKeyUp = (event: KeyboardEvent) => { keys.delete(event.key.toLowerCase()); };
  const onPointerDown = (event: PointerEvent) => {
    if (state.paused || pointer || event.button > 0) return;
    stopGuidedWalk();
    canvas.focus({ preventScroll: true });
    pointer = { id: event.pointerId, startX: event.clientX, startY: event.clientY, x: event.clientX, y: event.clientY, moved: false };
    canvas.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: PointerEvent) => {
    if (!pointer || pointer.id !== event.pointerId || state.paused) return;
    const dx = event.clientX - pointer.x;
    const dy = event.clientY - pointer.y;
    if (Math.abs(event.clientX - pointer.startX) + Math.abs(event.clientY - pointer.startY) > 8) pointer.moved = true;
    camera.rotation.y += dx * (event.pointerType === "mouse" ? 0.003 : 0.004);
    camera.rotation.x = Math.max(-0.8, Math.min(0.8, camera.rotation.x + dy * 0.003));
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    stopGuidedWalk();
  };
  const onPointerUp = (event: PointerEvent) => {
    if (!pointer || pointer.id !== event.pointerId) return;
    const wasTap = !pointer.moved;
    pointer = null;
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    if (state.paused || !wasTap) return;
    if (state.mode === "explore") {
      const rect = canvas.getBoundingClientRect();
      const picked = scene.pick(event.clientX - rect.left, event.clientY - rect.top, (mesh) => Boolean(mesh.metadata?.workshop));
      if (picked?.hit) interact();
      else if (state.guided) goToNext();
    } else if (state.guided) goToNext();
  };
  const onVisibility = () => { if (document.hidden) resetInput(); };
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", resetInput);
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", resetInput);
  document.addEventListener("visibilitychange", onVisibility);
  const resize = new ResizeObserver(() => {
    if (!disposed) {
      engine.resize();
      needsRender = true;
    }
  });
  resize.observe(canvas);
  const onContextLost = (event: Event) => {
    event.preventDefault();
    resetInput();
    events.onError("The 3D view paused because your device needed more memory. Reload the game to return to your saved design.");
  };
  canvas.addEventListener("webglcontextlost", onContextLost);

  applyPalette();
  beginRun();
  let notifiedReady = false;
  engine.runRenderLoop(() => {
    if (disposed || document.hidden || (state.paused && !needsRender)) return;
    const dt = Math.min(engine.getDeltaTime() / 1000, 0.05);
    if (!state.paused) {
      elapsed += dt;
      if (!state.reducedMotion) {
        pip.position.y = 1.8 + Math.sin(elapsed * 1.8) * 0.12;
        pip.rotation.y = Math.sin(elapsed * 0.7) * 0.18;
        pipAura.scaling.setAll(1 + Math.sin(elapsed * 2) * 0.12);
        portalSymbol.position.y = 5.85 + Math.sin(elapsed) * 0.16;
        screenStar.scaling.x = 1 + Math.sin(elapsed * 1.5) * 0.1;
        flickers.forEach(({ mesh, base, offset }) => mesh.scaling.setAll(base + Math.sin(elapsed * 1.4 + offset) * 0.1));
        pickups.forEach((item, i) => {
          if (!item.collected) {
            item.root.position.y = item.baseY + Math.sin(elapsed * 2 + i) * 0.09;
            item.root.rotation.y = elapsed * 0.8;
          }
        });
        if (!keyFound && state.design.challenge === "key") {
          goldenKey.position.y = 1.4 + Math.sin(elapsed * 1.6) * 0.1;
          goldenKey.rotation.y = elapsed * 0.65;
        }
        portalSurface.rotation.z = Math.sin(elapsed * 0.2) * 0.04;
      }
      let horizontal = joystick.x;
      let forward = -joystick.y;
      if (keys.has("w") || keys.has("arrowup")) forward += 1;
      if (keys.has("s") || keys.has("arrowdown")) forward -= 1;
      if (keys.has("d") || keys.has("arrowright")) horizontal += 1;
      if (keys.has("a") || keys.has("arrowleft")) horizontal -= 1;
      const speed = state.design.speed === "swift" ? 4 : 2.8;
      if (destination) {
        const delta = destination.subtract(camera.position);
        delta.y = 0;
        const distance = delta.length();
        if (distance < 0.35) {
          destination = waypoints.shift() ?? null;
          if (!destination && destinationKind === "workshop") {
            stopGuidedWalk();
            events.onInteract();
          }
        } else {
          const targetYaw = Math.atan2(delta.x, delta.z);
          let yawDelta = targetYaw - camera.rotation.y;
          yawDelta = Math.atan2(Math.sin(yawDelta), Math.cos(yawDelta));
          camera.rotation.y += yawDelta * Math.min(1, dt * (state.reducedMotion ? 20 : 4));
          camera.rotation.x *= 1 - Math.min(1, dt * 3);
          camera.position.addInPlace(delta.normalize().scale(Math.min(speed * dt, distance)));
        }
      } else if (horizontal || forward) {
        const magnitude = Math.max(1, Math.hypot(horizontal, forward));
        const sin = Math.sin(camera.rotation.y);
        const cos = Math.cos(camera.rotation.y);
        camera.position.x += ((horizontal * cos + forward * sin) / magnitude) * speed * dt;
        camera.position.z += ((forward * cos - horizontal * sin) / magnitude) * speed * dt;
      }
      const radius = Math.hypot(camera.position.x, camera.position.z);
      if (radius > ARENA_RADIUS) {
        camera.position.x *= ARENA_RADIUS / radius;
        camera.position.z *= ARENA_RADIUS / radius;
      }
      // A small set of authored solid boundaries prevents walking through the cabinet or towers.
      for (const [x, z, radius] of [[-11.3, 6.7, 1.8], [11.7, 6, 1.8], [-2.35, 5.1, 0.42], [2.35, 5.1, 0.42]]) {
        const dx = camera.position.x - x;
        const dz = camera.position.z - z;
        const distance = Math.hypot(dx, dz);
        if (distance < radius) {
          camera.position.x = x + (dx / (distance || 1)) * radius;
          camera.position.z = z + (dz / (distance || 1)) * radius;
        }
      }
      if (Math.abs(camera.position.x) < 2.15 && camera.position.z > 3.05 && camera.position.z < 5.7) {
        const left = camera.position.x + 2.15;
        const right = 2.15 - camera.position.x;
        const front = camera.position.z - 3.05;
        const back = 5.7 - camera.position.z;
        const edge = Math.min(left, right, front, back);
        if (edge === left) camera.position.x = -2.15;
        else if (edge === right) camera.position.x = 2.15;
        else if (edge === front) camera.position.z = 3.05;
        else camera.position.z = 5.7;
      }
      if (state.mode === "play" && state.design.challenge === "key" && !portalOpen && Math.abs(camera.position.x) < 2.1 && camera.position.z > 10.35 && camera.position.z < 11.5) {
        camera.position.z = camera.position.z < 10.9 ? 10.35 : 11.5;
      }
      camera.position.y = EYE_HEIGHT;
      if (state.mode === "play" && !complete) {
        for (const item of pickups) {
          if (!item.collected && Vector3.Distance(camera.position, item.position) < 1.1) {
            item.collected = true;
            item.root.setEnabled(false);
            if (item.bonus) events.onStatus("You found the hidden golden spark. This was your bonus discovery!");
            else {
              collected++;
              events.onCollect(collected);
              if (refreshPortal()) {
                events.onStatus("You collected them all. The glowing portal is open. Step through it to finish your game.");
              } else if (collected >= state.design.target) {
                events.onStatus("You collected every treasure. Your new rule keeps the portal locked until you find the golden key. Walk to the golden key garden to collect it.");
              } else events.onStatus(`You collected ${collected} of ${state.design.target}. Keep exploring to find the next one.`);
            }
            if (!item.bonus && destinationKind === "collectible" && guidedWalking) goToNext();
          }
        }
        if (state.design.challenge === "key" && !keyFound && Vector3.Distance(camera.position, GOLDEN_KEY) < 1.1) {
          keyFound = true;
          goldenKey.setEnabled(false);
          events.onKeyCollect?.();
          const justOpened = refreshPortal();
          const remaining = state.design.target - collected;
          const treasureName = remaining === 1 ? state.design.collectible : state.design.collectible === "firefly" ? "fireflies" : `${state.design.collectible}s`;
          events.onStatus(justOpened
            ? "You found the golden key. You have every treasure too, so the gate is unlocked. Walk through the glowing portal to finish your game."
            : `You found the golden key. Now collect the remaining ${remaining} ${treasureName} to open the portal.`);
          if (destinationKind === "key" && guidedWalking) goToNext();
        }
        if (portalOpen && Vector3.Distance(camera.position, PORTAL) < 1.5) {
          complete = true;
          resetInput();
          events.onComplete();
        }
      }
    }
    scene.render();
    const sceneReady = scene.isReady();
    needsRender = !sceneReady;
    if (!notifiedReady && sceneReady) {
      notifiedReady = true;
      events.onReady();
    }
  });

  return {
    update(next: WorldState) {
      const shouldReset = next.mode !== state.mode || next.runId !== state.runId;
      const becamePaused = next.paused && !state.paused;
      state = next;
      needsRender = true;
      if (becamePaused) resetInput();
      applyPalette();
      if (shouldReset) beginRun();
    },
    setJoystick(x: number, y: number) {
      if (state.paused) return;
      joystick = { x, y };
      if (x || y) stopGuidedWalk();
    },
    goToNext,
    toggleGuidedWalk,
    dispose() {
      disposed = true;
      resetInput();
      resize.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", resetInput);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", resetInput);
      document.removeEventListener("visibilitychange", onVisibility);
      engine.stopRenderLoop();
      scene.dispose();
      engine.dispose();
    },
  };
}

export type ArcadeWorldRuntime = ReturnType<typeof createArcadeWorld>;
