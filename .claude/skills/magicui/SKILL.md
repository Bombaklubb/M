---
name: magicui
description: "MagicUI component expert. Use when the user wants to add animated UI components, special effects or visual enhancements from MagicUI (BorderBeam, MagicCard, AnimatedBeam, BlurFade, Confetti, Meteors, ShimmerButton, TextAnimate, etc.) in React/Next.js/Tailwind projects. Source: https://github.com/magicuidesign/magicui"
---

# MagicUI – Animated UI Components

MagicUI is a collection of animated React components built on top of Tailwind CSS, Framer Motion, and shadcn/ui. Components add motion, visual effects, and delight to UIs.

## Key Facts

- Components are **copied into your project** (same model as shadcn/ui)
- Built with **Framer Motion** + **Tailwind CSS**
- TypeScript-first, works with **Next.js App Router**
- Many components use **CSS custom properties** for configuration
- Requires `framer-motion` package

## Installation

```bash
# Initialize (if not done)
npx shadcn@latest init

# Add a component
npx magicui-cli@latest add border-beam
npx magicui-cli@latest add magic-card
npx magicui-cli@latest add animated-beam
```

## Component Categories & Reference

### Background Effects
| Component | Effect |
|-----------|--------|
| `Particles` | Interactive floating particles |
| `Meteors` | Shooting star animation across background |
| `DotPattern` | Subtle repeating dot grid |
| `GridPattern` | Repeating grid lines |
| `FlickeringGrid` | Flickering dot grid |
| `AnimatedGridPattern` | Animated grid |
| `RetroGrid` | Retro perspective grid |
| `Ripple` | Expanding ripple circles from center |

### Card & Border Effects
| Component | Effect |
|-----------|--------|
| `MagicCard` | Card with gradient spotlight that follows cursor |
| `BorderBeam` | Animated light beam traveling around border |
| `NeonGradientCard` | Neon glowing border card |
| `BentoGrid` | Bento-box style grid layout |
| `Tilt` | 3D tilt on hover |

### Text Effects
| Component | Effect |
|-----------|--------|
| `AnimatedGradientText` | Gradient animated text |
| `GradualSpacing` | Letters animate to spaced-out |
| `LetterPullup` | Letters pull up into view |
| `WordPullUp` | Words pull up sequentially |
| `BlurIn` | Text blurs into view |
| `TextAnimate` | Versatile text animation (fade, blur, slide, scale) |
| `TypingAnimation` | Typewriter effect |
| `NumberTicker` | Animated number counter |
| `FlipText` | Text flips on axis |
| `Hyper Text` | Glitchy scramble-to-reveal |
| `ScrambleHover` | Characters scramble on hover |
| `WordRotate` | Cycles through words |
| `BoxReveal` | Box wipes to reveal text |
| `ShinyButton` | Shiny shimmer button |

### Loaders & Progress
| Component | Effect |
|-----------|--------|
| `SpinningText` | Text rotates in a circle |
| `DotLottiePlayer` | Lottie animation player |
| `Marquee` | Infinite scrolling ticker |
| `ScrollProgress` | Reading progress bar |

### Interactive & Special
| Component | Effect |
|-----------|--------|
| `AnimatedBeam` | Animated SVG beam between elements |
| `Confetti` | Confetti explosion effect |
| `MorphingText` | Text morphs between values |
| `Dock` | macOS-style app dock |
| `Globe` | Interactive 3D globe |
| `Orbiting Circles` | Elements orbit a center point |
| `Shine Border` | Shine animation on border |
| `Rainbow Button` | Rainbow gradient animated button |
| `PulsatingButton` | Pulsating ring button |
| `Animated Subscribe Button` | Subscribe/confirm state button |
| `CoolMode` | Particle burst on click |
| `Pointer` | Custom animated cursor |

### Scroll Animations
| Component | Effect |
|-----------|--------|
| `BlurFade` | Fade + blur in as element enters viewport |
| `BlurFadeText` | Same, but word-by-word |

## Usage Examples

### BorderBeam – animated border glow
```tsx
import { BorderBeam } from "@/components/magicui/border-beam"

// Parent must be: relative overflow-hidden
<div className="relative overflow-hidden rounded-xl border p-6">
  <p>Content goes here</p>
  <BorderBeam size={250} duration={12} colorFrom="#ffaa40" colorTo="#9c40ff" />
</div>
```

