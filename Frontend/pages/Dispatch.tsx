import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

// Types for Dispatch Data
interface CallData {
  id: string;
  name: string;
  phone?: string;
  avatar: string;
  waitTime: string;
  status: 'Urgent' | 'Active' | 'History';
  riskLabel?: string;
  riskColor?: string; // Tailwind class component for bg/text
  subtext: string;
  sentiment: 'Anxious' | 'Neutral' | 'Angry' | 'Unknown';
  sentimentIcon: string;
  sentimentColor: string;
  intent: string;
  location: string;
  extractedDetails: string[];
  isPremium?: boolean;
  isAiListening?: boolean;
}

const MOCK_CALLERS: CallData[] = [
  {
    id: 'CR-9921',
    name: 'Sarah Jenkins',
    phone: '+1 (555) 012-3456',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZzPWIBgENeZjGSRSrImODZ-1kJN3UkccDQOzzw2YmJE3rbXIM0aJUqSicvXcZTwmCY8WsjhMq2pl6BLaBfOgeSRrLBgwqyd7Z59j3h1M0JFMK7VkA8CbVMz5biy-TZsv9l0A4wk7ALNEobgj6W-StNbuwjNNdFFtjdDzMVARVBzoWANwpHLt2FVI1Iq5LEjTpFLJ1bshYb_Aas3oU9RKhu4gmvCbp4t3-ZbmQYxwVHf3gVuyyjZE56FgIZPHK8g44-U0QWT_CxFY',
    waitTime: '04:12',
    status: 'Urgent',
    riskLabel: 'High Risk',
    riskColor: 'red',
    subtext: 'Dialysis • Chest Pain',
    sentiment: 'Anxious',
    sentimentIcon: 'sentiment_stressed',
    sentimentColor: 'text-danger',
    intent: 'Requesting urgent transport to <span class="font-semibold text-dispatch-primary">City General Hospital</span> for dialysis treatment.',
    location: '123 Maple Ave, Springfield.',
    extractedDetails: ['Wheelchair accessible vehicle required.', 'Companion traveling: No.', 'Insurance: BlueCross ID ending in #9928.'],
    isPremium: true
  },
  {
    id: 'CR-8821',
    name: 'John Doe',
    phone: '+1 (555) 999-8888',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzsjLcnlBU7kLVZPr3zv8Fd32VhIImhQ_-MoPmkMDyQh76Axnx71QQer1dHG1sDMtWcOwj18khqelQYzgvrBarXzLvhC7Qt3tg2MJ-RN4FOBhYMdrUHvvgZN8aaaXGgUpGCPFahrOeC09Tk9hCm0dEUfH2twP3xb29CFDfczcu1WvVvgk19jmGgSzGX0GOHWLKCBx5quaUXGON3su316_GgjlhOwlQhL395_pj-01S-X_LyrX4zNwjYz-lk2U5hnsCLZLad5xqeUo',
    waitTime: '01:45',
    status: 'Active',
    riskLabel: 'Medium',
    riskColor: 'orange',
    subtext: 'Late for Appt',
    sentiment: 'Neutral',
    sentimentIcon: 'sentiment_neutral',
    sentimentColor: 'text-warning',
    intent: 'Checking status of scheduled ride for 2:00 PM appointment.',
    location: '4500 Pine St, Downtown.',
    extractedDetails: ['Ride verified on map.', 'Driver ETA: 5 mins.', 'User requesting text notification.'],
    isPremium: false
  },
  {
    id: 'CR-3321',
    name: 'Emily Chen',
    phone: '+1 (555) 333-2222',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAnREYf91nfg6x8INCaJX-V6doeIF6NiKhXn3qdLN67KnBzggAFc9ImGDuhNp65k7pkHj0aIznRr0ZlwuPbj7eweLzcgVMqxl-cfA_UxHzlIy1Fg678sdXPMD7G_HPrT3f9MJBm76_aglY37bpqoKWV1QeOzTAuIBNTx47wXgfT9y9ivbbnThGkbUa4gHLY0s6tUjYi4jEvYKyqJQkL1_0Bf5aBQ3pTM59l3_F_NnmR30kFIk0yOD0rqsIvkZxOs2DQ01NTwR7W7A',
    waitTime: '00:30',
    status: 'Active',
    riskLabel: 'New',
    riskColor: 'blue',
    subtext: 'Membership Question',
    sentiment: 'Neutral',
    sentimentIcon: 'help',
    sentimentColor: 'text-blue-400',
    intent: 'Inquiring about premium membership benefits and renewal cost.',
    location: 'Unknown',
    extractedDetails: ['Account status: Active', 'Renewal Due: Nov 1st'],
    isPremium: true
  },
  {
    id: 'CR-0000',
    name: 'Unknown Caller',
    avatar: '',
    waitTime: '00:05',
    status: 'Active',
    riskLabel: 'Screening',
    riskColor: 'gray',
    subtext: 'AI Listening...',
    sentiment: 'Unknown',
    sentimentIcon: 'hearing',
    sentimentColor: 'text-gray-400',
    intent: '<i>Transcribing initial intent...</i>',
    location: 'Triangulating...',
    extractedDetails: [],
    isAiListening: true
  }
];

