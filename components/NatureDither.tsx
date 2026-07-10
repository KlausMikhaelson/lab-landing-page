"use client";

/**
 * NatureDither — a dawn nature scene (sky, sun, layered mountains, a meadow and
 * wind-swaying flowers) drawn entirely in a fragment shader, then quantized with
 * an 8x8 Bayer ordered-dither so the whole picture resolves into colored DOTS.
 *
 * The dither is the same technique as trytokenwrap's <Dither/>; here it runs over
 * a full-color scene instead of a single wave, so every element keeps its own
 * color ("color based on what it is") while sharing the dotted look.
 */

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = /* glsl */ `
precision highp float;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
precision highp float;
uniform vec2  resolution;
uniform float time;
uniform float hour;        // viewer's local time of day, 0..24
uniform float pixelSize;   // size of each dot, in device pixels
uniform float colorNum;    // quantization levels per channel

// ---------- hash / value-noise / fbm -------------------------------------
float hash11(float p){
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}
float hash21(vec2 p){
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float vnoise(vec2 p){
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++){
    v += a * vnoise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}
// ridged fbm: sharp, mountain-like silhouettes (peaks instead of rolling hills)
float ridge(float x, float seed){
  float v = 0.0, a = 0.5, f = 1.0;
  for (int i = 0; i < 4; i++){
    v += a * (1.0 - abs(vnoise(vec2(x * f + seed, seed)) * 2.0 - 1.0));
    f *= 2.0;
    a *= 0.5;
  }
  return v;
}

// ---------- 8x8 Bayer ordered dither -------------------------------------
// Arithmetic Bayer (no local arrays / dynamic indexing) so it compiles on
// strict WebGL implementations too — Safari/WebKit rejects the table form.
float bayer2(vec2 a){
  a = floor(a);
  return fract(a.x * 0.5 + a.y * a.y * 0.75);
}
float bayer4(vec2 a){ return bayer2(0.5 * a) * 0.25 + bayer2(a); }
float bayer8(vec2 a){ return bayer4(0.5 * a) * 0.25 + bayer2(a); }
vec3 dither(vec2 fragCoord, vec3 color, float ps){
  vec2 sc = floor(fragCoord / ps);
  // Bayer + a little static noise: breaks the diagonal Bayer streaks that
  // ordered dithering otherwise leaves on smooth gradients (the sky).
  float threshold = bayer8(sc) - 0.5 + (hash21(sc) - 0.5) * 0.35;
  float steps = colorNum - 1.0;
  color += threshold * (1.0 / steps);
  color = clamp(color, 0.0, 1.0);
  return floor(color * steps + 0.5) / steps;
}

// ---------- scene --------------------------------------------------------
// terrain lighting: dim + blue-shift as the sun drops below the horizon
vec3 applyLight(vec3 c, float light, float night){
  c *= light;
  return mix(c, c * vec3(0.55, 0.62, 0.90), night * 0.55);
}

// blossom color chosen per-flower: red / yellow / white / purple / pink
vec3 flowerColor(float r){
  r = fract(r * 5.0);
  if (r < 0.20) return vec3(0.93, 0.26, 0.30);
  if (r < 0.40) return vec3(0.99, 0.79, 0.24);
  if (r < 0.60) return vec3(0.97, 0.97, 0.99);
  if (r < 0.80) return vec3(0.72, 0.42, 0.90);
  return vec3(0.99, 0.52, 0.74);
}

void main(){
  vec2 fc = gl_FragCoord.xy;
  vec2 p  = fc / resolution;          // 0..1, y up
  float aspect = resolution.x / resolution.y;
  float ax = p.x * aspect;            // aspect-corrected x for round shapes
  float T = time;

  // --- time of day: sun/moon + sky follow the viewer's local clock -----
  float t = hour;                              // 0..24 local time
  float sunAlt = -cos(t / 24.0 * 6.2831853);   // -1 midnight, 0 at 6h/18h, +1 noon
  float light  = 0.24 + 0.76 * smoothstep(-0.18, 0.32, sunAlt);
  float night  = smoothstep(0.10, -0.28, sunAlt);
  float day    = smoothstep(-0.05, 0.35, sunAlt);
  float horizonY = 0.42;

  // sky palette: night -> twilight (sun near horizon) -> day
  vec3 topNight = vec3(0.03, 0.04, 0.13);
  vec3 horNight = vec3(0.07, 0.08, 0.20);
  vec3 topTwi   = vec3(0.28, 0.20, 0.45);
  vec3 horTwi   = vec3(0.99, 0.52, 0.30);
  vec3 topDay   = vec3(0.26, 0.52, 0.86);
  vec3 horDay   = vec3(0.82, 0.90, 0.98);
  float toTwi = smoothstep(-0.35, 0.0, sunAlt);
  float toDay = smoothstep(0.0, 0.35, sunAlt);
  vec3 skyTop = mix(mix(topNight, topTwi, toTwi), topDay, toDay);
  vec3 skyHor = mix(mix(horNight, horTwi, toTwi), horDay, toDay);
  vec3 col = mix(skyHor, skyTop, smoothstep(0.30, 1.0, p.y));

  // stars: each twinkles on its own random phase + speed, mostly dim with
  // occasional flares, so different stars sparkle at different moments
  if (night > 0.01 && p.y > horizonY - 0.05){
    vec2 sg = floor(fc / 3.0);
    if (hash21(sg) > 0.996){
      float ph  = hash21(sg + 17.3);              // independent phase
      float spd = 0.4 + 1.8 * hash21(sg + 91.7);  // independent speed
      float tw  = 0.5 + 0.5 * sin(T * spd + ph * 6.2831853);
      tw = 0.25 + 0.75 * pow(tw, 4.0);            // spiky: dim, brief flares
      vec3 tint = mix(vec3(0.82, 0.90, 1.0), vec3(1.0, 0.95, 0.85), hash21(sg + 5.1));
      col += tint * night * tw;
    }
  }

  // drifting clouds (fade out at night)
  float cl = fbm(vec2(ax * 2.0 + T * 0.02, p.y * 3.0));
  cl = smoothstep(0.55, 0.95, cl) * smoothstep(0.34, 1.0, p.y);
  col = mix(col, mix(vec3(0.55, 0.55, 0.65), vec3(1.0, 0.92, 0.86), day),
            cl * (0.12 + 0.28 * day));

  // --- sun: rises east (6h) -> noon overhead -> sets west (18h) ---------
  float sunX   = (t - 6.0) / 12.0;              // 0 at sunrise .. 1 at sunset
  float sunY   = horizonY + sunAlt * 0.48;
  float sunVis = smoothstep(-0.12, 0.04, sunAlt);
  float sd = distance(vec2(ax, p.y), vec2(sunX * aspect, sunY));
  col += vec3(1.0, 0.60, 0.35) * smoothstep(0.5, 0.0, sd) * 0.35 * sunVis;
  col = mix(col, vec3(1.0, 0.96, 0.82), smoothstep(0.085, 0.075, sd) * sunVis);

  // --- moon: up when the sun is down -----------------------------------
  float moonX   = t >= 18.0 ? (t - 18.0) / 12.0 : (t + 6.0) / 12.0;
  float moonAlt = -sunAlt;
  float moonY   = horizonY + moonAlt * 0.48;
  float moonVis = smoothstep(-0.05, 0.12, moonAlt);
  float md = distance(vec2(ax, p.y), vec2(moonX * aspect, moonY));
  col += vec3(0.70, 0.80, 1.0) * smoothstep(0.32, 0.0, md) * 0.16 * moonVis;
  vec3 moonCol = vec3(0.92, 0.93, 0.98) * (0.85 + 0.15 * fbm(vec2(ax * 40.0, p.y * 40.0)));
  col = mix(col, moonCol, smoothstep(0.07, 0.062, md) * moonVis);

  // --- mountains: three ridgelines, far -> near ------------------------
  float ground = 0.34;
  float hFar  = 0.44 + 0.10 * ridge(ax * 1.1, 10.0);
  float hMid  = 0.40 + 0.15 * ridge(ax * 1.7, 40.0);
  float hNear = 0.36 + 0.23 * ridge(ax * 2.4, 70.0);

  if (p.y < hFar)  col = applyLight(vec3(0.50, 0.48, 0.63), light, night);
  if (p.y < hMid)  col = applyLight(vec3(0.33, 0.31, 0.52), light, night);
  if (p.y < hNear){
    vec3 m = vec3(0.18, 0.17, 0.34);
    // snow caps near the top of the tall peaks
    float cap = smoothstep(hNear - 0.07, hNear - 0.01, p.y);
    m = mix(m, vec3(0.88, 0.89, 0.97), cap * smoothstep(0.46, 0.54, hNear));
    col = applyLight(m, light, night);
  }

  // --- meadow ----------------------------------------------------------
  if (p.y < ground){
    float g = p.y / ground;
    vec3 grass = mix(vec3(0.13, 0.28, 0.11), vec3(0.37, 0.53, 0.24), g);
    grass *= 0.9 + 0.1 * fbm(vec2(ax * 8.0 - T * 0.12, p.y * 8.0)); // wind ripple
    col = applyLight(grass, light, night);
  }

  // --- flowers: domain-repeated field, swaying in the wind -------------
  // each bloom = swaying stem + a side leaf + radiating petals (petal count
  // and size vary by "species") + a contrasting pistil center.
  float band = 0.34;
  if (p.y < band){
    float cw = 0.05;                 // cell width in aspect-x
    for (int k = -1; k <= 1; k++){
      float cell = floor(ax / cw) + float(k);
      float r  = hash11(cell * 1.7);
      float r2 = hash11(cell * 3.1 + 5.0);
      float r3 = hash11(cell * 2.3 + 11.0);
      if (r < 0.30) continue;        // sparsity: not every cell blooms

      float cx    = (cell + 0.5 + (r2 - 0.5) * 0.4) * cw;
      float stemH = 0.11 + r * 0.14; // blossom height above the ground
      float gust  = fbm(vec2(cell * 0.5, T * 0.25));
      float hn    = clamp(p.y / stemH, 0.0, 1.0);
      float sway  = (0.02 + 0.03 * gust) * sin(T * 1.6 + cell * 2.1) * hn * hn;
      float sx    = cx + sway;

      // stem
      float onStem = smoothstep(0.0032, 0.0, abs(ax - sx))
                   * step(0.012, p.y) * step(p.y, stemH);
      col = mix(col, applyLight(vec3(0.14, 0.32, 0.14), light, night), onStem);

      // one leaf, offset to a side, swaying a bit less than the tip
      float leafSide = r3 < 0.5 ? -1.0 : 1.0;
      float leafY    = stemH * 0.5;
      float lsway    = sway * 0.5;
      vec2  lq = vec2(ax - (cx + lsway + leafSide * 0.013), p.y - leafY);
      lq.y *= 3.0;                    // flatten into a leaf shape
      float leaf = smoothstep(0.013, 0.009, length(lq)) * step(0.012, p.y);
      col = mix(col, applyLight(vec3(0.17, 0.41, 0.18), light, night), leaf);

      // blossom: radiating petals via an angular scallop of the radius
      vec2  q   = vec2(ax - sx, p.y - stemH);
      float rad = length(q);
      float ang = atan(q.y, q.x);
      float baseR  = 0.024 + r3 * 0.013;                    // 0.024..0.037
      float petalN = r < 0.55 ? 5.0 : (r < 0.80 ? 6.0 : 8.0); // species
      float scallop  = 0.5 + 0.5 * cos(ang * petalN);
      float boundary = baseR * (0.32 + 0.68 * scallop);
      float petalMask = smoothstep(boundary, boundary - 0.006, rad);

      // shade each petal: deep near the center, bright at the tip
      vec3 petal = flowerColor(r2);
      vec3 shade = mix(petal * 0.55, petal, smoothstep(baseR * 0.22, boundary, rad));
      col = mix(col, applyLight(shade, light, night), petalMask);

      // pistil center (amber for most; darker for yellow petals)
      float fb = fract(r2 * 5.0);
      vec3  centerCol = (fb >= 0.2 && fb < 0.4) ? vec3(0.82, 0.46, 0.16)
                                                : vec3(0.99, 0.83, 0.30);
      float centerR = baseR * 0.32;
      col = mix(col, applyLight(centerCol, light, night), smoothstep(centerR, centerR - 0.004, rad));
    }
  }

  // --- resolve everything into dots ------------------------------------
  // uniform fine dots (pixelSize already scaled by device pixel ratio)
  col = dither(fc, col, pixelSize);
  gl_FragColor = vec4(col, 1.0);
}
`;

