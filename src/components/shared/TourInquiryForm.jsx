import { useState } from 'react'

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = []
    if (!formData.name.trim()) newErrors.push('Name is required')
    if (!formData.email.trim()) newErrors.push('Email is required')
    if (!formData.travelers) newErrors.push('Number of travelers is required')

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
        <h3>Thank you for your inquiry!</h3>
        <p>We'll get back to you shortly about "{tourTitle}".</p>
      </div>
    )
  }

  return (
    <form className="tour-inquiry-form" onSubmit={handleSubmit}>
      <input type="hidden" name="tour_title" value={tourTitle} />

      {errors.length > 0 && (
        <div className="form-errors">
          <strong>Please fix the following errors:</strong>
          <ul>
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="name">Name *</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="travelers">Number of Travelers *</label>
        <input type="number" id="travelers" name="travelers" min="1" value={formData.travelers} onChange={handleChange} required />
      </div>

      {!isGroupTour && (
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">Preferred Start Date</label>
            <input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">Preferred End Date</label>
            <input type="date" id="endDate" name="endDate" value={formData.endDate} onChange={handleChange} />
          </div>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" rows="5" value={formData.message} onChange={handleChange} />
      </div>

      <button type="submit" className="button">Send Inquiry</button>
      <p className="form-required-note">* Required fields</p>
    </form>
  )
}
