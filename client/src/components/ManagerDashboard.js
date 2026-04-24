import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ManagerDashboard = () => {
    const navigate = useNavigate();
    
    // Fake Blockchain Data
    const vaults = { food: 2.5, orphans: 5.1, disabled: 1.2 };

    const [requestAmount, setRequestAmount] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('food');
    const [requestReason, setRequestReason] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleCreateRequest = (e) => {
        e.preventDefault();
        alert(`Web3 Trigger: Sending request to Smart Contract for ${requestAmount} ETH from ${selectedCategory} vault.`);
        setRequestAmount('');
        setRequestReason('');
    };

    return (
        <div style={{ padding: '30px', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b', color: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}>
                <div>
                    <h1 style={{ margin: 0, color: '#f8fafc' }}>TrustFund DAO (Manager Control)</h1>
                    <p style={{ margin: '5px 0 0 0', color: '#cbd5e1' }}>NGO Operations & Accountability</p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button style={styles.walletBtn}>Connect Admin Wallet</button>
                    <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
                <VaultCard title="Food Drive" balance={vaults.food} />
                <VaultCard title="Orphan Care" balance={vaults.orphans} />
                <VaultCard title="Disabled Support" balance={vaults.disabled} />
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ ...styles.card, flex: 1 }}>
                    <h2 style={{ color: '#0f172a', marginTop: 0 }}>Create Spend Request</h2>
                    <form onSubmit={handleCreateRequest} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        
                        <label style={{ fontWeight: 'bold' }}>Target Vault:</label>
                        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={styles.input}>
                            <option value="food">Food Drive</option>
                            <option value="orphans">Orphan Care</option>
                            <option value="disabled">Disabled Support</option>
                        </select>

                        <label style={{ fontWeight: 'bold' }}>Amount Needed (ETH):</label>
                        <input type="number" step="0.01" placeholder="0.5" value={requestAmount} onChange={(e) => setRequestAmount(e.target.value)} style={styles.input} required />

                        <label style={{ fontWeight: 'bold' }}>Reason / Accountability Detail:</label>
                        <input type="text" placeholder="e.g., Paying local bakery for 100 loaves" value={requestReason} onChange={(e) => setRequestReason(e.target.value)} style={styles.input} required />

                        <button type="submit" style={styles.requestBtn}>Submit for Donor Approval</button>
                    </form>
                </div>

                <div style={{ ...styles.card, flex: 1, backgroundColor: 'white' }}>
                    <h2 style={{ color: '#0f172a', marginTop: 0, borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>Public Ledger & Status</h2>
                    <p style={{ color: '#64748b' }}>No approved transactions yet. Submit a request to the donors.</p>
                </div>
            </div>
        </div>
    );
};

const VaultCard = ({ title, balance }) => (
    <div style={{ flex: 1, backgroundColor: '#0f172a', color: 'white', padding: '20px', borderRadius: '10px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '1px solid #334155' }}>
        <h3 style={{ margin: 0, fontWeight: 'normal', color: '#94a3b8', fontSize: '16px' }}>{title}</h3>
        <h2 style={{ margin: '10px 0 0 0', fontSize: '32px' }}>{balance} ETH</h2>
    </div>
);

const styles = {
    card: { backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    input: { padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' },
    requestBtn: { padding: '12px', backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' },
    walletBtn: { padding: '10px 20px', backgroundColor: '#f6851b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    logoutBtn: { padding: '10px 20px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }
};

export default ManagerDashboard;