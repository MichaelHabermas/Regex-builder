# Regex Builder Development Breakdown

## Epic 1: Project Setup and Initialization
### PR 1.1: Initialize Vite + React + TypeScript Project
- Commit 1.1.1: Run `npm create vite@latest` with React and TypeScript options.
- Commit 1.1.2: Install dependencies: React, React-DOM, TypeScript types.
- Commit 1.1.3: Configure vite.config.ts for base setup.
- Commit 1.1.4: Set up ESLint and Prettier for code linting.

### PR 1.2: Integrate Shadcn UI and Tailwind CSS
- Commit 1.2.1: Install Tailwind CSS via docs: Add to vite.config.ts plugins.
- Commit 1.2.2: Configure tailwind.config.js with content paths.
- Commit 1.2.3: Add global CSS with @tailwind directives.
- Commit 1.2.4: Install Shadcn: Run `npx shadcn-ui@latest init`.
- Commit 1.2.5: Add initial Shadcn components (Button, Input).

## Epic 2: Core UI Layout and Components
### PR 2.1: Build Main Layout Structure
- Commit 2.1.1: Create App.tsx with header, main, footer placeholders.
- Commit 2.1.2: Add responsive grid using Tailwind classes.
- Commit 2.1.3: Integrate Shadcn Card for sections.

### PR 2.2: Implement Theme Switching (Dark/Light Mode)
- Commit 2.2.1: Add theme provider using Shadcn's mode-toggle.
- Commit 2.2.2: Persist theme in localStorage.
- Commit 2.2.3: Apply theme classes to root elements.

## Epic 3: Regex Pattern Builder
### PR 3.1: Visual Regex Editor
- Commit 3.1.1: Create RegexEditor component with Textarea for pattern input.
- Commit 3.1.2: Add syntax highlighting using Prism.js or similar library.
- Commit 3.1.3: Implement real-time error feedback with try-catch on RegExp.

### PR 3.2: Builder Tools and Controls
- Commit 3.2.1: Add buttons for common regex elements (e.g., digits, emails).
- Commit 3.2.2: Implement drag-and-drop or clickable inserts into pattern.
- Commit 3.2.3: Add undo/redo functionality using state history.

## Epic 4: Real-Time Testing and Debugging
### PR 4.1: Sample Text Input and Matching
- Commit 4.1.1: Create TestArea component with Textarea for sample text.
- Commit 4.1.2: Implement real-time matching: Highlight matches in text.
- Commit 4.1.3: Display match groups and details in a sidebar.

### PR 4.2: Validation and Feedback
- Commit 4.2.1: Add performance metrics (e.g., execution time).
- Commit 4.2.2: Implement false positive/negative indicators.
- Commit 4.2.3: Add debug console for regex flags and options.

## Epic 5: Pattern Library
### PR 5.1: Common Patterns Repository
- Commit 5.1.1: Create JSON file or state for predefined patterns (email, phone).
- Commit 5.1.2: Build Library component with Accordion or Tabs.
- Commit 5.1.3: Add search/filter for patterns.

### PR 5.2: User-Saved Patterns
- Commit 5.2.1: Implement localStorage for saving custom patterns.
- Commit 5.2.2: Add edit/delete options in library UI.
- Commit 5.2.3: Integrate import/export JSON for patterns.

## Epic 6: Export Functionality
### PR 6.1: Code Snippet Generation
- Commit 6.1.1: Create ExportModal with options for JS, Python, etc.
- Commit 6.1.2: Generate formatted code snippets based on pattern.
- Commit 6.1.3: Add copy-to-clipboard button.

### PR 6.2: File Export Options
- Commit 6.2.1: Implement download as .regex or .txt file.
- Commit 6.2.2: Add shareable link generation (base64 encoded).

## Epic 7: Testing, Optimization, and Deployment
### PR 7.1: Unit and Integration Tests
- Commit 7.1.1: Set up Vitest for testing.
- Commit 7.1.2: Write tests for regex matching logic.
- Commit 7.1.3: Test UI components with React Testing Library.

### PR 7.2: Performance Optimizations
- Commit 7.2.1: Memoize expensive regex operations.
- Commit 7.2.2: Handle large text inputs with debouncing.
- Commit 7.2.3: Add lazy loading for non-core components.

### PR 7.3: Deployment Setup
- Commit 7.3.1: Configure build script in package.json.
- Commit 7.3.2: Set up GitHub Pages or Vercel deployment.
- Commit 7.3.3: Add CI/CD workflow with GitHub Actions.
