"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Loader2, Trash2, Copy, Check } from "lucide-react"
import { sendChatMessage } from "../../config/api";

export default function ChatAI() {
  const [messages, setMessages] = useState<
    Array<{
      id: string
      role: "user" | "assistant"
      content: string
    }>
  >([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [showTooltip, setShowTooltip] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleCopyMessage = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const clearChat = () => {
    setMessages([])
    inputRef.current?.focus()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    // setInput("")
    setIsLoading(true)

    console.log(input.trim());

    try {
      const response = await sendChatMessage(
        // [...messages, userMessage].map((msg) => ({
        //   role: msg.role,
        //   content: msg.content,
        // })),
        input.trim(),
      )

      console.log(response);
      const recommend = `\n\nBạn có thể tham khảo các công việc có liên quan tại đây: <a style="color: #3b82f6; text-decoration: underline;"  href="http://localhost:5173/job?skills=${response.data.data.analysis.join(',')}" target="_blank">http://localhost:5173/job?skills=${response.data.data.analysis.join(',')}</a>`;

      // const recommend = (
      //   <span>
      //     Bạn có thể tham khảo các công việc có liên quan tại đây:{' '}
      //     <a 
      //       className="text-blue-500 underline" 
      //       href={`http://localhost:5173/job?skills=${response.data.data.analysis.join(',')}`}
      //       target="_blank"
      //       rel="noopener noreferrer"
      //     >
      //       http://localhost:5173/job?skills={response.data.data.analysis.join(',')}
      //     </a>
      //   </span>
      // );

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: response.data.data.content + recommend || "Sorry, I could not generate a response.",
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error:", error)
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: "Sorry, there was an error processing your request.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setInput("")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">AI Chat Platform</h1>
                <p className="text-slate-600">Powered by GPT-4o</p>
              </div>
            </div>
            <div className="relative">
              <button
                onClick={clearChat}
                disabled={messages.length === 0}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="px-3 py-2 border border-slate-300 rounded-md bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Trash2 className="h-4 w-4 text-slate-600" />
              </button>
              {showTooltip && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-slate-800 rounded whitespace-nowrap">
                  Clear chat history
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="h-[70vh] flex flex-col bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg shadow-lg">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">Chat Messages</h2>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto px-6">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="p-4 bg-blue-50 rounded-full mb-4">
                    <Bot className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Welcome to AI Chat Platform</h3>
                  <p className="text-slate-600 max-w-md">
                    Start a conversation with our AI assistant. Ask questions, get help, or just chat!
                  </p>
                </div>
              ) : (
                <div className="space-y-4 py-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-2 ${
                        message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.role === "user" ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </div>

                      {/* Message Content */}
                      <div className={`flex-1 max-w-[80%] ${message.role === "user" ? "text-right" : ""}`}>
                        {/* Move name above message */}
                        <div
                          className={`text-xs text-slate-500 mb-1 mr-2 ${
                            message.role === "user" ? "text-right" : "text-left"
                          }`}
                        >
                          {message.role === "user" ? "You" : "AI Assistant"}
                        </div>

                        <div
                          className={`inline-block p-3 rounded-lg relative group ${
                            message.role === "user" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-900"
                          }`}
                        >
                          <div dangerouslySetInnerHTML={{ __html: message.content }} className="whitespace-pre-wrap break-words">
                            {/* {message.content} */}
                          </div>

                          {/* Copy Button for Assistant Messages */}
                          {message.role === "assistant" && (
                            <button
                              onClick={() => handleCopyMessage(message.content, message.id)}
                              className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 bg-white shadow-sm border border-slate-200 rounded flex items-center justify-center hover:bg-slate-50"
                            >
                              {copiedMessageId === message.id ? (
                                <Check className="h-3 w-3 text-green-600" />
                              ) : (
                                <Copy className="h-3 w-3 text-slate-600" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Loading Indicator */}
                  {isLoading && (
                    <div className="flex items-start space-x-3">
                      <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-slate-700" />
                      </div>
                      <div className="bg-slate-100 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin text-slate-600" />
                          <span className="text-sm text-slate-600">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-200 p-4">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message here..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e as any)
                  }
                }}
              />

              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </form>

            {/* Status and Help Text */}
            <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
              <span>Press Enter to send, Shift + Enter for new line</span>
              <div className={`flex items-center space-x-1 ${isLoading ? "text-blue-600" : "text-green-600"}`}>
                <div className={`w-2 h-2 rounded-full ${isLoading ? "bg-blue-600 animate-pulse" : "bg-green-600"}`} />
                <span>{isLoading ? "Processing" : "Ready"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        {/* <div className="mt-4 text-center text-sm text-slate-500">Built with AI SDK, React, and TailwindCSS</div> */}
      </div>
    </div>
  )
}
