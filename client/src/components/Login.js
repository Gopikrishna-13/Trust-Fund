import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true); setMessage('');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            navigate('/');
        } catch (err) {
            setMessage(err.response?.data?.msg || 'Login failed. Please check your credentials.');
        } finally { setLoading(false); }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true); setMessage('');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
            localStorage.setItem('token', res.data.token);
            navigate('/');
        } catch (err) {
            setMessage(err.response?.data?.msg || 'Registration failed. Please try again.');
        } finally { setLoading(false); }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={{ color: '#1e3a8a', marginBottom: '4px' }}>Smart Crowd Fund</h2>
                <p style={{ color: '#64748b', marginBottom: '24px', marginTop: 0 }}>
                    {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
                </p>

                <div style={styles.tabRow}>
                    <button onClick={() => { setMode('login'); setMessage(''); }}
                        style={{ ...styles.tab, ...(mode === 'login' ? styles.tabActive : {}) }}>
                        Sign In
                    </button>
                    <button onClick={() => { setMode('register'); setMessage(''); }}
                        style={{ ...styles.tab, ...(mode === 'register' ? styles.tabActive : {}) }}>
                        Register
                    </button>
                </div>

                {message && <p style={{ fontWeight: 'bold', color: '#dc2626', marginBottom: '12px', fontSize: '14px' }}>{message}</p>}

                {mode === 'login' ? (
                    <form onSubmit={handleLogin} style={styles.form}>
                        <input type="email" placeholder="Email Address" value={email}
                            onChange={(e) => setEmail(e.target.value)} style={styles.input} required />
                        <input type="password" placeholder="Password" value={password}
                            onChange={(e) => setPassword(e.target.value)} style={styles.input} required />
                        <button type="submit" style={styles.button} disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleRegister} style={styles.form}>
                        <input type="text" placeholder="Full Name" value={name}
                            onChange={(e) => setName(e.target.value)} style={styles.input} required />
                        <input type="email" placeholder="Email Address" value={email}
                            onChange={(e) => setEmail(e.target.value)} style={styles.input} required />
                        <input type="password" placeholder="Password (min 6 characters)" value={password}
                            onChange={(e) => setPassword(e.target.value)} style={styles.input} minLength={6} required />
                        <button type="submit" style={{ ...styles.button, backgroundColor: '#059669' }} disabled={loading}>
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f3f4f6' },
    card: { backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', textAlign: 'center', width: '380px' },
    tabRow: { display: 'flex', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: '24px' },
    tab: { flex: 1, padding: '10px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', backgroundColor: '#f8fafc', color: '#64748b' },
    tabActive: { backgroundColor: '#1e3a8a', color: 'white' },
    form: { display: 'flex', flexDirection: 'column', gap: '14px' },
    input: { padding: '11px 14px', borderRadius: '7px', border: '1px solid #cbd5e1', fontSize: '15px', color: '#0f172a' },
    button: { padding: '12px', backgroundColor: '#1e3a8a', color: 'white', border: 'none', borderRadius: '7px', fontSize: '15px', cursor: 'pointer', fontWeight: 'bold', marginTop: '4px' },
};

export default Login;
