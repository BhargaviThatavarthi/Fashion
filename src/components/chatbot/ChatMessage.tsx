import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, MessageCircle, ExternalLink, Bot, User } from 'lucide-react'
import { ChatProductCard } from './ChatProductCard'
import type { ChatMessageData } from './chatbotKnowledge'

interface ChatMessageProps {
  message: ChatMessageData
  onQuickReplyClick: (reply: string) => void
}

// Simple markdown formatter for bolding, bullet points, and newlines
function formatMessageContent(content: string) {
  const lines = content.split('\n')
  return lines.map((line, idx) => {
    // Check if line is a bullet
    const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ')
    const cleanLine = isBullet ? line.trim().substring(2) : line

    // Parse bold text **text**
    const parts = cleanLine.split(/(\*\*.*?\*\*)/g)
    const formattedLine = parts.map((part, pIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={pIdx} className="font-semibold text-gray-900">
            {part.slice(2, -2)}
          </strong>
        )
      }
      return part
    })

    if (isBullet) {
      return (
        <li key={idx} className="ml-4 list-disc text-xs sm:text-sm text-gray-700 leading-relaxed my-0.5">
          {formattedLine}
        </li>
      )
    }

    if (line.trim() === '') {
      return <div key={idx} className="h-1.5" />
    }

    return (
      <p key={idx} className="text-xs sm:text-sm text-gray-800 leading-relaxed my-0.5">
        {formattedLine}
      </p>
    )
  })
}

export function ChatMessage({ message, onQuickReplyClick }: ChatMessageProps) {
  const isBot = message.sender === 'bot'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25 }}
      className={`flex flex-col gap-1.5 ${isBot ? 'items-start' : 'items-end'}`}
    >
      <div className={`flex items-end gap-2 max-w-[92%] sm:max-w-[85%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Avatar */}
        {isBot ? (
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-xs mb-1"
            style={{
              background: 'linear-gradient(135deg, #1f0b24 0%, #c045c7 100%)',
              color: 'white',
            }}
            title="Subhakari - Style Assistant"
          >
            <Sparkles size={14} className="text-amber-300" />
          </div>
        ) : (
          <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center shrink-0 mb-1">
            <User size={14} />
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={`px-3.5 py-2.5 rounded-2xl text-left shadow-xs ${
            isBot
              ? 'bg-white border border-pink-100/80 rounded-bl-xs text-gray-800'
              : 'bg-gradient-to-r from-[#1f0b24] to-[#471252] text-white rounded-br-xs'
          }`}
        >
          {isBot ? (
            <div className="space-y-0.5">{formatMessageContent(message.text)}</div>
          ) : (
            <p className="text-xs sm:text-sm font-medium text-white leading-relaxed whitespace-pre-wrap">
              {message.text}
            </p>
          )}

          {/* Action Link Button if present */}
          {message.actionLink && (
            <div className="mt-2.5 pt-2 border-t border-gray-100">
              <a
                href={message.actionLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  message.actionLink.isWhatsApp
                    ? 'bg-[#25D366] text-white hover:bg-[#1aab52] shadow-xs'
                    : 'bg-[#1f0b24] text-white hover:bg-pink-700'
                }`}
              >
                {message.actionLink.isWhatsApp ? (
                  <MessageCircle size={14} />
                ) : (
                  <ExternalLink size={13} />
                )}
                <span>{message.actionLink.label}</span>
              </a>
            </div>
          )}

          {/* Timestamp */}
          <div
            className={`text-[10px] mt-1 text-right ${
              isBot ? 'text-gray-400' : 'text-pink-200/70'
            }`}
          >
            {message.timestamp}
          </div>
        </div>
      </div>

      {/* Product Recommendation Cards Slider */}
      {message.products && message.products.length > 0 && (
        <div className="w-full mt-1.5 pl-9">
          <p className="text-[11px] font-semibold text-gray-500 mb-1.5 flex items-center gap-1">
            <Sparkles size={12} className="text-pink-500" />
            <span>Recommended Styles</span>
          </p>
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x">
            {message.products.map((product) => (
              <div key={product.id} className="snap-start">
                <ChatProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Reply Chips */}
      {message.quickReplies && message.quickReplies.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1 pl-9">
          {message.quickReplies.map((reply, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onQuickReplyClick(reply)}
              className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-pink-50/80 hover:bg-pink-100 text-pink-900 border border-pink-200/60 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xs"
            >
              {reply}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  )
}
