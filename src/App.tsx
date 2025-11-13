import { useState, useEffect } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import { Card } from "@/components/ui/card"
import { RegexEditor } from "@/components/RegexEditor"
import { TestArea } from "@/components/TestArea"
import { PatternLibrary } from "@/components/PatternLibrary"
import { ExportModal } from "@/components/ExportModal"
import { RegexFlags } from "@/types"
import { parseFlags } from "@/lib/regex-utils"

function App() {
  const [pattern, setPattern] = useState("")
  const [flags, setFlags] = useState<RegexFlags>({
    global: true,
    ignoreCase: false,
    multiline: false,
    dotAll: false,
    unicode: false,
    sticky: false,
  })
  const [sampleText, setSampleText] = useState("")

  // Load shared pattern from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const encodedPattern = urlParams.get("pattern")
    if (encodedPattern) {
      try {
        const data = JSON.parse(atob(encodedPattern))
        if (data.pattern) {
          setPattern(data.pattern)
        }
        if (data.flags) {
          setFlags(parseFlags(data.flags))
        }
      } catch (error) {
        console.error("Failed to load shared pattern:", error)
      }
    }
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + E: Export
      if ((e.ctrlKey || e.metaKey) && e.key === "e") {
        e.preventDefault()
        // Trigger export modal (we'll need to expose this)
      }
      // Ctrl/Cmd + S: Save pattern (could be implemented later)
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault()
        // Could save to localStorage or trigger save dialog
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <ThemeProvider defaultTheme="system" storageKey="regex-builder-theme">
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Regex Builder</h1>
            <div className="flex items-center gap-2">
              <ExportModal pattern={pattern} flags={flags} />
              <ModeToggle />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Regex Editor */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Pattern Editor</h2>
              <RegexEditor
                pattern={pattern}
                flags={flags}
                onPatternChange={setPattern}
                onFlagsChange={setFlags}
              />
            </Card>

            {/* Right Column - Test Area */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Test Area</h2>
              <TestArea
                pattern={pattern}
                flags={flags}
                sampleText={sampleText}
                onSampleTextChange={setSampleText}
              />
            </Card>
          </div>

          {/* Pattern Library Section */}
          <Card className="p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Pattern Library</h2>
            <PatternLibrary
              onSelectPattern={(pattern) => {
                setPattern(pattern)
              }}
            />
          </Card>
        </main>

        {/* Footer */}
        <footer className="border-t mt-auto">
          <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
            Regex Builder - Build, test, and debug regular expressions
          </div>
        </footer>
      </div>
    </ThemeProvider>
  )
}

export default App
