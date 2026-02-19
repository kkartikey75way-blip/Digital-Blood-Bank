import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Activity, ShieldPlus, ArrowRight, Droplets } from "lucide-react";
import StatsTicker from "./StatsTicker.tsx";

const Hero = () => {
    const navigate = useNavigate();

    return (
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

                    <StatsTicker />
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
    );
};

export default Hero;
