import type { Metadata } from 'next'
import { loadCloneContent } from '@/lib/clone-content'

export const metadata: Metadata = {
  title: 'Foster',
  description:
    'Become a foster for Catnip and Cattitude and give a cat a safe temporary home. Download our foster application.',
  alternates: { canonical: '/fosters' },
}

export default function Page() {
  return (
    <div
      className="x x-fonts-sacramento x-fonts-raleway"
      dangerouslySetInnerHTML={{ __html: loadCloneContent('fosters') }}
    />
  )
}