export default function Dispatch() {
    const [activeTab, setActiveTab] = useState<'Urgent' | 'Active' | 'History'>('Urgent');
    const [selectedId, setSelectedId] = useState<string>('CR-9921');
    const [viewMode, setViewMode] = useState<'Summary' | 'Transcript'>('Summary');

    // Filter logic: In a real app, 'Urgent' tab might show only Urgent, 'Active' shows all active, etc.
    // For this prototype, I'll filter based on status for Urgent, but show all for Active/History to populate the list.
    const filteredCallers = MOCK_CALLERS.filter(c => {
        if (activeTab === 'Urgent') return c.status === 'Urgent';
        // Show all for Active/History for demo purposes so list isn't empty
        return true; 
    });

    const activeCall = MOCK_CALLERS.find(c => c.id === selectedId) || MOCK_CALLERS[0];

    return (
        <div className="bg-dispatch-bg-dark font-display text-white overflow-hidden h-screen flex flex-col">
            <header className="flex shrink-0 items-center justify-between whitespace-nowrap border-b border-solid border-dispatch-border bg-dispatch-bg-dark px-6 py-3">
                <div className="flex items-center gap-4 text-white">
                    <div className="flex items-center justify-center rounded-lg bg-dispatch-primary/20 p-2 text-dispatch-primary">
                        <span className="material-symbols-outlined text-2xl">ambulance</span>
                    </div>
                    <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">ClearRide Dispatch</h2>
                </div>
                <div className="flex flex-1 justify-end gap-6 items-center">
                    <div className="flex items-center gap-2 rounded-full bg-dispatch-surface px-3 py-1.5 border border-dispatch-border">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
                        </span>
                        <span className="text-xs font-medium text-gray-300">System Online</span>
                    </div>
                    <div className="h-6 w-px bg-dispatch-border"></div>
                    <div className="flex gap-3">
                        <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg hover:bg-dispatch-surface text-gray-400 hover:text-white transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        
                        {/* Back to App Link */}
                        <NavLink to="/" className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg hover:bg-dispatch-surface text-gray-400 hover:text-white transition-colors" title="Back to Nurse Command">
                            <span className="material-symbols-outlined">dashboard</span>
                        </NavLink>

                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-white leading-none">Alex M.</p>
                                <p className="text-xs text-gray-400 leading-none mt-1">Senior Dispatcher</p>
                            </div>
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-dispatch-surface" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA6nZeCJyeJ_AiICCs0jC3q6r8qCSj_f75uq-7-QkicvIvgOcZxFzusN--yDLTutwz0B2Tc_CWPoFNdxFIazxq_LbeZNQa9aoLOzVgCwbG4K7btff-ncPxaEJSJbV4w3dKYtdX2xXVyDvGfb-hO90PdVlWM0L52GV9XqO_WqpikhOC4GFD2-05mBIU6kw0BFBZjAMnv8lNPA8MH1P8ShXWFoNqs7Mw9DaOGllmzLUhCjieEhRBwpfZiA9WASr-LK_Eo-MWT2mX9rE4")' }}></div>
                        </div>
                    </div>
                </div>
            </header>
            
            <div className="flex flex-1 overflow-hidden">
                <main className="flex-1 flex flex-col min-w-0 bg-dispatch-bg-dark relative overflow-y-auto">
                    <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#0f66bd 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                    <div className="relative z-10 flex flex-col h-full p-6 lg:p-10 max-w-5xl mx-auto w-full">
                        <div className="flex items-center gap-2 mb-6 text-sm text-gray-400">
                            <span>Workspace</span>
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                            <span className="text-white">Active Call #{activeCall.id}</span>
                            <span className="ml-2 rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-400 border border-red-500/20">Live Recording</span>
                        </div>
                        
                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-dispatch-surface rounded-xl p-6 border border-dispatch-border mb-8 shadow-sm">
                            <div className="flex items-center gap-5">
                                <div className="relative">
                                    {activeCall.avatar ? (
                                        <div className="bg-center bg-no-repeat bg-cover rounded-full h-20 w-20 border-4 border-dispatch-bg-dark shadow-lg" style={{ backgroundImage: `url("${activeCall.avatar}")` }}></div>
                                    ) : (
                                        <div className="flex items-center justify-center bg-gray-800 rounded-full h-20 w-20 text-gray-500 border-4 border-dispatch-bg-dark shadow-lg">
                                            <span className="material-symbols-outlined text-4xl">person_off</span>
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 right-0 p-1 bg-dispatch-bg-dark rounded-full">
                                        <span className="material-symbols-outlined text-dispatch-primary text-xl bg-white rounded-full p-1">call</span>
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-1">{activeCall.name}</h1>
                                    <div className="flex items-center gap-3 text-gray-400 text-sm">
                                        {activeCall.phone && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">phone_iphone</span> {activeCall.phone}</span>}
                                        {activeCall.isPremium && (
                                            <>
                                                <span className="h-1 w-1 rounded-full bg-gray-600"></span>
                                                <span className="text-dispatch-primary font-medium">Premium Member</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 w-full md:w-auto">
                                <div className="flex flex-col items-center justify-center rounded-lg bg-dispatch-bg-dark px-4 py-2 border border-dispatch-border">
                                    <span className="text-xs text-gray-400 uppercase tracking-wider">Wait Time</span>
                                    <span className="text-xl font-mono font-bold text-warning">{activeCall.waitTime}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center rounded-lg bg-dispatch-bg-dark px-4 py-2 border border-dispatch-border">
                                    <span className="text-xs text-gray-400 uppercase tracking-wider">Sentiment</span>
                                    <span className={`text-xl font-bold flex items-center gap-1 ${activeCall.sentimentColor}`}>
                                        <span className={`material-symbols-outlined ${activeCall.sentimentColor}`}>{activeCall.sentimentIcon}</span> {activeCall.sentiment}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-6">
                            <div className="flex p-1 bg-dispatch-surface rounded-lg border border-dispatch-border">
                                <button 
                                    onClick={() => setViewMode('Summary')}
                                    className={`px-4 py-2 rounded-md text-sm font-bold shadow-sm transition-all ${viewMode === 'Summary' ? 'bg-dispatch-primary text-white' : 'text-gray-400 hover:text-white'}`}
                                >
                                    VA Summary
                                </button>
                                <button 
                                    onClick={() => setViewMode('Transcript')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'Transcript' ? 'bg-dispatch-primary text-white font-bold' : 'text-gray-400 hover:text-white'}`}
                                >
                                    Live Transcript
                                </button>
                            </div>
                            <div className="flex items-center gap-2 text-dispatch-primary text-sm font-medium cursor-pointer hover:underline">
                                <span className="material-symbols-outlined text-lg">history</span> View Previous Calls
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 flex-1">
                            {viewMode === 'Summary' ? (
                                <div className="space-y-6">
                                    <div className="bg-dispatch-surface border border-dispatch-border rounded-xl overflow-hidden">
                                        <div className="px-6 py-4 border-b border-dispatch-border flex justify-between items-center bg-dispatch-surface/50">
                                            <h3 className="font-bold text-white flex items-center gap-2">
                                                <span className="material-symbols-outlined text-dispatch-primary">auto_awesome</span> 
                                                AI Call Analysis
                                            </h3>
                                            <span className="text-xs text-gray-400">Updated 2s ago</span>
                                        </div>
                                        <div className="p-6 space-y-6">
                                            <div>
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Primary Intent</span>
                                                <p className="text-lg text-white leading-relaxed" dangerouslySetInnerHTML={{ __html: activeCall.intent }}></p>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {activeCall.riskColor === 'red' && (
                                                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="material-symbols-outlined text-danger">warning</span>
                                                            <span className="text-danger font-bold text-sm">Risk Detected</span>
                                                        </div>
                                                        <p className="text-sm text-gray-300">Patient mentions missing start time. {activeCall.subtext}.</p>
                                                    </div>
                                                )}
                                                <div className="bg-dispatch-bg-dark border border-dispatch-border rounded-lg p-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="material-symbols-outlined text-dispatch-primary">pin_drop</span>
                                                        <span className="text-dispatch-primary font-bold text-sm">Location Match</span>
                                                    </div>
                                                    <p className="text-sm text-gray-300">{activeCall.location} <br/><span className="text-gray-500">Confirmed via GPS & Voice.</span></p>
                                                </div>
                                            </div>
                                            {activeCall.extractedDetails.length > 0 && (
                                                <div>
                                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Extracted Details</span>
                                                    <ul className="space-y-2">
                                                        {activeCall.extractedDetails.map((detail, idx) => (
                                                            <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                                                                <span className="material-symbols-outlined text-gray-500 text-lg">check_circle</span>
                                                                <span>{detail}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-dispatch-surface border border-dispatch-border rounded-xl overflow-hidden flex-1 flex flex-col">
                                    <div className="px-6 py-4 border-b border-dispatch-border flex justify-between items-center bg-dispatch-surface/50">
                                        <h3 className="font-bold text-white flex items-center gap-2">
                                            <span className="material-symbols-outlined text-dispatch-primary">graphic_eq</span> 
                                            Live Transcript
                                        </h3>
                                        <span className="text-xs text-emerald-500 font-mono animate-pulse">● REC</span>
                                    </div>
                                    <div className="p-6 flex-1 overflow-y-auto space-y-4 font-mono text-sm">
                                        <div className="flex gap-4">
                                            <span className="text-gray-500 w-16 text-right">00:01</span>
                                            <div className="flex-1 text-dispatch-primary">AI: Hello, this is ClearRide Dispatch. How can I help you?</div>
                                        </div>
                                        <div className="flex gap-4">
                                            <span className="text-gray-500 w-16 text-right">00:05</span>
                                            <div className="flex-1 text-white">{activeCall.intent.replace(/<[^>]*>?/gm, '')}</div>
                                        </div>
                                        <div className="flex gap-4 opacity-50">
                                            <span className="text-gray-500 w-16 text-right">--:--</span>
                                            <div className="flex-1 text-gray-500 italic">Listening...</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
                
                <aside className="w-full lg:w-[420px] xl:w-[460px] flex flex-col bg-dispatch-surface border-l border-dispatch-border z-20 shadow-2xl">
                    <div className="p-6 pb-2">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-white tracking-tight text-xl font-bold">Active Call Queue</h3>
                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-dispatch-border text-gray-400 hover:text-white cursor-pointer">
                                <span className="material-symbols-outlined text-lg">filter_list</span>
                            </div>
                        </div>
                        <div className="flex border-b border-dispatch-border gap-6">
                            <button 
                                onClick={() => setActiveTab('Urgent')}
                                className={`flex items-center gap-2 border-b-[3px] pb-3 pt-2 flex-1 justify-center transition-colors ${activeTab === 'Urgent' ? 'border-b-dispatch-primary text-white' : 'border-b-transparent text-gray-500 hover:text-gray-300'}`}
                            >
                                <span className="text-sm font-bold">Urgent</span>
                                <span className="bg-danger text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">3</span>
                            </button>
                            <button 
                                onClick={() => setActiveTab('Active')}
                                className={`flex items-center gap-2 border-b-[3px] pb-3 pt-2 flex-1 justify-center transition-colors ${activeTab === 'Active' ? 'border-b-dispatch-primary text-white' : 'border-b-transparent text-gray-500 hover:text-gray-300'}`}
                            >
                                <span className="text-sm font-bold">Active</span>
                                <span className="bg-gray-700 text-gray-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full">5</span>
                            </button>
                            <button 
                                onClick={() => setActiveTab('History')}
                                className={`flex items-center gap-2 border-b-[3px] pb-3 pt-2 flex-1 justify-center transition-colors ${activeTab === 'History' ? 'border-b-dispatch-primary text-white' : 'border-b-transparent text-gray-500 hover:text-gray-300'}`}
                            >
                                <span className="text-sm font-bold">History</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
                        {filteredCallers.map((caller) => {
                            const isSelected = selectedId === caller.id;
                            const riskColorMap: Record<string, string> = {
                                'red': 'bg-red-500/10 text-red-400 ring-red-500/20',
                                'orange': 'bg-orange-500/10 text-orange-400 ring-orange-500/20',
                                'blue': 'bg-blue-500/10 text-blue-400 ring-blue-500/20',
                                'gray': 'bg-gray-500/10 text-gray-400 ring-gray-500/20',
                            };

                            return (
                                <div 
                                    key={caller.id}
                                    onClick={() => setSelectedId(caller.id)}
                                    className={`group relative flex cursor-pointer gap-4 rounded-xl p-4 border transition-all ${isSelected 
                                        ? 'bg-[#2b3541] border-dispatch-primary/50 shadow-lg ring-1 ring-dispatch-primary/20' 
                                        : 'hover:bg-dispatch-bg-dark border-transparent hover:border-dispatch-border'}`}
                                >
                                    {isSelected && <div className="absolute right-0 top-0 rounded-bl-lg rounded-tr-lg bg-dispatch-primary px-2 py-0.5 text-[10px] font-bold text-white">VIEWING</div>}
                                    
                                    <div className="relative shrink-0">
                                        {caller.avatar ? (
                                            <div 
                                                className={`bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-14 ${!isSelected && 'grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100'} transition-all`} 
                                                style={{ backgroundImage: `url("${caller.avatar}")` }}
                                            ></div>
                                        ) : (
                                            <div className="flex items-center justify-center bg-gray-800 rounded-full h-14 w-14 text-gray-500 group-hover:text-gray-300 transition-colors">
                                                <span className="material-symbols-outlined text-2xl">person_off</span>
                                            </div>
                                        )}
                                        
                                        {!caller.isAiListening && (
                                            <div className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-dispatch-surface flex items-center justify-center ${isSelected ? 'bg-success' : 'bg-blue-500'}`}>
                                                {!isSelected && <span className="material-symbols-outlined text-[10px] text-white">smart_toy</span>}
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex flex-1 flex-col justify-center min-w-0">
                                        <div className="flex justify-between items-start">
                                            <p className={`${isSelected ? 'text-white font-bold' : 'text-gray-200 font-medium group-hover:text-white'} text-base truncate`}>{caller.name}</p>
                                            <span className={`${caller.status === 'Urgent' ? 'text-warning' : 'text-gray-400'} font-mono ${isSelected ? 'font-bold' : ''} text-sm`}>{caller.waitTime}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${riskColorMap[caller.riskColor || 'gray']}`}>
                                                {caller.riskLabel}
                                            </span>
                                            <span className="truncate text-gray-400 text-xs">{caller.subtext}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="p-4 bg-[#161b22] border-t border-dispatch-border flex justify-between items-center text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">cloud_done</span>
                            AI Services Operational
                        </div>
                        <span>v2.4.1</span>
                    </div>
                </aside>
            </div>
        </div>
    );
}