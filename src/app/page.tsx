import type { Metadata } from 'next'
import ReactDOM from 'react-dom'
import { loadCloneContent } from '@/lib/clone-content'
import { assetPath } from '@/lib/assetPath'

export const metadata: Metadata = {
  description:
    'Catnip and Cattitude — compassionate care for community cats in the Willows, CA area. Adoptions, fostering, and TNR for cats in need.',
  alternates: { canonical: '/' },
}

export default function Page() {
  // The hero band image is the LCP element but sits deep in the cloned markup,
  // so the browser discovers it late (≈1.8s load-delay). Preloading it at high
  // priority lets the fetch start immediately, cutting LCP substantially.
  ReactDOM.preload(assetPath('/Images/wsimg/fb_102092082519559_1024x461.webp'), {
    as: 'image',
    fetchPriority: 'high',
  })
  return (
    <div
      className="x x-fonts-sacramento x-fonts-raleway"
      dangerouslySetInnerHTML={{ __html: loadCloneContent('index') }}
    />
  )
}
