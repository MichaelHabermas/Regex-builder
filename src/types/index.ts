export interface RegexPattern {
  id: string
  name: string
  pattern: string
  description: string
  flags?: string
  category?: string
}

export interface MatchResult {
  match: string
  index: number
  groups: string[]
  namedGroups?: Record<string, string>
}

export interface RegexFlags {
  global: boolean
  ignoreCase: boolean
  multiline: boolean
  dotAll: boolean
  unicode: boolean
  sticky: boolean
}

export interface PatternMatch {
  text: string
  startIndex: number
  endIndex: number
  groups: string[]
}

