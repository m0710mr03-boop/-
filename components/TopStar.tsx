import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TreeState, PALETTE } from '../types';
import { getScatterPosition } from '../utils/geometry';

interface TopStarProps {
  treeState: TreeState;
}

export const TopStar: React.FC<TopStarProps> = ({ treeState }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Memoize geometry and positions
  const { shape, scatterPos, treePos } = useMemo(() => {
    // 1. Create Star Shape
    const s = new THREE.Shape();
    const points = 5;
    const outerRadius = 0.9;
    const innerRadius = 0.45;
    // -Math.PI / 2 starts the star pointing upwards
    const angleOffset = -Math.PI / 2;

    for (let i = 0; i < points * 2; i++) {
      const angle = (i * Math.PI) / points + angleOffset;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) s.moveTo(x, y);
      else s.lineTo(x, y);
    }
    s.closePath();

    // 2. Positions
    // Tree height is 12, so top is at y=6. We place star slightly above.
    const tPos = new THREE.Vector3(0, 6.2, 0); 
    const sPos = getScatterPosition();

    return { shape: s, scatterPos: sPos, treePos: tPos };
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const isTree = treeState === TreeState.TREE_SHAPE;
    const targetPos = isTree ? treePos : scatterPos;

    // Smooth lerp to target position
    // Use a slightly faster lerp for the star so it crowns the tree quickly
    meshRef.current.position.lerp(targetPos, delta * 2.5);

    // Rotation Animation
    if (isTree) {
      // Slow majestic rotation when on tree
      meshRef.current.rotation.y += delta * 0.5;
      // Reset orientation to face forward-ish
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, 0, delta * 3);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, 0, delta * 3);
    } else {
      // Random tumbling when scattered
      meshRef.current.rotation.x += delta;
      meshRef.current.rotation.y += delta * 0.5;
      meshRef.current.rotation.z += delta * 0.8;
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <extrudeGeometry 
        args={[
          shape, 
          { 
            depth: 0.3, 
            bevelEnabled: true, 
            bevelThickness: 0.1, 
            bevelSize: 0.05, 
            bevelSegments: 4 
          }
        ]} 
      />
      <meshStandardMaterial 
        color={PALETTE.GOLD_BRIGHT}
        emissive={PALETTE.GOLD_BRIGHT}
        emissiveIntensity={2.0}
        roughness={0.1}
        metalness={1.0}
        toneMapped={false} 
      />
      {/* Add a dedicated point light for the star to make it glow onto the tree */}
      <pointLight distance={5} intensity={5} color="#ffd700" />
    </mesh>
  );
};
