import React, { useState, useEffect, lazy, Suspense } from 'react'
import sanityConfig from '../../../sanity.config'

const StudioComponent = lazy(() =>
  import('sanity').then((m) => ({
    default: m.Studio as React.ComponentType<{ config: any }>,
  }))
)

export function StudioView() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white font-sans font-heading">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-lg font-medium text-pink-200">Loading Sanity Studio...</p>
      </div>
    )
  }

  return (
    <div className="w-full h-screen fixed inset-0 z-[9999] bg-white">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white font-sans font-heading">
            <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-lg font-medium text-pink-200">Loading Sanity Studio Interface...</p>
          </div>
        }
      >
        <StudioComponent config={sanityConfig} />
      </Suspense>
    </div>
  )
}
