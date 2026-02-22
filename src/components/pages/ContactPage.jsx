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
          <div dangerouslySetInnerHTML={{ __html: page.intro }} />
          <p>
            <strong>{t('contact.email')}</strong> <a href="mailto:info@hikasustravel.com">info@hikasustravel.com</a><br />
            <strong>{t('contact.belgiumOffice')}</strong> +32 468 32 06 98<br />
            <strong>{t('contact.georgiaOffice')}</strong> +995 551 098 077<br /><br />
            <strong>{t('contact.getBack')}</strong>
          </p>
        </FadeUp>
      </section>
    </>
  )
}
