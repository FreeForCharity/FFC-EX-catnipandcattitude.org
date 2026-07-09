import type { Metadata } from 'next'
import { loadCloneContent } from '@/lib/clone-content'

export const metadata: Metadata = {
  title: 'Adoptions',
  description:
    'Adopt a cat from Catnip and Cattitude. View available cats and download our adoption application.',
  alternates: { canonical: '/adoptions' },
}

export default function Page() {
  return (
    <div
      className="x x-fonts-sacramento x-fonts-raleway"
      dangerouslySetInnerHTML={{ __html: loadCloneContent('adoptions') }}
    />
  )
}
