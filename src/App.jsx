import { lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import I18nProvider from './i18n/I18nProvider'
import Layout from './components/layout/Layout'
import { cities, regions } from './data/places'
import { tours } from './data/tours'

// Every page is code-split: a route now downloads its own component (and any
// data module only it needs — blog articles, dish data, embassy records) rather
// than all ~30 pages arriving in the entry bundle. Layout renders the Suspense
// boundary, so the header and footer stay put while a chunk loads.
//
// `places` and `tours` stay eagerly imported above because the route table
// itself is generated from them (legacy things-to-do URLs and renamed tour
// slugs), so they are needed before any route can match.
const HomePage = lazy(() => import('./components/pages/HomePage'))
const AboutUsPage = lazy(() => import('./components/pages/AboutUsPage'))
const AboutGeorgiaPage = lazy(() => import('./components/pages/AboutGeorgiaPage'))
const CurrencyGuidePage = lazy(() => import('./components/pages/CurrencyGuidePage'))
const VisaPage = lazy(() => import('./components/pages/VisaPage'))
const LanguagesPage = lazy(() => import('./components/pages/LanguagesPage'))
const AirportGuidePage = lazy(() => import('./components/pages/AirportGuidePage'))
const TbilisiAirportGuidePage = lazy(() => import('./components/pages/TbilisiAirportGuidePage'))
const TbilisiMetroPage = lazy(() => import('./components/pages/TbilisiMetroPage'))
const TbilisiRailwayStationPage = lazy(() => import('./components/pages/TbilisiRailwayStationPage'))
const AbkhaziaPage = lazy(() => import('./components/pages/AbkhaziaPage'))
const DestinationsPage = lazy(() => import('./components/pages/DestinationsPage'))
// Named exports need unwrapping — React.lazy resolves the `default` binding.
const RegionsHubPage = lazy(() => import('./components/pages/DestinationHubs').then((m) => ({ default: m.RegionsHubPage })))
const CitiesHubPage = lazy(() => import('./components/pages/DestinationHubs').then((m) => ({ default: m.CitiesHubPage })))
const PlacesToVisitHubPage = lazy(() => import('./components/pages/DestinationHubs').then((m) => ({ default: m.PlacesToVisitHubPage })))
const CityPage = lazy(() => import('./components/pages/CityPage'))
const RegionPage = lazy(() => import('./components/pages/RegionPage'))
const CitySubPage = lazy(() => import('./components/pages/CitySubPage'))
const BorderCrossingPage = lazy(() => import('./components/pages/BorderCrossingPage'))
const DestinationsRedirect = lazy(() => import('./components/pages/LegacyRedirects').then((m) => ({ default: m.DestinationsRedirect })))
const ThingsToDoRedirect = lazy(() => import('./components/pages/LegacyRedirects').then((m) => ({ default: m.ThingsToDoRedirect })))
const RegionSiteRedirect = lazy(() => import('./components/pages/LegacyRedirects').then((m) => ({ default: m.RegionSiteRedirect })))
const TourSlugRedirect = lazy(() => import('./components/pages/LegacyRedirects').then((m) => ({ default: m.TourSlugRedirect })))
const PrivateToursPage = lazy(() => import('./components/pages/PrivateToursPage'))
const GroupToursPage = lazy(() => import('./components/pages/GroupToursPage'))
const TourDetailPage = lazy(() => import('./components/pages/TourDetailPage'))
const EntityToursPage = lazy(() => import('./components/pages/EntityToursPage'))
const FaqPage = lazy(() => import('./components/pages/FaqPage'))
const ContactPage = lazy(() => import('./components/pages/ContactPage'))
const ShuttleServicePage = lazy(() => import('./components/pages/ShuttleServicePage'))
const PrivacyPolicyPage = lazy(() => import('./components/pages/PrivacyPolicyPage'))
const TermsPage = lazy(() => import('./components/pages/TermsPage'))
const EmbassiesPage = lazy(() => import('./components/pages/EmbassiesPage'))
const BlogPage = lazy(() => import('./components/pages/BlogPage'))
const BlogArticlePage = lazy(() => import('./components/pages/BlogArticlePage'))
const NotFoundPage = lazy(() => import('./components/pages/NotFoundPage'))

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/en" replace />} />
        <Route path="/:lang" element={<I18nProvider><Layout /></I18nProvider>}>
          <Route index element={<HomePage />} />
          <Route path="about-us" element={<AboutUsPage />} />
          <Route path="about-georgia" element={<AboutGeorgiaPage />} />
          <Route path="georgian-lari-currency-guide" element={<CurrencyGuidePage />} />
          <Route path="georgia-visa-entry-requirements" element={<VisaPage />} />
          <Route path="languages-of-georgia" element={<LanguagesPage />} />
          <Route path="kutaisi-international-airport" element={<AirportGuidePage />} />
          <Route path="tbilisi-international-airport" element={<TbilisiAirportGuidePage />} />
          <Route path="tbilisi-metro" element={<TbilisiMetroPage />} />
          <Route path="tbilisi-railway-station" element={<TbilisiRailwayStationPage />} />
          <Route path="abkhazia" element={<AbkhaziaPage />} />
          {/* Georgia destinations tree. Static segments (regions/cities/
              places-to-visit) outrank the dynamic :citySlug, so hubs resolve. */}
          <Route path="georgia" element={<DestinationsPage />} />
          <Route path="georgia/regions" element={<RegionsHubPage />} />
          <Route path="georgia/cities" element={<CitiesHubPage />} />
          <Route path="georgia/places-to-visit" element={<PlacesToVisitHubPage />} />
          {/* Border crossings: a static index (the complete guide) + individual
              crossings. Both static-first segments outrank the dynamic
              :citySlug / :citySlug/:ttd routes, so they resolve cleanly. */}
          <Route path="georgia/border-crossings" element={<BorderCrossingPage overview />} />
          <Route path="georgia/border-crossings/:borderSlug" element={<BorderCrossingPage />} />
          <Route path="georgia/regions/:regionSlug" element={<RegionPage />} />
          {/* Region-parented Places to Visit moved to /georgia/<region>/<slug>
              (handled by the :citySlug/:sub dispatcher below). The old
              /regions/<region>/<slug> URL now 301-redirects to the new one. */}
          <Route path="georgia/regions/:regionSlug/:siteSlug" element={<RegionSiteRedirect />} />
          <Route path="georgia/:citySlug" element={<CityPage />} />
          {/* /georgia/<city>/<sub> — one dynamic route shared by the city's
              things-to-do guide (sub === things-to-do-in-<city>) and its tourist
              sites (sub === a city-parented site slug). CitySubPage dispatches
              between them and 404s otherwise. */}
          <Route path="georgia/:citySlug/:sub" element={<CitySubPage />} />
          {/* Legacy URL redirects -> their new /georgia home (mirror the static
              redirect stubs emitted by scripts/prerender.js). */}
          <Route path="destinations/*" element={<DestinationsRedirect />} />
          <Route path="destinations" element={<DestinationsRedirect />} />
          {[...cities, ...regions]
            .filter((p) => p.published && p.thingsToDo)
            .map((p) => (
              <Route
                key={p.slug}
                path={`things-to-do-in-${p.slug}`}
                element={<ThingsToDoRedirect citySlug={p.slug} />}
              />
            ))}
          <Route path="private-tours" element={<PrivateToursPage />} />
          <Route path="group-tours" element={<GroupToursPage />} />
          <Route path="private-tours/:slug" element={<TourDetailPage />} />
          <Route path="group-tours/:slug" element={<TourDetailPage />} />
          {/* Destination/attraction tour listings: /:lang/tours/<entity>-tours */}
          <Route path="tours/:slug" element={<EntityToursPage />} />
          {/* Renamed tour slugs: the old URL 301-redirects to the new canonical
              slug (mirrors the static stubs in scripts/prerender.js). The static
              path outranks the dynamic :slug route above. */}
          {tours
            .flatMap((tr) => {
              const prefix = tr.type === 'group' ? 'group-tours' : 'private-tours'
              // Merge single `formerSlug` and multi `formerSlugs` into one list
              // so a tour renamed more than once redirects every old URL.
              const formers = [
                ...(tr.formerSlug ? [tr.formerSlug] : []),
                ...(tr.formerSlugs || []),
              ]
              return formers.map((former) => (
                <Route
                  key={`${prefix}/${former}`}
                  path={`${prefix}/${former}`}
                  element={<TourSlugRedirect prefix={prefix} newSlug={tr.slug} />}
                />
              ))
            })}
          <Route path="shuttle-service" element={<ShuttleServicePage />} />
          <Route path="embassies" element={<EmbassiesPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:slug" element={<BlogArticlePage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="terms-and-conditions" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
