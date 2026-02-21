import HeroSection from '../shared/HeroSection'
import FadeUp from '../shared/FadeUp'

export default function ContactPage() {
  return (
    <>
      <HeroSection image="/images/files/contact-page.jpg" title="Contact Us" />
      <section className="page-items contact">
        <FadeUp>
          <p>Ready to explore the wild beauty of Georgia's mountains? Whether you have a question, need help choosing a route, or want to plan a custom hiking tour, we're here for you.<br />Reach out anytime — our team of local experts is happy to guide you toward your next adventure.</p>
          <p>
            <strong>Email:</strong> <a href="mailto:info@hikasustravel.com">info@hikasustravel.com</a><br />
            <strong>Belgium office:</strong> +32 468 32 06 98<br />
            <strong>Georgia office:</strong> +995 551 098 077<br /><br />
            <strong>We'll get back to you as soon as possible.</strong>
          </p>
        </FadeUp>
      </section>
    </>
  )
}
