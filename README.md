# Hikasus Travel - Discover Georgia

A multilingual travel agency website for **Hikasus Travel**, showcasing private and group tours across Georgia, shuttle/taxi transfer services, and comprehensive travel information.

**Live site:** [hikasustravel.com](https://www.hikasustravel.com)

## Tech Stack

- **React 19** with **Vite 7** for fast development and optimized builds
- **React Router 7** (HashRouter) with language-prefixed routes (`/#/en/...`)
- **Mapbox GL** for interactive tour route maps
- **Swiper** for hero carousels and testimonials
- **Custom i18n system** — no external library, lightweight context-based translations
- **Custom SEO hook** — dynamic meta tags, Open Graph, Twitter Cards, and JSON-LD structured data without react-helmet

## Features

### Tours
- **16 tours** (1 group + 15 private) with detailed itineraries, pricing grids, accommodation options, and interactive route maps
- **Photo gallery cards** with location names, descriptions, and day-of-tour badges
- Tour search and sorting on the private tours listing page
- Booking inquiry form on every tour detail page

### Multilingual Support
7 languages with full translation coverage:
- English, Spanish, French, German, Polish, Czech, Dutch
- Lazy-loaded tour translations to minimize initial bundle size
- URL-based language switching (`/#/en/`, `/#/es/`, `/#/fr/`, etc.)

### SEO
- Dynamic per-page `<title>`, meta description, canonical URL, Open Graph, and Twitter Card tags
- **TravelAgency** JSON-LD schema on every page (static in index.html)
- **TouristTrip** JSON-LD on tour detail pages with full itinerary and gallery images
- **FAQPage** JSON-LD on the FAQ page for Google rich results
- Auto-generated **sitemap.xml** (189 URLs across all languages and pages)
- **robots.txt** allowing all crawlers
- `document.documentElement.lang` syncs with the active language

### Shuttle & Taxi Services
- Interactive route calculator with pricing for sedan, minivan, and minibus
- Filter by origin/destination across 20+ routes
- Dedicated taxi service page

### UI/UX
- Responsive design (desktop, tablet, mobile)
- Blur-up progressive image loading
- Scroll-triggered fade-up animations
- Back-to-top button
- WhatsApp floating contact button
- Sticky section navigation on tour detail pages

## Project Structure

```
src/
  App.jsx                          # Router setup with HashRouter
  main.jsx                         # Entry point
  components/
    layout/
      Layout.jsx                   # App shell (Header, Footer, lang sync)
      Header.jsx                   # Navigation with language switcher
      Footer.jsx                   # Multi-column footer
      ScrollToTop.jsx              # Scroll restoration on navigation
      BackToTop.jsx                # Scroll-to-top button
      WhatsAppButton.jsx           # Floating WhatsApp CTA
    pages/
      HomePage.jsx                 # Hero, tour grid, shuttle info, map
      AboutUsPage.jsx              # Company information
      AboutGeorgiaPage.jsx         # Country travel guide
      PrivateToursPage.jsx         # Tour listing with search/sort
      GroupToursPage.jsx           # Group tour listing with dates
      TourDetailPage.jsx           # Full tour detail (itinerary, pricing, gallery, map, form)
      ShuttleServicePage.jsx       # Shuttle route calculator
      TaxiServicePage.jsx          # Taxi service info
      FaqPage.jsx                  # FAQ accordion with JSON-LD
      ContactPage.jsx              # Contact info and form
      PrivacyPolicyPage.jsx        # Privacy policy
      TermsPage.jsx                # Terms and conditions
      NotFoundPage.jsx             # 404 page
    shared/                        # Reusable components (Gallery, Accordion, MapboxMap, etc.)
  data/
    tours.js                       # All 16 tours with itineraries, pricing, galleries, maps
    siteData.js                    # Navigation links, contact info
    seoData.js                     # Per-page SEO metadata in 7 languages
    faqData.js                     # FAQ questions and answers
    shuttleData.js                 # Shuttle routes and pricing
    testimonials.js                # Customer testimonials
  hooks/
    useSEO.js                      # Dynamic meta tags, OG, Twitter, JSON-LD
    useScrollPosition.js           # Scroll position tracking
    useIntersectionObserver.js     # Intersection observer for animations
  i18n/
    I18nProvider.jsx               # Language context provider
    useT.js                        # Translation hook with interpolation
    useLang.js                     # Current language hook
    LocaleLink.jsx                 # Language-aware Link component
    languages.js                   # Supported language definitions
    locales/{lang}/                # Translation files (ui.json, pages.json, faq.json, tours.json)
  utils/
    basePath.js                    # Asset URL helper for Vite base path
  assets/
    css/styles.css                 # All styles (single CSS file)
    img/                           # SVG icons and logos
public/
  images/files/                    # Tour photos and page images
  robots.txt                       # Crawler directives
  sitemap.xml                      # Auto-generated sitemap (189 URLs)
scripts/
  generate-sitemap.js              # Build-time sitemap generator
  generate-thumbnails.js           # Image thumbnail generator (sharp)
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

The build command automatically generates the sitemap before compiling:

```bash
npm run build
```

This runs `node scripts/generate-sitemap.js && vite build`, producing a `dist/` folder ready for deployment.

### Generate Sitemap Only

```bash
node scripts/generate-sitemap.js
```

Outputs `public/sitemap.xml` with all hash URLs (7 languages x 27 pages = 189 URLs).

### Generate Thumbnails

```bash
npm run generate-thumbs
```

## Environment

No environment variables are required for the base site. Mapbox GL uses a public token embedded in the component.

## Deployment

The site is a static SPA. Deploy the `dist/` folder to any static hosting provider (GitHub Pages, Netlify, Vercel, etc.). The HashRouter ensures all routes work without server-side configuration.

## License

Private project - All rights reserved.
