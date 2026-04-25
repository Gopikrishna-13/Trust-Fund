import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers'; 
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config';

const DonorDashboard = () => {
    const navigate = useNavigate();
    
    const [account, setAccount] = useState(null);
    const [donationAmount, setDonationAmount] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('trustFundCampaigns') || '[]');
        setCampaigns(saved);
        if (saved.length > 0) setSelectedCategory(saved[0].id);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const connectWallet = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAccount(accounts[0]); 
            } catch (error) {
                console.error("Connection failed", error);
            }
        } else {
            alert('🦊 Please install the MetaMask browser extension!');
        }
    };

    // 🚀 NEW: The Real Web3 Donation Function
    const handleDonate = async (e) => {
        e.preventDefault();
        
        if (!account) {
            alert("Please connect your wallet first!");
            return;
        }

        try {
            setIsProcessing(true);
            
            // 1. Connect to MetaMask's engine (Using modern Ethers v6 syntax)
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            
            // 2. Create the bridge to your specific contract
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            
            // 3. Convert decimal ETH into "Wei" (the format the blockchain reads)
            const amountInWei = ethers.parseEther(donationAmount);
            
            console.log(`Sending ${donationAmount} ETH to the ${selectedCategory} vault...`);

            // 4. Trigger the smart contract function!
            const transaction = await contract.donate(selectedCategory, { value: amountInWei });
            
            // 5. Wait for the blockchain to mine the block
            await transaction.wait();

            // Save donor record to localStorage
            const userAddress = await signer.getAddress();
            const savedDonors = JSON.parse(localStorage.getItem('newDonors') || '[]');
            localStorage.setItem('newDonors', JSON.stringify([{ address: userAddress, amount: donationAmount }, ...savedDonors]));

            // Update campaign raised amount
            const allCampaigns = JSON.parse(localStorage.getItem('trustFundCampaigns') || '[]');
            const updatedCampaigns = allCampaigns.map(c =>
                c.id === selectedCategory
                    ? { ...c, raised: (parseFloat(c.raised) + parseFloat(donationAmount)).toFixed(4) }
                    : c
            );
            localStorage.setItem('trustFundCampaigns', JSON.stringify(updatedCampaigns));
            setCampaigns(updatedCampaigns);

            const campaignName = campaigns.find(c => c.id === selectedCategory)?.title || selectedCategory;
            alert(`🎉 Success! You locked ${donationAmount} ETH into the "${campaignName}" campaign!`);
            setDonationAmount('');
            
        } catch (error) {
            console.error("Transaction Failed:", error);
            alert("Transaction failed! Check the console for details.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div style={{ padding: '30px', fontFamily: 'sans-serif', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <div>
                    <h1 style={{ color: '#1e3a8a', margin: 0 }}>Smart Crowd Fund (Donor Portal)</h1>
                    <p style={{ margin: '5px 0 0 0', color: '#64748b' }}>Transparent Web3 Crowdfunding</p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={connectWallet} style={styles.walletBtn}>
                        {account ? `Connected: ${account.substring(0, 6)}...${account.substring(38)}` : '🦊 Connect Wallet'}
                    </button>
                    <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', margin: '20px 0', flexWrap: 'wrap' }}>
                {campaigns.length > 0
                    ? campaigns.map(c => <VaultCard key={c.id} title={c.title} balance={parseFloat(c.raised) || 0} />)
                    : <p style={{ color: '#64748b' }}>No campaigns found.</p>
                }
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ ...styles.card, flex: 1 }}>
                    <h2 style={{ color: '#1e3a8a', marginTop: 0 }}>Make a Transparent Donation</h2>
                    <form onSubmit={handleDonate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <label style={{ fontWeight: 'bold' }}>Select Campaign:</label>
                        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={styles.input}>
                            {campaigns.map(c => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </select>

                        <label style={{ fontWeight: 'bold' }}>Amount (ETH):</label>
                        <input type="number" step="0.001" placeholder="0.01" value={donationAmount} onChange={(e) => setDonationAmount(e.target.value)} style={styles.input} required />

                        <button type="submit" style={styles.donateBtn} disabled={isProcessing}>
                            {isProcessing ? '⏳ Processing on Blockchain...' : 'Lock Funds in Smart Contract'}
                        </button>
                    </form>
                </div>

                <div style={{ ...styles.card, flex: 1, backgroundColor: '#f8fafc' }}>
                    <h2 style={{ color: '#1e3a8a', marginTop: 0, borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>Pending Requests (Vote)</h2>
                    <p style={{ color: '#64748b' }}>Voting system will be wired up next!</p>
                </div>
            </div>
        </div>
    );
};

const VaultCard = ({ title, balance }) => (
    <div style={{ flex: 1, backgroundColor: '#1e3a8a', color: 'white', padding: '20px', borderRadius: '10px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h3 style={{ margin: 0, fontWeight: 'normal', color: '#cbd5e1', fontSize: '16px' }}>{title}</h3>
        <h2 style={{ margin: '10px 0 0 0', fontSize: '32px' }}>{balance} ETH</h2>
    </div>
);

const styles = {
    card: { backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    input: { padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' },
    donateBtn: { padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' },
    walletBtn: { padding: '10px 20px', backgroundColor: '#f6851b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    logoutBtn: { padding: '10px 20px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }
};

export default DonorDashboard;