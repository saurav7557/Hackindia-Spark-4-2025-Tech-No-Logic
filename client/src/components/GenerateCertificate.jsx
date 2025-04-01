import React, { useState } from 'react';

const CertificateForm = () => {
  const [formData, setFormData] = useState({
    recipient: '',
    name: '',
    course: '',
    date: '',
    organization: 'Blockchain Academy',
    issuer: 'Blockchain Certificate Authority',
    validUntil: '',
    courseDescription: '',
    grade: '',
    achievementLevel: '',
    skills: '',
    duration: '',
    certificateNumber: '',
    issueDate: new Date().toISOString().split('T')[0],
    imageUrl: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://your-server-url/issueCertificate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.status === 200) {
        alert(`Certificate issued successfully. Transaction Hash: ${result.transactionHash}`);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error issuing certificate:', error);
      alert('Error issuing certificate');
    }
  };

  return (
    <div>
      <h2>Generate Certificate</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Recipient (Wallet Address):</label>
          <input
            type="text"
            name="recipient"
            value={formData.recipient}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Course:</label>
          <input
            type="text"
            name="course"
            value={formData.course}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Completion Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        {/* Add other fields as necessary */}
        <div>
          <label>Organization:</label>
          <input
            type="text"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Issuer:</label>
          <input
            type="text"
            name="issuer"
            value={formData.issuer}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Skills (Comma Separated):</label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Duration:</label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
          />
        </div>
        {/* Add other fields as necessary */}
        <div>
          <button type="submit">Generate Certificate</button>
        </div>
      </form>
    </div>
  );
};

export default CertificateForm;
