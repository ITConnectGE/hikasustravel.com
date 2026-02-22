import { contactInfo, footerLinks } from '../../data/siteData'
import useT from '../../i18n/useT'
import LocaleLink from '../../i18n/LocaleLink'

export default function Footer({ variant = 'default' }) {
  const isTaxi = variant === 'taxi'
  const t = useT()

  return (
    <footer className={isTaxi ? 'taxi-footer' : ''}>
      <h2>{t('footer.contactUs')}</h2>
      <p>{contactInfo.address}</p>
      <div className="footer-contacts">
        <div>{t('footer.belgium')} {contactInfo.phoneBelgium}</div>
        <div>{t('footer.georgia')} {contactInfo.phoneGeorgia}</div>
        <div>
          <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
        </div>
        <div>
          <a
            href={contactInfo.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="instagram"
          >
            {contactInfo.instagramHandle}
          </a>
        </div>
      </div>

      <nav className="footer-menu">
        {footerLinks.map((link) => (
          <LocaleLink key={link.to} to={link.to} title={t(link.labelKey)}>
            {t(link.labelKey)}
          </LocaleLink>
        ))}
      </nav>
    </footer>
  )
}
