import { useRef, useMemo, useCallback, memo, useState } from "react"

import { useFrame } from "@react-three/fiber"

import { Environment, Html, Line, Trail } from "@react-three/drei"

import { EffectComposer, Bloom } from "@react-three/postprocessing"

import * as THREE from "three"

import { TwoToneShader } from "./shaders/twoToneShader"

import { useMagneticHover } from "./hooks/useMagneticHover"

export interface NodeData {
  id: number

  title: string

  subtitle: string

  description: string

  metrics: { label: string value: string }[]

  position: [number, number, number]
}

export const SYSTEM_NODES: NodeData[] = [
  {
    id: 0,

    title: "SINGULARITY MATRIX",

    subtitle: "CORE AXIS // 01",

    description:
      "Central non-Euclidean convergence point. Governs local timeline curvature and energy stabilization across outer facets.",

    metrics: [
      { label: "CURVATURE", value: "1.61803" },

      { label: "ENTROPY", value: "0.003 δ" },

      { label: "STABILITY", value: "99.98%" },
    ],

    position: [0, 1.45, 0],
  },

  {
    id: 1,

    title: "REFRACTION SHELL",

    subtitle: "SHELL // 02",

    description:
      "Outer fractured borosilicate facet shell. Refracts incoming temporal light before arrival at the inner resonator.",

    metrics: [
      { label: "IOR INDEX", value: "1.650" },

      { label: "TRANSMISSION", value: "94.8%" },

      { label: "FACET COUNT", value: "80 Active" },
    ],

    position: [-1.4, 0.45, 0.7],
  },

  {
    id: 2,

    title: "RESONANCE CORE",

    subtitle: "ENGINE // 03",

    description:
      "High-frequency electromagnetic harmonic oscillator locked to 7.83Hz planetary Schumann frequency.",

    metrics: [
      { label: "FREQUENCY", value: "7.83 Hz" },

      { label: "HARMONIC", value: "Sub-Octave 4" },

      { label: "OUTPUT", value: "94.2 TW" },
    ],

    position: [0, -0.3, 0],
  },

  {
    id: 3,

    title: "TEMPORAL FLUX VALVE",

    subtitle: "FLUX // 04",

    description:
      "Precision mechanical aperture controlling relativistic flux displacement through counter-rotating gyro rings.",

    metrics: [
      { label: "FLUX RATE", value: "94.2%" },

      { label: "PRESSURE", value: "∞ atm" },

      { label: "PHASE LOCK", value: "Coherent" },
    ],

    position: [1.5, -0.7, -0.6],
  },
]

interface Crystal3DProps {
  scrollProgressRef: React.RefObject<number>

  scrollVelocityRef: React.RefObject<number>

  selectedNode: number | null

  onSelectNode: (nodeId: number | null) => void

  controlState?: { energy: number speed: number phase: number }

  onCursorState?: (state: "default" | "hover" | "node") => void

  prefersReducedMotion?: boolean

  renderQuality?: "high" | "balanced" | "low"
}

// Module-scoped reusable vector instances

const tempTargetPos = new THREE.Vector3()

const tempDummyObject = new THREE.Object3D()

function buildFracturedGeometry(): THREE.BufferGeometry {
  const base = new THREE.IcosahedronGeometry(1.05, 1)

  const geo = base.index ? base.toNonIndexed() : base

  const pos = geo.attributes.position

  const count = pos.count

  const arr = pos.array as Float32Array

  for (let i = 0; i < count; i += 3) {
    const dx = (Math.random() - 0.5) * 0.24

    const dy = (Math.random() - 0.5) * 0.24

    const dz = (Math.random() - 0.5) * 0.24

    for (let j = 0; j < 3; j++) {
      const idx = (i + j) * 3

      arr[idx] += dx

      arr[idx + 1] += dy

      arr[idx + 2] += dz
    }
  }

  pos.needsUpdate = true

  geo.computeVertexNormals()

  return geo
}

let cachedGeo: THREE.BufferGeometry | null = null

function getCrystalGeo() {
  if (!cachedGeo) cachedGeo = buildFracturedGeometry()

  return cachedGeo
}

