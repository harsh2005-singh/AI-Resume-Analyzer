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
    backgroundColor: '#f0f2f5',
    padding: '20px'
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '600px'
  },
  title: {
    textAlign: 'center',
    marginBottom: '8px',
    color: '#1a1a2e'
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: '24px'
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '16px'
  },
  inputGroup: {
    marginBottom: '20px'
  },
  fileInput: {
    width: '100%',
    marginTop: '8px',
    padding: '10px',
    border: '2px dashed #4f46e5',
    borderRadius: '8px',
    cursor: 'pointer',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '10px',
    marginTop: '8px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    resize: 'vertical',
    boxSizing: 'border-box'
  },
  button: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '8px'
  }
};

export default Upload;