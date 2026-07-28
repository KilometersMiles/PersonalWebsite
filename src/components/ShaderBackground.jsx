import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { Plane, shaderMaterial, useTexture } from '@react-three/drei';
import { theme } from '/src/constants/theme.js';

const MAX_TRAIL = 100;

// Shape ENUM mapping
const SHAPE_MAP = {
    none: 0,
    circle: 1,
    ring: 2,
    line: 3,
    texture: 4,
};

const hexToVec3 = (hex) => {
    const c = new THREE.Color(hex);
    return new THREE.Vector3(c.r, c.g, c.b);
};

const GlowyCloudMaterial = shaderMaterial(
    {
        u_time: 0,
        u_resolution: new THREE.Vector2(),
        u_trailPos: Array(MAX_TRAIL).fill(null).map(() => new THREE.Vector2(0.5, 0.5)),
        u_trailVel: Array(MAX_TRAIL).fill(null).map(() => new THREE.Vector2(0.0, 0.0)),
        u_trailAge: Array(MAX_TRAIL).fill(1.0),
        u_seed: Math.random() * 100.0,
        u_bg: hexToVec3(theme.bg),
        u_primary: hexToVec3(theme.primary),
        // Shape Uniforms
        u_shapeType: 0,           // 0: None, 1: Circle, 2: Ring, 3: Line, 4: Texture
        u_shapeTexture: null,     // sampler2D for logo/mask
        u_shapeRadius: 0.25,      // Size of procedural shapes
        u_shapeSoftness: 0.2,     // Boundary feathering
        u_shapeExpand: 0.1,       // Expansion factor over time
    },
    // --- Vertex Shader ---
    `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
    // --- Fragment Shader ---
    `
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_trailPos[100];
    uniform vec2 u_trailVel[100];
    uniform float u_trailAge[100];
    uniform float u_seed;
    uniform vec3 u_bg;
    uniform vec3 u_primary;
    
    // Shape controls
    uniform int u_shapeType;
    uniform sampler2D u_shapeTexture;
    uniform float u_shapeRadius;
    uniform float u_shapeSoftness;
    uniform float u_shapeExpand;

    varying vec2 vUv;

    // --- Noise Utilities ---
    float rand(vec2 n) {
      return fract(sin(dot(n + u_seed, vec2(12.9898, 4.1414))) * 43758.5453);
    }

    float noise(vec2 n) {
      const vec2 d = vec2(0.0, 1.0);
      vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
      return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
    }

    vec2 curl(vec2 p) {
      float eps = 0.01;
      float n1 = noise(p + vec2(eps, 0.0));
      float n2 = noise(p - vec2(eps, 0.0));
      float n3 = noise(p + vec2(0.0, eps));
      float n4 = noise(p - vec2(0.0, eps));
      return vec2((n3 - n4) / (2.0 * eps), -(n1 - n2) / (2.0 * eps));
    }

    float fbm(vec2 n) {
      float total = 0.0, amplitude = 0.5;
      for (int i = 0; i < 5; i++) {
        total += noise(n) * amplitude;
        n = n * 2.03 + vec2(0.15);
        amplitude *= 0.5;
      }
      return total;
    }

    // Signed Distance Field (SDF) Shape Functions
    float getShapeMask(vec2 st, vec2 uv) {
      if (u_shapeType == 0) return 1.0; // No mask (full screen)

      float mask = 0.0;
      // Allow procedural shapes to expand naturally over time
      float dynamicRadius = u_shapeRadius + sin(u_time * 0.5) * u_shapeExpand;

      if (u_shapeType == 1) { 
        // CIRCLE SDF
        float dist = length(st);
        mask = 1.0 - smoothstep(dynamicRadius - u_shapeSoftness, dynamicRadius + u_shapeSoftness, dist);
      } 
      else if (u_shapeType == 2) { 
        // RING SDF
        float dist = abs(length(st) - dynamicRadius);
        float thickness = 0.05;
        mask = 1.0 - smoothstep(thickness - u_shapeSoftness, thickness + u_shapeSoftness, dist);
      } 
      else if (u_shapeType == 3) { 
        // LINE SDF (Horizontal band)
        float dist = abs(st.y);
        mask = 1.0 - smoothstep(dynamicRadius - u_shapeSoftness, dynamicRadius + u_shapeSoftness, dist);
      } 
      else if (u_shapeType == 4) { 
        // 1. Center and aspect-correct the texture UVs
        vec2 texUv = (uv - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0) / u_shapeRadius + 0.5;

        // 2. Check if UVs are within [0, 1] bounds (prevents edge-smearing/tiling)
        if (texUv.x < 0.0 || texUv.x > 1.0 || texUv.y < 0.0 || texUv.y > 1.0) {
          mask = 0.0;
        } else {
          vec4 texColor = texture2D(u_shapeTexture, texUv);
          
          // 3. For black pixels on transparent background:
          // Alpha channel (texColor.a) defines shape boundary
          float alpha = texColor.a;

          // If your PNG uses black RGB instead of true Alpha, invert RGB brightness:
          // float alpha = 1.0 - ((texColor.r + texColor.g + texColor.b) / 3.0);

          mask = smoothstep(0.1 - u_shapeSoftness, 0.5 + u_shapeSoftness, alpha);
        }
    }

      return clamp(mask, 0.0, 1.0);
    }

    void main() {
      // Aspect ratio correction
      vec2 st = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
      vec2 aspectScale = vec2(u_resolution.x / u_resolution.y, 1.0);

      // --- Accumulate Trail Forces & Velocity History ---
      vec2 totalDisplacement = vec2(0.0);

      for (int i = 0; i < 100; i++) {
        float age = u_trailAge[i];
        if (age >= 1.0) continue; 

        vec2 p = (u_trailPos[i] - 0.5) * aspectScale;
        vec2 vel = u_trailVel[i];

        float dist = length(st - p);
        float radius = 0.05 + age * 0.3; 
        float influence = smoothstep(radius, 0.0, dist) * (1.0 - smoothstep(0.0, 1.0, age));

        float velMag = max(length(vel), 0.015);
        vec2 pushForce = vel * influence * 0.3;
        vec2 vortexForce = curl((st - p) * 3.0 + u_time * 0.1) * velMag * influence * 0.1;

        totalDisplacement += pushForce + vortexForce;
      }

      // --- Fluid Offset UVs ---
      vec2 fluidUV = st - totalDisplacement;

      // Organic drift and curl noise
      vec2 ambientDrift = vec2(u_time * 0.015, u_time * 0.1);
      vec2 cloudWarp = curl(fluidUV * 1.8 + ambientDrift) * 0.35;

      // Layered cloud density
      float baseClouds = fbm(fluidUV * 2.2 + cloudWarp);
      float detailClouds = fbm(fluidUV * 5.0 - cloudWarp * 0.5);

      float rawDensity = baseClouds * 0.7 + detailClouds * 0.3;

      // --- EVALUATE SHAPE MASK ON WARPED UVs ---
      // Evaluating mask on (fluidUV + cloudWarp) makes the shape edges organic and billowy
      vec2 maskUV = vUv - totalDisplacement; 
      float shapeMask = getShapeMask(fluidUV + cloudWarp * 0.3, maskUV);

      // Multiply mask with cloud density
      float density = smoothstep(0.2, 0.85, rawDensity) * shapeMask;

      // --- Palette Matching ---
      vec3 cloudColor = mix(u_bg, u_primary, density * 0.65);
      vec3 highlightColor = mix(cloudColor, vec3(1.0), pow(density, 3.0) * 0.3);

      gl_FragColor = vec4(highlightColor, 1.0);
    }
  `
);

extend({ GlowyCloudMaterial });

const ShaderScene = ({ shape = 'none', textureUrl = null, radius = 0.25, softness = 0.2, expand = 0.08 }) => {
    const shaderRef = useRef();
    const { size, mouse } = useThree();
    const headRef = useRef(0);
    const initialSeed = useMemo(() => Math.random() * 100.0, []);

    // Load custom texture/logo if provided
    const loadedTexture = textureUrl ? useTexture(textureUrl, (tex) => {
            tex.colorSpace = THREE.NoColorSpace; // Keeps raw Alpha values intact
            tex.wrapS = THREE.ClampToEdgeWrapping;
            tex.wrapT = THREE.ClampToEdgeWrapping;
            tex.needsUpdate = true;
        }) : null;

    const trailRef = useRef(
        Array(MAX_TRAIL).fill(null).map(() => ({
            pos: new THREE.Vector2(0.5, 0.5),
            vel: new THREE.Vector2(0, 0),
            age: 1.0,
        }))
    );

    const prevMouse = useRef({ x: 0.5, y: 0.5, time: performance.now() });

    useFrame((state) => {
        if (!shaderRef.current) return;

        const currentTime = performance.now();
        const dt = Math.max((currentTime - prevMouse.current.time) / 1000, 0.001);

        const currentX = (mouse.x + 1) / 2;
        const currentY = (mouse.y + 1) / 2;

        const dx = currentX - prevMouse.current.x;
        const dy = currentY - prevMouse.current.y;
        const distMoved = Math.sqrt(dx * dx + dy * dy);

        const trail = trailRef.current;

        for (let i = 0; i < MAX_TRAIL; i++) {
            if (trail[i].age < 1.0) {
                trail[i].age = Math.min(trail[i].age + dt * 0.1, 1.0);
                trail[i].pos.addScaledVector(trail[i].vel, dt * 1);
                trail[i].vel.multiplyScalar(0.998);
            }
        }

        if (distMoved > 0.009) {
            const idx = headRef.current;
            headRef.current = (headRef.current + 1) % MAX_TRAIL;

            const speed = Math.max(distMoved / dt, 0.001);
            const dirX = dx / distMoved;
            const dirY = dy / distMoved;
            const effectiveSpeed = 0.02 + Math.min(speed * 0.03, 0.15);

            trail[idx] = {
                pos: new THREE.Vector2(currentX, currentY),
                vel: new THREE.Vector2(dirX * effectiveSpeed, dirY * effectiveSpeed),
                age: 0.0,
            };
        }
        prevMouse.current = { x: currentX, y: currentY, time: currentTime };

        // Uniform updates
        shaderRef.current.u_time = state.clock.getElapsedTime();
        shaderRef.current.u_resolution.set(size.width, size.height);
        shaderRef.current.u_shapeType = SHAPE_MAP[shape] ?? 0;
        shaderRef.current.u_shapeRadius = radius;
        shaderRef.current.u_shapeSoftness = softness;
        shaderRef.current.u_shapeExpand = expand;

        if (loadedTexture) {
            shaderRef.current.u_shapeTexture = loadedTexture;
        }

        for (let i = 0; i < MAX_TRAIL; i++) {
            shaderRef.current.u_trailPos[i].copy(trail[i].pos);
            shaderRef.current.u_trailVel[i].copy(trail[i].vel);
            shaderRef.current.u_trailAge[i] = trail[i].age;
        }
    });

    return (
        <Plane args={[2, 2]} frustumCulled={false}>
            <glowyCloudMaterial
                ref={shaderRef}
                key={initialSeed}
                u_seed={initialSeed}
                transparent
            />
        </Plane>
    );
};

const ShaderBackground = ({ 
    shape = 'line', // 'none' | 'circle' | 'ring' | 'line' | 'texture'
    textureUrl = '/assets/image.png', // Path to PNG logo (e.g. '/logo.png')
    radius = .25,      // Size of shape
    softness = 0.15,    // Boundary softness (higher = softer edges)
    expand = 0.04,      // Natural expansion pulsate rate
    style, 
    ...props 
}) => {
    return (
        <Canvas
            style={{
                width: '100vw',
                height: '100vh',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: -1,
                ...style
            }}
            orthographic
            camera={{ position: [0, 0, 1], zoom: 1 }}
            dpr={Math.min(window.devicePixelRatio, 2)}
            {...props}
        >
            <React.Suspense fallback={null}>
                <ShaderScene 
                    shape={shape} 
                    textureUrl={textureUrl}
                    radius={radius}
                    softness={softness}
                    expand={expand}
                />
            </React.Suspense>
        </Canvas>
    );
};

export default ShaderBackground;