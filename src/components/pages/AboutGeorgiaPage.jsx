import { useContext, useRef, useEffect, useState, useCallback } from 'react'
import HeroSection from '../shared/HeroSection'
import FadeUp from '../shared/FadeUp'
import DishModal from '../shared/DishModal'
import { I18nContext } from '../../i18n/I18nProvider'
import useLang from '../../i18n/useLang'
import useSEO from '../../hooks/useSEO'
import { getSEO } from '../../data/seoData'
import dishData from '../../data/dishData'

export default function AboutGeorgiaPage() {
  const { pages } = useContext(I18nContext)
  const { lang } = useLang()
  const page = pages.aboutGeorgia || {}
  const seo = getSEO('aboutGeorgia', lang)
  useSEO({ ...seo, lang, path: 'about-georgia', image: '/images/files/about-georgia.jpg' })

  const contentRef = useRef(null)
  const [selectedDish, setSelectedDish] = useState(null)

  const closeDish = useCallback(() => setSelectedDish(null), [])

  useEffect(() => {
    const el = contentRef.current
    if (!el) return

    function handleClick(e) {
      const li = e.target.closest('li')
      if (!li || !el.contains(li)) return

      const img = li.querySelector('img')
      if (!img) return

      const src = img.getAttribute('src') || ''
      const match = src.match(/\/images\/dishes\/(.+)\.\w+$/)
      if (!match) return

      const slug = match[1]
      if (dishData[slug]) {
        setSelectedDish(dishData[slug])
      }
    }

    el.addEventListener('click', handleClick)
    return () => el.removeEventListener('click', handleClick)
  }, [])

  return (
    <>
      <HeroSection image="/images/files/about-georgia.jpg" title={page.heroTitle} />
      <section className="page-items about-georgia">
        <FadeUp>
          <div ref={contentRef} dangerouslySetInnerHTML={{ __html: page.content }} />
        </FadeUp>
      </section>
      {selectedDish && <DishModal dish={selectedDish} lang={lang} onClose={closeDish} />}
    </>
  )
}
