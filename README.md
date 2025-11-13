# Regex Builder

A modern, interactive web tool for building, testing, and debugging regular expressions with real-time visual feedback.

## Features

### 🎯 Core Functionality

- **Visual Regex Editor**: Intuitive pattern builder with real-time syntax validation
- **Quick Insert Tools**: One-click insertion of common regex elements with helpful tooltips
- **Real-Time Testing**: Instant pattern matching with highlighted results in your test text
- **Match Details**: View all matches, capture groups, and match positions
- **Regex Flags**: Toggle global, case-insensitive, multiline, and other flags easily

### 📚 Pattern Library

- **15+ Pre-built Patterns**: Common patterns for email, phone numbers, URLs, IP addresses, dates, and more
- **Custom Patterns**: Save your own patterns to localStorage
- **Search & Filter**: Quickly find patterns by name, description, or pattern text
- **Import/Export**: Share your pattern collections via JSON

### 💻 Export & Share

- **Code Snippets**: Generate ready-to-use code in JavaScript, TypeScript, and Python
- **Copy to Clipboard**: One-click copying of code snippets
- **File Downloads**: Export patterns as `.regex`, `.js`, `.ts`, or `.py` files
- **Shareable Links**: Generate URLs that load your regex pattern automatically

### 🎨 User Experience

- **Dark/Light Mode**: Toggle between themes with system preference detection
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Performance Optimized**: Debounced matching and memoized operations for smooth performance
- **Undo/Redo**: Full history support for pattern editing

## Tech Stack

- **Framework**: Vite + React 18 + TypeScript
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd Regex-builder
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the development server:

    ```bash
    npm run dev
    ```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

  ```bash
  npm run build
  ```

The production build will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Usage

### Building a Regex Pattern

1. **Enter your pattern** in the Pattern Editor textarea

2. **Use Quick Insert buttons** to add common regex elements:
   - Character classes: `\d` (digits), `\w` (word characters), `\s` (whitespace)
   - Anchors: `^` (start), `$` (end), `\b` (word boundary)
   - Quantifiers: `*` (zero or more), `+` (one or more), `?` (zero or one)
   - Groups: `()` (capturing), `(?:)` (non-capturing), `(?=)` (lookahead)

3. **Toggle flags** as needed (global, case-insensitive, multiline, etc.)

4. **View real-time validation** - errors are highlighted immediately

### Testing Your Pattern

1. **Enter test text** in the Test Area

2. **See matches highlighted** in real-time

3. **View match details** including:
   - Match count
   - Individual match positions
   - Capture groups
   - Execution time

### Using the Pattern Library

1. **Browse patterns** by category or use the search bar

2. **Click "Use Pattern"** to load a pattern into the editor

3. **Save custom patterns** by clicking "Add Pattern"

4. **Edit or delete** your saved patterns

5. **Export/Import** your pattern collection as JSON

### Exporting Your Pattern

1. Click the **Export** button in the header

2. Choose your target language (JavaScript, TypeScript, or Python)

3. **Copy** the code snippet or **download** as a file

4. **Share** your pattern via a shareable link

## Project Structure

```text
Regex-builder/
├── src/
│   ├── components/
│   │   ├── ui/                 # Shadcn UI components
│   │   ├── RegexEditor.tsx     # Main pattern editor
│   │   ├── TestArea.tsx        # Test text and match display
│   │   ├── PatternLibrary.tsx  # Pattern library component
│   │   ├── ExportModal.tsx     # Export functionality
│   │   ├── theme-provider.tsx
│   │   └── mode-toggle.tsx
│   ├── data/
│   │   └── patterns.json       # Pre-built patterns
│   ├── hooks/
│   │   └── useDebounce.ts      # Debounce utility
│   ├── lib/
│   │   ├── regex-utils.ts      # Regex helper functions
│   │   └── utils.ts            # General utilities
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── App.tsx                 # Main application component
│   ├── main.tsx                # Application entry point
│   └── index.css               # Global styles
├── docs/                       # Documentation
├── public/                     # Static assets
└── package.json
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

The project uses:

- **ESLint** for linting
- **Prettier** for code formatting
- **TypeScript** for type safety

## Features in Detail

### Quick Insert Tooltips

Hover over any Quick Insert button to see:

- **Label**: The name of the regex element
- **Description**: A clear explanation of what it does

Examples:

- `\d` - "Matches any digit (0-9)"
- `\w` - "Matches any letter, digit, or underscore"
- `^` - "Matches the beginning of a line"

### Pattern Library Categories

- **Validation**: Email, phone numbers, URLs, credit cards, passwords
- **Network**: IPv4 and IPv6 addresses
- **Date & Time**: Various date and time formats
- **Format**: Hex colors, usernames, postal codes

### Keyboard Shortcuts

- `Ctrl/Cmd + E` - Open export modal (planned)
- `Ctrl/Cmd + S` - Save pattern (planned)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

See [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Built with [Shadcn UI](https://ui.shadcn.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Powered by [Vite](https://vitejs.dev/)
