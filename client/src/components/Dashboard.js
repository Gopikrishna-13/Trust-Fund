import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const navigate = useNavigate();
    
    // User Data State
    const [userData, setUserData] = useState(null);
    const [transactions, setTransactions] = useState([]);

    // Form State (For adding new transactions)
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Food');
    const [type, setType] = useState('expense');

    // Fetch data when page loads
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/');

            try {
                const userRes = await axios.get('http://localhost:5000/api/auth/me', {
                    headers: { 'x-auth-token': token }
                });
                setUserData(userRes.data);

                const transRes = await axios.get('http://localhost:5000/api/transactions', {
                    headers: { 'x-auth-token': token }
                });
                setTransactions(transRes.data);
            } catch (err) {
                localStorage.removeItem('token');
                navigate('/');
            }
        };
        fetchData();
    }, [navigate]);

    // Function to handle adding a new transaction
    const handleAddTransaction = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const response = await axios.post('http://localhost:5000/api/transactions', 
                { title, amount, category, type },
                { headers: { 'x-auth-token': token } }
            );

            // Update the screen instantly without refreshing!
            setUserData({ ...userData, balance: response.data.newBalance });
            setTransactions([response.data.transaction, ...transactions]);

            // Clear the form
            setTitle('');
            setAmount('');
        } catch (err) {
            alert("Error adding transaction!");
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    if (!userData) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading Vault...</div>;

    return (
        <div style={{ padding: '30px', fontFamily: 'sans-serif', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h1 style={{ color: '#1e3a8a', margin: 0 }}>Welcome, {userData.name}!</h1>
                <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </div>
            
            {/* Balance Card */}
            <div style={{ ...styles.card, backgroundColor: '#1e3a8a', color: 'white', textAlign: 'center' }}>
                <h3 style={{ margin: 0, fontWeight: 'normal', color: '#cbd5e1' }}>Available Balance</h3>
                <h1 style={{ margin: '10px 0 0 0', fontSize: '48px' }}>${userData.balance}</h1>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                
                {/* NEW: Add Transaction Form */}
                <div style={{ ...styles.card, flex: 1, marginTop: 0 }}>
                    <h2 style={{ color: '#1e3a8a', marginTop: 0 }}>Add Transaction</h2>
                    <form onSubmit={handleAddTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input type="text" placeholder="What did you buy? (e.g. Coffee)" value={title} onChange={(e) => setTitle(e.target.value)} style={styles.input} required />
                        <input type="number" placeholder="Amount (e.g. 15)" value={amount} onChange={(e) => setAmount(e.target.value)} style={styles.input} required />
                        
                        <select value={category} onChange={(e) => setCategory(e.target.value)} style={styles.input}>
                            <option value="Food">Food & Dining</option>
                            <option value="Transport">Transportation</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Bills">Bills & Utilities</option>
                            <option value="Salary">Salary / Income</option>
                        </select>

                        <select value={type} onChange={(e) => setType(e.target.value)} style={styles.input}>
                            <option value="expense">Expense (Spend)</option>
                            <option value="income">Income (Earn)</option>
                        </select>

                        <button type="submit" style={styles.submitBtn}>Add to Ledger</button>
                    </form>
                </div>

                {/* Transaction History (Moved to the right) */}
                <div style={{ ...styles.card, flex: 2, marginTop: 0, maxHeight: '400px', overflowY: 'auto' }}>
                    <h2 style={{ color: '#1e3a8a', marginTop: 0, borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>Recent Transactions</h2>
                    {transactions.length === 0 ? (
                        <p>No transactions yet. Time to start tracking!</p>
                    ) : (
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {transactions.map((t) => (
                                <li key={t._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #e2e8f0' }}>
                                    <div>
                                        <strong style={{ fontSize: '18px' }}>{t.title}</strong>
                                        <div style={{ color: '#64748b', fontSize: '14px' }}>{t.category} • {new Date(t.date).toLocaleDateString()}</div>
                                    </div>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: t.type === 'income' ? '#16a34a' : '#dc2626' }}>
                                        {t.type === 'income' ? '+' : '-'}${t.amount}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

            </div>
        </div>
    );
};

const styles = {
    logoutBtn: { padding: '10px 20px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    card: { backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    input: { padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' },
    submitBtn: { padding: '12px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }
};

export default Dashboard;