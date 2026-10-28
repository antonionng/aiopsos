/** Shared, bounded rules for the Arcade Apprentice prototype and its downloads. */
export type WorldBand = "explorers" | "inventors" | "creators" | "studio";
export type AvatarLook = {
  kind: "explorer" | "robot" | "sprite";
  colour: string;
};
export type ArcadeDesign = {
  title: string;
  collectible: "star" | "crystal" | "firefly";
  target: number;
  palette: "twilight" | "forest" | "sunset";
  speed: "calm" | "swift";
  bonus: boolean;
  challenge: "collect" | "key";
};

export const DEFAULT_DESIGN: ArcadeDesign = {
  title: "The Lantern Arcade",
  collectible: "star",
  target: 3,
  palette: "twilight",
  speed: "calm",
  bonus: false,
  challenge: "collect",
};

export type SavedArcadeProject = {
  version: 1;
  band: WorldBand;
  avatar: AvatarLook;
  design: ArcadeDesign;
  revisions: number;
  playtests: number;
};

const bands = ["explorers", "inventors", "creators", "studio"] as const;
const legacyDesignKeys = ["title", "collectible", "target", "palette", "speed", "bonus"];
const designKeys = [...legacyDesignKeys, "challenge"];

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasOnlyKeys(value: Record<string, unknown>, keys: string[]): boolean {
  return Object.keys(value).length === keys.length && keys.every((key) => Object.hasOwn(value, key));
}

/** Email addresses, links, phone numbers, UK postcodes and phrases that introduce personal details. */
export function containsPrivateDetails(value: string) {
  return /[\w.+-]+@[\w.-]+\.[a-z]{2,}|https?:\/\/|www\.|(?:\+?\d[\s().-]*){7,}|\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b|\b(?:my (?:full |last |real )?name is|i live (?:at|in)|my (?:address|phone number|password|school) is)\b/iu.test(
    value,
  );
}

function titleIsSafe(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= 60 && !/[<>\u0000-\u001f\u007f]/u.test(value);
}

export function validateArcadeDesign(value: unknown): ArcadeDesign | null {
  if (!record(value) || !hasOnlyKeys(value, designKeys)) return null;
  if (!titleIsSafe(value.title)) return null;
  if (typeof value.collectible !== "string" || !["star", "crystal", "firefly"].includes(value.collectible)) return null;
  if (!Number.isInteger(value.target) || typeof value.target !== "number" || value.target < 3 || value.target > 8) return null;
  if (typeof value.palette !== "string" || !["twilight", "forest", "sunset"].includes(value.palette)) return null;
  if (value.speed !== "calm" && value.speed !== "swift") return null;
  if (typeof value.bonus !== "boolean") return null;
  if (value.challenge !== "collect" && value.challenge !== "key") return null;
  return {
    title: value.title.trim(),
    collectible: value.collectible as ArcadeDesign["collectible"],
    target: value.target,
    palette: value.palette as ArcadeDesign["palette"],
    speed: value.speed,
    bonus: value.bonus,
    challenge: value.challenge,
  };
}

