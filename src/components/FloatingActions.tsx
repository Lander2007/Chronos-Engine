import { memo } from "react"
import { ArrowUp, Maximize2, RotateCw, Zap } from "./Icons"

interface FloatingActionsProps {
  onScrollToTop: () => void
  onResetView: () => void
  onMaximizeEnergy: () => void
  onCursorState?: (state: "default" | "hover" | "node") => void
}

const FloatingActions = memo(function FloatingActions({
  onScrollToTop,
  onResetView,
  onMaximizeEnergy,
  onCursorState,
}: FloatingActionsProps) {
  return (
    <div className="fab-container">
      <button
        className="fab-button hover-lift"
        onClick={onMaximizeEnergy}
        onMouseEnter={() => onCursorState?.("hover")}
        onMouseLeave={() => onCursorState?.("default")}
        title="Maximize Energy"
      >
        <Zap size={20} style={{ color: "#DB1A1A" }} />
      </button>

      <button
        className="fab-button hover-lift"
        onClick={onResetView}
        onMouseEnter={() => onCursorState?.("hover")}
        onMouseLeave={() => onCursorState?.("default")}
        title="Reset View"
      >
        <RotateCw size={20} style={{ color: "#580D18" }} />
      </button>

      <button
        className="fab-button hover-lift"
        onClick={onScrollToTop}
        onMouseEnter={() => onCursorState?.("hover")}
        onMouseLeave={() => onCursorState?.("default")}
        title="Scroll to Top"
      >
        <ArrowUp size={20} style={{ color: "#580D18" }} />
      </button>
    </div>
  )
})

export default FloatingActions
