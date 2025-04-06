// Type definitions for missing libraries

// React Reconciler
declare module 'react-reconciler' {
  const content: any;
  export default content;
}

// Stats.js
declare module 'stats.js' {
  export default class Stats {
    constructor();
    dom: HTMLElement;
    showPanel(panel: number): void;
    begin(): void;
    end(): void;
    update(): void;
  }
}

// OffscreenCanvas
interface OffscreenCanvas extends EventTarget {
  width: number;
  height: number;
  getContext(contextId: string, options?: any): any;
  convertToBlob(options?: any): Promise<Blob>;
}

declare var OffscreenCanvas: {
  prototype: OffscreenCanvas;
  new(width: number, height: number): OffscreenCanvas;
};

// WebXR
interface XRRigidTransform {
  readonly position: DOMPointReadOnly;
  readonly orientation: DOMPointReadOnly;
  readonly matrix: Float32Array;
  readonly inverse: XRRigidTransform;
}

// Augment existing interfaces if needed
interface Window {
  OffscreenCanvas: typeof OffscreenCanvas;
}
