"use client";

import { UserButton } from "@/components/auth/user-button";
import { ChevronFirst, ChevronLast, MoreVertical, Crown, Zap } from "lucide-react";
import Link from "next/link";
import { createContext, useContext, useEffect, useState } from "react";

const SidebarContext = createContext();

export default function Sidebar({ children }) {
    const [expanded, setExpanded] = useState(true);
    const [activeItem, setActiveItem] = useState(null);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleItemClick = (itemKey) => {
        setActiveItem(itemKey);
        setMobileMenuOpen(false);
    };

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setMobileMenuOpen(false);
            }
        };

        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                setMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        document.addEventListener('keydown', handleEscape);
        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    return (
        <>
            {/* Ultra-premium mobile overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-30 md:hidden transition-all duration-700"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                        background: 'radial-gradient(circle at 40% 40%, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 25%, rgba(59, 130, 246, 0.05) 50%, rgba(0, 0, 0, 0.8) 100%)',
                        backdropFilter: 'blur(20px) saturate(1.5)',
                    }}
                />
            )}

            {/* Floating mobile toggle with premium styling */}
            <button
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden fixed left-6 top-6 z-50 group"
                aria-label="Toggle Menu"
            >
                <div className="relative">
                    {/* Outer glow ring */}
                    <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-violet-500/20 via-blue-500/20 to-cyan-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    
                    {/* Main button */}
                    <div className="relative p-4 rounded-3xl bg-white/10 backdrop-blur-3xl border border-white/20 shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 hover:border-violet-400/50">
                        {/* Inner gradient overlay */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500/10 via-blue-500/5 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        <svg className="relative w-6 h-6 text-white/90 group-hover:text-white transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                                className="transition-all duration-300"
                            />
                        </svg>
                    </div>
                </div>
            </button>

            <aside
                className={`fixed md:sticky left-0 top-0 h-screen z-40
                    transform transition-all duration-700 ease-out
                    ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                    ${expanded ? "md:w-80" : "md:w-20"}
                    w-80 relative overflow-hidden group`}
                onMouseMove={handleMouseMove}
            >
                {/* Sophisticated multi-layer background */}
                <div className="absolute inset-0">
                    {/* Base gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950" />
                    
                    {/* Overlay gradients for depth */}
                    <div className="absolute inset-0 bg-gradient-to-b from-violet-950/30 via-transparent to-blue-950/20" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-950/10 to-transparent" />
                    
                    {/* Interactive mouse-following gradient */}
                    <div 
                        className="absolute w-96 h-96 bg-gradient-radial from-violet-500/8 via-blue-500/4 to-transparent rounded-full blur-3xl transition-all duration-300 pointer-events-none"
                        style={{
                            left: mousePosition.x - 192,
                            top: mousePosition.y - 192,
                        }}
                    />
                    
                    {/* Premium animated orbs */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-br from-violet-500/8 to-purple-500/4 rounded-full blur-3xl animate-pulse opacity-40" />
                        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-gradient-to-br from-blue-500/8 to-cyan-500/4 rounded-full blur-3xl animate-pulse opacity-40" style={{ animationDelay: '3s', animationDuration: '4s' }} />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-indigo-500/6 to-violet-500/3 rounded-full blur-2xl animate-pulse opacity-30" style={{ animationDelay: '1.5s', animationDuration: '3s' }} />
                    </div>
                </div>

                {/* Glass morphism container */}
                <div className="relative h-full flex flex-col backdrop-blur-2xl bg-white/[0.02] border-r border-white/10 shadow-2xl">
                    
                    {/* Ultra-premium header */}
                    <div className="relative p-8 border-b border-white/10 bg-gradient-to-r from-white/[0.08] to-white/[0.04] backdrop-blur-sm">
                        {/* Header background effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-transparent to-blue-500/5" />
                        
                        <div className="relative flex justify-between items-center">
                            <div className={`flex items-center space-x-5 transition-all duration-700 ${expanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6 md:opacity-0"}`}>
                                {/* Luxury logo with multiple layers */}
                                <div className="relative group">
                                    {/* Outer glow */}
                                    <div className="absolute -inset-2 bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-all duration-500" />
                                    
                                    {/* Main logo container */}
                                    <div className="relative">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-all duration-300" />
                                        <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500 via-blue-500 to-cyan-500 flex items-center justify-center shadow-2xl transform group-hover:scale-105 transition-all duration-300">
                                            <Crown className="w-7 h-7 text-white drop-shadow-lg" />
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Premium brand identity */}
                                <div className="flex flex-col space-y-1">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-2xl font-bold bg-gradient-to-r from-white via-violet-200 to-blue-200 bg-clip-text text-transparent tracking-tight">
                                            SkillHub
                                        </span>
                                        <Zap className="w-4 h-4 text-violet-400 animate-pulse" />
                                    </div>
                                    
                                </div>
                            </div>
                            
                            {/* Sophisticated toggle */}
                            <button
                                onClick={() => setExpanded((curr) => !curr)}
                                className="hidden md:flex items-center justify-center w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-xl transition-all duration-300 hover:scale-110 active:scale-95 group border border-white/20 hover:border-violet-400/40 relative overflow-hidden"
                            >
                                {/* Button background effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-blue-500/5 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                {expanded ? (
                                    <ChevronFirst size={20} className="relative text-violet-300 group-hover:text-white transition-all duration-300 drop-shadow-sm"/>
                                ) : (
                                    <ChevronLast size={20} className="relative text-violet-300 group-hover:text-white transition-all duration-300 drop-shadow-sm"/>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Enhanced navigation */}
                    <SidebarContext.Provider value={{ expanded, activeItem, handleItemClick }}>
                        <nav className="flex-1 overflow-y-auto py-6 premium-scrollbar">
                            <style jsx>{`
                                .premium-scrollbar::-webkit-scrollbar {
                                    width: 6px;
                                }
                                .premium-scrollbar::-webkit-scrollbar-track {
                                    background: rgba(255, 255, 255, 0.05);
                                    border-radius: 3px;
                                    margin: 8px;
                                }
                                .premium-scrollbar::-webkit-scrollbar-thumb {
                                    background: linear-gradient(to bottom, rgb(139, 92, 246), rgb(59, 130, 246));
                                    border-radius: 3px;
                                    border: 1px solid rgba(255, 255, 255, 0.1);
                                }
                                .premium-scrollbar::-webkit-scrollbar-thumb:hover {
                                    background: linear-gradient(to bottom, rgb(167, 139, 250), rgb(99, 102, 241));
                                    box-shadow: 0 0 8px rgba(139, 92, 246, 0.4);
                                }
                            `}</style>
                            <ul className="px-6 space-y-3">
                                {children}
                            </ul>
                        </nav>
                    </SidebarContext.Provider>

                    {/* Luxury footer */}
                    <div className="relative border-t border-white/10 p-8 bg-gradient-to-r from-white/[0.08] to-white/[0.04] backdrop-blur-sm">
                        {/* Footer background effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-transparent to-blue-500/5" />
                        
                        <div className="relative flex items-center space-x-5">
                            {/* Premium user avatar */}
                            <div className="relative group">
                                {/* Outer glow ring */}
                                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 opacity-30 group-hover:opacity-60 transition-all duration-500 blur-lg" />
                                
                                {/* Avatar container */}
                                <div className="relative">
                                    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 opacity-50 group-hover:opacity-75 transition-all duration-300 blur-sm" />
                                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-white/20 group-hover:ring-violet-400/50 transition-all duration-300 bg-gradient-to-br from-violet-500/20 via-blue-500/10 to-cyan-500/20 backdrop-blur-xl">
                                        <UserButton />
                                    </div>
                                </div>
                                
                                {/* Status indicator */}
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 border-2 border-gray-900 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                </div>
                            </div>
                            
                            {/* User information */}
                            <div className={`flex-1 transition-all duration-700 ${
                                expanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6 md:invisible"
                            }`}>
                                <div className="flex items-center space-x-2 mb-1">
                                    <p className="text-sm font-semibold text-white">Executive User</p>
                                    <div className="px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-500/20 to-blue-500/20 border border-violet-400/30">
                                        <span className="text-xs text-violet-300 font-medium">PRO</span>
                                    </div>
                                </div>
                                <p className="text-xs text-violet-300/70 font-medium">Premium Member</p>
                            </div>
                            
                            {/* Premium settings button */}
                            {expanded && (
                                <button className="relative p-3 hover:bg-white/10 rounded-2xl transition-all duration-300 border border-white/10 hover:border-violet-400/40 group hover:scale-110 active:scale-95 overflow-hidden">
                                    {/* Button background effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-blue-500/5 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <MoreVertical size={16} className="relative text-violet-300 group-hover:text-white transition-colors duration-300 drop-shadow-sm" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}

export function SidebarItem({ icon, text, alert, href, itemKey }) {
    const { expanded, activeItem, handleItemClick } = useContext(SidebarContext);
    const isActive = activeItem === itemKey;

    const content = (
        <div className="flex items-center w-full relative">
            {/* Premium icon container */}
            <div className={`relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-500 overflow-hidden ${
                isActive 
                    ? "bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 shadow-xl shadow-violet-500/30 scale-105" 
                    : "bg-white/5 group-hover:bg-white/10 border border-white/10 group-hover:border-violet-400/30"
            }`}>
                {/* Active state glow */}
                {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 blur-xl opacity-50" />
                )}
                
                {/* Hover effect */}
                {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-blue-500/10 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
                
                <span className={`relative z-10 transition-all duration-300 ${
                    isActive ? "text-white scale-110 drop-shadow-lg" : "text-violet-300 group-hover:text-white group-hover:scale-110"
                }`}>
                    {icon}
                </span>
            </div>
            
            {/* Enhanced text */}
            <span className={`ml-5 text-sm transition-all duration-700 font-medium tracking-wide ${
                expanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6 md:invisible"
            } ${
                isActive ? "text-white font-semibold" : "text-violet-200/80 group-hover:text-white"
            }`}>
                {text}
            </span>
            
            {/* Premium alert badge */}
            {alert && (
                <div className={`absolute transition-all duration-500 ${
                    expanded ? "right-4" : "top-0 right-0"
                }`}>
                    <div className="relative">
                        {/* Outer glow */}
                        <div className="absolute inset-0 w-3 h-3 rounded-full bg-gradient-to-r from-pink-400 to-red-500 blur-sm opacity-75" />
                        {/* Main badge */}
                        <div className="relative w-3 h-3 rounded-full bg-gradient-to-r from-pink-400 via-red-500 to-orange-400 shadow-lg border border-white/20" />
                        {/* Pulse effect */}
                        <div className="absolute inset-0 w-3 h-3 rounded-full bg-gradient-to-r from-pink-400 to-red-500 animate-ping opacity-30" />
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <li className="relative group">
            {/* Active state indicator with premium styling */}
            <div className={`absolute left-0 top-1/2 -translate-y-1/2 transition-all duration-500 ${
                isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-50 group-hover:opacity-60 group-hover:scale-y-75"
            }`}>
                <div className="h-10 w-1 bg-gradient-to-b from-violet-400 via-blue-400 to-cyan-400 rounded-r-full shadow-lg shadow-violet-500/50" />
            </div>

            {/* Premium background effects */}
            <div className={`absolute inset-0 rounded-3xl transition-all duration-500 ${
                isActive
                    ? "bg-gradient-to-r from-violet-500/15 via-blue-500/10 to-cyan-500/15 border border-violet-400/30 shadow-lg shadow-violet-500/20"
                    : "bg-transparent group-hover:bg-gradient-to-r group-hover:from-white/5 group-hover:to-white/10 border border-transparent group-hover:border-white/10"
            }`} />

            {/* Premium glow effect for active items */}
            {isActive && (
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-500/10 via-blue-500/5 to-cyan-500/10 blur-2xl" />
            )}

            <div
                onClick={() => handleItemClick(itemKey)}
                className="relative py-4 px-5 cursor-pointer transition-all duration-500 rounded-3xl hover:scale-[1.02] active:scale-[0.98] transform"
            >
                {href ? (
                    <Link href={href} className="flex items-center w-full">
                        {content}
                    </Link>
                ) : (
                    content
                )}
            </div>
        </li>
    );
}
