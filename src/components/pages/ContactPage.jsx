import { useContext } from 'react'
import { useSearchParams } from 'react-router-dom'
import HeroSection from '../shared/HeroSection'
import FadeUp from '../shared/FadeUp'
import ContactForm from '../shared/ContactForm'
import { I18nContext } from '../../i18n/I18nContext'
import useT from '../../i18n/useT'
import useLang from '../../i18n/useLang'
import { useLinkedHtml } from '../../utils/autolinkReact'
import useSEO from '../../hooks/useSEO'
import { getSEO } from '../../data/seoData'
import { shuttleRoutes } from '../../data/shuttleData'
// Single source of truth for the phone numbers and email, shared with
// Footer.jsx. This page used to hand-type its own second copy, and an
// invisible character got into the hand-typed tel: href.
import { contactInfo } from '../../data/siteData'

export default function ContactPage() {
  const { pages } = useContext(I18nContext)
  const t = useT()
  const { lang } = useLang()
  const page = pages.contact || {}
  const linkedIntro = useLinkedHtml(page.intro)
  const seo = getSEO('contact', lang)
  useSEO({ ...seo, lang, path: 'contact', image: '/images/files/contact-page.jpg' })

  // Arriving from a shuttle route ("Request This Transfer"). Both names are
  // matched against the real route list before anything is written, so the
  // query string can only ever produce one of our own sentences about one of
  // our own routes — never arbitrary text in the message box.
  const [params] = useSearchParams()
  const from = params.get('from')
  const to = params.get('to')
  const knownRoute = from && to && shuttleRoutes.some((r) => r.start === from && r.stop === to)
  const initialMessage = knownRoute ? t('shuttle.transferRequest', { from, to }) : ''

  return (
    <>
      <HeroSection className="hero--compact" image="/images/files/contact-page.jpg" title={page.heroTitle || t('contact.heroTitle')} />
      <section className="page-items contact">
        <FadeUp>
          <div className="contact-intro" dangerouslySetInnerHTML={{ __html: linkedIntro }} />

          <div className="contact-cards">
            <a href={`mailto:${contactInfo.email}`} className="contact-card">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              <span className="contact-card__label">{t('contact.email')}</span>
              <span className="contact-card__value">{contactInfo.email}</span>
            </a>

            <a href={`tel:${contactInfo.phoneBelgium.replace(/\s/g, '')}`} className="contact-card">
              <span className="contact-flag">🇧🇪</span>
              <span className="contact-card__label">{t('contact.belgiumOffice')}</span>
              <span className="contact-card__value">{contactInfo.phoneBelgium}</span>
            </a>

            <a href={`tel:${contactInfo.phoneGeorgia.replace(/\s/g, '')}`} className="contact-card">
              <span className="contact-flag">🇬🇪</span>
              <span className="contact-card__label">{t('contact.georgiaOffice')}</span>
              <span className="contact-card__value">{contactInfo.phoneGeorgia}</span>
            </a>
          </div>

          <div className="td-book-inline">
            <h2 className="td-section__title">{t('contact.formTitle')}</h2>
            <ContactForm initialMessage={initialMessage} />
          </div>

          <p className="contact-reply">{t('contact.getBack')}</p>
        </FadeUp>
      </section>
    </>
  )
}
