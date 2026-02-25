import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import HeroSection from '../shared/HeroSection'
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

function tf(t, key, fallback) {
  const val = t(key)
  return val === key ? fallback : val
}

export default function BlogArticlePage() {
  const { slug } = useParams()
  const t = useT()
  const { lang } = useLang()
  const article = getBlogArticle(slug)
  const related = useMemo(() => article ? getRelatedArticles(slug) : [], [slug, article])

  const heroTitle = tf(t, 'blog.heroTitle', 'Travel Blog')
  const readTimeTemplate = tf(t, 'blog.readTime', '{min} min read')

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
        <HeroSection image="/images/files/georgia-home.jpg" title={heroTitle} />
        <section className="blog-article">
          <div className="blog-article__not-found">
            <h2>{tf(t, 'blog.articleNotFound', 'Article Not Found')}</h2>
            <p>{tf(t, 'blog.articleNotFoundText', "The article you're looking for doesn't exist.")}</p>
            <LocaleLink to="/blog" className="blog-back-link">
              {tf(t, 'blog.backToBlog', 'Back to Blog')}
            </LocaleLink>
          </div>
        </section>
      </>
    )
  }

  const articleTitle = tf(t, article.titleKey, article.title)

  return (
    <>
      <HeroSection image={article.heroImage} title={articleTitle} />
      <section className="blog-article">
        <nav className="blog-breadcrumb">
          <LocaleLink to="/">Home</LocaleLink>
          <span className="blog-breadcrumb__sep">/</span>
          <LocaleLink to="/blog">{heroTitle}</LocaleLink>
          <span className="blog-breadcrumb__sep">/</span>
          <span>{articleTitle}</span>
        </nav>

        <div className="blog-article__meta">
          <span>{article.author}</span>
          <span>{formatDate(article.date, lang)}</span>
          <span>{readTimeTemplate.replace('{min}', article.readTime)}</span>
        </div>

        <div className="blog-article__content" dangerouslySetInnerHTML={{ __html: article.content }} />

        <div className="blog-article__tags">
          {article.tags.map(tag => (
            <span key={tag} className="blog-item__tag">{tag}</span>
          ))}
        </div>

        <div className="blog-article__footer">
          <LocaleLink to="/blog" className="blog-back-link">
            {tf(t, 'blog.backToBlog', 'Back to Blog')}
          </LocaleLink>
        </div>
      </section>

      {related.length > 0 && (
        <section className="blog-article blog-related">
          <h2 className="blog-related__heading">
            {tf(t, 'blog.relatedArticles', 'Related Articles')}
          </h2>
          <div className="blog-related__grid">
            {related.map(r => {
              const relTitle = tf(t, r.titleKey, r.title)
              return (
                <LocaleLink key={r.slug} to={`/blog/${r.slug}`} className="blog-related__card">
                  <div className="blog-related__card-img-wrap">
                    <img src={asset(r.thumbnail)} alt={relTitle} className="blog-related__card-img" loading="lazy" />
                  </div>
                  <div className="blog-related__card-body">
                    <h3 className="blog-related__card-title">{relTitle}</h3>
                    <p className="blog-related__card-excerpt">{r.excerpt}</p>
                  </div>
                </LocaleLink>
              )
            })}
          </div>
        </section>
      )}
    </>
  )
}
