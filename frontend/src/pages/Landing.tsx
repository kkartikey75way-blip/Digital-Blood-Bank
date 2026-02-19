import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Activity, ShieldPlus, Users, ArrowRight, Droplets } from "lucide-react";

const Landing = () => {
    const navigate = useNavigate();

    const stats = [
        { label: "Active Donors", value: "10,000+", icon: <Users className="w-5 h-5" /> },
        { label: "Partner Hospitals", value: "500+", icon: <Activity className="w-5 h-5" /> },
        { label: "Lives Impacted", value: "25,000+", icon: <Heart className="w-5 h-5" /> },
        { label: "Emergency Fulfilled", value: "98%", icon: <ShieldPlus className="w-5 h-5" /> },
    ];

    const features = [
        {
            icon: <Heart className="w-8 h-8 text-red-500" />,
            title: "Save Lives",
            description: "Your simple donation can save up to three lives. Be a hero in your community today.",
            color: "red"
        },
        {
            icon: <Activity className="w-8 h-8 text-blue-500" />,
            title: "Real-time Tracking",
            description: "Track blood availability and emergency requests in real-time with geographic precision.",
            color: "blue"
        },
        {
            icon: <ShieldPlus className="w-8 h-8 text-green-500" />,
            title: "Secure & Trusted",
            description: "Verified hospitals and donors ensure a safe, transparent, and seamless blood transfusion process.",
            color: "green"
        },
        {
            icon: <Users className="w-8 h-8 text-purple-500" />,
            title: "Community Driven",
            description: "Join thousands of selfless donors and top-tier hospitals in our rapidly growing life-saving network.",
            color: "purple"
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <div className="min-h-screen bg-mesh selection:bg-red-100 selection:text-red-600">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 glass-card px-6 py-4 border-b border-white/20">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 group cursor-pointer"
                    >
                        <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-xl shadow-red-200 group-hover:rotate-12 transition-transform duration-500">
                            <Heart className="w-7 h-7 text-white fill-current" />
                        </div>
                        <span className="text-2xl font-black tracking-tight text-slate-800">
                            Blood<span className="text-red-600">Bank</span>
                        </span>
                    </motion.div>

                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => navigate("/login")}
                            className="text-slate-600 font-bold hover:text-red-600 transition-colors uppercase text-xs tracking-widest"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => navigate("/register")}
                            className="btn-primary shimmer shadow-xl"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-32 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-7"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-3 px-5 py-2.5 bg-red-50 text-red-600 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-8 border border-red-100/50 shadow-sm"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                            </span>
                            Emergency Blood Support 24/7
                        </motion.div>

                        <h1 className="text-7xl lg:text-8xl font-black text-slate-900 leading-[0.95] mb-8 tracking-tighter">
                            Connecting <span className="gradient-text">Life</span> <br />
                            Through <span className="relative inline-block">
                                Every Drop.
                                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 15C50 15 150 5 295 15" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" opacity="0.2" />
                                </svg>
                            </span>
                        </h1>

                        <p className="text-xl text-slate-500 mb-12 leading-relaxed max-w-2xl font-medium">
                            Join the digital revolution in healthcare. Our platform connects donors and recipients with surgical precision, saving lives one connection at a time.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5">
                            <button
                                onClick={() => navigate("/register")}
                                className="btn-primary text-base px-10 py-5 group shadow-2xl shadow-red-200"
                            >
                                Donate Blood Now
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                            </button>
                            <button
                                onClick={() => navigate("/login")}
                                className="btn-outline text-base px-10 py-5 bg-white/50 backdrop-blur-sm border-white/50"
                            >
                                Request Support
                            </button>
                        </div>

                        {/* Live Ticker */}
                        <div className="mt-20 py-8 border-y border-slate-200/60 overflow-hidden relative">
                            <div className="flex items-center gap-12 animate-gradient-x">
                                {stats.map((stat, i) => (
                                    <div key={i} className="flex items-center gap-4 shrink-0">
                                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
                                            {stat.icon}
                                        </div>
                                        <div>
                                            <p className="text-2xl font-black text-slate-900 leading-none">{stat.value}</p>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="lg:col-span-5 relative"
                    >
                        <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-3xl alternate-float">
                            <div className="aspect-[4/5] bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center p-16 relative overflow-hidden">
                                <div className="absolute inset-0 opacity-20">
                                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent scale-150" />
                                </div>
                                <motion.div
                                    className="relative animate-float"
                                    animate={{
                                        filter: ["drop-shadow(0 0 20px rgba(255,255,255,0.3))", "drop-shadow(0 0 40px rgba(255,255,255,0.5))", "drop-shadow(0 0 20px rgba(255,255,255,0.3))"]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                >
                                    <Heart className="w-72 h-72 text-white fill-current opacity-95" />
                                    <Activity className="absolute bottom-4 -right-4 w-24 h-24 text-red-200/50" />
                                </motion.div>
                            </div>
                        </div>

                        {/* Status Cards floating around */}
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="absolute -right-8 top-1/4 glass-card p-6 rounded-[2rem] shadow-2xl z-20"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                                    <ShieldPlus className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="font-black text-sm text-slate-900">Donor Verified</p>
                                    <p className="text-[10px] text-slate-500 font-bold">2 mins ago</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 1.2 }}
                            className="absolute -left-8 bottom-1/4 glass-card p-6 rounded-[2rem] shadow-2xl z-20"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
                                    <Droplets className="w-5 h-5 text-white fill-current" />
                                </div>
                                <div>
                                    <p className="font-black text-sm text-slate-900">AB+ Needed</p>
                                    <p className="text-[10px] text-slate-500 font-bold">Urgent Nearby</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-32 relative bg-white rounded-t-[5rem] -mt-10 z-10 shadow-[0_-40px_100px_rgba(0,0,0,0.03)]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20 text-center lg:text-left">
                        <div className="max-w-2xl">
                            <h2 className="text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight">The Future of <span className="text-red-600">Donation</span>.</h2>
                            <p className="text-lg text-slate-500 font-medium">
                                We bridge the gap between availability and necessity with real-time intelligence and community trust.
                            </p>
                        </div>
                        <button className="btn-outline font-black uppercase text-xs tracking-[0.2em] px-8 py-4">Explore Platform</button>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ y: -15 }}
                                className="group p-10 rounded-[3rem] bg-slate-50 border-2 border-slate-100 hover:bg-white hover:border-red-100 hover:shadow-3xl hover:shadow-red-50 transition-all duration-500"
                            >
                                <div className={`w-20 h-20 rounded-[2rem] bg-white flex items-center justify-center shadow-lg mb-8 group-hover:bg-red-50 group-hover:scale-110 transition-all duration-500`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{feature.title}</h3>
                                <p className="text-slate-500 leading-relaxed font-medium">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Interactive How it works */}
            <section className="py-32 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-24">
                        <h2 className="text-5xl font-black text-slate-900 mb-4">How it <span className="text-red-600 underline decoration-red-600/20 underline-offset-8">Operates</span></h2>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Three simple steps to save a life</p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-16 relative">
                        {/* Connecting Line */}
                        <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-dashed-line opacity-20 -translate-y-1/2" />

                        {[
                            { step: "01", title: "Register Account", desc: "Join as a donor or hospital in under 2 minutes with secure KYC." },
                            { step: "02", title: "Smart Discovery", desc: "Our AI matches donor availability with regional hospital demand." },
                            { step: "03", title: "Make Impact", desc: "Donate at verified centers and track your contribution impact live." }
                        ].map((s, i) => (
                            <div key={i} className="relative z-10 text-center flex flex-col items-center">
                                <div className="w-24 h-24 rounded-[2.5rem] bg-white border-2 border-slate-200 flex items-center justify-center text-3xl font-black text-red-600 shadow-xl mb-8 hover:bg-slate-900 hover:text-white transition-colors duration-500">
                                    {s.step}
                                </div>
                                <h4 className="text-2xl font-black text-slate-900 mb-3">{s.title}</h4>
                                <p className="text-slate-500 font-medium max-w-xs">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-6xl mx-auto bg-slate-900 rounded-[4rem] p-16 lg:p-24 relative overflow-hidden text-center"
                >
                    <div className="relative z-10">
                        <h2 className="text-5xl lg:text-7xl font-black text-white mb-8 tracking-tighter">Become the Reason <br /> a <span className="text-red-500">Heart Beat</span> Continues.</h2>
                        <p className="text-slate-400 text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
                            Every minute, someone needs blood. Your small act of kindness is a giant leap for humanity. Sign up and be ready.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <button
                                onClick={() => navigate("/register")}
                                className="btn-primary bg-white text-slate-900 hover:bg-red-50 px-12 py-5 text-xl shimmer shadow-2xl"
                            >
                                Start Saving Lives
                            </button>
                            <button
                                onClick={() => navigate("/login")}
                                className="px-12 py-5 rounded-2xl border-2 border-white/20 text-white font-black uppercase text-xs tracking-widest hover:bg-white/5 transition-all"
                            >
                                Contact Support
                            </button>
                        </div>
                    </div>
                    {/* Decorative Gradients */}
                    <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-red-600/30 blur-[120px] -translate-y-1/2 translate-x-1/2 animate-pulse-glow" />
                    <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-blue-600/20 blur-[120px] translate-y-1/2 -translate-x-1/2 animate-pulse-glow" />
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-6 border-t border-slate-200 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-12 mb-20">
                        <div className="col-span-2">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Heart className="w-6 h-6 text-white fill-current" />
                                </div>
                                <span className="text-2xl font-black tracking-tight text-slate-800">
                                    Blood<span className="text-red-600">Bank</span>
                                </span>
                            </div>
                            <p className="text-slate-500 font-medium max-w-sm leading-relaxed">
                                Empowering blood donation through technology. We make it easy for donors to give and hospitals to receive, ensuring a reliable supply chain of life.
                            </p>
                        </div>
                        <div>
                            <h5 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-8">Platform</h5>
                            <ul className="space-y-4 text-slate-500 font-bold text-sm">
                                <li><button className="hover:text-red-600 transition-colors">Find Donors</button></li>
                                <li><button className="hover:text-red-600 transition-colors">Hospital Login</button></li>
                                <li><button className="hover:text-red-600 transition-colors">Emergency Portal</button></li>
                                <li><button className="hover:text-red-600 transition-colors">Live Stock</button></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-8">Network</h5>
                            <ul className="space-y-4 text-slate-500 font-bold text-sm">
                                <li><button className="hover:text-red-600 transition-colors">About Us</button></li>
                                <li><button className="hover:text-red-600 transition-colors">Partner Hospitals</button></li>
                                <li><button className="hover:text-red-600 transition-colors">Medical Council</button></li>
                                <li><button className="hover:text-red-600 transition-colors">Privacy Hub</button></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
                        <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">
                            © 2026 BloodBank Open-Network. All rights reserved.
                        </p>
                        <div className="flex gap-8 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">
                            <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
                            <a href="#" className="hover:text-slate-900 transition-colors">Legal</a>
                            <a href="#" className="hover:text-slate-900 transition-colors">Security</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
