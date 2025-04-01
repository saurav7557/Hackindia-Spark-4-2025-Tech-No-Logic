"use client"

import { useState } from "react"
import { Shield, Upload, Search, ArrowLeft } from 'lucide-react'
import ShowCertificate from "../components/ShowCertificate"
import "./home.css"

export default function HomePage() {
  const [certificateToken, setCertificateToken] = useState("")
  const [certificateFile, setCertificateFile] = useState(null)
  const [fileName, setFileName] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [showCertificate, setShowCertificate] = useState(false)
  const [verificationError, setVerificationError] = useState("")
  const [activeTab, setActiveTab] = useState("token")

  const handleTokenSubmit = async (e) => {
    e.preventDefault()
    if (certificateToken.trim() !== "") {
      setIsVerifying(true)
      setVerificationError("")
      
      try {
        // We'll just set showCertificate to true here
        // The actual API call will be made by the ShowCertificate component
        setShowCertificate(true)
      } catch (error) {
        setVerificationError("Failed to verify certificate. Please try again.")
      } finally {
        setIsVerifying(false)
      }
    }
  }

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCertificateFile(e.target.files[0])
      setFileName(e.target.files[0].name)
    }
  }

  const handleFileSubmit = async (e) => {
    e.preventDefault()
    if (certificateFile) {
      setIsVerifying(true)
      setVerificationError("")
      
      try {
        // In a real implementation, you would upload the file to the server
        // and get back a certificate token or verification result
        const formData = new FormData()
        formData.append('certificate', certificateFile)
        
        // Simulating an API call that returns a certificate token
        // Replace with actual API call
        setTimeout(() => {
          setCertificateToken("DEMO-IMAGE-TOKEN")
          setShowCertificate(true)
          setIsVerifying(false)
        }, 1500)
      } catch (error) {
        setVerificationError("Failed to verify certificate. Please try again.")
        setIsVerifying(false)
      }
    }
  }

  const resetVerification = () => {
    setCertificateToken("")
    setCertificateFile(null)
    setFileName("")
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
          <span className="highlight">Certi</span>Chain
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
          <div className="tabs">
            <div className="tab-list">
              <button 
                className={`tab-button ${activeTab === "token" ? "active" : ""}`}
                onClick={() => setActiveTab("token")}
              >
                Certificate ID
              </button>
              <button 
                className={`tab-button ${activeTab === "upload" ? "active" : ""}`}
                onClick={() => setActiveTab("upload")}
              >
                Upload Certificate
              </button>
            </div>
            
            <div className={`tab-content ${activeTab === "token" ? "active" : ""}`}>
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
            
            <div className={`tab-content ${activeTab === "upload" ? "active" : ""}`}>
              <form onSubmit={handleFileSubmit} className="form">
                <div className="form-group">
                  <label htmlFor="certificate" className="label">Upload Certificate</label>
                  <div 
                    className="upload-area"
                    onClick={() => document.getElementById('certificate-upload')?.click()}
                  >
                    <Upload className="upload-icon" />
                    <p className="upload-text">
                      {fileName ? fileName : "Click to upload or drag and drop"}
                    </p>
                    <p className="upload-hint">
                      PNG, JPG or PDF (max. 5MB)
                    </p>
                    <input
                      id="certificate-upload"
                      type="file"
                      className="hidden"
                      accept=".png,.jpg,.jpeg,.pdf"
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>
                {verificationError && (
                  <div className="error-message">{verificationError}</div>
                )}
                <button 
                  type="submit" 
                  className="submit-button" 
                  disabled={!certificateFile || isVerifying}
                >
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
      </div>
    </div>
  )
}