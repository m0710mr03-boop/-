import { Vector3, Color } from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      points: any;
      bufferGeometry: any;
      bufferAttribute: any;
      shaderMaterial: any;
      instancedMesh: any;
      boxGeometry: any;
      sphereGeometry: any;
      meshStandardMaterial: any;
      color: any;
      fog: any;
      ambientLight: any;
      spotLight: any;
      pointLight: any;
      group: any;
      mesh: any;
      extrudeGeometry: any;
    }
  }
}

export enum TreeState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE'
}

export interface ParticleData {
  scatterPos: Vector3;
  treePos: Vector3;
  color: Color;
  size: number;
  speed: number; // For breathing animation
  offset: number; // For time offset
}

export interface OrnamentData {
  id: number;
  scatterPos: Vector3;
  treePos: Vector3;
  scale: number;
  type: 'SPHERE' | 'BOX';
  color: string;
  rotationSpeed: Vector3;
}

export const PALETTE = {
  EMERALD_DEEP: "#023020",
  EMERALD_LIGHT: "#0B5345",
  GOLD_METALLIC: "#D4AF37",
  GOLD_BRIGHT: "#FFD700",
  WARM_WHITE: "#FFFDD0",
  ACCENT_RED: "#720e1e" // A subtle deep red for contrast
};