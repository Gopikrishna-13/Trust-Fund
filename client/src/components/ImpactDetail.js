import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CONTRACT_ADDRESS } from '../config';

const ImpactDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [campaign, setCampaign] = useState(null);
    const [copied, setCopied] = useState(false);
    
    const [donors] = useState([
        { name: "Sarah J.", address: "0x123...456", amount: "0.5" },
        { name: "Robert M.", address: "Alice", amount: "1.2" },
        { name: "Anita L.", address: "0xABC...DEF", amount: "0.25" }
    ]);

    useEffect(() => {
        const savedCampaigns = JSON.parse(localStorage.getItem('trustFundCampaigns') || '[]');
        const currentCampaign = savedCampaigns.find(c => c.link.includes(id));
        
        if (currentCampaign) {
            setCampaign(currentCampaign);
        } else if (id === 'smartcrowdfund-helping-hands') {
            setCampaign({
                title: "SmartCrowdFund Helping Hands",
                description: "Support our platform's core initiative to securely connect generous donors with meaningful projects. Your contribution here helps us keep our services free and expand our global reach.",
                raised: 0.1,
                goal: 0.5,
                tag: 'OFFICIAL',
                emoji: '🤝'
            });
        } else {
            setCampaign({
                title: "Unknown Campaign",
                description: "This campaign could not be found.",
                raised: 0,
                goal: 1,
                tag: '404'
            });
        }
    }, [id]);

    const handleDonateClick = () => {
        navigate(`/checkout/${id}`);
    };

    const handleShareClick = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!campaign) {
        return <div className="flex items-center justify-center min-h-screen text-xl text-on-surface-variant bg-surface">Loading campaign details...</div>;
    }

    const raisedEth = parseFloat(campaign.raised) || 0;
    const goalEth = parseFloat(campaign.goal) || 1;
    const percent = Math.min(100, Math.round((raisedEth / goalEth) * 100)) || 0;

    const heroImage = campaign.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuDlNTuF_BTFURd5uRREwbsQOW2QagSjneOgYStXECRuqVcKXw9RYdvYZhv04VHd1_rNndA5v_CE66yK-mTTFejOgeH7BpUdHlSJWjIOHarx-e04cUQhif4dQEKvSQH3cEtDH5x6l-nzZQMUTqBKLx3vtOtQQPOSJbsXymL7LPqgveZHOHYLglSrbk9BAt6Ee6H76T2h3cBAeTtQp2g5wsGTEf2VJnRCFXkNYapbHtuBDVHOcmFJQEaqPKJBkOKK3-rt1cr2r2LXwkJz";

    return (
        <div className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen">
            {/* TopNavBar */}
            <nav className="fixed top-0 w-full z-50 bg-[#faf8ff]/70 backdrop-blur-xl shadow-[0_20px_40px_rgba(25,27,36,0.06)]">
                <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
                    <div className="flex items-center gap-8 cursor-pointer" onClick={() => navigate('/')}>
                        <span className="text-2xl font-black text-[#0061FE] tracking-tighter">Smart Crowd Fund</span>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        <button onClick={() => navigate('/')} className="text-slate-600 hover:text-[#0061FE] font-bold transition-colors">Volver/Back</button>
                    </div>
                </div>
            </nav>
            
            <main className="pt-24 pb-16">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-6 md:px-8 mb-16">
                    <div className="relative w-full h-[600px] rounded-[2rem] overflow-hidden group shadow-2xl bg-surface-container-high">
                        <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={heroImage} alt={campaign.title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full max-w-3xl">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container font-bold text-xs uppercase tracking-widest mb-6">Active Campaign</span>
                            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-none tracking-tight">{campaign.emoji} {campaign.title}</h1>
                            <p className="text-xl text-white/90 mb-8 max-w-2xl font-light leading-relaxed">{campaign.description}</p>
                            <div className="flex flex-wrap gap-4">
                                <button onClick={handleDonateClick} className="px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold text-lg hover:scale-95 transition-all shadow-lg cursor-pointer">Donate Now</button>
                                <button onClick={handleShareClick} className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl font-bold text-lg hover:bg-white/20 transition-all cursor-pointer">
                                    {copied ? 'Copied to Clipboard!' : 'Share Campaign'}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats & Action Grid */}
                <section className="max-w-7xl mx-auto px-6 md:px-8 mb-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Why Section */}
                        <div className="lg:col-span-8 space-y-12">
                            <div className="bg-surface-container-low p-10 md:p-14 rounded-[2.5rem]">
                                <h2 className="text-4xl font-black mb-8 tracking-tight">Why We're Collecting</h2>
                                <div className="prose prose-lg max-w-none text-on-surface-variant leading-relaxed space-y-6">
                                    <p className="text-xl font-medium text-on-surface">This campaign focuses on essential needs and driving immediate, transparent impact.</p>
                                    <p>{campaign.description}</p>
                                    <p>Your contributions directly fuel our milestone-based smart contracts, ensuring the highest level of accountability.</p>
                                </div>
                            </div>
                            
                            {/* Financial Transparency */}
                            <div className="bg-surface-container-low p-10 md:p-14 rounded-[2.5rem]">
                                <div className="flex justify-between items-end mb-12">
                                    <div>
                                        <h2 className="text-4xl font-black tracking-tight mb-2">Where Your Money Goes</h2>
                                        <p className="text-on-surface-variant">Complete transparency in every dollar spent.</p>
                                    </div>
                                    <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                                </div>
                                <div className="flex flex-col md:flex-row items-center gap-12">
                                    <div className="relative w-64 h-64 flex-shrink-0">
                                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                            <circle className="stroke-surface-container-highest" cx="18" cy="18" fill="none" r="16" strokeWidth="4"></circle>
                                            <circle cx="18" cy="18" fill="none" r="16" stroke="#004bc9" strokeDasharray="60, 100" strokeWidth="4"></circle>
                                            <circle cx="18" cy="18" fill="none" r="16" stroke="#006e2a" strokeDasharray="20, 100" strokeDashoffset="-60" strokeWidth="4"></circle>
                                            <circle cx="18" cy="18" fill="none" r="16" stroke="#3450a9" strokeDasharray="15, 100" strokeDashoffset="-80" strokeWidth="4"></circle>
                                            <circle cx="18" cy="18" fill="none" r="16" stroke="#e1e2ee" strokeDasharray="5, 100" strokeDashoffset="-95" strokeWidth="4"></circle>
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-3xl font-black text-primary">100%</span>
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-outline">Impact</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                                        <div className="flex items-start gap-3">
                                            <div className="w-4 h-4 rounded-full bg-primary mt-1"></div>
                                            <div>
                                                <p className="font-bold text-lg leading-tight">60% Equipment / Core Goal</p>
                                                <p className="text-sm text-on-surface-variant">Direct materials</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-4 h-4 rounded-full bg-secondary mt-1"></div>
                                            <div>
                                                <p className="font-bold text-lg leading-tight">20% Logistics</p>
                                                <p className="text-sm text-on-surface-variant">Shipping &amp; deployment</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-4 h-4 rounded-full bg-tertiary mt-1"></div>
                                            <div>
                                                <p className="font-bold text-lg leading-tight">15% Maintenance</p>
                                                <p className="text-sm text-on-surface-variant">Support contract</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-4 h-4 rounded-full bg-surface-container-highest mt-1"></div>
                                            <div>
                                                <p className="font-bold text-lg leading-tight">5% Admin</p>
                                                <p className="text-sm text-on-surface-variant">Platform fees &amp; banking</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-outline-variant/30 text-sm">
                                    <p className="text-on-surface-variant mb-1"><strong>Blockchain Explorer</strong></p>
                                    <a href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1 font-bold">
                                        View Smart Contract on Etherscan <span className="material-symbols-outlined text-xs">open_in_new</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        
                        {/* Campaign Stats & Donors Sidebar */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0_20px_40px_rgba(25,27,36,0.06)] border border-outline-variant/15 sticky top-28">
                                <div className="mb-8">
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className="text-4xl font-black text-primary">{raisedEth} ETH</span>
                                        <span className="text-on-surface-variant font-medium">raised of {goalEth} ETH</span>
                                    </div>
                                    <div className="text-sm font-medium text-on-surface-variant mt-1 mb-4">
                                        (₹{(raisedEth * 160000).toLocaleString('en-IN')} / ₹{(goalEth * 160000).toLocaleString('en-IN')})
                                    </div>
                                    <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden mt-2">
                                        <div className="h-full bg-gradient-to-r from-secondary to-secondary-fixed" style={{ width: `${percent}%` }}></div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="p-4 rounded-xl bg-surface-container-low">
                                        <p className="text-xs font-bold text-outline uppercase tracking-wider mb-1">Backers</p>
                                        <p className="text-2xl font-black">12</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-surface-container-low">
                                        <p className="text-xs font-bold text-outline uppercase tracking-wider mb-1">Days Left</p>
                                        <p className="text-2xl font-black">14</p>
                                    </div>
                                </div>
                                <button onClick={handleDonateClick} className="w-full py-4 bg-secondary text-white rounded-xl font-bold text-lg hover:scale-[0.98] active:scale-100 transition-all mb-4 cursor-pointer">Fund this Project</button>
                                <p className="text-center text-sm text-on-surface-variant flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                                    Secure, encrypted transaction
                                </p>
                                
                                <div className="mt-10">
                                    <h3 className="font-black text-xl mb-6">Recent Donors</h3>
                                    <div className="space-y-6">
                                        {donors.map((donor, idx) => (
                                            <div key={idx} className="flex gap-4">
                                                <div className="w-10 h-10 rounded-full bg-surface-container-high text-primary flex items-center justify-center flex-shrink-0 font-bold">
                                                    {donor.name.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <p className="font-bold">{donor.name}</p>
                                                        <span className="text-secondary font-bold text-sm">{donor.amount} ETH</span>
                                                    </div>
                                                    <p className="text-sm text-on-surface-variant italic">"({donor.address}) Support block."</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full mt-6 py-2 text-primary font-bold text-sm hover:underline decoration-2">View all donors</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="w-full rounded-t-[1.5rem] bg-[#f2f3ff]">
                <div className="flex flex-col md:flex-row justify-between items-center w-full px-12 py-10 max-w-7xl mx-auto">
                    <div className="mb-8 md:mb-0">
                        <span className="font-['Manrope'] font-extrabold text-[#0061FE] text-2xl">Smart Crowd Fund</span>
                        <p className="font-['Inter'] text-sm text-slate-500 mt-2">© 2024 Smart Crowd Fund. Cultivating growth through community.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ImpactDetail;