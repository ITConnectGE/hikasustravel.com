import HeroSection from '../shared/HeroSection'
import Accordion from '../shared/Accordion'
import { faqItems } from '../../data/faqData'

export default function FaqPage() {
  return (
    <>
      <HeroSection image="/images/files/georgia-tour-14.jpg" title="Frequently Asked Questions" />
      <section className="page-items faq" id="faq-section">
        <Accordion items={faqItems} />
      </section>
    </>
  )
}
