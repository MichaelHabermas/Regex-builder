import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { RegexFlags } from "@/types"
import { flagsToString } from "@/lib/regex-utils"
import { Copy, Download, Share2, Check } from "lucide-react"

interface ExportModalProps {
  pattern: string
  flags: RegexFlags
  trigger?: React.ReactNode
}

export function ExportModal({ pattern, flags, trigger }: ExportModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("javascript")

  const flagsStr = flagsToString(flags)

  const generateJavaScript = () => {
    if (flagsStr) {
      return `const regex = /${pattern.replace(/\//g, "\\/")}/${flagsStr};`
    }
    return `const regex = /${pattern.replace(/\//g, "\\/")}/;`
  }

  const generateTypeScript = () => {
    if (flagsStr) {
      return `const regex: RegExp = /${pattern.replace(/\//g, "\\/")}/${flagsStr};`
    }
    return `const regex: RegExp = /${pattern.replace(/\//g, "\\/")}/;`
  }

  const generatePython = () => {
    const escapedPattern = pattern.replace(/\\/g, "\\\\").replace(/'/g, "\\'")
    let flagsList: string[] = []
    if (flags.ignoreCase) flagsList.push("re.IGNORECASE")
    if (flags.multiline) flagsList.push("re.MULTILINE")
    if (flags.dotAll) flagsList.push("re.DOTALL")
    if (flags.unicode) flagsList.push("re.UNICODE")

    const flagsStr = flagsList.length > 0 ? `, ${flagsList.join(" | ")}` : ""

    let code = `import re\n\n`
    code += `pattern = r'${escapedPattern}'\n`
    if (flags.global) {
      code += `matches = re.findall(pattern${flagsStr}, text)\n`
    } else {
      code += `regex = re.compile(pattern${flagsStr})\n`
      code += `match = regex.search(text)\n`
    }

    return code
  }

  const getCodeForTab = (tab: string) => {
    switch (tab) {
      case "javascript":
        return generateJavaScript()
      case "typescript":
        return generateTypeScript()
      case "python":
        return generatePython()
      default:
        return ""
    }
  }

  const handleCopy = (code: string, type: string) => {
    navigator.clipboard.writeText(code)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleDownload = (extension: string, content: string) => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `regex-pattern.${extension}`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleShare = () => {
    try {
      const data = {
        pattern,
        flags: flagsStr,
      }
      const encoded = btoa(JSON.stringify(data))
      const url = `${window.location.origin}${window.location.pathname}?pattern=${encoded}`
      navigator.clipboard.writeText(url)
      setCopied("share")
      setTimeout(() => setCopied(null), 2000)
    } catch (error) {
      console.error("Failed to generate shareable link:", error)
    }
  }

  const currentCode = getCodeForTab(activeTab)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Export Regex Pattern</DialogTitle>
          <DialogDescription>
            Copy code snippets or download the pattern in various formats.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Pattern Info */}
          <div className="space-y-2">
            <Label>Pattern</Label>
            <Card className="p-3 bg-muted">
              <code className="text-sm">
                /{pattern}/{flagsStr || "(no flags)"}
              </code>
            </Card>
          </div>

          {/* Code Snippets */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="typescript">TypeScript</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
            </TabsList>
            <TabsContent value="javascript" className="mt-4">
              <Card className="p-4 bg-muted">
                <pre className="text-sm overflow-x-auto">
                  <code>{generateJavaScript()}</code>
                </pre>
              </Card>
            </TabsContent>
            <TabsContent value="typescript" className="mt-4">
              <Card className="p-4 bg-muted">
                <pre className="text-sm overflow-x-auto">
                  <code>{generateTypeScript()}</code>
                </pre>
              </Card>
            </TabsContent>
            <TabsContent value="python" className="mt-4">
              <Card className="p-4 bg-muted">
                <pre className="text-sm overflow-x-auto whitespace-pre">
                  <code>{generatePython()}</code>
                </pre>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => handleCopy(currentCode, activeTab)}
            >
              {copied === activeTab ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Code
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const extension =
                  activeTab === "python" ? "py" : activeTab === "typescript" ? "ts" : "js"
                handleDownload(extension, currentCode)
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Download {activeTab === "python" ? ".py" : activeTab === "typescript" ? ".ts" : ".js"}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleDownload("regex", pattern)}
            >
              <Download className="h-4 w-4 mr-2" />
              Download .regex
            </Button>
            <Button variant="outline" onClick={handleShare}>
              {copied === "share" ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Link Copied!
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Link
                </>
              )}
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

