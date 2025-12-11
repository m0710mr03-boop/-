import React, { useMemo, useRef, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TreeState, PALETTE } from '../types';
import { getScatterPosition, getTreePosition } from '../utils/geometry';

interface OrnamentSystemProps {
  count: number;
  treeState: TreeState;
  type: 'BOX' | 'SPHERE';
}

export const OrnamentSystem: React.FC<OrnamentSystemProps> = ({ count, treeState, type }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  // Create static data for each instance
  const data = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const sPos = getScatterPosition();
      const tPos = getTreePosition(Math.random(), 0.1); // Slightly looser for ornaments
      
      // Push Ornaments slightly outward to sit "on" the needles
      const dir = new THREE.Vector3(tPos.x, 0, tPos.z).normalize();
      tPos.add(dir.multiplyScalar(0.4)); 

      const scale = Math.random() * 0.4 + 0.15;
      
      // Color Logic: Mostly Gold, with Deep Red and Emerald accents
      // Updated distribution:
      // ~65% Gold variants
      // ~20% Red
      // ~15% Green (Added based on request)
      const rand = Math.random();
      let colorHex;
      
      if (rand > 0.55) {
        colorHex = PALETTE.GOLD_METALLIC; 
      } else if (rand > 0.35) {
        colorHex = PALETTE.GOLD_BRIGHT;
      } else if (rand > 0.15) {
        colorHex = PALETTE.ACCENT_RED;
      } else {
        colorHex = PALETTE.EMERALD_LIGHT; // The requested green decoration
      }
      
      // If Box, maybe lean more towards Gold gifts to look luxurious
      if (type === 'BOX' && Math.random() > 0.5) colorHex = PALETTE.GOLD_METALLIC;

      temp.push({
        sPos,
        tPos,
        scale: new THREE.Vector3(scale, scale, scale),
        rotationOffset: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0),
        color: new THREE.Color(colorHex),
        speed: Math.random() * 0.5 + 0.5
      });
    }
    return temp;
  }, [count, type]);

  // Set colors once
  useLayoutEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
      meshRef.current.setColorAt(i, data[i].color);
    }
    meshRef.current.instanceColor!.needsUpdate = true;
  }, [count, data]);

  // Animation Loop
  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;
    const isTree = treeState === TreeState.TREE_SHAPE;
    
    const dummy = new THREE.Object3D();
    const lerpFactor = 0.04; 

    for (let i = 0; i < count; i++) {
      const d = data[i];
      
      const targetPos = isTree ? d.tPos : d.sPos;
      
      meshRef.current.getMatrixAt(i, dummy.matrix);
      dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
      
      // Lerp Position
      dummy.position.lerp(targetPos, lerpFactor * d.speed);
      
      // Add floating noise
      if (!isTree) {
         dummy.position.y += Math.sin(time * d.speed + i) * 0.02;
         dummy.rotation.x += 0.01;
         dummy.rotation.z += 0.01;
      } else {
         // Subtle shimmer rotation when in tree mode
         dummy.rotation.y += 0.01;
         // Bobbing slightly
         dummy.position.y += Math.sin(time * 2 + i) * 0.002;
      }
      
      dummy.scale.copy(d.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow receiveShadow>
      {type === 'BOX' ? <boxGeometry /> : <sphereGeometry args={[1, 32, 32]} />}
      <meshStandardMaterial 
        roughness={0.05} // Very shiny
        metalness={1.0} // Fully metallic
        envMapIntensity={2.5} // High reflection
        color="#ffffff" // Base color white to let instance color tint strictly
      />
    </instancedMesh>
  );
};