import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MOCK_PATIENTS = [
    { id: '88392', name: 'Arthur Pendelton', address: '12 Maple Dr.', phone: '(555) 123-4567' },
    { id: '99210', name: 'Linda Martinez', address: '45 Oak St.', phone: '(555) 987-6543' },
    { id: '11029', name: 'James Doe', address: '78 Pine Ln.', phone: '(555) 222-3333' },
    { id: '44021', name: 'Mary Smith', address: '12 Maple Dr.', phone: '(555) 123-4567' },
    { id: '77390', name: 'Michael Chen', address: '90 Cedar Blvd.', phone: '(555) 444-5555' },
];

export default function BookAppointment() {
    const navigate = useNavigate();
    const [date, setDate] = useState('2023-10-14');
    const [time, setTime] = useState('02:30 PM');
    const [type, setType] = useState('Check-up');
    const [selectedPatientId, setSelectedPatientId] = useState(MOCK_PATIENTS[3].id); // Default Mary Smith
    const [aiIntent, setAiIntent] = useState('');

    const selectedPatient = MOCK_PATIENTS.find(p => p.id === selectedPatientId) || MOCK_PATIENTS[0];

    const handleFinalizeBooking = () => {
        // Create new event object
        const newEvent = {
            id: Math.random().toString(36).substr(2, 9),
            day: new Date(date).getDate(),
            type: type as any,
            label: type,
            patientName: selectedPatient.name,
            time: time,
            location: 'Main Clinic',
            color: 'slate'
        };

        // Save to local storage for Schedule page to pick up
        const existingEvents = JSON.parse(localStorage.getItem('scheduleEvents') || '[]');
        localStorage.setItem('scheduleEvents', JSON.stringify([...existingEvents, newEvent]));

        // Navigate to schedule
        navigate('/schedule');
    };

    const handleQuickAction = (action: string) => {
        setAiIntent(prev => prev ? `${prev}\n${action}` : action);
    };

    return (
        <div className="flex flex-col h-full gap-6">
            {/* Breadcrumbs */}
            <div className="flex flex-wrap gap-2 px-2">
                <span className="text-slate-500 text-sm font-medium">Dashboard</span>
                <span className="text-slate-400 text-sm font-medium">/</span>
                <span className="text-slate-500 text-sm font-medium">Appointments</span>
                <span className="text-slate-400 text-sm font-medium">/</span>
                <span className="text-slate-900 dark:text-white text-sm font-medium">New Request</span>
            </div>

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-12 gap-6 h-full grow items-start">
                
                {/* Left Column: AI Intent Input */}
                <div className="lg:col-span-5 flex flex-col gap-4 h-full">
                    <div className="bg-white dark:bg-[#1A2633] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-6 h-full min-h-[600px]">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary text-2xl">auto_awesome</span>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">AI Intent</h2>
                            </div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Listening</span>
                        </div>
                        <div className="flex-1 relative group">
                            <textarea 
                                className="w-full h-full min-h-[400px] resize-none bg-slate-50 dark:bg-[#101922] border-0 rounded-lg p-6 text-lg leading-relaxed text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-primary/50 transition-all outline-none" 
                                placeholder="Describe the appointment request...

e.g., 'Schedule Mary Smith for a Neurology check-up next Tuesday afternoon. She requires a wheelchair accessible vehicle.'"
                                value={aiIntent}
                                onChange={(e) => setAiIntent(e.target.value)}
                            ></textarea>
                            {/* Floating Mic Button */}
                            <button className="absolute bottom-6 right-6 size-14 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 group-focus-within:animate-pulse">
                                <span className="material-symbols-outlined text-2xl">mic</span>
                            </button>
                        </div>
                        <div className="flex flex-col gap-3">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Quick Actions</p>
                            <div className="flex flex-wrap gap-2">
                                <button onClick={() => handleQuickAction('Schedule follow-up visit')} className="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md text-slate-700 dark:text-slate-200 transition-colors">Follow-up Visit</button>
                                <button onClick={() => handleQuickAction('Order lab work')} className="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md text-slate-700 dark:text-slate-200 transition-colors">Lab Work</button>
                                <button onClick={() => handleQuickAction('Arrage urgent transfer')} className="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md text-slate-700 dark:text-slate-200 transition-colors">Urgent Transfer</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Smart Form Output */}
                <div className="lg:col-span-7 flex flex-col gap-4 h-full">
                    <div className="bg-white dark:bg-[#1A2633] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-6 h-full">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Booking Details</h2>
                        </div>
                        {/* Scrollable Form Area */}
                        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                            {/* AI Identified Patient */}
                            <div className="bg-primary/5 dark:bg-primary/10 border border-primary/10 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-xs font-bold text-primary uppercase tracking-wide">Patient Identified</label>
                                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full border border-green-100 dark:border-green-800">
                                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                        Match Found
                                    </span>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="size-12 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD7VZVa99vnDgQIlxxxSy3edzPlrZY3fbbuTd9sG_jk8eUUJM6Gt04TF0DYQGUAMhwIUZc1l7IOfFBORhqmt_nE8ESruXew3JHkhlArq79Qo8aGDn13hWTX56Lsy93LRhSG4Mgz1adP1l_lEAGwOA534EbAJcuPJaNojZSosXvAiq7vFcwWYSRAaVLLEUxO464mHMlpFhJ3NGiiIYUDRnO4RJxTNffM15OlBtZCjQoZ3Y6kaDY_vOy7VQ-l9901-kFbiNbnFMVETx8")' }}></div>
                                    <div className="flex-1">
                                        <div className="relative group">
                                            <select 
                                                className="font-bold text-slate-900 dark:text-white text-lg bg-transparent border-none p-0 pr-8 focus:ring-0 cursor-pointer appearance-none outline-none w-full"
                                                value={selectedPatientId}
                                                onChange={(e) => setSelectedPatientId(e.target.value)}
                                            >
                                                {MOCK_PATIENTS.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>
                                            <span className="absolute right-0 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 pointer-events-none">arrow_drop_down</span>
                                        </div>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-slate-500 dark:text-slate-400">
                                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">id_card</span> ID: #{selectedPatient.id}</span>
                                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">call</span> {selectedPatient.phone}</span>
                                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">location_on</span> {selectedPatient.address}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-6">
                                {/* Specialty */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Medical Specialty</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">medical_services</span>
                                        <input className="w-full pl-10 py-2 bg-slate-50 dark:bg-[#101922] border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary text-slate-900 dark:text-white font-medium outline-none" type="text" defaultValue="Neurology"/>
                                    </div>
                                </div>
                                {/* Appointment Type */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Appointment Type</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">assignment_ind</span>
                                        <select 
                                            className="w-full pl-10 py-2 bg-slate-50 dark:bg-[#101922] border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary text-slate-900 dark:text-white font-medium appearance-none outline-none"
                                            value={type}
                                            onChange={(e) => setType(e.target.value)}
                                        >
                                            <option>Check-up</option>
                                            <option>Consultation</option>
                                            <option>Procedure</option>
                                        </select>
                                    </div>
                                </div>
                                {/* Date */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between">
                                        Recommended Date
                                        <span className="text-xs text-primary font-normal">Based on availability</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">calendar_today</span>
                                        <input 
                                            className="w-full pl-10 py-2 bg-slate-50 dark:bg-[#101922] border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary text-slate-900 dark:text-white font-medium outline-none" 
                                            type="date" 
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                                {/* Time */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between">
                                        Suggested Time
                                        <span className="text-xs text-primary font-normal">Low traffic window</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">schedule</span>
                                        <select 
                                            className="w-full pl-10 py-2 bg-slate-50 dark:bg-[#101922] border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary text-slate-900 dark:text-white font-medium appearance-none outline-none"
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                        >
                                            <option>02:30 PM</option>
                                            <option>03:00 PM</option>
                                            <option>03:30 PM</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            {/* Map Preview (Optional Visual Context) */}
                            <div className="rounded-lg overflow-hidden h-32 relative">
                                <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: 'url("https://placeholder.pics/svg/300")' }}></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-white/90 to-transparent dark:from-[#1A2633]/90 p-4 flex flex-col justify-center">
                                    <p className="text-xs font-bold text-slate-500 uppercase">Estimated Trip</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">25 mins • 8.4 miles</p>
                                </div>
                            </div>
                        </div>
                        {/* Footer Actions */}
                        <div className="pt-4 mt-auto border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-4">
                            <button className="px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex-1 sm:flex-none">
                                Save as Draft
                            </button>
                            <button onClick={handleFinalizeBooking} className="px-6 py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex-1 flex items-center justify-center gap-2">
                                Finalize Booking
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}