import { motion } from "framer-motion";
import { Download, Shield, Award, Droplets, Share2 } from "lucide-react";
import { useRef } from "react";

interface HeroCertificateProps {
    donorName: string;
    rank: string;
    impactPoints: number;
    livesSaved: number;
}

const HeroCertificate = ({ donorName, rank, impactPoints, livesSaved }: HeroCertificateProps) => {
    const certificateRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        window.print();
    };

    if (rank !== "Hero") return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-black text-slate-900">Honorary Distinction</h3>
                    <p className="text-slate-500 text-xs font-bold uppercase mt-1 tracking-tight">Recognizing your extraordinary contribution</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={handlePrint}
                        className="p-4 bg-white border-2 border-slate-100 rounded-2xl hover:border-slate-200 transition-all active:scale-95 shadow-sm"
                    >
                        <Download className="w-5 h-5 text-slate-900" />
                    </button>
                    <button className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl hover:bg-slate-800 transition-all active:scale-95">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div
                ref={certificateRef}
                className="relative bg-[#FAFAFA] border-[12px] border-slate-900 p-16 rounded-sm shadow-2xl overflow-hidden print:shadow-none print:border-[20px]"
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-32 h-32 border-l-4 border-t-4 border-amber-500/30 m-8" />
                <div className="absolute bottom-0 right-0 w-32 h-32 border-r-4 border-b-4 border-amber-500/30 m-8" />

                <div className="relative z-10 text-center space-y-10">
                    <div className="flex justify-center mb-4">
                        <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center border-4 border-white shadow-xl">
                            <Shield className="w-12 h-12 text-amber-500" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-amber-500 font-black text-sm uppercase tracking-[0.5em]">Certificate of Excellence</h4>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none italic">
                            LIFE SAVER AWARD
                        </h1>
                    </div>

                    <div className="max-w-xl mx-auto space-y-6">
                        <p className="text-slate-500 font-serif italic text-lg decoration-slate-300 underline underline-offset-8 decoration-2">
                            This honorary distinction is proudly presented to
                        </p>
                        <h2 className="text-6xl font-black text-slate-900 border-b-4 border-slate-900 inline-block px-12 pb-2">
                            {donorName}
                        </h2>
                        <p className="text-slate-600 font-medium leading-relaxed">
                            For demonstrating exceptional courage and selflessness. By contributing <span className="font-black text-slate-900">{impactPoints} impact points</span> and directly saving or aiding <span className="font-black text-slate-900">{livesSaved} lives</span>, you have attained the distinguished rank of <span className="font-black text-amber-600">CENTRAL HERO</span>.
                        </p>
                    </div>

                    <div className="flex justify-around items-center pt-12">
                        <div className="text-center space-y-2">
                            <div className="w-32 h-px bg-slate-300 mx-auto" />
                            <p className="text-[10px] font-black uppercase text-slate-400">Digital Validation</p>
                            <p className="text-xs font-serif italic text-slate-900">Verified System Signature</p>
                        </div>
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full border-4 border-slate-200 flex items-center justify-center rotate-12">
                                <Award className="w-10 h-10 text-slate-200" />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center -rotate-12">
                                <Droplets className="w-8 h-8 text-red-600/20" />
                            </div>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="w-32 h-px bg-slate-300 mx-auto" />
                            <p className="text-[10px] font-black uppercase text-slate-400">Date Issued</p>
                            <p className="text-xs font-black text-slate-900">{new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                {/* Background Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                    <Shield className="w-[80%] h-[80%] text-slate-900" />
                </div>
            </div>
        </motion.div>
    );
};

export default HeroCertificate;
