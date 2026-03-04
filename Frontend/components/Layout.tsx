import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Users, 
    Calendar, 
    Menu, 
    LogOut,
    Clipboard,
    UserPlus,
    X,
    User as UserIcon,
    Activity,
    Phone,
    Mail,
    Clock,
    MapPin
} from 'lucide-react';
import { Avatar, Button, Input } from './UI';

interface LayoutProps {
    children: React.ReactNode;
}

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const location = useLocation();
    
    const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
        const isActive = location.pathname === to;
        return (
            <NavLink 
                to={to} 
                onClick={onClose}
                className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    isActive 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-slate-400'}`} />
                {label}
            </NavLink>
        );
    };

    return (
        <>
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            <aside className={`
                fixed top-0 left-0 bottom-0 w-72 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 ease-out
                lg:translate-x-0 lg:static lg:h-screen lg:flex lg:flex-col
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-16 flex items-center px-6 border-b border-slate-100 shrink-0">
                    <h1 className="font-black text-slate-900 leading-none tracking-tight">Crystal Clear Communications</h1>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    <div>
                        <p className="px-3 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3">System</p>
                        <div className="space-y-1">
                            <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
                            <NavItem to="/patients" icon={Users} label="Patients" />
                            <NavItem to="/schedule" icon={Calendar} label="Schedule" />
                        </div>
                    </div>

                    <div>
                        <p className="px-3 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3">TICKETS</p>
                        <div className="space-y-1">
                            <NavItem to="/ai/move-appointment" icon={Clipboard} label="Rescheduling tickets" />
                            <NavItem to="/ai/add-driver" icon={Clipboard} label="Follow up tickets" />
                        </div>
                    </div>
                </div>

                <div className="p-4 mt-auto border-t border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                        <Avatar alt="Nurse Sarah" size="sm" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-slate-900 truncate">Nurse Sarah</p>
                            <p className="text-[10px] text-slate-500 font-bold truncate">Command Lead</p>
                        </div>
                        <button className="text-slate-400 hover:text-red-500 transition-colors">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isApptModalOpen, setIsApptModalOpen] = useState(false);
    const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
    const [newAppt, setNewAppt] = useState({ patientName: '', day: 12, type: 'Other', time: '09:00 AM', location: 'General Hospital' });
    const navigate = useNavigate();

    const handleAddAppt = (e: React.FormEvent) => {
        e.preventDefault();
        setIsApptModalOpen(false);
    };

    const handleAddPatient = (e: React.FormEvent) => {
        e.preventDefault();
        setIsPatientModalOpen(false);
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Mobile Menu Button */}
                <div className="lg:hidden p-4 flex items-center justify-between bg-white border-b border-slate-200">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">Crystal Clear Communications</span>
                    </div>
                    <button onClick={() => setSidebarOpen(true)} className="p-2 -mr-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                <main className="flex-1 overflow-auto scroll-smooth p-6 lg:p-10 pb-32">
                    <div className="max-w-7xl mx-auto h-full">
                        {children}
                    </div>
                </main>
            </div>

            {/* Global Modals */}
            {isApptModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-3xl">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">Global Appointment Booking</h3>
                            <button onClick={() => setIsApptModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
                        </div>
                        <form onSubmit={handleAddAppt} className="p-8 space-y-5">
                            <Input label="Identity: Patient Name" size="md" value={newAppt.patientName} onChange={e => setNewAppt({...newAppt, patientName: e.target.value})} required icon={UserIcon} />
                            <div className="grid grid-cols-2 gap-5">
                                <Input label="Target Date (Oct)" type="number" min="1" max="31" value={newAppt.day} onChange={e => setNewAppt({...newAppt, day: Number(e.target.value)})} required icon={Calendar} />
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
                                    <select className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold bg-white h-[46px] focus:ring-4 focus:ring-primary-500/5 outline-none transition-all" value={newAppt.type} onChange={e => setNewAppt({...newAppt, type: e.target.value as any})}>
                                        <option value="Other">General</option>
                                        <option value="Onco">Oncology</option>
                                        <option value="Cardio">Cardiology</option>
                                        <option value="Dialysis">Dialysis</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <Input label="Time Block" placeholder="09:00 AM" value={newAppt.time} onChange={e => setNewAppt({...newAppt, time: e.target.value})} icon={Clock} />
                                <Input label="Wing / Dept" value={newAppt.location} onChange={e => setNewAppt({...newAppt, location: e.target.value})} icon={MapPin} />
                            </div>
                            <div className="pt-6 flex gap-4">
                                <Button type="submit" className="flex-1 py-4 uppercase text-xs tracking-[0.1em]">Finalize Appt</Button>
                                <Button type="button" variant="secondary" className="flex-1 py-4 uppercase text-xs tracking-[0.1em]" onClick={() => setIsApptModalOpen(false)}>Cancel</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isPatientModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
                        <div className="p-7 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">Global Enrollment</h3>
                            <button onClick={() => setIsPatientModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
                        </div>
                        <form onSubmit={handleAddPatient} className="p-10 space-y-6">
                            <Input label="Enrollment Name" placeholder="Jane Smith" required icon={UserIcon} />
                            <Input label="Target Diagnosis" placeholder="Physical Therapy / Cardiac Care" icon={Activity} />
                            <div className="grid grid-cols-2 gap-5">
                                <Input label="Emergency Bridge" placeholder="+1 (555) 000-0000" icon={Phone} />
                                <Input label="Email Hub" placeholder="user@clear-ride.org" icon={Mail} />
                            </div>
                            <div className="pt-6 flex gap-4">
                                <Button type="submit" className="flex-1 py-5 font-black uppercase text-xs tracking-widest">Onboard Entity</Button>
                                <Button type="button" variant="secondary" className="flex-1 font-bold text-xs uppercase" onClick={() => setIsPatientModalOpen(false)}>Cancel</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};