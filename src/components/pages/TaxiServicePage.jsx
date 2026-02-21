import HeroSection from '../shared/HeroSection'
import FadeUp from '../shared/FadeUp'

export default function TaxiServicePage() {
  return (
    <>
      <HeroSection image="/images/files/taxi-service.jpg" title="Shuttle Service" />
      <section className="page-items taxi-service">
        <FadeUp>
          <p>Hikasus Travel offers private transfers from any city of Georgia, providing safe and convenient transportation in sedans, minivans, minibuses, and larger vehicles. Whether you're traveling from Tbilisi to Batumi, Yerevan (Armenia), Kutaisi, Kazbegi, or any other destination – or simply return – our professional drivers ensure a smooth and hassle-free journey. Ideal for solo travelers, families, and groups, our transfer services are comfortable, punctual, and competitively priced. Book your transfer today and explore Georgia with ease!</p>
        </FadeUp>
      </section>
    </>
  )
}
