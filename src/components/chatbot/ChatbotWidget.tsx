import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquareMore,
  Sparkles,
  X,
  Send,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronDown,
  ShoppingBag,
  ExternalLink,
  Bot,
} from 'lucide-react'
import {
  generateChatbotReply,
  INITIAL_SUGGESTIONS,
  type ChatMessageData,
} from './chatbotKnowledge'
import { ChatMessage } from './ChatMessage'
import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../../services/products'
import { DEMO_PRODUCTS, type Product } from '../../types'
import { WHATSAPP_NUMBER, SITE_NAME } from '../../constants'

const STORAGE_KEY = 'ssf_chatbot_history_v3'

const WELCOME_MESSAGE: ChatMessageData = {
  id: 'welcome-1',
  sender: 'bot',
  text: `Namaste & Welcome to **${SITE_NAME}** — *Elegance in Every Thread*. 🙏✨\n\nI am **Subhakari**, your personal Style Concierge & Shopping Advisor.\n\nWhether you are exploring our **Royal Bridal Kanjivaram Silks**, discovering **Curated Festive Collections**, or seeking expert **Draping & Fabric Care guidance**, I am at your service.\n\nHow may I assist you in finding your perfect look today?`,
  timestamp: 'Just now',
  quickReplies: [
    '👑 Recommend Bridal Sarees',
    '🌸 Sarees under ₹3,000',
    '📖 How to drape a Kanjivaram?',
    '🏛️ Showroom Location in Repalle',
  ],
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessageData[]>([WELCOME_MESSAGE])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showTeaser, setShowTeaser] = useState(false)
  const [teaserDismissed, setTeaserDismissed] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Fetch live products for rich catalog matching
  const { data: productsData } = useQuery({
    queryKey: ['chatbot-products'],
    queryFn: () => getProducts({ limit: 40 }),
    staleTime: 1000 * 60 * 10, // 10 minutes
  })

  const availableProducts: Product[] =
    productsData && productsData.data && productsData.data.length > 0
      ? productsData.data
      : DEMO_PRODUCTS

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed)
        }
      }
    } catch (e) {
      console.warn('Failed to load chat history:', e)
    }
  }, [])

  // Save history to localStorage
  useEffect(() => {
    try {
      if (messages.length > 1) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
      }
    } catch (e) {
      console.warn('Failed to save chat history:', e)
    }
  }, [messages])

  // Show teaser balloon after 4 seconds if not opened
  useEffect(() => {
    if (teaserDismissed || isOpen) return
    const timer = setTimeout(() => {
      setShowTeaser(true)
    }, 4000)
    return () => clearTimeout(timer)
  }, [isOpen, teaserDismissed])

  // Auto scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping, isOpen])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setShowTeaser(false)
      setUnreadCount(0)
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  // Play subtle sound if enabled
  const playPopSound = () => {
    if (!soundEnabled || typeof window === 'undefined') return
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(580, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12)
      gain.gain.setValueAtTime(0.04, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.12)
    } catch (e) {
      // Audio context might be restricted
    }
  }

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputValue).trim()
    if (!query) return

    const userMsg: ChatMessageData = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInputValue('')
    setIsTyping(true)
    playPopSound()

    // Simulate natural thinking delay
    setTimeout(() => {
      const botResponse = generateChatbotReply(query, availableProducts)
      const botMsg: ChatMessageData = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botResponse.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        products: botResponse.products,
        quickReplies: botResponse.quickReplies,
        actionLink: botResponse.actionLink,
      }

      setMessages((prev) => [...prev, botMsg])
      setIsTyping(false)
      playPopSound()

      if (!isOpen) {
        setUnreadCount((c) => c + 1)
      }
    }, 650)
  }

  const handleResetChat = () => {
    setMessages([WELCOME_MESSAGE])
    localStorage.removeItem(STORAGE_KEY)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Floating Teaser Balloon */}
      <AnimatePresence>
        {showTeaser && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-5 sm:right-8 z-40 max-w-[280px] bg-white rounded-2xl p-3.5 shadow-xl border border-pink-100 flex items-start gap-2.5 cursor-pointer group"
            onClick={() => setIsOpen(true)}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1f0b24] to-[#c045c7] flex items-center justify-center text-white shrink-0 shadow-xs">
              <MessageSquareMore size={16} className="text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-xs font-semibold text-gray-900 leading-snug">
                Need help picking a saree? 🥻
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Ask Subhakari for bridal & festive style advice!
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setShowTeaser(false)
                setTeaserDismissed(true)
              }}
              className="text-gray-400 hover:text-gray-600 p-0.5"
              aria-label="Dismiss message"
            >
              <X size={14} />
            </button>
            {/* Speech Bubble Arrow */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white rotate-45 border-r border-b border-pink-100" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Launcher Button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 sm:right-8 z-40 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl focus:outline-hidden transition-transform"
        style={{
          background: 'linear-gradient(135deg, #1f0b24 0%, #c045c7 60%, #e07474 100%)',
          boxShadow: '0 8px 28px rgba(192, 69, 199, 0.45)',
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label={isOpen ? 'Close Style Assistant' : 'Open Style Assistant'}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={28} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="relative flex items-center justify-center"
            >
              <MessageSquareMore size={26} className="text-white" />
              {/* Unread count badge */}
              {unreadCount > 0 && (
                <span className="absolute -top-3 -right-3 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="fixed inset-x-3 bottom-24 sm:inset-x-auto sm:right-8 sm:bottom-24 z-50 w-auto sm:w-[410px] h-[580px] max-h-[calc(100vh-7.5rem)] bg-[#faf8f9] rounded-3xl shadow-2xl border border-pink-200/80 flex flex-col overflow-hidden backdrop-blur-md"
          >
            {/* Chat Header */}
            <div className="px-4 py-3.5 bg-gradient-to-r from-[#1f0b24] via-[#350d3e] to-[#1f0b24] text-white flex items-center justify-between shadow-md select-none">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-amber-300 flex items-center justify-center text-white shadow-xs ring-2 ring-white/20">
                    <Sparkles size={18} className="text-white" />
                  </div>
                  {/* Live green status dot */}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#1f0b24] rounded-full" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-heading text-sm font-bold text-white tracking-wide">
                      Subhakari Style AI
                    </h3>
                    <span className="text-[10px] bg-white/15 px-1.5 py-0.2 rounded-full text-pink-200 font-medium">
                      Stylist
                    </span>
                  </div>
                  <p className="text-[11px] text-pink-200/80 flex items-center gap-1">
                    <span>Sri Subhakari Fashions</span>
                    <span>•</span>
                    <span className="text-emerald-300 font-medium">Online</span>
                  </p>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex items-center gap-1 text-white/80">
                <button
                  type="button"
                  onClick={() => setSoundEnabled((v) => !v)}
                  className="p-1.5 rounded-full hover:bg-white/10 hover:text-white transition-colors"
                  title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
                  aria-label="Toggle sound"
                >
                  {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>

                <button
                  type="button"
                  onClick={handleResetChat}
                  className="p-1.5 rounded-full hover:bg-white/10 hover:text-white transition-colors"
                  title="Reset conversation"
                  aria-label="Reset chat"
                >
                  <RotateCcw size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 hover:text-white transition-colors ml-0.5"
                  title="Minimize assistant"
                  aria-label="Close chat"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-left">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  onQuickReplyClick={(reply) => handleSendMessage(reply)}
                />
              ))}

              {/* Typing Animation */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#1f0b24] to-[#c045c7] flex items-center justify-center text-white shrink-0">
                    <Sparkles size={12} className="text-amber-300 animate-spin" />
                  </div>
                  <div className="bg-white border border-pink-100 rounded-2xl rounded-bl-xs px-4 py-3 shadow-2xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Suggestions Bar */}
            <div className="px-3 py-2 bg-white/70 border-t border-pink-100/60 overflow-x-auto scrollbar-none flex gap-1.5">
              {INITIAL_SUGGESTIONS.slice(0, 4).map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(suggestion)}
                  className="text-[11px] font-medium whitespace-nowrap px-2.5 py-1 rounded-full bg-white hover:bg-pink-50 text-gray-700 hover:text-pink-900 border border-gray-200 hover:border-pink-300 transition-all shrink-0 shadow-2xs"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
              {/* Text Input */}
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about sarees, prices, fabric..."
                className="flex-1 text-xs sm:text-sm bg-gray-50 hover:bg-gray-100/80 focus:bg-white border border-gray-200 focus:border-pink-500 rounded-full px-4 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-hidden transition-all"
              />

              {/* Send Button */}
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim()}
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#1f0b24] to-[#c045c7] hover:from-pink-800 hover:to-pink-600 disabled:opacity-40 text-white flex items-center justify-center shrink-0 shadow-md transition-all active:scale-95 disabled:cursor-not-allowed"
                title="Send message"
                aria-label="Send message"
              >
                <Send size={15} className="ml-0.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
