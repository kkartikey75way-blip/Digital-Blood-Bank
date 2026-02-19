import { motion } from "framer-motion";
import { Heart, Activity, ShieldPlus, Users } from "lucide-react";

const Features = () => {
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
    );
};

export default Features;
