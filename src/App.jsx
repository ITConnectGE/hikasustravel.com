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
import DestinationsPage from './components/pages/DestinationsPage'
import { RegionsHubPage, CitiesHubPage, PlacesToVisitHubPage } from './components/pages/DestinationHubs'
import CityPage from './components/pages/CityPage'
import RegionPage from './components/pages/RegionPage'
import SitePage from './components/pages/SitePage'
import CitySubPage from './components/pages/CitySubPage'
import BorderCrossingPage from './components/pages/BorderCrossingPage'
import { DestinationsRedirect, ThingsToDoRedirect } from './components/pages/LegacyRedirects'
import { cities } from './data/places'
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
          <Route path="georgia/regions/:regionSlug/:siteSlug" element={<SitePage />} />
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
          {cities
            .filter((c) => c.published && c.thingsToDo)
            .map((c) => (
              <Route
                key={c.slug}
                path={`things-to-do-in-${c.slug}`}
                element={<ThingsToDoRedirect citySlug={c.slug} />}
              />
            ))}
          <Route path="private-tours" element={<PrivateToursPage />} />
          <Route path="group-tours" element={<GroupToursPage />} />
          <Route path="private-tours/:slug" element={<TourDetailPage />} />
          <Route path="group-tours/:slug" element={<TourDetailPage />} />
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
