import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { damp } from 'maath/easing';
import { TreeState, PALETTE } from '../types';
import { getScatterPosition, getTreePosition } from '../utils/geometry';

// --- Custom Shader Material ---
const FoliageMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uProgress: { value: 0 }, 
    uColor1: { value: new THREE.Color(PALETTE.EMERALD_DEEP) },
    uColor2: { value: new THREE.Color(PALETTE.GOLD_BRIGHT) },
  },
  vertexShader: `
    uniform float uTime;
    uniform float uProgress;
    attribute vec3 aTreePos;
    attribute vec3 aScatterPos;
    attribute float aRandom;
    attribute float aSize;
    
    varying vec2 vUv;
    varying float vMix;
    
    void main() {
      vUv = uv;
      vMix = aRandom;
      
      float localProgress = smoothstep(0.0, 1.0, uProgress);
      
      vec3 targetPos = mix(aScatterPos, aTreePos, localProgress);
      
      // Breathing animation
      float breathAmp = mix(0.5, 0.08, localProgress); 
      float timeOffset = aRandom * 10.0;
      
      vec3 breath = vec3(
        sin(uTime * 1.0 + timeOffset),
        cos(uTime * 0.8 + timeOffset),
        sin(uTime * 1.2 + timeOffset)
      ) * breathAmp;
      
      vec4 mvPosition = modelViewMatrix * vec4(targetPos + breath, 1.0);
      
      gl_Position = projectionMatrix * mvPosition;
      
      // Size attenuation
      gl_PointSize = aSize * (350.0 / -mvPosition.z);
    }
  `,
  fragmentShader: `
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    varying float vMix;
    
    void main() {
      // Circular particle
      vec2 center = gl_PointCoord - 0.5;
      float dist = length(center);
      if (dist > 0.5) discard;
      
      // Soft edge glow
      float glow = 1.0 - (dist * 2.0);
      glow = pow(glow, 2.0);
      
      // Mix colors: Deep emerald with occasional gold sparkles
      // Increased brightness factor
      vec3 color = mix(uColor1 * 1.5, uColor2 * 3.0, step(0.85, vMix));
      
      gl_FragColor = vec4(color, glow); 
    }
  `
};

interface FoliageProps {
  count: number;
  treeState: TreeState;
}

export const FoliageLayer: React.FC<FoliageProps> = ({ count, treeState }) => {
  const meshRef = useRef<THREE.Points>(null);
  const shaderRef = useRef<THREE.ShaderMaterial>(null);

  const particles = useMemo(() => {
    const treePositions = new Float32Array(count * 3);
    const scatterPositions = new Float32Array(count * 3);
    const randoms = new Float32Array(count);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Tree Shape - Slightly wider distribution for volume
      const tPos = getTreePosition(Math.random(), 0.2);
      treePositions[i * 3] = tPos.x;
      treePositions[i * 3 + 1] = tPos.y;
      treePositions[i * 3 + 2] = tPos.z;

      // Scatter Shape
      const sPos = getScatterPosition();
      scatterPositions[i * 3] = sPos.x;
      scatterPositions[i * 3 + 1] = sPos.y;
      scatterPositions[i * 3 + 2] = sPos.z;

      randoms[i] = Math.random();
      sizes[i] = Math.random() * 0.6 + 0.2; 
    }

    return { treePositions, scatterPositions, randoms, sizes };
  }, [count]);

  useFrame((state, delta) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      const targetProgress = treeState === TreeState.TREE_SHAPE ? 1 : 0;
      damp(shaderRef.current.uniforms.uProgress, 'value', targetProgress, 1.2, delta);
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.scatterPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aTreePos"
          count={count}
          array={particles.treePositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aScatterPos"
          count={count}
          array={particles.scatterPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          count={count}
          array={particles.randoms}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={count}
          array={particles.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={shaderRef}
        args={[FoliageMaterial]}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
