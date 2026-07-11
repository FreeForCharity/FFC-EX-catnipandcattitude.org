import { Open_Sans, Lato, Faustina } from 'next/font/google'

// Only the three font families actually used by the template are loaded:
//   - Open Sans  -> .aria-font / #header
//   - Lato       -> .lato-font (and Tailwind --font-sans)
//   - Faustina   -> body default / .faustina-font (and --font-serif-display)
// Earlier the template loaded eight families; the others (Raleway, Cantata
// One, Fauna One, Montserrat, Cinzel) were only referenced by components that
// have since been removed, so loading them just cost bytes and main-thread
// work. Add a family back here (and a matching CSS rule) if you start using it.
//
// preload:false — the cloned pages render their above-the-fold content in
// GoDaddy's own inline @font-face families (Raleway, Sacramento), so these
// three template families only style the FFC chrome (cookie consent, skip
// link, nav toggle) and the body default. Preloading them injected four
// high-priority woff2 <link>s (~104 KiB) that competed with the LCP hero
// image on the throttled connection and delayed it. With preload off they
// still load lazily via next/font's @font-face and swap in (display:swap),
// freeing the critical path for the hero image.
export const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-open-sans',
  weight: ['400', '500', '600', '700', '800'],
})

export const lato = Lato({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-lato',
  weight: ['400', '700'],
})

export const faustina = Faustina({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-faustina',
  weight: ['400', '500', '600', '700'],
})