/** Invalid saves are rejected as a unit rather than silently creating earned progress. */
export function restoreArcadeProject(value: unknown): SavedArcadeProject | null {
  if (!record(value) || value.version !== 1 || !bands.includes(value.band as WorldBand)) return null;
  // Earlier local projects predate the key rule. Migrate only their exact known
  // shape here; external designs must still pass the current strict validator.
  const storedDesign = record(value.design) && hasOnlyKeys(value.design, legacyDesignKeys)
    ? { ...value.design, challenge: "collect" }
    : value.design;
  const design = validateArcadeDesign(storedDesign);
  if (!design || !record(value.avatar)) return null;
  if (typeof value.avatar.kind !== "string" || !["explorer", "robot", "sprite"].includes(value.avatar.kind)) return null;
  if (typeof value.avatar.colour !== "string" || !/^#[\da-f]{6}$/i.test(value.avatar.colour)) return null;
  if (!Number.isInteger(value.revisions) || typeof value.revisions !== "number" || value.revisions < 0 || value.revisions > 10_000) return null;
  if (!Number.isInteger(value.playtests) || typeof value.playtests !== "number" || value.playtests < 0 || value.playtests > 10_000) return null;
  return {
    version: 1,
    band: value.band as WorldBand,
    avatar: { kind: value.avatar.kind as AvatarLook["kind"], colour: value.avatar.colour.toLowerCase() },
    design,
    revisions: value.revisions,
    playtests: value.playtests,
  };
}

const counts: Record<string, number> = { three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8 };
const countWords = "(?:\\d+|one|two|three|four|five|six|seven|eight|nine|ten)";
const objectWords = "(?:stars?|crystals?|fireflies|firefly|objects?|things?|items?)";

function pluralObject(design: ArcadeDesign): string {
  return design.collectible === "firefly" ? "fireflies" : `${design.collectible}s`;
}

/** This parser is authored practice. It neither calls AI nor executes supplied code. */
export function applyPracticeRequest(request: string, current: ArcadeDesign): {
  design: ArcadeDesign;
  changes: string[];
  matched: boolean;
  message: string;
} {
  const original = validateArcadeDesign(current) ?? { ...DEFAULT_DESIGN };
  const design = { ...original };
  const changes: string[] = [];
  const guidance = "This is authored practice. Ask for stars, crystals or fireflies, three to eight objects, a forest, sunset or twilight world, a calm or swift walking speed, a bonus treasure, or a key that unlocks the portal.";
  if (typeof request !== "string" || !request.trim() || request.length > 500 || /[<>\u0000-\u0008\u000b\u000c\u000e-\u001f]/u.test(request)) {
    return { design, changes, matched: false, message: guidance };
  }

  // Names are text, not commands. A game called "Forest Stars" must not change its rules.
  const nameCommand = /\b(?:call (?:it|the game)|name (?:it|the game))\s+["“]([^"”]+)["”]/i;
  const title = request.match(nameCommand)?.[1];
  const instructions = request.replace(nameCommand, "");
  // Keep clauses must not accidentally become instructions to change a feature.
  const clauses = instructions.toLowerCase().replace(/[’]/g, "'").split(/[.!?;,]|\b(?:but|then|and)\b/u);
  const commands = clauses.filter((clause) => !/\b(?:keep|leave|do not|don't|do not change|don't change)\b/u.test(clause));
  const positiveCommands = commands.filter((clause) => !/\b(?:no|not|without|remove|disable|off)\b/u.test(clause));
  const text = positiveCommands.join(". ");
  let matched = false;
  let countRejected = false;
  const set = <K extends keyof ArcadeDesign>(key: K, value: ArcadeDesign[K], description: string) => {
    matched = true;
    if (design[key] !== value) {
      design[key] = value;
      changes.push(description);
    }
  };

  // An explicit "call it" command is the only way practice changes a title.
  if (titleIsSafe(title) && !/\b(?:don't|do not)\s+(?:call|name)\b/i.test(request)) set("title", title.trim(), `Your game is now called “${title.trim()}”.`);

  for (const clause of positiveCommands) {
    const appearances = [...clause.matchAll(/\b(stars?|crystals?|fireflies|firefly)\b/gu)];
    const last = appearances.at(-1)?.[1];
    if (last && !/\bbonus\b/u.test(clause)) {
      const collectible = last.startsWith("star") ? "star" : last.startsWith("crystal") ? "crystal" : "firefly";
      set("collectible", collectible, `You now collect ${collectible === "firefly" ? "fireflies" : `${collectible}s`}.`);
    }
  }

  const countMatches = [...text.matchAll(new RegExp(`\\b(${countWords})\\s+${objectWords}\\b`, "gu"))];
  const explicitCount = text.match(new RegExp(`\\b(?:collect|find|gather|catch|target(?: of)?|total(?: of)?)\\s+(${countWords})\\b`, "u"));
  const countToken = countMatches.at(-1)?.[1] ?? explicitCount?.[1];
  if (countToken) {
    const target = counts[countToken] ?? Number(countToken);
    if (Number.isInteger(target) && target >= 3 && target <= 8) set("target", target, `Your game now asks players to collect ${target} objects.`);
    else countRejected = true;
  }

  const themes = [...text.matchAll(/\b(twilight|purple|violet|forest|woodland|green|sunset|orange)\b/gu)];
  const theme = themes.at(-1)?.[1];
  if (theme && !/\b(?:no|without|remove)\s+(?:a\s+)?(?:twilight|purple|violet|forest|woodland|green|sunset|orange)\b/u.test(text)) {
    const palette = ["forest", "woodland", "green"].includes(theme) ? "forest" : ["sunset", "orange"].includes(theme) ? "sunset" : "twilight";
    set("palette", palette, `Your game now takes place in a ${palette} world.`);
  }
  if (/\b(?:slow(?:er|ly)?|calm|gentle|gently)\b/u.test(text)) set("speed", "calm", "You now move at a calm walking speed.");
  else if (/\b(?:fast(?:er)?|quick(?:er|ly)?|swift|speed up)\b/u.test(text)) set("speed", "swift", "You now move at a swift walking speed.");

  for (const clause of commands) {
    if (!/\bbonus\b/u.test(clause)) continue;
    const bonus = !/\b(?:no|without|remove|disable|off)\b/u.test(clause);
    set("bonus", bonus, bonus ? "You can now discover an optional golden bonus treasure." : "The optional bonus treasure has been removed.");
  }
  for (const clause of commands) {
    const mentionsKey = /\bkeys?\b/u.test(clause);
    const collectOnly = /\b(?:collect(?:ion)?\s+only|only\s+collect)\b/u.test(clause);
    if (!mentionsKey && !collectOnly) continue;
    const needsKey = mentionsKey && !/\b(?:no|not|without|remove|disable|off)\b/u.test(clause) && !collectOnly;
    set("challenge", needsKey ? "key" : "collect", needsKey
      ? "Players must now find the golden key as well as the treasure before the portal opens."
      : "Players can now open the portal by collecting the treasure, without finding a key.");
  }
  const countMessage = countRejected ? " The number to collect must be between three and eight, so I kept your previous number." : "";
  return {
    design,
    changes,
    matched,
    message: changes.length
      ? `Your instructions changed this practice game. Step inside to see how it plays.${countMessage}`
      : matched
        ? `Your game already has those supported settings. Try it or ask for something different.${countMessage}`
        : `${guidance}${countMessage}`,
  };
}

export function getDesignInstructions(design: ArcadeDesign): string[] {
  const checked = validateArcadeDesign(design) ?? DEFAULT_DESIGN;
  return [
    `Explore a ${checked.palette} world in first person.`,
    `Collect ${checked.target} ${pluralObject(checked)}.`,
    checked.challenge === "key"
      ? "Find the golden key as well as the treasure to open the portal."
      : "The portal opens when you have collected all the treasure.",
    "Walk through the open portal to finish your game.",
    `Move at a ${checked.speed} walking speed.`,
    checked.bonus ? "Find the optional golden bonus treasure if you want an extra discovery." : "This version has no optional bonus treasure.",
  ];
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
}

/** A fixed local game engine consumes validated design data. No generated code runs. */
export function createArcadeDownload(value: ArcadeDesign): string {
  const design = validateArcadeDesign(value);
  if (!design) throw new Error("The game design is not valid.");
  const json = JSON.stringify(design).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="color-scheme" content="dark">
<title>${escapeHtml(design.title)}</title>
<style>
*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#151c36;color:#fff;font-family:system-ui,sans-serif}button{font:inherit;color:inherit;cursor:pointer;touch-action:none;min-height:48px}button:focus-visible{outline:3px solid #fff;outline-offset:4px}canvas{display:block;width:100%;height:100%;touch-action:none}#hud{position:fixed;top:max(14px,env(safe-area-inset-top));left:16px;right:16px;pointer-events:none;text-shadow:0 2px 6px #000}#hud h1{font-size:clamp(18px,4vw,26px);margin:0 0 6px}#status{display:inline-block;font-size:14px;padding:8px 12px;background:#101728dd;border:1px solid #ffffff40;border-radius:14px}#tip{position:fixed;bottom:calc(164px + env(safe-area-inset-bottom));left:16px;right:16px;text-align:center;font-size:14px;text-shadow:0 2px 6px #000;pointer-events:none}#controls{position:fixed;bottom:max(18px,env(safe-area-inset-bottom));left:16px;display:grid;grid-template-columns:repeat(3,52px);gap:6px}#controls button{height:52px;background:#162544dd;border:1px solid #ffffff70;border-radius:15px;font-size:24px}#controls button[data-held]{background:#6b59bc}#forward{grid-column:2}#left{grid-row:2}#back{grid-row:2}#right{grid-row:2}#guide{position:fixed;bottom:calc(82px + env(safe-area-inset-bottom));right:16px;max-width:calc(100vw - 214px);border:1px solid #ffffff70;border-radius:14px;background:#b4e7d6;color:#102b28;padding:10px 14px;font-size:14px;font-weight:650}#restart{position:fixed;bottom:max(22px,env(safe-area-inset-bottom));right:16px;border:1px solid #ffffff70;border-radius:14px;background:#162544dd;padding:10px 18px}#finish{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:#0e182bbd;padding:20px}#finish[hidden]{display:none}#finish article{max-width:420px;background:#1b2844;border:1px solid #ffffff60;border-radius:24px;padding:26px;text-align:center}#finish button{border:0;background:#c3afff;color:#211c3c;border-radius:12px;padding:12px 24px}#finish h2{margin-top:0}@media(max-height:450px){#tip{bottom:20px;left:200px;right:145px}#controls{grid-template-columns:repeat(3,44px)}#controls button{height:44px;min-height:44px}#hud h1{font-size:18px}}
</style>
</head>
<body>
<canvas id="world" aria-label="Your first-person collection game. Use the arrow keys to move and turn."></canvas>
<header id="hud"><h1>${escapeHtml(design.title)}</h1><div id="status" role="status" aria-live="polite"></div></header>
<p id="tip">Walk towards the glowing objects. Drag the view to look around.</p>
<nav id="controls" aria-label="Movement controls"><button id="forward" data-key="ArrowUp" aria-label="Walk forwards">↑</button><button id="left" data-key="ArrowLeft" aria-label="Turn left">↶</button><button id="back" data-key="ArrowDown" aria-label="Walk backwards">↓</button><button id="right" data-key="ArrowRight" aria-label="Turn right">↷</button></nav>
<button id="guide">Walk to the next treasure</button>
<button id="restart">Restart</button>
<section id="finish" hidden><article><h2>You made a playable game.</h2><p>${design.challenge === "key" ? "You collected the treasure, found the key and opened the portal." : "You collected the treasure and opened the portal."} Play again or return to Wonderlab to change your design.</p><button id="again">Play again</button></article></section>
<script>
"use strict";
const design = ${json};
const canvas=document.getElementById("world"),ctx=canvas.getContext("2d"),status=document.getElementById("status"),tip=document.getElementById("tip"),finish=document.getElementById("finish");
const colours={twilight:["#111b3e","#7066a8","#273b49","#be96ff"],forest:["#18362d","#74aa93","#224d3c","#b7f095"],sunset:["#4c2864","#eea376","#64463e","#ffd06b"]}[design.palette];
const keys=new Set(),objects=[],gate={x:0,z:15},keyTreasure={x:7,z:12,taken:false},guide=document.getElementById("guide");
let x=0,z=0,yaw=0,won=false,found=0,bonusFound=false,keyFound=false,guided=false,previous=0,w=0,h=0,drag=null,lastMessage="";
function portalOpen(){return found===design.target&&(design.challenge!=="key"||keyFound)}
function nextTarget(){return objects.find(o=>!o.taken&&!o.bonus)||(design.challenge==="key"&&!keyFound?keyTreasure:gate)}
function updateStatus(){
  const name=design.collectible==="firefly"?"fireflies":design.collectible+"s";
  const message=found+" / "+design.target+" "+name+(design.challenge==="key"?(keyFound?" · Key found":" · Find the key"):"")+(bonusFound?" · Bonus found":"")+(portalOpen()?" · Portal open":"");
  if(message!==lastMessage){status.textContent=message;lastMessage=message}
  guide.textContent=guided?"Stop walking":found<design.target?"Walk to the next treasure":design.challenge==="key"&&!keyFound?"Walk to the golden key":"Walk through the portal";
  guide.setAttribute("aria-pressed",String(guided));
  tip.textContent=portalOpen()?"The portal is open. Walk through its glowing ring to finish.":found===design.target?"You have all the treasure. Find the golden key to unlock the portal.":design.challenge==="key"?"Collect the glowing treasure and find the golden key. Walk up to them to pick them up.":"Walk towards the glowing objects. Drag the view to look around.";
}
function reset(){
  x=0;z=0;yaw=0;won=false;found=0;bonusFound=false;keyFound=false;guided=false;keys.clear();keyTreasure.taken=false;objects.length=0;
  for(let i=0;i<design.target;i++){const a=-1.1+i*2.2/Math.max(1,design.target-1),r=5+(i%3)*2.5;objects.push({x:Math.sin(a)*r,z:Math.cos(a)*r+2,taken:false,bonus:false})}
  if(design.bonus)objects.push({x:-8,z:10,taken:false,bonus:true});finish.hidden=true;updateStatus();
}
function size(){w=innerWidth;h=innerHeight;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
function project(px,pz,py){const dx=px-x,dz=pz-z,side=dx*Math.cos(yaw)-dz*Math.sin(yaw),depth=dx*Math.sin(yaw)+dz*Math.cos(yaw);if(depth<0.15)return null;const f=Math.min(w,h)*0.9;return{x:w/2+side*f/depth,y:h*0.48+(1.5-py)*f/depth,scale:f/depth,depth}}
function line(ax,az,bx,bz){const a=project(ax,az,0),b=project(bx,bz,0);if(!a||!b)return;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}
function gem(p,bonus,time){const r=Math.min(p.scale*.27,65),cy=p.y+Math.sin(time*0.002+p.depth)*4;ctx.save();ctx.translate(p.x,cy);ctx.shadowColor=bonus?"#ffe49b":colours[3];ctx.shadowBlur=25;ctx.fillStyle=bonus?"#ffe49b":colours[3];ctx.beginPath();if(design.collectible==="firefly"&&!bonus){ctx.ellipse(0,0,r*.55,r*.7,0,0,Math.PI*2);ctx.fill();ctx.fillStyle="#fff7";ctx.beginPath();ctx.ellipse(-r*.6,-r*.2,r*.65,r*.35,-.6,0,Math.PI*2);ctx.ellipse(r*.6,-r*.2,r*.65,r*.35,.6,0,Math.PI*2)}else if(design.collectible==="crystal"&&!bonus){ctx.moveTo(0,-r);ctx.lineTo(r*.65,0);ctx.lineTo(0,r);ctx.lineTo(-r*.65,0);ctx.closePath()}else{for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.46:r;const px=Math.cos(a)*rr,py=Math.sin(a)*rr;if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py)}ctx.closePath()}ctx.fill();ctx.restore()}
function drawKey(p,time){const r=Math.min(p.scale*.4,70);ctx.save();ctx.translate(p.x,p.y+Math.sin(time*.002)*4);ctx.strokeStyle="#ffe087";ctx.lineWidth=Math.max(3,r*.18);ctx.lineCap="round";ctx.shadowColor="#ffcc5b";ctx.shadowBlur=22;ctx.beginPath();ctx.arc(-r*.45,0,r*.36,0,Math.PI*2);ctx.moveTo(-r*.08,0);ctx.lineTo(r*.9,0);ctx.moveTo(r*.5,0);ctx.lineTo(r*.5,r*.28);ctx.moveTo(r*.85,0);ctx.lineTo(r*.85,r*.28);ctx.stroke();ctx.restore()}
function draw(time){
  const sky=ctx.createLinearGradient(0,0,0,h*.58);sky.addColorStop(0,colours[0]);sky.addColorStop(1,colours[1]);ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);ctx.fillStyle=colours[2];ctx.fillRect(0,h*.48,w,h);ctx.strokeStyle="#ffffff13";ctx.lineWidth=1;
  for(let i=-24;i<=24;i+=2){line(i,-20,i,24);line(-24,i,24,i)}
  const visible=objects.filter(o=>!o.taken).map(o=>({kind:"treasure",o,p:project(o.x,o.z,1)}));
  if(design.challenge==="key"&&!keyFound)visible.push({kind:"key",o:keyTreasure,p:project(keyTreasure.x,keyTreasure.z,1.3)});
  const things=visible.filter(v=>v.p).sort((a,b)=>b.p.depth-a.p.depth),gp=project(gate.x,gate.z,1.6);
  if(gp){ctx.save();ctx.translate(gp.x,gp.y);ctx.lineWidth=Math.max(3,gp.scale*.12);ctx.strokeStyle=portalOpen()?"#aaffd6":"#9b8eac";ctx.shadowColor=ctx.strokeStyle;ctx.shadowBlur=25;ctx.beginPath();ctx.ellipse(0,0,gp.scale*.65,gp.scale*1.2,0,0,Math.PI*2);ctx.stroke();ctx.fillStyle="#101728bb";ctx.fill();ctx.restore()}
  for(const v of things){if(v.kind==="key")drawKey(v.p,time);else gem(v.p,v.o.bonus,time)}
  ctx.fillStyle="#ffffff99";ctx.beginPath();ctx.arc(w/2,h/2,3,0,Math.PI*2);ctx.fill();
}
function frame(time){
  const dt=Math.min((time-previous)/1000||0,.05);previous=time;
  if(!won){
    const speed=design.speed==="swift"?5:3;
    if(guided){const target=nextTarget(),dx=target.x-x,dz=target.z-z,distance=Math.hypot(dx,dz),step=Math.min(distance,speed*dt);yaw=Math.atan2(dx,dz);if(distance>.01){x+=dx/distance*step;z+=dz/distance*step}}
    else{if(keys.has("ArrowLeft")||keys.has("a"))yaw-=dt*1.7;if(keys.has("ArrowRight")||keys.has("d"))yaw+=dt*1.7;const move=(keys.has("ArrowUp")||keys.has("w")?1:0)-(keys.has("ArrowDown")||keys.has("s")?1:0);x=Math.max(-14,Math.min(14,x+Math.sin(yaw)*move*dt*speed));z=Math.max(-6,Math.min(20,z+Math.cos(yaw)*move*dt*speed))}
    for(const o of objects){if(!o.taken&&Math.hypot(o.x-x,o.z-z)<.8){o.taken=true;if(o.bonus)bonusFound=true;else found++;updateStatus()}}
    if(design.challenge==="key"&&!keyFound&&Math.hypot(keyTreasure.x-x,keyTreasure.z-z)<.8){keyFound=true;keyTreasure.taken=true;updateStatus()}
    if(portalOpen()&&Math.hypot(gate.x-x,gate.z-z)<1.1){won=true;guided=false;keys.clear();finish.hidden=false;document.getElementById("again").focus()}
  }
  draw(time);requestAnimationFrame(frame);
}
function startManual(){if(guided){guided=false;updateStatus()}}
addEventListener("keydown",e=>{if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","w","a","s","d"].includes(e.key)&&e.target.tagName!=="BUTTON"){e.preventDefault();startManual();keys.add(e.key)}});
addEventListener("keyup",e=>keys.delete(e.key));
function clearInput(){keys.clear();drag=null;guided=false;updateStatus();document.querySelectorAll("[data-held]").forEach(b=>b.removeAttribute("data-held"))}
addEventListener("blur",clearInput);document.addEventListener("visibilitychange",()=>{if(document.hidden)clearInput()});
for(const b of document.querySelectorAll("[data-key]")){b.addEventListener("pointerdown",e=>{e.preventDefault();startManual();keys.add(b.dataset.key);b.setAttribute("data-held","");b.setPointerCapture(e.pointerId)});for(const event of ["pointerup","pointercancel","lostpointercapture"])b.addEventListener(event,()=>{keys.delete(b.dataset.key);b.removeAttribute("data-held")});b.addEventListener("keydown",e=>{if(e.key===" "||e.key==="Enter"){e.preventDefault();startManual();keys.add(b.dataset.key)}});b.addEventListener("keyup",e=>{if(e.key===" "||e.key==="Enter")keys.delete(b.dataset.key)})}
canvas.addEventListener("pointerdown",e=>{drag={id:e.pointerId,x:e.clientX};canvas.setPointerCapture(e.pointerId)});canvas.addEventListener("pointermove",e=>{if(drag&&drag.id===e.pointerId){yaw+=(e.clientX-drag.x)*.006;drag.x=e.clientX}});for(const event of ["pointerup","pointercancel","lostpointercapture"])canvas.addEventListener(event,()=>drag=null);
guide.onclick=()=>{if(won)return;keys.clear();guided=!guided;updateStatus()};
document.getElementById("restart").onclick=()=>{reset();document.activeElement.blur()};document.getElementById("again").onclick=()=>{reset();document.activeElement.blur()};addEventListener("resize",size);size();reset();requestAnimationFrame(frame);
</script>
</body>
</html>`;
}
