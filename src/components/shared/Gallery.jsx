import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'

export default function Gallery({ images }) {
  if (!images || images.length === 0) return null

  return (
    <section id="gallery">
      <div id="gallery-holder">
        <Swiper
          modules={[Navigation]}
          navigation
          loop={images.length > 1}
          className="gallery-swiper"
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <img src={img.src} alt={img.caption ? img.caption.replace(/<[^>]*>/g, '') : `Gallery image ${index + 1}`} />
              {img.caption && (
                <div className="gallery-caption" dangerouslySetInnerHTML={{ __html: img.caption }} />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
