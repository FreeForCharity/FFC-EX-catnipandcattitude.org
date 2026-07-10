import type { Metadata } from 'next'
import PolicyPage from '@/components/policy-page'
import { siteConfig } from '@/lib/site.config'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: `How ${siteConfig.name} uses cookies and how you can control them.`,
  alternates: { canonical: '/cookie-policy' },
}

export default function Page() {
  return (
    <PolicyPage title="Cookie Policy" lastUpdated="2026-07-08">
      <p>
        This Cookie Policy explains how {siteConfig.name} uses cookies and similar technologies on
        this website.
      </p>

      <h2>What are cookies?</h2>
      <p>
        Cookies are small text files stored on your device when you visit a website. They are widely
        used to make websites work, to remember your preferences, and to provide usage information
        to site owners.
      </p>

      <h2>How we use cookies</h2>
      <p>
        We use a small number of cookies for website analytics — to understand which pages are
        visited and how the site performs. These are only set after you accept non-essential cookies
        in the consent banner. Essential cookies needed for the site to function may be set
        automatically.
      </p>

      <h2>Managing cookies</h2>
      <p>
        You can accept or decline non-essential cookies using the consent banner shown on your first
        visit. You can also control or delete cookies through your browser settings at any time.
      </p>

      <h2>More information</h2>
      <p>
        For how we handle information generally, see our{' '}
        <a href="/privacy-policy">Privacy Policy</a>.
      </p>

      <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '2rem' }}>
        This policy is provided as a starting point and should be reviewed by the
        organization&rsquo;s advisors before being relied upon.
      </p>
    </PolicyPage>
  )
}
