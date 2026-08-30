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
    <PolicyPage title="Privacy Policy" lastUpdated="2026-08-30">
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
        We use cookies and similar technologies for analytics, governed by Google Consent Mode. In
        the European Economic Area, the United Kingdom, and Switzerland, Google Analytics runs
        cookie-free until you accept through the consent banner; everywhere else, including the
        United States, analytics cookies are set from your first pageview. Which rule applies to
        your visit is determined by Google from your IP address at the time of your visit; IP
        geolocation is approximate. You can change your choice at any time via the Cookie
        Preferences link in the footer — withdrawing consent deletes the tracking cookies this site
        set. See our <a href="/cookie-policy">Cookie Policy</a> for details.
      </p>

      <h2>How we use information</h2>
      <p>
        We use the information we collect to operate and improve the website, respond to inquiries,
        and coordinate adoptions and fostering. We do not sell your personal information.
      </p>

      <h2>Your rights in the European Union, United Kingdom, and EEA (GDPR)</h2>
      <p>
        If you visit from the European Union, the United Kingdom, or the wider European Economic
        Area, the EU General Data Protection Regulation (GDPR) or the UK GDPR applies to our
        handling of your personal data. We process personal data only with your consent (analytics
        and marketing cookies, as described above), on our legitimate interests in operating,
        securing, and improving this website, or where the law requires it. You have the right to:
        access the personal data we hold about you; have inaccurate data rectified; have your data
        erased; restrict or object to processing; receive your data in a portable format; and
        withdraw any consent you have given, at any time, without affecting the lawfulness of
        processing before withdrawal. To exercise these rights, contact us using the details in the
        Contact section below; we will respond within the time limits the GDPR sets. You also have
        the right to lodge a complaint with your national data protection supervisory authority (in
        the UK, the Information Commissioner&rsquo;s Office).
      </p>

      <h2>Your California privacy rights (CCPA/CPRA)</h2>
      <p>
        If you are a California resident, the California Consumer Privacy Act, as amended by the
        California Privacy Rights Act (CCPA/CPRA), gives you specific rights. We do not sell
        personal information, and do not share it for cross-context behavioral advertising, as those
        terms are defined by California law — and have not done so in the preceding 12 months. You
        have the right to know what personal information we collect, use, and disclose, and to
        access it; to delete personal information we collected from you; to correct inaccurate
        personal information; to opt out of any sale or sharing (not applicable, since we do
        neither); to limit the use of sensitive personal information; and not to be discriminated
        against for exercising any of these rights. This site does not read or respond to the Global
        Privacy Control or Do Not Track browser signals — we do not sell or share personal
        information, so there is nothing for those signals to opt out of. To submit a request, use
        the details in the Contact section below; we will respond within the timeframes California
        law requires.
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
