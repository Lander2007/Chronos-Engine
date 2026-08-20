import { useEffect, useRef, RefObject } from "react"

/**
 * Custom hook providing a subtle magnetic cursor-follow effect for interactive elements.
 * Applied only on desktop fine-pointer devices and skipped under prefers-reduced-motion.
 *
 * @param externalRef Optional React ref object to attach to an element.
 * @param strength Maximum magnetic displacement in pixels (default: 6).
 * @returns Ref object to be attached to the target element.
 */
export function useMagneticHover<T extends HTMLElement = HTMLElement>(
  externalRef?: RefObject<T | null> | null,
  strength = 6,
): RefObject<T | null> {
  const internalRef = useRef<T | null>(null)
  const targetRef = externalRef || internalRef

  useEffect(() => {
    const el = targetRef.current
    if (!el) return

    // Skip magnetic hover on touch / coarse pointer devices or if user prefers reduced motion
    const isFinePointer = window.matchMedia("(pointer: fine)").matches
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    if (!isFinePointer || prefersReducedMotion) return

    let rafId: number | null = null
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0

    const update = () => {
      const lerp = 0.2
      currentX += (targetX - currentX) * lerp
      currentY += (targetY - currentY) * lerp

      const diffX = Math.abs(targetX - currentX)
      const diffY = Math.abs(targetY - currentY)

      if (diffX > 0.01 || diffY > 0.01) {
        el.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`
        rafId = requestAnimationFrame(update)
      } else {
        currentX = targetX
        currentY = targetY
        if (targetX === 0 && targetY === 0) {
          el.style.transform = ""
        } else {
          el.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`
        }
        rafId = null
      }
    }

    const startUpdate = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(update)
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = e.clientX - centerX
      const deltaY = e.clientY - centerY

      const normalizedX = Math.max(-1, Math.min(1, deltaX / (rect.width / 2)))
      const normalizedY = Math.max(-1, Math.min(1, deltaY / (rect.height / 2)))

      targetX = normalizedX * strength
      targetY = normalizedY * strength

      startUpdate()
    }

    const handleMouseLeave = () => {
      targetX = 0
      targetY = 0
      startUpdate()
    }

    el.addEventListener("mousemove", handleMouseMove)
    el.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      el.removeEventListener("mousemove", handleMouseMove)
      el.removeEventListener("mouseleave", handleMouseLeave)
      if (rafId) cancelAnimationFrame(rafId)
      el.style.transform = ""
    }
  }, [targetRef, strength])

  return targetRef
}