**Props:** `size`, `duration`, `anchor`, `borderWidth`, `colorFrom`, `colorTo`, `delay`

> ⚠️ **Z-index note (this project):** BorderBeam fills its bounding box with a `padding-box` background color. If content disappears, use a wrapper technique instead of BorderBeam directly:
> ```tsx
> // Wrapper gradient border – no z-index issues
> <div style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)", backgroundSize: "300% 300%", animation: "gradient 3s ease infinite", padding: "3px" }} className="rounded-3xl">
>   <div className="rounded-[22px] bg-white dark:bg-gray-800 p-5">
>     {/* content */}
>   </div>
> </div>
> ```

### MagicCard – cursor spotlight
```tsx
import { MagicCard } from "@/components/magicui/magic-card"

<MagicCard
  className="cursor-pointer p-6 rounded-xl"
  gradientColor="#262626"
>
  <p>Hover me for spotlight effect</p>
</MagicCard>
```

**Props:** `gradientColor`, `gradientSize`, `gradientFrom`, `gradientTo`, `gradientOpacity`

### BlurFade – scroll-triggered reveal
```tsx
import { BlurFade } from "@/components/magicui/blur-fade"

<BlurFade delay={0.25} inView>
  <h2>This fades in when scrolled into view</h2>
</BlurFade>

{/* Stagger multiple items */}
{items.map((item, i) => (
  <BlurFade key={item.id} delay={0.1 + i * 0.05} inView>
    <Card>{item.name}</Card>
  </BlurFade>
))}
```

### TextAnimate
```tsx
import { TextAnimate } from "@/components/magicui/text-animate"

<TextAnimate animation="blurInUp" by="word">
  Hello World
</TextAnimate>

// animation options: "fadeIn", "blurIn", "blurInUp", "blurInDown",
//                   "slideUp", "slideDown", "slideLeft", "slideRight",
//                   "scaleUp", "scaleDown"
// by options: "character", "word", "line", "text"
```

### NumberTicker
```tsx
import { NumberTicker } from "@/components/magicui/number-ticker"

<NumberTicker value={1000} />
<NumberTicker value={99.5} decimalPlaces={1} />
```

### Marquee – infinite scroll ticker
```tsx
import { Marquee } from "@/components/magicui/marquee"

<Marquee pauseOnHover className="[--duration:20s]">
  {items.map((item) => <ReviewCard key={item.id} {...item} />)}
</Marquee>

// Reverse direction
<Marquee reverse>...</Marquee>

// Vertical
<Marquee vertical>...</Marquee>
```

### Confetti
```tsx
import { useConfetti } from "@/components/magicui/confetti"

const { triggerConfetti } = useConfetti()

<button onClick={triggerConfetti}>
  Celebrate!
</button>
```

### AnimatedBeam – connection lines
```tsx
import { AnimatedBeam } from "@/components/magicui/animated-beam"

// Draws animated beam between two refs
const containerRef = useRef(null)
const fromRef = useRef(null)
const toRef = useRef(null)

<div ref={containerRef} className="relative">
  <div ref={fromRef}>Source</div>
  <div ref={toRef}>Target</div>
  <AnimatedBeam containerRef={containerRef} fromRef={fromRef} toRef={toRef} />
</div>
```

### Meteors
```tsx
import { Meteors } from "@/components/magicui/meteors"

// Parent: relative overflow-hidden
<div className="relative overflow-hidden rounded-xl bg-slate-900 p-8">
  <Meteors number={20} />
  <p className="relative z-10 text-white">Content over meteors</p>
</div>
```

## Tailwind Animation Classes (defined in tailwind.config.ts)

This project already has these in `tailwind.config.ts`:
```ts
animation: {
  "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
  "shimmer": "shimmer 2s linear infinite",
  "gradient": "gradient 8s linear infinite",
  "aurora": "aurora 8s ease-in-out infinite",
}
```

## CSS Variables Pattern

MagicUI components use CSS custom properties for configuration:
```css
/* Typically set inline on the component */
style={{ "--duration": 12, "--color-from": "#ffaa40" } as React.CSSProperties}
```

## Install Dependencies

```bash
npm install framer-motion
# Some components also need:
npm install @tauri-apps/api  # for certain effects
```
