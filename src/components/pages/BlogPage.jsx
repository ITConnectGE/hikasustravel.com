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

function tf(t, key, fallback) {
  const val = t(key)
  return val === key ? fallback : val
}

export default function BlogPage() {
  const t = useT()
  const { lang } = useLang()
  const seo = getSEO('blog', lang)
  useSEO({ ...seo, lang, path: 'blog', image: '/images/files/georgia-home.jpg' })

  const heroTitle = tf(t, 'blog.heroTitle', 'Travel Blog')
  const intro = tf(t, 'blog.intro', 'Insider tips, practical guides, and inspiring stories to help you plan your perfect Georgia adventure.')
  const readMore = tf(t, 'blog.readMore', 'Read Article')
  const readTimeTemplate = tf(t, 'blog.readTime', '{min} min read')

  return (
    <>
      <HeroSection image="/images/files/georgia-home.jpg" title={heroTitle} />
      <section className="page-items blog-listing">
        <nav className="blog-breadcrumb">
          <LocaleLink to="/">Home</LocaleLink>
          <span className="blog-breadcrumb__sep">/</span>
          <span>{heroTitle}</span>
        </nav>

        <FadeUp>
          <p className="blog-intro">{intro}</p>

          <div className="blog-list">
            {blogArticles.map(article => {
              const title = tf(t, article.titleKey, article.title)
              return (
                <LocaleLink
                  key={article.slug}
                  to={`/blog/${article.slug}`}
                  className="blog-item"
                >
                  <div className="blog-item__img-wrap">
                    <img
                      src={asset(article.thumbnail)}
                      alt={title}
                      className="blog-item__img"
                      loading="lazy"
                    />
                  </div>
                  <div className="blog-item__body">
                    <h3 className="blog-item__title">{title}</h3>
                    <div className="blog-item__meta">
                      <span>{formatDate(article.date, lang)}</span>
                      <span className="blog-item__meta-dot">·</span>
                      <span>{readTimeTemplate.replace('{min}', article.readTime)}</span>
                    </div>
                    <p className="blog-item__excerpt">{article.excerpt}</p>
                    <div className="blog-item__footer">
                      <div className="blog-item__tags">
                        {article.tags.map(tag => (
                          <span key={tag} className="blog-item__tag">{tag}</span>
                        ))}
                      </div>
                      <span className="blog-item__read-more">{readMore} →</span>
                    </div>
                  </div>
                </LocaleLink>
              )
            })}
          </div>
        </FadeUp>
      </section>
    </>
  )
}
