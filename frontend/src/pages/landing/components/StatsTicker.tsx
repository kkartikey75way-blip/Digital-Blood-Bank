import { Activity, Heart, ShieldPlus, Users } from "lucide-react";

const StatsTicker = () => {
    const stats = [
        { label: "Active Donors", value: "10,000+", icon: <Users className="w-5 h-5" /> },
        { label: "Partner Hospitals", value: "500+", icon: <Activity className="w-5 h-5" /> },
        { label: "Lives Impacted", value: "25,000+", icon: <Heart className="w-5 h-5" /> },
        { label: "Emergency Fulfilled", value: "98%", icon: <ShieldPlus className="w-5 h-5" /> },
    ];

    return (
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
    );
};

export default StatsTicker;
