import { useState, useEffect, useMemo, memo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { RegexPattern } from "@/types"
import patternsData from "@/data/patterns.json"
import { Search, Plus, Edit, Trash2, Download, Upload, Copy } from "lucide-react"

interface PatternLibraryProps {
  onSelectPattern: (pattern: string) => void
}

const STORAGE_KEY = "regex-builder-user-patterns"

export const PatternLibrary = memo(function PatternLibrary({
  onSelectPattern,
}: PatternLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [userPatterns, setUserPatterns] = useState<RegexPattern[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPattern, setEditingPattern] = useState<RegexPattern | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    pattern: "",
    description: "",
    category: "",
  })

  // Load user patterns from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setUserPatterns(JSON.parse(stored))
      } catch (error) {
        console.error("Failed to load user patterns:", error)
      }
    }
  }, [])

  // Save user patterns to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userPatterns))
  }, [userPatterns])

  const allPatterns = useMemo(() => {
    return [...(patternsData as RegexPattern[]), ...userPatterns]
  }, [userPatterns])

  const filteredPatterns = useMemo(() => {
    if (!searchQuery) return allPatterns

    const query = searchQuery.toLowerCase()
    return allPatterns.filter(
      (pattern) =>
        pattern.name.toLowerCase().includes(query) ||
        pattern.description.toLowerCase().includes(query) ||
        pattern.pattern.toLowerCase().includes(query) ||
        pattern.category?.toLowerCase().includes(query)
    )
  }, [allPatterns, searchQuery])

  const patternsByCategory = useMemo(() => {
    const grouped: Record<string, RegexPattern[]> = {}
    filteredPatterns.forEach((pattern) => {
      const category = pattern.category || "Other"
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(pattern)
    })
    return grouped
  }, [filteredPatterns])

  const handleUsePattern = (pattern: string) => {
    onSelectPattern(pattern)
  }

  const handleSavePattern = () => {
    if (!formData.name || !formData.pattern) return

    if (editingPattern) {
      // Update existing pattern
      setUserPatterns((prev) =>
        prev.map((p) =>
          p.id === editingPattern.id
            ? {
                ...p,
                name: formData.name,
                pattern: formData.pattern,
                description: formData.description,
                category: formData.category || "Custom",
              }
            : p
        )
      )
    } else {
      // Add new pattern
      const newPattern: RegexPattern = {
        id: `user-${Date.now()}`,
        name: formData.name,
        pattern: formData.pattern,
        description: formData.description,
        category: formData.category || "Custom",
      }
      setUserPatterns((prev) => [...prev, newPattern])
    }

    // Reset form
    setFormData({ name: "", pattern: "", description: "", category: "" })
    setEditingPattern(null)
    setIsDialogOpen(false)
  }

  const handleEditPattern = (pattern: RegexPattern) => {
    // Only allow editing user patterns
    if (!pattern.id.startsWith("user-")) return

    setEditingPattern(pattern)
    setFormData({
      name: pattern.name,
      pattern: pattern.pattern,
      description: pattern.description,
      category: pattern.category || "",
    })
    setIsDialogOpen(true)
  }

  const handleDeletePattern = (patternId: string) => {
    // Only allow deleting user patterns
    if (!patternId.startsWith("user-")) return

    setUserPatterns((prev) => prev.filter((p) => p.id !== patternId))
  }

  const handleExportPatterns = () => {
    const dataStr = JSON.stringify(userPatterns, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "regex-patterns.json"
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImportPatterns = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string)
        if (Array.isArray(imported)) {
          setUserPatterns((prev) => [...prev, ...imported])
        }
      } catch (error) {
        console.error("Failed to import patterns:", error)
        alert("Failed to import patterns. Please check the file format.")
      }
    }
    reader.readAsText(file)
    event.target.value = "" // Reset input
  }

  const handleCopyPattern = (pattern: string) => {
    navigator.clipboard.writeText(pattern)
  }

  return (
    <div className="space-y-4">
      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patterns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              onClick={() => {
                setEditingPattern(null)
                setFormData({ name: "", pattern: "", description: "", category: "" })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Pattern
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingPattern ? "Edit Pattern" : "Add New Pattern"}
              </DialogTitle>
              <DialogDescription>
                Create a custom regex pattern to save in your library.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="pattern-name">Name</Label>
                <Input
                  id="pattern-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Email validation"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pattern-regex">Pattern</Label>
                <Textarea
                  id="pattern-regex"
                  value={formData.pattern}
                  onChange={(e) =>
                    setFormData({ ...formData, pattern: e.target.value })
                  }
                  placeholder="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pattern-description">Description</Label>
                <Textarea
                  id="pattern-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Validates email addresses"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pattern-category">Category (optional)</Label>
                <Input
                  id="pattern-category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="Validation"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSavePattern}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {userPatterns.length > 0 && (
          <>
            <Button variant="outline" onClick={handleExportPatterns}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <label>
              <Button variant="outline" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </span>
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={handleImportPatterns}
                className="hidden"
              />
            </label>
          </>
        )}
      </div>

      {/* Patterns List */}
      {Object.keys(patternsByCategory).length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">
            {searchQuery
              ? "No patterns found matching your search."
              : "No patterns available."}
          </p>
        </Card>
      ) : (
        <Accordion type="multiple" className="w-full">
          {Object.entries(patternsByCategory).map(([category, patterns]) => (
            <AccordionItem key={category} value={category}>
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <span>{category}</span>
                  <Badge variant="secondary">{patterns.length}</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {patterns.map((pattern) => (
                    <Card key={pattern.id} className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold">{pattern.name}</h4>
                            {pattern.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {pattern.description}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1 ml-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleCopyPattern(pattern.pattern)}
                              className="h-8 w-8"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            {pattern.id.startsWith("user-") && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditPattern(pattern)}
                                  className="h-8 w-8"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeletePattern(pattern.id)}
                                  className="h-8 w-8 text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="bg-muted p-2 rounded font-mono text-sm break-all">
                          {pattern.pattern}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUsePattern(pattern.pattern)}
                          className="w-full"
                        >
                          Use Pattern
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  )
})

