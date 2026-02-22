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
      <div className="form-success">
        <h3>{t('form.thankYou')}</h3>
        <p>{t('form.thankYouText', { tour: tourTitle })}</p>
      </div>
    )
  }

  return (
    <form className="tour-inquiry-form" onSubmit={handleSubmit}>
      <input type="hidden" name="tour_title" value={tourTitle} />

      {errors.length > 0 && (
        <div className="form-errors">
          <strong>{t('form.errors.fixErrors')}</strong>
          <ul>
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="name">{t('form.name')} *</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="email">{t('form.email')} *</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="phone">{t('form.phone')}</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="travelers">{t('form.travelers')} *</label>
        <input type="number" id="travelers" name="travelers" min="1" value={formData.travelers} onChange={handleChange} required />
      </div>

      {!isGroupTour && (
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">{t('form.startDate')}</label>
            <input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">{t('form.endDate')}</label>
            <input type="date" id="endDate" name="endDate" value={formData.endDate} onChange={handleChange} />
          </div>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="message">{t('form.message')}</label>
        <textarea id="message" name="message" rows="5" value={formData.message} onChange={handleChange} />
      </div>

      <button type="submit" className="button">{t('form.send')}</button>
      <p className="form-required-note">{t('form.required')}</p>
    </form>
  )
}
