---
name: tailwind-variants
description: Tailwind Variants expert. Use when the user wants to create type-safe component variants with Tailwind CSS. Provides a first-class variant API similar to CVA but with additional features like slots, responsive variants, and compound variants. Source: https://github.com/heroui-inc/tailwind-variants
---

# Tailwind Variants

First-class variant API for Tailwind CSS components.

## Installation

```bash
npm install tailwind-variants
# or
yarn add tailwind-variants
# or
pnpm add tailwind-variants
```

## Basic Usage

```typescript
import { tv } from 'tailwind-variants';

const button = tv({
  base: 'font-medium rounded-lg active:opacity-80',
  variants: {
    color: {
      primary: 'bg-blue-500 text-white hover:bg-blue-600',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
      danger: 'bg-red-500 text-white hover:bg-red-600',
    },
    size: {
      sm: 'text-sm px-3 py-1.5',
      md: 'text-base px-4 py-2',
      lg: 'text-lg px-6 py-3',
    },
    disabled: {
      true: 'opacity-50 cursor-not-allowed',
    },
  },
  defaultVariants: {
    color: 'primary',
    size: 'md',
  },
});

// Usage
<button className={button({ color: 'primary', size: 'lg' })}>
  Click me
</button>

<button className={button({ color: 'danger', disabled: true })}>
  Disabled
</button>
```

## Compound Variants

Apply styles when multiple variants match:

```typescript
const button = tv({
  base: 'font-medium rounded',
  variants: {
    color: {
      primary: 'bg-blue-500',
      secondary: 'bg-gray-200',
    },
    outlined: {
      true: 'border-2 bg-transparent',
    },
  },
  compoundVariants: [
    {
      color: 'primary',
      outlined: true,
      class: 'border-blue-500 text-blue-500 hover:bg-blue-50',
    },
    {
      color: 'secondary',
      outlined: true,
      class: 'border-gray-400 text-gray-700 hover:bg-gray-50',
    },
  ],
});
```

## Slots

Create multi-part components with named slots:

```typescript
const card = tv({
  slots: {
    base: 'rounded-xl shadow-lg overflow-hidden',
    header: 'px-4 py-3 border-b',
    body: 'px-4 py-4',
    footer: 'px-4 py-3 border-t bg-gray-50',
  },
  variants: {
    color: {
      default: {
        base: 'bg-white',
        header: 'border-gray-200',
      },
      dark: {
        base: 'bg-gray-900 text-white',
        header: 'border-gray-700',
        footer: 'bg-gray-800',
      },
    },
  },
  defaultVariants: {
    color: 'default',
  },
});

// Usage
const { base, header, body, footer } = card({ color: 'dark' });

<div className={base()}>
  <div className={header()}>Title</div>
  <div className={body()}>Content</div>
  <div className={footer()}>Actions</div>
</div>
```

## Responsive Variants

Apply different variants at different breakpoints:

```typescript
const box = tv({
  base: 'rounded p-4',
  variants: {
    color: {
      blue: 'bg-blue-500',
      red: 'bg-red-500',
      green: 'bg-green-500',
    },
  },
}, {
  responsiveVariants: ['sm', 'md', 'lg'], // Enable responsive variants
});

// Different colors at different breakpoints
<div className={box({
  color: {
    initial: 'blue',  // Mobile
    sm: 'red',        // sm and up
    lg: 'green',      // lg and up
  },
})}>
  Responsive!
</div>
```

## Extending Variants

Extend existing variants with new styles:

```typescript
const baseButton = tv({
  base: 'font-medium rounded',
  variants: {
    size: {
      sm: 'text-sm px-2 py-1',
      md: 'text-base px-4 py-2',
    },
  },
});

const iconButton = tv({
  extend: baseButton,
  base: 'inline-flex items-center gap-2',
  variants: {
    size: {
      sm: 'p-1', // Override padding for icon buttons
      md: 'p-2',
    },
  },
});
```

## TypeScript Support

Full type inference for variants:

```typescript
import { tv, type VariantProps } from 'tailwind-variants';

const button = tv({
  variants: {
    color: {
      primary: '...',
      secondary: '...',
    },
    size: {
      sm: '...',
      md: '...',
    },
  },
});

type ButtonVariants = VariantProps<typeof button>;
// { color?: 'primary' | 'secondary', size?: 'sm' | 'md' }

interface ButtonProps extends ButtonVariants {
  children: React.ReactNode;
}

function Button({ color, size, children }: ButtonProps) {
  return <button className={button({ color, size })}>{children}</button>;
}
```

## Tailwind Config (Optional)

For automatic class sorting with Prettier:

```javascript
// tailwind.config.js
const { withTV } = require('tailwind-variants/transformer');

module.exports = withTV({
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  // ... rest of config
});
```

## Comparison with CVA

| Feature | Tailwind Variants | CVA |
|---------|-------------------|-----|
| Variants | Yes | Yes |
| Compound Variants | Yes | Yes |
| Slots | Yes | No |
| Responsive Variants | Yes | No |
| Extend/Inherit | Yes | No |
| TypeScript | Yes | Yes |
