"use client"

import { useState } from "react"
import { Shield, Search, ArrowLeft } from 'lucide-react'
import ShowCertificate from "../components/ShowCertificate"
import "./home.css"
import CertificateForm from "../components/GenerateCertificate"

export default function HomePage() {
  const [certificateToken, setCertificateToken] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [showCertificate, setShowCertificate] = useState(false)
  const [verificationError, setVerificationError] = useState("")

  const handleTokenSubmit = async (e) => {
    e.preventDefault()
    if (certificateToken.trim() !== "") {
      setIsVerifying(true)
      setVerificationError("")
      
      try {
        setShowCertificate(true)
      } catch (error) {
        setVerificationError("Failed to verify certificate. Please try again.")
      } finally {
        setIsVerifying(false)
      }
    }
  }

  const resetVerification = () => {
    setCertificateToken("")
    setShowCertificate(false)
    setVerificationError("")
  }

  if (showCertificate) {
    return (
      <div className="container">
        <button 
          className="back-button"
          onClick={resetVerification}
        >
          <ArrowLeft className="icon" />
          Back to Verification
        </button>
        <ShowCertificate certificateToken={certificateToken} />
      </div>
    )
  }

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">
          <span className="highlight">Proof</span>X
        </h1>
        <p className="subtitle">
          Blockchain-powered certificate verification system for secure, tamper-proof credentials
        </p>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="icon-container">
            <Shield className="header-icon" />
          </div>
          <h2 className="card-title">Verify Certificate</h2>
          <p className="card-description">
            Instantly verify the authenticity of your digital certificates
          </p>
        </div>
        <div className="card-content">
          <form onSubmit={handleTokenSubmit} className="form">
            <div className="form-group">
              <label htmlFor="token" className="label">Certificate Token</label>
              <input
                id="token"
                className="input"
                placeholder="Enter certificate ID or token"
                value={certificateToken}
                onChange={(e) => setCertificateToken(e.target.value)}
                required
              />
            </div>
            {verificationError && (
              <div className="error-message">{verificationError}</div>
            )}
            <button type="submit" className="submit-button" disabled={isVerifying}>
              {isVerifying ? (
                <span className="button-content">
                  <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                <span className="button-content">
                  <Search className="button-icon" />
                  Verify Certificate
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}