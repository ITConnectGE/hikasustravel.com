import HeroSection from '../shared/HeroSection'
import FadeUp from '../shared/FadeUp'

export default function PrivacyPolicyPage() {
  return (
    <>
      <HeroSection image="/images/files/privacy.jpg" title="Privacy Policy" />
      <section className="page-items privacy-policy">
        <FadeUp>
          <p>Hikasus is committed to maintaining the privacy of personal information provided when using the Hikasus website. We collect personal information to deliver our services to you. This privacy policy outlines how we handle personal information when you visit www.hikasustravel.com or use our services.</p>
          <h3>Information We Collect</h3>
          <p>We use personally identifiable data solely for the services for which it was submitted. With your permission, we may also use your personal data for marketing purposes, which may include contacting you by email or telephone to offer our products and services. You will not receive any unlawful marketing or spam.</p>
          <h3>How We Use Your Personal Information</h3>
          <p>We use personally identifiable data solely for the services for which it was submitted. With your permission, we may also use your personal data for marketing purposes, which may include contacting you by email or telephone to offer our products and services. You will not receive any unlawful marketing or spam.</p>
          <h3>With Whom We Share Your Information</h3>
          <p>The primary purpose of collecting your personal information is to provide you with travel advice and assist with booking travel or other travel-related products and services. Information provided to Hikasus is kept secure, and we may disclose it to third parties only in accordance with personal data protection laws.</p>
          <h3>Links to Third Party Sites</h3>
          <p>Our website may include links to third-party websites. Clicking on these links may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy policies. We encourage you to read the privacy policy of every website you visit after leaving our site.</p>
          <h3>What is a Cookie?</h3>
          <p>Cookies are small text files placed on your computer by us or our partners. Cookies allow the website to identify the computer or device you are using to access websites. Our website does not use cookies.</p>
          <h3>How to Contact Hikasus</h3>
          <p>If you have any questions or would like more information about our privacy policy, please contact us via email at <a href="mailto:info@hikasustravel.com">info@hikasustravel.com</a>.</p>
        </FadeUp>
      </section>
    </>
  )
}
