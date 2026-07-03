# Component Library

> Reusable, accessible, theme-aware UI primitives for the Frontend Multiverse application.

## Table of Contents

- [Architecture](#architecture)
- [Shared Utilities](#shared-utilities)
- [Core](#core)
- [Layout](#layout)
- [Actions](#actions)
- [Display](#display)
- [Feedback](#feedback)
- [Overlay](#overlay)
- [Forms](#forms)
- [Navigation](#navigation)
- [State](#state)

---

## Architecture

```
src/components/ui/
├── shared-hooks.ts          # useControllableState, useId, useEscapeKey, useClickOutside
├── shared-icons.ts          # LoadingSpinner, CloseIcon, CheckIcon, ChevronDownIcon, etc.
├── core/                    # Typography (Heading, Text, Label, Caption) + Divider
├── layout/                  # Container, Section, Stack, Flex, Grid, Spacer
├── actions/                 # Button, IconButton
├── display/                 # Surface, Card, Badge, Chip, Avatar, Image
├── feedback/                # Skeleton, Spinner, Loader, Progress, Alert, Toast
├── overlay/                 # Tooltip, Popover, Dialog, Modal, Drawer
├── forms/                   # Input, Textarea, Checkbox, Radio, Switch, Select, Combobox, Search
├── navigation/              # Breadcrumb, Pagination, Accordion, Tabs
├── state/                   # EmptyState, ErrorState, LoadingState
└── index.ts                 # Barrel export for all categories
```

### Import Pattern

```tsx
// Individual imports (preferred for tree-shaking)
import { Button } from "@/components/ui/actions/button";
import type { ButtonProps } from "@/components/ui/actions/button";

// Barrel import (all components)
import { Button, Card, Input, Dialog } from "@/components/ui";
```

### Conventions

| Convention           | Rule                                                                            |
| -------------------- | ------------------------------------------------------------------------------- |
| **Props interface**  | Always exported as `export interface XxxProps`                                  |
| **forwardRef**       | Used on all leaf DOM elements                                                   |
| **className**        | Always accepted via `ComponentPropsWithoutRef` base type                        |
| **cn()**             | Used for all className merging (`clsx` + `tailwind-merge`)                      |
| **Theme tokens**     | All styles use semantic Tailwind tokens (e.g., `text-foreground`, `bg-surface`) |
| **Variant pattern**  | Union types with `Record<Variant, string>` style maps                           |
| **Size pattern**     | Union types with `Record<Size, string>` style maps                              |
| **Disabled/loading** | `disabled` prop sets `aria-disabled` + `pointer-events-none` + `opacity-50`     |
| **Error state**      | `error?: string` prop with `aria-invalid` + `aria-describedby`                  |

---

## Shared Utilities

### `useControllableState<T>`

Hook for controlled/uncontrolled component state.

```tsx
import { useControllableState } from "@/components/ui/shared-hooks";

const [value, setValue] = useControllableState({
  defaultValue: "hello",
  value: controlledValue, // optional
  onChange: handleChange, // optional
});
```

### `useControllableBoolean`

Boolean-specific wrapper around `useControllableState`.

```tsx
const [open, setOpen] = useControllableBoolean({
  defaultValue: false,
  value: controlledOpen,
  onOpenChange: setOpen,
});
```

### `useEscapeKey`

Registers a keydown handler for the Escape key.

```tsx
useEscapeKey(() => setOpen(false), isDropdownOpen);
```

### `useClickOutside`

Calls a handler when a mousedown occurs outside one or more refs.

```tsx
const panelRef = useRef<HTMLDivElement>(null);
useClickOutside([panelRef], () => setOpen(false), isOpen);
```

### `useId`

Generates a stable, non-deterministic ID string for ARIA associations.

```tsx
const tooltipId = useId("tooltip");
// => "tooltip-a1b2c3d"
```

### Shared Icons

```tsx
import { LoadingSpinner, CloseIcon, CheckIcon, ChevronDownIcon, ChevronRightIcon, SearchIcon, ImageIcon } from "@/components/ui/shared-icons";

<LoadingSpinner className="size-4" />
<CloseIcon className="size-3.5" />
<CheckIcon className="size-4 text-primary" />
<ChevronDownIcon className="size-4 text-foreground-muted" />
<ChevronRightIcon className="size-4 text-foreground-muted" />
<SearchIcon className="size-5 text-foreground-muted" />
<ImageIcon className="size-6 text-foreground-muted" />
```

---

## Core

### Heading

Semantic heading with auto-mapped HTML level per size.

| Prop       | Type                                                              | Default  | Description                     |
| ---------- | ----------------------------------------------------------------- | -------- | ------------------------------- |
| `children` | `ReactNode`                                                       | —        | Heading content                 |
| `as`       | `"h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6"`                    | auto     | Override the HTML heading level |
| `size`     | `"xs" \| "sm" \| "md" \| "lg" \| "xl" \| "2xl" \| "3xl" \| "4xl"` | `"md"`   | Visual size                     |
| `weight`   | `"light" \| "regular" \| "medium" \| "semibold" \| "bold"`        | `"bold"` | Font weight                     |

**Auto-mapped levels:** `xs→h6`, `sm→h5`, `md→h4`, `lg→h3`, `xl→h2`, `2xl→h2`, `3xl→h1`, `4xl→h1`.

```tsx
import { Heading } from "@/components/ui";

<Heading size="3xl">Page Title</Heading>
<Heading size="sm" weight="medium" as="h3">Subsection</Heading>
```

**Accessibility:** Uses semantic `<h1>`–`<h6>` elements. Auto-maps levels for correct document outline.

**Future extension:** Add `truncated` prop for text overflow with ellipsis.

---

### Text

Polymorphic body/inline text component.

| Prop            | Type                                                           | Default     | Description              |
| --------------- | -------------------------------------------------------------- | ----------- | ------------------------ |
| `children`      | `ReactNode`                                                    | —           | Text content             |
| `as`            | `"p" \| "span" \| "div"`                                       | `"p"`       | HTML element             |
| `size`          | `"2xs" \| "xs" \| "sm" \| "base" \| "lg" \| "xl" \| "2xl"`     | `"base"`    | Font size                |
| `weight`        | `"light" \| "regular" \| "medium" \| "semibold" \| "bold"`     | `"regular"` | Font weight              |
| `color`         | `"default" \| "secondary" \| "muted" \| "subtle" \| "inverse"` | `"default"` | Text color               |
| `italic`        | `boolean`                                                      | `false`     | Italic style             |
| `underline`     | `boolean`                                                      | `false`     | Underline decoration     |
| `strikethrough` | `boolean`                                                      | `false`     | Strikethrough decoration |

```tsx
import { Text } from "@/components/ui";

<Text>Default paragraph text.</Text>
<Text size="sm" color="muted">Small muted caption.</Text>
<Text as="span" italic>Italic inline text.</Text>
```

**Accessibility:** Uses semantic `<p>`, `<span>`, or `<div>` elements.

---

### Label

Form label with required indicator.

| Prop       | Type                     | Default | Description                 |
| ---------- | ------------------------ | ------- | --------------------------- |
| `children` | `ReactNode`              | —       | Label text                  |
| `size`     | `"xs" \| "sm" \| "base"` | `"sm"`  | Font size                   |
| `required` | `boolean`                | `false` | Show required asterisk      |
| `disabled` | `boolean`                | `false` | Dim and set `aria-disabled` |

```tsx
import { Label } from "@/components/ui";

<Label htmlFor="email" required>Email</Label>
<Label disabled>Disabled field</Label>
```

**Accessibility:** Renders a `<label>` element. The `required` asterisk is `aria-hidden`. `disabled` sets `aria-disabled`.

---

### Caption

Small supporting text for metadata, footnotes, timestamps.

| Prop       | Type                               | Default     | Description  |
| ---------- | ---------------------------------- | ----------- | ------------ |
| `children` | `ReactNode`                        | —           | Caption text |
| `size`     | `"2xs" \| "xs" \| "sm"`            | `"xs"`      | Font size    |
| `color`    | `"default" \| "muted" \| "subtle"` | `"default"` | Text color   |

```tsx
import { Caption } from "@/components/ui";

<Caption>Last updated 2 hours ago</Caption>
<Caption size="2xs" color="muted">v1.0.0</Caption>
```

---

### Divider

Visual separator line.

| Prop          | Type                          | Default        | Description    |
| ------------- | ----------------------------- | -------------- | -------------- |
| `orientation` | `"horizontal" \| "vertical"`  | `"horizontal"` | Line direction |
| `size`        | `"thin" \| "base" \| "thick"` | `"thin"`       | Line thickness |

```tsx
import { Divider } from "@/components/ui";

<Divider />
<Divider orientation="vertical" size="base" />
```

**Accessibility:** Uses `<hr>` with `role="separator"` and `aria-orientation`.

---

## Layout

### Container

Max-width wrapper with responsive padding.

| Prop       | Type                                                                  | Default | Description           |
| ---------- | --------------------------------------------------------------------- | ------- | --------------------- |
| `children` | `ReactNode`                                                           | —       | Container content     |
| `size`     | `"sm" \| "md" \| "lg" \| "xl" \| "2xl" \| "3xl" \| "prose" \| "full"` | `"lg"`  | Max width             |
| `padded`   | `boolean`                                                             | `true`  | Horizontal padding    |
| `centered` | `boolean`                                                             | `true`  | Center with `mx-auto` |

```tsx
import { Container } from "@/components/ui";

<Container>
  <p>Centered content with max-width.</p>
</Container>

<Container size="prose" padded={false}>
  <article>Article prose content.</article>
</Container>
```

**Best practice:** Use `prose` for readable text content, `lg`/`xl` for page layouts.

---

### Section

Page section wrapper with vertical padding scale.

| Prop       | Type                                            | Default | Description                |
| ---------- | ----------------------------------------------- | ------- | -------------------------- |
| `children` | `ReactNode`                                     | —       | Section content            |
| `size`     | `"xs" \| "sm" \| "md" \| "lg" \| "xl" \| "2xl"` | `"md"`  | Vertical padding           |
| `padded`   | `boolean`                                       | `true`  | Include horizontal padding |

```tsx
import { Section } from "@/components/ui";

<Section size="lg">
  <Container>
    <Heading>Featured Projects</Heading>
  </Container>
</Section>;
```

**Spacing scale:** `xs=32px`, `sm=48px`, `md=64px`, `lg=96px`, `xl=128px`, `2xl=192px`.

---

### Stack

Vertical or horizontal flex layout with consistent gap.

| Prop        | Type                                                                | Default     | Description          |
| ----------- | ------------------------------------------------------------------- | ----------- | -------------------- |
| `children`  | `ReactNode`                                                         | —           | Stack items          |
| `direction` | `"row" \| "col" \| "row-reverse" \| "col-reverse"`                  | `"col"`     | Flex direction       |
| `gap`       | `"none" \| "xs" \| "sm" \| "md" \| "lg" \| "xl"`                    | `"md"`      | Item spacing         |
| `align`     | `"start" \| "center" \| "end" \| "stretch" \| "baseline"`           | `"stretch"` | Cross-axis alignment |
| `justify`   | `"start" \| "center" \| "end" \| "between" \| "around" \| "evenly"` | `"start"`   | Main-axis alignment  |
| `wrap`      | `boolean`                                                           | `false`     | Allow wrapping       |

```tsx
import { Stack } from "@/components/ui";

<Stack direction="col" gap="lg">
  <Heading>Title</Heading>
  <Text>Description text.</Text>
  <Button>Action</Button>
</Stack>

<Stack direction="row" gap="sm" align="center">
  <Avatar fallback="JD" />
  <Text>John Doe</Text>
</Stack>
```

**Best practice:** Use `Stack` for vertical layouts (forms, lists, sections). Use `Flex` for horizontal layouts (toolbars, rows).

---

### Flex

Horizontal flex layout primitive.

| Prop       | Type                                                                | Default    | Description          |
| ---------- | ------------------------------------------------------------------- | ---------- | -------------------- |
| `children` | `ReactNode`                                                         | —          | Flex items           |
| `align`    | `"start" \| "center" \| "end" \| "stretch" \| "baseline"`           | `"center"` | Cross-axis alignment |
| `justify`  | `"start" \| "center" \| "end" \| "between" \| "around" \| "evenly"` | `"start"`  | Main-axis alignment  |
| `gap`      | `"none" \| "xs" \| "sm" \| "md" \| "lg" \| "xl"`                    | `"md"`     | Item spacing         |
| `wrap`     | `boolean`                                                           | `false`    | Allow wrapping       |
| `inline`   | `boolean`                                                           | `false`    | Use `inline-flex`    |

```tsx
import { Flex } from "@/components/ui";

<Flex justify="between" align="center">
  <Heading>Section</Heading>
  <Button variant="outline">View All</Button>
</Flex>

<Flex gap="sm" wrap>
  <Badge>React</Badge>
  <Badge>TypeScript</Badge>
  <Badge>Tailwind</Badge>
</Flex>
```

---

### Grid

CSS Grid with fixed columns or auto-fill responsive layout.

| Prop           | Type                                             | Default  | Description                           |
| -------------- | ------------------------------------------------ | -------- | ------------------------------------- |
| `children`     | `ReactNode`                                      | —        | Grid items                            |
| `columns`      | `1–12 \| "none"`                                 | `"none"` | Fixed column count                    |
| `gap`          | `"none" \| "xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"`   | Cell spacing                          |
| `minItemWidth` | `string`                                         | —        | Auto-fill min width (e.g., `"250px"`) |

```tsx
import { Grid } from "@/components/ui";

<Grid columns={3} gap="lg">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</Grid>

<Grid minItemWidth="300px" gap="md">
  {items.map(item => <Card key={item.id}>{item.name}</Card>)}
</Grid>
```

**Best practice:** Use `minItemWidth` for responsive grids that adapt to container width.

---

### Spacer

Invisible spacing element for layout gaps.

| Prop   | Type                                   | Default      | Description  |
| ------ | -------------------------------------- | ------------ | ------------ |
| `size` | `"xs"–"4xl"`                           | `"md"`       | Spacing size |
| `axis` | `"vertical" \| "horizontal" \| "both"` | `"vertical"` | Direction    |

```tsx
import { Spacer } from "@/components/ui";

<Stack>
  <Heading>Title</Heading>
  <Spacer size="lg" />
  <Text>Content after spacing.</Text>
</Stack>;
```

**Accessibility:** Always `aria-hidden="true"`.

---

## Actions

### Button

Primary action button with variants, sizes, loading, and icon slots.

| Prop        | Type                                                                     | Default     | Description                       |
| ----------- | ------------------------------------------------------------------------ | ----------- | --------------------------------- |
| `children`  | `ReactNode`                                                              | —           | Button label                      |
| `variant`   | `"primary" \| "secondary" \| "outline" \| "ghost" \| "danger" \| "link"` | `"primary"` | Visual style                      |
| `size`      | `"xs" \| "sm" \| "md" \| "lg" \| "xl"`                                   | `"md"`      | Button size                       |
| `loading`   | `boolean`                                                                | `false`     | Show spinner, disable interaction |
| `disabled`  | `boolean`                                                                | `false`     | Disable interaction               |
| `fullWidth` | `boolean`                                                                | `false`     | Full container width              |
| `leftIcon`  | `ReactNode`                                                              | —           | Icon before label                 |
| `rightIcon` | `ReactNode`                                                              | —           | Icon after label                  |

```tsx
import { Button } from "@/components/ui";

<Button>Save</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button variant="danger" loading>Deleting...</Button>
<Button variant="ghost" leftIcon={<PlusIcon />}>Add Item</Button>
<Button variant="link">Learn more →</Button>
```

**Accessibility:** Uses `<button>` with `aria-disabled` and `aria-busy` when loading. Focus ring via `focus-visible:ring-2`.

**Variants:**

- `primary` — Filled with primary color
- `secondary` — Filled with secondary color
- `outline` — Border with transparent background
- `ghost` — No background, hover overlay
- `danger` — Filled with danger color
- `link` — Underline on hover, no padding

---

### IconButton

Icon-only button with required accessible label.

| Prop           | Type                                                           | Default   | Description                    |
| -------------- | -------------------------------------------------------------- | --------- | ------------------------------ |
| `icon`         | `ReactNode`                                                    | —         | The icon element               |
| `"aria-label"` | `string`                                                       | —         | **Required.** Accessible label |
| `variant`      | `"primary" \| "secondary" \| "outline" \| "ghost" \| "danger"` | `"ghost"` | Visual style                   |
| `size`         | `"xs" \| "sm" \| "md" \| "lg" \| "xl"`                         | `"md"`    | Button size                    |
| `loading`      | `boolean`                                                      | `false`   | Show spinner                   |

```tsx
import { IconButton } from "@/components/ui";

<IconButton icon={<TrashIcon />} aria-label="Delete item" variant="danger" />
<IconButton icon={<SearchIcon />} aria-label="Search" size="sm" />
```

**Accessibility:** `aria-label` is required. `aria-disabled` and `aria-busy` applied when disabled/loading.

---

## Display

### Surface

Generic container with elevation, background, and border.

| Prop          | Type                                                        | Default     | Description           |
| ------------- | ----------------------------------------------------------- | ----------- | --------------------- |
| `children`    | `ReactNode`                                                 | —           | Surface content       |
| `variant`     | `"default" \| "raised" \| "overlay" \| "sunken" \| "inset"` | `"default"` | Background + shadow   |
| `padding`     | `"none" \| "xs" \| "sm" \| "md" \| "lg" \| "xl"`            | `"md"`      | Inner padding         |
| `radius`      | `"none"–"full"`                                             | `"lg"`      | Border radius         |
| `bordered`    | `boolean`                                                   | `false`     | Show border           |
| `interactive` | `boolean`                                                   | `false`     | Hover effect + cursor |

```tsx
import { Surface } from "@/components/ui";

<Surface variant="raised" padding="lg" bordered>
  <Text>Raised surface with border.</Text>
</Surface>

<Surface variant="sunken" padding="sm">
  <Text>Sunken inset area.</Text>
</Surface>
```

---

### Card

Card container with composable sub-components.

| Component           | Key Props                                                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Card**            | `variant?: "default" \| "interactive" \| "selectable" \| "outlined"`, `padding?: "none"–"xl"`, `bordered?: boolean` |
| **CardHeader**      | `children`, `className`                                                                                             |
| **CardTitle**       | `children`, `className`                                                                                             |
| **CardDescription** | `children`, `className`                                                                                             |
| **CardContent**     | `children`, `className`                                                                                             |
| **CardFooter**      | `children`, `className`                                                                                             |

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui";

<Card variant="interactive">
  <CardHeader>
    <CardTitle>Project Name</CardTitle>
    <CardDescription>Brief description of the project.</CardDescription>
  </CardHeader>
  <CardContent>
    <Text>Additional details and content.</Text>
  </CardContent>
  <CardFooter>
    <Button size="sm">View Details</Button>
    <Button size="sm" variant="ghost">
      Dismiss
    </Button>
  </CardFooter>
</Card>;
```

**Variants:**

- `default` — Shadow card
- `interactive` — Elevated shadow on hover + slight lift
- `selectable` — Subtle shadow on hover
- `outlined` — Border only, no shadow

---

### Badge

Inline status/label indicator.

| Prop       | Type                                                                                                 | Default     | Description     |
| ---------- | ---------------------------------------------------------------------------------------------------- | ----------- | --------------- |
| `children` | `ReactNode`                                                                                          | —           | Badge text      |
| `variant`  | `"default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger" \| "info" \| "outline"` | `"default"` | Color style     |
| `size`     | `"xs" \| "sm" \| "md"`                                                                               | `"sm"`      | Badge size      |
| `dot`      | `boolean`                                                                                            | `false`     | Show status dot |

```tsx
import { Badge } from "@/components/ui";

<Badge variant="success" dot>Active</Badge>
<Badge variant="danger">Critical</Badge>
<Badge variant="outline" size="xs">v2.0</Badge>
```

---

### Chip

Removable tag/chip element.

| Prop        | Type                   | Default     | Description          |
| ----------- | ---------------------- | ----------- | -------------------- |
| `children`  | `ReactNode`            | —           | Chip text            |
| `variant`   | same as Badge          | `"default"` | Color style          |
| `size`      | `"sm" \| "md" \| "lg"` | `"md"`      | Chip size            |
| `removable` | `boolean`              | `false`     | Show close button    |
| `onRemove`  | `() => void`           | —           | Close button handler |

```tsx
import { Chip } from "@/components/ui";

<Chip variant="primary">React</Chip>
<Chip variant="info" removable onRemove={() => removeTag("typescript")}>TypeScript</Chip>
```

---

### Avatar

User avatar with image, initials fallback, and auto-colored background.

| Component       | Key Props                                                                                                                               |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Avatar**      | `src?: string`, `alt?: string`, `fallback?: string` (initials source), `size?: "xs"–"2xl"`, `shape?: "circle" \| "square" \| "rounded"` |
| **AvatarGroup** | `children`, `max?: number` (default: `3`), `size?: AvatarSize`                                                                          |

```tsx
import { Avatar, AvatarGroup } from "@/components/ui";

<Avatar src="/photo.jpg" alt="Jane Smith" size="lg" />
<Avatar fallback="JD" size="md" />  {/* Shows "JD" with auto-colored bg */}
<Avatar fallback="AB" shape="square" />

<AvatarGroup max={4}>
  <Avatar fallback="A" />
  <Avatar fallback="B" />
  <Avatar fallback="C" />
  <Avatar fallback="D" />
  <Avatar fallback="E" />
</AvatarGroup>
```

**Fallback behavior:** When `src` fails to load or is missing, displays initials from `fallback` string. Background color is deterministically generated from the fallback text.

---

### Image

Image with skeleton loading, error fallback, and aspect ratio.

| Prop          | Type                                                       | Default   | Description               |
| ------------- | ---------------------------------------------------------- | --------- | ------------------------- |
| `src`         | `string`                                                   | —         | Image URL                 |
| `alt`         | `string`                                                   | —         | Alt text                  |
| `radius`      | `"none"–"full"`                                            | `"md"`    | Border radius             |
| `objectFit`   | `"cover" \| "contain" \| "fill" \| "none" \| "scale-down"` | `"cover"` | CSS object-fit            |
| `width`       | `number \| string`                                         | —         | Width                     |
| `height`      | `number \| string`                                         | —         | Height                    |
| `aspectRatio` | `string`                                                   | —         | CSS aspect-ratio          |
| `skeleton`    | `boolean`                                                  | `true`    | Show skeleton placeholder |
| `fallback`    | `ReactNode`                                                | —         | Custom error fallback     |

```tsx
import { Image } from "@/components/ui";

<Image src="/photo.jpg" alt="Landscape" width={400} height={300} radius="lg" />
<Image src="/avatar.jpg" alt="User" aspectRatio="1" radius="full" />
<Image src="/broken.jpg" alt="Fallback" fallback={<IconPlaceholder />} />
```

**Loading states:** Shows animated skeleton while loading. On error, shows fallback or default image icon.

---

## Feedback

### Spinner

Animated SVG loading indicator.

| Prop    | Type                                    | Default     | Description   |
| ------- | --------------------------------------- | ----------- | ------------- |
| `size`  | `"xs" \| "sm" \| "md" \| "lg" \| "xl"`  | `"md"`      | Spinner size  |
| `color` | `"primary" \| "secondary" \| "current"` | `"current"` | Spinner color |

```tsx
import { Spinner } from "@/components/ui";

<Spinner size="lg" color="primary" />;
```

**Accessibility:** `role="img"` with `aria-label="Loading"`.

---

### Loader

Multi-variant loading indicator.

| Prop      | Type                           | Default     | Description            |
| --------- | ------------------------------ | ----------- | ---------------------- |
| `size`    | `"sm" \| "md" \| "lg"`         | `"md"`      | Loader size            |
| `variant` | `"spinner" \| "dots" \| "bar"` | `"spinner"` | Loading animation type |
| `label`   | `string`                       | `"Loading"` | Accessible label       |

```tsx
import { Loader } from "@/components/ui";

<Loader />
<Loader variant="dots" size="sm" />
<Loader variant="bar" label="Uploading files" />
```

**Accessibility:** `role="status"` with `aria-label`.

---

### Progress

Progress bar with determinate, indeterminate, and striped modes.

| Prop            | Type                                                        | Default     | Description          |
| --------------- | ----------------------------------------------------------- | ----------- | -------------------- |
| `value`         | `number`                                                    | `0`         | Current value        |
| `max`           | `number`                                                    | `100`       | Maximum value        |
| `size`          | `"xs" \| "sm" \| "md" \| "lg"`                              | `"md"`      | Bar height           |
| `variant`       | `"default" \| "success" \| "warning" \| "danger" \| "info"` | `"default"` | Bar color            |
| `label`         | `string`                                                    | —           | Label text above bar |
| `showValue`     | `boolean`                                                   | `false`     | Show percentage      |
| `indeterminate` | `boolean`                                                   | `false`     | Unknown progress     |
| `striped`       | `boolean`                                                   | `false`     | Striped pattern      |

```tsx
import { Progress } from "@/components/ui";

<Progress value={60} label="Upload" showValue />
<Progress variant="success" value={100} />
<Progress indeterminate label="Processing" />
<Progress variant="warning" striped value={45} />
```

**Accessibility:** `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`.

---

### Skeleton

Placeholder loading element.

| Component        | Key Props                                                                                                               |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Skeleton**     | `variant?: "text" \| "circular" \| "rectangular" \| "rounded"`, `width?: string \| number`, `height?: string \| number` |
| **SkeletonText** | `lines?: number` (default: `3`)                                                                                         |
| **SkeletonCard** | — (renders image + title + text placeholder)                                                                            |

```tsx
import { Skeleton, SkeletonText, SkeletonCard } from "@/components/ui";

<Skeleton variant="circular" width={48} height={48} />
<Skeleton variant="rounded" height={200} />
<SkeletonText lines={4} />
<SkeletonCard />
```

**Accessibility:** `role="presentation"`, `aria-hidden="true"`. Purely visual.

---

### Alert

Inline notification banner with auto-icons.

| Prop       | Type                                                        | Default     | Description                  |
| ---------- | ----------------------------------------------------------- | ----------- | ---------------------------- |
| `variant`  | `"default" \| "info" \| "success" \| "warning" \| "danger"` | `"default"` | Alert style                  |
| `title`    | `string`                                                    | —           | Bold title                   |
| `children` | `ReactNode`                                                 | —           | Alert body                   |
| `closable` | `boolean`                                                   | `false`     | Show close button            |
| `onClose`  | `() => void`                                                | —           | Close handler                |
| `icon`     | `ReactNode`                                                 | —           | Custom icon (overrides auto) |

```tsx
import { Alert } from "@/components/ui";

<Alert variant="success" title="Saved" closable onClose={dismiss}>
  Your changes have been saved successfully.
</Alert>

<Alert variant="danger" title="Error">
  Unable to connect to the server.
</Alert>

<Alert variant="warning">
  Your trial expires in 3 days.
</Alert>
```

**Accessibility:** `role="alert"`. Auto-icons per variant provide visual reinforcement.

---

### Toast

Floating notification toast.

| Component          | Key Props                                                                                                                                                                   |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Toast**          | `variant?: "default" \| "info" \| "success" \| "warning" \| "danger"`, `title?: string`, `closable?: boolean` (default: `true`), `onClose?: () => void`, `icon?: ReactNode` |
| **ToastContainer** | `position?: "top-right" \| "top-left" \| "bottom-right" \| "bottom-left" \| "top-center" \| "bottom-center"` (default: `"bottom-right"`)                                    |

```tsx
import { Toast, ToastContainer } from "@/components/ui";

<ToastContainer position="top-right">
  <Toast variant="success" title="Deleted">
    Item removed.
  </Toast>
  <Toast variant="info" title="Update available" closable={false}>
    Version 2.0 is ready.
  </Toast>
</ToastContainer>;
```

**Accessibility:** `role="status"`, `aria-live="polite"`. Screen readers announce new toasts.

---

## Overlay

### Tooltip

Hover/focus tooltip with configurable side and delay.

| Component          | Key Props                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| **Tooltip**        | `side?: "top" \| "bottom" \| "left" \| "right"` (default: `"top"`), `delay?: number` (default: `200`) |
| **TooltipTrigger** | `children`                                                                                            |
| **TooltipContent** | `children`, `className`                                                                               |

```tsx
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui";

<Tooltip side="right" delay={100}>
  <TooltipTrigger>
    <IconButton icon={<SettingsIcon />} aria-label="Settings" />
  </TooltipTrigger>
  <TooltipContent>Open settings</TooltipContent>
</Tooltip>;
```

**Accessibility:** Trigger has `aria-describedby` linking to content. Content has `role="tooltip"`. Auto-hides on Escape.

---

### Popover

Click-triggered floating panel.

| Component          | Key Props                                                                                                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Popover**        | `defaultOpen?: boolean`, `open?: boolean`, `onOpenChange?: (open: boolean) => void`, `side?: "top" \| "bottom" \| "left" \| "right"`, `align?: "start" \| "center" \| "end"` |
| **PopoverTrigger** | `children`                                                                                                                                                                   |
| **PopoverContent** | `children`, `className`                                                                                                                                                      |
| **PopoverClose**   | `children?`                                                                                                                                                                  |

```tsx
import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from "@/components/ui";

<Popover>
  <PopoverTrigger>
    <Button variant="outline">Options</Button>
  </PopoverTrigger>
  <PopoverContent>
    <Stack gap="sm">
      <Text>Edit</Text>
      <Text>Duplicate</Text>
      <PopoverClose>
        <Button variant="ghost" size="sm">
          Close
        </Button>
      </PopoverClose>
    </Stack>
  </PopoverContent>
</Popover>;
```

**Accessibility:** `role="dialog"` with `aria-label`. Closes on Escape and click outside.

---

### Dialog

Compound modal dialog with full composition control.

| Component             | Key Props                                                                           |
| --------------------- | ----------------------------------------------------------------------------------- |
| **Dialog**            | `defaultOpen?: boolean`, `open?: boolean`, `onOpenChange?: (open: boolean) => void` |
| **DialogTrigger**     | `children`                                                                          |
| **DialogPortal**      | `children`                                                                          |
| **DialogOverlay**     | `className`                                                                         |
| **DialogContent**     | `children`, `className`                                                             |
| **DialogHeader**      | `children`, `className`                                                             |
| **DialogTitle**       | `children`, `className`                                                             |
| **DialogDescription** | `children`, `className`                                                             |
| **DialogFooter**      | `children`, `className`                                                             |
| **DialogClose**       | `children?`                                                                         |

```tsx
import {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui";

<Dialog>
  <DialogTrigger>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogPortal>
    <DialogOverlay />
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogDescription>This action cannot be undone.</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button variant="danger">Delete</Button>
      </DialogFooter>
    </DialogContent>
  </DialogPortal>
</Dialog>;
```

**Accessibility:** `role="dialog"`, `aria-modal="true"`. Focus trapped inside. Auto-closes on Escape.

---

### Modal

Self-contained modal with size variants. Simpler than Dialog.

| Component            | Key Props                                                                                                                                                                         |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Modal**            | `open?: boolean` (default: `false`), `onClose?: () => void`, `closeOnOverlayClick?: boolean` (default: `true`), `size?: "sm" \| "md" \| "lg" \| "xl" \| "full"` (default: `"md"`) |
| **ModalHeader**      | `children`, `className`                                                                                                                                                           |
| **ModalTitle**       | `children`, `className`                                                                                                                                                           |
| **ModalDescription** | `children`, `className`                                                                                                                                                           |
| **ModalBody**        | `children`, `className`                                                                                                                                                           |
| **ModalFooter**      | `children`, `className`                                                                                                                                                           |
| **ModalClose**       | `children?`                                                                                                                                                                       |

```tsx
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  ModalClose,
} from "@/components/ui";

<Modal open={isOpen} onClose={() => setIsOpen(false)} size="lg">
  <ModalHeader>
    <ModalTitle>Edit Profile</ModalTitle>
  </ModalHeader>
  <ModalBody>
    <Input label="Name" placeholder="Your name" />
  </ModalBody>
  <ModalFooter>
    <ModalClose>
      <Button variant="outline">Cancel</Button>
    </ModalClose>
    <Button>Save</Button>
  </ModalFooter>
</Modal>;
```

**When to use Dialog vs Modal:** Use `Dialog` for full composition control and context-based state. Use `Modal` for quick, self-contained modals with less boilerplate.

---

### Drawer

Slide-in side panel with overlay and scroll lock.

| Component             | Key Props                                                                                                                                                 |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Drawer**            | `defaultOpen?: boolean`, `open?: boolean`, `onOpenChange?: (open: boolean) => void`, `side?: "left" \| "right" \| "top" \| "bottom"` (default: `"right"`) |
| **DrawerTrigger**     | `children`                                                                                                                                                |
| **DrawerOverlay**     | `className`                                                                                                                                               |
| **DrawerContent**     | `children`, `className`                                                                                                                                   |
| **DrawerHeader**      | `children`, `className`                                                                                                                                   |
| **DrawerTitle**       | `children`, `className`                                                                                                                                   |
| **DrawerDescription** | `children`, `className`                                                                                                                                   |
| **DrawerBody**        | `children`, `className`                                                                                                                                   |
| **DrawerFooter**      | `children`, `className`                                                                                                                                   |
| **DrawerClose**       | `children?`                                                                                                                                               |

```tsx
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui";

<Drawer side="right">
  <DrawerTrigger>
    <IconButton icon={<MenuIcon />} aria-label="Open menu" />
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Navigation</DrawerTitle>
    </DrawerHeader>
    <DrawerBody>
      <Stack gap="md">
        <Text>Home</Text>
        <Text>Projects</Text>
        <Text>About</Text>
      </Stack>
    </DrawerBody>
    <DrawerFooter>
      <DrawerClose>
        <Button variant="outline" fullWidth>
          Close
        </Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>;
```

**Accessibility:** `role="dialog"`, `aria-modal="true"`. Dynamic `id` via `useId`. Body scroll locked when open. Closes on Escape.

---

## Forms

### Input

Text input with size, addons, and validation.

| Component       | Key Props                                                                                                                                                                                     |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Input**       | `size?: "sm" \| "md" \| "lg"` (default: `"md"`), `error?: string`, `leftAddon?: ReactNode`, `rightAddon?: ReactNode`, `fullWidth?: boolean` (default: `true`) + all `<input>` HTML attributes |
| **InputGroup**  | `children`, `className`                                                                                                                                                                       |
| **InputLabel**  | `children`, `htmlFor?: string`, `required?: boolean`, `className`                                                                                                                             |
| **InputHelper** | `children`, `className`                                                                                                                                                                       |

```tsx
import { Input, InputGroup, InputLabel, InputHelper } from "@/components/ui";

<InputGroup>
  <InputLabel htmlFor="email" required>Email</InputLabel>
  <Input id="email" placeholder="you@example.com" type="email" />
  <InputHelper>We'll never share your email.</InputHelper>
</InputGroup>

<InputGroup>
  <InputLabel>Website</InputLabel>
  <Input leftAddon="https://" placeholder="yoursite.com" />
</InputGroup>

<Input error="Invalid email address" placeholder="Invalid input" />
```

**Accessibility:** `aria-invalid` and `aria-describedby` applied when `error` is set. Focus ring via `focus-visible:ring-2`.

---

### Textarea

Multi-line text input.

| Prop                               | Type                   | Default | Description              |
| ---------------------------------- | ---------------------- | ------- | ------------------------ |
| `size`                             | `"sm" \| "md" \| "lg"` | `"md"`  | Input size               |
| `error`                            | `string`               | —       | Validation error message |
| `fullWidth`                        | `boolean`              | `true`  | Full container width     |
| + all `<textarea>` HTML attributes |                        |         |                          |

```tsx
import { Textarea } from "@/components/ui";

<Textarea placeholder="Write your thoughts..." rows={6} />
<Textarea error="Too many characters" maxLength={500} />
```

---

### Select

Native select dropdown.

| Prop          | Type                                                          | Default | Description      |
| ------------- | ------------------------------------------------------------- | ------- | ---------------- |
| `options`     | `Array<{ value: string; label: string; disabled?: boolean }>` | —       | Option list      |
| `placeholder` | `string`                                                      | —       | Placeholder text |
| `error`       | `string`                                                      | —       | Validation error |
| `size`        | `"sm" \| "md" \| "lg"`                                        | `"md"`  | Input size       |

```tsx
import { Select } from "@/components/ui";

<Select
  options={[
    { value: "react", label: "React" },
    { value: "vue", label: "Vue" },
    { value: "angular", label: "Angular" },
  ]}
  placeholder="Choose a framework"
/>

<Select error="Required" options={[]} />
```

---

### Checkbox

Custom-styled checkbox.

| Prop                                                  | Type                   | Default | Description      |
| ----------------------------------------------------- | ---------------------- | ------- | ---------------- |
| `size`                                                | `"sm" \| "md" \| "lg"` | `"md"`  | Checkbox size    |
| `label`                                               | `string`               | —       | Label text       |
| `error`                                               | `string`               | —       | Validation error |
| + all `<input>` HTML attributes (type, size excluded) |                        |         |                  |

```tsx
import { Checkbox } from "@/components/ui";

<Checkbox label="I agree to the terms" />
<Checkbox label="Enable notifications" defaultChecked />
<Checkbox error="Required" />
```

**Accessibility:** Uses `<input type="checkbox">` with `peer sr-only` for native behavior + custom visual.

---

### Radio

Custom-styled radio button with group wrapper.

| Component      | Key Props                                                                                |
| -------------- | ---------------------------------------------------------------------------------------- |
| **Radio**      | `size?: "sm" \| "md" \| "lg"`, `label?: string`, `error?: string` + `<input>` attributes |
| **RadioGroup** | `children`, `label?: string`, `error?: string`                                           |

```tsx
import { Radio, RadioGroup } from "@/components/ui";

<RadioGroup label="Choose a plan">
  <Radio name="plan" value="free" label="Free" />
  <Radio name="plan" value="pro" label="Pro" />
  <Radio name="plan" value="enterprise" label="Enterprise" />
</RadioGroup>;
```

**Accessibility:** `role="radiogroup"` on the group. Native `<input type="radio">` with custom visuals.

---

### Switch

Toggle switch.

| Prop              | Type                         | Default | Description          |
| ----------------- | ---------------------------- | ------- | -------------------- |
| `size`            | `"sm" \| "md" \| "lg"`       | `"md"`  | Switch size          |
| `checked`         | `boolean`                    | `false` | Controlled state     |
| `onCheckedChange` | `(checked: boolean) => void` | —       | State change handler |
| `label`           | `string`                     | —       | Label text           |
| `error`           | `string`                     | —       | Validation error     |

```tsx
import { Switch } from "@/components/ui";

<Switch label="Dark mode" checked={dark} onCheckedChange={setDark} />
<Switch label="Notifications" defaultChecked />
<Switch error="Required" />
```

**Accessibility:** `role="switch"`, `aria-checked`. Keyboard: Space to toggle.

---

### Search

Search input with icon, loading, and clear.

| Prop                                                  | Type                      | Default | Description              |
| ----------------------------------------------------- | ------------------------- | ------- | ------------------------ |
| `onSearch`                                            | `(value: string) => void` | —       | Enter-key search handler |
| `onClear`                                             | `() => void`              | —       | Clear button handler     |
| `loading`                                             | `boolean`                 | `false` | Show loading spinner     |
| `size`                                                | `"sm" \| "md" \| "lg"`    | `"md"`  | Input size               |
| `error`                                               | `string`                  | —       | Validation error         |
| + all `<input>` HTML attributes (type, size excluded) |                           |         |                          |

```tsx
import { Search } from "@/components/ui";

<Search placeholder="Search components..." onSearch={handleSearch} />
<Search loading placeholder="Searching..." size="lg" />
```

---

### Combobox

Searchable single-select dropdown with keyboard navigation.

| Prop                | Type                                                          | Default              | Description         |
| ------------------- | ------------------------------------------------------------- | -------------------- | ------------------- |
| `options`           | `Array<{ value: string; label: string; disabled?: boolean }>` | —                    | Option list         |
| `value`             | `string`                                                      | —                    | Controlled value    |
| `defaultValue`      | `string`                                                      | `""`                 | Initial value       |
| `onChange`          | `(value: string) => void`                                     | —                    | Selection handler   |
| `placeholder`       | `string`                                                      | `"Select..."`        | Trigger placeholder |
| `searchPlaceholder` | `string`                                                      | `"Search..."`        | Input placeholder   |
| `emptyMessage`      | `string`                                                      | `"No results found"` | Empty state text    |
| `error`             | `string`                                                      | —                    | Validation error    |
| `disabled`          | `boolean`                                                     | `false`              | Disable interaction |

```tsx
import { Combobox } from "@/components/ui";

<Combobox
  options={[
    { value: "react", label: "React" },
    { value: "vue", label: "Vue" },
    { value: "angular", label: "Angular" },
  ]}
  placeholder="Choose a framework"
  onChange={(value) => console.log(value)}
/>;
```

**Keyboard navigation:** ArrowUp/Down to move, Enter to select, Escape to close, Tab to blur.

**Accessibility:** `role="combobox"`, `aria-expanded`, `aria-haspopup="listbox"`, `aria-activedescendant`.

---

## Navigation

### Tabs

Tabbed interface with controlled/uncontrolled state.

| Component       | Key Props                                                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Tabs**        | `defaultValue: string` (required), `value?: string`, `onChange?: (value: string) => void`, `orientation?: "horizontal" \| "vertical"` |
| **TabsList**    | `children`, `className`                                                                                                               |
| **TabsTrigger** | `value: string` (required), `children`, `className`                                                                                   |
| **TabsContent** | `value: string` (required), `children`, `className`                                                                                   |

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";

<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="analytics">Analytics</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">
    <Text>Overview content here.</Text>
  </TabsContent>
  <TabsContent value="analytics">
    <Text>Analytics content here.</Text>
  </TabsContent>
  <TabsContent value="settings">
    <Text>Settings content here.</Text>
  </TabsContent>
</Tabs>;
```

**Accessibility:** `role="tablist"`, `role="tab"`, `role="tabpanel"`. `aria-selected`, `aria-controls`, `aria-labelledby`. Keyboard: Arrow keys to navigate tabs.

---

### Pagination

Page navigation with ellipsis.

| Prop           | Type                     | Default | Description              |
| -------------- | ------------------------ | ------- | ------------------------ |
| `currentPage`  | `number`                 | —       | Active page              |
| `totalPages`   | `number`                 | —       | Total pages              |
| `onPageChange` | `(page: number) => void` | —       | Page change handler      |
| `siblingCount` | `number`                 | `1`     | Pages shown on each side |

```tsx
import { Pagination } from "@/components/ui";

<Pagination currentPage={3} totalPages={10} onPageChange={setPage} />
<Pagination currentPage={1} totalPages={20} onPageChange={setPage} siblingCount={2} />
```

**Accessibility:** `role="navigation"`, `aria-label="Pagination"`. Active page has `aria-current="page"`.

---

### Breadcrumb

Navigation trail with customizable separator.

| Prop        | Type                                                            | Default                | Description      |
| ----------- | --------------------------------------------------------------- | ---------------------- | ---------------- |
| `items`     | `Array<{ label: string; href?: string; onClick?: () => void }>` | —                      | Breadcrumb items |
| `separator` | `ReactNode`                                                     | `<ChevronRightIcon />` | Custom separator |

```tsx
import { Breadcrumb } from "@/components/ui";

<Breadcrumb
  items={[
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Portfolio" }, // current page (no href)
  ]}
/>;
```

**Accessibility:** `<nav aria-label="Breadcrumb">`. Current page has `aria-current="page"`.

---

### Accordion

Collapsible content sections.

| Component            | Key Props                                                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Accordion**        | `defaultExpanded?: string[]`, `expanded?: string[]`, `onExpandedChange?: (expanded: string[]) => void`, `multiple?: boolean` |
| **AccordionItem**    | `value: string` (required), `disabled?: boolean`, `children: ReactNode \| ((props) => ReactNode)`                            |
| **AccordionTrigger** | `value: string` (required), `children`, `disabled?: boolean`                                                                 |
| **AccordionContent** | `children`, `className`                                                                                                      |

```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui";

<Accordion multiple>
  <AccordionItem value="item-1">
    <AccordionTrigger value="item-1">What is React?</AccordionTrigger>
    <AccordionContent>
      <Text>React is a JavaScript library for building user interfaces.</Text>
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger value="item-2">What is TypeScript?</AccordionTrigger>
    <AccordionContent>
      <Text>TypeScript is a typed superset of JavaScript.</Text>
    </AccordionContent>
  </AccordionItem>
</Accordion>;
```

**Accessibility:** Triggers use `<button>` with `aria-expanded`. Content uses `data-state="open" | "closed"`.

---

## State

### EmptyState

Centered empty/no-data placeholder.

| Prop          | Type        | Default | Description      |
| ------------- | ----------- | ------- | ---------------- |
| `icon`        | `ReactNode` | —       | Custom icon      |
| `title`       | `string`    | —       | Title text       |
| `description` | `string`    | —       | Description text |
| `action`      | `ReactNode` | —       | Action button(s) |

```tsx
import { EmptyState, Button } from "@/components/ui";

<EmptyState
  icon={<FolderIcon />}
  title="No projects yet"
  description="Create your first project to get started."
  action={<Button>Create Project</Button>}
/>;
```

---

### ErrorState

Error display with retry.

| Prop          | Type              | Default                  | Description          |
| ------------- | ----------------- | ------------------------ | -------------------- |
| `icon`        | `ReactNode`       | —                        | Custom icon          |
| `title`       | `string`          | `"Something went wrong"` | Error title          |
| `description` | `string`          | —                        | Description          |
| `error`       | `Error \| string` | —                        | Raw error info       |
| `retry`       | `() => void`      | —                        | Retry button handler |

```tsx
import { ErrorState } from "@/components/ui";

<ErrorState
  title="Failed to load"
  description="We couldn't fetch your data."
  error={error}
  retry={() => refetch()}
/>;
```

**Accessibility:** `role="alert"`.

---

### LoadingState

Full-area loading indicator.

| Prop       | Type                                   | Default        | Description          |
| ---------- | -------------------------------------- | -------------- | -------------------- |
| `size`     | `"sm" \| "md" \| "lg" \| "fullscreen"` | `"md"`         | Loading area size    |
| `label`    | `string`                               | `"Loading..."` | Loading text         |
| `fullPage` | `boolean`                              | `false`        | Full viewport height |

```tsx
import { LoadingState } from "@/components/ui";

<LoadingState />
<LoadingState size="lg" label="Fetching data..." />
<LoadingState fullPage label="Initializing..." />
```

**Accessibility:** `role="status"` with `aria-label`.

---

## Best Practices

### Composition

Prefer composing components over adding props:

```tsx
// Good — composable
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Avoid — monolithic
<Card title="Title" description="Description" content="Content" />
```

### Controlled vs Uncontrolled

All stateful components support both patterns:

```tsx
// Unmanaged (default state)
<Tabs defaultValue="tab1">
  <TabsTrigger value="tab1">Tab 1</TabsTrigger>
</Tabs>;

// Controlled
const [tab, setTab] = useState("tab1");
<Tabs value={tab} onChange={setTab}>
  <TabsTrigger value="tab1">Tab 1</TabsTrigger>
</Tabs>;
```

### Theme Integration

All components use semantic Tailwind tokens. Override at the theme level:

```tsx
// Custom theme class
<div className="dark">
  <Button>Themed button</Button> {/* Uses CSS custom properties */}
</div>
```

### Performance

- Components use `forwardRef` and avoid inline functions in event handlers
- Barrel imports enable tree-shaking — Vite strips unused components
- Memoization is avoided by default; add `React.memo` only when profiling shows re-render issues

### Accessibility Checklist

| Feature                     | Coverage                                                                |
| --------------------------- | ----------------------------------------------------------------------- |
| `aria-*` attributes         | All interactive and status components                                   |
| Keyboard navigation         | Tabs, Accordion, Combobox, Switch, Dialog, Drawer                       |
| Focus management            | Dialog focuses content, Tabs manages roving tabindex                    |
| Screen reader announcements | Alert (`role="alert"`), Toast (`aria-live="polite"`)                    |
| Focus rings                 | All interactive elements via `focus-visible:ring-2`                     |
| Reduced motion              | Respects `prefers-reduced-motion` via Tailwind's `motion-safe:` variant |
| Color contrast              | Uses semantic tokens with WCAG AA contrast ratios                       |

---

## Future Extension

### Planned Additions

| Component          | Purpose                                        |
| ------------------ | ---------------------------------------------- |
| **DatePicker**     | Calendar date selection                        |
| **TimePicker**     | Time selection                                 |
| **Slider**         | Range slider input                             |
| **Resizable**      | Resizable panel splitter                       |
| **Command**        | Command palette (Cmd+K)                        |
| **Sheet**          | Side sheet (similar to Drawer but for forms)   |
| **Table**          | Data table with sorting, filtering, pagination |
| **TreeView**       | Hierarchical tree navigation                   |
| **Menubar**        | Application menu bar                           |
| **NavigationMenu** | Mega-menu navigation                           |
| **ContextMenu**    | Right-click context menu                       |

### Planned Enhancements

| Enhancement               | Components Affected                              |
| ------------------------- | ------------------------------------------------ |
| **Animation hooks**       | All overlays (framer-motion integration)         |
| **Focus trap**            | Dialog, Drawer, Modal                            |
| **Virtual scrolling**     | Combobox, Select, Command                        |
| **Server-side rendering** | All components (hydration-safe IDs)              |
| **RTL support**           | All layout and direction-aware components        |
| **Color blind mode**      | Badge, Alert, Toast, Progress (shape indicators) |
| **High contrast mode**    | All components (via CSS custom properties)       |
