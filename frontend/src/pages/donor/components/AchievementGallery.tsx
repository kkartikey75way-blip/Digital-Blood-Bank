import { motion } from "framer-motion";
import { Award, Star, Shield, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface AchievementGalleryProps {
    badges: string[];
}

const BADGE_CONFIG: Record<string, { icon: LucideIcon, color: string, bg: string, border: string, description: string }> = {
    "First Drop": {
        icon: Star,
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-100",
        description: "Awarded for your first successful donation."
    },
    "Regular Hero": {
        icon: Award,
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-100",
        description: "Consistent hero with over 5 donations."
    },
    "Life Vanguard": {
        icon: Shield,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-100",
        description: "Premier savior with over 15 donations."
    },
    "Hero": {
        icon: Trophy,
        color: "text-purple-600",
        bg: "bg-purple-50",
        border: "border-purple-100",
        description: "Elite rank awarded for massive community impact."
    }
};

const AchievementGallery = ({ badges = [] }: AchievementGalleryProps) => {
    // Also include 'Hero' as a badge if the user is ranked as Hero
    // But for now let's just use the passed badges.

    return (
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm overflow-hidden relative">
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900">Achievement Gallery</h3>
                        <p className="text-slate-500 text-xs font-bold uppercase mt-1 tracking-tight">Your collection of life-saving honors</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Object.entries(BADGE_CONFIG).map(([name, config], index) => {
                        const isEarned = badges.includes(name);
                        const Icon = config.icon;

                        return (
                            <motion.div
                                key={name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative p-6 rounded-3xl border-2 transition-all duration-500 group ${isEarned
                                    ? `${config.bg} ${config.border} opacity-100 scale-100`
                                    : "bg-slate-50 border-slate-100 opacity-40 grayscale scale-95"
                                    }`}
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-500 ${isEarned ? `${config.bg} ${config.color} rotate-0 group-hover:rotate-12` : "bg-slate-200 text-slate-400"
                                    }`}>
                                    <Icon className="w-7 h-7" />
                                </div>
                                <h4 className={`font-black text-sm mb-1 ${isEarned ? "text-slate-900" : "text-slate-400"}`}>
                                    {name}
                                </h4>
                                <p className={`text-[10px] leading-relaxed font-bold ${isEarned ? "text-slate-600" : "text-slate-400"}`}>
                                    {config.description}
                                </p>

                                {isEarned && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center shadow-lg"
                                    >
                                        <div className="w-2 h-2 bg-white rounded-full" />
                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {badges.length === 0 && (
                    <div className="mt-10 p-6 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 text-center">
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                            Continue your journey to unlock your first achievement
                        </p>
                    </div>
                )}
            </div>

            {/* Decorative BG Gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />
        </div>
    );
};

export default AchievementGallery;
