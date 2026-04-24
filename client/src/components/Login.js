import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // <-- Added this!

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    
    const navigate = useNavigate(); // <-- Initialized the navigation tool

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email: email,
                password: password
            });

            // Save the token
            localStorage.setItem('token', response.data.token);
            
            // Instantly redirect to the landing page!
            navigate('/'); 
            
        } catch (err) {
            setMessage((err.response?.data?.msg || "Login Failed"));
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={{ color: '#1e3a8a' }}>OmniFinance Login</h2>
                <p>Enter your credentials to access your vault.</p>
                
                {message && <p style={{ fontWeight: 'bold', color: 'red' }}>{message}</p>}

                <form onSubmit={handleLogin} style={styles.form}>
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <button type="submit" style={styles.button}>Login</button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f3f4f6' },
    card: { backgroundColor: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center', width: '350px' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' },
    input: { padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' },
    button: { padding: '10px', backgroundColor: '#1e3a8a', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }
};

export default Login;