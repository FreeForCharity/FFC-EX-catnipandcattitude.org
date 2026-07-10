import type { Metadata } from 'next'
import { loadCloneContent } from '@/lib/clone-content'

export const metadata: Metadata = {
  title: 'Donate & Wishlist',
  description:
    'Support Catnip and Cattitude with a donation or by shopping our wishlist to help cats in need.',
  alternates: { canonical: '/donate-and-wishlist' },
}

export default function Page() {
  return (
    <div
      className="x x-fonts-sacramento x-fonts-raleway"
      dangerouslySetInnerHTML={{ __html: loadCloneContent('donate-and-wishlist') }}
    />
  )
}
