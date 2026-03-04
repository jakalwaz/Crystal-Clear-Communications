import React from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Badge, Button, Card } from './UI';
import { Patient } from '../types';

interface PatientDetailsModalProps {
    patient: Patient;
    onClose: () => void;
}

export const PatientDetailsModal = ({ patient, onClose }: PatientDetailsModalProps) => {
    const navigate = useNavigate();
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
                <div className="h-40 bg-primary-600 relative">
                    <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                    <div className="absolute -bottom-12 left-10 p-1.5 bg-white rounded-full shadow-xl">
                        <Avatar alt={patient.name} size="xl" className="border-4 border-white w-24 h-24" />
                    </div>
                </div>
                <div className="pt-16 p-10">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">{patient.name}</h2>
                            <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">{patient.condition}</p>
                        </div>
                        <Badge variant={patient.status === 'Stable' ? 'success' : 'danger'} className="px-5 py-2 text-xs uppercase tracking-widest">{patient.status}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-10 mb-10">
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-100 pb-3">Operational Target</h3>
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-sm">
                                <p className="text-sm font-black text-slate-900 leading-tight">Weekly Dialysis Cycle</p>
                                <p className="text-xs text-slate-500 mt-1 font-bold">Oct 12, 2023 • 10:30 AM</p>
                                <button onClick={() => navigate('/schedule')} className="mt-5 w-full py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-primary-600 hover:bg-primary-50 transition-all uppercase tracking-widest">Jump to Schedule</button>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-100 pb-3">Medical Summary</h3>
                            <div className="space-y-4">
                                <div className="flex gap-4 items-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                                    <span className="text-xs font-bold text-slate-700">Recent checkup verified</span>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    <span className="text-xs font-bold text-slate-700">Insurance pre-cleared</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Button className="flex-1 py-4 font-black text-xs uppercase tracking-widest" onClick={onClose}>Directory View</Button>
                        <Button variant="secondary" className="flex-1 py-4 font-black text-red-600 hover:bg-red-50 text-xs uppercase tracking-widest" onClick={onClose}>Archive Profile</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
