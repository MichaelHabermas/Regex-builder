import { RegexFlags } from "@/types"

/**
 * Converts RegexFlags object to a string of flags
 */
export function flagsToString(flags: RegexFlags): string {
  let result = ""
  if (flags.global) result += "g"
  if (flags.ignoreCase) result += "i"
  if (flags.multiline) result += "m"
  if (flags.dotAll) result += "s"
  if (flags.unicode) result += "u"
  if (flags.sticky) result += "y"
  return result
}

/**
 * Parses a string of flags into RegexFlags object
 */
export function parseFlags(flagsString: string): RegexFlags {
  return {
    global: flagsString.includes("g"),
    ignoreCase: flagsString.includes("i"),
    multiline: flagsString.includes("m"),
    dotAll: flagsString.includes("s"),
    unicode: flagsString.includes("u"),
    sticky: flagsString.includes("y"),
  }
}

/**
 * Validates a regex pattern and returns error message if invalid
 */
export function validateRegex(pattern: string, flags: RegexFlags): string | null {
  if (!pattern) return null

  try {
    const flagsStr = flagsToString(flags)
    new RegExp(pattern, flagsStr)
    return null
  } catch (error) {
    if (error instanceof Error) {
      return error.message
    }
    return "Invalid regex pattern"
  }
}

/**
 * Inserts text at cursor position in a textarea
 */
export function insertAtCursor(
  textarea: HTMLTextAreaElement,
  text: string
): void {
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const value = textarea.value
  const newValue = value.substring(0, start) + text + value.substring(end)

  textarea.value = newValue
  textarea.selectionStart = textarea.selectionEnd = start + text.length
  textarea.focus()
}

