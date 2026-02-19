import React from 'react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import type { RequestStatus } from '../../types/request.types';

interface StatusTimelineProps {
    status: RequestStatus;
}

const StatusTimeline: React.FC<StatusTimelineProps> = ({ status }) => {
    const steps = [
        { key: 'PENDING', label: 'Requested', icon: Clock },
        { key: 'APPROVED', label: 'Fulfilled', icon: CheckCircle2 },
        { key: 'COMPLETED', label: 'Completed', icon: CheckCircle2 },
    ];

    const getStatusIndex = (s: RequestStatus) => {
        if (s === 'REJECTED') return -1;
        if (s === 'CANCELLED') return -1;
        return steps.findIndex(step => step.key === s);
    };

    const currentIndex = getStatusIndex(status);

    if (status === 'REJECTED') {
        return (
            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-2xl border border-red-100">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-sm font-bold text-red-700">This request was rejected.</span>
            </div>
        );
    }

    return (
        <div className="relative flex flex-col gap-6">
            {steps.map((step, index) => {
                const isCompleted = index < currentIndex || status === 'COMPLETED';
                const isCurrent = index === currentIndex && status !== 'COMPLETED';
                const Icon = step.icon;

                return (
                    <div key={step.key} className="flex gap-4 group">
                        <div className="relative flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all ${isCompleted ? 'bg-green-500 text-white shadow-lg shadow-green-200' :
                                isCurrent ? 'bg-red-600 text-white animate-pulse' :
                                    'bg-slate-100 text-slate-400'
                                }`}>
                                <Icon className="w-4 h-4" />
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`w-0.5 h-full -mt-1 -mb-1 transition-colors ${isCompleted ? 'bg-green-500' : 'bg-slate-100'
                                    }`} />
                            )}
                        </div>
                        <div className="pb-4">
                            <h5 className={`text-sm font-bold transition-colors ${isCompleted ? 'text-green-600' : isCurrent ? 'text-red-900' : 'text-slate-400'
                                }`}>
                                {step.label}
                            </h5>
                            <p className="text-[10px] text-slate-500 mt-0.5 max-w-[150px]">
                                {isCompleted ? 'Goal reached successfully' : isCurrent ? 'Processing your request...' : 'Waiting for step to begin'}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default StatusTimeline;
