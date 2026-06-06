import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import I18nProvider from './i18n/I18nProvider'
import Layout from './components/layout/Layout'
import HomePage from './components/pages/HomePage'
import AboutUsPage from './components/pages/AboutUsPage'
import AboutGeorgiaPage from './components/pages/AboutGeorgiaPage'
import CurrencyGuidePage from './components/pages/CurrencyGuidePage'
import VisaPage from './components/pages/VisaPage'
import LanguagesPage from './components/pages/LanguagesPage'
import DestinationsPage from './components/pages/DestinationsPage'
import { RegionsHubPage, CitiesHubPage, PlacesToVisitHubPage } from './components/pages/DestinationHubs'
import CityPage from './components/pages/CityPage'
import RegionPage from './components/pages/RegionPage'
import SitePage from './components/pages/SitePage'
import LegacyCityRedirect from './components/pages/LegacyCityRedirect'
import ThingsToDoTbilisiPage from './components/pages/ThingsToDoTbilisiPage'
import ThingsToDoAkhaltsikhePage from './components/pages/ThingsToDoAkhaltsikhePage'
import ThingsToDoAmbrolauriPage from './components/pages/ThingsToDoAmbrolauriPage'
import ThingsToDoBakurianiPage from './components/pages/ThingsToDoBakurianiPage'
import ThingsToDoBatumiPage from './components/pages/ThingsToDoBatumiPage'
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
          <Route path="destinations" element={<DestinationsPage />} />
          <Route path="destinations/regions" element={<RegionsHubPage />} />
          <Route path="destinations/cities" element={<CitiesHubPage />} />
          <Route path="destinations/places-to-visit" element={<PlacesToVisitHubPage />} />
          <Route path="destinations/cities/:citySlug" element={<CityPage />} />
          <Route path="destinations/cities/:citySlug/places-to-visit/:siteSlug" element={<SitePage />} />
          <Route path="destinations/regions/:regionSlug" element={<RegionPage />} />
          <Route path="destinations/regions/:regionSlug/places-to-visit/:siteSlug" element={<SitePage />} />
          {/* Legacy flat city URLs (e.g. /destinations/tbilisi) -> /destinations/cities/<city>.
              Static segments above outrank this dynamic one, so the hubs still resolve. */}
          <Route path="destinations/:legacyCitySlug" element={<LegacyCityRedirect />} />
          <Route path="things-to-do-in-tbilisi" element={<ThingsToDoTbilisiPage />} />
          <Route path="things-to-do-in-akhaltsikhe" element={<ThingsToDoAkhaltsikhePage />} />
          <Route path="things-to-do-in-ambrolauri" element={<ThingsToDoAmbrolauriPage />} />
          <Route path="things-to-do-in-bakuriani" element={<ThingsToDoBakurianiPage />} />
          <Route path="things-to-do-in-batumi" element={<ThingsToDoBatumiPage />} />
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
