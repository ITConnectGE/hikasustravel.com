import { useContext } from 'react'
import HeroSection from '../shared/HeroSection'
import FadeUp from '../shared/FadeUp'
import { I18nContext } from '../../i18n/I18nProvider'
import useT from '../../i18n/useT'
import useLang from '../../i18n/useLang'
import useSEO from '../../hooks/useSEO'
import { getSEO } from '../../data/seoData'

export default function ContactPage() {
  const { pages } = useContext(I18nContext)
  const t = useT()
  const { lang } = useLang()
  const page = pages.contact || {}
  const seo = getSEO('contact', lang)
  useSEO({ ...seo, lang, path: 'contact', image: '/images/files/contact-page.jpg' })

  return (
    <>
      <HeroSection image="/images/files/contact-page.jpg" title={page.heroTitle || t('contact.heroTitle')} />
      <section className="page-items contact">
        <FadeUp>
          <div className="contact-intro" dangerouslySetInnerHTML={{ __html: page.intro }} />

          <div className="contact-cards">
            <a href="mailto:info@hikasustravel.com" className="contact-card">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              <span className="contact-card__label">{t('contact.email')}</span>
              <span className="contact-card__value">info@hikasustravel.com</span>
            </a>

            <a href="tel:+3246832069​8" className="contact-card">
              <span className="contact-flag">🇧🇪</span>
              <span className="contact-card__label">{t('contact.belgiumOffice')}</span>
              <span className="contact-card__value">+32 468 32 06 98</span>
            </a>

            <a href="tel:+995551098077" className="contact-card">
              <span className="contact-flag">🇬🇪</span>
              <span className="contact-card__label">{t('contact.georgiaOffice')}</span>
              <span className="contact-card__value">+995 551 098 077</span>
            </a>
          </div>

          <p className="contact-reply">{t('contact.getBack')}</p>
        </FadeUp>
      </section>
    </>
  )
}
