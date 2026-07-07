import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import I18nProvider from './i18n/I18nProvider'
import Layout from './components/layout/Layout'
import HomePage from './components/pages/HomePage'
import AboutUsPage from './components/pages/AboutUsPage'
import AboutGeorgiaPage from './components/pages/AboutGeorgiaPage'
import CurrencyGuidePage from './components/pages/CurrencyGuidePage'
import VisaPage from './components/pages/VisaPage'
import LanguagesPage from './components/pages/LanguagesPage'
import AirportGuidePage from './components/pages/AirportGuidePage'
import TbilisiAirportGuidePage from './components/pages/TbilisiAirportGuidePage'
import TbilisiMetroPage from './components/pages/TbilisiMetroPage'
import TbilisiRailwayStationPage from './components/pages/TbilisiRailwayStationPage'
import AbkhaziaPage from './components/pages/AbkhaziaPage'
import DestinationsPage from './components/pages/DestinationsPage'
import { RegionsHubPage, CitiesHubPage, PlacesToVisitHubPage } from './components/pages/DestinationHubs'
import CityPage from './components/pages/CityPage'
import RegionPage from './components/pages/RegionPage'
import CitySubPage from './components/pages/CitySubPage'
import BorderCrossingPage from './components/pages/BorderCrossingPage'
import { DestinationsRedirect, ThingsToDoRedirect, RegionSiteRedirect, TourSlugRedirect } from './components/pages/LegacyRedirects'
import { cities, regions } from './data/places'
import { tours } from './data/tours'
import PrivateToursPage from './components/pages/PrivateToursPage'
import GroupToursPage from './components/pages/GroupToursPage'
import TourDetailPage from './components/pages/TourDetailPage'
import FaqPage from './components/pages/FaqPage'
import ContactPage from './components/pages/ContactPage'
import ShuttleServicePage from './components/pages/ShuttleServicePage'
import PrivacyPolicyPage from './components/pages/PrivacyPolicyPage'
import TermsPage from './components/pages/TermsPage'
import EmbassiesPage from './components/pages/EmbassiesPage'
import BlogPage from './components/pages/BlogPage'
import BlogArticlePage from './components/pages/BlogArticlePage'
import NotFoundPage from './components/pages/NotFoundPage'

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
