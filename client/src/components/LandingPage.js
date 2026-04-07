import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    // Check if the user is logged in
    const isLoggedIn = !!localStorage.getItem('token');

    // State to hold our dynamic campaigns
    const [campaigns, setCampaigns] = useState([]);

    // Load campaigns on startup
    useEffect(() => {
        const storedCampaigns = JSON.parse(localStorage.getItem('trustFundCampaigns'));

        if (storedCampaigns && storedCampaigns.length > 0) {
            setCampaigns(storedCampaigns);
        } else {
            // Seed the database with our default 3 if it is empty
            const defaultCampaigns = [
                { id: '1', emoji: '📦', title: 'Food Drive', raised: '2.5', goal: '5.0', description: 'Decentralizing charitable donations with transparent smart contracts.', link: '/impact/food-drive' },
                { id: '2', emoji: '🧸', title: 'Orphan Care', raised: '5.1', goal: '10.0', description: 'Orphan care contribution to ensure real-time transparent aid.', link: '/impact/orphan-care' },
                { id: '3', emoji: '🦽', title: 'Disabled Support', raised: '1.2', goal: '3.0', description: 'Commitment mentions and support, transport and disabled initiatives.', link: '/impact/disabled-support' }
            ];
            localStorage.setItem('trustFundCampaigns', JSON.stringify(defaultCampaigns));
            setCampaigns(defaultCampaigns);
        }
    }, []);

    const handleDonateAction = (path) => {
        if (isLoggedIn) {
            navigate(path);
        } else {
            navigate('/login');
        }
    };

    const handleAuthButton = () => {
        if (isLoggedIn) {
            localStorage.removeItem('token');
            navigate('/'); // Refresh state
        } else {
            navigate('/login');
        }
    };

    return (
        <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', color: '#0f172a' }}>

            {/* Header Navigation */}
            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 5%', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '24px' }}>🤝</span>
                    <h2 style={{ margin: 0, color: '#0f172a' }}>TrustFund DAO</h2>
                </div>
                <div style={{ display: 'flex', gap: '30px', alignItems: 'center', fontWeight: '500' }}>
                    <span style={{ cursor: 'pointer' }}>About</span>
                    <span style={{ cursor: 'pointer' }}>Impact</span>

                    {/* The NEW Add Campaign Link */}
                    <span
                        onClick={() => navigate('/add-campaign')}
                        style={{ cursor: 'pointer', color: '#059669', fontWeight: 'bold' }}
                    >
                        + Add Campaign
                    </span>

                    <span style={{ cursor: 'pointer' }}>Governance</span>
                    <button
                        onClick={handleAuthButton}
                        style={{ padding: '10px 20px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        {isLoggedIn ? 'Logout' : 'Connect Wallet / Login'}
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <header style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: 'white' }}>
                <h1 style={{ fontSize: '54px', margin: '0 0 20px 0', color: '#0f172a' }}>
                    Transparent Web3<br />Crowdfunding.
                </h1>
                <p style={{ fontSize: '18px', color: '#475569', maxWidth: '600px', margin: '0 auto 30px auto', lineHeight: '1.6' }}>
                    Revolutionizing charitable donations with blockchain technology. Trace every contribution to real impact.
                </p>
                <button
                    onClick={() => handleDonateAction('/impact/food-drive')}
                    style={{ padding: '15px 40px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(5, 150, 105, 0.2)' }}
                >
                    Start Giving
                </button>
            </header>

            {/* Impact Areas Section */}
            <section style={{ backgroundColor: '#0f172a', padding: '60px 5%', textAlign: 'center' }}>
                <h2 style={{ color: 'white', fontSize: '32px', marginTop: 0, marginBottom: '40px' }}>Our Impact Areas</h2>

                <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>

                    {/* Dynamic Rendering of Cards */}
                    {campaigns.map((camp) => (
                        <div key={camp.id} style={styles.card}>
                            <div style={{ fontSize: '48px', marginBottom: '15px' }}>{camp.emoji}</div>
                            <h3 style={styles.cardTitle}>{camp.title}</h3>
                            <p style={styles.cardHighlight}>{camp.raised} ETH Raised / {camp.goal} ETH Goal</p>
                            <p style={styles.cardDesc}>{camp.description}</p>
                            <button onClick={() => handleDonateAction(camp.link)} style={styles.cardBtn}>Donate</button>
                        </div>
                    ))}

                </div>
            </section>
        </div>
    );
};

const styles = {
    card: { backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '300px', textAlign: 'left', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' },
    cardTitle: { fontSize: '20px', margin: '0 0 5px 0', color: '#0f172a' },
    cardHighlight: { color: '#059669', fontWeight: 'bold', margin: '0 0 15px 0' },
    cardDesc: { color: '#64748b', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' },
    cardBtn: { padding: '10px 0', width: '100%', backgroundColor: 'transparent', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }
};

export default LandingPage;