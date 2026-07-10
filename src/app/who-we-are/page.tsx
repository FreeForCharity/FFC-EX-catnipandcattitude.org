import type { Metadata } from 'next'
import { loadCloneContent } from '@/lib/clone-content'

export const metadata: Metadata = {
  title: 'Who We Are',
  description:
    'Meet the volunteer team behind Catnip and Cattitude and learn about our mission caring for community cats.',
  alternates: { canonical: '/who-we-are' },
}

export default function Page() {
  return (
    <div
      className="x x-fonts-sacramento x-fonts-raleway"
      dangerouslySetInnerHTML={{ __html: loadCloneContent('who-we-are') }}
    />
  )
}
