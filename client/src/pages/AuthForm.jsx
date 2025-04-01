"use client"
import { useState, useEffect } from 'react'
import { Shield, Mail, Lock, Building2, User, Phone, Globe } from 'lucide-react'
import { authService } from '../services/service'
import "./authfrm.css"

const AuthForm = () => {
  const [isLoginView, setIsLoginView] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '', // Changed from orgName to match backend model
    contactPerson: '',
    phone: '',
    website: '',
    address: '',
    walletAddress: '' // Added wallet address field which is in your backend model
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // UseEffect to load data from localStorage if available
  useEffect(() => {
    const storedFormData = localStorage.getItem('formData')
    if (storedFormData) {
      setFormData(JSON.parse(storedFormData))
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccessMessage('')

    try {
      if (isLoginView) {
        // Login operation
        const organizationData = await authService.loginOrganization({
          email: formData.email,
          password: formData.password
        })
        
        setSuccessMessage('Successfully logged in!')
        console.log('Login successful:', organizationData)
        
        // Redirect to dashboard or home page after successful login
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 1500)
      } else {
        // Registration operation
        const registrationData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          contactPerson: formData.contactPerson,
          website: formData.website,
          walletAddress: formData.walletAddress || '0x0000000000000000000000000000000000000000' // Provide a default if empty
        }
        
        const organizationData = await authService.registerOrganization(registrationData)
        
        setSuccessMessage('Organization registered successfully!')
        console.log('Registration successful:', organizationData)
        
        // Redirect to dashboard after successful registration
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 1500)
      }

      // Store form data in localStorage on successful submit
      localStorage.setItem('formData', JSON.stringify(formData))

    } catch (err) {
      console.error('Auth error:', err)
      setError(err.message || 'An error occurred. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <div className="icon-container">
            <Shield className="header-icon" />
          </div>
          <h2 className="card-title">
            {isLoginView ? 'Organization Login' : 'Register Organization'}
          </h2>
          <p className="card-description">
            {isLoginView 
              ? 'Access your CertiChain organization portal'
              : 'Create your organization account to start issuing certificates'}
          </p>
        </div>

        <div className="card-content">
          <div className="tabs">
            <div className="tab-list">
              <button
                type="button"
                className={`tab-button ${isLoginView ? 'active' : ''}`}
                onClick={() => setIsLoginView(true)}
              >
                Login
              </button>
              <button
                type="button"
                className={`tab-button ${!isLoginView ? 'active' : ''}`}
                onClick={() => setIsLoginView(false)}
              >
                Register
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="form">
            {!isLoginView && (
              <>
                <div className="form-group">
                  <label htmlFor="name" className="label">
                    <Building2 className="input-icon" />
                    Organization Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="input"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contactPerson" className="label">
                    <User className="input-icon" />
                    Contact Person
                  </label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    className="input"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="walletAddress" className="label">
                    <Shield className="input-icon" />
                    Wallet Address
                  </label>
                  <input
                    type="text"
                    id="walletAddress"
                    name="walletAddress"
                    className="input"
                    value={formData.walletAddress}
                    onChange={handleChange}
                    placeholder="0x..."
                    required
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="email" className="label">
                <Mail className="input-icon" />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="label">
                <Lock className="input-icon" />
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="input"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="8"
              />
            </div>

            {!isLoginView && (
              <>
                <div className="form-group">
                  <label htmlFor="phone" className="label">
                    <Phone className="input-icon" />
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="input"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="website" className="label">
                    <Globe className="input-icon" />
                    Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    className="input"
                    value={formData.website}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address" className="label">
                    <Building2 className="input-icon" />
                    Office Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    className="input"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="button-content">
                  <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {isLoginView ? 'Logging in...' : 'Registering...'}
                </span>
              ) : (
                <span className="button-content">
                  {isLoginView ? 'Login to Organization' : 'Create Organization Account'}
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AuthForm;