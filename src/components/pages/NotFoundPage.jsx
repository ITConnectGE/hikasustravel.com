import { Link } from 'react-router-dom'
import asset from '../../utils/basePath'

export default function NotFoundPage() {
  return (
    <>
      <section className="fullscreen coverme" style={{ backgroundImage: `url(${asset('/images/files/georgia-home.jpg')})` }}>
        <div className="hometop-item" style={{ flexDirection: 'column', gap: '24px' }}>
          <h1>Page Not Found</h1>
          <p style={{ color: 'var(--color-bg)', fontSize: '18px' }}>
            The page you're looking for doesn't exist.
          </p>
          <Link to="/" className="button" style={{ marginTop: '12px' }}>
            <p>Back to Home</p>
          </Link>
        </div>
      </section>
    </>
  )
}
