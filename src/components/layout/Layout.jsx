import { useEffect } from 'react'
import { Outlet, useLocation, useParams } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import BackToTop from './BackToTop'
import ScrollToTop from './ScrollToTop'
import WhatsAppButton from './WhatsAppButton'

export default function Layout() {
  const location = useLocation()
  const { lang } = useParams()
  // Match /:lang/shuttle-service
  const isTaxiPage = /^\/[a-z]{2}\/shuttle-service$/.test(location.pathname)

  useEffect(() => {
    if (lang) document.documentElement.lang = lang
  }, [lang])

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
