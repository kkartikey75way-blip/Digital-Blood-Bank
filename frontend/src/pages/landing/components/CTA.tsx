import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CTA = () => {
    const navigate = useNavigate();

    return (
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
    );
};

export default CTA;
