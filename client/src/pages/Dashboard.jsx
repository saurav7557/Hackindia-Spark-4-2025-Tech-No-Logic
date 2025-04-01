"use client";
import React, { useState, useEffect } from 'react';
import { Shield, Award, User, Globe, Mail, Calendar, FileText, Plus } from 'lucide-react';
import CertificateForm from '../components/GenerateCertificate';
import './dashboard.css';
import { Link } from 'react-router-dom';

const Dashboard = ({ orgData }) => {
  // If orgData is not provided as prop, use default data
  const organizationData = orgData || {
    _id: "67ec26c334d92f794e4f7f9b",
    name: "Scaler",
    email: "sktigpta@gmail.com",
    walletAddress: "sdfgh",
    contactPerson: "Shakti",
    website: "https://mail.google.com",
    createdAt: "2025-04-01T17:47:47.649+00:00"
  };

  const [activeTab, setActiveTab] = useState('overview');
  const [certificates, setCertificates] = useState([]);
  const [showCertificateForm, setShowCertificateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to generate certificate number in format XX-YYYYMMDD-XX-XXX
  const generateCertificateNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateString = `${year}${month}${day}`;

    // Generate random parts
    const firstPart = Math.random().toString(36).substring(2, 4).toUpperCase();
    const thirdPart = Math.random().toString(36).substring(2, 4).toUpperCase();
    const lastPart = Math.random().toString(36).substring(2, 5).toUpperCase();

    return `${firstPart}-${dateString}-${thirdPart}-${lastPart}`;
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle form submission from CertificateForm
  const handleCertificateCreation = (newCertData) => {
    // Generate certificate number
    const certificateNumber = generateCertificateNumber();

    // Create new certificate object
    const newCertificate = {
      id: Date.now(),
      certificateNumber,
      recipientName: newCertData.name,
      recipientEmail: newCertData.recipient,
      courseTitle: newCertData.course,
      completionDate: newCertData.date,
      skills: newCertData.skills,
      issueDate: new Date().toISOString(),
      issuerName: organizationData.name,
      issuerID: organizationData._id
    };

    // Add the new certificate to the list
    setCertificates([newCertificate, ...certificates]);
    setShowCertificateForm(false);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <Shield className="sidebar-logo" />
          <h2 className="sidebar-title">Organization <span className="highlight">Panel</span></h2>
        </div>

        <div className="sidebar-menu">
          <button
            className={`sidebar-menu-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <FileText className="menu-icon" />
            <span>Overview</span>
          </button>

          <button
            className={`sidebar-menu-item ${activeTab === 'certificates' ? 'active' : ''}`}
            onClick={() => setActiveTab('certificates')}
          >
            <Award className="menu-icon" />
            <span>Certificates</span>
          </button>

          <button
            className={`sidebar-menu-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User className="menu-icon" />
            <span>Profile</span>
          </button>
          <Link
              to="/logout"
              className={`sidebar-menu-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Logout
            </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="dashboard-overview">
            <h1 className="dashboard-title">Welcome, {organizationData.name}</h1>

            <div className="overview-cards">
              <div className="overview-card">
                <div className="card-icon-container">
                  <Award className="card-icon" />
                </div>
                <div className="card-content">
                  <h3 className="card-title">Certificates Issued</h3>
                  <p className="card-value">{certificates.length}</p>
                </div>
              </div>

              <div className="overview-card">
                <div className="card-icon-container">
                  <Calendar className="card-icon" />
                </div>
                <div className="card-content">
                  <h3 className="card-title">Joined</h3>
                  <p className="card-value">{formatDate(organizationData.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="org-info-card">
              <h2 className="card-section-title">Organization Information</h2>
              <div className="org-info-grid">
                <div className="info-item">
                  <User className="info-icon" />
                  <div>
                    <h4>Contact Person</h4>
                    <p>{organizationData.contactPerson}</p>
                  </div>
                </div>

                <div className="info-item">
                  <Mail className="info-icon" />
                  <div>
                    <h4>Email</h4>
                    <p>{organizationData.email}</p>
                  </div>
                </div>

                <div className="info-item">
                  <Globe className="info-icon" />
                  <div>
                    <h4>Website</h4>
                    <p>{organizationData.website}</p>
                  </div>
                </div>

                <div className="info-item">
                  <Shield className="info-icon" />
                  <div>
                    <h4>Wallet Address</h4>
                    <p>{organizationData.walletAddress}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'certificates' && (
          <div className="certificates-section">
            <div className="certificates-header">
              <h1 className="dashboard-title">Certificate Management</h1>
              <button
                className="issue-certificate-button"
                onClick={() => setShowCertificateForm(!showCertificateForm)}
              >
                <Plus className="button-icon" />
                {showCertificateForm ? 'Cancel' : 'Issue New Certificate'}
              </button>
            </div>

            {showCertificateForm && (
              <div className="certificate-form-container">
                {/* Use the existing CertificateForm component */}
                <CertificateForm />
              </div>
            )}

            <div className="certificates-list">
              <h2 className="list-title">Issued Certificates</h2>

              {certificates.length === 0 ? (
                <div className="empty-state">
                  <Award className="empty-icon" />
                  <p>No certificates issued yet. Click "Issue New Certificate" to get started.</p>
                </div>
              ) : (
                <div className="certificate-table-container">
                  <table className="certificate-table">
                    <thead>
                      <tr>
                        <th>Certificate ID</th>
                        <th>Recipient</th>
                        <th>Course/Achievement</th>
                        <th>Issue Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {certificates.map(cert => (
                        <tr key={cert.id}>
                          <td className="cert-id">{cert.certificateNumber}</td>
                          <td>{cert.recipientName}</td>
                          <td>{cert.courseTitle}</td>
                          <td>{formatDate(cert.issueDate)}</td>
                          <td className="action-buttons">
                            <button className="view-button">View</button>
                            <button className="download-button">Download</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="profile-section">
            <h1 className="dashboard-title">Organization Profile</h1>
            <div className="profile-card">
              <div className="profile-header">
                <Shield className="profile-logo" />
                <h2 className="org-name">{organizationData.name}</h2>
              </div>

              <div className="profile-details">
                <div className="detail-item">
                  <span className="detail-label">Organization ID:</span>
                  <span className="detail-value">{organizationData._id}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Contact Person:</span>
                  <span className="detail-value">{organizationData.contactPerson}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{organizationData.email}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Website:</span>
                  <span className="detail-value">{organizationData.website}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Wallet Address:</span>
                  <span className="detail-value">{organizationData.walletAddress}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Member Since:</span>
                  <span className="detail-value">{formatDate(organizationData.createdAt)}</span>
                </div>
              </div>

              <div className="profile-actions">
                <button className="edit-profile-button">Edit Profile</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;