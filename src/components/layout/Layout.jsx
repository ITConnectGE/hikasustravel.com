import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import BackToTop from './BackToTop'
import ScrollToTop from './ScrollToTop'
import WhatsAppButton from './WhatsAppButton'

export default function Layout() {
  const location = useLocation()
  // Match /:lang/taxi-service or /:lang/shuttle-service
  const isTaxiPage = /^\/[a-z]{2}\/(taxi-service|shuttle-service)$/.test(location.pathname)

  return (
    <>
      <ScrollToTop />
      <Header variant={isTaxiPage ? 'taxi' : 'default'} />
      <main>
        <Outlet />
      </main>
      <BackToTop />
      <WhatsAppButton />
      <Footer variant={isTaxiPage ? 'taxi' : 'default'} />
    </>
  )
}
