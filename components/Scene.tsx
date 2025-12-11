import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { TreeState } from '../types';
import { FoliageLayer } from './FoliageLayer';
import { OrnamentSystem } from './OrnamentSystem';
import { TopStar } from './TopStar';

interface SceneProps {
  treeState: TreeState;
}

const Rig = ({ treeState }: { treeState: TreeState }) => {
  useFrame((state) => {
    // Slight camera movement based on mouse could go here
  });
  return null;
}

export const Scene: React.FC<SceneProps> = ({ treeState }) => {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ 
        antialias: false, 
        toneMapping: THREE.ACESFilmicToneMapping, 
        toneMappingExposure: 1.5 // Increased exposure for brighter atmosphere
      }}
      shadows
    >
      <PerspectiveCamera makeDefault position={[0, 0, 25]} fov={45} />
      <Rig treeState={treeState} />
      <OrbitControls 
        enablePan={false} 
        minPolarAngle={Math.PI / 4} 
        maxPolarAngle={Math.PI / 1.8}
        autoRotate={true}
        autoRotateSpeed={0.8}
        minDistance={10}
        maxDistance={40}
      />
      
      {/* --- Environment & Lighting --- */}
      {/* Dark Green Void Background */}
      <color attach="background" args={['#011005']} />
      <fog attach="fog" args={['#011005', 10, 60]} />
      
      {/* Base Ambient - brighter now */}
      <ambientLight intensity={0.8} color="#053311" />
      
      {/* Key Light (Warm Gold) - Increased Intensity */}
      <spotLight 
        position={[10, 20, 10]} 
        angle={0.4} 
        penumbra={1} 
        intensity={80} 
        distance={100}
        decay={1}
        color="#fff5cc" 
        castShadow 
        shadow-bias={-0.0001}
      />
      
      {/* Rim Light (Cool/Emerald) - High Intensity for cinematic edge */}
      <spotLight 
        position={[-15, 10, -15]} 
        angle={0.6} 
        penumbra={1} 
        intensity={100} 
        distance={100}
        decay={1}
        color="#00ffaa" 
      />

      {/* Fill Light (Golden) */}
      <pointLight position={[0, -5, 10]} intensity={15} color="#ffcc00" distance={50} decay={1.5} />

      {/* Reflections - City preset is good for metallic reflections, increased intensity */}
      <Environment preset="city" environmentIntensity={2} />
      <Stars radius={100} depth={50} count={6000} factor={4} saturation={1} fade speed={0.5} />

      {/* --- Content --- */}
      <group position={[0, -2, 0]}>
         {/* The Foliage (The Tree Body) */}
         <FoliageLayer count={5000} treeState={treeState} />
         
         {/* The Ornaments (Details) */}
         <OrnamentSystem count={150} treeState={treeState} type="BOX" />
         <OrnamentSystem count={250} treeState={treeState} type="SPHERE" />

         {/* The Star */}
         <TopStar treeState={treeState} />
      </group>

      {/* --- Post Processing --- */}
      <EffectComposer disableNormalPass>
        {/* Stronger Bloom for the "Glow" effect */}
        <Bloom 
          luminanceThreshold={0.9} 
          mipmapBlur 
          intensity={2.0} 
          radius={0.4}
        />
        <Noise opacity={0.05} />
        <Vignette eskil={false} offset={0.1} darkness={1.0} />
      </EffectComposer>
    </Canvas>
  );
};
