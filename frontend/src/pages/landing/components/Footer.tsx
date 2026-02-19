import { Heart } from "lucide-react";

const Footer = () => {
    return (
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
    );
};

export default Footer;
