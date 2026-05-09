import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Upload() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !jobDescription) {
      setError('Please upload a PDF and enter a job description');
      return;
    }
    setLoading(true);
    setError('');

    try {
      // Step 1 - Upload PDF and extract text
      const formData = new FormData();
      formData.append('resume', file);

      const uploadRes = await axios.post(
        'http://localhost:5000/api/resume/upload',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const resumeText = uploadRes.data.text;

      // Step 2 - Analyze with Gemini
      const analyzeRes = await axios.post(
        'http://localhost:5000/api/resume/analyze',
        { resumeText, jobDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Step 3 - Go to results page
      navigate(`/results/${analyzeRes.data.analysisId}`);

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Analyze Your Resume 📄</h2>
        <p style={styles.subtitle}>Upload your resume and paste the job description</p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label>Upload Resume (PDF only)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              style={styles.fileInput}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Job Description</label>
            <textarea
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              style={styles.textarea}
              rows={8}
              required
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? '⏳ Analyzing... please wait' : '🚀 Analyze Resume'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '90vh',
    backgroundColor: '#0f0f1a',
    padding: '20px'
  },
  card: {
    backgroundColor: '#13131f',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    width: '100%',
    maxWidth: '620px',
    border: '1px solid #1e1e2e'
  },
  title: {
    textAlign: 'center',
    marginBottom: '8px',
    color: '#e2e8f0',
    fontSize: '26px'
  },
  subtitle: {
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: '28px',
    fontSize: '14px'
  },
  error: {
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: '16px',
    fontSize: '14px',
    backgroundColor: '#2d1515',
    padding: '10px',
    borderRadius: '8px'
  },
  inputGroup: {
    marginBottom: '24px'
  },
  fileInput: {
    width: '100%',
    marginTop: '8px',
    padding: '14px',
    border: '2px dashed #4f46e5',
    borderRadius: '10px',
    cursor: 'pointer',
    boxSizing: 'border-box',
    backgroundColor: '#1a1a2e',
    color: '#a5b4fc'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    marginTop: '8px',
    borderRadius: '10px',
    border: '1px solid #374151',
    fontSize: '14px',
    resize: 'vertical',
    boxSizing: 'border-box',
    backgroundColor: '#1e1e2e',
    color: '#e2e8f0',
    lineHeight: '1.6'
  },
  button: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '8px',
    fontWeight: '600',
    letterSpacing: '0.5px'
  }
};

export default Upload;