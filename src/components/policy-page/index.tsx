import type { ReactNode } from 'react'
import Link from 'next/link'
import { siteConfig } from '@/lib/site.config'

/**
 * Minimal, self-contained layout for the legal/policy routes. The charity
 * content pages are a faithful clone with their own chrome; these FFC-standard
 * policy pages are plain readable documents that inherit only the root layout.
 */
export default function PolicyPage({
  title,
  lastUpdated,
  children,
}: {
  title: string
  lastUpdated: string
  children: ReactNode
}) {
  return (
    <article
      style={{
        maxWidth: '48rem',
        margin: '0 auto',
        padding: '3rem 1.25rem 4rem',
        fontFamily: 'Georgia, "Times New Roman", serif',
        lineHeight: 1.7,
        color: '#1a1a1a',
      }}
    >
      <Link href="/" style={{ color: '#173f3a', textDecoration: 'none', fontSize: '0.9rem' }}>
        ← Back to {siteConfig.name}
      </Link>
      <h1 style={{ marginTop: '1.5rem', fontSize: '2rem', color: '#173f3a' }}>{title}</h1>
      <p style={{ color: '#666', fontSize: '0.9rem' }}>Last updated: {lastUpdated}</p>
      {children}
    </article>
  )
}
