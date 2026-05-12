/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

// Figma asset imports resolve to image URLs
declare module 'figma:asset/*' {
  const src: string;
  export default src;
}
