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

## Conventions

- Props: `interface` above component
- Domain models: `type` (e.g., `GameState`)
- Add questions: Edit `src/data/questions.ts` (lowercase phrases)
