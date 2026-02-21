import HeroSection from '../shared/HeroSection'
import FadeUp from '../shared/FadeUp'

export default function TermsPage() {
  return (
    <>
      <HeroSection image="/images/files/georgia-tour-13.jpg" title="Terms and Conditions" />
      <section className="page-items terms-and-conditions">
        <FadeUp>
          <p>The following booking conditions form the basis of your contract with Hikasus LTD. By requesting us to confirm your booking, we assume you have read and agree to these booking conditions.</p>
          <h3>Payment Terms</h3>
          <p>To secure a booking, a non-refundable deposit of 15% of the trip cost, with a minimum of €200, is required. The remaining balance must be paid no later than 30 days before the tour start date.</p>
          <h3>Payment Methods</h3>
          <p>Travellers can use the following methods of payment:</p>
          <ul>
            <li>Direct bank wire transfer</li>
            <li>Credit Card: Online payment via Visa or MasterCard</li>
          </ul>
          <h3>Cancellation Policy</h3>
          <p>If the tour is canceled by the traveler, the following charges will apply based on the cancellation date:</p>
          <ul>
            <li><strong>30 days or more before the tour date:</strong> Loss of deposit</li>
            <li><strong>15 days or more before the tour date:</strong> 50% of the tour cost</li>
            <li><strong>7 days or more before the tour date:</strong> 80% of the tour cost</li>
            <li><strong>Less than 7 days before the tour date:</strong> 100% of the tour cost</li>
          </ul>
        </FadeUp>
      </section>
    </>
  )
}
