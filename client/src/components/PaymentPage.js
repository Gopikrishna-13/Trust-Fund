import React, { useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config';

const PaymentPage = () => {
    // UI State
    const [paymentMethod, setPaymentMethod] = useState('crypto'); // 'fiat' or 'crypto'
    const [amount, setAmount] = useState('');
    const [status, setStatus] = useState('idle'); // 'idle', 'processing', 'success'
    const [txHash, setTxHash] = useState('');

    const handleCryptoPayment = async () => {
        if (!amount || isNaN(amount)) return alert("Please enter a valid amount.");
        if (typeof window.ethereum === 'undefined') return alert("Please install MetaMask!");

        try {
            setStatus('processing');
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            
            const amountInWei = ethers.parseEther(amount);
            const tx = await contract.donate("food", { value: amountInWei });
            await tx.wait(); 
            
            // 🚀 NEW MEMORY CODE: Save the donation to Local Storage
            const userAddress = await signer.getAddress();
            const savedDonors = JSON.parse(localStorage.getItem('newDonors') || '[]');
            localStorage.setItem('newDonors', JSON.stringify([{ address: userAddress, amount: amount }, ...savedDonors]));
            
            setTxHash(tx.hash);
            setStatus('success'); 
            
        } catch (error) {
            console.error(error);
            alert("Transaction failed! Did you reject it in MetaMask?");
            setStatus('idle');
        }
    };

    const handleFiatPayment = () => {
        if (!amount) return alert("Please enter a valid amount.");
        setStatus('processing');
        
        setTimeout(() => {
            // 🚀 NEW MEMORY CODE: Save the Fiat donation to Local Storage
            const savedDonors = JSON.parse(localStorage.getItem('newDonors') || '[]');
            localStorage.setItem('newDonors', JSON.stringify([{ address: "INR Fiat User", amount: (amount / 160000).toFixed(4) }, ...savedDonors]));

            setTxHash('FIAT_TX_' + Math.floor(Math.random() * 1000000));
            setStatus('success');
        }, 3000);
    };

    // --- SUCCESS SCREEN ---
    if (status === 'success') {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc' }}>
                <div style={{ backgroundColor: 'white', padding: '50px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                    <div style={{ fontSize: '80px', color: '#059669', marginBottom: '20px' }}>✅</div>
                    <h1 style={{ color: '#0f172a', margin: '0 0 10px 0' }}>Payment Successful!</h1>
                    <p style={{ color: '#64748b', fontSize: '18px' }}>Thank you for your transparent donation.</p>
                    <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f1f5f9', borderRadius: '8px', fontSize: '14px', color: '#475569', wordBreak: 'break-all' }}>
                        <strong>Transaction Receipt:</strong><br/>
                        {txHash}
                    </div>
                    <button onClick={() => window.location.href = '/impact/food-drive'} style={{ marginTop: '30px', padding: '12px 30px', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // --- PAYMENT FORM SCREEN ---
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'sans-serif' }}>
            
            {/* Left Side: Project Details */}
            <div style={{ flex: 1, padding: '60px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 0, color: '#0f172a' }}>
                    <span style={{ fontSize: '24px' }}>🤝</span> TrustFund DAO
                </h2>
                
                <div style={{ backgroundColor: '#e2e8f0', height: '300px', borderRadius: '12px', marginTop: '30px', backgroundImage: 'url("https://images.unsplash.com/photo-1593113565214-80afcb4a4771?q=80&w=1000&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                
                <h1 style={{ color: '#0f172a', marginTop: '30px' }}>Project: Food Drive</h1>
                <h3 style={{ color: '#475569', margin: '10px 0 5px 0' }}>Summary</h3>
                <p style={{ color: '#64748b', lineHeight: '1.6', fontSize: '16px' }}>
                    Supporting local food banks to provide nutritious meals to families in need. 100% transparent via blockchain.
                </p>
                
                <div style={{ marginTop: '30px' }}>
                    <p style={{ display: 'flex', justifyContent: 'space-between', margin: '0 0 10px 0', fontWeight: 'bold', color: '#0f172a' }}>
                        <span>2.5 ETH raised of 5.0 ETH goal</span>
                        <span>50%</span>
                    </p>
                    <div style={{ width: '100%', backgroundColor: '#e2e8f0', borderRadius: '10px', height: '10px' }}>
                        <div style={{ width: '50%', backgroundColor: '#059669', height: '100%', borderRadius: '10px' }}></div>
                    </div>
                </div>
            </div>

            {/* Right Side: Payment Gateway */}
            <div style={{ flex: 1, padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: 'white' }}>
                <h2 style={{ margin: '0 0 30px 0', color: '#0f172a', fontSize: '28px' }}>Make a Donation</h2>
                
                {/* The Custom Toggle Switch */}
                <div style={{ display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '50px', padding: '5px', marginBottom: '40px', border: '1px solid #cbd5e1' }}>
                    <button 
                        onClick={() => setPaymentMethod('fiat')}
                        style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '40px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s', backgroundColor: paymentMethod === 'fiat' ? '#059669' : 'transparent', color: paymentMethod === 'fiat' ? 'white' : '#64748b' }}
                    >
                        Fiat (INR)
                    </button>
                    <button 
                        onClick={() => setPaymentMethod('crypto')}
                        style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '40px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s', backgroundColor: paymentMethod === 'crypto' ? '#059669' : 'transparent', color: paymentMethod === 'crypto' ? 'white' : '#64748b' }}
                    >
                        Crypto (Ethereum)
                    </button>
                </div>

                {/* Dynamic Form Input */}
                <label style={{ fontWeight: 'bold', color: '#475569', marginBottom: '10px', display: 'block' }}>
                    Amount ({paymentMethod === 'fiat' ? 'INR' : 'ETH'})
                </label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 15px', marginBottom: '30px' }}>
                    <span style={{ color: '#64748b', marginRight: '10px', fontWeight: 'bold' }}>
                        {paymentMethod === 'fiat' ? '₹' : 'ETH'}
                    </span>
                    <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder={paymentMethod === 'fiat' ? "1,000" : "0.05"}
                        style={{ border: 'none', outline: 'none', fontSize: '18px', width: '100%', color: '#0f172a' }}
                    />
                </div>

                {/* Contextual UI: Only show card details if Fiat is selected */}
                {paymentMethod === 'fiat' && (
                    <div style={{ opacity: 0.5, pointerEvents: 'none' }}>
                        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>*UPI and Card inputs would render here for Web2 Gateway*</p>
                    </div>
                )}

                <button 
                    onClick={paymentMethod === 'crypto' ? handleCryptoPayment : handleFiatPayment}
                    disabled={status === 'processing'}
                    style={{ width: '100%', padding: '18px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', marginTop: 'auto' }}
                >
                    {status === 'processing' ? '⏳ Processing Payment...' : 'Confirm Donation'}
                </button>
                
                <p style={{ textAlign: 'center', color: '#64748b', fontSize: '12px', marginTop: '15px' }}>
                    Secure payment processed by TrustFund DAO. View our transparency report.
                </p>
            </div>
        </div>
    );
};

export default PaymentPage;