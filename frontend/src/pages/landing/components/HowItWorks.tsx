const HowItWorks = () => {
    return (
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
    );
};

export default HowItWorks;
