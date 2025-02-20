import { useState, useRef, useEffect } from "react"
import { MessageSquare, Send, Plus, Copy, Check, Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { ChatMessage, streamCompletion } from "@/lib/openai"
import { Prompt, enterprisePrompts, categories } from "@/lib/prompts"

const messageSchema = z.object({
  content: z.string().min(1, "Please enter a message"),
})

type MessageFormData = z.infer<typeof messageSchema>

interface CodeBlockProps {
  children: string
  className?: string
  [key: string]: any
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const form = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  })

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const filteredPrompts = enterprisePrompts.filter(prompt => {
    const matchesSearch = searchQuery.toLowerCase().trim() === "" ||
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = !selectedCategory || prompt.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const onSubmit = async (data: MessageFormData) => {
    if (isStreaming) return

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: data.content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    form.reset()

    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
      pending: true,
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsStreaming(true)

    try {
      const stream = await streamCompletion(
        messages.concat(userMessage).map(({ role, content }) => ({
          role,
          content,
        }))
      )

      let streamedContent = ""
      for await (const chunk of stream) {
        streamedContent += chunk
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? { ...msg, content: streamedContent }
              : msg
          )
        )
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id ? { ...msg, pending: false } : msg
        )
      )
    } catch (error) {
      console.error("Chat error:", error)
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id
            ? {
                ...msg,
                error: true,
                content: "An error occurred. Please try again.",
              }
            : msg
        )
      )
    } finally {
      setIsStreaming(false)
    }
  }

  const handlePromptSelect = (prompt: Prompt) => {
    setSelectedPrompt(prompt)
    form.setValue("content", prompt.prompt)
  }

  const CodeBlock = ({ children, className, ...props }: CodeBlockProps) => {
    const [isCopied, setIsCopied] = useState(false)
    const match = /language-(\w+)/.exec(className || "")

    const handleCopy = async () => {
      await navigator.clipboard.writeText(String(children))
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }

    return match ? (
      <div className="relative group">
        <SyntaxHighlighter
          language={match[1]}
          PreTag="div"
          className="rounded-md"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
        <Button
          variant="ghost"
          size="sm"
          className="absolute hidden group-hover:flex items-center gap-1 top-2 right-2 bg-background/80 backdrop-blur-sm"
          onClick={handleCopy}
        >
          {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {isCopied ? "Copied" : "Copy"}
        </Button>
      </div>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    )
  }

  return (
    <div className="flex h-screen">
      {/* Enhanced Prompt Library Sidebar */}
      <aside className="w-80 border-r bg-background flex flex-col">
        <div className="border-b p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Prompt Library</h2>
            <ThemeToggle />
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                className="gap-2"
              >
                <category.icon className="h-4 w-4" />
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        <ScrollArea className="flex-1 px-4 py-2">
          <div className="space-y-4">
            {filteredPrompts.map((prompt) => (
              <Card
                key={prompt.id}
                className={`p-4 transition-all hover:shadow-md cursor-pointer ${
                  selectedPrompt?.id === prompt.id ? "border-primary" : ""
                }`}
                onClick={() => handlePromptSelect(prompt)}
              >
                <div className="flex items-start gap-4">
                  <prompt.icon className="h-5 w-5 text-primary shrink-0" />
                  <div className="space-y-1">
                    <h3 className="font-medium">{prompt.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {prompt.description}
                    </p>
                    {prompt.tags && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {prompt.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => {
              setSelectedPrompt(null)
              form.reset()
            }}
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex flex-1 flex-col bg-muted/30">
        <ScrollArea className="flex-1 p-4">
          <div className="mx-auto max-w-3xl space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex gap-3"
                >
                  <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <Card
                    className={`flex-1 overflow-hidden ${
                      message.role === "assistant"
                        ? "bg-background/95 shadow-lg hover:shadow-xl transition-all duration-300"
                        : "bg-primary/95 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300"
                    }`}
                  >
                    <div className="p-4">
                      <ReactMarkdown components={{ code: CodeBlock }}>
                        {message.content}
                      </ReactMarkdown>
                      {message.pending && (
                        <div className="mt-2 flex space-x-1">
                          <motion.span
                            className="h-2 w-2 rounded-full bg-current opacity-40"
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                          <motion.span
                            className="h-2 w-2 rounded-full bg-current opacity-40"
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                          />
                          <motion.span
                            className="h-2 w-2 rounded-full bg-current opacity-40"
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-end gap-2 border-t p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => navigator.clipboard.writeText(message.content)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            Save as Prompt
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Share Response
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            {messages.length === 0 && (
              <div className="flex h-[50vh] items-center justify-center">
                <div className="text-center">
                  <div className="relative mx-auto w-16 h-16">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-primary/40 rounded-lg animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <MessageSquare className="h-8 w-8 text-primary animate-float" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30 rounded-lg blur opacity-30 animate-glow" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
                    Enterprise Intelligence Hub
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground max-w-md">
                    Access our curated collection of enterprise prompts or initiate a new strategic dialogue
                  </p>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </ScrollArea>

        {/* Enhanced Chat Input */}
        <footer className="border-t bg-background p-4">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mx-auto flex max-w-3xl gap-4"
          >
            <div className="flex-1 space-y-2">
              {selectedPrompt && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Using prompt:</span>
                  <span className="font-medium text-foreground">
                    {selectedPrompt.title}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => setSelectedPrompt(null)}
                  >
                    <Plus className="h-4 w-4 rotate-45" />
                  </Button>
                </div>
              )}
              <Input
                placeholder="Type your message..."
                {...form.register("content")}
                disabled={isStreaming}
                className="flex-1"
              />
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="submit" disabled={isStreaming}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send message</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Send message
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </form>
        </footer>
      </main>
    </div>
  )
}