const KEYFRAMES = [
  { x: 1.9, y: 0.0, z: 0.0, scale: 1.55, rotSpeed: 0.005, bloom: 0.75 },

  { x: -2.2, y: 0.3, z: 0.0, scale: 1.35, rotSpeed: 0.007, bloom: 0.85 },

  { x: 2.1, y: -0.3, z: 0.2, scale: 1.45, rotSpeed: 0.01, bloom: 0.95 },

  { x: 0.2, y: 0.5, z: 0.5, scale: 1.15, rotSpeed: 0.006, bloom: 1.1 },

  { x: -2.0, y: -0.4, z: 0.1, scale: 1.5, rotSpeed: 0.012, bloom: 1.3 },

  { x: 2.1, y: -0.7, z: 0.0, scale: 1.65, rotSpeed: 0.015, bloom: 1.45 },

  { x: -0.6, y: 0.0, z: 0.0, scale: 1.3, rotSpeed: 0.004, bloom: 0.8 },
]

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function smoothstep(t: number) {
  return t * t * (3 - 2 * t)
}

function interpolateKeyframes(progress: number) {
  const maxIdx = KEYFRAMES.length - 1

  const raw = progress * maxIdx

  const i = Math.min(Math.floor(raw), maxIdx - 1)

  const t = smoothstep(raw - i)

  const a = KEYFRAMES[i]

  const b = KEYFRAMES[i + 1]

  return {
    x: lerp(a.x, b.x, t),

    y: lerp(a.y, b.y, t),

    z: lerp(a.z, b.z, t),

    scale: lerp(a.scale, b.scale, t),

    rotSpeed: lerp(a.rotSpeed, b.rotSpeed, t),

    bloom: lerp(a.bloom, b.bloom, t),
  }
}

// Parallax Depth Layers

const ParallaxShapes = memo(function ParallaxShapes({
  scrollProgress,
}: {
  scrollProgress: number
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (!groupRef.current) return

    groupRef.current.rotation.y += delta * 0.05

    groupRef.current.rotation.x = Math.sin(scrollProgress * Math.PI * 2) * 0.2
  })

  const shapes = useMemo(() => {
    return [...Array(18)].map((_, i) => ({
      position: [
        Math.sin(i * 0.5) * 9,

        Math.cos(i * 0.7) * 7,

        -3 - i * 0.4,
      ] as [number, number, number],

      rotation: [
        Math.random() * Math.PI,

        Math.random() * Math.PI,

        Math.random() * Math.PI,
      ] as [number, number, number],

      scale: 0.25 + Math.random() * 0.25,

      geometry:
        i % 3 === 0
          ? "octahedron"
          : i % 3 === 1
            ? "tetrahedron"
            : "icosahedron",
    }))
  }, [])

  return (
    <group ref={groupRef} position={[0, 0, -4]}>
      {shapes.map((shape, i) => (
        <mesh
          key={i}
          position={shape.position}
          rotation={shape.rotation}
          scale={shape.scale}
        >
          {shape.geometry === "octahedron" && (
            <octahedronGeometry args={[1, 0]} />
          )}
          {shape.geometry === "tetrahedron" && (
            <tetrahedronGeometry args={[1, 0]} />
          )}
          {shape.geometry === "icosahedron" && (
            <icosahedronGeometry args={[1, 0]} />
          )}
          <meshBasicMaterial
            color="#580D18"
            transparent
            opacity={0.06}
            wireframe
          />
        </mesh>
      ))}
    </group>
  )
})

// Node Connection Lines

