import type { Metadata } from 'next'
import PolicyPage from '@/components/policy-page'
import { siteConfig } from '@/lib/site.config'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${siteConfig.name} collects, uses, and protects information on this website.`,
  alternates: { canonical: '/privacy-policy' },
}

export default function Page() {
  return (
    <PolicyPage title="Privacy Policy" lastUpdated="2026-07-08">
      <p>
        {siteConfig.name} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates this
        website to share information about our cat rescue work and to help visitors adopt, foster,
        and support community cats. This policy explains what information we collect and how it is
        used.
      </p>

      <h2>Information we collect</h2>
      <p>
        This is primarily an informational website. We do not require you to create an account. When
        you visit, our analytics provider may collect standard, non-identifying usage data (such as
        pages viewed and general location) to help us understand how the site is used. If you submit
        a contact or application form, we receive the information you choose to provide so we can
        respond to you.
      </p>

      <h2>Cookies and analytics</h2>
      <p>
        We use cookies and similar technologies for analytics. You can accept or decline
        non-essential cookies using the consent banner shown on your first visit, and you can change
        your choice at any time. See our <a href="/cookie-policy">Cookie Policy</a> for details.
      </p>

      <h2>How we use information</h2>
      <p>
        We use the information we collect to operate and improve the website, respond to inquiries,
        and coordinate adoptions and fostering. We do not sell your personal information.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy? Write to us at {siteConfig.addresses[0].lines.join(', ')} or
        call {siteConfig.phone.display}.
      </p>

      <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '2rem' }}>
        This policy is provided as a starting point and should be reviewed by the
        organization&rsquo;s advisors before being relied upon.
      </p>
    </PolicyPage>
  )
}
