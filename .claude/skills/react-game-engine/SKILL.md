---
name: react-game-engine
description: "React Game Engine expert. Use when the user wants to build games or interactive simulations with react-game-engine (game loop, entities, systems, touch/input handling) in React Native or React web projects. Source: https://github.com/bberak/react-game-engine"
---

# react-game-engine

A lightweight game engine for React Native (and React web via `react-game-engine-web`). Provides a **game loop**, **entity-component system**, and **input handling** on top of React.

## Packages

| Package | Platform |
|---------|----------|
| `react-game-engine` | React Native |
| `react-game-engine-web` | React (web browser) |

## Installation

```bash
# React Native
npm install react-game-engine

# React Web
npm install react-game-engine-web
```

## Core Concepts

### 1. GameEngine component
The root component. Manages the game loop and passes state to systems.

```tsx
import { GameEngine } from "react-game-engine"
// or: import { GameEngine } from "react-game-engine-web"

<GameEngine
  systems={[MoveSystem, CollisionSystem]}
  entities={initialEntities}
  running={true}
  onEvent={(event) => handleEvent(event)}
  style={{ flex: 1, backgroundColor: "#000" }}
/>
```

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `systems` | `System[]` | Array of system functions (game logic) |
| `entities` | `object` | Initial entity map |
| `running` | `boolean` | Pause/resume the loop |
| `onEvent` | `(event) => void` | Receive events dispatched from systems |
| `style` | `StyleProp` | Container style |
| `renderer` | `Component` | Custom renderer (optional) |

### 2. Entities

Entities are plain JS objects in a map. Each entity has a `renderer` component and any data you need:

```tsx
const initialEntities = {
  player: {
    position: { x: 100, y: 200 },
    velocity: { x: 0, y: 0 },
    size: { width: 40, height: 40 },
    color: "blue",
    renderer: <PlayerSprite />,
  },
  enemy1: {
    position: { x: 300, y: 100 },
    health: 3,
    renderer: <EnemySprite />,
  },
  physics: {
    gravity: 0.5,
    renderer: null,  // non-visual entity
  },
}
```

### 3. Systems

Systems are **pure functions** called every frame. They receive entities + time/input info and return updated entities:

```ts
// System signature
type System = (entities: Entities, args: SystemArgs) => Entities

interface SystemArgs {
  time: { current: number; previous: number; delta: number; tick: number }
  touches: Touch[]
  events: GameEvent[]
  dispatch: (event: GameEvent) => void
  screen: { width: number; height: number }
}
```

**Example system:**
```tsx
function MoveSystem(entities, { time }) {
  const { delta } = time  // ms since last frame

  const player = entities.player
  player.position.x += player.velocity.x * delta
  player.position.y += player.velocity.y * delta

  return entities
}

function GravitySystem(entities, { time }) {
  const { delta } = time
  const { gravity } = entities.physics

  for (const key of Object.keys(entities)) {
    const e = entities[key]
    if (e.velocity) {
      e.velocity.y += gravity * delta * 0.01
    }
  }
  return entities
}
```

### 4. Renderers

Each entity's `renderer` is a React component. It receives the entity's data as props:

```tsx
// Entity renderer component
function PlayerSprite({ position, size, color }) {
  return (
    <View style={{
      position: "absolute",
      left: position.x,
      top: position.y,
      width: size.width,
      height: size.height,
      backgroundColor: color,
      borderRadius: size.width / 2,
    }} />
  )
}

// In entities:
{
  player: {
    position: { x: 100, y: 200 },
    size: { width: 40, height: 40 },
    color: "blue",
    renderer: PlayerSprite,  // pass component class/function, not JSX
  }
}
```

### 5. Touch / Input Handling

Touch events are passed to systems via `touches` array:

```tsx
function TouchSystem(entities, { touches, dispatch }) {
  touches
    .filter(t => t.type === "press")
    .forEach(t => {
      dispatch({ type: "jump", x: t.event.pageX, y: t.event.pageY })
    })

  return entities
}
```

**Touch types:** `"start"`, `"end"`, `"move"`, `"press"`, `"long-press"`

