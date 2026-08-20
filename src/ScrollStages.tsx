import { useEffect, useRef, useState, memo } from "react"
import { useMagneticHover } from "./hooks/useMagneticHover"
import {
  Sparkles,
  Activity,
  Zap,
  Eye,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  BookOpen,
  ShieldAlert,
  Layers,
  Globe,
  Cpu,
  Radio,
  Maximize2,
  FileText,
  Crosshair,
  Target,
  CircleDot,
  X,
  RotateCw,
  RefreshCw,
  Sliders,
  Gauge,
  Clock,
  FastForward,
  Shield,
  Terminal,
  CheckCircle2,
  Compass,
} from "./components/Icons"
import { SYSTEM_NODES } from "./Crystal3D"

// Helper components that wrap buttons/links with the magnetic hover hook
const MagneticButton = memo(function MagneticButton({
  children,
  className = "",
  strength = 6,
  onClick,
  onMouseEnter,
  onMouseLeave,
  style,
  disabled,
  title,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode
  className?: string
  strength?: number
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  onMouseEnter?: (e: React.MouseEvent<HTMLButtonElement>) => void
  onMouseLeave?: (e: React.MouseEvent<HTMLButtonElement>) => void
  style?: React.CSSProperties
  disabled?: boolean
  title?: string
  "aria-label"?: string
}) {
  const ref = useMagneticHover<HTMLButtonElement>(null, strength)
  return (
    <button
      ref={ref}
      className={className}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={style}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
})

const MagneticAnchor = memo(function MagneticAnchor({
  children,
  className = "",
  strength = 6,
  href,
  onClick,
  onMouseEnter,
  onMouseLeave,
  style,
}: {
  children: React.ReactNode
  className?: string
  strength?: number
  href?: string
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
  onMouseEnter?: (e: React.MouseEvent<HTMLAnchorElement>) => void
  onMouseLeave?: (e: React.MouseEvent<HTMLAnchorElement>) => void
  style?: React.CSSProperties
}) {
  const ref = useMagneticHover<HTMLAnchorElement>(null, strength)
  return (
    <a
      ref={ref}
      href={href}
      className={className}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={style}
    >
      {children}
    </a>
  )
})

interface ControlState {
  energy: number
  speed: number
  phase: number
}

interface ScrollStagesProps {
  scrollProgress: number
  selectedNode: number | null
  onSelectNode: (id: number | null) => void
  controlState: ControlState
  onControlChange: (newState: Partial<ControlState>) => void
  onCursorState?: (state: "default" | "hover" | "node") => void
  onEnterSystem?: () => void
  prefersReducedMotion?: boolean
}

type EntranceConfig = {
  delayMs?: number
  translateY?: number
  translateX?: number
}

function useEntrance(
  threshold = 0.2,
  prefersReducedMotion = false,
  config: EntranceConfig = {},
) {
  const { delayMs = 0, translateY = 0, translateX = 0 } = config
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const easing = "cubic-bezier(0.16, 1, 0.3, 1)"
    const hasMotion = translateY !== 0 || translateX !== 0
    const baseTransition = `opacity 0.8s ${easing}`
    const motionTransition = hasMotion
      ? `${baseTransition}, transform 0.8s ${easing}`
      : baseTransition

    if (prefersReducedMotion) {
      el.style.opacity = "0"
      if (hasMotion) {
        el.style.transform = "translate3d(0,0,0)"
      }
      el.style.transition = baseTransition
    } else if (hasMotion) {
      el.style.opacity = "0"
      el.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`
      el.style.transition = motionTransition
      if (delayMs > 0) {
        el.style.transitionDelay = `${delayMs}ms`
      }
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1"
          el.style.transform = "translate3d(0,0,0)"
          obs.disconnect()
        }
      },
      { threshold },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold, prefersReducedMotion, delayMs, translateY, translateX])

  return ref
}

function uppercase(str: string) {
  return str.toUpperCase()
}

const OriginManifestoCard = memo(function OriginManifestoCard({
  onCursorState,
  prefersReducedMotion,
}: {
  onCursorState?: (state: "default" | "hover" | "node") => void
  prefersReducedMotion?: boolean
}) {
  const ref = useEntrance(0.2, prefersReducedMotion)
  const [activeStoryIdx, setActiveStoryIdx] = useState(0)

  const stories = [
    {
      num: "01",
      title: "PRE-SPACETIME ANOMALY",
      subtitle: "ORIGIN EPOCH // -4.1 × 10¹² YEARS",
      content:
        "The core predates the Big Bang and thermodynamic entropy. Its interior geometry violates Euclidean constraints — facets absorb light waves before arrival.",
      Icon: ShieldAlert,
    },
    {
      num: "02",
      title: "THE BURGUNDY MATRIX",
      subtitle: "MATERIAL SPECTRA // BOROSILICATE",
      content:
        "Constructed from a controlled burgundy tonal crystal lattice that decelerates relativistic timeline degradation and holds high-frequency flux in equilibrium.",
      Icon: Layers,
    },
    {
      num: "03",
      title: "RELATIVISTIC OBSERVATION",
      subtitle: "STABILIZATION // SCHUMANN LOCK",
      content:
        "Humankind constructed the dual-ring gyroscopic gimbals to safely observe temporal shifts without disturbing local timeline causality.",
      Icon: Globe,
    },
  ]

  const ActiveIcon = stories[activeStoryIdx].Icon

  return (
    <div
      ref={ref}
      className="info-card"
      style={{
        opacity: 0,
        transform: "translate3d(-40px, 0, 0)",
        transition:
          "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="section-meta-header">
        <span
          className="section-tag"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          <BookOpen size={13} style={{ color: "#DB1A1A" }} />
          <span>02 // ORIGIN & ANOMALY CODEX</span>
        </span>
        <span className="section-num">ORIGIN</span>
      </div>

      <h3 className="type-level-03" style={{ marginBottom: "16px" }}>
        THE CHRONOS MANIFESTO
      </h3>

      <p
        className="type-level-04"
        style={{ marginBottom: "24px", fontSize: "0.92rem" }}
      >
        Select a codex entry below to explore how Chronos Engine stabilizes
        non-Euclidean temporal anomalies.
      </p>

      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        {stories.map((s, idx) => {
          const StoryIcon = s.Icon
          const isActive = activeStoryIdx === idx
          return (
            <button
              key={s.num}
              onClick={() => setActiveStoryIdx(idx)}
              onMouseEnter={() => onCursorState?.("hover")}
              onMouseLeave={() => onCursorState?.("default")}
              style={{
                flex: 1,
                padding: "10px 8px",
                background: isActive ? "#DB1A1A" : "rgba(88,13,24,0.04)",
                color: isActive ? "#F4F1EA" : "#580D18",
                border:
                  "1px solid " + (isActive ? "#DB1A1A" : "rgba(88,13,24,0.16)"),
                fontFamily: "var(--font-mono)",
                fontSize: "0.68rem",
                fontWeight: 700,
                transition: "all 0.25s ease",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              <StoryIcon
                size={12}
                style={{ color: isActive ? "#F4F1EA" : "#DB1A1A" }}
              />
              <span>{s.num} CODEX</span>
            </button>
          )
        })}
      </div>

      <div
        style={{
          background: "#3C0810",
          color: "#F4F1EA",
          padding: "24px",
          borderLeft: "3px solid #DB1A1A",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "6px",
          }}
        >
          <span className="type-level-05" style={{ color: "#DB1A1A" }}>
            {stories[activeStoryIdx].subtitle}
          </span>
          <ActiveIcon size={16} style={{ color: "#DB1A1A", opacity: 0.85 }} />
        </div>
        <h4
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "1.1rem",
            marginBottom: "12px",
            color: "#F4F1EA",
          }}
        >
          {stories[activeStoryIdx].title}
        </h4>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.92rem",
            lineHeight: 1.7,
            color: "rgba(244,241,234,0.85)",
          }}
        >
          {stories[activeStoryIdx].content}
        </p>
      </div>
    </div>
  )
})

const TechnicalSpecCard = memo(function TechnicalSpecCard({
  onOpenFullSpecs,
  onCursorState,
}: {
  onOpenFullSpecs: () => void
  onCursorState?: (state: "default" | "hover" | "node") => void
}) {
  const ref = useEntrance(0.2)
  const [activeTab, setActiveTab] = useState<"core" | "optics" | "telemetry">(
    "core",
  )

  return (
    <div
      ref={ref}
      className="info-card"
      style={{
        opacity: 0,
        transform: "translate3d(40px, 0, 0)",
        transition:
          "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="section-meta-header">
        <span
          className="section-tag"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          <Cpu size={13} style={{ color: "#DB1A1A" }} />
          <span>03 // ARCHITECTURE & GEOMETRY</span>
        </span>
        <span className="section-num">ARCHITECTURE</span>
      </div>

      <h3 className="type-level-03" style={{ marginBottom: "16px" }}>
        FACETED TEMPORAL ARCHITECTURE
      </h3>

      <p
        className="type-level-04"
        style={{ marginBottom: "24px", fontSize: "0.92rem" }}
      >
        Precision engineered borosilicate facets paired with dual gyroscopic
        stabilization rings.
      </p>

      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "20px",
          borderBottom: "1px solid rgba(88,13,24,0.12)",
          paddingBottom: "10px",
          flexWrap: "wrap",
        }}
      >
        {[
          { id: "core", label: "CORE", Icon: Cpu },
          { id: "optics", label: "OPTICS", Icon: Eye },
          { id: "telemetry", label: "TELEMETRY", Icon: Activity },
        ].map((tab) => {
          const TabIcon = tab.Icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(tab.id as "core" | "optics" | "telemetry")
              }
              onMouseEnter={() => onCursorState?.("hover")}
              onMouseLeave={() => onCursorState?.("default")}
              style={{
                background: isActive ? "#DB1A1A" : "transparent",
                color: isActive ? "#F4F1EA" : "#580D18",
                border:
                  "1px solid " + (isActive ? "#DB1A1A" : "rgba(88,13,24,0.2)"),
                padding: "6px 14px",
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                letterSpacing: "0.12em",
                transition: "all 0.25s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <TabIcon
                size={12}
                style={{ color: isActive ? "#F4F1EA" : "#DB1A1A" }}
              />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      <div style={{ display: "grid", gap: "14px", marginBottom: "28px" }}>
        {activeTab === "core" &&
          [
            ["GEOMETRY TYPE", "Displaced Faceted Icosahedron ∂²"],
            ["FACET DISPLACEMENT", "±0.24 Unit Non-Euclidean"],
            ["INNER RESONATOR", "Schumann-Locked Sphere (7.83Hz)"],
            ["MASS DISPLACEMENT", "∞ (non-Newtonian Tensor)"],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid rgba(88,13,24,0.08)",
                paddingBottom: "8px",
                flexWrap: "wrap",
                gap: "4px",
              }}
            >
              <span
                className="type-level-05"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Radio size={10} style={{ color: "#DB1A1A", opacity: 0.7 }} />
                <span>{label}</span>
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  color: "#580D18",
                }}
              >
                {value}
              </span>
            </div>
          ))}

        {activeTab === "optics" &&
          [
            ["REFRACTION INDEX", "1.650 (Borosilicate-grade)"],
            ["FRESNEL SPECTRUM", "Multi-Layer Crimson Rim"],
            ["SURFACE TRANSMISSION", "94.8% Relativistic Alpha"],
            ["LIGHT WAVELENGTH", "480nm - 720nm Crimson"],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid rgba(88,13,24,0.08)",
                paddingBottom: "8px",
              }}
            >
              <span
                className="type-level-05"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Eye size={10} style={{ color: "#DB1A1A", opacity: 0.7 }} />
                <span>{label}</span>
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  color: "#580D18",
                }}
              >
                {value}
              </span>
            </div>
          ))}

        {activeTab === "telemetry" &&
          [
            ["CORE OUTPUT", "94.2 TW  /  STABLE"],
            ["PHASE COHERENCE", "99.98% Synced"],
            ["FLUX VELOCITY", "0.003 δ / sec"],
            ["ENTROPY VECTOR", "Zero-State Lock"],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid rgba(88,13,24,0.08)",
                paddingBottom: "8px",
              }}
            >
              <span
                className="type-level-05"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Activity
                  size={10}
                  style={{ color: "#DB1A1A", opacity: 0.7 }}
                />
                <span>{label}</span>
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  color: "#580D18",
                }}
              >
                {value}
              </span>
            </div>
          ))}
      </div>

      <MagneticButton
        className="btn-rect"
        onClick={onOpenFullSpecs}
        onMouseEnter={() => onCursorState?.("hover")}
        onMouseLeave={() => onCursorState?.("default")}
        style={{ width: "100%", justifyContent: "center" }}
      >
        <span>FULL SPECIFICATION DOSSIER</span>
        <span className="btn-arrow">
          <ArrowRight size={15} />
        </span>
      </MagneticButton>
    </div>
  )
})

const NodeDiscoveryCard = memo(function NodeDiscoveryCard({
  selectedNode,
  onSelectNode,
  onCursorState,
}: {
  selectedNode: number | null
  onSelectNode: (id: number | null) => void
  onCursorState?: (state: "default" | "hover" | "node") => void
}) {
  const ref = useEntrance(0.2)

  return (
    <div
      ref={ref}
      className="info-card"
      style={{
        opacity: 0,
        transform: "translate3d(-40px, 0, 0)",
        transition:
          "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="section-meta-header">
        <span
          className="section-tag"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          <Crosshair size={13} style={{ color: "#DB1A1A" }} />
          <span>04 // SYSTEM NODES & AGENCY</span>
        </span>
        <span className="section-num">NODES</span>
      </div>

      <h3 className="type-level-03" style={{ marginBottom: "16px" }}>
        DIRECT SYSTEM INSPECTION
      </h3>

      <p
        className="type-level-04"
        style={{ marginBottom: "24px", fontSize: "0.92rem" }}
      >
        Select any node marker pinned to the 3D artifact to center the camera,
        highlight material facets, and open full diagnostic readouts.
      </p>

      <div style={{ display: "grid", gap: "12px", marginBottom: "24px" }}>
        {SYSTEM_NODES.map((node) => {
          const isSelected = selectedNode === node.id
          return (
            <button
              key={node.id}
              onClick={() => onSelectNode(isSelected ? null : node.id)}
              onMouseEnter={() => onCursorState?.("node")}
              onMouseLeave={() => onCursorState?.("default")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 18px",
                background: isSelected ? "#DB1A1A" : "rgba(88,13,24,0.04)",
                color: isSelected ? "#F4F1EA" : "#580D18",
                border:
                  "1px solid " +
                  (isSelected ? "#DB1A1A" : "rgba(88,13,24,0.16)"),
                transition: "all 0.3s ease",
                textAlign: "left",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <Target
                  size={15}
                  style={{ color: isSelected ? "#F4F1EA" : "#DB1A1A" }}
                />
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.65rem",
                      opacity: 0.7,
                    }}
                  >
                    [{String(node.id + 1).padStart(2, "0")}] {node.subtitle}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "0.88rem",
                    }}
                  >
                    {node.title}
                  </div>
                </div>
              </div>
              <span
                className="btn-arrow"
                style={{ display: "inline-flex", alignItems: "center" }}
              >
                {isSelected ? <X size={16} /> : <ChevronRight size={16} />}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
})

const TemporalMechanicsCard = memo(function TemporalMechanicsCard({
  onCursorState,
}: {
  onCursorState?: (state: "default" | "hover" | "node") => void
}) {
  const ref = useEntrance(0.2)
  const [activeStep, setActiveStep] = useState<0 | 1 | 2>(0)

  const steps = [
    {
      step: "STEP 01",
      title: "FLUX CAPTURE",
      desc: "Zero-point temporal waves pass into the displaced borosilicate facets, slowing un-arrived photons.",
      metric: "DISPLACEMENT // 0.003 δ",
      Icon: Zap,
    },
    {
      step: "STEP 02",
      title: "GYROSCOPIC CANCELLATION",
      desc: "Dual oxblood gimbals counter-rotate, absorbing relativistic gravitational torque and eliminating time drift.",
      metric: "TORQUE // ZERO-STATE",
      Icon: RefreshCw,
    },
    {
      step: "STEP 03",
      title: "HARMONIC EMISSION",
      desc: "The central core emits coherent 7.83Hz Schumann resonance waves, yielding 94.2 TW stable output.",
      metric: "OUTPUT // 94.2 TW",
      Icon: Radio,
    },
  ]

  const ActiveStepIcon = steps[activeStep].Icon

  return (
    <div
      ref={ref}
      className="info-card"
      style={{
        opacity: 0,
        transform: "translate3d(40px, 0, 0)",
        transition:
          "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="section-meta-header">
        <span
          className="section-tag"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          <RotateCw size={13} style={{ color: "#DB1A1A" }} />
          <span>05 // TEMPORAL MECHANICS & PROCESS</span>
        </span>
        <span className="section-num">MECHANICS</span>
      </div>

      <h3 className="type-level-03" style={{ marginBottom: "16px" }}>
        HOW THE ENGINE OPERATES
      </h3>

      <p
        className="type-level-04"
        style={{ marginBottom: "24px", fontSize: "0.92rem" }}
      >
        The 3-stage physical energy conversion loop operating continuously
        inside Chronos Engine.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
          gap: "8px",
          marginBottom: "20px",
        }}
      >
        {steps.map((st, idx) => {
          const StepIcon = st.Icon
          const isActive = activeStep === idx
          return (
            <button
              key={st.step}
              onClick={() => setActiveStep(idx as 0 | 1 | 2)}
              onMouseEnter={() => onCursorState?.("hover")}
              onMouseLeave={() => onCursorState?.("default")}
              style={{
                padding: "8px 4px",
                background: isActive ? "#DB1A1A" : "rgba(88,13,24,0.04)",
                color: isActive ? "#F4F1EA" : "#580D18",
                border:
                  "1px solid " + (isActive ? "#DB1A1A" : "rgba(88,13,24,0.16)"),
                fontFamily: "var(--font-mono)",
                fontSize: "0.62rem",
                fontWeight: 700,
                textAlign: "center",
                transition: "all 0.25s ease",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <StepIcon
                size={12}
                style={{ color: isActive ? "#F4F1EA" : "#DB1A1A" }}
              />
              <span>{st.step}</span>
            </button>
          )
        })}
      </div>

      <div
        style={{
          background: "#3C0810",
          color: "#F4F1EA",
          padding: "24px",
          borderLeft: "3px solid #DB1A1A",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <span
            className="type-level-05"
            style={{
              color: "#DB1A1A",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <ActiveStepIcon size={13} />
            <span>{steps[activeStep].step}</span>
          </span>
          <span className="type-level-05" style={{ color: "#DB1A1A" }}>
            {steps[activeStep].metric}
          </span>
        </div>
        <h4
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "1.15rem",
            marginBottom: "12px",
            color: "#F4F1EA",
          }}
        >
          {steps[activeStep].title}
        </h4>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.92rem",
            lineHeight: 1.7,
            color: "rgba(244,241,234,0.85)",
          }}
        >
          {steps[activeStep].desc}
        </p>
      </div>
    </div>
  )
})

const FieldNoteQuoteSection = memo(function FieldNoteQuoteSection({
  prefersReducedMotion,
}: {
  prefersReducedMotion?: boolean
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useEntrance(0.2, prefersReducedMotion ?? false, {
    translateY: 20,
  })

  // IntersectionObserver to fade NavTrack & MobileStageBar when Field Note Quote section is in viewport
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          document.body.classList.add("in-field-note")
        } else {
          document.body.classList.remove("in-field-note")
        }
      },
      { threshold: 0.25 },
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      document.body.classList.remove("in-field-note")
    }
  }, [])

  return (
    <section
      id="field-note-quote"
      ref={sectionRef}
      className="field-note-quote"
      aria-label="Chronos Engine field notes"
    >
      <div className="field-note-decor" aria-hidden="true">
        <div className="field-note-glow-ring" />
        <div className="field-note-line-ring" />
      </div>

      <div ref={contentRef} className="field-note-content">
        <blockquote className="field-note-quote-text">
          &ldquo;To observe time is to discover that you are already inside the
          experiment.&rdquo;
        </blockquote>

        <p className="field-note-caption">
          &mdash; CHRONOS ENGINE FIELD NOTES / ENTRY 04
        </p>
      </div>
    </section>
  )
})

const TEMPORAL_FIELD_ITEMS = [
  {
    num: "01",
    title: "Potential",
    body: "Before the first tick, time is not yet a line. It is a field of possible directions, held in tension by the artifact.",
  },
  {
    num: "02",
    title: "Expansion",
    body: "The present opens. A moment becomes measurable. Distance appears between what was and what is about to be.",
  },
  {
    num: "03",
    title: "Resonance",
    body: "Memory leaves a trace. Events do not disappear. Their pressure travels through the field as a signal we can still read.",
  },
  {
    num: "04",
    title: "Return",
    body: "Nothing arrives unchanged. The loop closes without repeating itself. What returns carries the imprint of the journey.",
  },
] as const

const TemporalFieldItemView = memo(function TemporalFieldItemView({
  num,
  title,
  body,
  index,
  isActive,
  onHover,
  prefersReducedMotion,
}: {
  num: string
  title: string
  body: string
  index: number
  isActive: boolean
  onHover: (index: number) => void
  prefersReducedMotion?: boolean
}) {
  const ref = useEntrance(0.15, prefersReducedMotion ?? false, {
    translateY: 16,
    delayMs: prefersReducedMotion ? 0 : index * 80,
  })

  return (
    <div
      ref={ref}
      className={`temporal-field-item ${isActive ? "active" : ""}`}
      onMouseEnter={() => onHover(index)}
      style={{ opacity: 0 }}
    >
      <div className="temporal-field-divider" />
      <div className="temporal-field-item-header">
        <span className="temporal-field-num">{num}</span>
        <h3 className="temporal-field-title">{title}</h3>
      </div>
      <p className="temporal-field-body">{body}</p>
    </div>
  )
})

const TemporalFieldSection = memo(function TemporalFieldSection({
  prefersReducedMotion,
}: {
  prefersReducedMotion?: boolean
}) {
  const [activeIndex, setActiveIndex] = useState(2) // Default item 03 active
  const introRef = useEntrance(0.2, prefersReducedMotion ?? false, {
    translateX: -20,
  })

  return (
    <section
      id="temporal-field"
      aria-label="The temporal field"
      className="temporal-field-section"
    >
      <div className="temporal-field-grid">
        {/* Left Column */}
        <div ref={introRef} style={{ opacity: 0 }}>
          {/* Top-left Decorative Instrument Icon */}
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            aria-hidden="true"
            style={{ marginBottom: "32px", display: "block" }}
          >
            <circle
              cx="18"
              cy="18"
              r="16"
              stroke="rgba(218, 165, 32, 0.4)"
              strokeWidth="1.5"
            />
            <circle cx="18" cy="18" r="3" fill="rgba(212, 175, 55, 0.6)" />
          </svg>

          <p
            className="type-level-05"
            style={{ marginBottom: "20px", color: "#DAA520" }}
          >
            THE TEMPORAL FIELD
          </p>

          <h2 className="temporal-field-headline">
            Four ways a moment can move.
          </h2>

          <p className="temporal-field-intro">
            There is no single direction here. Explore the instrument as a
            sequence, or treat each stage as its own weather system.
          </p>

          {/* Bottom Decorative Icon */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            style={{ display: "block", marginTop: "56px", opacity: 0.3 }}
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="rgba(218, 165, 32, 0.5)"
              strokeWidth="1"
            />
            <circle cx="12" cy="12" r="2" fill="rgba(212, 175, 55, 0.7)" />
          </svg>
        </div>

        {/* Right Column */}
        <div>
          {/* Meta Status Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "10px",
              marginBottom: "48px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#D4AF37",
                boxShadow: "0 0 8px rgba(218, 165, 32, 0.6)",
              }}
            />
            <span style={{ color: "rgba(244, 241, 234, 0.8)" }}>
              Signal nominal
            </span>
            <span style={{ opacity: 0.5, color: "rgba(244, 241, 234, 0.6)" }}>
              CE-04 / 2024
            </span>
          </div>

          {/* Plain Divided List */}
          <div className="temporal-field-list">
            {TEMPORAL_FIELD_ITEMS.map((item, index) => (
              <TemporalFieldItemView
                key={item.num}
                num={item.num}
                title={item.title}
                body={item.body}
                index={index}
                isActive={index === activeIndex}
                onHover={setActiveIndex}
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
})

const ControlDashboard = memo(function ControlDashboard({
  controlState,
  onControlChange,
  onCursorState,
}: {
  controlState: ControlState
  onControlChange: (newState: Partial<ControlState>) => void
  onCursorState?: (state: "default" | "hover" | "node") => void
}) {
  const ref = useEntrance(0.2)

  const isStabilizeActive =
    controlState.energy === 72 && Math.abs(controlState.speed - 1.0) < 0.05
  const isMaximizeActive =
    controlState.energy === 100 && Math.abs(controlState.speed - 2.5) < 0.05
  const isZeroDriftActive =
    controlState.energy === 45 && Math.abs(controlState.speed - 0.4) < 0.05

  return (
    <div
      ref={ref}
      className="info-card"
      style={{
        opacity: 0,
        transform: "translate3d(40px, 0, 0)",
        transition:
          "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="section-meta-header">
        <span
          className="section-tag"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          <Sliders size={13} style={{ color: "#DB1A1A" }} />
          <span>06 // REAL-TIME ENGINE CONTROL</span>
        </span>
        <span className="section-num">CONTROL</span>
      </div>

      <h3 className="type-level-03" style={{ marginBottom: "20px" }}>
        SYSTEM STATE FEEDBACK
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "12px",
          marginBottom: "28px",
        }}
      >
        <div
          style={{
            background: "#3C0810",
            color: "#F4F1EA",
            padding: "14px",
            borderLeft: "3px solid #812033",
          }}
        >
          <div
            className="type-level-05"
            style={{
              color: "#914354",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <CheckCircle2 size={12} style={{ color: "#DB1A1A" }} />
            <span>SYSTEM STATE</span>
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "1.05rem",
              color: "#F4F1EA",
              marginTop: "4px",
            }}
          >
            ACTIVE
          </div>
        </div>

        <div
          style={{
            background: "#3C0810",
            color: "#F4F1EA",
            padding: "14px",
            borderLeft: "3px solid #6E1422",
          }}
        >
          <div
            className="type-level-05"
            style={{
              color: "#914354",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Zap size={12} style={{ color: "#DB1A1A" }} />
            <span>RESONANCE</span>
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "1.05rem",
              color: "#F4F1EA",
              marginTop: "4px",
            }}
          >
            {controlState.energy}%
          </div>
        </div>

        <div
          style={{
            background: "#3C0810",
            color: "#F4F1EA",
            padding: "14px",
            borderLeft: "3px solid #6E1422",
          }}
        >
          <div
            className="type-level-05"
            style={{
              color: "#914354",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Gauge size={12} style={{ color: "#DB1A1A" }} />
            <span>ROTATION SPEED</span>
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "1.05rem",
              color: "#F4F1EA",
              marginTop: "4px",
            }}
          >
            {controlState.speed.toFixed(1)}x
          </div>
        </div>

        <div
          style={{
            background: "#3C0810",
            color: "#F4F1EA",
            padding: "14px",
            borderLeft: "3px solid #812033",
          }}
        >
          <div
            className="type-level-05"
            style={{
              color: "#914354",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Clock size={12} style={{ color: "#DB1A1A" }} />
            <span>PHASE LOCK</span>
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "1.05rem",
              color: "#F4F1EA",
              marginTop: "4px",
            }}
          >
            0{controlState.phase}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gap: "20px" }}>
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span
              className="type-level-05"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Zap size={12} style={{ color: "#DB1A1A" }} />
              <span>ENERGY RESONANCE AMPLITUDE</span>
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: "#580D18",
                fontWeight: 700,
              }}
            >
              {controlState.energy}%
            </span>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            value={controlState.energy}
            onChange={(e) =>
              onControlChange({ energy: Number(e.target.value) })
            }
            onMouseEnter={() => onCursorState?.("hover")}
            onMouseLeave={() => onCursorState?.("default")}
            className="control-slider"
          />
        </div>

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span
              className="type-level-05"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <FastForward size={12} style={{ color: "#DB1A1A" }} />
              <span>TEMPORAL ROTATION VELOCITY</span>
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: "#580D18",
                fontWeight: 700,
              }}
            >
              {controlState.speed.toFixed(1)}x
            </span>
          </div>
          <input
            type="range"
            min="0.2"
            max="3.0"
            step="0.1"
            value={controlState.speed}
            onChange={(e) => onControlChange({ speed: Number(e.target.value) })}
            onMouseEnter={() => onCursorState?.("hover")}
            onMouseLeave={() => onCursorState?.("default")}
            className="control-slider"
          />
        </div>

        {/* Quick Calibration Presets */}
        <div
          style={{
            paddingTop: "20px",
            borderTop: "1px solid rgba(88,13,24,0.12)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <span className="type-level-05" style={{ color: "#DB1A1A" }}>
              AUTOMATED CALIBRATION PRESETS
            </span>
            {isStabilizeActive || isMaximizeActive || isZeroDriftActive ? (
              <span
                className="type-level-05"
                style={{ color: "#DB1A1A", fontSize: "0.6rem" }}
              >
                ● LOCKED
              </span>
            ) : (
              <span
                className="type-level-05"
                style={{ opacity: 0.5, fontSize: "0.6rem" }}
              >
                CUSTOM TUNED
              </span>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
              gap: "8px",
            }}
          >
            <button
              onClick={() =>
                onControlChange({ energy: 72, speed: 1.0, phase: 4 })
              }
              onMouseEnter={() => onCursorState?.("hover")}
              onMouseLeave={() => onCursorState?.("default")}
              style={{
                padding: "10px 4px",
                background: isStabilizeActive
                  ? "#DB1A1A"
                  : "rgba(88,13,24,0.04)",
                borderColor: isStabilizeActive
                  ? "#DB1A1A"
                  : "rgba(88,13,24,0.18)",
                borderStyle: "solid",
                borderWidth: "1px",
                color: isStabilizeActive ? "#F4F1EA" : "#580D18",
                fontFamily: "var(--font-mono)",
                fontSize: "0.62rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                boxShadow: isStabilizeActive
                  ? "0 6px 20px rgba(219, 26, 26, 0.4)"
                  : "none",
                transform: isStabilizeActive ? "translateY(-2px)" : "none",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
              }}
            >
              <Shield size={11} />
              <span>{isStabilizeActive ? "STABILIZED" : "STABILIZE"}</span>
            </button>

            <button
              onClick={() =>
                onControlChange({ energy: 100, speed: 2.5, phase: 8 })
              }
              onMouseEnter={() => onCursorState?.("hover")}
              onMouseLeave={() => onCursorState?.("default")}
              style={{
                padding: "10px 4px",
                background: isMaximizeActive
                  ? "#DB1A1A"
                  : "rgba(88,13,24,0.04)",
                borderColor: isMaximizeActive
                  ? "#DB1A1A"
                  : "rgba(88,13,24,0.18)",
                borderStyle: "solid",
                borderWidth: "1px",
                color: isMaximizeActive ? "#F4F1EA" : "#580D18",
                fontFamily: "var(--font-mono)",
                fontSize: "0.62rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                boxShadow: isMaximizeActive
                  ? "0 6px 20px rgba(219, 26, 26, 0.4)"
                  : "none",
                transform: isMaximizeActive ? "translateY(-2px)" : "none",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
              }}
            >
              <Zap size={11} />
              <span>{isMaximizeActive ? "MAXIMIZED" : "MAXIMIZE"}</span>
            </button>

            <button
              onClick={() =>
                onControlChange({ energy: 45, speed: 0.4, phase: 1 })
              }
              onMouseEnter={() => onCursorState?.("hover")}
              onMouseLeave={() => onCursorState?.("default")}
              style={{
                padding: "10px 4px",
                background: isZeroDriftActive
                  ? "#DB1A1A"
                  : "rgba(88,13,24,0.04)",
                borderColor: isZeroDriftActive
                  ? "#DB1A1A"
                  : "rgba(88,13,24,0.18)",
                borderStyle: "solid",
                borderWidth: "1px",
                color: isZeroDriftActive ? "#F4F1EA" : "#580D18",
                fontFamily: "var(--font-mono)",
                fontSize: "0.62rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                boxShadow: isZeroDriftActive
                  ? "0 6px 20px rgba(219, 26, 26, 0.4)"
                  : "none",
                transform: isZeroDriftActive ? "translateY(-2px)" : "none",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
              }}
            >
              <Target size={11} />
              <span>{isZeroDriftActive ? "ZERO DRIFT" : "ZERO DRIFT"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
})

export default function ScrollStages({
  scrollProgress: _,
  selectedNode,
  onSelectNode,
  controlState,
  onControlChange,
  onCursorState,
  prefersReducedMotion = false,
}: ScrollStagesProps) {
  const [isSpecDrawerOpen, setIsSpecDrawerOpen] = useState(false)
  const activeNodeData =
    selectedNode !== null ? SYSTEM_NODES[selectedNode] : null

  return (
    <div style={{ position: "relative", zIndex: 5 }}>
      {/* Node Inspection Floating Window Modal */}
      <div
        className={`modal-float-backdrop ${activeNodeData ? "open" : ""}`}
        onClick={() => onSelectNode(null)}
      >
        <div className="modal-float-panel" onClick={(e) => e.stopPropagation()}>
          <MagneticButton
            className="modal-float-close"
            aria-label="Close diagnostic modal"
            onClick={() => onSelectNode(null)}
            onMouseEnter={() => onCursorState?.("hover")}
            onMouseLeave={() => onCursorState?.("default")}
          >
            <X size={16} />
          </MagneticButton>
          {activeNodeData && (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                <span
                  className="type-level-05"
                  style={{
                    color: "#DB1A1A",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Terminal size={14} />
                  <span>NODE DIAGNOSTIC INSPECTION</span>
                </span>
                <span
                  style={{
                    height: "1px",
                    flex: 1,
                    background: "rgba(219,26,26,0.2)",
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.65rem",
                    color: "#DB1A1A",
                    opacity: 0.8,
                  }}
                >
                  [{String(activeNodeData.id + 1).padStart(2, "0")}]{" "}
                  {activeNodeData.subtitle}
                </span>
              </div>

              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "clamp(1.5rem, 3.2vw, 2.4rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  color: "#DB1A1A",
                  marginBottom: "16px",
                }}
              >
                {activeNodeData.title}
              </h2>

              <p
                className="type-level-04"
                style={{
                  marginBottom: "32px",
                  fontSize: "0.92rem",
                  maxWidth: "600px",
                }}
              >
                {activeNodeData.description}
              </p>

              <div
                style={{
                  borderTop: "1px solid rgba(88,13,24,0.15)",
                  paddingTop: "24px",
                  marginBottom: "32px",
                }}
              >
                <div
                  className="type-level-05"
                  style={{
                    marginBottom: "18px",
                    color: "#DB1A1A",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Activity size={13} />
                  <span>TELEMETRY PARAMETERS</span>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: "14px",
                  }}
                >
                  {activeNodeData.metrics.map((m) => (
                    <div
                      key={m.label}
                      style={{
                        background: "rgba(60, 8, 16, 0.04)",
                        border: "1px solid rgba(88, 13, 24, 0.12)",
                        borderLeft: "3px solid #DB1A1A",
                        padding: "14px 18px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                      }}
                    >
                      <span
                        className="type-level-05"
                        style={{ fontSize: "0.6rem", color: "#DB1A1A" }}
                      >
                        {m.label}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          color: "#3C0810",
                        }}
                      >
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{ display: "flex", gap: "12px", marginBottom: "20px" }}
              >
                <MagneticButton
                  className="btn-rect btn-rect-secondary"
                  onClick={() =>
                    onSelectNode(
                      activeNodeData
                        ? (activeNodeData.id + SYSTEM_NODES.length - 1) %
                            SYSTEM_NODES.length
                        : null,
                    )
                  }
                  onMouseEnter={() => onCursorState?.("hover")}
                  onMouseLeave={() => onCursorState?.("default")}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    padding: "12px 14px",
                    fontSize: "0.68rem",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <ArrowLeft size={14} />
                    <span>PREV NODE</span>
                  </span>
                </MagneticButton>
                <MagneticButton
                  className="btn-rect btn-rect-secondary"
                  onClick={() =>
                    onSelectNode(
                      activeNodeData
                        ? (activeNodeData.id + 1) % SYSTEM_NODES.length
                        : null,
                    )
                  }
                  onMouseEnter={() => onCursorState?.("hover")}
                  onMouseLeave={() => onCursorState?.("default")}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    padding: "12px 14px",
                    fontSize: "0.68rem",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span>NEXT NODE</span>
                    <ArrowRight size={14} />
                  </span>
                </MagneticButton>
              </div>

              <MagneticButton
                className="btn-rect"
                onClick={() => onSelectNode(null)}
                onMouseEnter={() => onCursorState?.("hover")}
                onMouseLeave={() => onCursorState?.("default")}
                style={{ width: "100%", justifyContent: "center" }}
              >
                <span>RETURN TO SYSTEM VIEW</span>
                <span className="btn-arrow">
                  <ArrowRight size={16} />
                </span>
              </MagneticButton>
            </div>
          )}
        </div>
      </div>

      {/* Specifications Dossier Floating Window Modal */}
      <div
        className={`modal-float-backdrop ${isSpecDrawerOpen ? "open" : ""}`}
        onClick={() => setIsSpecDrawerOpen(false)}
      >
        <div className="modal-float-panel" onClick={(e) => e.stopPropagation()}>
          <MagneticButton
            className="modal-float-close"
            aria-label="Close specification dossier"
            onClick={() => setIsSpecDrawerOpen(false)}
            onMouseEnter={() => onCursorState?.("hover")}
            onMouseLeave={() => onCursorState?.("default")}
          >
            <X size={16} />
          </MagneticButton>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <span
                className="type-level-05"
                style={{
                  color: "#DB1A1A",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <ShieldAlert size={14} />
                <span>CLASSIFIED DOSSIER</span>
              </span>
              <span
                style={{
                  height: "1px",
                  flex: 1,
                  background: "rgba(219,26,26,0.2)",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  color: "#DB1A1A",
                  opacity: 0.8,
                }}
              >
                CODEX ΩΩ-7
              </span>
            </div>

            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(1.5rem, 3.2vw, 2.4rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "#DB1A1A",
                marginBottom: "16px",
              }}
            >
              CHRONOS ENGINE SPECIFICATIONS
            </h2>

            <p
              className="type-level-04"
              style={{
                marginBottom: "32px",
                fontSize: "0.92rem",
                maxWidth: "600px",
              }}
            >
              Complete architectural blueprint detailing non-Euclidean vertex
              displacement, borosilicate optical refraction indices, and
              sub-octave Schumann resonance locks.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "14px",
                marginBottom: "36px",
              }}
            >
              {[
                ["PROJECT CODENAME", "CHRONOS ENGINE ΩΩ-7"],
                ["ORIGIN EPOCH", "Pre-Spacetime Collapse (-4.1 × 10¹² Yrs)"],
                ["CORE GEOMETRY", "Dual-Ring Gyroscopic Faceted Crystal"],
                [
                  "SHADER MATERIAL",
                  "Controlled Burgundy Tonal GLSL Rim Shader",
                ],
                ["PRIMARY REFRACTION", "IOR 1.650 Translucent Shell"],
                ["RESONANCE AMPLITUDE", "7.83 Hz Schumann Lock"],
                ["FLUX DENSITY", "94.2 TW Zero-Point Extract"],
                ["SYSTEM STATUS", "STABLE / OPERATIONAL"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    background: "rgba(60, 8, 16, 0.04)",
                    border: "1px solid rgba(88, 13, 24, 0.12)",
                    borderLeft: "3px solid #DB1A1A",
                    padding: "14px 18px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <span
                    className="type-level-05"
                    style={{ fontSize: "0.6rem", color: "#DB1A1A" }}
                  >
                    {k}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      color: "#3C0810",
                    }}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>

            <MagneticButton
              className="btn-rect"
              onClick={() => setIsSpecDrawerOpen(false)}
              onMouseEnter={() => onCursorState?.("hover")}
              onMouseLeave={() => onCursorState?.("default")}
              style={{ width: "100%", justifyContent: "center" }}
            >
              <span>CLOSE DOSSIER</span>
              <span className="btn-arrow">
                <X size={16} />
              </span>
            </MagneticButton>
          </div>
        </div>
      </div>

      <section
        id="stage-1"
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          paddingLeft: "clamp(24px, 6vw, 96px)",
          paddingRight: "clamp(24px, 6vw, 96px)",
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "relative",
            zIndex: 6,
            maxWidth: "850px",
            pointerEvents: "auto",
          }}
        >
          <div className="hud-pill" style={{ marginBottom: "20px" }}>
            <Sparkles size={13} style={{ color: "#DB1A1A" }} />
            <span>STAGE 01 // DISCOVER</span>
          </div>

          <h1
            className="type-level-01 text-gradient-crimson"
            style={{ marginBottom: "24px" }}
          >
            CHRONOS
            <br />
            <span
              style={{
                borderBottom: "3px solid #DB1A1A",
                paddingBottom: "4px",
                display: "inline-block",
              }}
            >
              ENGINE
            </span>
          </h1>

          <h2
            className="type-level-03 text-gradient-crimson"
            style={{ marginBottom: "20px", fontWeight: 600 }}
          >
            A SYSTEM BUILT AROUND TIME.
          </h2>

          <p
            className="type-level-04"
            style={{ marginBottom: "32px", maxWidth: "520px" }}
          >
            Observe. Control. Understand. Explore the central temporal core
            through precision scroll-driven motion and real-time interaction.
          </p>

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginBottom: "32px",
              flexWrap: "wrap",
            }}
          >
            <span className="hud-pill">
              <Activity size={12} />
              <span>7.83 Hz SCHUMANN</span>
            </span>
            <span
              className="hud-pill"
              style={{
                background: "rgba(60,8,16,0.06)",
                borderColor: "rgba(88,13,24,0.22)",
              }}
            >
              <Zap size={12} style={{ color: "#DB1A1A" }} />
              <span>94.2 TW FLUX</span>
            </span>
            <span
              className="hud-pill"
              style={{
                background: "rgba(60,8,16,0.06)",
                borderColor: "rgba(88,13,24,0.22)",
              }}
            >
              <Eye size={12} style={{ color: "#DB1A1A" }} />
              <span>IOR 1.650 REFRACTION</span>
            </span>
          </div>

          <div
            style={{
              display: "flex",
              gap: "20px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <MagneticAnchor
              href="#stage-2"
              className="btn-rect"
              onMouseEnter={() => onCursorState?.("hover")}
              onMouseLeave={() => onCursorState?.("default")}
            >
              <span>ENTER SYSTEM</span>
              <span className="btn-arrow">
                <ArrowRight size={16} />
              </span>
            </MagneticAnchor>

            <span
              className="type-level-05"
              style={{
                opacity: 0.7,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>SCROLL TO ACTIVATE</span>
              <ChevronDown size={14} style={{ color: "#DB1A1A" }} />
            </span>
          </div>
        </div>
      </section>

      <section
        id="stage-2"
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingLeft: "clamp(24px, 6vw, 96px)",
          paddingRight: "clamp(24px, 6vw, 96px)",
          paddingTop: "12vh",
          paddingBottom: "12vh",
        }}
      >
        <div
          className="tonal-bleed-left"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        <div
          style={{
            position: "absolute",
            left: "0vw",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(5rem, 22vw, 24rem)",
              opacity: 0.04,
              letterSpacing: "-0.06em",
              whiteSpace: "nowrap",
              color: "#3C0810",
            }}
          >
            ORIGIN
          </span>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 6,
            width: "100%",
            maxWidth: "580px",
            margin: "0 auto",
          }}
        >
          <OriginManifestoCard
            onCursorState={onCursorState}
            prefersReducedMotion={prefersReducedMotion}
          />
        </div>
      </section>

      <FieldNoteQuoteSection prefersReducedMotion={prefersReducedMotion} />

      <section
        id="stage-3"
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingRight: "clamp(24px, 6vw, 96px)",
          paddingLeft: "clamp(24px, 6vw, 96px)",
          paddingTop: "12vh",
          paddingBottom: "12vh",
        }}
      >
        <div
          className="tonal-bleed-left"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        <div
          style={{
            position: "absolute",
            right: "0vw",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(4.5rem, 18vw, 20rem)",
              opacity: 0.04,
              letterSpacing: "-0.06em",
              whiteSpace: "nowrap",
              color: "#3C0810",
            }}
          >
            SYSTEM
          </span>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 6,
            width: "100%",
            maxWidth: "580px",
            margin: "0 auto",
          }}
        >
          <TechnicalSpecCard
            onOpenFullSpecs={() => setIsSpecDrawerOpen(true)}
            onCursorState={onCursorState}
          />
        </div>
      </section>

      <TemporalFieldSection prefersReducedMotion={prefersReducedMotion} />

      <section
        id="stage-4"
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingLeft: "clamp(24px, 6vw, 96px)",
          paddingRight: "clamp(24px, 6vw, 96px)",
          paddingTop: "12vh",
          paddingBottom: "12vh",
        }}
      >
        <div
          className="tonal-bleed-right"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        <div
          style={{
            position: "absolute",
            right: "0vw",
            bottom: "15%",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(4rem, 18vw, 20rem)",
              opacity: 0.04,
              letterSpacing: "-0.05em",
              whiteSpace: "nowrap",
              color: "#3C0810",
            }}
          >
            NODES
          </span>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 6,
            width: "100%",
            maxWidth: "540px",
            margin: "0 auto",
          }}
        >
          <NodeDiscoveryCard
            selectedNode={selectedNode}
            onSelectNode={onSelectNode}
            onCursorState={onCursorState}
          />
        </div>
      </section>

      <section
        id="stage-5"
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingRight: "clamp(24px, 6vw, 96px)",
          paddingLeft: "clamp(24px, 6vw, 96px)",
          paddingTop: "12vh",
          paddingBottom: "12vh",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "10%",
            top: "20%",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(4rem, 16vw, 18rem)",
              opacity: 0.04,
              letterSpacing: "-0.05em",
              color: "#580D18",
            }}
          >
            MECHANICS
          </span>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 6,
            width: "100%",
            maxWidth: "560px",
            margin: "0 auto",
          }}
        >
          <TemporalMechanicsCard onCursorState={onCursorState} />
        </div>
      </section>

      <section
        id="stage-6"
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingLeft: "clamp(24px, 6vw, 96px)",
          paddingRight: "clamp(24px, 6vw, 96px)",
          paddingTop: "12vh",
          paddingBottom: "12vh",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "25%",
            top: "8%",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(4rem, 16vw, 18rem)",
              opacity: 0.04,
              letterSpacing: "-0.05em",
              color: "#580D18",
            }}
          >
            CONTROL
          </span>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 6,
            width: "100%",
            maxWidth: "520px",
            margin: "0 auto",
          }}
        >
          <ControlDashboard
            controlState={controlState}
            onControlChange={onControlChange}
            onCursorState={onCursorState}
          />
        </div>
      </section>

      <section
        id="stage-7"
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          paddingTop: "12vh",
          paddingBottom: "12vh",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(110,20,34,0.06) 0%, transparent 75%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 6,
            maxWidth: "680px",
            padding: "0 24px",
          }}
        >
          <div
            className="type-level-05"
            style={{
              marginBottom: "24px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Sparkles size={13} style={{ color: "#DB1A1A" }} />
            <span>STAGE 07 // RESOLVE</span>
          </div>

          <h2
            className="type-level-01"
            style={{
              fontSize: "clamp(3rem, 7.5vw, 7rem)",
              marginBottom: "24px",
            }}
          >
            EXPLORE THE ENGINE
          </h2>

          <p
            className="type-level-04"
            style={{
              marginBottom: "40px",
              marginInline: "auto",
              maxWidth: "480px",
            }}
          >
            The Core awaits calibration. Every facet a window into geometries
            that precede time itself.
          </p>

          <div
            style={{
              display: "flex",
              gap: "20px",
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: "48px",
            }}
          >
            <MagneticButton
              className="cta-primary"
              onClick={() => setIsSpecDrawerOpen(true)}
              onMouseEnter={() => onCursorState?.("hover")}
              onMouseLeave={() => onCursorState?.("default")}
            >
              <Zap size={15} />
              <span>ENGAGE CORE</span>
              <span className="cta-icon-arrow">
                <ArrowRight size={16} />
              </span>
            </MagneticButton>
            <MagneticButton
              className="cta-secondary"
              onClick={() => setIsSpecDrawerOpen(true)}
              onMouseEnter={() => onCursorState?.("hover")}
              onMouseLeave={() => onCursorState?.("default")}
            >
              <FileText size={15} />
              <span>VIEW SPECIFICATIONS</span>
            </MagneticButton>
          </div>

          <div
            style={{
              display: "flex",
              gap: "32px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <span
              className="type-level-05"
              style={{
                opacity: 0.8,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Cpu size={12} style={{ color: "#DB1A1A" }} />
              <span>BUILD ΩΩ-7</span>
            </span>
            <span
              className="type-level-05"
              style={{
                opacity: 0.8,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Activity size={12} style={{ color: "#DB1A1A" }} />
              <span>SCHUMANN 7.83 Hz</span>
            </span>
            <span
              className="type-level-05"
              style={{
                opacity: 0.8,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <CheckCircle2 size={12} style={{ color: "#DB1A1A" }} />
              <span>PHASE COHERENT</span>
            </span>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 1; transform: scaleY(1); }
          50%      { opacity: 0.3; transform: scaleY(0.7); }
        }
      `}</style>
    </div>
  )
}
