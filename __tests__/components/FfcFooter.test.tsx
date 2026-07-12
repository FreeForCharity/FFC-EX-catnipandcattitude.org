import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import FfcFooter from '../../src/components/ffc-footer'
import { siteConfig } from '../../src/lib/site.config'

expect.extend(toHaveNoViolations)

describe('FfcFooter component', () => {
  it('renders the charity identity with EIN, linked to the Candid profile', () => {
    render(<FfcFooter />)

    const identity = screen.getByText(`${siteConfig.name} — EIN ${siteConfig.ein}`)
    expect(identity).toBeInTheDocument()
    expect(identity.closest('a')).toHaveAttribute('href', siteConfig.guidestar.profileUrl)
  })

  it('always renders the "Supported by Free For Charity" attribution', () => {
    render(<FfcFooter />)

    expect(screen.getByText(/Supported by/)).toBeInTheDocument()
    const ffcLink = screen.getByRole('link', { name: 'Free For Charity' })
    expect(ffcLink).toHaveAttribute('href', 'https://freeforcharity.org')
  })

  it('links to the Supported Charity Login (FFC hub)', () => {
    render(<FfcFooter />)

    const hubLink = screen.getByRole('link', { name: 'Supported Charity Login' })
    expect(hubLink).toHaveAttribute('href', 'https://freeforcharity.org/hub/')
  })

  it('links to the policy pages', () => {
    render(<FfcFooter />)

    expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute(
      'href',
      '/privacy-policy'
    )
    expect(screen.getByRole('link', { name: 'Cookie Policy' })).toHaveAttribute(
      'href',
      '/cookie-policy'
    )
    expect(screen.getByRole('link', { name: 'Terms of Service' })).toHaveAttribute(
      'href',
      '/terms-of-service'
    )
  })

  it('renders the copyright line with the current year and charity name', () => {
    render(<FfcFooter />)

    const year = new Date().getFullYear()
    expect(
      screen.getByText(new RegExp(`© ${year} ${siteConfig.name}\\. All rights reserved\\.`))
    ).toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<FfcFooter />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
