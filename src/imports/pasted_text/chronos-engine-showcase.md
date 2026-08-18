Design a high-end, immersive, scroll-driven website called "Chronos Engine" — an experimental interactive showcase built around one breathtaking 3D object rendered in Three.js. This is NOT a standard product landing page and NOT a simple "object spins in the center while text sits below it" layout. It is a cinematic scrollytelling experience where the 3D object travels through the page along its own path, and the content wraps, overlaps, and reacts around it.

1. Core Concept — "The Fractured Crystal Core"
The 3D hero object is a low-poly faceted crystal structure (built from a fractured/shattered icosahedron shape — irregular angular facets, not a smooth sphere), rendered in Three.js with a glass/transmission material (physical glass shader: refraction, roughness ~0.05-0.15, transmission ~0.9, subtle chromatic dispersion).
Deep inside the crystal, a small glowing emissive core sphere pulses in the oxblood red tone — visible glowing through the facet gaps and refracting through the glass, like trapped energy.
Add soft bloom post-processing (UnrealBloomPass-style glow) around the emissive core so the burgundy light bleeds gently into the off-white background like warm ink diffusing through paper, plus a subtle studio-style HDRI environment map for realistic reflections/highlights on the glass facets.
Faint particle dust drifts slowly around the crystal to add depth and atmosphere.
Unlike a static hero object, the Core does NOT stay anchored in one spot — it physically travels along a path down the page as the user scrolls (see Layout section), rotating and re-facing the camera the entire way, so new facets and new glimpses of the inner glow are always being revealed.
2. Color Palette (strict — ONLY these two colors, no third color anywhere)
Off-White: 
#F2ECE4 — this is the DOMINANT color: main background, large negative-space areas, and the base tone the whole page sits on. Use tonal variations of this SAME color (slightly deeper warm tint like 
#E8E0D4 for subtle depth/shadow, or lower opacity for soft textures/dividers) to create depth — not a separate color.
Burgundy / Oxblood (Gazelle-Blood Red): 
#5E0E18 — used for ALL text, the crystal core's glow/emissive light, headlines, buttons, borders, and the HUD/progress rail. This is the color that carries contrast and "voice" against the off-white base. Use tonal variations (darker 
#3A0A10 for deep shadow/depth inside the crystal, lower opacity like rgba(94,14,24,0.15) for glass panels and light UI tints).
No third accent color (no bronze/copper, no gray, no pure black/white). Every panel, border, shadow, or highlight must be a shade, tint, or opacity variant of either the off-white or the burgundy above.
3. Layout Philosophy — "The Traveling Path" (Unconventional, Not Grid-Based)
Reject standard centered/grid layouts entirely. No traditional header/hero/footer stacking, and NO simple "3D object fixed dead-center with text underneath."
The 3D Crystal Core moves along an invisible S-curve path as the page scrolls: it starts large and center-right in the hero, drifts to the far left-edge (partially bleeding off-screen) in section 2, swings back to center but smaller/higher in section 3, then to the bottom-right corner in section 4, finally resting slightly left-of-center for the closing CTA. The camera subtly orbits with it the whole time.
Oversized editorial typography (huge headline words, 15-25% of viewport height) sits BEHIND or PARTIALLY OVERLAPPING the crystal (using z-index layering so the glass object visually sits in front of/through the type), creating real depth instead of flat stacked sections.
Content blocks are full-bleed asymmetric panels that alternate left/right dominance as the Core moves — not small centered cards. When the Core is left, content claims the right two-thirds of the viewport (and vice versa), so the eye is always pulled along a diagonal zig-zag rhythm down the page.
Generous, intentional negative space — let the off-white background and the crystal's burgundy glow carry entire viewport heights with almost no text.
No hard horizontal section dividers. Transitions happen through radial red glow bleeds, soft gradient washes, and the Core's own movement — the page should feel like one continuous environment, not stacked blocks.
Navigation: a slim, minimal vertical progress rail on one edge of the screen showing scroll position as a glowing line (like a HUD signal strength indicator), instead of a classic top navbar.
4. The 3D Core — Scroll-Synced Behavior Along the Path

Describe/design the following as distinct scroll stages (Figma Make should represent these as sequential frames/sections showing the crystal's position, rotation, and glow state at each stage):

Stage 1 — Hero / Dormant: Crystal sits large, center-right, slow idle rotation, inner core glowing faintly. Oversized headline "CHRONOS ENGINE" bleeds in from the left edge, partially behind the crystal's glass (visible through/refracted by it). Thin oxblood underline beneath the title.
Stage 2 — The Drift: As the user scrolls, the crystal glides toward the far left, partially exiting the viewport edge, rotating to reveal jagged interior facets. Full-bleed content panel claims the right two-thirds of the screen with a short specs readout in monospace type.
Stage 3 — Core Reveal: Crystal swings back toward center, shrinks slightly and rises higher on the screen, rotating to expose the glowing inner sphere more directly (camera pushes in slightly). A second content panel (left-dominant this time) reveals fictional lore / origin text.
Stage 4 — Full Power: Crystal moves to the bottom-right corner, growing again, spinning faster, inner glow intensifies with stronger bloom, red light visibly bleeds onto nearby type and background. Right-dominant panel shows performance metrics with subtle animated bars/numbers in monospace.
Stage 5 — Closing/CTA: Crystal settles left-of-center, rotation slows to a near-still "showcase" pose, glow softens to a calm steady burgundy (no color shift needed, just intensity easing down), ending in a minimal centered CTA panel ("Explore the Engine" / "View Specifications") on the open off-white field.
5. Floating Content Cards (Glassmorphism)
Semi-transparent glass panels: rgba(94,14,24,0.08) (very light burgundy tint, since the base is now light) with backdrop blur, thin 1px burgundy border at low opacity (rgba(94,14,24,0.25))
Rounded corners but NOT overly soft/bubbly — keep it sharp-edged and technical (small radius, ~6-10px)
Typography inside cards: a technical/monospace-leaning font for data labels, paired with a clean modern sans-serif for descriptions
Micro-animations: cards should fade + slide in from their off-axis direction as they enter viewport, not just fade-in