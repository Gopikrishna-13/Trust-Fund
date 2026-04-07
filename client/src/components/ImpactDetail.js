import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CONTRACT_ADDRESS } from '../config';

const ImpactDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // grabbing "food-drive" or "orphan-care" from URL
    
    // State to hold the specific campaign data
    const [campaign, setCampaign] = useState(null);
    
    // Static dummy donors for now
    const [donors] = useState([
        { address: "0x123...456", amount: "0.5" },
        { address: "Alice", amount: "0.2" },
        { address: "0xABC...DEF", amount: "1.0" }
    ]);

    useEffect(() => {
        // Load campaigns and find the one that matches this URL
        const savedCampaigns = JSON.parse(localStorage.getItem('trustFundCampaigns') || '[]');
        const currentCampaign = savedCampaigns.find(c => c.link.includes(id));
        
        if (currentCampaign) {
            setCampaign(currentCampaign);
        } else {
            // Fallback if not found
            setCampaign({
                title: "Unknown Campaign",
                raised: 0,
                goal: 0
            });
        }
    }, [id]);

    const handleDonateClick = () => {
        navigate(`/checkout/${id}`); // Dynamic navigation to checkout
    };

    if (!campaign) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Loading campaign details...</div>;
    }

    const raisedEth = parseFloat(campaign.raised) || 0;
    const goalEth = parseFloat(campaign.goal) || 1; // avoid divide by zero

    return (
        <div style={{ fontFamily: 'sans-serif', backgroundColor: '#fafafa', minHeight: '100vh' }}>
            {/* Header Area */}
            <div style={{ padding: '40px 10%', backgroundColor: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ fontSize: '48px', color: '#0f172a', margin: 0 }}>
                        {campaign.emoji} {campaign.title}
                    </h1>
                    
                    <button 
                        onClick={handleDonateClick} 
                        style={{ padding: '15px 30px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)' }}
                    >
                        Donate Now
                    </button>
                </div>
            </div>

            {/* Transparency Dashboard Area */}
            <div style={{ padding: '40px 10%' }}>
                <h2 style={{ fontSize: '24px', color: '#1e293b', marginBottom: '20px' }}>Transparency Dashboard</h2>
                
                <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                    
                    {/* Left Card: Funds Received */}
                    <div style={{ flex: 1, minWidth: '300px', backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ marginTop: 0, fontSize: '20px', color: '#0f172a' }}>Funds Received</h3>
                        
                        <p style={{ margin: '20px 0 5px', color: '#475569' }}>Total Raised: {raisedEth.toFixed(2)} ETH (approx. ₹{(raisedEth * 160000).toLocaleString()})</p>
                        {/* Progress Bar */}
                        <div style={{ width: '100%', backgroundColor: '#e2e8f0', borderRadius: '10px', height: '12px', overflow: 'hidden', transition: 'all 0.5s ease' }}>
                            <div style={{ width: `${Math.min((raisedEth / goalEth) * 100, 100)}%`, backgroundColor: '#059669', height: '100%', transition: 'width 1s ease-in-out' }}></div>
                        </div>
                        <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#64748b', marginTop: '5px' }}>
                            <span>Goal: {goalEth.toFixed(2)} ETH</span>
                            <span>₹{(goalEth * 160000).toLocaleString()}</span>
                        </p>

                        <h4 style={{ marginTop: '30px', fontSize: '18px', color: '#0f172a' }}>Recent Donors</h4>
                        <ul style={{ listStyle: 'none', padding: 0, color: '#475569', lineHeight: '2' }}>
                            {donors.map((donor, index) => (
                                <li key={index} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '5px' }}>
                                    <strong>{donor.address.substring(0, 10)}...</strong> - {donor.amount} ETH
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right Card: Funds Utilization */}
                    <div style={{ flex: 1, minWidth: '300px', backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ marginTop: 0, fontSize: '20px', color: '#0f172a' }}>Funds Utilization</h3>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px' }}>
                            <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'conic-gradient(#0f172a 0% 40%, #059669 40% 60%, #0ea5e9 60% 100%)' }}></div>
                            
                            <div style={{ flex: 1, fontSize: '14px', color: '#475569', lineHeight: '1.8' }}>
                                <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '10px', marginBottom: '10px' }}>
                                    <strong><span style={{ color: '#0f172a' }}>■</span> Groceries - 40% (1.0 ETH)</strong><br/>
                                    <span style={{ color: '#059669', textDecoration: 'underline', cursor: 'pointer' }}>View Receipt</span>
                                </div>
                                <div>
                                    <strong><span style={{ color: '#059669' }}>■</span> Logistics - 20% (0.5 ETH)</strong><br/>
                                    <span style={{ color: '#059669', textDecoration: 'underline', cursor: 'pointer' }}>View Invoice</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
                            <p style={{ margin: '0 0 5px' }}><strong>Blockchain Explorer</strong></p>
                            <a href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                                View Smart Contract on Etherscan ↗
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ImpactDetail;