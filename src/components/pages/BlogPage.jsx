import HeroSection from '../shared/HeroSection'
import FadeUp from '../shared/FadeUp'
import LocaleLink from '../../i18n/LocaleLink'
import useT from '../../i18n/useT'
import useLang from '../../i18n/useLang'
import useSEO from '../../hooks/useSEO'
import { getSEO } from '../../data/seoData'
import { blogArticles } from '../../data/blogData'
import asset from '../../utils/basePath'

function formatDate(dateStr, lang) {
  try {
    return new Date(dateStr).toLocaleDateString(lang, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export default function BlogPage() {
  const t = useT()
  const { lang } = useLang()
  const seo = getSEO('blog', lang)
  useSEO({ ...seo, lang, path: 'blog', image: '/images/files/georgia-home.jpg' })

  return (
    <>
      <HeroSection image="/images/files/georgia-home.jpg" title={t('blog.heroTitle')} />
      <section className="page-items blog-listing">
        <FadeUp>
          <p className="blog-intro">{t('blog.intro')}</p>

          <div className="blog-grid">
            {blogArticles.map(article => (
              <LocaleLink
                key={article.slug}
                to={`/blog/${article.slug}`}
                className="blog-card"
              >
                <div className="blog-card__img-wrap">
                  <img
                    src={asset(article.thumbnail)}
                    alt={article.title}
                    className="blog-card__img"
                    loading="lazy"
                  />
                </div>
                <div className="blog-card__body">
                  <div className="blog-card__meta">
                    <span>{formatDate(article.date, lang)}</span>
                    <span>{t('blog.readTime').replace('{min}', article.readTime)}</span>
                  </div>
                  <h3 className="blog-card__title">{article.title}</h3>
                  <p className="blog-card__excerpt">{article.excerpt}</p>
                  <div className="blog-card__tags">
                    {article.tags.map(tag => (
                      <span key={tag} className="blog-card__tag">{tag}</span>
                    ))}
                  </div>
                  <span className="blog-card__read-more">{t('blog.readMore')}</span>
                </div>
              </LocaleLink>
            ))}
          </div>
        </FadeUp>
      </section>
    </>
  )
}
