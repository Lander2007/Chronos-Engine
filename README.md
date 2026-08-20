# Chronos-Engine
An experimental, high-performance, scroll-driven 3D web experience built with **React 19**, **Three.js** (via React Three Fiber), **hand-rolled requestAnimationFrame scroll physics**, and **Tailwind CSS v4**.

Chronos Engine presents a futuristic, non-traditional digital showcase where a central 3D artifact dynamically rotates and transforms its orientation in sync with user scrolling—featuring a strict 2-color aesthetic and bold typography.

## Tech Stack

- **React 19** + **React DOM 19** - UI framework
- **Three.js** + **React Three Fiber** - WebGL 3D rendering
- **@react-three/drei** - R3F helpers (Html, Line, Trail)
- **@react-three/postprocessing** - Bloom effects
- **Lenis** - Smooth scroll library
- **Tailwind CSS v4** - Styling system
- **Vite 8** - Build tool
- **TypeScript 5.7** - Type safety

## Scroll Architecture

Chronos Engine uses a **custom requestAnimationFrame-based scroll system** (no GSAP):
- Scroll progress tracked via refs (`scrollProgressRef`, `scrollVelocityRef`)
- Rotation keyframes interpolated per frame in `useFrame` hook
- Memoized geometry and instanced particles for 60fps performance
- Scroll position mapped to crystal rotation/camera angles with smooth lerping
