import { Link } from 'react-router-dom'
import { contactInfo, footerLinks } from '../../data/siteData'

export default function Footer({ variant = 'default' }) {
  const isTaxi = variant === 'taxi'

  return (
    <footer className={isTaxi ? 'taxi-footer' : ''}>
      <h2>Contact Us</h2>
      <p>{contactInfo.address}</p>
      <div className="footer-contacts">
        <div>Belgium {contactInfo.phoneBelgium}</div>
        <div>Georgia {contactInfo.phoneGeorgia}</div>
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
          <Link key={link.to} to={link.to} title={link.title}>
            {link.label}
          </Link>
        ))}
      </nav>
    </footer>
  )
}
