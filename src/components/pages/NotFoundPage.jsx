import asset from '../../utils/basePath'
import useT from '../../i18n/useT'
import useLang from '../../i18n/useLang'
import LocaleLink from '../../i18n/LocaleLink'
import useSEO from '../../hooks/useSEO'
import { getSEO } from '../../data/seoData'

export default function NotFoundPage() {
  const t = useT()
  const { lang } = useLang()
  const seo = getSEO('notFound', lang)
  useSEO({ ...seo, lang })

  return (
    <>
      <section className="fullscreen coverme" style={{ backgroundImage: `url(${asset('/images/files/georgia-home.jpg')})` }}>
        <div className="hometop-item" style={{ flexDirection: 'column', gap: '24px' }}>
          <h1>{t('notFound.title')}</h1>
          <p style={{ color: 'var(--color-bg)', fontSize: '18px' }}>
            {t('notFound.text')}
          </p>
          <LocaleLink to="/" className="button" style={{ marginTop: '12px' }}>
            <p>{t('notFound.backHome')}</p>
          </LocaleLink>
        </div>
      </section>
    </>
  )
}
