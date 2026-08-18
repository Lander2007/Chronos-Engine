import { useState, useEffect, useRef, useCallback, Suspense, memo } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import Crystal3D from './Crystal3D'
import ScrollStages from './ScrollStages'

// Precision cursor with dynamic states (Memoized)
const PrecisionCursor = memo(function PrecisionCursor({ cursorState }: { cursorState: 'default' | 'hover' | 'node' }) {
  const dotRef   = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const trail = useRef({ x: 0, y: 0 })
  const raf = useRef<number>(0)

  useEffect(() => {
    document.body.setAttribute('data-cursor-state', cursorState)
  }, [cursorState])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    const tick = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`
      }
      trail.current.x += (pos.current.x - trail.current.x) * 0.15
      trail.current.y += (pos.current.y - trail.current.y) * 0.15
      if (trailRef.current) {
        trailRef.current.style.transform = `translate3d(${trail.current.x}px, ${trail.current.y}px, 0)`
      }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={trailRef} className="cursor-trail" />
    </>
  )
})

// 7 Narrative Stage Rail Data
const NAV_STAGES = [
  { id: 'stage-1', num: '01', label: 'Discover' },
  { id: 'stage-2', num: '02', label: 'Origin' },
  { id: 'stage-3', num: '03', label: 'Architecture' },
  { id: 'stage-4', num: '04', label: 'Nodes' },
  { id: 'stage-5', num: '05', label: 'Mechanics' },
  { id: 'stage-6', num: '06', label: 'Control' },
  { id: 'stage-7', num: '07', label: 'Resolve' },
]

const VerticalTrackNav = memo(function VerticalTrackNav({
  activeStageIndex,
  onCursorState,
}: {
  activeStageIndex: number
  onCursorState: (state: 'default' | 'hover' | 'node') => void
}) {
  const scrollToStage = (index: number) => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight
    const targetY = (index / (NAV_STAGES.length - 1)) * totalHeight
    window.scrollTo({ top: targetY, behavior: 'smooth' })
  }

  return (
    <nav className="nav-track" aria-label="Chronos Engine Navigation">
      {NAV_STAGES.map((stage, idx) => {
        const isActive = activeStageIndex === idx
        return (
          <button
            key={stage.id}
            onClick={() => scrollToStage(idx)}
            onMouseEnter={() => onCursorState('hover')}
            onMouseLeave={() => onCursorState('default')}
            className={`nav-track-node ${isActive ? 'active' : ''}`}
            title={stage.label}
          >
            <span className="nav-track-label">
              {stage.label}
            </span>
            <span className="nav-track-num">
              {stage.num}
            </span>
            <div className="nav-track-line" />
          </button>
        )
      })}
    </nav>
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
  onCursorState: (state: 'default' | 'hover' | 'node') => void
}) {
  const [timeStr, setTimeStr] = useState('00:00:00:00')

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const ms = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0')
      const sec = String(now.getSeconds()).padStart(2, '0')
      const min = String(now.getMinutes()).padStart(2, '0')
      const hr = String(now.getHours()).padStart(2, '0')
      setTimeStr(`${hr}:${min}:${sec}:${ms}`)
    }, 40)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <div
        ref={progressBarRef}
        className="global-progress-bar"
        style={{ width: '0%' }}
      />

      <header className="global-header">
        <div className="brand-badge">
          <div className="brand-dot" />
          <span className="brand-title">CHRONOS ENGINE</span>
          <span className="header-meta" style={{ marginLeft: '4px' }}>
            EPOCH {timeStr}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button
            onClick={onToggleAudio}
            onMouseEnter={() => onCursorState('hover')}
            onMouseLeave={() => onCursorState('default')}
            style={{
              background: 'transparent',
              border: '1px solid rgba(219,26,26,0.3)',
              color: isAudioOn ? '#DB1A1A' : 'rgba(88,13,24,0.6)',
              padding: '6px 12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              letterSpacing: '0.12em',
              transition: 'all 0.25s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {isAudioOn ? (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '10px' }}>
                <span className="eq-bar eq-bar-1" />
                <span className="eq-bar eq-bar-2" />
                <span className="eq-bar eq-bar-3" />
              </div>
            ) : (
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(88,13,24,0.3)' }} />
            )}
            <span>SOUND: {isAudioOn ? 'ON (7.83Hz)' : 'OFF'}</span>
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
  onCursorState: (state: 'default' | 'hover' | 'node') => void
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
    <div className={`loader-overlay ${isDismissed ? 'dismissed' : ''}`}>
      <div style={{ maxWidth: '440px', width: '100%', textAlign: 'center' }}>
        <div className="brand-badge" style={{ justifyContent: 'center', marginBottom: '24px' }}>
          <div className="brand-dot" />
          <span className="brand-title" style={{ fontSize: '1.1rem' }}>CHRONOS ENGINE</span>
        </div>

        <p className="type-level-05" style={{ marginBottom: '32px' }}>
          INITIALIZING NON-EUCLIDEAN TEMPORAL ARTIFACT
        </p>

        <div style={{ height: '3px', background: 'rgba(88,13,24,0.15)', marginBottom: '16px', position: 'relative', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: '#DB1A1A',
              transition: 'width 0.15s ease-out',
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#DB1A1A', marginBottom: '40px' }}>
          <span>ARTIFACT FACETS // {progress}%</span>
          <span>{isReady ? 'SYSTEM ONLINE' : 'LOADING'}</span>
        </div>

        {isReady && (
          <button
            className="btn-rect"
            onClick={handleEnter}
            onMouseEnter={() => onCursorState('hover')}
            onMouseLeave={() => onCursorState('default')}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <span>ENTER SYSTEM</span>
            <span className="btn-arrow">→</span>
          </button>
        )}
      </div>
    </div>
  )
})

// Background Grid Texture (Memoized)
const AmbientGrid = memo(function AmbientGrid() {
  return <div className="grid-texture" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.75 }} />
})

export default function App() {
  const scrollProgressRef = useRef(0)
  const scrollVelocityRef = useRef(0)
  const progressBarRef    = useRef<HTMLDivElement | null>(null)

  const [activeStageIndex, setActiveStageIndex] = useState(0)
  const [selectedNode, setSelectedNode]         = useState<number | null>(null)
  const [cursorState, setCursorState]           = useState<'default' | 'hover' | 'node'>('default')
  const [isAudioOn, setIsAudioOn]               = useState(false)
  const [isSystemLoaded, setIsSystemLoaded]     = useState(false)

  const [controlState, setControlState]         = useState({ energy: 72, speed: 1.0, phase: 4 })

  const lastScrollY = useRef(0)
  const ticking     = useRef(false)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const oscRef      = useRef<OscillatorNode | null>(null)

  const updateControlState = useCallback((newState: Partial<typeof controlState>) => {
    setControlState((prev) => ({ ...prev, ...newState }))
  }, [])

  const toggleAudio = useCallback(() => {
    if (isAudioOn) {
      oscRef.current?.stop()
      audioCtxRef.current?.close()
      setIsAudioOn(false)
    } else {
      try {
        const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(55, ctx.currentTime)
        gain.gain.setValueAtTime(0.015, ctx.currentTime)

        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()

        audioCtxRef.current = ctx
        oscRef.current = osc
        setIsAudioOn(true)
      } catch (err) {
        console.warn('AudioContext not permitted:', err)
      }
    }
  }, [isAudioOn])

  const onScroll = useCallback(() => {
    const scrollY = window.scrollY
    if (!ticking.current) {
      requestAnimationFrame(() => {
        const docH = document.documentElement.scrollHeight - window.innerHeight
        const pct  = docH > 0 ? scrollY / docH : 0
        const vel  = scrollY - lastScrollY.current
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

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])

  // Keyboard Escape shortcut listener to close open node or modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedNode(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const isHighDPI = typeof window !== 'undefined' && window.devicePixelRatio > 1.5

  return (
    <div style={{ background: '#F4F1EA', color: '#580D18', minHeight: '100vh', position: 'relative' }}>
      <PrecisionCursor cursorState={cursorState} />

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

      <AmbientGrid />

      {!isSystemLoaded && (
        <InitialLoader
          onEnter={() => setIsSystemLoaded(true)}
          onCursorState={setCursorState}
        />
      )}

      {/* Sticky 3D Canvas Layer */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: 10,
        pointerEvents: 'none',
      }}>
        <Canvas
          camera={{ position: [0, 0, 6], fov: 45 }}
          gl={{
            antialias: !isHighDPI,
            alpha: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.15,
            powerPreference: 'high-performance',
          }}
          style={{ background: 'transparent' }}
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
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Scroll-Driven HTML Content Layer */}
      <main style={{ position: 'relative', zIndex: 15, pointerEvents: 'auto' }}>
        <ScrollStages
          scrollProgress={activeStageIndex / 6}
          selectedNode={selectedNode}
          onSelectNode={setSelectedNode}
          controlState={controlState}
          onControlChange={updateControlState}
          onCursorState={setCursorState}
        />
      </main>
    </div>
  )
}



