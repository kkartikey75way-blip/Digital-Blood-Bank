import { Loader2, Award } from "lucide-react";

interface ImpactHistoryProps {
    history: any[];
    isLoading: boolean;
}

const ImpactHistory = ({ history, isLoading }: ImpactHistoryProps) => {
    return (
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
            <div className="relative z-10 flex flex-col h-full">
                <div className="mb-8">
                    <h3 className="text-xl font-bold mb-1">Impact History</h3>
                    <p className="text-slate-400 text-sm">Your journey of saving lives.</p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="w-6 h-6 text-red-500 animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-8 flex-1">
                        {history.length > 0 ? history.map((item, i) => {
                            const request = typeof item.request === 'object' ? item.request : null;
                            return (
                                <div key={item._id} className="flex gap-4 relative">
                                    {i < history.length - 1 && <div className="absolute left-5 top-10 bottom-[-32px] w-0.5 bg-slate-800" />}
                                    <div className="w-10 h-10 rounded-full bg-slate-800 border-4 border-slate-900 flex items-center justify-center z-10">
                                        <div className="w-2 h-2 rounded-full bg-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">Donation for Blood Request ({request?.bloodGroup || 'N/A'})</p>
                                        <p className="text-xs text-slate-500 mt-1">{new Date(item.donatedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="text-slate-500 text-sm font-medium italic">
                                Your donation history will appear here.
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-12 bg-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                        <Award className="w-6 h-6 text-amber-500" />
                        <span className="font-bold text-sm tracking-wider uppercase">Active Status</span>
                    </div>
                    <p className="text-lg font-bold mb-1 italic">
                        {history.length > 5 ? '"Master Life Saver"' : history.length > 0 ? '"Rising Hero"' : '"New Joiner"'}
                    </p>
                    <p className="text-xs text-slate-400">Keep up the great work!</p>
                </div>
            </div>
        </div>
    );
};

export default ImpactHistory;
