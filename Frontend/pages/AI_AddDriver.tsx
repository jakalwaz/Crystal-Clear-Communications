import React, { useState, useEffect } from 'react';
import { Clipboard, X, Plus, User, Loader2, Download } from 'lucide-react';
import { Card, Button, Badge, Avatar, Input } from '../components/UI';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface VirtualTicket {
    filename: string;
    callSid: string;
    time: string;
    caller: string;
    patientName: string;
    status: string;
    patientStatement: string;
    summary: string;
    raw: string;
}

interface Ticket {
    id: string;
    driverName: string;
    issue: string;
    status: 'Pending' | 'Urgent' | 'Review';
    date: string;
    notes?: string;
    filename?: string;
    patientStatement?: string;
    raw?: string;
}

function trimTrailingPeriods(s: string): string {
    return (s || '').replace(/\.+$/, '').trim();
}

function virtualTicketToTicket(v: VirtualTicket): Ticket {
    const statusMap: Record<string, 'Pending' | 'Urgent' | 'Review'> = {
        BAD: 'Urgent',
        URGENT: 'Urgent',
        bad: 'Urgent',
        urgent: 'Urgent',
    };
    const displayName = v.patientName?.trim() || v.caller || 'Unknown Caller';
    const dateStr = v.time ? new Date(v.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
    const summary = trimTrailingPeriods(v.summary || '');
    return {
        id: v.filename,
        driverName: displayName,
        issue: summary || v.status || 'Virtual Check-in',
        status: statusMap[v.status?.toUpperCase()] || 'Review',
        date: dateStr,
        notes: summary,
        filename: v.filename,
        patientStatement: v.patientStatement,
        raw: v.raw,
    };
}

export default function AIAddDriver() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewingId, setViewingId] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newDriverName, setNewDriverName] = useState('');

    useEffect(() => {
        fetch(`${API_BASE}/api/virtual-tickets`)
            .then(res => res.json())
            .then(data => {
                const mapped = (data.tickets || []).map(virtualTicketToTicket);
                setTickets(mapped);
            })
            .catch(() => setTickets([]))
            .finally(() => setLoading(false));
    }, []);

    const activeTicket = tickets.find(t => t.id === viewingId);

    const handleResolveTicket = async () => {
        if (!viewingId) return;
        const ticket = tickets.find(t => t.id === viewingId);
        if (ticket?.filename) {
            try {
                await fetch(`${API_BASE}/api/virtual-tickets/${encodeURIComponent(ticket.filename)}`, { method: 'DELETE' });
            } catch {
                /* ignore */
            }
        }
        setTickets(tickets.filter(t => t.id !== viewingId));
        setViewingId(null);
    };

    const handleDownloadTicket = (ticket: Ticket) => {
        const content = ticket.raw || [
            'Clearwater Ridge Nursing Station — Follow-up Ticket',
            `Date: ${ticket.date}`,
            `Contact: ${ticket.driverName}`,
            `Status: ${ticket.status}`,
            '',
            'Subject:',
            ticket.issue,
            '',
            ...(ticket.patientStatement ? ['Patient Statement:', `"${ticket.patientStatement}"`, ''] : []),
            'Details & Notes:',
            ticket.notes || '',
        ].join('\n');
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = ticket.filename || `ticket-${ticket.id}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleAddTicket = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDriverName.trim()) return;

        const newTicket: Ticket = {
            id: `manual-${Math.floor(Math.random() * 9000)}`,
            driverName: newDriverName,
            issue: 'Manual Follow-up Created',
            status: 'Pending',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            notes: 'Created via Nurse Command console.',
        };

        setTickets([newTicket, ...tickets]);
        setIsAddModalOpen(false);
        setNewDriverName('');
    };

    return (
        <div className="space-y-8 h-full flex flex-col">
            <header className="shrink-0 flex items-end justify-between">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4 leading-none">
                        <Clipboard className="w-10 h-10 text-primary-600" />
                        Follow up tickets
                    </h1>
                    <p className="text-slate-400 mt-3 font-bold uppercase tracking-widest text-xs">Driver & Fleet Management</p>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)} className="font-black uppercase text-xs tracking-widest">
                    <Plus className="w-4 h-4 mr-2" /> ADD TICKET
                </Button>
            </header>

            <div className="flex-1 overflow-hidden min-h-0">
                <Card className="h-full flex flex-col overflow-hidden" noPadding>
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl flex justify-between items-center">
                        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Issues</h2>
                        <Badge variant="neutral">{tickets.length} Open</Badge>
                    </div>
                    <div className="divide-y divide-slate-100 overflow-y-auto">
                        {loading && (
                            <div className="p-10 flex items-center justify-center gap-3 text-slate-400">
                                <Loader2 className="w-5 h-5 animate-spin" /> Loading tickets...
                            </div>
                        )}
                        {!loading && tickets.map(t => (
                            <div key={t.id} className={`p-6 flex items-center justify-between hover:bg-slate-50/50 transition-all group ${viewingId === t.id ? 'bg-primary-50/30' : ''}`}>
                                <div className="flex items-center gap-6">
                                    <Avatar alt={t.driverName} size="md" />
                                    <div>
                                        <p className="font-black text-slate-900 text-lg tracking-tight group-hover:text-primary-600 transition-colors leading-none mb-2">{t.driverName}</p>
                                        <div className="flex items-center">
                                            <Badge variant={t.status === 'Urgent' ? 'danger' : 'neutral'} className="scale-90 tracking-tighter">{t.status}</Badge>
                                        </div>
                                    </div>
                                </div>
                                <Button 
                                    variant={viewingId === t.id ? "primary" : "secondary"}
                                    size="sm" 
                                    onClick={() => setViewingId(t.id)} 
                                    className="uppercase text-[10px] tracking-widest px-8"
                                >
                                    {viewingId === t.id ? "Viewing" : "View Details"}
                                </Button>
                            </div>
                        ))}
                        {!loading && tickets.length === 0 && (
                            <div className="p-10 text-center text-slate-400 font-medium">
                                No follow-up tickets required.
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
                                Follow up tickets
                            </h3>
                            <button onClick={() => setViewingId(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
                        </div>
                        <div className="p-8 space-y-6">
                            <Badge variant={activeTicket.status === 'Urgent' ? 'danger' : 'warning'}>{activeTicket.status} Attention</Badge>
                            
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Subject</p>
                                <p className="text-sm font-bold text-slate-800">{activeTicket.issue}</p>
                            </div>

                            {activeTicket.patientStatement && (
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Patient Statement</p>
                                    <p className="text-sm font-medium text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed italic">
                                        "{activeTicket.patientStatement}"
                                    </p>
                                </div>
                            )}

                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Details & Notes</p>
                                <p className="text-sm font-medium text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed whitespace-pre-wrap">
                                    {activeTicket.notes}
                                </p>
                            </div>

                            <div className="pt-6 flex gap-4">
                                <Button 
                                    className="flex-1 py-4 uppercase text-xs tracking-widest"
                                    onClick={handleResolveTicket}
                                >
                                    Mark Resolved
                                </Button>
                                <Button 
                                    variant="secondary" 
                                    className="flex-1 py-4 uppercase text-xs tracking-widest text-slate-600 hover:bg-slate-50"
                                    onClick={() => activeTicket && handleDownloadTicket(activeTicket)}
                                >
                                    <Download className="w-4 h-4 mr-2" /> Download as .txt
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
                            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">New Follow-up Ticket</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
                        </div>
                        <form onSubmit={handleAddTicket} className="p-10 space-y-6">
                            <Input 
                                label="Driver Name" 
                                placeholder="Enter driver name..." 
                                required 
                                icon={User}
                                value={newDriverName}
                                onChange={(e) => setNewDriverName(e.target.value)}
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