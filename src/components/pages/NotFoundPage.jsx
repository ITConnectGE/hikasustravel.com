import asset from '../../utils/basePath'
import useT from '../../i18n/useT'
import LocaleLink from '../../i18n/LocaleLink'

export default function NotFoundPage() {
  const t = useT()

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
