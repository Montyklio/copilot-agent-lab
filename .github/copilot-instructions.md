# Soc Ops - Social Bingo Game

React 19 + TypeScript + Vite app for in-person social mixers. Find people matching bingo prompts to get 5 in a row.

## Mandatory Development Checklist

Before committing changes:
- [ ] `npm run lint` passes with no errors
- [ ] `npm run build` completes successfully
- [ ] `npm test` shows all tests passing

## Architecture

**Folder Structure:**
- `components/` - UI components with typed props
- `hooks/` - State management (e.g., `useBingoGame`)
- `utils/` - Pure business logic (immutable, testable)
- `types/` - Shared TypeScript interfaces
- `data/` - Static content (questions array)

**State Flow:** `useBingoGame` hook → localStorage persistence → pure `bingoLogic.ts` functions → components (unidirectional props).

## Key Patterns

### Immutable State
Always return new objects/arrays:
```typescript
export function toggleSquare(board: BingoSquareData[], squareId: number): BingoSquareData[] {
  return board.map((square) =>
    square.id === squareId && !square.isFreeSpace
      ? { ...square, isMarked: !square.isMarked }
      : square
  );
}
```

### localStorage Persistence
See `useBingoGame.ts`: version data (`STORAGE_VERSION`), validate with `validateStoredData()`, SSR guard `typeof window === 'undefined'`.

## Tailwind CSS v4

**NO `tailwind.config.js`** - use `@theme` directive in `src/index.css`:
```css
@theme {
  --color-marked: #dcfce7;
}
```
→ Creates `bg-marked` utility. See `.github/instructions/tailwind-4.instructions.md` for full patterns.

## Testing

Vitest + Testing Library. Tests adjacent to source (`*.test.ts`). Test pure functions exhaustively (see `bingoLogic.test.ts`).

## Commands

```bash
npm run dev    # Vite dev server (port 5173)
npm run build  # TypeScript + Vite build
npm run lint   # ESLint
npm test       # Vitest
```

Auto-deploys to GitHub Pages on push to `main`.

## Design Guide

### Theme: Industrial Cyberpunk

High-contrast, metallic aesthetic with electric neon accents. Dark metal backgrounds with fire/lightning visual effects.

### Color Palette

**Backgrounds (Metal):**
- `bg-metal-black` (#0a0a0a) - Darkest base
- `bg-metal-darker` (#1a1a1a) - Cards/containers
- `bg-metal-dark` (#2a2a2a) - Interactive elements
- `bg-metal-gray` (#3a3a3a) - Hover states

**Accents (Electric/Fire):**
- `electric-blue` (#00b4ff) - Primary electric glow
- `electric-purple` (#9d00ff) - Secondary electric
- `fire-red` (#ff2400) - Marked state, primary CTA
- `fire-orange` (#ff6600) - Gradients, borders
- `fire-yellow` (#ffaa00) - Highlights
- `molten-amber` (#ffbf00) - Winning/bingo state

**Chrome (Metallic Text):**
- `chrome-light` (#e8e8e8) - Primary text
- `chrome-mid` (#b8b8b8) - Secondary text
- `chrome-dark` (#888888) - Tertiary

### Typography

**Fonts:**
- `Orbitron` - Headers, logo (bold geometric)
- `Teko` - Body, UI text (condensed display)

**Patterns:**
- Headers: `Orbitron`, bold (700-900), `chrome-text` effect
- Body: `Teko`, medium (500-600), uppercase with tracking
- Buttons: `Teko`, semibold (600), uppercase, wide tracking

### Visual Effects

**Glow Shadows:**
- `.shadow-glow-red` - Fire effect (marked squares)
- `.shadow-glow-blue` - Electric effect (hover)
- `.shadow-glow-amber` - Victory effect (bingo)

**Text Glows:**
- `.text-glow-fire` - Fire text shadow
- `.text-glow-electric` - Electric text shadow
- `.text-glow-amber` - Amber text shadow

**Chrome Text:**
- `.chrome-text` - Animated metallic gradient (headers)

**Shape:**
- `.beveled` - Clipped octagonal corners (buttons, squares)

### Animations

**Built-in:**
- `electricPulse` - Pulsing electric glow (1.5s infinite)
- `fireGlow` - Fire breathing effect (2s infinite)
- `shake` - Quick vibration (0.2-0.3s)
- `scaleIn` - Fade + scale entrance (0.6s)
- `explode` - Dramatic entrance with rotation
- `chromeShimmer` - Metallic text shine (3s linear infinite)

**Usage:**
```tsx
className="animate-[electricPulse_1.5s_infinite]"
className="active:animate-[shake_0.3s_ease]"
```

### Component Patterns

**Interactive States:**
1. Default: Dark metal + electric purple border (40% opacity)
2. Hover: Lighter metal bg + electric blue border + blue glow
3. Active: Scale down (95%) + shake animation
4. Marked: Fire gradient bg + fire red border + red glow
5. Winning: Amber gradient bg + amber border + electric pulse

**Buttons:**
- Fire gradient background (`from-fire-red via-fire-orange to-fire-yellow`)
- Beveled edges
- Fire glow shadow + animation
- Uppercase Teko text with wide tracking
- Scale on hover (105%), shake on active

**Cards/Containers:**
- `bg-metal-darker/80` with backdrop blur
- `border-electric-purple/50` (2px)
- Custom clip-path for cut corners
- Optional blue glow shadow

**Accent Lines:**
- 1px height
- Horizontal gradients: `from-transparent via-[accent] to-transparent`
- Matching glow shadow

### Accessibility

- Use `aria-pressed` for toggle states
- Use `aria-label` for icon-only or short text
- Disable buttons with `disabled` attribute (free space)
- Maintain contrast ratios (light text on dark bg)

## Conventions

- Props: `interface` above component
- Domain models: `type` (e.g., `GameState`)
- Add questions: Edit `src/data/questions.ts` (lowercase phrases)
