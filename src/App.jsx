import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import I18nProvider from './i18n/I18nProvider'
import Layout from './components/layout/Layout'
import HomePage from './components/pages/HomePage'
import AboutUsPage from './components/pages/AboutUsPage'
import AboutGeorgiaPage from './components/pages/AboutGeorgiaPage'
import PrivateToursPage from './components/pages/PrivateToursPage'
import GroupToursPage from './components/pages/GroupToursPage'
import TourDetailPage from './components/pages/TourDetailPage'
import FaqPage from './components/pages/FaqPage'
import ContactPage from './components/pages/ContactPage'
import ShuttleServicePage from './components/pages/ShuttleServicePage'
import TaxiServicePage from './components/pages/TaxiServicePage'
import PrivacyPolicyPage from './components/pages/PrivacyPolicyPage'
import TermsPage from './components/pages/TermsPage'
import NotFoundPage from './components/pages/NotFoundPage'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/en" replace />} />
        <Route path="/:lang" element={<I18nProvider><Layout /></I18nProvider>}>
          <Route index element={<HomePage />} />
          <Route path="about-us" element={<AboutUsPage />} />
          <Route path="about-georgia" element={<AboutGeorgiaPage />} />
          <Route path="private-tours" element={<PrivateToursPage />} />
          <Route path="group-tours" element={<GroupToursPage />} />
          <Route path="private-tours/:slug" element={<TourDetailPage />} />
          <Route path="group-tours/:slug" element={<TourDetailPage />} />
          <Route path="shuttle-service" element={<ShuttleServicePage />} />
          <Route path="taxi-service" element={<TaxiServicePage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="terms-and-conditions" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
