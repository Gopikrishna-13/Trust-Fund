import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api';

const ManagerDashboard = () => {
    const navigate = useNavigate();

    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [account, setAccount] = useState(null);
    const [activeFilter, setActiveFilter] = useState('pending');

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            setLoading(true);

            const response = await fetch(`${API_BASE_URL}/campaigns?status=all`);
            const data = await response.json();

            const campaignsArray = Array.isArray(data) ? data : data.value || [];

            setCampaigns(campaignsArray);
        } catch (error) {
            console.error('Fetch manager campaigns error:', error);
            alert('Failed to load campaigns');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const connectAdminWallet = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts'
                });
                setAccount(accounts[0]);
            } catch (error) {
                console.error('Wallet connection failed:', error);
            }
        } else {
            alert('Please install MetaMask browser extension.');
        }
    };

    const updateCampaignStatus = async (campaignId, status) => {
        try {
            const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Failed to update campaign status');
            }

            alert(data.msg);
            fetchCampaigns();
        } catch (error) {
            console.error('Status update error:', error);
            alert(error.message || 'Something went wrong');
        }
    };

    const filteredCampaigns = campaigns.filter((campaign) => {
        if (activeFilter === 'all') return true;
        return campaign.status === activeFilter;
    });

    const totalCampaigns = campaigns.length;
    const pendingCount = campaigns.filter(c => c.status === 'pending').length;
    const approvedCount = campaigns.filter(c => c.status === 'approved').length;
    const rejectedCount = campaigns.filter(c => c.status === 'rejected').length;

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Smart Crowd Fund Manager Dashboard</h1>
                    <p style={styles.subtitle}>Campaign verification and platform control panel</p>
                </div>

                <div style={styles.headerActions}>
                    <button onClick={connectAdminWallet} style={styles.walletBtn}>
                        {account
                            ? `Admin: ${account.substring(0, 6)}...${account.substring(account.length - 4)}`
                            : 'Connect Admin Wallet'}
                    </button>

                    <button onClick={() => navigate('/')} style={styles.homeBtn}>
                        Home
                    </button>

                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        Logout
                    </button>
                </div>
            </div>

            <div style={styles.statsGrid}>
                <StatCard title="Total Campaigns" value={totalCampaigns} color="#2563eb" />
                <StatCard title="Pending Approval" value={pendingCount} color="#f59e0b" />
                <StatCard title="Approved" value={approvedCount} color="#16a34a" />
                <StatCard title="Rejected" value={rejectedCount} color="#dc2626" />
            </div>

            <div style={styles.filterBar}>
                <button
                    onClick={() => setActiveFilter('pending')}
                    style={activeFilter === 'pending' ? styles.activeFilterBtn : styles.filterBtn}
                >
                    Pending
                </button>

                <button
                    onClick={() => setActiveFilter('approved')}
                    style={activeFilter === 'approved' ? styles.activeFilterBtn : styles.filterBtn}
                >
                    Approved
                </button>

                <button
                    onClick={() => setActiveFilter('rejected')}
                    style={activeFilter === 'rejected' ? styles.activeFilterBtn : styles.filterBtn}
                >
                    Rejected
                </button>

                <button
                    onClick={() => setActiveFilter('all')}
                    style={activeFilter === 'all' ? styles.activeFilterBtn : styles.filterBtn}
                >
                    All
                </button>
            </div>

            <div style={styles.card}>
                <h2 style={styles.sectionTitle}>Campaign Verification Requests</h2>

                {loading ? (
                    <p style={styles.emptyText}>Loading campaigns...</p>
                ) : filteredCampaigns.length === 0 ? (
                    <p style={styles.emptyText}>No campaigns found for this filter.</p>
                ) : (
                    <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Campaign</th>
                                    <th style={styles.th}>Goal</th>
                                    <th style={styles.th}>Raised</th>
                                    <th style={styles.th}>Wallet</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.th}>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredCampaigns.map((campaign) => (
                                    <tr key={campaign._id} style={styles.tr}>
                                        <td style={styles.td}>
                                            <strong>{campaign.title}</strong>
                                            <p style={styles.description}>{campaign.description}</p>
                                            <span style={styles.tag}>{campaign.tag || 'IMPACT'}</span>
                                        </td>

                                        <td style={styles.td}>
                                            {campaign.goal} ETH
                                        </td>

                                        <td style={styles.td}>
                                            {campaign.raised || 0} ETH
                                        </td>

                                        <td style={styles.td}>
                                            <span style={styles.walletText}>
                                                {campaign.wallet}
                                            </span>
                                        </td>

                                        <td style={styles.td}>
                                            <StatusBadge status={campaign.status} />
                                        </td>

                                        <td style={styles.td}>
                                            <div style={styles.actionButtons}>
                                                {campaign.status !== 'approved' && (
                                                    <button
                                                        onClick={() => updateCampaignStatus(campaign._id, 'approved')}
                                                        style={styles.approveBtn}
                                                    >
                                                        Approve
                                                    </button>
                                                )}

                                                {campaign.status !== 'rejected' && (
                                                    <button
                                                        onClick={() => updateCampaignStatus(campaign._id, 'rejected')}
                                                        style={styles.rejectBtn}
                                                    >
                                                        Reject
                                                    </button>
                                                )}

                                                {campaign.status !== 'pending' && (
                                                    <button
                                                        onClick={() => updateCampaignStatus(campaign._id, 'pending')}
                                                        style={styles.pendingBtn}
                                                    >
                                                        Move Pending
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

const StatCard = ({ title, value, color }) => {
    return (
        <div style={styles.statCard}>
            <p style={styles.statTitle}>{title}</p>
            <h2 style={{ ...styles.statValue, color }}>{value}</h2>
        </div>
    );
};

const StatusBadge = ({ status }) => {
    let backgroundColor = '#fef3c7';
    let color = '#92400e';

    if (status === 'approved') {
        backgroundColor = '#dcfce7';
        color = '#166534';
    }

    if (status === 'rejected') {
        backgroundColor = '#fee2e2';
        color = '#991b1b';
    }

    return (
        <span style={{ ...styles.statusBadge, backgroundColor, color }}>
            {status.toUpperCase()}
        </span>
    );
};

const styles = {
    page: {
        minHeight: '100vh',
        backgroundColor: '#f1f5f9',
        padding: '30px',
        fontFamily: 'Arial, sans-serif'
    },
    header: {
        backgroundColor: '#0f172a',
        color: 'white',
        padding: '24px',
        borderRadius: '14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px',
        flexWrap: 'wrap',
        boxShadow: '0 10px 20px rgba(15, 23, 42, 0.2)'
    },
    title: {
        margin: 0,
        fontSize: '28px'
    },
    subtitle: {
        margin: '6px 0 0',
        color: '#cbd5e1'
    },
    headerActions: {
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap'
    },
    walletBtn: {
        padding: '10px 16px',
        backgroundColor: '#f97316',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    homeBtn: {
        padding: '10px 16px',
        backgroundColor: '#2563eb',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    logoutBtn: {
        padding: '10px 16px',
        backgroundColor: '#dc2626',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        margin: '25px 0'
    },
    statCard: {
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '14px',
        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)'
    },
    statTitle: {
        margin: 0,
        color: '#64748b',
        fontWeight: 'bold'
    },
    statValue: {
        margin: '10px 0 0',
        fontSize: '36px'
    },
    filterBar: {
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
        flexWrap: 'wrap'
    },
    filterBtn: {
        padding: '10px 18px',
        border: '1px solid #cbd5e1',
        backgroundColor: 'white',
        color: '#334155',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    activeFilterBtn: {
        padding: '10px 18px',
        border: '1px solid #2563eb',
        backgroundColor: '#2563eb',
        color: 'white',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    card: {
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '14px',
        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)'
    },
    sectionTitle: {
        marginTop: 0,
        color: '#0f172a'
    },
    emptyText: {
        color: '#64748b',
        fontWeight: 'bold',
        padding: '20px 0'
    },
    tableWrapper: {
        width: '100%',
        overflowX: 'auto'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse'
    },
    th: {
        textAlign: 'left',
        padding: '14px',
        backgroundColor: '#f8fafc',
        color: '#334155',
        borderBottom: '1px solid #e2e8f0',
        whiteSpace: 'nowrap'
    },
    tr: {
        borderBottom: '1px solid #e2e8f0'
    },
    td: {
        padding: '14px',
        verticalAlign: 'top',
        color: '#0f172a'
    },
    description: {
        margin: '6px 0',
        color: '#64748b',
        fontSize: '14px',
        maxWidth: '320px',
        lineHeight: '1.4'
    },
    tag: {
        display: 'inline-block',
        backgroundColor: '#dbeafe',
        color: '#1d4ed8',
        padding: '4px 8px',
        borderRadius: '999px',
        fontSize: '11px',
        fontWeight: 'bold'
    },
    walletText: {
        display: 'inline-block',
        maxWidth: '180px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        color: '#475569',
        fontSize: '13px'
    },
    statusBadge: {
        display: 'inline-block',
        padding: '6px 10px',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: 'bold'
    },
    actionButtons: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap'
    },
    approveBtn: {
        padding: '8px 12px',
        backgroundColor: '#16a34a',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    rejectBtn: {
        padding: '8px 12px',
        backgroundColor: '#dc2626',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    pendingBtn: {
        padding: '8px 12px',
        backgroundColor: '#f59e0b',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold'
    }
};

export default ManagerDashboard;