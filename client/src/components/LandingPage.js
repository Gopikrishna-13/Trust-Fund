import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const defaultImages = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDrXXNCeH037aYf7dRWuY0gmGEg23mVe6ZYI1QSjjZ027SSUUR3GLU0IWPFEoVlKYHey2FYRpnMvfRLpymt_7Ug_3LWKCF8Yy_78MrfUZK9yZabNnr5SeWP67voyk3jgepiMJL-ZbHUSpboisW-e7qpVD6teY1Pu-YtDEBBupYl2tuUG4fJl9pvIsPlJRB0T5bWIsbPfhII_tOB5kquMKNR32pgLGP_PM7iWPCgXAIh3Lmm6ylt5LysPgbFbR2USVa3fgydIyeJXpks",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDZATmsoR0Vimi2LsbAKt0qnOzuOKlTPeHV7nqvcKuQp737fIF8vU3evyO7yKDReZ7PP7sp0yIG-b5LO26KP5dpaNRH4JuqKxTdDSLjTvAW_fXhIlHGPKpYnechQbzeXuY9GTi5On74OVkERgwyr6XbUfcLodcesXG5hoJvSSQ7X-l-bt-MrRBnv8UI3AWCwj47Y2h8XpDxhF1oSBJEZCBxzE2l0ki7WMoz0YmrfPXvxuI2GRY5ZOnytRdWLX3cztPtapxXTqdMf61U",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAuDvCN8EmPmySPlX1iv4NInuKH3RGSdq7Vnguq-Y8x4_Yz8LKc5Q3NS0WR56C5E0ZzFbs9Zlbk-lN5z706fRoQZb9JoQUBRsYzSok-ql9la1tw3BbVk3qAx60_rYExkimX0Lx-xvq0yMCL7D9x56FCQz_XwSCfA-ILyuKyWxVzuMXAyuHP6JbWVV9VB0QrnJGNY0qv2EpGB2OcjMgSTMULzRZjFf7ICCIqU7T20ts6hIZZOVNHwfzUiiohdYH7N7wVYy2VLgoVOcwy"
];

