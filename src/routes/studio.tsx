import { createFileRoute } from '@tanstack/react-router'
import { StudioView } from '../components/studio/StudioView'

export const Route = createFileRoute('/studio')({
  ssr: false,
  head: () => ({
    meta: [
      { title: 'Sanity Studio — Sri Subhakari Fashions' },
    ],
  }),
  component: StudioView,
})
