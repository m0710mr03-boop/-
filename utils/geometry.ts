import { Vector3, MathUtils } from 'three';

// Configuration
const CONE_HEIGHT = 12;
const CONE_RADIUS_BOTTOM = 5;
const SCATTER_RADIUS = 15;

/**
 * Generates a random point inside a sphere
 */
export const getScatterPosition = (): Vector3 => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = Math.cbrt(Math.random()) * SCATTER_RADIUS;
  
  const x = r * Math.sin(phi) * Math.cos(theta);
  const y = r * Math.sin(phi) * Math.sin(theta);
  const z = r * Math.cos(phi);
  
  return new Vector3(x, y, z);
};

/**
 * Generates a point on the surface/volume of a cone (The Tree)
 * y goes from -CONE_HEIGHT/2 to CONE_HEIGHT/2 approximately
 */
export const getTreePosition = (ratio: number, randomness: number = 0.2): Vector3 => {
  // Height from 0 to 1
  const h = Math.random(); 
  
  // Radius at this height (linear taper)
  const r = (1 - h) * CONE_RADIUS_BOTTOM;
  
  // Angle around the tree
  const theta = Math.random() * Math.PI * 2;
  
  // Randomness to fill volume slightly instead of just surface
  const rOffset = r * Math.sqrt(Math.random()) * (1 - randomness) + (r * randomness);

  const x = rOffset * Math.cos(theta);
  const z = rOffset * Math.sin(theta);
  const y = (h * CONE_HEIGHT) - (CONE_HEIGHT / 2); // Center vertical

  return new Vector3(x, y, z);
};

export const getTreeSpiralPosition = (index: number, total: number): Vector3 => {
  const h = index / total; // 0 to 1
  const angle = h * Math.PI * 15; // Number of spirals
  const r = (1 - h) * CONE_RADIUS_BOTTOM;
  
  const x = r * Math.cos(angle);
  const z = r * Math.sin(angle);
  const y = (h * CONE_HEIGHT) - (CONE_HEIGHT / 2);
  
  return new Vector3(x, y, z);
};