const LandingPage = () => {
    const navigate = useNavigate();

    const isLoggedIn = !!localStorage.getItem('token');
    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        let storedCampaigns = JSON.parse(localStorage.getItem('trustFundCampaigns'));
        
        // Auto-fix the bad placeholder data generated earlier
        if (storedCampaigns && storedCampaigns.some(c => c.goal === 65000 || c.raised === 42250)) {
            storedCampaigns = null; 
        }

        if (storedCampaigns && storedCampaigns.length > 0) {
            setCampaigns(storedCampaigns);
        } else {
            const defaultCampaigns = [
                { id: '1', tag: 'SUSTAINABILITY', tagColor: 'secondary', title: 'Clean Water for Sahel', raised: 2.5, goal: 5.0, description: 'Implementing solar-powered filtration systems to provide potable water to over 50 villages.', link: '/impact/clean-water' },
                { id: '2', tag: 'EDUCATION', tagColor: 'primary', title: 'Tech-Forward Schools', raised: 1.2, goal: 3.0, description: 'Providing tablets and high-speed internet to underfunded rural primary schools.', link: '/impact/tech-schools' },
                { id: '3', tag: 'HEALTHCARE', tagColor: 'tertiary', title: 'Mobile Health Units', raised: 0.8, goal: 10.0, description: 'Equipping two mobile vans with basic medical diagnostic tools for remote mountain communities.', link: '/impact/health-units' }
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
            navigate('/');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container">
            {/* TopNavBar */}
            <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl shadow-sm shadow-blue-900/5 tonal-shift">
                <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
                    <div className="text-2xl font-extrabold tracking-tight text-blue-700">Smart Crowd Fund</div>
                    <div className="hidden md:flex items-center gap-8 font-['Manrope'] font-semibold text-sm">
                        <a className="text-blue-700 border-b-2 border-blue-600 pb-1" href="#campaigns">Campaigns</a>
                        {isLoggedIn && (
                            <span onClick={() => navigate('/add-campaign')} className="text-slate-600 hover:text-blue-600 transition-all duration-300 cursor-pointer">
                                + Add Campaign
                            </span>
                        )}
                        <a className="text-slate-600 hover:text-blue-600 transition-all duration-300" href="#about">About Us</a>
                        <a className="text-slate-600 hover:text-blue-600 transition-all duration-300" href="#vision">Vision</a>
                        <a className="text-slate-600 hover:text-blue-600 transition-all duration-300" href="#mission">Mission</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={handleAuthButton} className="hidden lg:block text-slate-600 hover:text-blue-600 font-semibold text-sm transition-all">
                            {isLoggedIn ? 'Sign Out' : 'Sign In'}
                        </button>
                        <button onClick={() => navigate('/impact/smartcrowdfund-helping-hands')} className="bg-gradient-to-br from-primary to-primary-container text-white px-6 py-2.5 rounded-md font-semibold text-sm scale-95 active:scale-90 transition-transform shadow-lg shadow-primary/20">Donate Now</button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-[921px] flex items-center pt-20 overflow-hidden bg-surface">
                <div className="absolute inset-0 z-0">
                    <img alt="Community assistance" className="w-full h-full object-cover opacity-10 blur-[2px]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVanoEizclwASGLPAtp4lWkbWxw70IGxq0Ze_iuXuuImBVy_HCrw_SJRZdTNBDZ7p98SpMwxSZRa1lk-LZI-qXwL9kzJa2BE9zruUzuiEK0ojMIn7soDM0EgMQO8Bh6r7vYs6Vuq36VtX9FNzBdRPdiV0sPtMM00ky-cZKhXbweEmaEImnlmwO5Wnj4valKp0jH1H8hZ31LNKXvsaqPFDtfVSy-E5EJ-OCUR23OU3gkjPrZcGOWvWgYw9rSmoZeraLSLO6txDFidd-" />
                    <div className="absolute inset-0 bg-gradient-to-b from-surface via-transparent to-surface-container-low"></div>
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container font-label text-sm font-bold tracking-wide">COMMUNITY DRIVEN</span>
                        <h1 className="text-6xl md:text-7xl font-extrabold text-on-surface leading-[1.1] tracking-tight">
                            Empowering <span className="text-primary">Change</span>, One Contribution at a Time
                        </h1>
                        <p className="text-xl text-on-surface-variant leading-relaxed max-w-xl">
                            Join a global movement of collective impact. We bridge the gap between visionary projects and the resources they need to thrive.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <button className="bg-secondary text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-secondary/20 transition-all cursor-pointer">Explore Campaigns</button>
                            <button className="px-8 py-4 rounded-xl font-bold text-lg text-primary border border-outline-variant hover:bg-surface-container-high transition-all cursor-pointer">Our Story</button>
                        </div>
                    </div>
                    <div className="hidden lg:block relative">
                        <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700">
                            <img alt="Helping hands" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIvuAOBSqOUp-d9kjKjPZnQ5BzcN-klYN1fNSQN61tTy6hOKaQbakLZwAx-ljH7ViaqZ44e2WaPz_qIhS8qblmdz4WGKpuGwBER9Wii13h51CogmFSzULYpH-qHh-750svLcNizNTkEa4K1KSXcC4jKmJD8iH2vY4l4hYlDzlWkkBr5EnppIXdTDSgvmQkM2UlUzWTuHNbmnbDGfyL2mm_I1OKo1FYj0eDziok2AsyT0RQBoPL_DP_l6anQLOpAffUeeZLs9EBlJ0h" />
                        </div>
                        <div className="absolute -bottom-8 -left-8 bg-surface-container-lowest p-6 rounded-2xl shadow-xl max-w-[240px]">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>volunteer_activism</span>
                                <span className="font-headline font-bold text-2xl">45.5 ETH</span>
                            </div>
                            <p className="text-sm text-on-surface-variant font-medium">₹ 72.8 Lakhs Raised for community projects this year.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Active Campaigns */}
            <section id="campaigns" className="py-24 bg-surface-container-low">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="flex justify-between items-end mb-16">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl font-extrabold text-on-surface mb-4">Active Campaigns</h2>
                            <p className="text-on-surface-variant text-lg">Direct your support toward initiatives making real-world differences today.</p>
                        </div>
                        <button className="text-primary font-bold flex items-center gap-2 hover:underline cursor-pointer">
                            View All <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {campaigns.map((camp, index) => {
                            const percent = Math.min(100, Math.round((parseFloat(camp.raised) / parseFloat(camp.goal)) * 100)) || 0;
                            const image = defaultImages[index % defaultImages.length];
                            const tag = camp.tag || 'IMPACT';
                            const tagStyle = camp.tagColor || 'secondary';

                            return (
                                <div key={camp.id} className="bg-surface-container-lowest rounded-[1.5rem] overflow-hidden flex flex-col group transition-all duration-300 border border-transparent hover:border-outline-variant/30">
                                    <div className="h-64 overflow-hidden relative bg-surface-container-high">
                                        <img alt={camp.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={image} />
                                        <div className="absolute top-4 left-4">
                                            <span className={`bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-${tagStyle}`}>{tag}</span>
                                        </div>
                                    </div>
                                    <div className="p-8 flex-grow flex flex-col">
                                        <h3 className="text-2xl font-bold mb-3">{camp.title}</h3>
                                        <p className="text-on-surface-variant text-sm mb-6 flex-grow leading-relaxed">{camp.description}</p>
                                        
                                        {/* Progress Bar (Trust Bar) */}
                                        <div className="space-y-1 mb-6">
                                            <div className="flex justify-between text-sm font-bold">
                                                <span>{percent}% Raised</span>
                                                <span className="text-primary">{camp.raised} ETH / {camp.goal} ETH</span>
                                            </div>
                                            <div className="flex justify-between text-xs text-on-surface-variant/80 font-medium pb-1">
                                                <span></span>
                                                <span>(₹{(parseFloat(camp.raised) * 160000).toLocaleString('en-IN')} / ₹{(parseFloat(camp.goal) * 160000).toLocaleString('en-IN')})</span>
                                            </div>
                                            <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-secondary to-secondary-fixed" style={{ width: `${percent}%` }}></div>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDonateAction(camp.link)} className="w-full bg-secondary text-white py-3 rounded-xl font-bold hover:bg-on-secondary-container transition-colors cursor-pointer">Donate</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* About Us */}
            <section id="about" className="py-24 bg-surface overflow-hidden">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="relative order-2 lg:order-1">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <img className="rounded-2xl h-48 w-full object-cover shadow-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmlpaYoSPIZ1zUy8-1MeLnG_1F3DC-v_onNG6Luk-MFKtcCex6ArDJC6AxiPMs3csf-yqVzS2cScrOErRSlaVc_TMqRxmkmzfGnB0zMW8zro00Fqg6e6yy3FKwj9ZcRS-hY_bFY-ul2sOmcDqEgSylTNQI6-1XPwhjREh0rGt30qZ3yMue9k--IGrcwGovIjOSTPHhcYLW1_mHAtx4R1pNELI2zAfVwweVKMScim2Lpg5s-fnkckEWblwIjaiiqdmyQKv7wd4a_Ct1" alt="" />
                                    <img className="rounded-2xl h-64 w-full object-cover shadow-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPR8vUTunloaY7Korwm3GvcxiRhF96uBzGuJpjJMPahGELCN_1XRXPYvbfN4ikgDyzkMUHvr1Lq0yEMkyjKs10AnFYPBKfPmsNF1v0UvjCfgMliSSy7-3BzG0ws7Tt_p4HamvHB-C34-MtapE-w80q3bSXJsScs-bpOWW_nFEqm6lVU5JXJJBVSOgnPk2B3A-35KRo6EQjQrG3uuvruzpHnjDBBhpIQxEJy9tmOZvlya6XNwHLqAuMvu1QyhxKVR0KoGGxtlfzTPvx" alt="" />
                                </div>
                                <div className="space-y-4 pt-8">
                                    <img className="rounded-2xl h-64 w-full object-cover shadow-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBKPh8wR-fJYqIzBJCecembirnG75cVp-u7JAHYrJr9q-pRp34d_tjJ8uqvthSjjyyBQOKt5oaXK1CRW9kyoWG96PvPgjz9MXT6i4lZ-8elifJu2ySzes7h7cJ4q6f9_EaOqp7hPLMgxKhhi7ANK0t6E9K65Qvi85j-wjlSkdX0O3aOv6JVfTBXbby23PUC8bD13h2xMsC8tRtYIrcpDEpYkYgSf91CzDOcuDCExJWQ1-SEMlpcYvWZNkJi4023CZdCNIdHJqsZJ00" alt="" />
                                    <img className="rounded-2xl h-48 w-full object-cover shadow-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMxy3LisyN1_k4FtXHV_XEB8Iy5M8Hg4TwA0bXIfmiaClBYXyisK4U7BIKk3cP4oIyMBQXQtkluST4CTrslPQxWWl7v3mOpI19BDhfsGmXarN7qKw6MUWGiP0NOLdmOriDZASD0u76j0FokqbSL1zxSxun4EIaEaUDgcJSkD_vpHI6_OlG9LndiReajz744oM2HuIoOXQsLpHzvKHtuAT0tFV6iY_YPj8P9LMR9KjJuaFO3zsSGVFCrECPlQILrzvXOU4zBlY262_V" alt="" />
                                </div>
                            </div>
                            <div className="absolute -z-10 -top-20 -left-20 w-64 h-64 bg-primary-container/10 rounded-full blur-3xl"></div>
                        </div>
                        <div className="order-1 lg:order-2 space-y-8">
                            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Radical Transparency in <span className="text-primary">Collective Funding</span></h2>
                            <p className="text-on-surface-variant text-lg leading-relaxed">
                                Smart Crowd Fund was born from a simple observation: billions are spent on causes, but millions never reach their intended destination. We leverage smart technology and community verification to ensure every cent makes its way to the front lines.
                            </p>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-secondary">verified</span>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-1">Vetted Projects</h4>
                                        <p className="text-on-surface-variant">Every campaign undergoes a rigorous 3-stage verification process before going live.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-primary">visibility</span>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-1">Real-time Impact</h4>
                                        <p className="text-on-surface-variant">Donors receive direct updates and financial reports directly from the project leads.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision & Mission (Bento Grid) */}
            <section id="vision" className="py-24 bg-surface-container-low">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold mb-4">Our Core Philosophy</h2>
                        <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Mission Card */}
                        <div id="mission" className="md:col-span-2 bg-surface-container-lowest p-10 rounded-[2rem] shadow-sm flex flex-col md:flex-row gap-8 items-center border border-outline-variant/10">
                            <div className="md:w-1/2 space-y-4">
                                <span className="text-primary font-bold tracking-widest text-xs uppercase">Our Mission</span>
                                <h3 className="text-3xl font-bold">Bridging Resources to Reality</h3>
                                <p className="text-on-surface-variant leading-relaxed">To democratize access to capital for social entrepreneurs and community leaders who are often overlooked by traditional financial institutions.</p>
                            </div>
                            <div className="md:w-1/2">
                                <img className="rounded-2xl h-64 w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgBqAEKJnIx1y9ZsQDf-8FrxUWlTMJjpr6iu_6RcLzh7zxkeqIvTAWCXBIuCH4NUHN-mcH5ibrFniGvihF_4MtA61CnJw-W1a4R6qhlggN6DwG-4_46eASqVGyAD4Cxdgxrg_7ZHV9WytVnyQBeFbefY6Go6aXkqBTR28itgd9IfjvrY9IgaT5Six2zVgA7CTMqoDx1JEUco7p-wm8eG13F5f02EijJXGQGpuB85bVXgl77vFPITIP8ndZLixNzm7ClA6h_X56pjIU" alt="" />
                            </div>
                        </div>
                        
                        {/* Goal 1 */}
                        <div className="bg-primary text-white p-10 rounded-[2rem] flex flex-col justify-between">
                            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>public</span>
                            <h3 className="text-2xl font-bold mt-8">Global Reach</h3>
                            <p className="text-primary-fixed mt-2">Active campaigns in over 45 countries across 6 continents.</p>
                        </div>
                        
                        {/* Goal 2 */}
                        <div className="bg-secondary text-white p-10 rounded-[2rem] flex flex-col justify-between">
                            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
                            <h3 className="text-2xl font-bold mt-8">Inclusive Growth</h3>
                            <p className="secondary-fixed mt-2 text-secondary-fixed">Prioritizing projects that foster sustainable local economies.</p>
                        </div>

                        {/* Vision Card */}
                        <div className="md:col-span-2 bg-surface-container-lowest p-10 rounded-[2rem] shadow-sm flex flex-col md:flex-row-reverse gap-8 items-center border border-outline-variant/10">
                            <div className="md:w-1/2 space-y-4">
                                <span className="text-primary font-bold tracking-widest text-xs uppercase">Our Vision</span>
                                <h3 className="text-3xl font-bold">A World of Shared Prosperity</h3>
                                <p className="text-on-surface-variant leading-relaxed">We envision a future where every brilliant idea for social good has the path to funding it deserves, powered by the collective will of global citizens.</p>
                            </div>
                            <div className="md:w-1/2">
                                <img className="rounded-2xl h-64 w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWN2msOPpEPDaob0gDLrAFIaatJt6DKkxS6u9b3nuBXtROm0NVa9OSEHbNWcJ1rcIi_uO2lYpVPTN4WcWh3xwlAYjonYWtbRWYxigahtSFr6oEb25w31Bcz9e4Iso5ooNg1t-36-DdrDujOWH_yYuDhazTw3enD5KOnheeU85Ba740LgGdwHSINEKhQxMZf2EPwTRWMxkEawIJI60w6JZDIP8iu41S_Pfz6g4cxfBcMI8r5Rsjm63dREH0p4xwjvYmSvb1Lb0SmE1j" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-50 border-t border-slate-200/15">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-12 py-16 max-w-7xl mx-auto">
                    <div className="space-y-6">
                        <div className="text-xl font-bold text-blue-800">Smart Crowd Fund</div>
                        <p className="font-['Inter'] text-sm text-slate-500 max-w-sm leading-relaxed">
                            Smart Crowd Fund is a registered crowdfunding platform. Empowering change through transparent, community-vetted funding models for a more equitable future.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h5 className="font-bold text-on-surface">Platform</h5>
                            <ul className="space-y-2 font-['Inter'] text-sm text-slate-500">
                                <li><a className="hover:text-blue-500 hover:underline transition-all" href="#campaigns">Campaigns</a></li>
                                <li><a className="hover:text-blue-500 hover:underline transition-all" href="#about">About Us</a></li>
                                <li><a className="hover:text-blue-500 hover:underline transition-all" href="#vision">Vision</a></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h5 className="font-bold text-on-surface">Legal</h5>
                            <ul className="space-y-2 font-['Inter'] text-sm text-slate-500">
                                <li><a className="hover:text-blue-500 hover:underline transition-all" href="#privacy">Privacy Policy</a></li>
                                <li><a className="hover:text-blue-500 hover:underline transition-all" href="#terms">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;