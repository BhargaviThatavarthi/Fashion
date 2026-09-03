import React from 'react'
import { Link } from '@tanstack/react-router'

interface LogoProps {
  variant?: 'header' | 'footer' | 'admin' | 'full' | 'icon'
  className?: string
  showTagline?: boolean
  linkTo?: string
  onClick?: () => void
}

export default function Logo({
  variant = 'header',
  className = '',
  showTagline = true,
  linkTo,
  onClick,
}: LogoProps) {
  const isIcon = variant === 'icon'

  const content = (
    <div
      className={`inline-flex items-center select-none group transition-transform duration-300 hover:scale-[1.02] ${className}`}
      onClick={onClick}
    >
      {variant === 'icon' ? (
        <img
          src="/images/logo-icon.svg"
          alt="Sri Subhakari Fashions"
          className="w-10 h-10 rounded-xl shadow-md object-contain"
        />
      ) : variant === 'admin' ? (
        <div className="flex items-center gap-3">
          <img
            src="/images/logo-icon.svg"
            alt="Sri Subhakari Fashions"
            className="w-9 h-9 rounded-xl shadow-md object-contain border border-pink-500/30"
          />
          <div className="flex flex-col min-w-0">
            <span className="font-heading text-sm font-bold text-white tracking-wide truncate">
              Sri Subhakari
            </span>
            <span className="text-[10px] text-pink-300 font-semibold tracking-widest uppercase">
              Fashions Admin
            </span>
          </div>
        </div>
      ) : variant === 'footer' ? (
        <div className="flex flex-col items-start w-full max-w-[320px]">
          <img
            src="/images/logo.svg"
            alt="Sri Subhakari Fashions - Precision in every detail"
            className="w-full h-auto max-h-24 object-contain filter drop-shadow-md"
          />
        </div>
      ) : variant === 'full' ? (
        <div className="flex flex-col items-center w-full max-w-[380px]">
          <img
            src="/images/logo.svg"
            alt="Sri Subhakari Fashions - Precision in every detail"
            className="w-full h-auto object-contain filter drop-shadow-lg"
          />
        </div>
      ) : (
        /* Header / Default Variant */
        <div className="flex items-center">
          <img
            src="/images/logo.svg"
            alt="Sri Subhakari Fashions"
            className="h-9 sm:h-11 md:h-13 w-auto max-w-[280px] sm:max-w-[340px] md:max-w-[380px] object-contain filter drop-shadow-sm transition-all duration-300 group-hover:drop-shadow-[0_0_14px_rgba(236,72,153,0.45)]"
          />
        </div>
      )}
    </div>
  )

  if (linkTo) {
    return (
      <Link to={linkTo} className="inline-flex focus:outline-none">
        {content}
      </Link>
    )
  }

  return content
}
