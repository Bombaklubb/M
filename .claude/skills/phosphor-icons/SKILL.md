---
name: phosphor-icons
description: Phosphor Icons expert. Use when the user wants to add flexible, customizable icons to their project. Supports React, Vue, Svelte, vanilla JS, and more. 1,200+ icons in 6 weights (thin, light, regular, bold, fill, duotone). Source: https://github.com/phosphor-icons/core
---

# Phosphor Icons

A flexible icon family for interfaces, diagrams, presentations, and more.

## Installation

### React

```bash
npm install @phosphor-icons/react
```

### Vue

```bash
npm install @phosphor-icons/vue
```

### Svelte

```bash
npm install phosphor-svelte
```

### Web (vanilla JS)

```bash
npm install @phosphor-icons/web
```

### Core (raw SVGs)

```bash
npm install @phosphor-icons/core
```

## React Usage

### Basic

```jsx
import { Heart, MagnifyingGlass, ShoppingCart } from '@phosphor-icons/react';

function App() {
  return (
    <div>
      <Heart />
      <MagnifyingGlass />
      <ShoppingCart />
    </div>
  );
}
```

### Icon Weights

```jsx
import { Heart } from '@phosphor-icons/react';

function IconWeights() {
  return (
    <>
      <Heart weight="thin" />      {/* Thinnest */}
      <Heart weight="light" />     {/* Light */}
      <Heart weight="regular" />   {/* Default */}
      <Heart weight="bold" />      {/* Bold */}
      <Heart weight="fill" />      {/* Filled */}
      <Heart weight="duotone" />   {/* Two-tone */}
    </>
  );
}
```

### Size & Color

```jsx
import { Heart } from '@phosphor-icons/react';

function StyledIcons() {
  return (
    <>
      {/* Size with number (pixels) */}
      <Heart size={32} />

      {/* Size with string */}
      <Heart size="2rem" />

      {/* Color */}
      <Heart color="#ff0000" />
      <Heart color="currentColor" />

      {/* Combined */}
      <Heart size={48} color="hotpink" weight="fill" />
    </>
  );
}
```

### Mirroring (RTL Support)

```jsx
import { ArrowRight } from '@phosphor-icons/react';

// Automatically mirrors in RTL layouts
<ArrowRight mirrored />
```

### Context Provider

Set defaults for all icons:

```jsx
import { IconContext, Heart, Star, Bell } from '@phosphor-icons/react';

function App() {
  return (
    <IconContext.Provider value={{ size: 24, weight: 'bold', color: 'blue' }}>
      <Heart />   {/* All use size=24, weight=bold, color=blue */}
      <Star />
      <Bell />
    </IconContext.Provider>
  );
}
```

## Vue Usage

```vue
<script setup>
import { PhHeart, PhMagnifyingGlass } from '@phosphor-icons/vue';
</script>

<template>
  <PhHeart :size="32" color="red" weight="fill" />
  <PhMagnifyingGlass :size="24" weight="bold" />
</template>
```

## Svelte Usage

```svelte
<script>
  import Heart from 'phosphor-svelte/lib/Heart';
  import MagnifyingGlass from 'phosphor-svelte/lib/MagnifyingGlass';
</script>

<Heart size={32} color="red" weight="fill" />
<MagnifyingGlass size={24} weight="bold" />
```

## Web / Vanilla JS

```html
<!-- Include the script -->
<script src="https://unpkg.com/@phosphor-icons/web"></script>

<!-- Use with classes -->
<i class="ph ph-heart"></i>
<i class="ph-fill ph-heart"></i>
<i class="ph-bold ph-magnifying-glass"></i>
<i class="ph-duotone ph-shopping-cart"></i>

<!-- Size with CSS -->
<style>
  .ph { font-size: 24px; }
</style>
```

## Icon Weights Reference

| Weight | Description | Class (web) |
|--------|-------------|-------------|
| thin | 1px stroke | `ph-thin` |
| light | 1.5px stroke | `ph-light` |
| regular | 2px stroke (default) | `ph` |
| bold | 3px stroke | `ph-bold` |
| fill | Solid fill | `ph-fill` |
| duotone | Two-tone with opacity | `ph-duotone` |

## Popular Icons

### Navigation & UI
- `House`, `MagnifyingGlass`, `Bell`, `Gear`, `User`, `List`, `X`

### Actions
- `Plus`, `Minus`, `Check`, `ArrowRight`, `ArrowLeft`, `Download`, `Upload`

### Social & Media
- `Heart`, `Star`, `ChatCircle`, `ShareNetwork`, `Camera`, `Play`, `Pause`

### Files & Data
- `File`, `Folder`, `Trash`, `Copy`, `CloudArrowUp`, `Database`

### Communication
- `Envelope`, `Phone`, `ChatDots`, `PaperPlaneTilt`

## Finding Icons

Browse all 1,200+ icons at: https://phosphoricons.com

```jsx
// Import any icon by PascalCase name
import {
  Airplane,
  Bookmarks,
  Calendar,
  Desktop,
  Eye,
  Flag,
  Globe,
  // ... 1,200+ more
} from '@phosphor-icons/react';
```
