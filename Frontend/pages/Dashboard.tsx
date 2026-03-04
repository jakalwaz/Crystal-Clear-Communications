import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    UserPlus, 
    Calendar as CalendarIcon, 
    MoveUp, 
    Pill, 
    Filter, 
    Search,
    MoreVertical,
    Bluetooth,
    BluetoothOff,
    Plus,
    CheckCircle,
    MapPin,
    Clock,
    Wifi,
    WifiOff
} from 'lucide-react';
import { PatientDetailsModal } from '../components/PatientDetailsModal';
import { Patient } from '../types';

interface Task {
    id: string;
    type: 'urgent' | 'warning' | 'reminder' | 'manual';
    title: string;
    subtitle?: string;
    time?: string;
    action?: string;
}

export default function Dashboard() {
    const navigate = useNavigate();

    // --- State ---
    const [serviceStatus, setServiceStatus] = useState<boolean>(false);
    const [taskInput, setTaskInput] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Patient Data State
    const [patients, setPatients] = useState<Patient[]>([
        { id: '88392', name: 'Arthur Pendelton', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAk_iquDVX6v342rkoNp-ysb470rJIA2P0TQUwbJpLUmO109LBDIq-BYJVC17kXO1SyRiFhCgOM-8Bxvol1Jq7E2u3Wu14g33cNR9jU0Mv37scIZulHMrgMgkF3LFWxfpnhqjBQjo9pVRUVRwQijycUb2Hk40I7g7iTQNodTLMeb7VWAuO5L12BHPsXw7wu94kVY1lI97cIBfd6qtREP1orK6F0WtGKhus9CQrCLmMeIXDLk86Uu0_gsTlH357-iJwKDRT-hz0NSCo', condition: 'Dialysis • Diabetic', status: 'High Risk', transportStatus: 'Negotiating' },
        { id: '99210', name: 'Linda Martinez', avatar: '', condition: 'Physical Therapy', status: 'Stable', transportStatus: 'Requested' },
        { id: '11029', name: 'James Doe', avatar: '', condition: 'Post-Op Recovery', status: 'Mod Risk', transportStatus: 'Arrived' },
        { id: '44021', name: 'Sarah Jenkins', avatar: '', condition: 'Asthma Check', status: 'Stable', transportStatus: 'Arrived' },
        { id: '77390', name: 'Michael Chen', avatar: '', condition: 'Cardiac Monitor', status: 'High Risk', transportStatus: 'En Route' },
        { id: '22910', name: 'Emma Watson', avatar: '', condition: 'Neurology Follow-up', status: 'Mod Risk', transportStatus: 'Completed' },
        { id: '55102', name: 'David Kim', avatar: '', condition: 'Dental Surgery', status: 'Stable', transportStatus: 'Scheduled' },
        { id: '66011', name: 'Patricia Arquette', avatar: '', condition: 'Oncologist Visit', status: 'High Risk', transportStatus: 'Requested' },
    ]);

    // Filter patients
    const filteredPatients = patients.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.id.includes(searchQuery) ||
        p.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Tasks State
    const [tasks, setTasks] = useState<Task[]>([
        { id: '1', type: 'urgent', title: 'Arthur Pendelton', subtitle: 'Service connection interrupted via wearable link.', action: 'Intervene Manually' },
        { id: '2', type: 'urgent', title: 'Ride #4492', subtitle: 'Driver stopped >15m. No signal.' },
        { id: '3', type: 'warning', title: 'James Doe', subtitle: 'Insulin Supply < 2 Days', action: 'Auto-Refill Request' },
        { id: '4', type: 'reminder', title: 'Call Mary S. (Post-Op)', subtitle: 'Overdue by 15m' },
        { id: '5', type: 'reminder', title: 'Confirm Equip. Return', subtitle: 'Due 4:00 PM' },
    ]);

    // --- Effects ---
    useEffect(() => {
        if ('bluetooth' in navigator) {
             // @ts-ignore
            navigator.bluetooth.getAvailability().then((isAvailable: boolean) => {
                setServiceStatus(isAvailable);
            });
        }
    }, []);

    // --- Handlers ---
    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!taskInput.trim()) return;
        
        const newTask: Task = {
            id: Math.random().toString(),
            type: 'manual', 
            title: taskInput,
            subtitle: 'Manual Task • Just now',
        };
        
        setTasks([newTask, ...tasks]); // Add to top
        setTaskInput('');
    };

    const handleAddPatient = () => {
        const newPatient: Patient = {
            id: Math.floor(Math.random() * 90000 + 10000).toString(),
            name: 'New Patient',
            avatar: '',
            condition: 'Intake Pending',
            status: 'Stable',
            transportStatus: 'Scheduled'
        };
        setPatients([newPatient, ...patients]);
    };

    const handleCompleteTask = (id: string) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    const handlePatientClick = (patient: Patient) => {
        setSelectedPatient(patient);
    };

    // Helper for patient initials/color
    const getPatientMeta = (p: Patient) => {
        const initials = p.name.split(' ').map(n => n[0]).join('').substring(0, 2);
        const colors = ['blue', 'yellow', 'purple', 'slate', 'pink', 'indigo', 'teal'];
        const color = colors[parseInt(p.id) % colors.length];
        return { initials, color };
    };

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark overflow-hidden font-display">
            <main className="flex flex-1 overflow-hidden relative">
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 bg-background-light dark:bg-background-dark overflow-hidden relative">
                    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide space-y-6 pb-24">
                        {/* Alerts Section */}
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden group h-40">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <span className="material-symbols-outlined text-8xl text-red-500">ac_unit</span>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-red-100 dark:bg-red-800/40 p-2.5 rounded-lg shrink-0 text-red-600 dark:text-red-400">
                                        <span className="material-symbols-outlined text-2xl">weather_snowy</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-black text-red-700 dark:text-red-300 uppercase tracking-widest mb-1">Blizzard Warning</h3>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Severe snowstorm expected 4PM.</p>
                                    </div>
                                </div>
                                <p className="text-xs text-red-600/80 dark:text-red-400/80 font-bold bg-red-100/50 px-3 py-1.5 rounded-lg self-start">Prepare for ride delays.</p>
                            </div>

                            <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden group h-40">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <span className="material-symbols-outlined text-8xl text-orange-500">traffic</span>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-orange-100 dark:bg-orange-800/40 p-2.5 rounded-lg shrink-0 text-orange-600 dark:text-orange-400">
                                        <span className="material-symbols-outlined text-2xl">add_road</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-black text-orange-700 dark:text-orange-300 uppercase tracking-widest mb-1">Road Closure</h3>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Hwy 401 Eastbound Closed.</p>
                                    </div>
                                </div>
                                <p className="text-xs text-orange-600/80 dark:text-orange-400/80 font-bold bg-orange-100/50 px-3 py-1.5 rounded-lg self-start">Re-routing active rides.</p>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden h-40">
                                <div className="absolute top-2 right-2">
                                     <span className={`flex h-2 w-2 rounded-full ${serviceStatus ? 'bg-green-500' : 'bg-slate-300'} relative`}></span>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-100 dark:bg-blue-800/40 p-2.5 rounded-lg shrink-0 text-blue-600 dark:text-blue-400">
                                        {/* Keep Bluetooth icon visually as per request to 'detect bluetooth' but change text */}
                                        {serviceStatus ? <Bluetooth className="w-6 h-6" /> : <BluetoothOff className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">DEVICE STATUS</h3>
                                        <p className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                                            {serviceStatus ? 'Service Connection Active' : 'Service Connection Disabled'}
                                        </p>
                                    </div>
                                </div>
                                <div className="w-full bg-blue-100 dark:bg-blue-800/30 rounded-full h-1.5 overflow-hidden">
                                    <div className={`bg-blue-500 h-1.5 rounded-full transition-all duration-500`} style={{ width: serviceStatus ? '100%' : '15%' }}></div>
                                </div>
                            </div>
                        </section>

                        {/* Patient Directory */}
                        <section className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 dark:border-gray-700 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">grid_view</span>
                                        Local Patient Directory
                                    </h2>
                                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wide">Live monitoring • {filteredPatients.length} Active patients in view</p>
                                </div>
                                <div className="flex items-center gap-3 w-full lg:w-auto">
                                    <div className="relative w-full lg:w-80 group">
                                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        <input 
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white placeholder-slate-400 transition-all" 
                                            placeholder="Search by name, ID or status..." 
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <button className="flex items-center justify-center size-10 rounded-xl border border-slate-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-800 text-slate-600 dark:text-slate-300 transition-colors">
                                        <Filter className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6 bg-slate-50/50 dark:bg-gray-900/20">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {filteredPatients.map((p, i) => {
                                        const { initials, color } = getPatientMeta(p);
                                        const statusColor = p.transportStatus === 'En Route' ? 'blue' : p.transportStatus === 'Arrived' ? 'green' : 'slate';
                                        
                                        return (
                                        <div key={i} onClick={() => handlePatientClick(p)} className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-slate-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-lg transition-all group relative flex flex-col h-full cursor-pointer animate-in fade-in zoom-in-95 duration-200">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className={`size-12 rounded-full ${p.avatar ? 'bg-slate-200' : `bg-${color}-100 dark:bg-${color}-900/30 text-${color}-700 dark:text-${color}-300 border-${color}-200 dark:border-${color}-800`} overflow-hidden shrink-0 border border-slate-100 dark:border-gray-600 flex items-center justify-center shadow-sm`}>
                                                        {p.avatar ? (
                                                            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url("${p.avatar}")` }}></div>
                                                        ) : (
                                                            <span className="font-black text-sm">{initials}</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight group-hover:text-primary transition-colors">{p.name}</h3>
                                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">#{p.id}</p>
                                                    </div>
                                                </div>
                                                <button className="text-slate-300 hover:text-primary transition-colors">
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>
                                            </div>
                                            <div className="mb-4">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Condition</p>
                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-snug">{p.condition}</p>
                                            </div>
                                            <div className="mt-auto pt-4 border-t border-slate-100 dark:border-gray-700 flex items-center justify-between">
                                                <span className={`inline-flex items-center rounded-lg ${
                                                    p.status === 'High Risk' || p.status === 'Critical' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-100' :
                                                    p.status === 'Mod Risk' ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-100' :
                                                    'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-100'
                                                } px-2 py-1 text-[10px] font-black border uppercase tracking-wide`}>{p.status}</span>
                                                <div className={`flex items-center gap-1.5 text-${statusColor}-600 dark:text-${statusColor}-400 text-xs font-bold`}>
                                                    {p.transportStatus === 'En Route' || p.transportStatus === 'Negotiating' ? (
                                                        <span className={`size-2 rounded-full bg-${statusColor}-500 animate-pulse`}></span>
                                                    ) : p.transportStatus === 'Completed' || p.transportStatus === 'Arrived' ? (
                                                        <CheckCircle className="w-4 h-4" />
                                                    ) : (
                                                        <span className="size-2 rounded-full bg-slate-300"></span>
                                                    )}
                                                    {p.transportStatus}
                                                </div>
                                            </div>
                                        </div>
                                    )})}
                                </div>
                            </div>
                        </section>

                        {/* Inbound List as Calendar Timeline */}
                        <section className="pb-20 opacity-90">
                            <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700 flex flex-col h-[300px]">
                                <div className="p-5 border-b border-slate-200 dark:border-gray-700 flex justify-between items-center bg-slate-50/50 dark:bg-gray-800/20">
                                    <div>
                                        <h3 className="font-black text-slate-900 dark:text-white text-base">Inbound: General Hospital</h3>
                                    </div>
                                    <span className="bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800 text-xs font-bold px-2.5 py-1 rounded-lg">5 En Route</span>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {[
                                        { time: '14:30', name: 'Robert Fox', dept: 'Cardiology', status: 'On Time', color: 'emerald', eta: '8m' },
                                        { time: '15:00', name: 'Esther Howard', dept: 'Dialysis', status: 'Delayed', color: 'amber', eta: 'Late' },
                                        { time: '15:15', name: 'Jenny Wilson', dept: 'Physical Therapy', status: 'On Time', color: 'emerald', eta: '25m' },
                                        { time: '16:00', name: 'Guy Hawkins', dept: 'Radiology', status: 'Scheduled', color: 'blue', eta: '1h' },
                                    ].map((item, i) => (
                                        <div key={i} onClick={() => setSelectedPatient(patients[i % patients.length])} className="flex group cursor-pointer hover:bg-slate-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors p-2 -mx-2">
                                            <div className="w-16 flex flex-col items-center pt-1 border-r border-slate-100 dark:border-gray-700 mr-4">
                                                <span className="text-sm font-black text-slate-900 dark:text-white">{item.time}</span>
                                                <span className={`text-[10px] font-bold px-1.5 rounded mt-1 ${item.color === 'amber' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>{item.eta}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-primary-600 transition-colors">{item.name}</h4>
                                                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${item.status === 'Delayed' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>{item.status}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.dept}</span>
                                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Quick Actions Floating Bar */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
                        <div className="flex items-center gap-1 bg-slate-900/95 dark:bg-white/95 backdrop-blur-md text-white dark:text-slate-900 p-2 pl-3 rounded-2xl shadow-floating border border-slate-700 dark:border-slate-200">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-2">Quick Actions</span>
                            
                            <button 
                                onClick={() => navigate('/book')}
                                className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 dark:hover:bg-slate-100 rounded-xl transition-colors group"
                            >
                                <CalendarIcon className="w-5 h-5 text-emerald-400 dark:text-emerald-600" />
                                <span className="text-sm font-medium">Book</span>
                            </button>

                            <button 
                                onClick={() => navigate('/ai/move-appointment')}
                                className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 dark:hover:bg-slate-100 rounded-xl transition-colors"
                            >
                                <MoveUp className="w-5 h-5 text-orange-400 dark:text-orange-600" />
                                <span className="text-sm font-medium">Move</span>
                            </button>

                            <button 
                                onClick={() => navigate('/meds')}
                                className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 dark:hover:bg-slate-100 rounded-xl transition-colors"
                            >
                                <Pill className="w-5 h-5 text-blue-400 dark:text-blue-600" />
                                <span className="text-sm font-medium">Meds Request</span>
                            </button>

                            <div className="w-px h-5 bg-slate-700 dark:bg-slate-300 mx-1"></div>

                            <button 
                                onClick={handleAddPatient}
                                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-xl shadow-lg transition-transform active:scale-95 ml-1"
                            >
                                <UserPlus className="w-5 h-5" />
                                <span className="text-sm font-bold">Add Patient</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Action Center Sidebar */}
                <aside className="w-80 shrink-0 bg-white dark:bg-[#1e293b] border-l border-slate-200 dark:border-gray-700 flex flex-col z-30 shadow-xl">
                    <div className="p-5 border-b border-slate-200 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-800/50">
                        <div className="flex items-center justify-between mb-1">
                            <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">bolt</span>
                                Action Center
                            </h2>
                        </div>
                        <p className="text-xs text-slate-500">Prioritized tasks for your shift</p>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {/* Task Lists */}
                        <div>
                             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-1">
                                Urgent
                            </h3>
                            {tasks.filter(t => t.type === 'urgent').map(task => (
                                <div key={task.id} className="p-4 rounded-xl bg-white dark:bg-gray-800 border-l-4 border-l-red-500 border-y border-r border-slate-100 dark:border-gray-700 shadow-sm mb-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{task.title}</h4>
                                        <span className="text-[10px] font-bold text-red-600 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded">CRITICAL</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-3">{task.subtitle}</p>
                                    {task.action && (
                                        <button className="w-full py-1.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-xs font-bold rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                                            {task.action}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div>
                             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-1">
                                Warnings
                            </h3>
                             {tasks.filter(t => t.type === 'warning').map(task => (
                                <div key={task.id} className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-800/30 rounded-lg p-3 mb-3">
                                    <div className="flex items-start gap-3">
                                        <div className="size-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shrink-0 shadow-sm text-yellow-600 font-bold text-xs">
                                            {task.title.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{task.title}</p>
                                            <p className="text-xs text-slate-500">{task.subtitle}</p>
                                            {task.action && <button className="mt-2 text-xs font-bold text-primary hover:underline">{task.action}</button>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-1">
                                Reminders
                            </h3>
                            <div className="space-y-2">
                                {tasks.filter(t => t.type === 'reminder' || t.type === 'manual').map(task => (
                                    <div key={task.id} onClick={() => handleCompleteTask(task.id)} className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-gray-700 group">
                                        <div className="w-5 h-5 border-2 border-slate-300 rounded flex items-center justify-center group-hover:border-primary-500 transition-colors">
                                            {/* Empty square for checkbox, could add checkmark on hover */}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-800 dark:text-white group-hover:line-through transition-all">{task.title}</p>
                                            <p className="text-[10px] text-slate-500">{task.subtitle}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800/50">
                        <form onSubmit={handleAddTask} className="relative">
                            <input 
                                type="text" 
                                value={taskInput}
                                onChange={(e) => setTaskInput(e.target.value)}
                                placeholder="Add task..." 
                                className="w-full pl-4 pr-10 py-2.5 rounded-lg text-xs font-bold border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                            <button 
                                type="submit"
                                disabled={!taskInput.trim()}
                                className="absolute right-1.5 top-1.5 p-1 text-primary hover:bg-primary-50 rounded disabled:opacity-50 disabled:hover:bg-transparent"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </aside>
            </main>

            {selectedPatient && (
                <PatientDetailsModal patient={selectedPatient} onClose={() => setSelectedPatient(null)} />
            )}
        </div>
    );
}