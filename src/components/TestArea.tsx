import { useState, useEffect, useMemo, memo } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RegexFlags, PatternMatch } from "@/types"
import { validateRegex, flagsToString } from "@/lib/regex-utils"

interface TestAreaProps {
  pattern: string
  flags: RegexFlags
  sampleText: string
  onSampleTextChange: (text: string) => void
}

export const TestArea = memo(function TestArea({
  pattern,
  flags,
  sampleText,
  onSampleTextChange,
}: TestAreaProps) {
  const [matches, setMatches] = useState<PatternMatch[]>([])
  const [executionTime, setExecutionTime] = useState<number>(0)
  const [isValid, setIsValid] = useState(true)

  // Perform regex matching with debouncing
  useEffect(() => {
    if (!pattern || !sampleText) {
      setMatches([])
      setExecutionTime(0)
      return
    }

    const error = validateRegex(pattern, flags)
    if (error) {
      setIsValid(false)
      setMatches([])
      return
    }

    setIsValid(true)

    // Debounce for performance
    const timeoutId = setTimeout(() => {
      const startTime = performance.now()
      try {
        const flagsStr = flagsToString(flags)
        const regex = new RegExp(pattern, flagsStr)
        const allMatches: PatternMatch[] = []
        let match

        if (flags.global) {
          // Global flag: find all matches
          while ((match = regex.exec(sampleText)) !== null) {
            allMatches.push({
              text: match[0],
              startIndex: match.index,
              endIndex: match.index + match[0].length,
              groups: match.slice(1),
            })
            // Prevent infinite loop on zero-length matches
            if (match[0].length === 0) {
              regex.lastIndex++
            }
          }
        } else {
          // No global flag: find first match only
          match = regex.exec(sampleText)
          if (match) {
            allMatches.push({
              text: match[0],
              startIndex: match.index,
              endIndex: match.index + match[0].length,
              groups: match.slice(1),
            })
          }
        }

        setMatches(allMatches)
        const endTime = performance.now()
        setExecutionTime(endTime - startTime)
      } catch (error) {
        setIsValid(false)
        setMatches([])
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(timeoutId)
  }, [pattern, flags, sampleText])

  // Render text with highlighted matches
  const renderHighlightedText = useMemo(() => {
    if (!sampleText || matches.length === 0) {
      return <span>{sampleText}</span>
    }

    const elements: JSX.Element[] = []
    let lastIndex = 0

    matches.forEach((match, index) => {
      // Add text before match
      if (match.startIndex > lastIndex) {
        elements.push(
          <span key={`text-${lastIndex}`}>
            {sampleText.substring(lastIndex, match.startIndex)}
          </span>
        )
      }

      // Add highlighted match
      elements.push(
        <span
          key={`match-${index}`}
          className="bg-yellow-400 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 font-semibold"
        >
          {match.text}
        </span>
      )

      lastIndex = match.endIndex
    })

    // Add remaining text
    if (lastIndex < sampleText.length) {
      elements.push(
        <span key={`text-${lastIndex}`}>
          {sampleText.substring(lastIndex)}
        </span>
      )
    }

    return <>{elements}</>
  }, [sampleText, matches])

  return (
    <div className="space-y-4">
      {/* Sample Text Input */}
      <div className="space-y-2">
        <Label htmlFor="sample-text">Test Text</Label>
        <Textarea
          id="sample-text"
          value={sampleText}
          onChange={(e) => onSampleTextChange(e.target.value)}
          placeholder="Enter text to test your regex pattern..."
          className="font-mono min-h-[150px]"
        />
      </div>

      {/* Match Results */}
      {pattern && isValid && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Results</Label>
            <Badge variant="secondary">
              {matches.length} {matches.length === 1 ? "match" : "matches"}
            </Badge>
            {executionTime > 0 && (
              <Badge variant="outline">
                {executionTime.toFixed(2)}ms
              </Badge>
            )}
          </div>

          {/* Highlighted Text Display */}
          <Card className="p-4 bg-muted min-h-[100px]">
            <div className="font-mono text-sm whitespace-pre-wrap break-words">
              {renderHighlightedText}
            </div>
          </Card>
        </div>
      )}

      {/* Match Details */}
      {matches.length > 0 && (
        <div className="space-y-2">
          <Label>Match Details</Label>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {matches.map((match, index) => (
              <Card key={index} className="p-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Match {index + 1}</Badge>
                    <span className="text-xs text-muted-foreground">
                      Position: {match.startIndex} - {match.endIndex}
                    </span>
                  </div>
                  <div className="font-mono text-sm bg-background p-2 rounded">
                    {match.text}
                  </div>
                  {match.groups.length > 0 && (
                    <div className="mt-2">
                      <Label className="text-xs">Capture Groups:</Label>
                      <div className="space-y-1 mt-1">
                        {match.groups.map((group, groupIndex) => (
                          <div
                            key={groupIndex}
                            className="text-xs font-mono bg-background p-1 rounded"
                          >
                            Group {groupIndex + 1}: {group || "(empty)"}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Matches Message */}
      {pattern && isValid && matches.length === 0 && sampleText && (
        <Card className="p-4 bg-muted">
          <p className="text-sm text-muted-foreground">
            No matches found in the test text.
          </p>
        </Card>
      )}

      {/* Invalid Pattern Message */}
      {pattern && !isValid && (
        <Card className="p-4 bg-destructive/10 border-destructive">
          <p className="text-sm text-destructive">
            Invalid regex pattern. Please fix the pattern to see matches.
          </p>
        </Card>
      )}
    </div>
  )
})

