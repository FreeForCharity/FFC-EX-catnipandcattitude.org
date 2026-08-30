import type { Metadata } from 'next'
import Link from 'next/link'
import PolicyPage from '@/components/policy-page'
import { siteConfig } from '@/lib/site.config'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: `How ${siteConfig.name} uses cookies and how you can control them.`,
  alternates: { canonical: '/cookie-policy' },
}

export default function Page() {
  return (
    <PolicyPage title="Cookie Policy" lastUpdated="2026-08-30">
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
        visited and how the site performs. Essential cookies needed for the site to function may be
        set automatically.
      </p>
      <h2>When we ask permission first</h2>
      <p>
        We use Google Consent Mode. If you are in the European Economic Area, the United Kingdom, or
        Switzerland, Google Analytics sets no cookies and collects no identifiers until you accept
        through the consent banner — until then it only counts your visit in an aggregate,
        cookie-free way that cannot be tied back to you. Everywhere else, Google Analytics cookies
        are set from your first visit, and you can turn them off at any time using the Cookie
        Preferences link in our footer — we delete the analytics cookies this site set when you do.
        Which of these rules applies to your visit is determined by Google from your IP address at
        the time of your visit; IP geolocation is approximate.
      </p>
      <p>
        Session-recording analytics (Microsoft Clarity) and marketing tags (Meta Pixel) are
        different: they load only if you explicitly opt in through the consent banner — everywhere
        in the world. Declining, or simply not answering the banner, keeps them off.
      </p>

      <h2>Managing cookies</h2>
      <p>
        You can accept or decline non-essential cookies using the consent banner shown on your first
        visit, and change your mind at any time via the Cookie Preferences link in the footer —
        withdrawing consent deletes the analytics and marketing cookies this site set. You can also
        control or delete cookies through your browser settings at any time.
      </p>
      <h2>Do Not Track and Global Privacy Control</h2>
      <p>
        This site does not read or respond to the &ldquo;Do Not Track&rdquo; or Global Privacy
        Control browser signals. We do not sell or share personal information as defined by the
        CCPA/CPRA, so there is nothing for those signals to opt out of. You can control cookies
        through the consent banner and the Cookie Preferences link described above.
      </p>

      <h2>More information</h2>
      <p>
        For how we handle information generally, see our{' '}
        <Link href="/privacy-policy">Privacy Policy</Link>.
      </p>

      <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '2rem' }}>
        This policy is provided as a starting point and should be reviewed by the
        organization&rsquo;s advisors before being relied upon.
      </p>
    </PolicyPage>
  )
}
