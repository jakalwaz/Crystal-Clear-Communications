import React from 'react';
import { LucideIcon, User } from 'lucide-react';

// --- Badges ---
export const Badge = ({ children, variant = 'default', className = '' }: { children?: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'danger' | 'neutral', className?: string }) => {
    const variants = {
        default: 'bg-primary-50 text-primary-700 border-primary-100',
        success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        warning: 'bg-amber-50 text-amber-700 border-amber-100',
        danger: 'bg-red-50 text-red-700 border-red-100',
        neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

// --- Buttons ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    icon?: LucideIcon;
    className?: string;
    children?: React.ReactNode;
    type?: "button" | "submit" | "reset";
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const Button = ({ children, variant = 'primary', size = 'md', icon: Icon, className = '', ...props }: ButtonProps) => {
    const baseStyles = "inline-flex items-center justify-center rounded-xl font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none active:scale-95";
    
    const variants = {
        primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm shadow-primary-600/20",
        secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-slate-500 shadow-sm",
        ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        danger: "bg-red-50 text-red-600 hover:bg-red-100",
    };

    const sizes = {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-6 text-sm",
        lg: "h-13 px-8 text-base",
    };

    return (
        <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
            {Icon && <Icon className={`w-4 h-4 ${children ? 'mr-2.5' : ''}`} />}
            {children}
        </button>
    );
};

// --- Avatar ---
export const Avatar = ({ src, alt, size = 'md', className = '' }: { src?: string, alt?: string, size?: 'sm' | 'md' | 'lg' | 'xl', className?: string }) => {
    const sizes = {
        sm: "w-8 h-8",
        md: "w-10 h-10",
        lg: "w-12 h-12",
        xl: "w-16 h-16",
    };
    
    // Using initials or a generic icon instead of images as requested
    const initials = alt ? alt.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '';

    return (
        <div className={`relative rounded-full flex items-center justify-center bg-slate-100 border border-slate-200 text-slate-500 font-bold tracking-tighter ${sizes[size]} ${className}`}>
            {initials ? (
                <span className={`${size === 'sm' ? 'text-[10px]' : size === 'xl' ? 'text-xl' : 'text-xs'}`}>{initials}</span>
            ) : (
                <User className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'}`} />
            )}
        </div>
    );
};

// --- Card ---
interface CardProps {
    children?: React.ReactNode;
    className?: string;
    noPadding?: boolean;
}

export const Card = ({ children, className = '', noPadding = false }: CardProps) => {
    return (
        <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm ${noPadding ? '' : 'p-6'} ${className}`}>
            {children}
        </div>
    );
};

// --- Inputs ---
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string;
    icon?: LucideIcon;
    className?: string;
    type?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const Input = ({ label, icon: Icon, className = '', size = 'md', ...props }: InputProps) => {
    const sizes = {
        sm: "px-4 py-2 text-xs",
        md: "px-4 py-3 text-sm font-medium",
        lg: "px-5 py-4 text-base",
    };

    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Icon className="w-4 h-4" />
                    </div>
                )}
                <input 
                    className={`w-full rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/5 transition-all ${Icon ? 'pl-11' : ''} ${sizes[size]}`}
                    {...props}
                />
            </div>
        </div>
    );
};