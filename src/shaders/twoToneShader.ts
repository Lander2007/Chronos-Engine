import * as THREE from "three"

export const TwoToneShader = {
  uniforms: {
    uTime: { value: 0 },
    uColorBg: { value: new THREE.Color("#F4F1EA") },
    uColorCore: { value: new THREE.Color("#580D18") },
    uColorRich: { value: new THREE.Color("#6E1422") },
    uColorCrimson: { value: new THREE.Color("#812033") },
    uColorDeep: { value: new THREE.Color("#3C0810") },
    uColorDusty: { value: new THREE.Color("#914354") },
    uLightPosition: { value: new THREE.Vector3(6.0, 9.0, 7.0) },
    uRimPower: { value: 2.5 },
    uEmissiveIntensity: { value: 1.0 },
    uSelectedNode: { value: -1.0 },
    uEnergyFrequency: { value: 1.0 },
  },
  vertexShader: /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec3 vViewPosition;
    varying vec2 vUv;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: /* glsl */ `
    uniform float uTime;
    uniform vec3 uColorBg;
    uniform vec3 uColorCore;
    uniform vec3 uColorRich;
    uniform vec3 uColorCrimson;
    uniform vec3 uColorDeep;
    uniform vec3 uColorDusty;
    uniform vec3 uLightPosition;
    uniform float uRimPower;
    uniform float uEmissiveIntensity;
    uniform float uSelectedNode;
    uniform float uEnergyFrequency;

    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec3 vViewPosition;
    varying vec2 vUv;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      vec3 lightDir = normalize(uLightPosition - vWorldPosition);

      // Diffuse light intensity step
      float diff = max(dot(normal, lightDir), 0.0);
      float steppedDiff = smoothstep(0.1, 0.75, diff);

      // Shadow depth gradient using Deep Wine (#3C0810) and Core Burgundy (#580D18)
      vec3 shadowColor = mix(uColorDeep, uColorCore, steppedDiff);
      
      // Surface response transitioning into Rich Burgundy (#6E1422) and Warm Cream (#F4F1EA) highlights
      vec3 surfaceColor = mix(shadowColor, uColorRich, steppedDiff * 0.65);
      vec3 finalBase = mix(surfaceColor, uColorBg, steppedDiff * 0.15);

      // Multi-layer Fresnel rim highlight using Crimson Burgundy (#812033)
      float NdotV = max(dot(normal, viewDir), 0.0);
      float rim = pow(1.0 - NdotV, uRimPower);
      vec3 rimGlow = uColorCrimson * rim * 2.2;

      // Subtle warm micro-specular highlight
      vec3 halfDir = normalize(lightDir + viewDir);
      float spec = pow(max(dot(normal, halfDir), 0.0), 32.0);
      vec3 specHighlight = uColorDusty * spec * 0.45;

      // Pulsing energy resonance
      float pulse = (sin(uTime * 2.0 * uEnergyFrequency) * 0.5 + 0.5) * 0.25;
      vec3 pulseGlow = uColorRich * pulse * uEmissiveIntensity;

      // Highlight amplification if a node is actively selected
      float nodeHighlight = uSelectedNode >= 0.0 ? (sin(uTime * 4.0) * 0.5 + 0.5) * 0.35 : 0.0;
      vec3 nodeGlow = uColorCrimson * nodeHighlight;

      vec3 finalColor = finalBase + rimGlow + specHighlight + pulseGlow + nodeGlow;
      float alpha = mix(0.94, 1.0, rim);

      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
}