### 6. Events

Systems can dispatch events; the `onEvent` prop on `<GameEngine>` receives them:

```tsx
// In a system:
dispatch({ type: "score", points: 10 })
dispatch({ type: "game-over" })

// In React component:
function handleEvent(event) {
  if (event.type === "score") setScore(s => s + event.points)
  if (event.type === "game-over") setRunning(false)
}

<GameEngine onEvent={handleEvent} ... />
```

## Full Example – Simple Falling Ball

```tsx
import React, { useRef, useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import { GameEngine } from "react-game-engine"

// Renderer
function Ball({ position, size }) {
  return (
    <View style={{
      position: "absolute",
      left: position.x - size / 2,
      top: position.y - size / 2,
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: "red",
    }} />
  )
}

// Systems
function Physics(entities, { time, screen }) {
  const ball = entities.ball
  ball.velocity.y += 0.5  // gravity
  ball.position.x += ball.velocity.x
  ball.position.y += ball.velocity.y

  // bounce off bottom
  if (ball.position.y > screen.height - ball.size / 2) {
    ball.position.y = screen.height - ball.size / 2
    ball.velocity.y *= -0.7
  }
  return entities
}

function TouchHandler(entities, { touches }) {
  touches
    .filter(t => t.type === "press")
    .forEach(t => {
      entities.ball.position = { x: t.event.pageX, y: t.event.pageY }
      entities.ball.velocity = { x: (Math.random() - 0.5) * 10, y: -15 }
    })
  return entities
}

// Main game component
export default function Game() {
  const [running, setRunning] = useState(true)

  const entities = {
    ball: {
      position: { x: 160, y: 100 },
      velocity: { x: 2, y: 0 },
      size: 40,
      renderer: Ball,
    },
  }

  return (
    <View style={{ flex: 1 }}>
      <GameEngine
        style={{ flex: 1, backgroundColor: "#1a1a2e" }}
        systems={[Physics, TouchHandler]}
        entities={entities}
        running={running}
      />
    </View>
  )
}
```

## Accessing GameEngine Imperatively

```tsx
const gameEngineRef = useRef(null)

// Swap/update entities from outside
gameEngineRef.current?.swap({ ...newEntities })

// Stop the engine
gameEngineRef.current?.stop()

// Start/resume
gameEngineRef.current?.start()

<GameEngine ref={gameEngineRef} ... />
```

## Performance Tips

- Keep systems as pure functions – avoid closures that re-create on every render
- Use `position: "absolute"` for all game objects
- Avoid re-rendering the `<GameEngine>` parent (memoize it)
- Entity renderers should be functional components; avoid heavy `useEffect`
- For complex physics, consider integrating **Matter.js** with the engine:

```bash
npm install matter-js @types/matter-js
```

## Common Patterns

### Sprite animation
```tsx
function AnimatedSprite({ frame, frames, position }) {
  return (
    <Image
      source={frames[frame % frames.length]}
      style={{ position: "absolute", left: position.x, top: position.y }}
    />
  )
}

// In system: increment frame each N ticks
function AnimateSystem(entities, { time }) {
  if (time.tick % 5 === 0) {
    entities.player.frame = (entities.player.frame + 1) % 8
  }
  return entities
}
```

### Collision detection (AABB)
```tsx
function collides(a, b) {
  return (
    a.position.x < b.position.x + b.size.width &&
    a.position.x + a.size.width > b.position.x &&
    a.position.y < b.position.y + b.size.height &&
    a.position.y + a.size.height > b.position.y
  )
}
```

### Adding/removing entities from system
```tsx
function SpawnSystem(entities, { time, dispatch }) {
  if (time.tick % 60 === 0) {
    const id = `enemy_${time.tick}`
    entities[id] = {
      position: { x: Math.random() * 300, y: 0 },
      velocity: { x: 0, y: 2 },
      renderer: EnemySprite,
    }
  }

  // Remove dead entities
  for (const key of Object.keys(entities)) {
    if (entities[key].dead) delete entities[key]
  }

  return entities
}
```
