"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Send,
  Mic,
  Paperclip,
  MoreVertical,
  Plus,
  Search,
  History,
  User,
  Crown,
  Sparkles,
  Menu,
  X,
  MessageSquare,
  Trash2,
  Edit3,
  Square,
  Zap,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatHistory {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  messageCount: number
}

export default function Inbox() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [aiThinkingState, setAiThinkingState] = useState<"thinking" | "scheduling" | "analysing" | null>(null)

  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([
    {
      id: "1",
      title: "Restaurant booking for Monday",
      lastMessage: "I've found 5 great restaurants for your date...",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      messageCount: 8,
    },
    {
      id: "2",
      title: "Calendar scheduling help",
      lastMessage: "Your schedule has been optimized for next week...",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      messageCount: 12,
    },
    {
      id: "3",
      title: "Weather and travel planning",
      lastMessage: "The weather looks perfect for your trip...",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      messageCount: 6,
    },
    {
      id: "4",
      title: "Project deadline reminders",
      lastMessage: "I've set up reminders for all your upcoming deadlines...",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      messageCount: 4,
    },
    {
      id: "5",
      title: "Meeting preparation notes",
      lastMessage: "Here's a summary of the key points for tomorrow's meeting...",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      messageCount: 15,
    },
  ])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Initialize welcome message
    if (user && messages.length === 0) {
      setMessages([
        {
          id: "1",
          type: "assistant",
          content: `Welcome to Syntra.ai Premium, ${user?.name || "there"}! 🎉

I'm your AI assistant with FULL ACCESS to all features. I can help you with:

✅ **Unlimited AI Conversations** - Ask me anything, anytime
✅ **Smart Scheduling** - Connect your Google Calendar, Gmail, Notion
✅ **Restaurant Bookings** - I'll find and book the perfect spots
✅ **Weather & Location Services** - Real-time updates and suggestions  
✅ **Advanced Analytics** - Detailed productivity reports
✅ **Priority Support** - Get help whenever you need it

How can I assist you today? Try asking me to plan your next date, schedule meetings, or book a restaurant!`,
          timestamp: new Date(),
        },
      ])
    }
  }, [user, messages.length])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Show thinking animation sequence
    setAiThinkingState("thinking")

    setTimeout(() => {
      setAiThinkingState("analysing")
    }, 1000)

    setTimeout(() => {
      setAiThinkingState("scheduling")
    }, 2000)

    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setAiThinkingState(null)
    }, 3000)
  }

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes("date") && input.includes("monday")) {
      return `🎯 **Premium AI Analysis Complete!**

I've checked your Google Calendar and email for next Monday. Great news! You're completely free from 7:00 PM onwards. I've blocked that time slot for your date.

🍽️ **Top 5 Premium Restaurant Recommendations in Bangalore:**

1. **Toit Brewpub** - Rooftop dining with craft beer and great ambiance
   📍 Location: Indiranagar | 💰 ₹2,500 for two | ⭐ 4.8/5
   
2. **The Fatty Bao** - Asian fusion with intimate seating
   📍 Location: Koramangala | 💰 ₹2,200 for two | ⭐ 4.7/5
   
3. **Skyye Lounge** - Fine dining with city views
   📍 Location: UB City Mall | 💰 ₹3,500 for two | ⭐ 4.9/5
   
4. **Caperberry** - European cuisine in a cozy setting  
   📍 Location: Ulsoor | 💰 ₹2,800 for two | ⭐ 4.6/5
   
5. **The Reservoire** - Lakeside dining with live music
   📍 Location: Whitefield | 💰 ₹2,000 for two | ⭐ 4.5/5

🌤️ **Weather Forecast:** Clear skies, 24°C - perfect for a romantic evening!

💎 **Premium Feature:** I can instantly book your preferred restaurant once you choose. Just say "Book Toit" and I'll handle the reservation!`
    }

    if (input.includes("calendar") || input.includes("schedule")) {
      return `📅 **Premium Calendar Analysis:**

I've analyzed your complete schedule across all connected platforms:

**This Week:**
- 3 meetings scheduled
- 2 free slots available (Tuesday 2-4 PM, Friday 10-12 PM)
- 1 deadline approaching (Project report - Thursday)

**Upcoming:**
- 5 important events next week
- 2 potential conflicts detected (I can resolve these)

💎 **Premium Features Active:**
✅ Google Calendar sync
✅ Gmail integration  
✅ Notion workspace connected
✅ Automatic conflict resolution
✅ Smart reminder system

Would you like me to optimize your schedule or add new events?`
    }

    if (input.includes("weather")) {
      return `🌤️ **Premium Weather & Location Service:**

**Current Conditions in Bangalore:**
- Temperature: 26°C (feels like 28°C)
- Condition: Partly cloudy with light winds
- Humidity: 65%
- UV Index: 6 (Moderate)

**7-Day Forecast:**
- Today: 26°C | Partly cloudy
- Tomorrow: 24°C | Light rain expected
- Weekend: 28°C | Perfect weather for outdoor activities

💎 **Premium Insights:**
- Best time for outdoor activities: 6-8 PM today
- Recommended to carry an umbrella tomorrow
- Great weather for your planned date on Monday!

Would you like location-specific recommendations based on this weather?`
    }

    return `🤖 **Premium AI Assistant Ready!**

I understand you need help with that. With your Premium access, I have unlimited capabilities to assist you:

💎 **Available Premium Services:**
- Smart scheduling across all your apps
- Restaurant & event booking
- Real-time weather & traffic updates  
- Advanced productivity analytics
- Priority customer support
- Unlimited AI conversations

What specific task would you like me to help you with? I can handle complex requests and provide detailed solutions!`
  }

  const handleVoiceInput = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false)
      setRecordingDuration(0)
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
        recordingIntervalRef.current = null
      }

      // Simulate voice processing
      setTimeout(() => {
        setInputValue("Voice message: Help me plan my day")
      }, 1000)
    } else {
      // Start recording
      setIsRecording(true)
      setRecordingDuration(0)

      // Start duration counter
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1)
      }, 1000)
    }
  }

  const handleFileAttachment = () => {
    fileInputRef.current?.click()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const startNewChat = () => {
    setMessages([])
    setCurrentChatId(null)
    // Add welcome message for new chat
    setTimeout(() => {
      setMessages([
        {
          id: "welcome",
          type: "assistant",
          content: `Hello! I'm ready to help you with anything you need. What can I assist you with today?`,
          timestamp: new Date(),
        },
      ])
    }, 100)
  }

  const loadChatHistory = (chatId: string) => {
    const chat = chatHistory.find((c) => c.id === chatId)
    if (!chat) return

    setCurrentChatId(chatId)
    // Simulate loading chat messages
    setMessages([
      {
        id: "1",
        type: "user",
        content: "Help me with " + chat.title.toLowerCase(),
        timestamp: new Date(chat.timestamp.getTime() - 60000),
      },
      {
        id: "2",
        type: "assistant",
        content: chat.lastMessage,
        timestamp: chat.timestamp,
      },
    ])
  }

  const deleteChatHistory = (chatId: string) => {
    setChatHistory((prev) => prev.filter((chat) => chat.id !== chatId))
  }

  const filteredChatHistory = chatHistory.filter(
    (chat) =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (hours < 1) return "Just now"
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return timestamp.toLocaleDateString()
  }

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="relative flex flex-col h-[calc(100vh-88px)] max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Overlay Backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Left Sidebar - Overlay - Aligned with top */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-gray-50 border-r border-gray-200 flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ top: "0px", height: "100vh" }}
      >
        {/* Sidebar Header - Aligned with main header */}
        <div className="p-4 border-b border-gray-200 bg-white" style={{ marginTop: "88px" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Chats</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* New Chat Button */}
          <Button
            onClick={startNewChat}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl mb-4 font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl border-2 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-2">
            {filteredChatHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No chat history found</p>
              </div>
            ) : (
              filteredChatHistory.map((chat) => (
                <div
                  key={chat.id}
                  className={`group p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-white hover:shadow-md ${
                    currentChatId === chat.id ? "bg-blue-50 border-2 border-blue-200" : "bg-gray-100"
                  }`}
                  onClick={() => {
                    loadChatHistory(chat.id)
                    setSidebarOpen(false) // Close sidebar on mobile after selecting chat
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <MessageSquare className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <h3 className="font-semibold text-sm text-gray-900 truncate">{chat.title}</h3>
                      </div>
                      <p className="text-xs text-gray-600 truncate mb-2">{chat.lastMessage}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{formatTimestamp(chat.timestamp)}</span>
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                          {chat.messageCount}
                        </span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto w-auto ml-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem className="rounded-lg">
                          <Edit3 className="w-4 h-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="rounded-lg text-red-600 hover:text-red-800"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteChatHistory(chat.id)
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area - Full Width */}
      <div className="flex flex-col h-full w-full">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </Button>

              {/* Premium Status */}
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 sm:px-4 py-2 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-semibold text-xs sm:text-sm">Premium AI Assistant</span>
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2 rounded-xl hover:bg-gray-100">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl shadow-xl border-0">
                <DropdownMenuItem className="px-4 py-3 hover:bg-gray-50 rounded-lg mx-2 my-1">
                  <Plus className="w-4 h-4 mr-3" />
                  New Channel
                </DropdownMenuItem>
                <DropdownMenuItem className="px-4 py-3 hover:bg-gray-50 rounded-lg mx-2 my-1">
                  <Search className="w-4 h-4 mr-3" />
                  Search Chat
                </DropdownMenuItem>
                <DropdownMenuItem className="px-4 py-3 hover:bg-gray-50 rounded-lg mx-2 my-1">
                  <History className="w-4 h-4 mr-3" />
                  Chat History
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 p-4 sm:p-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`flex items-start space-x-3 max-w-[90%] sm:max-w-[85%] ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
              >
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                    message.type === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  }`}
                >
                  {message.type === "user" ? (
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </div>
                <Card
                  className={`shadow-lg border-0 rounded-2xl ${message.type === "user" ? "bg-blue-600 text-white" : "bg-white"}`}
                >
                  <CardContent className="p-4 sm:p-5">
                    <p className="text-sm sm:text-base whitespace-pre-wrap break-words leading-relaxed">
                      {message.content}
                    </p>
                    <p className={`text-xs mt-3 ${message.type === "user" ? "text-blue-100" : "text-gray-500"}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}

          {aiThinkingState && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3 max-w-[90%] sm:max-w-[85%]">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center justify-center shadow-lg">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <Card className="bg-white shadow-lg border-0 rounded-2xl">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-sm text-blue-600 font-medium capitalize">{aiThinkingState}...</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Enhanced Input Area */}
        <div className="border-t border-gray-200 p-4 bg-white">
          {/* Recording Status */}
          {isRecording && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-700 font-semibold text-sm">Recording...</span>
                  <span className="text-red-600 text-sm font-mono">{formatRecordingTime(recordingDuration)}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleVoiceInput}
                  className="text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg"
                >
                  <Square className="w-4 h-4" />
                </Button>
              </div>
              <div className="mt-2 text-xs text-red-600">Tap the microphone again to stop recording</div>
            </div>
          )}

          <div className="flex items-end space-x-2 sm:space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFileAttachment}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 sm:p-3 rounded-xl flex-shrink-0"
            >
              <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>

            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask your Premium AI assistant anything..."
                className="min-h-[44px] sm:min-h-[52px] rounded-2xl border-2 border-gray-200 focus:border-blue-500 text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3 resize-none"
                disabled={isRecording}
              />
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleVoiceInput}
              className={`${
                isRecording
                  ? "text-red-500 bg-red-50 border-2 border-red-200 shadow-lg"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              } p-2 sm:p-3 rounded-xl flex-shrink-0 transition-all duration-200 relative`}
            >
              {isRecording ? (
                <>
                  <div className="absolute inset-0 bg-red-100 rounded-xl animate-ping opacity-75"></div>
                  <Square className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
                </>
              ) : (
                <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </Button>

            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isRecording}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-2 sm:p-3 rounded-xl flex-shrink-0 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              size="sm"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>

          <input ref={fileInputRef} type="file" className="hidden" multiple accept="image/*,document/*" />

          <p className="text-xs text-gray-500 text-center mt-3 sm:mt-4">
            💎 Premium: Unlimited messages • Advanced AI • Priority support
          </p>
        </div>
      </div>
    </div>
  )
}
