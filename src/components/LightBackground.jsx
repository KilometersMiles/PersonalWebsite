import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { Plane, shaderMaterial, useTexture } from '@react-three/drei';
import { theme } from '/src/constants/theme.js';

const hexToVec3 = (hex) => {
    const c = new THREE.Color(hex);
    return new THREE.Vector3(c.r, c.g, c.b);
};

const pillarState = (index) => {
    if (index == null) { index = 0; }
    if (index === 0) {
        return {
            uAngle: (Math.PI / 2 + Math.PI / 3),
            uWidth: .25,
            uSpeed: 0.4,
            uDensity: 20.0,
            uColorMix: 0.0,
        }
    } else if (index === 1) {
        return {
            uAngle: (Math.PI / 2 + Math.PI / 4),
            uWidth: .6,
            uSpeed: 0.8,
            uDensity: 35.0,
            uColorMix: 0.2,
        }
    } else if (index === 2) {
        return {
            uAngle: (Math.PI / 2 + Math.PI / 6),
            uWidth: 0.35,
            uSpeed: 0.15,
            uDensity: 100.0,
            uColorMix: 0.4,
        }
    } else if (index === 3) {
        return {
            uAngle: (Math.PI / 2 + Math.PI / 2),
            uWidth: 0.8,
            uSpeed: 0.1,
            uDensity: 10.0,
            uColorMix: .6,
        }
    }
}

const LightPillarMaterial = shaderMaterial(
    {
        uTime: 0,
        u_resolution: new THREE.Vector2(),
        uPrimary: hexToVec3(theme.primary),
        uSecondary: hexToVec3(theme.secondary),
        uSeed: Math.random() * 1000,
        uBg: hexToVec3(theme.bg),
        uAngle: (Math.PI / 2 + Math.PI / 3),
        uWidth: .25,
        uSpeed: 0.4,
        uDensity: 20.0,
        uColorMix: 0.0,
    },
    `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
    `
    uniform float uTime;
    uniform vec2 u_resolution;
    uniform vec3 uPrimary;
    uniform vec3 uSecondary;
    uniform float uSeed;
    uniform vec3 uBg;
    uniform float uAngle;
    uniform float uWidth;
    uniform float uSpeed;
    uniform float uDensity;
    uniform float uColorMix;
    varying vec2 vUv;

    // 2D Random
    float random (in vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233)))
                    * 43758.5453123);
    }

    // 2D Noise based on Morgan McGuire @morgan3d
    // https://www.shadertoy.com/view/4dS3Wd
    float noise (in vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        // Four corners in 2D of a tile
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));

        // Smooth Interpolation

        // Cubic Hermine Curve.  Same as SmoothStep()
        vec2 u = f*f*(3.0-2.0*f);
        // u = smoothstep(0.,1.,f);

        // Mix 4 coorners percentages
        return mix(a, b, u.x) +
                (c - a)* u.y * (1.0 - u.x) +
                (d - b) * u.x * u.y;
    }

    float fbm(vec2 st) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < 3; i++) {
            value += amplitude * noise(st);
            st *= 2.0;
            amplitude *= 0.5;
        }
        return value;
    }
        
    void main() {
vec2 st = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;

        float c = cos(uAngle);
        float s = sin(uAngle);
        vec2 localSt = vec2(c * st.x - s * st.y, s * st.x + c * st.y);

        float warp = fbm(vec2(localSt.x * 4.0 + uTime * uSpeed, localSt.y * 2.0 - uTime * (0.25 * uSpeed))) * 0.15;
        float warpedX = localSt.x + warp;

        vec2 noiseCoord = vec2(warpedX * uDensity, localSt.y * 2.0 - uTime * (0.5 * uSpeed));
        float n = fbm(noiseCoord);
        
        float strands = pow(n, 2.24);

        float distFromCenter = abs(warpedX);
        
        float coreMask = 1.0 - smoothstep(0.0, uWidth, distFromCenter);
        
        float bloom = .2 / (distFromCenter + 0.001) * smoothstep(3.0, -0.2, abs(localSt.y));

        float finalIntensity = (strands * coreMask * 2.0) + (bloom * 0.4);

        vec3 pct = vec3(st.y);
        vec3 mixColor = mix(uPrimary, uSecondary, pct);
        vec3 tint = mix(mixColor, uSecondary, uColorMix);
        
        vec3 color = mix(uBg, tint, clamp(finalIntensity, 0.0, 1.0));
        color += vec3(0.9, 0.95, 1.0) * smoothstep(uWidth * 0.3, 0.0, distFromCenter) * strands * 0.6;

        //apply some noise on top 
        vec2 posi = vec2(st*700.0);
        float n2 = noise(posi);

        gl_FragColor = vec4(color * 0.75, 1.0) + vec4(vec3(n2 * 0.02), 0.0);
    }
  `
);

extend({ LightPillarMaterial });

const ShaderScene = ({ index }) => {
    const materialRef = useRef();

    const currentConfig = pillarState(index);

    useFrame((state) => {
        if (!materialRef.current) return;
        materialRef.current.uTime = state.clock.getElapsedTime();
        materialRef.current.u_resolution.set(window.innerWidth, window.innerHeight);

        materialRef.current.uAngle = THREE.MathUtils.lerp(materialRef.current.uAngle, currentConfig.uAngle, 0.05);
        materialRef.current.uWidth = THREE.MathUtils.lerp(materialRef.current.uWidth, currentConfig.uWidth, 0.05);
        materialRef.current.uSpeed = THREE.MathUtils.lerp(materialRef.current.uSpeed, currentConfig.uSpeed, 0.0);
        materialRef.current.uDensity = THREE.MathUtils.lerp(materialRef.current.uDensity, currentConfig.uDensity, 0.05);
        materialRef.current.uColorMix = THREE.MathUtils.lerp(materialRef.current.uColorMix, currentConfig.uColorMix, 0.05);
    });
    return (
        <Plane args={[2, 2]} position={[0, 0, 0]}>
            <lightPillarMaterial ref={materialRef} />
        </Plane>
    );
}

const LightBackground = ({ pageIndex, style, ...props }) => {
    return (
        <Canvas
            // gl={{ preserveDrawingBuffer: true }}
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
                <ShaderScene index={pageIndex} />
            </React.Suspense>
        </Canvas>
    );
}

export default LightBackground;
