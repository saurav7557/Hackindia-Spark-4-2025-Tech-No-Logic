"use client"

import { useEffect, useState, useRef } from "react";
import { Download, ArrowLeft } from "lucide-react";
import { QRCode as ReactQRCode } from "react-qr-code";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./certificate.css";

const ShowCertificate = ({ certificateToken }) => {
  const [certificateData, setCertificateData] = useState(null)
  const [loading, setLoading] = useState(true)
  const certificateRef = useRef(null)

  useEffect(() => {
    // Fetch certificate data based on the certificateToken
    const fetchCertificateData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/certificates/verify/${certificateToken}`)
        const data = await response.json()

        if (data.verified) {
          setCertificateData(data)
        } else {
          alert("Invalid Certificate ID or Token.")
        }
      } catch (error) {
        alert("Failed to fetch certificate data.")
      } finally {
        setLoading(false)
      }
    }

    fetchCertificateData()
  }, [certificateToken])

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return

    try {
      const element = certificateRef.current
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true
      })

      const imgData = canvas.toDataURL('image/png')

      // Calculate PDF dimensions based on certificate aspect ratio
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      const pdf = new jsPDF('p', 'mm', 'a4')
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)

      // Add metadata
      const metadata = certificateData.metadata
      pdf.setProperties({
        title: `${metadata.organization} Certificate - ${metadata.name}`,
        subject: metadata.course,
        author: metadata.organization,
        keywords: `certificate, ${metadata.course}, blockchain`,
        creator: metadata.organization
      })

      pdf.save(`${metadata.certificateNumber}_${metadata.name.replace(/\s+/g, '_')}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to download certificate. Please try again.")
    }
  }

  const handleDownloadImage = async () => {
    if (!certificateRef.current) return

    try {
      const element = certificateRef.current
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true
      })

      const image = canvas.toDataURL("image/png", 1.0)
      const downloadLink = document.createElement("a")
      const metadata = certificateData.metadata

      downloadLink.href = image
      downloadLink.download = `${metadata.certificateNumber}_${metadata.name.replace(/\s+/g, '_')}.png`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    } catch (error) {
      console.error("Error generating image:", error)
      alert("Failed to download certificate image. Please try again.")
    }
  }

  const goBack = () => {
    window.history.back()
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <svg className="spinner" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle className="spinner-track" cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4"></circle>
            <circle className="spinner-path" cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="31.4 31.4" strokeDashoffset="0"></circle>
          </svg>
          <span>Loading certificate...</span>
        </div>
      </div>
    )
  }

  if (!certificateData || !certificateData.metadata) {
    return (
      <div className="container">
        <div className="error-container">No certificate data available.</div>
      </div>
    )
  }

  const metadata = certificateData.metadata
  const verificationUrl = `${window.location.origin}/verify/${certificateToken}`

  return (
    <div className="container">
      <button className="back-button" onClick={goBack}>
        <ArrowLeft className="icon" />
        Back
      </button>

      <div className="header">
        <div className="title">Certificate Verified</div>
        <p className="subtitle">This certificate has been verified on the <span className="highlight">{metadata.verificationMethod}</span> and is authentic</p>
      </div>

      <div className="page-container">
        <div className="certificate-wrapper" ref={certificateRef}>
          <div className="pm-certificate-container animate-in">
            <div className="outer-border"></div>
            <div className="inner-border"></div>

            <div className="pm-certificate-border">
              <div className="pm-certificate-header">
                <div className="pm-certificate-title cursive text-center">
                  <h2 className="animate-text">{metadata.organization}</h2>
                </div>
                <div className="certificate-number text-center">
                  <span className="animate-text-delay-1">Certificate #{metadata.certificateNumber}</span>
                </div>
              </div>

              <div className="pm-certificate-body">
                <div className="pm-certificate-block">
                  <div className="name-container">
                    <div className="pm-certificate-name underline margin-0 text-center">
                      <span className="pm-name-text bold animate-text-delay-1">{metadata.name}</span>
                    </div>
                  </div>

                  <div className="earned-container">
                    <div className="pm-earned text-center">
                      <span className="pm-earned-text padding-0 block cursive animate-text-delay-2">has earned</span>
                      <span className="pm-credits-text block bold sans animate-text-delay-2">
                        {metadata.course}
                      </span>
                      <span className="pm-earned-text padding-0 block cursive animate-text-delay-2">with grade</span>
                      <span className="pm-grade-text block bold sans animate-text-delay-2">
                        {metadata.grade} - {metadata.achievementLevel}
                      </span>
                    </div>
                  </div>

                  <div className="course-container">
                    <div className="pm-course-title text-center">
                      <span className="pm-earned-text block cursive animate-text-delay-3">Course Description:</span>
                    </div>
                  </div>
                  <div className="course-title-container">
                    <div className="pm-course-title underline text-center">
                      <span className="pm-credits-text block bold sans animate-text-delay-3">
                        {metadata.courseDescription}
                      </span>
                    </div>
                  </div>

                  <div className="skills-container">
                    <div className="pm-skills text-center">
                      <span className="pm-earned-text block cursive animate-text-delay-4">Skills Acquired:</span>
                      <span className="pm-skills-text block sans animate-text-delay-4">
                        {metadata.skills.join(' • ')}
                      </span>
                    </div>
                  </div>

                  <div className="duration-container">
                    <div className="pm-duration text-center">
                      <span className="pm-duration-text block sans animate-text-delay-4">
                        Course Duration: {metadata.duration}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pm-certificate-footer">
                  <div className="footer-grid">
                    <div className="pm-certified text-center">
                      <span className="pm-credits-text block sans">Issuer</span>
                      <span className="pm-empty-space block underline"></span>
                      <span className="bold block">{metadata.issuer}</span>
                    </div>

                    <div className="qr-code-container">
                      <ReactQRCode
                        value={verificationUrl}
                        size={100}
                        level="H"
                        bgColor="#ffffff"
                        fgColor="#000000"
                        includeMargin={true}
                        className="qr-code"
                      />
                      <div className="verification-text">
                        Scan to verify
                      </div>
                    </div>

                    <div className="pm-certified text-center">
                      <span className="pm-credits-text block sans">Date Details</span>
                      <span className="pm-empty-space block underline"></span>
                      <span className="date-block">Issued: {metadata.issueDate}</span>
                      {metadata.validUntil && <span className="date-block">Valid Until: {metadata.validUntil}</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="certificate-details">
            <div className="details-card">
              <h3>Certificate Details</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Certificate Number:</span>
                  <span className="detail-value">{metadata.certificateNumber}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Network:</span>
                  <span className="detail-value">{metadata.network}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Contract Address:</span>
                  <span className="detail-value truncate">{metadata.contractAddress}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Token ID:</span>
                  <span className="detail-value">{certificateData.tokenId}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Owner Address:</span>
                  <span className="detail-value truncate">{certificateData.owner}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Verified On:</span>
                  <span className="detail-value">{new Date(certificateData.verificationTimestamp).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="download-options">
          <button className="download-button" onClick={handleDownloadPDF}>
            <Download size={20} />
            <span>Download as PDF</span>
          </button>
          <button className="download-button image-button" onClick={handleDownloadImage}>
            <Download size={20} />
            <span>Download as Image</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ShowCertificate