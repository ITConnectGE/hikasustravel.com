import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import BackToTop from './BackToTop'
import ScrollToTop from './ScrollToTop'

export default function Layout() {
  const location = useLocation()
  const isTaxiPage = location.pathname === '/taxi-service' || location.pathname === '/shuttle-service'

  return (
    <>
      <ScrollToTop />
      <Header variant={isTaxiPage ? 'taxi' : 'default'} />
      <main>
        <Outlet />
      </main>
      <BackToTop />
      <Footer variant={isTaxiPage ? 'taxi' : 'default'} />
    </>
  )
}
