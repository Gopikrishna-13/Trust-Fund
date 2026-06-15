import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api';

const AddCampaign = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        goal: '',
        description: '',
        wallet: '',
        tag: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsSubmitting(true);

            const response = await fetch(`${API_BASE_URL}/campaigns`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: formData.title,
                    goal: Number(formData.goal),
                    description: formData.description,
                    wallet: formData.wallet,
                    tag: formData.tag || 'IMPACT',
                    tagColor: 'secondary'
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Failed to submit campaign');
            }

            alert('Campaign submitted for verification. Manager approval is required before it appears publicly.');
            navigate('/');
        } catch (error) {
            console.error('Campaign submit error:', error);
            alert(error.message || 'Something went wrong while submitting campaign.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', padding: '60px 20px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '600px' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h2 style={{ color: '#0f172a', margin: 0, fontSize: '28px' }}>Launch a Campaign</h2>
                    <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '16px' }}>
                        Cancel
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    <div>
                        <label style={styles.label}>Campaign Title</label>
                        <input
                            required
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="e.g., Clean Water Initiative"
                            style={styles.input}
                        />
                    </div>

                    <div>
                        <label style={styles.label}>Funding Goal (ETH)</label>
                        <input
                            required
                            type="number"
                            step="0.01"
                            min="0"
                            name="goal"
                            value={formData.goal}
                            onChange={handleInputChange}
                            placeholder="e.g., 10.5"
                            style={styles.input}
                        />
                    </div>

                    <div>
                        <label style={styles.label}>Organizer Wallet Address</label>
                        <input
                            required
                            name="wallet"
                            value={formData.wallet}
                            onChange={handleInputChange}
                            placeholder="0x..."
                            style={styles.input}
                        />
                    </div>

                    <div>
                        <label style={styles.label}>Campaign Category</label>
                        <input
                            name="tag"
                            value={formData.tag}
                            onChange={handleInputChange}
                            placeholder="e.g., EDUCATION, HEALTHCARE, WATER"
                            style={styles.input}
                        />
                    </div>

                    <div>
                        <label style={styles.label}>Short Description</label>
                        <textarea
                            required
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Explain the impact of this campaign..."
                            rows="4"
                            style={{ ...styles.input, resize: 'vertical' }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                            padding: '15px',
                            backgroundColor: isSubmitting ? '#94a3b8' : '#059669',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                            marginTop: '10px'
                        }}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    label: {
        display: 'block',
        fontWeight: 'bold',
        color: '#475569',
        marginBottom: '8px',
        fontSize: '14px'
    },
    input: {
        width: '100%',
        padding: '12px',
        border: '1px solid #cbd5e1',
        borderRadius: '8px',
        fontSize: '16px',
        color: '#0f172a',
        boxSizing: 'border-box'
    }
};

export default AddCampaign;