/// <reference types="vite/client" />

declare module "lucide-react";

declare module "three" {
  export type Mesh = any;
  export type Group = any;
  export type Object3D = any;
  export type CanvasTexture = any;
  export type MeshStandardMaterial = any;
  export type Color = any;
  export type Texture = any;
  export type Material = any;
  export type BufferGeometry = any;
  export type Vector3 = any;
  export type Euler = any;
  export type Camera = any;
  export type Scene = any;
  export type WebGLRenderer = any;
  export const CanvasTexture: any;
  export const Color: any;
  export const SRGBColorSpace: any;
  export const LinearFilter: any;
  export const DoubleSide: any;
  export const MathUtils: any;
  export const Group: any;
  export const Mesh: any;
  export const BoxGeometry: any;
  export const MeshBasicMaterial: any;
  export const MeshStandardMaterial: any;
  const three: any;
  export default three;
}

declare namespace React {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

declare module "*.glb" {
  const src: string;
  export default src;
}
