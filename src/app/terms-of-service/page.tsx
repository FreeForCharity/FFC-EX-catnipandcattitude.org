import type { Metadata } from 'next'
import PolicyPage from '@/components/policy-page'
import { siteConfig } from '@/lib/site.config'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `Terms of Service for the ${siteConfig.name} website.`,
  alternates: { canonical: '/terms-of-service' },
}

export default function Page() {
  return (
    <PolicyPage title="Terms of Service" lastUpdated="2026-07-11">
      <p>
        Welcome to {siteConfig.name}! These Terms of Service (&ldquo;Terms&rdquo;) govern your
        access to and use of this website (the &ldquo;Site&rdquo;), operated by {siteConfig.name}{' '}
        (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), a 501(c)(3) nonprofit
        organization (EIN {siteConfig.ein}). By accessing or using the Site, you agree to be bound
        by these Terms. If you do not agree to these Terms, please do not use the Site.
      </p>

      <h2>Use of the Site</h2>
      <p>
        The Site provides information about our cat rescue work — adoptions, fostering,
        trap-neuter-return (TNR), and ways to support community cats. You agree not to use the Site
        for any unlawful purpose or in any way that could harm, disable, overburden, or impair the
        Site, including transmitting any harmful or malicious code or interfering with the
        Site&rsquo;s operation.
      </p>

      <h2>Donations</h2>
      <p>
        Donations made through the Site are processed by third-party providers (such as Zeffy) and
        are voluntary and non-refundable. Donations to {siteConfig.name} may be tax-deductible to
        the extent permitted by law; please consult your tax advisor.
      </p>

      <h2>Intellectual property</h2>
      <p>
        All content, names, logos, and photographs on the Site are the property of {siteConfig.name}{' '}
        or their respective owners. You agree not to reproduce, distribute, or create derivative
        works from Site content without our express written consent.
      </p>

      <h2>Third-party links and services</h2>
      <p>
        The Site may link to or embed third-party websites and services (donation forms, social
        media, mapping services) that we do not control. We are not responsible for the content,
        privacy practices, or availability of any third-party websites or services.
      </p>

      <h2>Privacy</h2>
      <p>
        Your privacy is important to us. Please review our{' '}
        <a href="/privacy-policy">Privacy Policy</a> and <a href="/cookie-policy">Cookie Policy</a>,
        which describe how information is collected and used on the Site.
      </p>

      <h2>Disclaimer of warranties</h2>
      <p>
        The Site is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. We make
        no representations or warranties of any kind, express or implied, regarding the Site&rsquo;s
        accuracy, reliability, or availability, and we disclaim all implied warranties, including
        merchantability, fitness for a particular purpose, and non-infringement.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, {siteConfig.name} shall not be liable for any
        indirect, incidental, special, consequential, or punitive damages arising out of or in
        connection with your use of, or inability to use, the Site.
      </p>

      <h2>Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. Changes take effect when posted on this page,
        and the &ldquo;Last updated&rdquo; date above will reflect the most recent revision. Your
        continued use of the Site after changes are posted constitutes acceptance of the revised
        Terms.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these Terms? Write to us at {siteConfig.addresses[0].lines.join(', ')} or
        call {siteConfig.phone.display}.
      </p>

      <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '2rem' }}>
        These terms are provided as a starting point and should be reviewed by the
        organization&rsquo;s advisors before being relied upon.
      </p>
    </PolicyPage>
  )
}
