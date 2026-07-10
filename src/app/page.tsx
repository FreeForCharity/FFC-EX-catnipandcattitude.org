import type { Metadata } from 'next'
import { loadCloneContent } from '@/lib/clone-content'

export const metadata: Metadata = {
  description:
    'Catnip and Cattitude — compassionate care for community cats in the Willows, CA area. Adoptions, fostering, and TNR for cats in need.',
  alternates: { canonical: '/' },
}

export default function Page() {
  return (
    <div
      className="x x-fonts-sacramento x-fonts-raleway"
      dangerouslySetInnerHTML={{ __html: loadCloneContent('index') }}
    />
  )
}
