import React, { useState, useEffect } from 'react';
import { X, Clock, MapPin, Activity, Trash2, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Card, Button, Badge, Avatar } from '../components/UI';
import { useNavigate } from 'react-router-dom';

interface CalendarEvent {
    id: string;
    day: number;
    type: 'Onco' | 'Cardio' | 'Dialysis' | 'Neuro' | 'Other' | 'Check-up';
    label: string;
    patientName: string;
    time: string;
    location: string;
    color: 'emerald' | 'blue' | 'amber' | 'purple' | 'slate';
}

const EventDetailsModal = ({ event, onClose, onDelete }: { event: CalendarEvent, onClose: () => void, onDelete: (id: string) => void }) => {
    const navigate = useNavigate();
    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className={`h-20 bg-gradient-to-r ${
                    event.color === 'emerald' ? 'from-emerald-500 to-emerald-600' :
                    event.color === 'blue' ? 'from-blue-500 to-blue-600' :
                    event.color === 'amber' ? 'from-amber-500 to-amber-600' :
                    event.color === 'purple' ? 'from-purple-500 to-purple-600' :
                    'from-slate-500 to-slate-600'
                } relative`}>
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                    <div className="absolute -bottom-8 left-8 p-1.5 bg-white rounded-full shadow-xl">
                        <Avatar alt={event.patientName} size="lg" />
                    </div>
                </div>
                
                <div className="pt-10 p-8 space-y-6">
                    <div>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">{event.patientName}</h3>
                                <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest">{event.label}</p>
                            </div>
                            <Badge variant={event.color === 'slate' ? 'neutral' : event.color === 'emerald' ? 'success' : event.color === 'amber' ? 'warning' : 'default'} className="scale-110">
                                {event.type}
                            </Badge>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <Clock className="w-5 h-5 text-primary-500" />
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1.5">Scheduled Time</p>
                                <p className="text-sm font-bold text-slate-800">Oct {event.day} • {event.time}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <MapPin className="w-5 h-5 text-primary-500" />
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1.5">Deployment Target</p>
                                <p className="text-sm font-bold text-slate-800">{event.location}</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2 flex gap-3">
                        <Button variant="secondary" className="flex-1 font-black text-red-600 text-xs uppercase" onClick={() => onDelete(event.id)}>
                            <Trash2 className="w-4 h-4 mr-2" /> Cancel
                        </Button>
                        <Button className="flex-1 font-black text-xs uppercase" onClick={() => navigate('/ai/move-appointment')}>
                            <Activity className="w-4 h-4 mr-2" /> Modify
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DEFAULT_EVENTS: CalendarEvent[] = [
    { id: '1', day: 3, type: 'Onco', label: 'Chemotherapy Session', patientName: 'Arthur Pendelton', time: '09:00 AM', location: 'Oncology Wing A', color: 'emerald' },
    { id: '2', day: 12, type: 'Cardio', label: 'Echocardiogram', patientName: 'Mary Smith', time: '10:30 AM', location: 'Heart Center Rm 402', color: 'blue' },
    { id: '3', day: 12, type: 'Dialysis', label: 'Regular Dialysis', patientName: 'James Doe', time: '02:00 PM', location: 'Dialysis Unit', color: 'amber' },
    { id: '4', day: 15, type: 'Neuro', label: 'Neurology Follow-up', patientName: 'Emma Watson', time: '11:15 AM', location: 'Neuro Clinic B', color: 'purple' },
];

export default function Schedule() {
    const navigate = useNavigate();
    const [events, setEvents] = useState<CalendarEvent[]>(DEFAULT_EVENTS);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

    useEffect(() => {
        // Load any new events added from Book Appointment
        const storedEvents = localStorage.getItem('scheduleEvents');
        if (storedEvents) {
            try {
                const parsed = JSON.parse(storedEvents);
                setEvents(prev => [...prev, ...parsed]);
            } catch (e) {
                console.error("Failed to parse events", e);
            }
        }
    }, []);

    const handleDeleteEvent = (id: string) => {
        setEvents(events.filter(e => e.id !== id));
        setSelectedEvent(null);
    };

    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="h-full flex flex-col gap-6">
            <header className="shrink-0 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Schedule Grid</h1>
                    <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-widest">October 2023</p>
                </div>
                <Button onClick={() => navigate('/book')} className="font-black uppercase text-xs tracking-widest shadow-lg shadow-primary-500/20">
                    <Plus className="w-4 h-4 mr-2" /> Add Appointment
                </Button>
            </header>

            <Card className="flex-1 flex flex-col overflow-hidden min-h-0 bg-white" noPadding>
                <div className="grid grid-cols-7 bg-slate-50/50 border-b border-slate-100 shrink-0">
                    {weekDays.map(day => (
                        <div key={day} className="py-3 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                            {day}
                        </div>
                    ))}
                </div>
                
                <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-7 h-full auto-rows-fr border-l border-slate-100">
                        {[28, 29, 30].map(d => (
                             <div key={`prev-${d}`} className="border-b border-r border-slate-100 bg-slate-50/20" />
                        ))}

                        {days.map(day => {
                            const isToday = day === 12;
                            const dayEvents = events.filter(e => e.day === day);
                            return (
                                <div key={day} className={`border-b border-r border-slate-100 p-2 min-h-[120px] group transition-all hover:bg-primary-50/10 ${isToday ? 'bg-primary-50/20' : ''}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-xs font-black flex items-center justify-center w-7 h-7 rounded-xl transition-all ${isToday ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30' : 'text-slate-300 group-hover:text-primary-600 group-hover:bg-primary-50'}`}>{day}</span>
                                    </div>
                                    
                                    <div className="flex flex-col gap-1.5">
                                        {dayEvents.map((e) => {
                                            const colors = {
                                                emerald: 'bg-emerald-50 text-emerald-700 border-emerald-500 hover:bg-emerald-100',
                                                blue: 'bg-blue-50 text-blue-700 border-blue-500 hover:bg-blue-100',
                                                amber: 'bg-amber-50 text-amber-700 border-amber-500 hover:bg-amber-100',
                                                purple: 'bg-purple-50 text-purple-700 border-purple-500 hover:bg-purple-100',
                                                slate: 'bg-slate-50 text-slate-700 border-slate-500 hover:bg-slate-100',
                                            };
                                            return (
                                                <div 
                                                    key={e.id} 
                                                    onClick={() => setSelectedEvent(e)} 
                                                    className={`px-2 py-1.5 rounded-lg text-[10px] font-black border-l-[4px] truncate cursor-pointer transition-all shadow-sm ${colors[e.color]}`}
                                                >
                                                    {e.patientName}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Card>

            {selectedEvent && <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} onDelete={handleDeleteEvent} />}
        </div>
    );
}