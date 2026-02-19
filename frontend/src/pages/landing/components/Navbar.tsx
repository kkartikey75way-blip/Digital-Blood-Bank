import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <nav className="fixed top-0 w-full z-50 glass-card px-6 py-4 border-b border-white/20">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 group cursor-pointer"
                    onClick={() => navigate("/")}
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
    );
};

export default Navbar;
