# Rough Edges Effect - Implementation Guide

## Overview

The rough edges effect has been implemented across the Bingoal site to enhance the hand-drawn aesthetic. This effect uses SVG filters to create organic, sketchy edges on UI elements **without affecting text clarity**.

## How It Works

The implementation uses a **pseudo-element technique** to apply rough edges only to backgrounds and borders, keeping text crisp and readable:

1. **SVG Filter Definitions** (in `app/layout.tsx`)

   - Three filter variations: subtle, medium, and strong
   - Hidden SVG element that provides the filters site-wide

2. **CSS Pseudo-Element Application** (in component CSS files)
   - Uses `::before` pseudo-element to create a filtered background layer
   - Text remains unaffected and perfectly readable
   - Applied via `isolation: isolate` and positioned `::before` element

## Filter Variations

- **`#squiggle-subtle`** - Gentle rough edges (baseFrequency: .02, scale: 2)
  - Used on: buttons, cells, containers, modals
- **`#squiggle`** (medium) - Balanced rough edges (baseFrequency: .05, scale: 4)
  - Used on: board cards, login box
- **`#squiggle-strong`** - Pronounced rough edges (baseFrequency: .08, scale: 6)
  - Currently unused, available for future use

## Where It's Applied

### Dashboard (`app/dashboard/dashboard.module.css`)

- `.welcome` - Welcome section
- `.boardsSection` - Boards container
- `.boardCard` - Individual board cards (medium filter)
- `.createBtn` - Create board button
- `.createBoardBtn` - First board button
- `.logoutBtn` - Logout button
- `.modalContent` - Modal dialogs

### Board Page (`app/board/[id]/board.module.css`)

- `.boardHeader` - Board header section
- `.cell` - All bingo cells
- `.editBtn` - Edit button
- `.deleteBtn` - Delete button
- `.lockBtn` - Lock/unlock button
- `.progressSection` - Progress bar section

### Login Page (`app/login/login.module.css`)

- `.loginBox` - Login container (medium filter)
- `.googleBtn` - Google sign-in button

## How to Disable Rough Edges

### Option 1: Disable Site-Wide

Comment out or remove the SVG block in `app/layout.tsx` (lines 23-65):

```tsx
{
  /* Remove or comment out this entire SVG block */
}
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="0" width="0">
  ...
</svg>;
```

### Option 2: Disable for Specific Components

Remove the `::before` pseudo-element block from the component's CSS file.

For example, in `app/dashboard/dashboard.module.css`:

```css
.boardCard {
  /* ... other styles ... */
  /* Remove these properties: */
  /* isolation: isolate; */
}

/* Remove or comment out this entire block: */
/* .boardCard::before {
  content: "";
  position: absolute;
  inset: 0;
  background: inherit;
  border-radius: inherit;
  z-index: -1;
  filter: url(#squiggle);
  pointer-events: none;
} */
```

### Option 3: Use CSS Utility Classes (Alternative Approach)

You can also use the utility classes defined in `app/globals.css`:

- `.rough-edges-bg` or `.rough-edges-bg-medium`
- `.rough-edges-bg-subtle`
- `.rough-edges-bg-strong`

These classes automatically handle the pseudo-element setup for you.

## Browser Support

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Automatic fallback for unsupported browsers (via `@supports` query)
- ✅ No JavaScript required

## Performance Considerations

SVG filters can impact performance on:

- Lower-end devices
- Pages with many filtered elements
- During animations/transitions

If performance issues occur, consider:

1. Using the subtle filter instead of medium/strong
2. Reducing the number of filtered elements
3. Disabling filters on mobile devices via media queries

## Customization

To adjust the roughness intensity, modify the SVG filter parameters in `app/layout.tsx`:

- **`baseFrequency`**: Controls the noise pattern frequency (higher = more chaotic)
- **`numOctaves`**: Controls the detail level (higher = more detailed)
- **`scale`**: Controls the displacement amount (higher = more distortion)

Example:

```tsx
<filter id="squiggle-custom">
  <feTurbulence
    type="fractalNoise"
    baseFrequency=".03"  {/* Adjust this */}
    numOctaves="4"       {/* Adjust this */}
  />
  <feDisplacementMap
    in="SourceGraphic"
    scale="3"            {/* Adjust this */}
  />
</filter>
```

## Credits

Technique inspired by [Daniel Darren Jones' article](https://danieldarrenjones.com/articles/how-to-make-rough-edges-with-css-and-svgs).