interface SceneMeshProps {
  pixelSize: number;
  colorNum: number;
  motion: boolean;
  /** if set, freeze the scene at this hour instead of the live clock */
  hourOverride: number | null;
}

function SceneMesh({ pixelSize, colorNum, motion, hourOverride }: SceneMeshProps) {
  const { viewport, size, gl } = useThree();
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      time: new THREE.Uniform(6.0),
      hour: new THREE.Uniform(12.0),
      resolution: new THREE.Uniform(new THREE.Vector2(1, 1)),
      pixelSize: new THREE.Uniform(pixelSize),
      colorNum: new THREE.Uniform(colorNum),
    }),
    [] // created once; kept in sync in useFrame
  );

  useEffect(() => {
    if (!matRef.current) return;
    const dpr = gl.getPixelRatio();
    matRef.current.uniforms.resolution.value.set(
      Math.floor(size.width * dpr),
      Math.floor(size.height * dpr)
    );
  }, [size, gl]);

  useFrame(({ clock }) => {
    const mat = matRef.current;
    if (!mat) return;
    if (motion) mat.uniforms.time.value = clock.getElapsedTime() + 6.0;
    // viewer's local time of day drives the sun/moon and lighting
    // (a ?hour=N query param can pin it for previewing any time of day)
    if (hourOverride !== null) {
      mat.uniforms.hour.value = hourOverride;
    } else {
      const now = new Date();
      mat.uniforms.hour.value =
        now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
    }
    // render at native resolution but keep a constant on-screen dot size
    mat.uniforms.pixelSize.value = pixelSize * gl.getPixelRatio();
    mat.uniforms.colorNum.value = colorNum;
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

function fmtHour(h: number) {
  const hh = Math.floor(h) % 24;
  const mm = Math.floor((h - Math.floor(h)) * 60);
  const ampm = hh < 12 ? "AM" : "PM";
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${h12}:${mm.toString().padStart(2, "0")} ${ampm}`;
}

export interface NatureDitherProps {
  /** dot size in device pixels (bigger = chunkier dots) */
  pixelSize?: number;
  /** color levels per channel (lower = more posterized) */
  colorNum?: number;
  /** show the time-of-day preview control */
  controls?: boolean;
}

export default function NatureDither({
  pixelSize = 2,
  colorNum = 6,
  controls = false,
}: NatureDitherProps) {
  const [motion, setMotion] = useState(true);
  const [manualHour, setManualHour] = useState(12);
  const [live, setLive] = useState(true);

  // reduced-motion + initial time (a ?hour=N query param pins the preview)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotion(!mq.matches);
    update();
    mq.addEventListener("change", update);

    const raw = new URLSearchParams(window.location.search).get("hour");
    const h = raw === null ? NaN : Number(raw);
    if (Number.isFinite(h)) {
      setManualHour(((h % 24) + 24) % 24); // ?hour= pins a preview time
      setLive(false);
    } else {
      const n = new Date();
      setManualHour(n.getHours() + n.getMinutes() / 60);
    }

    return () => mq.removeEventListener("change", update);
  }, []);

  // while "live", keep the readout tracking the real clock (no immediate
  // tick — that would clobber a ?hour= override during mount)
  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => {
      const n = new Date();
      setManualHour(n.getHours() + n.getMinutes() / 60);
    }, 30000);
    return () => clearInterval(id);
  }, [live]);

  const hourOverride = live ? null : manualHour;

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 6] }}
        dpr={[1, 2]}
        gl={{ antialias: false }}
      >
        <SceneMesh
          pixelSize={pixelSize}
          colorNum={colorNum}
          motion={motion}
          hourOverride={hourOverride}
        />
      </Canvas>

      {controls && (
        <div className="pointer-events-auto fixed bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/20 bg-black/45 px-4 py-2 text-xs text-white shadow-lg backdrop-blur-md">
          <span className="w-16 shrink-0 text-center tabular-nums text-white/90">
            {fmtHour(manualHour)}
          </span>
          <input
            type="range"
            min={0}
            max={24}
            step={0.25}
            value={manualHour}
            onChange={(e) => {
              setManualHour(Number(e.target.value));
              setLive(false);
            }}
            aria-label="Time of day"
            className="h-1 w-40 cursor-pointer accent-emerald-300 sm:w-52"
          />
          <button
            onClick={() => setLive((v) => !v)}
            className={`shrink-0 rounded-full px-3 py-1 font-medium transition-colors ${
              live
                ? "bg-emerald-300 text-black"
                : "border border-white/30 text-white/80 hover:bg-white/10"
            }`}
          >
            {live ? "Live" : "Preview"}
          </button>
        </div>
      )}
    </div>
  );
}
