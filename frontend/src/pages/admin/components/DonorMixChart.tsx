import { PieChart as PieIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DonorMixChartProps {
    bloodGroupData: {
        name: string;
        value: number;
    }[];
    colors: string[];
}

const DonorMixChart = ({ bloodGroupData, colors }: DonorMixChartProps) => {
    return (
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
            <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6">
                    <h3 className="text-xl font-bold">Donor Mix</h3>
                    <p className="text-slate-500 text-sm">Blood group distribution across network</p>
                </div>
                <div className="flex-1 min-h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={bloodGroupData}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {bloodGroupData.map((_entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', color: '#000' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-6">
                    {bloodGroupData.slice(0, 8).map((data, index) => (
                        <div key={data.name} className="flex flex-col items-center">
                            <div className="w-2 h-2 rounded-full mb-1" style={{ backgroundColor: colors[index % colors.length] }} />
                            <span className="text-[10px] font-bold text-slate-500 uppercase">{data.name}</span>
                        </div>
                    ))}
                </div>
            </div>
            <PieIcon className="absolute -top-10 -right-10 w-48 h-48 text-white/5 -rotate-12" />
        </div>
    );
};

export default DonorMixChart;
