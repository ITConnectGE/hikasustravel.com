import { useState } from 'react'
import useT from '../../i18n/useT'

export default function TourInquiryForm({ tourTitle, isGroupTour = false }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    travelers: '',
    startDate: '',
    endDate: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState([])
  const t = useT()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = []
    if (!formData.name.trim()) newErrors.push(t('form.errors.name'))
    if (!formData.email.trim()) newErrors.push(t('form.errors.email'))
    if (!formData.travelers) newErrors.push(t('form.errors.travelers'))

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    // In a real app, this would POST to a backend
    setSubmitted(true)
    setErrors([])
  }

  if (submitted) {
    return (
      <div className="td-form__success">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-h3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <h3>{t('form.thankYou')}</h3>
        <p>{t('form.thankYouText', { tour: tourTitle })}</p>
      </div>
    )
  }

  return (
    <form className="td-form" onSubmit={handleSubmit} noValidate>
      <input type="hidden" name="tour_title" value={tourTitle} />

      {errors.length > 0 && (
        <div className="td-form__errors" role="alert">
          <strong>{t('form.errors.fixErrors')}</strong>
          <ul>
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="td-form__group">
        <label htmlFor="name">{t('form.name')} *</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>

      <div className="td-form__row">
        <div className="td-form__group">
          <label htmlFor="email">{t('form.email')} *</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="td-form__group">
          <label htmlFor="phone">{t('form.phone')}</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
        </div>
      </div>

      <div className="td-form__group">
        <label htmlFor="travelers">{t('form.travelers')} *</label>
        <input type="number" id="travelers" name="travelers" min="1" value={formData.travelers} onChange={handleChange} required />
      </div>

      {!isGroupTour && (
        <div className="td-form__row">
          <div className="td-form__group">
            <label htmlFor="startDate">{t('form.startDate')}</label>
            <input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleChange} />
          </div>
          <div className="td-form__group">
            <label htmlFor="endDate">{t('form.endDate')}</label>
            <input type="date" id="endDate" name="endDate" value={formData.endDate} onChange={handleChange} />
          </div>
        </div>
      )}

      <div className="td-form__group">
        <label htmlFor="message">{t('form.message')}</label>
        <textarea id="message" name="message" rows="4" value={formData.message} onChange={handleChange} />
      </div>

      <button type="submit" className="td-form__submit">{t('form.send')}</button>

      <p className="td-form__note">{t('form.required')}</p>
      <p className="td-form__trust">{t('tour.trustReply')}</p>
    </form>
  )
}
