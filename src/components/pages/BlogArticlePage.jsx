import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import HeroSection from '../shared/HeroSection'
import FadeUp from '../shared/FadeUp'
import LocaleLink from '../../i18n/LocaleLink'
import useT from '../../i18n/useT'
import useLang from '../../i18n/useLang'
import useSEO from '../../hooks/useSEO'
import { getBlogArticle, getRelatedArticles } from '../../data/blogData'
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

export default function BlogArticlePage() {
  const { slug } = useParams()
  const t = useT()
  const { lang } = useLang()
  const article = getBlogArticle(slug)
  const related = useMemo(() => article ? getRelatedArticles(slug) : [], [slug, article])

  const jsonLd = useMemo(() => article ? {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    author: { '@type': 'Organization', name: article.author },
    datePublished: article.date,
    image: `https://www.hikasustravel.com${article.heroImage}`,
    publisher: {
      '@type': 'Organization',
      name: 'Hikasus Travel',
      url: 'https://www.hikasustravel.com',
    },
  } : null, [article])

  useSEO(article ? {
    title: `${article.title} | Hikasus Travel Blog`,
    description: article.excerpt,
    lang,
    path: `blog/${slug}`,
    image: article.heroImage,
    jsonLd,
  } : { title: 'Blog — Hikasus Travel', lang, path: 'blog' })

  if (!article) {
    return (
      <>
        <HeroSection image="/images/files/georgia-home.jpg" title={t('blog.heroTitle')} />
        <section className="page-items">
          <FadeUp>
            <h2>{t('blog.articleNotFound')}</h2>
            <p>{t('blog.articleNotFoundText')}</p>
            <LocaleLink to="/blog" className="blog-back-link">{t('blog.backToBlog')}</LocaleLink>
          </FadeUp>
        </section>
      </>
    )
  }

  return (
    <>
      <HeroSection image={article.heroImage} title={article.title} />
      <section className="page-items blog-article">
        <FadeUp>
          <div className="blog-article__meta">
            <span>{article.author}</span>
            <span>{formatDate(article.date, lang)}</span>
            <span>{t('blog.readTime').replace('{min}', article.readTime)}</span>
          </div>

          <div className="blog-article__content" dangerouslySetInnerHTML={{ __html: article.content }} />

          <div className="blog-article__tags">
            {article.tags.map(tag => (
              <span key={tag} className="blog-card__tag">{tag}</span>
            ))}
          </div>

          <div className="blog-article__footer">
            <LocaleLink to="/blog" className="blog-back-link">{t('blog.backToBlog')}</LocaleLink>
          </div>
        </FadeUp>
      </section>

      {related.length > 0 && (
        <section className="page-items blog-related">
          <FadeUp>
            <h2>{t('blog.relatedArticles')}</h2>
            <div className="blog-grid">
              {related.map(r => (
                <LocaleLink key={r.slug} to={`/blog/${r.slug}`} className="blog-card">
                  <div className="blog-card__img-wrap">
                    <img src={asset(r.thumbnail)} alt={r.title} className="blog-card__img" loading="lazy" />
                  </div>
                  <div className="blog-card__body">
                    <h3 className="blog-card__title">{r.title}</h3>
                    <p className="blog-card__excerpt">{r.excerpt}</p>
                  </div>
                </LocaleLink>
              ))}
            </div>
          </FadeUp>
        </section>
      )}
    </>
  )
}
