import { memo } from "react"

interface TimelineScrubberProps {
  activeStageIndex: number
  onCursorState?: (state: "default" | "hover" | "node") => void
}

const STAGE_LABELS = [
  "DISCOVER",
  "ORIGIN",
  "ARCH",
  "NODES",
  "MECH",
  "CTRL",
  "RESOLVE",
]

const TimelineScrubber = memo(function TimelineScrubber({
  activeStageIndex,
  onCursorState,
}: TimelineScrubberProps) {
  const scrollToStage = (index: number) => {
    const totalHeight =
      document.documentElement.scrollHeight - window.innerHeight
    const targetY = (index / 6) * totalHeight
    window.scrollTo({ top: targetY, behavior: "smooth" })
  }

  return (
    <div className="timeline-scrubber">
      {STAGE_LABELS.map((label, idx) => (
        <div
          key={idx}
          className={`timeline-stage ${
            idx === activeStageIndex ? "active" : ""
          } ${idx < activeStageIndex ? "completed" : ""}`}
          data-stage={label}
          onClick={() => scrollToStage(idx)}
          onMouseEnter={() => onCursorState?.("hover")}
          onMouseLeave={() => onCursorState?.("default")}
          style={{
            background:
              idx < activeStageIndex
                ? "linear-gradient(90deg, #580D18 0%, #812033 100%)"
                : idx === activeStageIndex
                  ? "linear-gradient(90deg, #812033 0%, #DB1A1A 100%)"
                  : "rgba(88, 13, 24, 0.15)",
          }}
        />
      ))}
    </div>
  )
})

export default TimelineScrubber
