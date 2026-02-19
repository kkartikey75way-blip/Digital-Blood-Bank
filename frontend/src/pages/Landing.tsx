import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Activity, ShieldPlus, Users, ArrowRight } from "lucide-react";

const Landing = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <Heart className="w-6 h-6 text-red-500" />,
            title: "Save Lives",
            description: "Your simple donation can save up to three lives. Be a hero today.",
        },
        {
            icon: <Activity className="w-6 h-6 text-blue-500" />,
            title: "Real-time Tracking",
            description: "Track blood availability and emergency requests in real-time.",
        },
        {
            icon: <ShieldPlus className="w-6 h-6 text-green-500" />,
            title: "Secure & Trusted",
            description: "Verified hospitals and donors ensure a safe blood transfusion process.",
        },
        {
            icon: <Users className="w-6 h-6 text-purple-500" />,
            title: "Community Driven",
            description: "Join thousands of donors and hospitals in our life-saving network.",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 glass-card border-none bg-white/70">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
                            <Heart className="w-6 h-6 text-white fill-current" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-slate-800">
                            Blood<span className="text-red-600">Bank</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/login")}
                            className="text-slate-600 font-semibold hover:text-red-600 transition-colors"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => navigate("/register")}
                            className="btn-primary"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-bold mb-6">
                            <Activity className="w-4 h-4" />
                            Emergency Blood Support 24/7
                        </div>
                        <h1 className="text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6">
                            Connecting <span className="gradient-text">Life</span> Through Every Drop.
                        </h1>
                        <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-lg">
                            The modern platform for blood donation management. Fast, secure, and reliable connection between donors and those in need.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => navigate("/register")}
                                className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2 group"
                            >
                                Donate Now
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => navigate("/login")}
                                className="btn-outline text-lg px-8 py-4"
                            >
                                Find Blood
                            </button>
                        </div>

                        <div className="mt-12 flex items-center gap-8">
                            <div>
                                <p className="text-3xl font-bold text-slate-900">10k+</p>
                                <p className="text-slate-500">Active Donors</p>
                            </div>
                            <div className="w-px h-10 bg-slate-200" />
                            <div>
                                <p className="text-3xl font-bold text-slate-900">500+</p>
                                <p className="text-slate-500">Hospitals</p>
                            </div>
                            <div className="w-px h-10 bg-slate-200" />
                            <div>
                                <p className="text-3xl font-bold text-slate-900">25k+</p>
                                <p className="text-slate-500">Lives Saved</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                            <div className="aspect-square bg-gradient-to-br from-red-100 to-rose-200 flex items-center justify-center p-12">
                                <div className="relative animate-float">
                                    <Heart className="w-64 h-64 text-red-600 fill-current opacity-90 filter drop-shadow-2xl" />
                                    <div className="absolute inset-0 bg-red-600/20 blur-3xl rounded-full -z-10" />
                                </div>
                            </div>
                        </div>
                        {/* Abstract Shapes */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-500/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Choose BloodBank?</h2>
                        <p className="text-lg text-slate-600">
                            We leverage technology to bridge the gap between blood donors and recipients, ensuring every request is met with speed and care.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -8 }}
                                className="p-8 rounded-3xl bg-slate-50 border border-slate-100 transition-all cursor-default"
                            >
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 px-6">
                <div className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden text-center">
                    <div className="relative z-10">
                        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Ready to make an impact?</h2>
                        <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
                            Join our network today and help us ensure that no one has to wait for life-saving blood.
                        </p>
                        <button
                            onClick={() => navigate("/register")}
                            className="btn-primary bg-white text-slate-900 hover:bg-slate-100 px-10 py-4 text-lg"
                        >
                            Create Account
                        </button>
                    </div>
                    {/* Decorative Gradients */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/20 blur-[100px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 blur-[100px] translate-y-1/2 -translate-x-1/2" />
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-600 fill-current" />
                        <span className="font-bold text-slate-800">BloodBank</span>
                    </div>
                    <p className="text-slate-500 text-sm">
                        © 2026 BloodBank. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors">Privacy Policy</a>
                        <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
