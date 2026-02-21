import HeroSection from '../shared/HeroSection'
import FadeUp from '../shared/FadeUp'

export default function AboutGeorgiaPage() {
  return (
    <>
      <HeroSection image="/images/files/about-georgia.jpg" title="About Georgia" />
      <section className="page-items about-georgia">
        <FadeUp>
          <p>Georgia (Georgian: საქართველო, Sakartvelo) is a country located in the Caucasus region of Eurasia. Situated at the crossroads of Western Asia and Eastern Europe, it is bordered by the Black Sea to the west, Russia to the north, Turkey and Armenia to the south, and Azerbaijan to the southeast. The capital and largest city is Tbilisi.</p>
          <ul>
            <li><strong>Area:</strong> 69,700 km²</li>
            <li><strong>Time zone:</strong> UTC+4 (GET)</li>
            <li><strong>Currency:</strong> Georgian Lari (GEL)</li>
            <li><strong>Language:</strong> Georgian</li>
            <li><strong>Population:</strong> 3,717,000</li>
            <li><strong>Population density:</strong> 53 inhabitants per km²</li>
          </ul>
          <p>&nbsp;</p>
          <h3>Geography</h3>
          <p>Georgia is predominantly located in the South Caucasus, with some parts extending into the North Caucasus. The country lies between latitudes 41° and 44° N, and longitudes 40° and 47° E, covering an area of 67,900 km². Georgia is a mountainous country, with the Likhi Range dividing it into eastern and western halves.</p>
          <p>The Greater Caucasus Mountain Range forms Georgia's northern border, while the southern border is defined by the Lesser Caucasus Mountains. The highest peaks in Georgia include Mount Shkhara at 5,068 meters and Mount Janga at 5,059 meters above sea level. The landscape varies from the lowland marshes and temperate rainforests of western Georgia to the semi-arid plains of the east.</p>
          <h3>Gastronomy</h3>
          <p>Georgian cuisine is deeply rooted in the country's culture and has similarities with Persian and other Caucasian cuisines. The "supra" (feast) is a key social event, led by a "tamada" (toastmaster) who offers toasts and entertains guests.</p>
          <h3>Popular Dishes</h3>
          <ul>
            <li><strong>Khinkali:</strong> Dumplings typically filled with beef, pork, or lamb, and seasoned with herbs.</li>
            <li><strong>Khachapuri:</strong> A traditional cheese-filled bread with various regional variations.</li>
            <li><strong>Chikhirtma:</strong> A soup made from turkey or chicken and eggs.</li>
            <li><strong>Adjapsandali:</strong> A vegetable stew made with eggplants, potatoes, tomatoes, onions, and herbs.</li>
            <li><strong>Lobio:</strong> A kidney bean stew.</li>
            <li><strong>Mtsvadi:</strong> Meat cooked on an open flame.</li>
            <li><strong>Shkmeruli:</strong> Chicken in a creamy garlic sauce.</li>
          </ul>
          <p>&nbsp;</p>
          <h3>Wine</h3>
          <p>Georgia is one of the oldest wine-producing regions in the world, with winemaking traditions dating back over 8,000 years. The country's famous wine regions include Kakheti, Kartli, Imereti, Racha-Lechkhumi, Adjara, and Abkhazia. The traditional Georgian winemaking method using Kvevri clay jars has UNESCO recognition as part of the Intangible Cultural Heritage of Humanity.</p>
        </FadeUp>
      </section>
    </>
  )
}