const NodeConnections = memo(function NodeConnections() {
  const lineRef = useRef<any>(null)

  useFrame(({ clock }) => {
    if (!lineRef.current) return

    lineRef.current.material.opacity =
      0.25 + Math.sin(clock.elapsedTime * 0.8) * 0.15
  })

  const points = useMemo(() => {
    return [
      new THREE.Vector3(...SYSTEM_NODES[0].position),

      new THREE.Vector3(...SYSTEM_NODES[1].position),

      new THREE.Vector3(...SYSTEM_NODES[2].position),

      new THREE.Vector3(...SYSTEM_NODES[0].position),

      new THREE.Vector3(...SYSTEM_NODES[3].position),

      new THREE.Vector3(...SYSTEM_NODES[1].position),

      new THREE.Vector3(...SYSTEM_NODES[3].position),

      new THREE.Vector3(...SYSTEM_NODES[2].position),
    ]
  }, [])

  return (
    <Line
      ref={lineRef}
      points={points}
      color="#812033"
      lineWidth={1.2}
      transparent
      opacity={0.25}
      dashed
      dashScale={0.5}
      dashSize={0.15}
      gapSize={0.08}
    />
  )
})

// Data Stream Particles

const DataStreamParticles = memo(function DataStreamParticles({
  selectedNode,

  renderQuality,
}: {
  selectedNode: number | null

  renderQuality: "high" | "balanced" | "low"
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null)

  const count =
    renderQuality === "low" ? 24 : renderQuality === "balanced" ? 48 : 80

  const particles = useMemo(() => {
    return [...Array(count)].map(() => ({
      progress: Math.random(),

      speed: 0.3 + Math.random() * 0.4,

      fromNode: Math.floor(Math.random() * SYSTEM_NODES.length),
    }))
  }, [])

  useFrame((_, delta) => {
    if (!meshRef.current) return

    particles.forEach((p, i) => {
      p.progress = (p.progress + delta * p.speed * 0.15) % 1

      const node = SYSTEM_NODES[p.fromNode]

      const from = new THREE.Vector3(...node.position)

      const to = new THREE.Vector3(0, 0, 0)

      const pos = from.clone().lerp(to, p.progress)

      const scale = 0.02 * (1 - p.progress * 0.7)

      tempDummyObject.position.copy(pos)

      tempDummyObject.scale.setScalar(scale)

      tempDummyObject.updateMatrix()

      meshRef.current?.setMatrixAt(i, tempDummyObject.matrix)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  if (selectedNode === null) return null

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#DB1A1A" transparent opacity={0.8} />
    </instancedMesh>
  )
})

// Instanced Dust Ring

const InstancedDustRing = memo(function InstancedDustRing({
  renderQuality,
}: {
  renderQuality: "high" | "balanced" | "low"
}) {
  const count =
    renderQuality === "low" ? 70 : renderQuality === "balanced" ? 120 : 220

  const meshRef = useRef<THREE.InstancedMesh>(null)

  const particles = useMemo(() => {
    const data = []

    for (let i = 0; i < count; i++) {
      const radius = 1.7 + Math.random() * 2.5

      const angle = Math.random() * Math.PI * 2

      const y = (Math.random() - 0.5) * 2.4

      const speed = 0.2 + Math.random() * 0.5

      const scale = 0.012 + Math.random() * 0.024

      data.push({ radius, angle, y, speed, scale })
    }

    return data
  }, [count])

  useFrame((_, delta) => {
    if (!meshRef.current) return

    particles.forEach((p, i) => {
      p.angle += delta * p.speed * 0.22

      tempDummyObject.position.set(
        Math.cos(p.angle) * p.radius,

        p.y + Math.sin(p.angle * 2) * 0.16,

        Math.sin(p.angle) * p.radius,
      )

      tempDummyObject.rotation.set(p.angle, p.angle * 0.5, 0)

      tempDummyObject.scale.setScalar(p.scale)

      tempDummyObject.updateMatrix()

      meshRef.current?.setMatrixAt(i, tempDummyObject.matrix)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color="#6E1422" transparent opacity={0.6} />
    </instancedMesh>
  )
})

// Gyro Gimbal Rings

const GyroGimbalRings = memo(function GyroGimbalRings() {
  const outerRingRef = useRef<THREE.Mesh>(null)

  const innerRingRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += delta * 0.25

      outerRingRef.current.rotation.x += delta * 0.12
    }

    if (innerRingRef.current) {
      innerRingRef.current.rotation.y -= delta * 0.35

      innerRingRef.current.rotation.z -= delta * 0.18
    }
  })

  return (
    <group>
      <mesh ref={outerRingRef}>
        <torusGeometry args={[1.55, 0.022, 16, 64]} />
        <meshStandardMaterial color="#3C0810" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh ref={innerRingRef}>
        <torusGeometry args={[1.35, 0.018, 16, 64]} />
        <meshStandardMaterial
          color="#6E1422"
          metalness={0.7}
          roughness={0.35}
        />
      </mesh>
    </group>
  )
})

// Single 3D Node Marker Badge with magnetic hover

const NodeMarkerBadgeItem = memo(function NodeMarkerBadgeItem({
  node,

  isSelected,

  isCurrentStageNode,

  onSelectNode,

  onMouseEnter,

  onMouseLeave,
}: {
  node: NodeData

  isSelected: boolean

  isCurrentStageNode: boolean

  onSelectNode: (id: number | null) => void

  onMouseEnter: () => void

  onMouseLeave: () => void
}) {
  const badgeRef = useMagneticHover<HTMLDivElement>(null, 6)

  return (
    <div
      ref={badgeRef}
      className={`node-marker-badge ${isSelected ? "selected" : ""}`}
      style={{
        opacity: isSelected ? 1 : isCurrentStageNode ? 0.95 : 0.45,
      }}
      onClick={() => onSelectNode(isSelected ? null : node.id)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span className="node-pulse-dot" />
      <span>
        [{String(node.id + 1).padStart(2, "0")}] {node.title}
      </span>
    </div>
  )
})

// World Node Markers

const WorldNodeMarkers = memo(function WorldNodeMarkers({
  activeStage,

  selectedNode,

  onSelectNode,

  onCursorState,
}: {
  activeStage: number

  selectedNode: number | null

  onSelectNode: (id: number | null) => void

  onCursorState?: (state: "default" | "hover" | "node") => void
}) {
  const handlePointerOver = useCallback(() => {
    onCursorState?.("node")
  }, [onCursorState])

  const handlePointerOut = useCallback(() => {
    onCursorState?.("default")
  }, [onCursorState])

  return (
    <>
      {SYSTEM_NODES.map((node) => {
        const isSelected = selectedNode === node.id

        const isCurrentStageNode = activeStage === node.id

        return (
          <mesh key={node.id} position={node.position}>
            <Html distanceFactor={10} center zIndexRange={[100, 0]}>
              <NodeMarkerBadgeItem
                node={node}
                isSelected={isSelected}
                isCurrentStageNode={isCurrentStageNode}
                onSelectNode={onSelectNode}
                onMouseEnter={handlePointerOver}
                onMouseLeave={handlePointerOut}
              />
            </Html>
          </mesh>
        )
      })}
    </>
  )
})

export default function Crystal3D({
  scrollProgressRef,

  scrollVelocityRef,

  selectedNode,

  onSelectNode,

  controlState = { energy: 72, speed: 1.0, phase: 4 },

  onCursorState,

  prefersReducedMotion = false,

  renderQuality = "high",
}: Crystal3DProps) {
  const crystalRef = useRef<THREE.Mesh>(null)

  const coreRef = useRef<THREE.Mesh>(null)

  const groupRef = useRef<THREE.Group>(null)

  const shaderMatRef = useRef<THREE.ShaderMaterial>(null)

  const chromaticAberrationRef = useRef<any>(null)

  const elapsed = useRef(0)

  const crystalGeo = useMemo(() => getCrystalGeo(), [])

  const shaderConfig = useMemo(() => {
    return {
      uniforms: THREE.UniformsUtils.clone(TwoToneShader.uniforms),

      vertexShader: TwoToneShader.vertexShader,

      fragmentShader: TwoToneShader.fragmentShader,

      transparent: true,

      side: THREE.DoubleSide,
    }
  }, [])

  const currentScrollProgress = scrollProgressRef.current ?? 0

  const activeStage = Math.min(Math.floor(currentScrollProgress * 6.99), 6)

  useFrame(({ camera }, delta) => {
    if (!groupRef.current || !crystalRef.current || !coreRef.current) return

    elapsed.current += delta

    const t = elapsed.current

    const progress = scrollProgressRef.current ?? 0

    const velocity = scrollVelocityRef.current ?? 0

    if (shaderMatRef.current) {
      shaderMatRef.current.uniforms.uTime.value = t

      shaderMatRef.current.uniforms.uSelectedNode.value =
        selectedNode !== null ? selectedNode : -1

      shaderMatRef.current.uniforms.uEnergyFrequency.value =
        (controlState.energy / 50) * controlState.speed
    }

    const kf = interpolateKeyframes(progress)

    const velImpact = Math.min(Math.abs(velocity) * 0.0003, 0.05)

    // Reduce rotation speed if reduced motion is preferred, but keep position movement normal

    const baseRotSpeed = prefersReducedMotion ? kf.rotSpeed * 0.2 : kf.rotSpeed

    const effectiveRotSpeed = (baseRotSpeed + velImpact) * controlState.speed

    let targetX = kf.x

    let targetY = kf.y

    let targetZ = kf.z

    if (selectedNode !== null) {
      const node = SYSTEM_NODES[selectedNode]

      targetX = -node.position[0] * 1.3

      targetY = -node.position[1] * 1.3

      targetZ = 0.8
    }

    tempTargetPos.set(targetX, targetY, targetZ)

    groupRef.current.position.lerp(tempTargetPos, 0.06)

    const currentScale = groupRef.current.scale.x

    const targetScale = selectedNode !== null ? kf.scale * 1.25 : kf.scale

    const newScale = lerp(currentScale, targetScale, 0.06)

    groupRef.current.scale.setScalar(newScale)

    crystalRef.current.rotation.x += effectiveRotSpeed * 0.75

    crystalRef.current.rotation.y += effectiveRotSpeed

    const energyMult = controlState.energy / 100

    const pulse =
      (0.85 + Math.sin(t * 2.5 * controlState.speed) * 0.15) * energyMult

    coreRef.current.scale.setScalar(pulse)

    const mat = coreRef.current.material as THREE.MeshStandardMaterial

    mat.emissiveIntensity = kf.bloom * 1.6 * pulse

    const camTargetX = selectedNode !== null ? 0 : kf.x * 0.18

    const camTargetY = selectedNode !== null ? 0 : kf.y * 0.12

    camera.position.x = lerp(camera.position.x, camTargetX, 0.04)

    camera.position.y = lerp(camera.position.y, camTargetY, 0.04)

    camera.lookAt(0, 0, 0)
  })

  return (
    <>
      {/* Lightweight environment map for metallic reflections on GyroGimbalRings */}
      <Environment preset="studio" environmentIntensity={0.4} />

      <ambientLight intensity={0.25} color="#F4F1EA" />
      <directionalLight position={[6, 9, 6]} intensity={0.6} color="#F4F1EA" />
      <pointLight
        position={[0, 0, 0]}
        intensity={3.5}
        color="#6E1422"
        distance={8}
        decay={2}
      />

      <group ref={groupRef}>
        <ParallaxShapes scrollProgress={currentScrollProgress} />
        <NodeConnections />
        <DataStreamParticles
          selectedNode={selectedNode}
          renderQuality={renderQuality}
        />

        <mesh ref={crystalRef} geometry={crystalGeo} castShadow>
          <shaderMaterial
            ref={shaderMatRef}
            attach="material"
            args={[shaderConfig]}
          />
        </mesh>

        <GyroGimbalRings />

        <mesh ref={coreRef}>
          <sphereGeometry args={[0.26, 24, 24]} />
          <meshStandardMaterial
            color="#580D18"
            emissive="#812033"
            emissiveIntensity={1.8}
            roughness={0.1}
            metalness={0.3}
          />
        </mesh>

        <InstancedDustRing renderQuality={renderQuality} />

        <WorldNodeMarkers
          activeStage={activeStage}
          selectedNode={selectedNode}
          onSelectNode={onSelectNode}
          onCursorState={onCursorState}
        />
      </group>

      <EffectComposer multisampling={0}>
        <Bloom
          luminanceThreshold={0.18}
          luminanceSmoothing={0.85}
          intensity={1.9}
          mipmapBlur
        />
      </EffectComposer>
    </>
  )
}
