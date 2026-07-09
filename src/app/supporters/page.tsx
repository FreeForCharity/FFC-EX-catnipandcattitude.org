import type { Metadata } from 'next'
import { loadCloneContent } from '@/lib/clone-content'

export const metadata: Metadata = {
  title: 'Supporters',
  description:
    "The businesses and partners who support Catnip and Cattitude's work with community cats.",
  alternates: { canonical: '/supporters' },
}

export default function Page() {
  return (
    <div
      className="x x-fonts-sacramento x-fonts-raleway"
      dangerouslySetInnerHTML={{ __html: loadCloneContent('supporters') }}
    />
  )
}
