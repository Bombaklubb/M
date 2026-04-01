---
name: radix-ui
description: Radix UI Primitives expert. Use when the user wants to build accessible, unstyled UI components in React. Provides low-level primitives for Dialog, Dropdown, Tabs, Tooltip, Popover, Select, and more. Source: https://github.com/radix-ui/primitives
---

# Radix UI Primitives

Unstyled, accessible UI primitives for React applications.

## Installation

```bash
# Install individual components
npm install @radix-ui/react-dialog
npm install @radix-ui/react-dropdown-menu
npm install @radix-ui/react-tabs
npm install @radix-ui/react-tooltip
npm install @radix-ui/react-popover
npm install @radix-ui/react-select
npm install @radix-ui/react-accordion
npm install @radix-ui/react-checkbox
npm install @radix-ui/react-slider
npm install @radix-ui/react-switch
```

## Available Components

| Component | Package |
|-----------|---------|
| Accordion | `@radix-ui/react-accordion` |
| Alert Dialog | `@radix-ui/react-alert-dialog` |
| Aspect Ratio | `@radix-ui/react-aspect-ratio` |
| Avatar | `@radix-ui/react-avatar` |
| Checkbox | `@radix-ui/react-checkbox` |
| Collapsible | `@radix-ui/react-collapsible` |
| Context Menu | `@radix-ui/react-context-menu` |
| Dialog | `@radix-ui/react-dialog` |
| Dropdown Menu | `@radix-ui/react-dropdown-menu` |
| Hover Card | `@radix-ui/react-hover-card` |
| Label | `@radix-ui/react-label` |
| Menubar | `@radix-ui/react-menubar` |
| Navigation Menu | `@radix-ui/react-navigation-menu` |
| Popover | `@radix-ui/react-popover` |
| Progress | `@radix-ui/react-progress` |
| Radio Group | `@radix-ui/react-radio-group` |
| Scroll Area | `@radix-ui/react-scroll-area` |
| Select | `@radix-ui/react-select` |
| Separator | `@radix-ui/react-separator` |
| Slider | `@radix-ui/react-slider` |
| Switch | `@radix-ui/react-switch` |
| Tabs | `@radix-ui/react-tabs` |
| Toast | `@radix-ui/react-toast` |
| Toggle | `@radix-ui/react-toggle` |
| Toggle Group | `@radix-ui/react-toggle-group` |
| Toolbar | `@radix-ui/react-toolbar` |
| Tooltip | `@radix-ui/react-tooltip` |

## Usage Examples

### Dialog

```jsx
import * as Dialog from '@radix-ui/react-dialog';

function MyDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button>Open Dialog</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg">
          <Dialog.Title>Dialog Title</Dialog.Title>
          <Dialog.Description>Dialog description here.</Dialog.Description>
          <Dialog.Close asChild>
            <button>Close</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

### Dropdown Menu

```jsx
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

function MyDropdown() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button>Options</button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="bg-white rounded-md shadow-lg p-2">
          <DropdownMenu.Item className="px-2 py-1 cursor-pointer hover:bg-gray-100">
            Edit
          </DropdownMenu.Item>
          <DropdownMenu.Item className="px-2 py-1 cursor-pointer hover:bg-gray-100">
            Duplicate
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
          <DropdownMenu.Item className="px-2 py-1 cursor-pointer hover:bg-red-100 text-red-600">
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
```

### Tabs

```jsx
import * as Tabs from '@radix-ui/react-tabs';

function MyTabs() {
  return (
    <Tabs.Root defaultValue="tab1">
      <Tabs.List className="flex border-b">
        <Tabs.Trigger value="tab1" className="px-4 py-2 data-[state=active]:border-b-2">
          Tab 1
        </Tabs.Trigger>
        <Tabs.Trigger value="tab2" className="px-4 py-2 data-[state=active]:border-b-2">
          Tab 2
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1" className="p-4">Content 1</Tabs.Content>
      <Tabs.Content value="tab2" className="p-4">Content 2</Tabs.Content>
    </Tabs.Root>
  );
}
```

### Select

```jsx
import * as Select from '@radix-ui/react-select';

function MySelect() {
  return (
    <Select.Root>
      <Select.Trigger className="inline-flex items-center gap-2 px-4 py-2 border rounded">
        <Select.Value placeholder="Select option..." />
        <Select.Icon />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="bg-white rounded-md shadow-lg">
          <Select.Viewport className="p-2">
            <Select.Item value="apple" className="px-2 py-1 cursor-pointer hover:bg-gray-100">
              <Select.ItemText>Apple</Select.ItemText>
            </Select.Item>
            <Select.Item value="banana" className="px-2 py-1 cursor-pointer hover:bg-gray-100">
              <Select.ItemText>Banana</Select.ItemText>
            </Select.Item>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
```

### Tooltip

```jsx
import * as Tooltip from '@radix-ui/react-tooltip';

function MyTooltip() {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button>Hover me</button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="bg-gray-900 text-white px-2 py-1 rounded text-sm">
            Tooltip content
            <Tooltip.Arrow className="fill-gray-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
```

## Key Concepts

- **Unstyled**: Components come with no styles, full control over appearance
- **Accessible**: WAI-ARIA compliant, keyboard navigation built-in
- **Composable**: Use compound components pattern for flexibility
- **asChild**: Merge props onto child element instead of rendering wrapper
- **data-state**: Use CSS attribute selectors for state-based styling
