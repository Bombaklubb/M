---
name: shadcn-ui
description: "shadcn/ui component library expert. Use when the user wants to add, use, customize or get help with shadcn/ui components (Button, Dialog, Card, Table, Form, Select, etc.) in React/Next.js projects with Tailwind CSS. Source: https://github.com/shadcn-ui/ui"
---

# shadcn/ui – Component Library

shadcn/ui is a collection of re-usable components built with Radix UI and Tailwind CSS. Components are **copied into your project** (not installed as a package dependency) so you own and can customize every line.

## Key Facts

- **Not an npm package** – components live in `components/ui/` in your repo
- Built on **Radix UI** primitives (accessible by default)
- Styled with **Tailwind CSS** utility classes
- Works with **React 18+**, **Next.js 13+** (App Router and Pages Router)
- TypeScript-first

## Installation (new project)

```bash
npx shadcn@latest init
```

Prompts for: style (Default/New York), base color, CSS variables usage.

## Adding Components

```bash
# Add a single component
npx shadcn@latest add button

# Add multiple at once
npx shadcn@latest add card dialog table form select badge
```

Each command copies the component file(s) into `components/ui/`.

## Core Components Reference

### Layout & Containers
| Component | Description |
|-----------|-------------|
| `Card` | Content container with header/content/footer slots |
| `Separator` | Visual divider (horizontal or vertical) |
| `ScrollArea` | Custom scrollable container |
| `AspectRatio` | Lock element to an aspect ratio |
| `ResizablePanelGroup` | Draggable split-pane layout |

### Typography
| Component | Description |
|-----------|-------------|
| `Badge` | Small label/status chip |

### Forms & Inputs
| Component | Description |
|-----------|-------------|
| `Button` | Variants: default, secondary, destructive, ghost, link, outline |
| `Input` | Text input |
| `Textarea` | Multi-line input |
| `Label` | Accessible form label |
| `Select` | Dropdown select with search |
| `Checkbox` | Boolean toggle |
| `RadioGroup` | Single-choice from a group |
| `Switch` | Toggle switch |
| `Slider` | Range input |
| `Form` | React Hook Form integration with validation |

### Feedback & Overlay
| Component | Description |
|-----------|-------------|
| `Dialog` | Modal dialog |
| `AlertDialog` | Confirmation dialog with destructive action |
| `Sheet` | Side-panel (drawer) |
| `Popover` | Floating content panel |
| `Tooltip` | Hover tooltip |
| `Toast` / `Sonner` | Notification toasts |
| `Alert` | Inline alert message |
| `Progress` | Progress bar |
| `Skeleton` | Loading placeholder |

### Navigation
| Component | Description |
|-----------|-------------|
| `NavigationMenu` | Multi-level nav with dropdowns |
| `Tabs` | Tabbed content |
| `Breadcrumb` | Path navigation |
| `Pagination` | Page navigation |
| `Command` | Command palette (⌘K style) |
| `DropdownMenu` | Context/dropdown menu |
| `ContextMenu` | Right-click menu |
| `Menubar` | Desktop-style menu bar |

### Data Display
| Component | Description |
|-----------|-------------|
| `Table` | Accessible data table |
| `DataTable` | TanStack Table integration |
| `Calendar` | Date picker calendar |
| `Avatar` | User avatar with fallback |
| `HoverCard` | Rich preview on hover |
| `Carousel` | Image/content carousel |
| `Chart` | Recharts-based charts |

### Disclosure
| Component | Description |
|-----------|-------------|
| `Accordion` | Expandable sections |
| `Collapsible` | Single expandable |

## Usage Examples

### Button variants
```tsx
import { Button } from "@/components/ui/button"

<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button disabled>Disabled</Button>
```

### Card
```tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description text</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Dialog
```tsx
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* content */}
  </DialogContent>
</Dialog>
```

### Form with validation (React Hook Form + Zod)
```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const schema = z.object({ name: z.string().min(2) })

function MyForm() {
  const form = useForm({ resolver: zodResolver(schema) })
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => console.log(data))}>
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

### Tabs
```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

## Customization

Components use CSS variables for theming. Edit `globals.css`:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  /* ... */
}
.dark {
  --background: 222.2 84% 4.9%;
  /* ... */
}
```

Override component styles by editing the file in `components/ui/` directly – you own it.

## cn() utility

shadcn uses `cn()` to merge Tailwind classes:
```tsx
import { cn } from "@/lib/utils"

<div className={cn("base-class", condition && "conditional-class", className)} />
```

## File structure after init
```
components/
  ui/
    button.tsx
    card.tsx
    dialog.tsx
    ...
lib/
  utils.ts        ← cn() helper
```

## Theming: New York vs Default style

- **Default**: rounded corners, bordered inputs
- **New York**: slightly different sizing, box-shadows instead of borders

Set during `npx shadcn@latest init`. Can be changed per component by copying from the other style in the docs.
