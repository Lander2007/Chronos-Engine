import { useState, useEffect, useRef, useCallback, Suspense, memo, lazy } from "react"
import { Canvas } from "@react-three/fiber"
import * as THREE from "three"
import Lenis from "lenis"
import {
  Compass,
  BookOpen,
  Cpu,
  Crosshair,
  RotateCw,
  Sliders,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Volume2,
  VolumeX,
  Clock,
  Activity,
  ChevronRight,
  ChevronDown,
} from "./components/Icons"

// Lazy-load the heavy 3D component to defer 600KB+ three.js bundle
const Crystal3D = lazy(() => import("./Crystal3D"))
const ScrollStages = lazy(() => import("./ScrollStages"))

// Precision cursor with dynamic states (Memoized)
const PrecisionCursor = memo(function PrecisionCursor({
  cursorState,
  prefersReducedMotion,
}: {
  cursorState: "default" | "hover" | "node"
  prefersReducedMotion: boolean
}) {
  const dotRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: 0, y: 0 })
  const trailPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    document.body.setAttribute("data-cursor-state", cursorState)
  }, [cursorState])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      }
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    // Skip smooth trail animation if reduced motion is preferred
    if (prefersReducedMotion) {
      if (trailRef.current) {
        trailRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`
      }
      return
    }
    
    let animId: number
    const loop = () => {
      trailPos.current.x += (posRef.current.x - trailPos.current.x) * 0.18
      trailPos.current.y += (posRef.current.y - trailPos.current.y) * 0.18
      if (trailRef.current) {
        trailRef.current.style.transform = `translate3d(${trailPos.current.x}px, ${trailPos.current.y}px, 0)`
      }
      animId = requestAnimationFrame(loop)
    }
    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [prefersReducedMotion])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={trailRef} className="cursor-trail" />
    </>
  )
})

// 7 Narrative & Technical Scroll Stages Data
const NAV_STAGES = [
  { id: "stage-1", num: "01", label: "Discover", Icon: Compass },
  { id: "stage-2", num: "02", label: "Origin", Icon: BookOpen },
  { id: "stage-3", num: "03", label: "Architecture", Icon: Cpu },
  { id: "stage-4", num: "04", label: "Nodes", Icon: Crosshair },
  { id: "stage-5", num: "05", label: "Mechanics", Icon: RotateCw },
  { id: "stage-6", num: "06", label: "Control", Icon: Sliders },
  { id: "stage-7", num: "07", label: "Resolve", Icon: Sparkles },
]

const VerticalTrackNav = memo(function VerticalTrackNav({
  activeStageIndex,
  onCursorState,
}: {
  activeStageIndex: number
  onCursorState: (state: "default" | "hover" | "node") => void
}) {
  const scrollToStage = (index: number) => {
    const totalHeight =
      document.documentElement.scrollHeight - window.innerHeight
    const targetY = (index / (NAV_STAGES.length - 1)) * totalHeight
    window.scrollTo({ top: targetY, behavior: "smooth" })
  }

  return (
    <nav className="nav-track" aria-label="Chronos Engine Navigation">
      {NAV_STAGES.map((stage, idx) => {
        const isActive = activeStageIndex === idx
        const StageIcon = stage.Icon

        return (
          <button
            key={stage.id}
            onClick={() => scrollToStage(idx)}
            onMouseEnter={() => onCursorState("hover")}
            onMouseLeave={() => onCursorState("default")}
            className={`nav-track-node ${isActive ? "active" : ""}`}
            title={stage.label}
          >
            <span
              className="nav-track-label"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <StageIcon
                size={12}
                style={{ color: isActive ? "#DB1A1A" : "#580D18" }}
              />
              <span>{stage.label}</span>
              <ChevronRight
                size={10}
                style={{
                  opacity: isActive ? 1 : 0.4,
                  transform: isActive ? "translateX(2px)" : "none",
                  transition: "all 0.25s ease",
                }}
              />
            </span>
            <span className="nav-track-num">{stage.num}</span>
            <div className="nav-track-line" />
          </button>
        )
      })}
    </nav>
  )
})

// Mobile Quick Stage Ticker Bar (Memoized)
const MobileStageBar = memo(function MobileStageBar({
  activeStageIndex,
  onCursorState,
}: {
  activeStageIndex: number
  onCursorState: (state: "default" | "hover" | "node") => void
}) {
  const currentStage = NAV_STAGES[activeStageIndex] || NAV_STAGES[0]
  const StageIcon = currentStage.Icon

  const scrollToStage = (index: number) => {
    const targetIdx = Math.max(0, Math.min(NAV_STAGES.length - 1, index))
    const totalHeight =
      document.documentElement.scrollHeight - window.innerHeight
    const targetY = (targetIdx / (NAV_STAGES.length - 1)) * totalHeight
    window.scrollTo({ top: targetY, behavior: "smooth" })
  }

  return (
    <div className="mobile-stage-bar">
      <button
        onClick={() => scrollToStage(activeStageIndex - 1)}
        disabled={activeStageIndex === 0}
        style={{
          background: "transparent",
          border: "none",
          color: activeStageIndex === 0 ? "rgba(88,13,24,0.3)" : "#580D18",
          padding: "6px",
          display: "flex",
          alignItems: "center",
          cursor: activeStageIndex === 0 ? "default" : "pointer",
        }}
      >
        <ArrowLeft size={16} />
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <StageIcon size={14} style={{ color: "#DB1A1A" }} />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            fontWeight: 700,
            color: "#580D18",
            letterSpacing: "0.1em",
          }}
        >
          [{currentStage.num} / 07] {currentStage.label.toUpperCase()}
        </span>
      </div>

      <button
        onClick={() => scrollToStage(activeStageIndex + 1)}
        disabled={activeStageIndex === NAV_STAGES.length - 1}
        style={{
          background: "transparent",
          border: "none",
          color:
            activeStageIndex === NAV_STAGES.length - 1
              ? "rgba(88,13,24,0.3)"
              : "#580D18",
          padding: "6px",
          display: "flex",
          alignItems: "center",
          cursor:
            activeStageIndex === NAV_STAGES.length - 1 ? "default" : "pointer",
        }}
      >
        <ArrowRight size={16} />
      </button>
    </div>
  )
})

// Global Top Header with Direct DOM Progress Bar (Memoized)
const GlobalHeader = memo(function GlobalHeader({
  progressBarRef,
  isAudioOn,
  onToggleAudio,
  onCursorState,
}: {
  progressBarRef: React.RefObject<HTMLDivElement | null>
  isAudioOn: boolean
  onToggleAudio: () => void
  onCursorState: (state: "default" | "hover" | "node") => void
}) {
  const [timeStr, setTimeStr] = useState("00:00:00:00")

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const ms = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, "0")
      const sec = String(now.getSeconds()).padStart(2, "0")
      const min = String(now.getMinutes()).padStart(2, "0")
      const hr = String(now.getHours()).padStart(2, "0")
      setTimeStr(`${hr}:${min}:${sec}:${ms}`)
    }, 40)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <div
        ref={progressBarRef}
        className="global-progress-bar"
        style={{ width: "0%" }}
      />

      <header className="global-header">
        <div className="brand-badge">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Activity
              size={16}
              className="icon-pulse-glow"
              style={{ color: "#DB1A1A" }}
            />
            <div className="brand-dot" />
          </div>
          <span className="brand-title">CHRONOS ENGINE</span>
          <span
            className="header-meta"
            style={{
              marginLeft: "6px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Clock size={11} style={{ color: "#DB1A1A", opacity: 0.8 }} />
            <span>EPOCH {timeStr}</span>
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <button
            onClick={onToggleAudio}
            onMouseEnter={() => onCursorState("hover")}
            onMouseLeave={() => onCursorState("default")}
            style={{
              background: isAudioOn ? "rgba(219,26,26,0.08)" : "transparent",
              border:
                "1px solid " + (isAudioOn ? "#DB1A1A" : "rgba(88,13,24,0.3)"),
              color: isAudioOn ? "#DB1A1A" : "rgba(88,13,24,0.7)",
              padding: "6px 14px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.62rem",
              letterSpacing: "0.12em",
              transition: "all 0.25s ease",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: isAudioOn ? "0 0 16px rgba(219,26,26,0.2)" : "none",
            }}
          >
            {isAudioOn ? (
              <>
                <Volume2 size={13} style={{ color: "#DB1A1A" }} />
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: "2px",
                    height: "10px",
                  }}
                >
                  <span className="eq-bar eq-bar-1" />
                  <span className="eq-bar eq-bar-2" />
                  <span className="eq-bar eq-bar-3" />
                </div>
              </>
            ) : (
              <VolumeX size={13} style={{ opacity: 0.6 }} />
            )}
            <span className="header-meta">
              SOUND: {isAudioOn ? "ON (7.83Hz)" : "OFF"}
            </span>
          </button>
        </div>
      </header>
    </>
  )
})

// Branded Editorial Initial Loading Experience (Memoized)
const InitialLoader = memo(function InitialLoader({
  onEnter,
  onCursorState,
}: {
  onEnter: () => void
  onCursorState: (state: "default" | "hover" | "node") => void
}) {
  const [progress, setProgress] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setIsReady(true)
          return 100
        }
        return prev + Math.floor(Math.random() * 16 + 8)
      })
    }, 100)
    return () => clearInterval(timer)
  }, [])

  const handleEnter = () => {
    setIsDismissed(true)
    setTimeout(onEnter, 800)
  }

  if (isDismissed) return null

  return (
    <div className={`loader-overlay ${isDismissed ? "dismissed" : ""}`}>
      <div style={{ maxWidth: "440px", width: "100%", textAlign: "center" }}>
        <div
          className="brand-badge"
          style={{ justifyContent: "center", marginBottom: "24px" }}
        >
          <Sparkles
            size={20}
            className="icon-pulse-glow"
            style={{ color: "#DB1A1A" }}
          />
          <span className="brand-title" style={{ fontSize: "1.1rem" }}>
            CHRONOS ENGINE
          </span>
        </div>

        <p
          className="type-level-05"
          style={{
            marginBottom: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <Activity size={13} className="icon-pulse-glow" />
          <span>INITIALIZING NON-EUCLIDEAN TEMPORAL ARTIFACT</span>
        </p>

        <div
          style={{
            height: "3px",
            background: "rgba(88,13,24,0.15)",
            marginBottom: "16px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "#DB1A1A",
              transition: "width 0.15s ease-out",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            color: "#DB1A1A",
            marginBottom: "40px",
          }}
        >
          <span>ARTIFACT FACETS // {progress}%</span>
          <span>{isReady ? "SYSTEM ONLINE" : "LOADING"}</span>
        </div>

        {isReady && (
          <button
            className="btn-rect"
            onClick={handleEnter}
            onMouseEnter={() => onCursorState("hover")}
            onMouseLeave={() => onCursorState("default")}
            style={{ width: "100%", justifyContent: "center" }}
          >
            <span>ENTER SYSTEM</span>
            <span className="btn-arrow">
              <ArrowRight size={16} />
            </span>
          </button>
        )}
      </div>
    </div>
  )
})

// Background Grid Texture (Memoized)
const AmbientGrid = memo(function AmbientGrid() {
  return (
    <div
      className="grid-texture"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.75,
      }}
    />
  )
})

export default function App() {
  const scrollProgressRef = useRef(0)
  const scrollVelocityRef = useRef(0)
  const progressBarRef = useRef<HTMLDivElement | null>(null)

  const [activeStageIndex, setActiveStageIndex] = useState(0)
  const [selectedNode, setSelectedNode] = useState<number | null>(null)
  const [cursorState, setCursorState] = useState<"default" | "hover" | "node">(
    "default",
  )
  const [isAudioOn, setIsAudioOn] = useState(false)
  const [isSystemLoaded, setIsSystemLoaded] = useState(false)
  
  // Check for reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const [controlState, setControlState] = useState({
    energy: 72,
    speed: 1.0,
    phase: 4,
  })

  const lastScrollY = useRef(0)
  const ticking = useRef(false)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const oscRef = useRef<OscillatorNode | null>(null)
  
  // Detect reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const updateControlState = useCallback(
    (newState: Partial<typeof controlState>) => {
      setControlState((prev) => ({ ...prev, ...newState }))
    },
    [],
  )

  const toggleAudio = useCallback(() => {
    if (isAudioOn) {
      oscRef.current?.stop()
      audioCtxRef.current?.close()
      setIsAudioOn(false)
    } else {
      try {
        const ctx = new (
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext
        )()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = "sine"
        osc.frequency.setValueAtTime(7.83, ctx.currentTime)
        gain.gain.setValueAtTime(0.08, ctx.currentTime)

        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()

        audioCtxRef.current = ctx
        oscRef.current = osc
        setIsAudioOn(true)
      } catch (err) {
        console.warn("AudioContext not permitted:", err)
      }
    }
  }, [isAudioOn])

  const onScroll = useCallback(() => {
    const scrollY = window.scrollY
    if (!ticking.current) {
      requestAnimationFrame(() => {
        const docH = document.documentElement.scrollHeight - window.innerHeight
        const pct = docH > 0 ? scrollY / docH : 0
        const vel = scrollY - lastScrollY.current
        lastScrollY.current = scrollY

        scrollProgressRef.current = pct
        scrollVelocityRef.current = vel

        // Update progress bar width directly in DOM without React re-render
        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${Math.min(pct * 100, 100)}%`
        }

        // Only update activeStageIndex state when passing section boundary across 7 stages
        const newStage = Math.min(Math.floor(pct * 6.99), 6)
        setActiveStageIndex((prev) => (prev !== newStage ? newStage : prev))

        ticking.current = false
      })
      ticking.current = true
    }
  }, [])

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
    lenis.on("scroll", onScroll)

    return () => {
      lenis.destroy()
    }
  }, [onScroll])

  // Keyboard Escape shortcut listener to close open node or modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedNode(null)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const isHighDPI =
    typeof window !== "undefined" && window.devicePixelRatio > 1.5

  return (
    <div
      style={{
        background: "#F4F1EA",
        color: "#580D18",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <PrecisionCursor cursorState={cursorState} prefersReducedMotion={prefersReducedMotion} />

      <GlobalHeader
        progressBarRef={progressBarRef}
        isAudioOn={isAudioOn}
        onToggleAudio={toggleAudio}
        onCursorState={setCursorState}
      />

      <VerticalTrackNav
        activeStageIndex={activeStageIndex}
        onCursorState={setCursorState}
      />

      <MobileStageBar
        activeStageIndex={activeStageIndex}
        onCursorState={setCursorState}
      />

      <AmbientGrid />

      {!isSystemLoaded && (
        <InitialLoader
          onEnter={() => setIsSystemLoaded(true)}
          onCursorState={setCursorState}
        />
      )}

      {/* Sticky 3D Canvas Layer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 6], fov: 45 }}
          gl={{
            antialias: !isHighDPI,
            alpha: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.15,
            powerPreference: "high-performance",
          }}
          style={{ background: "transparent" }}
          dpr={[1, Math.min(window.devicePixelRatio || 1, 1.5)]}
        >
          <Suspense fallback={null}>
            <Crystal3D
              scrollProgressRef={scrollProgressRef}
              scrollVelocityRef={scrollVelocityRef}
              selectedNode={selectedNode}
              onSelectNode={setSelectedNode}
              controlState={controlState}
              onCursorState={setCursorState}
              prefersReducedMotion={prefersReducedMotion}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Scroll-Driven HTML Content Layer */}
      <main style={{ position: "relative", zIndex: 15, pointerEvents: "auto" }}>
        <Suspense fallback={null}>
          <ScrollStages
            scrollProgress={activeStageIndex / 6}
            selectedNode={selectedNode}
            onSelectNode={setSelectedNode}
            controlState={controlState}
            onControlChange={updateControlState}
            onCursorState={setCursorState}
            prefersReducedMotion={prefersReducedMotion}
          />
        </Suspense>
      </main>
    </div>
  )
}
