import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clipboard, Calendar as CalendarIcon, CalendarPlus, Clock, X, Plus, User, Loader2 } from 'lucide-react';
import { Card, Button, Badge, Avatar, Input } from '../components/UI';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface RebookingTicket {
    filename: string;
    callSid: string;
    time: string;
    caller: string;
    identity: string;
    requestedDatetime: string;
    summary: string;
    raw: string;
}

interface Appt {
    id: string;
    patient: string;
    date: string;
    dayNum: number;
    time: string;
    type: string;
    reason?: string;
    filename?: string;
    requestedDatetime?: string;
    caller?: string;
}

function extractPatientFromSummary(summary: string): string {
    const match = summary.match(/Patient\s+([^(]+)/i);
    if (match) return match[1].trim();
    return 'Unknown';
}

function extractDateFromSummary(summary: string): string {
    const match = summary.match(/(\w+\s+\d+(?:st|nd|rd|th)?,?\s*\d{4})/i);
    if (match) return match[1];
    return '';
}

function extractTimeFromSummary(summary: string): string {
    const match = summary.match(/(\d{1,2}(?::\d{2})?\s*(?:a\.?m\.?|p\.?m\.?))/i);
    if (match) return match[1];
    return '';
}

function ticketToAppt(t: RebookingTicket): Appt {
    const patient = extractPatientFromSummary(t.summary) || t.identity?.split('my name is')[1]?.split('and')[0]?.trim() || 'Unknown';
    const date = extractDateFromSummary(t.summary) || t.requestedDatetime || t.time;
    const time = extractTimeFromSummary(t.summary) || 'TBD';
    return {
        id: t.filename,
        patient,
        date,
        dayNum: 1,
        time,
        type: 'Rebooking',
        reason: t.summary,
        filename: t.filename,
        requestedDatetime: t.requestedDatetime,
        caller: t.caller,
    };
}

export default function AIMoveAppointment() {
    const navigate = useNavigate();
    const [appts, setAppts] = useState<Appt[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewingId, setViewingId] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newPatientName, setNewPatientName] = useState('');

    useEffect(() => {
        fetch(`${API_BASE}/api/rebooking-tickets`)
            .then(res => res.json())
            .then(data => {
                const tickets = (data.tickets || []).map(ticketToAppt);
                setAppts(tickets);
            })
            .catch(() => setAppts([]))
            .finally(() => setLoading(false));
    }, []);

    const activeTicket = appts.find(a => a.id === viewingId);

    const handleAddToCalendar = () => {
        if (!activeTicket) return;
        const dayMatch = activeTicket.date.match(/\d+/);
        const day = dayMatch ? parseInt(dayMatch[0], 10) : new Date().getDate();
        const newEvent = {
            id: Math.random().toString(36).substr(2, 9),
            day: Math.min(31, Math.max(1, day)),
            type: 'Other' as const,
            label: 'Rebooking',
            patientName: activeTicket.patient,
            time: activeTicket.time,
            location: 'Main Clinic',
            color: 'emerald' as const,
        };
        const existingEvents = JSON.parse(localStorage.getItem('scheduleEvents') || '[]');
        localStorage.setItem('scheduleEvents', JSON.stringify([...existingEvents, newEvent]));
        if (activeTicket.filename) {
            fetch(`${API_BASE}/api/rebooking-tickets/${encodeURIComponent(activeTicket.filename)}`, { method: 'DELETE' }).catch(() => {});
        }
        setAppts(appts.filter(a => a.id !== viewingId));
        setViewingId(null);
        navigate('/schedule');
    };

    const handleDenyRequest = async () => {
        if (!viewingId) return;
        const ticket = appts.find(a => a.id === viewingId);
        if (ticket?.filename) {
            try {
                await fetch(`${API_BASE}/api/rebooking-tickets/${encodeURIComponent(ticket.filename)}`, { method: 'DELETE' });
            } catch {
                /* ignore */
            }
        }
        setAppts(appts.filter(a => a.id !== viewingId));
        setViewingId(null);
    };

    const handleAddTicket = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPatientName.trim()) return;

        const newTicket: Appt = {
            id: `manual-${Math.floor(Math.random() * 9000)}`,
            patient: newPatientName,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            dayNum: new Date().getDate(),
            time: '09:00 AM',
            type: 'Manual Entry',
            reason: 'Manual Entry',
        };

        setAppts([newTicket, ...appts]);
        setIsAddModalOpen(false);
        setNewPatientName('');
    };

    return (
        <div className="space-y-8 h-full flex flex-col">
            <header className="shrink-0 flex items-end justify-between">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4 leading-none">
                        <Clipboard className="w-10 h-10 text-primary-600" />
                        Rescheduling tickets
                    </h1>
                    <p className="text-slate-400 mt-3 font-bold uppercase tracking-widest text-xs">Ticket Control System</p>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)} className="font-black uppercase text-xs tracking-widest">
                    <Plus className="w-4 h-4 mr-2" /> Add Ticket
                </Button>
            </header>

            <div className="flex-1 overflow-hidden min-h-0">
                <Card className="h-full flex flex-col overflow-hidden" noPadding>
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl flex justify-between items-center">
                        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Tickets</h2>
                        <Badge variant="neutral">{appts.length} Pending</Badge>
                    </div>
                    <div className="divide-y divide-slate-100 overflow-y-auto">
                        {loading && (
                            <div className="p-10 flex items-center justify-center gap-3 text-slate-400">
                                <Loader2 className="w-5 h-5 animate-spin" /> Loading tickets...
                            </div>
                        )}
                        {!loading && appts.map(a => (
                            <div key={a.id} className={`p-6 flex items-center justify-between hover:bg-slate-50/50 transition-all group ${viewingId === a.id ? 'bg-primary-50/30' : ''}`}>
                                <div className="flex items-center gap-6">
                                    <Avatar alt={a.patient} size="md" />
                                    <div>
                                        <p className="font-black text-slate-900 text-lg tracking-tight group-hover:text-primary-600 transition-colors leading-none mb-2">{a.patient}</p>
                                        <div className="flex items-center gap-4 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                            <span className="flex items-center gap-1.5"><CalendarIcon className="w-3.5 h-3.5 text-slate-300" /> {a.date}</span>
                                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-300" /> {a.time}</span>
                                            <Badge variant="neutral" className="scale-90 tracking-tighter">{a.type}</Badge>
                                        </div>
                                    </div>
                                </div>
                                <Button 
                                    variant={viewingId === a.id ? "primary" : "secondary"}
                                    size="sm" 
                                    onClick={() => setViewingId(a.id)} 
                                    className="uppercase text-[10px] tracking-widest px-8"
                                >
                                    {viewingId === a.id ? "Viewing" : "View Ticket"}
                                </Button>
                            </div>
                        ))}
                        {!loading && appts.length === 0 && (
                            <div className="p-10 text-center text-slate-400 font-medium">
                                No active tickets pending review.
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            {/* Ticket View Modal */}
            {activeTicket && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 animate-in fade-in" onClick={() => setViewingId(null)}>
                    <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="p-7 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 sticky top-0 z-10">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                                Rescheduling tickets
                            </h3>
                            <button onClick={() => setViewingId(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
                        </div>
                        <div className="p-8 space-y-6">
                            <Badge variant="warning">Pending Review</Badge>
                            
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Reason for Ticket</p>
                                <p className="text-sm font-medium text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100">{activeTicket.reason}</p>
                            </div>

                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                    {activeTicket.filename ? 'Requested Schedule' : 'Current Schedule'}
                                </p>
                                <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                    <CalendarIcon className="w-4 h-4 text-slate-400" /> {activeTicket.date}
                                </div>
                                <div className="flex items-center gap-3 text-sm font-bold text-slate-700 mt-1">
                                    <Clock className="w-4 h-4 text-slate-400" /> {activeTicket.time}
                                </div>
                                {activeTicket.requestedDatetime && (
                                    <p className="text-xs text-slate-500 mt-2 italic">{activeTicket.requestedDatetime}</p>
                                )}
                            </div>

                            {activeTicket.caller && (
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Caller</p>
                                    <p className="text-sm font-medium text-slate-700">{activeTicket.caller}</p>
                                </div>
                            )}

                            <div className="pt-6 flex gap-4">
                                <Button 
                                    className="flex-1 py-4 uppercase text-xs tracking-widest"
                                    onClick={handleAddToCalendar}
                                >
                                    <CalendarPlus className="w-4 h-4 mr-2" /> Add to Calendar
                                </Button>
                                <Button variant="secondary" className="flex-1 py-4 uppercase text-xs tracking-widest text-slate-600 hover:bg-slate-50" onClick={handleDenyRequest}>
                                    Deny Request
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
                        <div className="p-7 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">New Rescheduling tickets</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
                        </div>
                        <form onSubmit={handleAddTicket} className="p-10 space-y-6">
                            <Input 
                                label="Patient Name" 
                                placeholder="Enter patient name..." 
                                required 
                                icon={User} 
                                value={newPatientName}
                                onChange={(e) => setNewPatientName(e.target.value)}
                                autoFocus
                            />
                            <div className="pt-6 flex gap-4">
                                <Button type="submit" className="flex-1 py-5 font-black uppercase text-xs tracking-widest">Create Ticket</Button>
                                <Button type="button" variant="secondary" className="flex-1 font-bold text-xs uppercase" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}