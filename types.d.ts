declare module 'stats.js';
declare module 'webxr';

// Add any other missing type declarations here
declare module '*.glb' {
  const content: any;
  export default content;
}

declare module '*.gltf' {
  const content: any;
  export default content;
} 