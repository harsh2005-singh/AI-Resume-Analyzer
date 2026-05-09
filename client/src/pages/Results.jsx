import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Results() {
    const { id } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5000/api/resume/analysis/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setAnalysis(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalysis();
    }, [id]);

    if (loading) return <div style={styles.center}>⏳ Loading results...</div>;
    if (!analysis) return <div style={styles.center}>Analysis not found!</div>;

    const getScoreColor = (score) => {
        if (score >= 75) return '#22c55e';
        if (score >= 50) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div style={styles.container}>
            {/* Overall Score */}
            <div style={styles.card}>
                <h2 style={styles.title}>📊 ATS Analysis Results</h2>
                <div style={styles.scoreCircle}>
                    <span style={{
                        ...styles.scoreNumber,
                        color: getScoreColor(analysis.overallScore)
                    }}>
                        {analysis.overallScore}
                    </span>
                    <span style={styles.scoreLabel}>/ 100</span>
                </div>
                <p style={styles.scoreText}>Overall ATS Score</p>
            </div>

            {/* ATS Section Breakdown */}
            <div style={styles.card}>
                <h3 style={styles.sectionTitle}>📋 Section Breakdown</h3>
                <div style={styles.sectionsGrid}>
                    {Object.entries(analysis.atsSections).map(([key, value]) => (
                        <div key={key} style={styles.sectionCard}>
                            <div style={styles.sectionHeader}>
                                <span style={styles.sectionName}>
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </span>
                                <span style={{
                                    ...styles.sectionScore,
                                    color: getScoreColor(value.score)
                                }}>
                                    {value.score}/100
                                </span>
                            </div>

                            {value.missing && value.missing.length > 0 && (
                                <div>
                                    <p style={styles.missingTitle}>Missing:</p>
                                    <div style={styles.tagContainer}>
                                        {value.missing.map((item, i) => (
                                            <span key={i} style={styles.tag}>{item}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {value.suggestions && value.suggestions.map((s, i) => (
                                <p key={i} style={styles.suggestion}>💡 {s}</p>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Suggestions */}
            <div style={styles.card}>
                <h3 style={styles.sectionTitle}>🎯 Top Suggestions</h3>
                {analysis.topSuggestions.map((s, i) => (
                    <div key={i} style={styles.suggestionItem}>
                        <span style={styles.suggestionNumber}>{i + 1}</span>
                        <p style={styles.suggestionText}>{s}</p>
                    </div>
                ))}
            </div>

            {/* Buttons */}
            <div style={styles.buttonRow}>
                <button
                    onClick={() => navigate('/upload')}
                    style={styles.button}>
                    🔄 Analyze Another Resume
                </button>
                <button
                    onClick={() => navigate('/history')}
                    style={{ ...styles.button, backgroundColor: '#6b7280' }}>
                    📁 View History
                </button>
                <button
                    onClick={() => window.open(
                        `http://localhost:5000/api/resume/download/${id}?token=${token}`,
                        '_blank'
                    )}
                    style={{ ...styles.button, backgroundColor: '#22c55e' }}>
                    📥 Download PDF Report
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '24px',
    },
    center: {
        textAlign: 'center',
        padding: '40px',
        fontSize: '18px'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
    },
    title: {
        textAlign: 'center',
        color: '#1a1a2e',
        marginBottom: '20px'
    },
    scoreCircle: {
        textAlign: 'center',
        margin: '20px 0'
    },
    scoreNumber: {
        fontSize: '80px',
        fontWeight: 'bold'
    },
    scoreLabel: {
        fontSize: '24px',
        color: '#666'
    },
    scoreText: {
        textAlign: 'center',
        color: '#666',
        fontSize: '16px'
    },
    sectionTitle: {
        color: '#1a1a2e',
        marginBottom: '16px'
    },
    sectionsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px'
    },
    sectionCard: {
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px'
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '12px'
    },
    sectionName: {
        fontWeight: 'bold',
        color: '#1a1a2e',
        textTransform: 'capitalize'
    },
    sectionScore: {
        fontWeight: 'bold',
        fontSize: '16px'
    },
    missingTitle: {
        color: '#ef4444',
        fontWeight: 'bold',
        marginBottom: '6px',
        fontSize: '13px'
    },
    tagContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        marginBottom: '10px'
    },
    tag: {
        backgroundColor: '#fee2e2',
        color: '#ef4444',
        padding: '2px 8px',
        borderRadius: '20px',
        fontSize: '12px'
    },
    suggestion: {
        fontSize: '13px',
        color: '#555',
        marginBottom: '4px'
    },
    suggestionItem: {
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
        marginBottom: '12px'
    },
    suggestionNumber: {
        backgroundColor: '#4f46e5',
        color: 'white',
        borderRadius: '50%',
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        flexShrink: 0
    },
    suggestionText: {
        color: '#444',
        fontSize: '14px',
        margin: 0
    },
    buttonRow: {
        display: 'flex',
        gap: '12px',
        justifyContent: 'center',
        marginTop: '8px'
    },
    button: {
        padding: '12px 24px',
        backgroundColor: '#4f46e5',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '15px',
        cursor: 'pointer'
    }
};

export default Results;