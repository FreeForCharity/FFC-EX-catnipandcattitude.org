import Link from 'next/link'
import { siteConfig } from '@/lib/site.config'

/**
 * FFC-standard attribution footer, rendered site-wide below the cloned page
 * chrome (the cloned pages keep their own visual footer; this strip carries
 * the Free For Charity program attribution and the legal/policy links).
 *
 * Gate-3 checklist items covered here:
 *   1. Charity identity — name + EIN, linked to the Candid transparency profile.
 *   2. Permanent "Supported by Free For Charity" attribution (always rendered —
 *      intentionally hardcoded rather than driven by an optional config field).
 *   3. "Supported Charity Login" link to the FFC hub.
 *   4. Copyright line with the build year and the charity's name.
 *   5. Policy links (privacy / cookie / terms).
 *
 * Styles live in globals.css under `.ffc-footer*` so they sit alongside the
 * other FFC add-on styles (.ffc-contact-*, .skip-to-content).
 */
export default function FfcFooter() {
  const year = new Date().getFullYear()
  const policyLinks = [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Cookie Policy', href: '/cookie-policy' },
    { name: 'Terms of Service', href: '/terms-of-service' },
  ]
  return (
    <footer className="ffc-footer" aria-label="Site information and policies">
      <div className="ffc-footer__inner">
        <p className="ffc-footer__identity">
          {siteConfig.guidestar.profileUrl ? (
            <a
              href={siteConfig.guidestar.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View the ${siteConfig.name} nonprofit profile on Candid`}
            >
              {siteConfig.name} — EIN {siteConfig.ein}
            </a>
          ) : (
            <>
              {siteConfig.name} — EIN {siteConfig.ein}
            </>
          )}
        </p>

        <ul className="ffc-footer__links">
          {policyLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.name}</Link>
            </li>
          ))}
          <li>
            <a href="https://freeforcharity.org/hub/" target="_blank" rel="noopener noreferrer">
              Supported Charity Login
            </a>
          </li>
        </ul>

        <p className="ffc-footer__legal">
          © {year} {siteConfig.name}. All rights reserved. Supported by{' '}
          <a href="https://freeforcharity.org" target="_blank" rel="noopener noreferrer">
            Free For Charity
          </a>
          .
        </p>
      </div>
    </footer>
  )
}
