---
name: auto-animate
description: AutoAnimate expert. Use when the user wants to add smooth animations to lists, forms, or any DOM changes with zero configuration. Works with React, Vue, Solid, Svelte, and vanilla JavaScript. Source: https://github.com/formkit/auto-animate
---

# AutoAnimate

A zero-config, drop-in animation utility that adds smooth transitions to your web app.

## Installation

```bash
npm install @formkit/auto-animate
# or
yarn add @formkit/auto-animate
# or
pnpm add @formkit/auto-animate
```

## React Usage

### useAutoAnimate Hook

```jsx
import { useAutoAnimate } from '@formkit/auto-animate/react';

function TodoList() {
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3']);
  const [parent] = useAutoAnimate();

  const addItem = () => setItems([...items, `Item ${items.length + 1}`]);
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  return (
    <div>
      <button onClick={addItem}>Add Item</button>
      <ul ref={parent}>
        {items.map((item, index) => (
          <li key={item}>
            {item}
            <button onClick={() => removeItem(index)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### With Configuration

```jsx
import { useAutoAnimate } from '@formkit/auto-animate/react';

function AnimatedList() {
  const [parent] = useAutoAnimate({
    duration: 300,        // Animation duration in ms
    easing: 'ease-in-out', // CSS easing function
    disrespectUserMotionPreference: false, // Respect prefers-reduced-motion
  });

  return <ul ref={parent}>{/* items */}</ul>;
}
```

### Enable/Disable Animation

```jsx
function ToggleableAnimation() {
  const [parent, enable] = useAutoAnimate();
  const [isEnabled, setIsEnabled] = useState(true);

  const toggle = () => {
    setIsEnabled(!isEnabled);
    enable(!isEnabled);
  };

  return (
    <div>
      <button onClick={toggle}>
        {isEnabled ? 'Disable' : 'Enable'} Animation
      </button>
      <ul ref={parent}>{/* items */}</ul>
    </div>
  );
}
```

## Vue Usage

### Directive (Vue 3)

```vue
<script setup>
import { vAutoAnimate } from '@formkit/auto-animate/vue';
import { ref } from 'vue';

const items = ref(['Item 1', 'Item 2', 'Item 3']);
</script>

<template>
  <ul v-auto-animate>
    <li v-for="item in items" :key="item">{{ item }}</li>
  </ul>
</template>
```

### Composable

```vue
<script setup>
import { useAutoAnimate } from '@formkit/auto-animate/vue';

const [parent] = useAutoAnimate();
</script>

<template>
  <ul ref="parent">
    <li v-for="item in items" :key="item">{{ item }}</li>
  </ul>
</template>
```

## Vanilla JavaScript

```javascript
import autoAnimate from '@formkit/auto-animate';

// Apply to any parent element
const parent = document.getElementById('list');
autoAnimate(parent);

// With options
autoAnimate(parent, {
  duration: 250,
  easing: 'ease-out',
});
```

## Svelte Usage

```svelte
<script>
  import autoAnimate from '@formkit/auto-animate';

  let items = ['Item 1', 'Item 2', 'Item 3'];
</script>

<ul use:autoAnimate>
  {#each items as item (item)}
    <li>{item}</li>
  {/each}
</ul>
```

## Solid Usage

```jsx
import { createAutoAnimate } from '@formkit/auto-animate/solid';

function List() {
  const [parent] = createAutoAnimate();

  return (
    <ul ref={parent}>
      <For each={items()}>{(item) => <li>{item}</li>}</For>
    </ul>
  );
}
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `duration` | number | 250 | Animation duration in milliseconds |
| `easing` | string | 'ease-in-out' | CSS easing function |
| `disrespectUserMotionPreference` | boolean | false | Ignore prefers-reduced-motion |

## What Gets Animated

AutoAnimate automatically animates:
- **Adding**: New elements fade and scale in
- **Removing**: Elements fade and scale out
- **Moving**: Elements smoothly transition to new positions

## Common Use Cases

- Todo lists (add/remove/reorder items)
- Accordions and collapsibles
- Form field validation messages
- Shopping carts
- Tab content transitions
- Search result lists
- Drag and drop reordering
