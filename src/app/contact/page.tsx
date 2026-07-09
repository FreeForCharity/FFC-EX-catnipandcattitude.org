import type { Metadata } from 'next'
import { loadCloneContent } from '@/lib/clone-content'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Catnip and Cattitude. Mailing address, phone, and how to reach our volunteers.',
  alternates: { canonical: '/contact' },
}

export default function Page() {
  return (
    <div
      className="x x-fonts-sacramento x-fonts-raleway"
      dangerouslySetInnerHTML={{ __html: loadCloneContent('contact') }}
    />
  )
}
