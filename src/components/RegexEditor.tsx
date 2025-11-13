import { useState, useRef, memo } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { RegexFlags } from "@/types"
import { validateRegex, flagsToString } from "@/lib/regex-utils"
import { RotateCcw, RotateCw } from "lucide-react"

interface RegexEditorProps {
  pattern: string
  flags: RegexFlags
  onPatternChange: (pattern: string) => void
  onFlagsChange: (flags: RegexFlags) => void
}

export const RegexEditor = memo(function RegexEditor({
  pattern,
  flags,
  onPatternChange,
  onFlagsChange,
}: RegexEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [history, setHistory] = useState<string[]>([pattern])
  const [historyIndex, setHistoryIndex] = useState(0)
  const cursorPositionRef = useRef<{ start: number; end: number } | null>(null)

  const error = validateRegex(pattern, flags)

  // Store cursor position when textarea is focused
  const handleTextareaFocus = () => {
    const textarea = textareaRef.current
    if (textarea) {
      cursorPositionRef.current = {
        start: textarea.selectionStart,
        end: textarea.selectionEnd,
      }
    }
  }

  const handleTextareaBlur = () => {
    const textarea = textareaRef.current
    if (textarea) {
      cursorPositionRef.current = {
        start: textarea.selectionStart,
        end: textarea.selectionEnd,
      }
    }
  }

  const handlePatternChange = (value: string) => {
    onPatternChange(value)
    // Add to history if different from current
    if (value !== history[historyIndex]) {
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(value)
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    }
  }

  const handleInsert = (text: string) => {
    // Use stored cursor position or fallback to end of text
    const start = cursorPositionRef.current?.start ?? pattern.length
    const end = cursorPositionRef.current?.end ?? pattern.length
    const currentValue = pattern
    const newValue =
      currentValue.substring(0, start) + text + currentValue.substring(end)
    
    // Update the pattern state
    handlePatternChange(newValue)
    
    // Update cursor position for next insert
    const newCursorPos = start + text.length
    cursorPositionRef.current = {
      start: newCursorPos,
      end: newCursorPos,
    }
    
    // Restore cursor position after React updates
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos)
      }
    })
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      onPatternChange(history[newIndex])
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      onPatternChange(history[newIndex])
    }
  }

  const handleFlagChange = (flag: keyof RegexFlags, checked: boolean) => {
    onFlagsChange({ ...flags, [flag]: checked })
  }

  const regexElements = [
    {
      label: "Any Character",
      value: ".",
      description: "Matches any single character except newline",
    },
    {
      label: "Digit",
      value: "\\d",
      description: "Matches any digit (0-9)",
    },
    {
      label: "Word Character",
      value: "\\w",
      description: "Matches any letter, digit, or underscore (a-z, A-Z, 0-9, _)",
    },
    {
      label: "Whitespace",
      value: "\\s",
      description: "Matches any whitespace character (space, tab, newline, etc.)",
    },
    {
      label: "Non-Digit",
      value: "\\D",
      description: "Matches any character that is not a digit",
    },
    {
      label: "Non-Word",
      value: "\\W",
      description: "Matches any character that is not a word character",
    },
    {
      label: "Non-Whitespace",
      value: "\\S",
      description: "Matches any character that is not whitespace",
    },
    {
      label: "Start of Line",
      value: "^",
      description: "Matches the beginning of a line",
    },
    {
      label: "End of Line",
      value: "$",
      description: "Matches the end of a line",
    },
    {
      label: "Word Boundary",
      value: "\\b",
      description: "Matches a word boundary (between word and non-word characters)",
    },
    {
      label: "Zero or More",
      value: "*",
      description: "Matches the preceding element zero or more times",
    },
    {
      label: "One or More",
      value: "+",
      description: "Matches the preceding element one or more times",
    },
    {
      label: "Zero or One",
      value: "?",
      description: "Matches the preceding element zero or one time (makes it optional)",
    },
    {
      label: "Group",
      value: "()",
      description: "Creates a capturing group that can be referenced later",
    },
    {
      label: "Non-Capturing Group",
      value: "(?:)",
      description: "Groups elements together without capturing the match",
    },
    {
      label: "Positive Lookahead",
      value: "(?=)",
      description: "Matches a pattern only if it's followed by another pattern",
    },
    {
      label: "Negative Lookahead",
      value: "(?!)",
      description: "Matches a pattern only if it's NOT followed by another pattern",
    },
  ]

  return (
    <div className="space-y-4">
      {/* Pattern Input */}
      <div className="space-y-2">
        <Label htmlFor="pattern">Regular Expression Pattern</Label>
        <Textarea
          id="pattern"
          ref={textareaRef}
          value={pattern}
          onChange={(e) => {
            handlePatternChange(e.target.value)
            // Update cursor position on change
            if (textareaRef.current) {
              cursorPositionRef.current = {
                start: textareaRef.current.selectionStart,
                end: textareaRef.current.selectionEnd,
              }
            }
          }}
          onFocus={handleTextareaFocus}
          onBlur={handleTextareaBlur}
          onSelect={() => {
            if (textareaRef.current) {
              cursorPositionRef.current = {
                start: textareaRef.current.selectionStart,
                end: textareaRef.current.selectionEnd,
              }
            }
          }}
          placeholder="Enter your regex pattern here..."
          className={`font-mono min-h-[100px] ${
            error ? "border-destructive" : ""
          }`}
        />
        {error && (
          <p className="text-sm text-destructive">Error: {error}</p>
        )}
      </div>

      {/* Flags */}
      <div className="space-y-2">
        <Label>Flags</Label>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="flag-global"
              checked={flags.global}
              onCheckedChange={(checked) =>
                handleFlagChange("global", checked === true)
              }
            />
            <Label htmlFor="flag-global" className="cursor-pointer">
              Global (g)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="flag-ignoreCase"
              checked={flags.ignoreCase}
              onCheckedChange={(checked) =>
                handleFlagChange("ignoreCase", checked === true)
              }
            />
            <Label htmlFor="flag-ignoreCase" className="cursor-pointer">
              Ignore Case (i)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="flag-multiline"
              checked={flags.multiline}
              onCheckedChange={(checked) =>
                handleFlagChange("multiline", checked === true)
              }
            />
            <Label htmlFor="flag-multiline" className="cursor-pointer">
              Multiline (m)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="flag-dotAll"
              checked={flags.dotAll}
              onCheckedChange={(checked) =>
                handleFlagChange("dotAll", checked === true)
              }
            />
            <Label htmlFor="flag-dotAll" className="cursor-pointer">
              Dot All (s)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="flag-unicode"
              checked={flags.unicode}
              onCheckedChange={(checked) =>
                handleFlagChange("unicode", checked === true)
              }
            />
            <Label htmlFor="flag-unicode" className="cursor-pointer">
              Unicode (u)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="flag-sticky"
              checked={flags.sticky}
              onCheckedChange={(checked) =>
                handleFlagChange("sticky", checked === true)
              }
            />
            <Label htmlFor="flag-sticky" className="cursor-pointer">
              Sticky (y)
            </Label>
          </div>
        </div>
      </div>

      {/* Builder Tools */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Quick Insert</Label>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleUndo}
                    disabled={historyIndex === 0}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Undo</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRedo}
                    disabled={historyIndex === history.length - 1}
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Redo</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <Card className="p-4">
          <div className="flex flex-wrap gap-2">
            {regexElements.map((element) => (
              <Tooltip key={element.value}>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onMouseEnter={() => {
                      // Capture cursor position on hover (before click)
                      if (textareaRef.current) {
                        cursorPositionRef.current = {
                          start: textareaRef.current.selectionStart,
                          end: textareaRef.current.selectionEnd,
                        }
                      }
                    }}
                    onMouseDown={() => {
                      // Capture cursor position before blur
                      if (textareaRef.current) {
                        cursorPositionRef.current = {
                          start: textareaRef.current.selectionStart,
                          end: textareaRef.current.selectionEnd,
                        }
                      }
                    }}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleInsert(element.value)
                    }}
                    className="font-mono"
                  >
                    {element.value}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={5} className="max-w-xs">
                  <div className="space-y-1">
                    <p className="font-semibold">{element.label}</p>
                    <p className="text-sm">{element.description}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </Card>
      </div>

      {/* Current Pattern Display */}
      {pattern && (
        <div className="space-y-2">
          <Label>Current Pattern</Label>
          <Card className="p-3 bg-muted">
            <code className="text-sm">
              /{pattern}/{flagsToString(flags)}
            </code>
          </Card>
        </div>
      )}
    </div>
  )
})

