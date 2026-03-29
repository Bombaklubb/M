---
name: fontsource
description: Fontsource expert. Use when the user wants to self-host Google Fonts or other open source fonts in their project. Supports 1500+ font families with npm packages for React, Next.js, Vue, and any web project. Source: https://github.com/fontsource/fontsource
---

# Fontsource

Self-host open source fonts in neatly bundled npm packages.

## Installation

```bash
# Install a specific font (e.g., Inter, Roboto, Open Sans)
npm install @fontsource/inter
npm install @fontsource/roboto
npm install @fontsource/open-sans

# Variable fonts (recommended for modern browsers)
npm install @fontsource-variable/inter
npm install @fontsource-variable/roboto-flex
```

## Usage

### Basic Import (CSS)

```javascript
// Import in your entry file (e.g., index.js, _app.js, main.js)
import '@fontsource/inter';

// Then use in CSS
// font-family: 'Inter', sans-serif;
```

### Variable Fonts

```javascript
import '@fontsource-variable/inter';

// CSS with variable font features
// font-family: 'Inter Variable', sans-serif;
// font-weight: 100 900; /* Any weight between 100-900 */
```

### Specific Weights & Styles

```javascript
// Import only specific weights to reduce bundle size
import '@fontsource/inter/400.css';  // Regular
import '@fontsource/inter/500.css';  // Medium
import '@fontsource/inter/700.css';  // Bold

// Import italic variants
import '@fontsource/inter/400-italic.css';
```

### Subsets (Latin, Cyrillic, etc.)

```javascript
// Import specific subsets
import '@fontsource/inter/latin.css';
import '@fontsource/inter/cyrillic.css';
```

## React/Next.js Example

```jsx
// pages/_app.js or app/layout.js
import '@fontsource-variable/inter';

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
```

```css
/* globals.css */
body {
  font-family: 'Inter Variable', sans-serif;
}
```

## Tailwind CSS Integration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    fontFamily: {
      sans: ['Inter Variable', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
      mono: ['Fira Code Variable', 'monospace'],
    },
  },
};
```

## Popular Fonts

| Font | Package | Type |
|------|---------|------|
| Inter | `@fontsource-variable/inter` | Variable |
| Roboto | `@fontsource/roboto` | Static |
| Open Sans | `@fontsource-variable/open-sans` | Variable |
| Lato | `@fontsource/lato` | Static |
| Montserrat | `@fontsource-variable/montserrat` | Variable |
| Poppins | `@fontsource/poppins` | Static |
| Source Code Pro | `@fontsource-variable/source-code-pro` | Variable |
| Fira Code | `@fontsource-variable/fira-code` | Variable |
| Playfair Display | `@fontsource-variable/playfair-display` | Variable |
| JetBrains Mono | `@fontsource-variable/jetbrains-mono` | Variable |

## Benefits

- **Self-hosted**: No external requests to Google Fonts
- **Privacy**: GDPR compliant, no tracking
- **Performance**: Fonts load from your domain
- **Offline**: Works without internet connection
- **Tree-shaking**: Import only what you need
