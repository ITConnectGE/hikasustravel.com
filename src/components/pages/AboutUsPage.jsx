import HeroSection from '../shared/HeroSection'
import FadeUp from '../shared/FadeUp'

export default function AboutUsPage() {
  return (
    <>
      <HeroSection image="/images/files/about-us.jpg" title="About us" />
      <section className="page-items about-us">
        <FadeUp>
          <p>Founded in 2024, <strong>Hikasus Travel</strong> is a premier travel agency specializing in both private and group tours across Georgia. With a deep passion for the country's stunning landscapes, rich heritage, and vibrant cultural experiences, we craft personalized journeys that bring Georgia's beauty to life. Whether you're seeking adventure, relaxation, or a taste of history, we design unforgettable tours tailored to your unique interests. Join us for an immersive travel experience that goes beyond the ordinary.</p>
          <h3>What We Offer</h3>
          <p>At <strong>Hikasus Travel</strong>, in tours in Georgia, tours to the Caucasus, and beyond, we offer personalized itineraries, ensuring every journey is rich in adventure, comfort, and authenticity. Choose us for unforgettable adventures, starting from Tbilisi!</p>
          <h3>Our Commitment</h3>
          <p>At <strong>Hikasus</strong>, we're passionate about providing unparalleled service and crafting unforgettable travel experiences. Our meticulous attention to detail and personalized itineraries ensure that each journey is unique and memorable.</p>
          <p>Embark on an unforgettable journey through Georgia with Hikasus. Contact us today to start planning your next adventure and explore the breathtaking beauty and rich culture of this incredible destination.</p>
        </FadeUp>
      </section>
    </>
  )
}
