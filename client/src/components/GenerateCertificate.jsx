"use client"

import { useState, useEffect } from 'react'
import { FilePlus, Shield, Award, Calendar } from 'lucide-react'

const CertificateForm = ({ onCertificateCreated }) => {
  const [formData, setFormData] = useState({
    recipient: '',
    name: '',
    course: '',
    // Auto-set date to current date, no need for manual input
    date: new Date().toISOString().split('T')[0],
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
    // New authentication fields
    recipientEmail: '',
    recipientId: '',
    verificationCode: '',
    signatureHash: '',
    expiryPeriod: '12', // Default expiry of 12 months
    certificateType: 'completion'
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [submitSuccess, setSubmitSuccess] = useState("")

  // Generate certificate number and verification code
  useEffect(() => {
    generateNewCertificateNumber();
    generateVerificationCode();
  }, []);

  // Generate a new certificate number
  const generateNewCertificateNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateString = `${year}${month}${day}`;
    
    // Generate random parts
    const firstPart = Math.random().toString(36).substring(2, 4).toUpperCase();
    const thirdPart = Math.random().toString(36).substring(2, 4).toUpperCase();
    const lastPart = Math.random().toString(36).substring(2, 5).toUpperCase();
    
    const newCertNumber = `${firstPart}-${dateString}-${thirdPart}-${lastPart}`;
    
    setFormData(prevData => ({
      ...prevData,
      certificateNumber: newCertNumber
    }));
    
    return newCertNumber;
  };

  // Generate a verification code
  const generateVerificationCode = () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    
    setFormData(prevData => ({
      ...prevData,
      verificationCode: code
    }));
    
    return code;
  };

  // Generate a signature hash based on form data
  const generateSignatureHash = (data) => {
    // In a real app, you would use a proper hashing algorithm
    // This is a simplified example
    const str = `${data.recipient}:${data.name}:${data.course}:${data.certificateNumber}:${data.verificationCode}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
  };

  // Calculate the valid until date based on expiry period
  const calculateValidUntil = (monthsToAdd) => {
    const date = new Date();
    date.setMonth(date.getMonth() + parseInt(monthsToAdd));
    return date.toISOString().split('T')[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'expiryPeriod') {
      // Calculate and update validUntil date when expiry period changes
      const validUntil = calculateValidUntil(value);
      setFormData({
        ...formData,
        [name]: value,
        validUntil: validUntil
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      // Generate signature hash for additional security
      const signatureHash = generateSignatureHash(formData);
      
      // Calculate valid until date if expiry period is set
      const validUntil = formData.expiryPeriod 
        ? calculateValidUntil(formData.expiryPeriod)
        : '';
      
      // Make the actual API call to your backend
      const response = await fetch('http://localhost:5000/api/certificates/issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          // Parse skills as an array if it's a comma-separated string
          skills: formData.skills ? formData.skills.split(',').map(skill => skill.trim()) : [],
          // Add the generated signature hash
          signatureHash,
          // Use the calculated validUntil
          validUntil
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed with status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // If callback exists, pass the certificate data to the parent component
      if (onCertificateCreated) {
        onCertificateCreated(result);
      }
      
      // Display success message
      setSubmitSuccess(`Certificate successfully generated with number: ${result.certificateNumber}`);
      
      // Reset form
      setFormData({
        recipient: '',
        name: '',
        course: '',
        date: new Date().toISOString().split('T')[0],
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
        recipientEmail: '',
        recipientId: '',
        verificationCode: '',
        signatureHash: '',
        expiryPeriod: '12',
        certificateType: 'completion'
      });
      
      // Generate new certificate number and verification code for next use
      generateNewCertificateNumber();
      generateVerificationCode();
      
    } catch (error) {
      console.error('Error issuing certificate:', error);
      setSubmitError(error.message || 'Error issuing certificate');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Certificate types for dropdown
  const certificateTypes = [
    { value: 'completion', label: 'Course Completion' },
    { value: 'participation', label: 'Participation' },
    { value: 'achievement', label: 'Achievement' },
    { value: 'degree', label: 'Degree' },
    { value: 'license', label: 'License' },
    { value: 'certification', label: 'Professional Certification' }
  ];

  // Expiry period options for dropdown
  const expiryOptions = [
    { value: '3', label: '3 months' },
    { value: '6', label: '6 months' },
    { value: '12', label: '1 year' },
    { value: '24', label: '2 years' },
    { value: '36', label: '3 years' },
    { value: '60', label: '5 years' },
    { value: '120', label: '10 years' },
    { value: '0', label: 'No expiry (lifetime)' }
  ];

  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <div className="card-header">
        <div className="icon-container">
          <FilePlus className="header-icon" />
        </div>
        <h2 className="card-title">Generate Blockchain Certificate</h2>
        <p className="card-description">
          Create new blockchain-verified certificates with tamper-proof security
        </p>
      </div>
      <div className="card-content">
        <form onSubmit={handleSubmit} className="form">
          <div className="certificate-number-display">
            <label className="label">Certificate Number (Auto-Generated)</label>
            <div className="certificate-number">{formData.certificateNumber}</div>
          </div>
          
          <div className="form-section">
            <h3 className="section-title">Recipient Information</h3>
            
            <div className="form-group">
              <label htmlFor="recipient" className="label">Recipient Wallet Address</label>
              <input
                type="text"
                name="recipient"
                className="input"
                value={formData.recipient}
                onChange={handleChange}
                placeholder="0x..."
                required
              />
              <small className="helper-text">Must be a valid Ethereum wallet address (0x...)</small>
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
              <label htmlFor="recipientEmail" className="label">Recipient Email</label>
              <input
                type="email"
                name="recipientEmail"
                className="input"
                value={formData.recipientEmail}
                onChange={handleChange}
                placeholder="email@example.com"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="recipientId" className="label">Recipient ID/Registration Number</label>
              <input
                type="text"
                name="recipientId"
                className="input"
                value={formData.recipientId}
                onChange={handleChange}
                placeholder="Student/Employee ID"
              />
            </div>
          </div>
          
          <div className="form-section">
            <h3 className="section-title">Certificate Details</h3>
          
            <div className="form-group">
              <label htmlFor="certificateType" className="label">Certificate Type</label>
              <select
                name="certificateType"
                className="input"
                value={formData.certificateType}
                onChange={handleChange}
                required
              >
                {certificateTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="course" className="label">Course/Program Name</label>
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
              <label htmlFor="courseDescription" className="label">Course/Program Description</label>
              <textarea
                name="courseDescription"
                className="input"
                value={formData.courseDescription}
                onChange={handleChange}
                rows="3"
                placeholder="Brief description of the course or program"
              />
            </div>

            <div className="form-row">
              <div className="form-group form-group-half">
                <label htmlFor="organization" className="label">Issuing Organization</label>
                <input
                  type="text"
                  name="organization"
                  className="input"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="Blockchain Academy"
                />
              </div>
              
              <div className="form-group form-group-half">
                <label htmlFor="issuer" className="label">Issuer Name</label>
                <input
                  type="text"
                  name="issuer"
                  className="input"
                  value={formData.issuer}
                  onChange={handleChange}
                  placeholder="Certificate Authority Name"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group form-group-half">
                <label htmlFor="duration" className="label">Course Duration</label>
                <input
                  type="text"
                  name="duration"
                  className="input"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 6 weeks, 120 hours"
                />
              </div>
              
              <div className="form-group form-group-half">
                <label htmlFor="expiryPeriod" className="label">Certificate Validity</label>
                <select
                  name="expiryPeriod"
                  className="input"
                  value={formData.expiryPeriod}
                  onChange={handleChange}
                >
                  {expiryOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h3 className="section-title">Achievement Details</h3>
            
            <div className="form-row">
              <div className="form-group form-group-half">
                <label htmlFor="grade" className="label">Grade/Score</label>
                <input
                  type="text"
                  name="grade"
                  className="input"
                  value={formData.grade}
                  onChange={handleChange}
                  placeholder="e.g., A, 95%, 4.0"
                />
              </div>
              
              <div className="form-group form-group-half">
                <label htmlFor="achievementLevel" className="label">Achievement Level</label>
                <select
                  name="achievementLevel"
                  className="input"
                  value={formData.achievementLevel}
                  onChange={handleChange}
                >
                  <option value="">Select Level (Optional)</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                  <option value="distinction">Distinction</option>
                  <option value="honors">Honors</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="skills" className="label">Skills Acquired (comma separated)</label>
              <input
                type="text"
                name="skills"
                className="input"
                value={formData.skills}
                onChange={handleChange}
                placeholder="Blockchain, Smart Contracts, Web3"
              />
            </div>
          </div>
          
          <div className="form-section">
            <h3 className="section-title">Verification Details</h3>
            <div className="verification-info">
              <div className="verification-item">
                <Shield size={18} />
                <span>Verification Code: <strong>{formData.verificationCode}</strong></span>
              </div>
              <div className="verification-item">
                <Calendar size={18} />
                <span>Auto-Generated Issue Date: <strong>{formData.issueDate}</strong></span>
              </div>
            </div>
          </div>

          {submitError && (
            <div className="error-message">{submitError}</div>
          )}
          
          {submitSuccess && (
            <div className="success-message">{submitSuccess}</div>
          )}

          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="button-content">
                <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Certificate...
              </span>
            ) : (
              <span className="button-content">
                <Award className="button-icon" />
                Generate Blockchain Certificate
              </span>
            )}
          </button>
        </form>
      </div>
      
      <style jsx>{`
        .form-section {
          margin-bottom: 1.5rem;
          padding: 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          background-color: #f8fafc;
        }
        
        .section-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #2d3748;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .form-row {
          display: flex;
          gap: 1rem;
        }
        
        .form-group-half {
          flex: 1;
        }
        
        .verification-info {
          background-color: #ebf8ff;
          padding: 1rem;
          border-radius: 0.5rem;
          margin-top: 0.5rem;
        }
        
        .verification-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        
        .success-message {
          padding: 1rem;
          background-color: #c6f6d5;
          color: #22543d;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
        }
        
        .error-message {
          padding: 1rem;
          background-color: #fed7d7;
          color: #822727;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  )
}

export default CertificateForm