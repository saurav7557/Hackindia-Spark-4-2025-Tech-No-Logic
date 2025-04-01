"use client"

import { useState } from 'react'
import { ShieldPlus, FilePlus } from 'lucide-react'

const CertificateForm = () => {
  const [formData, setFormData] = useState({
    recipient: '',
    name: '',
    course: '',
    date: '',
    organization: "",
    issuer: "",
    validUntil: '',
    courseDescription: '',
    grade: '',
    achievementLevel: '',
    skills: '',
    duration: '',
    certificateNumber: '',
    issueDate: new Date().toISOString().split('T')[0],
    imageUrl: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError("")

    try {
      const response = await fetch('http://your-server-url/issueCertificate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()
      if (response.status === 200) {
        alert(`Certificate issued successfully. Transaction Hash: ${result.transactionHash}`)
      } else {
        setSubmitError(result.error || 'Failed to generate certificate')
      }
    } catch (error) {
      console.error('Error issuing certificate:', error)
      setSubmitError('Error issuing certificate')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <div className="card-header">
        <div className="icon-container">
          <FilePlus className="header-icon" />
        </div>
        <h2 className="card-title">Generate Certificate</h2>
        <p className="card-description">
          Create new blockchain-verified certificates with tamper-proof security
        </p>
      </div>
      <div className="card-content">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="recipient" className="label">Recipient Wallet Address</label>
            <input
              type="text"
              name="recipient"
              className="input"
              value={formData.recipient}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="name" className="label">Full Name</label>
            <input
              type="text"
              name="name"
              className="input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="course" className="label">Course Name</label>
            <input
              type="text"
              name="course"
              className="input"
              value={formData.course}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="date" className="label">Completion Date</label>
            <input
              type="date"
              name="date"
              className="input"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="organization" className="label">Issuing Organization</label>
            <input
              type="text"
              name="organization"
              className="input"
              value={formData.organization}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="skills" className="label">Skills Acquired (comma separated)</label>
            <input
              type="text"
              name="skills"
              className="input"
              value={formData.skills}
              onChange={handleChange}
            />
          </div>

          {submitError && (
            <div className="error-message">{submitError}</div>
          )}

          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="button-content">
                <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              <span className="button-content">
                <FilePlus className="button-icon" />
                Generate Certificate
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CertificateForm