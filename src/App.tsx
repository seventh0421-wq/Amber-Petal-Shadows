/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  BookOpen, 
  Coffee, 
  HelpCircle, 
  ArrowRight, 
  ChevronDown, 
  Sparkles, 
  Feather, 
  Flame, 
  Star, 
  Menu as MenuIcon, 
  X,
  Plus,
  MapPin,
  Clock,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Maximize2
} from 'lucide-react';

import { 
  MENU_ITEMS, 
  CHRONICLE_ITEMS, 
  STAFF_PROFILES, 
  FAQS, 
  WINDOW_IMAGES, 
  PETAL_PHOTOS,
  MenuItem,
  StaffProfile
} from './data';

// Custom Botanical Lineart SVG Separator 
const BotanicalDivider = () => (
  <div className="flex justify-center items-center py-12 md:py-16 opacity-40 hover:opacity-85 transition-opacity duration-500">
    <svg className="w-48 h-8 text-amber-gold" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 6 C100 6, 93 16, 100 24 C107 16, 100 6, 100 6 Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M100 24 L100 38" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M100 18 C100 18, 114 16, 118 6" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      <path d="M100 14 C100 14, 86 16, 82 6" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      <path d="M30 20 L80 20" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3"/>
      <path d="M120 20 L170 20" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3"/>
      <circle cx="100" cy="4" r="1.5" fill="currentColor"/>
    </svg>
  </div>
);

// Asymmetric Sprout Graphic 
const LeafBranch = () => (
  <div className="flex justify-center my-8 opacity-25 select-none hover:opacity-40 transition-opacity duration-500">
    <svg className="w-12 h-12 text-emerald-950" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <path d="M50 90 C 50 60, 58 40, 50 15" />
      {/* leaf sets */}
      <path d="M50 70 C 65 65, 68 55, 60 50 C 54 53, 51 65, 50 70" fill="currentColor" fillOpacity="0.05" />
      <path d="M50 65 C 35 60, 32 50, 40 45 C 46 48, 49 60, 50 65" fill="currentColor" fillOpacity="0.05" />
      <path d="M50 48 C 63 43, 65 33, 57 28 C 52 31, 51 43, 50 48" fill="currentColor" fillOpacity="0.05" />
      <path d="M50 42 C 37 37, 35 27, 43 22 C 48 25, 49 37, 50 42" fill="currentColor" fillOpacity="0.05" />
      <path d="M50 25 C 58 20, 56 12, 51 10 C 47 11, 49 20, 50 25" fill="currentColor" fillOpacity="0.07" />
    </svg>
  </div>
);

export default function App() {
  const [entered, setEntered] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<'home' | 'services' | 'staff' | 'qa'>('home');
  const [hoveredTab, setHoveredTab] = useState<'home' | 'services' | 'staff' | 'qa' | null>(null);
  const [menuFilter, setMenuFilter] = useState<'all' | 'tea' | 'confection' | 'elixir'>('all');
  const [staffRole, setStaffRole] = useState<'scribe' | 'lantern'>('scribe');
  const [openFaq, setOpenFaq] = useState<string | null>('f1'); // default open server location FAQ
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [activeWindowImage, setActiveWindowImage] = useState<number>(0);
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null); // For Polaroid image lightbox modal
  
  const windowScrollRef = useRef<HTMLDivElement>(null);

  // Mouse drag scrolling functionality for Window-View section (Desktop)
  const windowDragIsDown = useRef(false);
  const windowDragStartX = useRef(0);
  const windowDragScrollLeft = useRef(0);

  const handleWindowMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    windowDragIsDown.current = true;
    if (windowScrollRef.current) {
      windowScrollRef.current.classList.add('cursor-grabbing');
      windowDragStartX.current = e.pageX - windowScrollRef.current.offsetLeft;
      windowDragScrollLeft.current = windowScrollRef.current.scrollLeft;
    }
  };

  const handleWindowMouseLeave = () => {
    windowDragIsDown.current = false;
    if (windowScrollRef.current) {
      windowScrollRef.current.classList.remove('cursor-grabbing');
    }
  };

  const handleWindowMouseUp = () => {
    windowDragIsDown.current = false;
    if (windowScrollRef.current) {
      windowScrollRef.current.classList.remove('cursor-grabbing');
    }
  };

  const handleWindowMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!windowDragIsDown.current || !windowScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - windowScrollRef.current.offsetLeft;
    const walk = (x - windowDragStartX.current) * 1.5; // Scroll speed multiplier
    windowScrollRef.current.scrollLeft = windowDragScrollLeft.current - walk;
  };

  const scrollPrevWindow = () => {
    if (windowScrollRef.current) {
      windowScrollRef.current.scrollBy({
        left: -350,
        behavior: 'smooth'
      });
    }
  };

  const scrollNextWindow = () => {
    if (windowScrollRef.current) {
      windowScrollRef.current.scrollBy({
        left: 350,
        behavior: 'smooth'
      });
    }
  };

  const handleEnter = () => {
    setEntered(true);
  };

  const menuRef = useRef<HTMLDivElement>(null);

  // Scroll to top on page switches to preserve clean magazine experience
  useEffect(() => {
    if (entered) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab, entered]);

  // Handle keys for modal navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPhoto(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFAF6] text-gray-800 font-sans selection:bg-[#C29355]/20 selection:text-emerald-950 relative overflow-x-hidden">
      
      {/* Progress Scroll Indicator */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-[#C29355] origin-left z-40"
        style={{ scaleX: 0 }}
        animate={entered ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* STAGE 1: SPLASH SCREEN (雙葉格門, 左右對開) */}
      <AnimatePresence>
        {!entered && (
          <div
            id="splash-screen"
            className="fixed inset-0 z-50 overflow-hidden flex pointer-events-auto select-none"
          >
            {/* Left Door */}
            <motion.div
              id="door-left"
              initial={{ x: 0 }}
              exit={{ 
                x: '-100%',
                transition: { duration: 1.8, ease: [0.76, 0, 0.24, 1] }
              }}
              className="w-1/2 h-full bg-[#0B2415] border-r border-[#C29355]/25 flex flex-col justify-between p-8 md:p-16 relative"
            >
              {/* Corner Lines Left */}
              <div className="absolute inset-y-8 left-8 right-0 border-y border-l border-[#C29355]/10 pointer-events-none hidden md:block" />
              
              <div className="z-10 text-left">
                <span className="font-serif text-sm tracking-[0.4em] text-[#C29355] font-bold uppercase block">
                  AMBER &
                </span>
                <span className="font-mono text-[9px] tracking-widest text-[#FDFAF6]/40 block mt-1">
                  EST. 2026
                </span>
              </div>

              {/* Middle quote split (left side) */}
              <div className="z-10 flex flex-col justify-center items-end h-full text-right max-w-xs ml-auto pr-4 select-none">
                <p className="text-sm md:text-base font-serif tracking-[0.4em] text-[#FDFAF6]/80 leading-loose">
                  時間流逝
                </p>
                <div className="w-8 h-[1px] bg-[#C29355]/30 mt-4" />
              </div>

              <div className="z-10 text-[11px] font-serif text-[#FDFAF6]/30 text-left leading-relaxed hidden sm:block max-w-xs">
                琥珀與花影（Amber & Petal Shadows）<br />
                誠摯獻給熱愛林中慢活的角色扮演者。
              </div>
            </motion.div>

            {/* Right Door */}
            <motion.div
              id="door-right"
              initial={{ x: 0 }}
              exit={{ 
                x: '100%',
                transition: { duration: 1.8, ease: [0.76, 0, 0.24, 1] }
              }}
              className="w-1/2 h-full bg-[#0B2415] border-l border-[#C29355]/25 flex flex-col justify-between p-8 md:p-16 relative"
            >
              {/* Corner Lines Right */}
              <div className="absolute inset-y-8 right-8 left-0 border-y border-r border-[#C29355]/10 pointer-events-none hidden md:block" />

              <div className="z-10 text-right">
                <span className="font-serif text-sm tracking-[0.4em] text-[#C29355] font-bold uppercase block">
                  PETAL SHADOWS
                </span>
                <span className="font-mono text-[9px] tracking-widest text-[#FDFAF6]/40 block mt-1">
                  TC - Garuda
                </span>
              </div>

              {/* Middle quote split (right side) */}
              <div className="z-10 flex flex-col justify-center items-start h-full text-left max-w-xs pl-4 select-none">
                <p className="text-sm md:text-base font-serif tracking-[0.4em] text-[#FDFAF6]/80 leading-loose">
                  但落入琥珀的夢，從不褪色。
                </p>
                <div className="w-8 h-[1px] bg-[#C29355]/30 mt-4" />
              </div>

              <div className="z-10 tracking-[0.2em] font-mono text-xs text-right text-[#FDFAF6]/30 leading-loose mt-auto w-full">
                GARUDA SERVER RP ATELIER
              </div>
            </motion.div>

            {/* Float Interface Cover (Fades out when doors part) */}
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ 
                opacity: 0,
                scale: 0.95,
                transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
              }}
              className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-transparent pointer-events-none"
            >
              {/* Center Sprout Icon and Button */}
              <div className="flex flex-col items-center text-center justify-center max-w-lg mx-auto pointer-events-auto">
                <div className="mb-8">
                  <svg className="w-16 h-16 text-[#C29355]/50 animate-pulse" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M50 85 C50 60, 52 40, 50 15" />
                    <path d="M50 65 C62 60, 65 40, 52 35" strokeWidth="1.2" />
                    <path d="M50 50 C38 45, 35 25, 48 20" strokeWidth="1.2" />
                  </svg>
                </div>



                {/* Enter Button */}
                <button
                  id="enter-btn"
                  onClick={handleEnter}
                  className="px-10 py-5 bg-[#FDFAF6] text-[#0B2415] hover:bg-[#C29355] hover:text-[#FDFAF6] text-xs font-serif tracking-[0.3em] font-medium transition-all duration-500 rounded-none shadow-[0_12px_32px_rgba(11,36,21,0.25)] flex items-center space-x-3 pointer-events-auto cursor-pointer border border-[#C29355]/10"
                >
                  <span>推門進入</span>
                  <ArrowRight size={13} className="text-[#C29355]" />
                </button>
              </div>
            </motion.div>

            {/* Background ambient lighting blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#C29355]/5 filter blur-[150px] pointer-events-none" />
          </div>
        )}
      </AnimatePresence>

      {/* STAGE 2: MAIN SITE */}
      {entered && (
        <div className="w-full flex flex-col justify-between">
          
          {/* Minimal Header */}
          <header className="w-full sticky top-0 bg-[#FDFAF6]/90 backdrop-blur-md z-30 border-b border-gray-100 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between md:justify-center items-center relative">
              
              {/* Desktop Centered Menu Links */}
              <nav className="hidden md:flex items-center space-x-2 relative z-10">
                {[
                  { id: 'home', label: '琥珀小屋', enLabel: 'HOME', icon: Compass },
                  { id: 'services', label: '菜單與雅事', enLabel: 'TEA & CAFE', icon: Coffee },
                  { id: 'staff', label: '屋簷下的人們', enLabel: 'ATELIER STAFF', icon: Feather },
                  { id: 'qa', label: '旅人疑問', enLabel: 'JOURNAL & FAQ', icon: HelpCircle }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  const isHovered = hoveredTab === tab.id;
                  const isTarget = hoveredTab ? (hoveredTab === tab.id) : isActive;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      onMouseEnter={() => setHoveredTab(tab.id as any)}
                      onMouseLeave={() => setHoveredTab(null)}
                      className="relative px-6 py-3 font-serif transition-colors duration-300 flex flex-col items-center justify-center cursor-pointer select-none rounded-none overflow-hidden"
                      id={`nav-${tab.id}`}
                    >
                      {/* Sliding background color block */}
                      {isTarget && (
                        <motion.span
                          layoutId="headerActiveIndicator"
                          className="absolute inset-0 bg-[#0B2415] z-0"
                          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                        />
                      )}

                      <div className="relative z-10 flex flex-col items-center justify-center text-center">
                        <div className="flex items-center space-x-2">
                          <Icon 
                            size={16} 
                            className={`transition-colors duration-300 ${
                              isTarget ? 'text-[#C29355]' : 'text-gray-400'
                            }`}
                          />
                          <span className={`text-sm md:text-xl font-bold tracking-[0.15em] transition-colors duration-300 ${
                            isTarget ? 'text-[#FDFAF6]' : 'text-gray-800'
                          }`}>
                            {tab.label}
                          </span>
                        </div>
                        {/* English subtitle */}
                        <span className={`text-[9px] md:text-xs font-mono tracking-widest mt-1.5 transition-colors duration-300 ${
                          isTarget ? 'text-[#C29355]/90' : 'text-gray-400'
                        }`}>
                          {tab.enLabel}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </nav>

              {/* Utility elements & Mobile launcher */}
              <div className="md:absolute md:right-12 flex items-center space-x-4">
                <span className="hidden lg:inline-flex px-3 py-1 bg-emerald-950/5 text-emerald-900 font-mono text-[10px] tracking-widest rounded-none uppercase items-center space-x-1 border border-emerald-900/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse mr-1" />
                  <span>TC - Garuda</span>
                </span>
                
                {/* Mobile Menu Icon */}
                <button
                  id="mobile-menu-btn"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-1 text-gray-500 hover:text-gray-900 md:hidden transition-colors"
                  aria-label={mobileMenuOpen ? "關閉選單" : "開啟選單"}
                >
                  {mobileMenuOpen ? <X size={22} /> : <MenuIcon size={22} />}
                </button>
              </div>

            </div>

            {/* Mobile Drawer Navigation Panel */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  id="mobile-drawer"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="md:hidden w-full bg-[#FDFAF6] border-t border-gray-100 overflow-hidden"
                >
                  <div className="px-6 py-6 flex flex-col space-y-5">
                    {[
                      { id: 'home', label: '琥珀小屋 (Home)', icon: Compass },
                      { id: 'services', label: '菜單與雅事 (Services)', icon: Coffee },
                      { id: 'staff', label: '屋簷下的人們 (Staff)', icon: Feather },
                      { id: 'qa', label: '旅人疑問 (FAQ)', icon: HelpCircle }
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveTab(tab.id as any);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full py-2 font-serif text-left text-sm tracking-[0.25em] flex items-center space-x-3 ${
                            isActive ? 'text-[#C29355] font-bold' : 'text-gray-500'
                          }`}
                          id={`mob-nav-${tab.id}`}
                        >
                          <Icon size={16} />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] font-mono tracking-wider text-gray-400">
                      <span>TC / Garuda Server RP Shop</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">OPEN</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </header>

          {/* PAGE ROUTING ENVELOPE */}
          <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-8 md:py-16">
            <AnimatePresence mode="wait">
              {activeTab === 'home' && (
                <motion.div
                  key="home-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
                  className="space-y-24"
                >
                  
                  {/* Part 0: 日系雜誌封面式首頁大標 (Japanese Magazine Cover Hero) */}
                  <section id="magazine-cover-hero" className="relative bg-[#FDFAF6] py-12 md:py-24 border-b border-gray-100/60 overflow-hidden">
                    <div className="max-w-6xl mx-auto px-6 md:px-12 relative">
                      
                      {/* Massive Headline Group */}
                      <div className="relative mb-16 select-none pointer-events-none">
                        {/* Chinese Main Heading - Beautiful and massive (200px equivalent on large screens) */}
                        <h1 
                          className="font-tegomin text-gray-950 tracking-[0.05em] leading-none whitespace-nowrap break-keep select-none opacity-95 transition-all duration-300 block"
                          style={{ fontSize: 'clamp(50px, 15vw, 200px)' }}
                        >
                          琥珀與花影
                        </h1>
                        
                        {/* English Sub/Main Heading - Elegant, classy custom handwriting font placed directly underneath */}
                        <h2 
                          className="font-meddon text-[#C29355] tracking-[0.05em] leading-[1.3] mt-8 whitespace-nowrap text-center opacity-80 block w-full"
                          style={{ fontSize: 'clamp(20px, 4vw, 52px)' }}
                        >
                          Amber & Petal Shadows
                        </h2>
                      </div>

                      {/* Content Row: Just the elegant centered NEWS block */}
                      <div className="w-full mt-8">
                        <div className="p-6 md:p-8 bg-[#FDFAF6] border border-gray-200/50 relative shadow-[0_8px_24px_rgba(11,36,21,0.01)] w-full flex flex-col justify-between">
                          {/* Decorative lines like in Plan.Do.See */}
                          <div className="absolute top-2 left-2 right-2 bottom-2 border border-gray-200/25 pointer-events-none" />
                          
                          <div className="relative z-10">
                            <span className="font-serif text-[10px] tracking-[0.25em] text-gray-400 font-bold block uppercase mb-4">
                              NEWS 誌上公告
                            </span>
                            
                            <div className="flex flex-col gap-4 text-[16px] font-serif leading-relaxed">
                              <div className="flex items-start gap-4">
                                <span className="text-gray-400 font-mono text-[16px] tracking-wider shrink-0 min-w-[100px] pt-0.5">
                                  2026.06.11
                                </span>
                                <span className="text-gray-600 font-kesong text-[16px] leading-relaxed block">
                                  【建置中】請稍後－－「琥珀與花影」即將與您見面！
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                  
                  {/* Part 1: 序章絮語 (No Image, centered giant serif text display) */}
                  <section id="prologue-section" className="py-12 md:py-24 text-center max-w-3xl mx-auto flex flex-col items-center">
                    <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#C29355] mb-6">
                      CH . 01 PROLOGUE ・ 序章絮語
                    </span>
                    <h2 className="font-serif text-lg md:text-xl text-gray-900 leading-relaxed md:leading-loose text-center font-normal px-4 max-w-3xl mx-auto whitespace-pre-line">
                      傳聞在格里達尼亞的密林深處，有一座隱密而溫馨的小屋。這裡不只提供特製的飲品與甜點，更默默收集著來自艾歐澤亞各地的神秘圖卷。{"\n"}{"\n"}
                      在這裡，微風撥動葉片的沙沙聲，彷彿在為駐足的旅人訴說未完的故事。我們深信，每一份創作都是落入泥土的種子；在格里達尼亞的綠意與祝福下，我們期盼用這個空間悉心灌溉，靜待每一雙創作者的手播下夢想，最終盛開出屬於自己的「藝術之花」。
                    </h2>
                    <BotanicalDivider />
                  </section>


                  {/* Part 2: 小屋的故事 (Asymmetric Grid) */}
                  <section id="cabin-story-section" className="grid grid-cols-12 gap-8 lg:gap-16 items-center">
                    
                    {/* Left: Big photo (Col Span 8) */}
                    <div className="col-span-12 lg:col-span-8 group relative overflow-hidden bg-gray-100">
                      <div className="absolute top-0 left-0 bg-[#0B2415] text-[#FDFAF6] font-serif text-xs tracking-widest px-6 py-3 z-10">
                        CH . 02 遺落林間的小屋
                      </div>
                      <div className="overflow-hidden aspect-[16/10]">
                        <img 
                          src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=1200" 
                          alt="琥珀與花影外觀" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 duration-700 ease-out"
                        />
                      </div>
                      {/* Subtle image description */}
                      <div className="mt-3 flex justify-between items-center text-[11px] text-gray-400 font-mono tracking-widest uppercase">
                        <span>[ GRIDANIAN WOODEN ARCHITECTURE ]</span>
                        <span>02 / 04</span>
                      </div>
                    </div>

                    {/* Right: Narrow editorial paragraph (Col Span 4) */}
                    <div className="col-span-12 lg:col-span-4 flex flex-col justify-center space-y-6 lg:pl-4">
                      <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#C29355] select-none">
                        CH . 02 遺落林間的小屋
                      </span>
                      <h3 className="font-serif text-2xl text-gray-900 tracking-wider font-semibold">
                        遺落林間的草藥工坊
                      </h3>
                      <p className="text-gray-600 text-sm leading-8 text-justify font-light">
                        「琥珀與花影」位於黑衣森林那片終年霧氣盤繞的中央林區。
                        這棟建築原本屬於一位退隱的幻術皇部下，我們接手時，
                        整間小屋幾乎都被攀爬的常春藤、乾燥蘭草以及厚實的青苔淹沒。
                        我們整理了殘留的木架、風乾藥草，並在一側建立起剔透的天窗溫室。
                      </p>
                      <p className="text-gray-600 text-sm leading-8 text-justify font-light">
                        這裡不屬於喧囂的劍與魔法政治，只有老舊的羊皮筆記、
                        黃銅天平，以及每一位在此飲茶落腳旅人的呼吸與耳語。
                      </p>
                      
                      <div className="pt-4">
                        <button
                          onClick={() => setActiveTab('services')}
                          className="inline-flex items-center space-x-2 font-serif text-xs text-[#C29355] hover:text-gray-900 tracking-widest transition-colors group"
                        >
                          <span>探索小屋雅選與編年</span>
                          <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>

                  </section>


                  {/* Part 3: 窗景一隅 (Horizontal Scrolling of borderless interior photography) */}
                  <section id="window-view-section" className="space-y-8 select-none">
                    
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between pb-4 border-b border-gray-100">
                      <div>
                        <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#C29355]">
                          CH . 03 THE WINDOW VIEWS
                        </span>
                        <h3 className="font-serif text-2xl text-gray-900 tracking-wider mt-1 font-semibold">
                          窗景一隅・小屋特寫
                        </h3>
                      </div>
                      
                      <div className="flex items-center space-x-6 mt-4 md:mt-0 select-none">
                        <p className="text-gray-400 font-mono text-[11px] tracking-widest uppercase hidden sm:block">
                          [ drag horizontally or use arrows / 左右拖移或點擊箭頭 ]
                        </p>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={scrollPrevWindow}
                            className="p-2 border border-gray-200 text-gray-500 hover:text-gray-950 hover:border-gray-950 hover:bg-gray-50 transition-all duration-300 rounded-none cursor-pointer"
                            aria-label="Previous view"
                          >
                            <ChevronLeft size={16} />
                          </button>
                          <button 
                            onClick={scrollNextWindow}
                            className="p-2 border border-gray-200 text-gray-500 hover:text-gray-950 hover:border-gray-950 hover:bg-gray-50 transition-all duration-300 rounded-none cursor-pointer"
                            aria-label="Next view"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Drag Container */}
                    <div 
                      ref={windowScrollRef}
                      onMouseDown={handleWindowMouseDown}
                      onMouseLeave={handleWindowMouseLeave}
                      onMouseUp={handleWindowMouseUp}
                      onMouseMove={handleWindowMouseMove}
                      className="overflow-x-auto no-scrollbar flex space-x-10 pb-6 -mx-6 px-6 snap-x snap-mandatory cursor-grab active:cursor-grabbing select-none scroll-smooth"
                    >
                      {WINDOW_IMAGES.map((img, i) => (
                        <div 
                          key={i}
                          onClick={() => setActiveWindowImage(i)}
                          className="min-w-[280px] sm:min-w-[400px] max-w-[450px] snap-center flex-shrink-0 cursor-pointer text-left focus:outline-none select-none"
                        >
                          <div className={`overflow-hidden aspect-[4/3] bg-gray-50 transition-all duration-500 mb-4 ${
                            activeWindowImage === i ? 'ring-1 ring-[#C29355]/30 shadow-md' : 'opacity-85 hover:opacity-100 shadow-none'
                          }`}>
                            <img 
                              src={img.url} 
                              alt={img.title} 
                              referrerPolicy="no-referrer"
                              draggable="false"
                              className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-700 pointer-events-none select-none"
                            />
                          </div>
                          
                          <div className="px-1 flex justify-between items-start select-none">
                            <div>
                              <h4 className="font-serif text-sm text-gray-900 tracking-wide font-medium">
                                {img.title}
                              </h4>
                              <p className="text-gray-500 text-[11px] mt-1 line-clamp-2 max-w-sm leading-relaxed font-light">
                                {img.desc}
                              </p>
                            </div>
                            <span className="font-mono text-[11px] text-[#C29355]/60 pr-2">
                              {`0${i + 1}`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                  </section>


                  {/* Part 4: 我們的灌溉之道 (Two-column layout prose with SVG botanical dividing decorations) */}
                  <section id="irrigation-section" className="bg-[#FDFAF6] border-t border-b border-[#C29355]/10 py-16 md:py-24">
                    <div className="max-w-4xl mx-auto text-center space-y-12">
                      <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#C29355]">
                        CH . 04 OUR IRRIGATION APPROACH
                      </span>
                      
                      <h3 className="font-serif text-3xl text-gray-900 tracking-widest font-normal">
                        我們的灌溉之道
                      </h3>

                      <LeafBranch />

                      {/* Asymmetric Two Column Text Layout */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 text-left text-gray-600 text-sm leading-8 font-light">
                        <div className="space-y-6">
                          <h4 className="font-serif text-gray-800 text-base font-semibold tracking-wider pb-2 border-b border-gray-100">
                            🌱 社群引流與原創扶持
                          </h4>
                          <p className="text-justify">
                            善用 FF14 社群的互動性，以同人創作帶動曝光，進而反哺創作者的原創作品，協助提升原創作品的能見度。
                          </p>
                        </div>
                        
                        <div className="space-y-6">
                          <h4 className="font-serif text-gray-800 text-base font-semibold tracking-wider pb-2 border-b border-gray-100">
                            🪑 角色放置與交流空間
                          </h4>
                          <p className="text-justify">
                            建立一個兼具「角色掛網放置」與「創作者交流」的友善空間，提供社群夥伴能夠舒適聚會、安放靈感的棲所。
                          </p>
                        </div>
                      </div>

                      <LeafBranch />

                      <p className="font-serif italic text-xs text-gray-400 tracking-wider">
                        "In her silent garden, we gather every petal, preserved inside the amber."
                      </p>
                    </div>
                  </section>

                </motion.div>
              )}

              {activeTab === 'services' && (
                <motion.div
                  key="services-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
                  className="space-y-24"
                >
                  
                  {/* Part 1: 今日菜單 (Frameless front-end style item pricing menu, no borders) */}
                  <section id="menu-section" className="space-y-16">
                    <div className="text-center space-y-4 max-w-lg mx-auto">
                      <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#C29355]">
                        TODAY'S SELECTION
                      </span>
                      <h2 className="font-serif text-3xl text-gray-900 tracking-widest font-normal">
                        雅選與今日茶譜
                      </h2>
                      <p className="text-gray-500 text-xs tracking-wider leading-relaxed font-light">
                        小屋精選黑衣森林山泉，配合各地風乾草藥沏成。無任何繁複裝飾邊框，純粹依靠天然溫度與草本香氣傳達林間靈性。
                      </p>
                    </div>

                    {/* Filter buttons - pure typography elegance */}
                    <div className="flex flex-wrap justify-center gap-6 md:gap-12 pb-4 border-b border-gray-100 max-w-2xl mx-auto">
                      {[
                        { id: 'all', label: '全部茶點 (All)' },
                        { id: 'tea', label: '天然花草茶 (Infused Tea)' },
                        { id: 'confection', label: '花影和菓子 (Confections)' },
                        { id: 'elixir', label: '解憂藥劑 (Elixirs)' }
                      ].map((filter) => (
                        <button
                          key={filter.id}
                          onClick={() => setMenuFilter(filter.id as any)}
                          className={`font-serif text-xs md:text-sm tracking-widest transition-all cursor-pointer ${
                            menuFilter === filter.id 
                              ? 'text-[#C29355] font-bold underline underline-offset-8 decoration-1' 
                              : 'text-gray-400 hover:text-gray-800'
                          }`}
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>

                    {/* Menu grid: Frameless, only typography sizing & negative spacing, no columns dividers */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 max-w-5xl mx-auto">
                      {MENU_ITEMS.filter(item => menuFilter === 'all' || item.category === menuFilter).map((item) => (
                        <div 
                          key={item.id} 
                          className="flex flex-col space-y-2 hover:bg-gray-50/40 p-4 transition-all duration-300"
                        >
                          <div className="flex justify-between items-baseline">
                            <div className="flex flex-col">
                              <h3 className="font-serif text-base text-gray-900 font-medium tracking-wide">
                                {item.name}
                              </h3>
                              <span className="font-serif italic text-[11px] text-gray-400">
                                {item.englishName}
                              </span>
                            </div>
                            <span className="font-mono text-xs text-[#C29355] font-medium tracking-widest">
                              {item.price}
                            </span>
                          </div>
                          
                          <p className="text-gray-500 text-[12px] leading-relaxed pt-1 font-light text-justify">
                            {item.desc}
                          </p>
                          
                          <div className="flex items-center space-x-1.5 pt-1">
                            <span className="w-1 h-1 rounded-full bg-emerald-900/40" />
                            <span className="font-mono text-[9px] text-emerald-900/60 uppercase tracking-widest">
                              {item.category === 'tea' ? 'Botanical Infusion' : item.category === 'confection' ? 'Artisanal Confection' : 'Apothecary Soda'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>


                  {/* Part 2: 小屋紀事 (Minimalist Vertical Timeline of chronicles) */}
                  <section id="chronology-section" className="py-12 bg-[#FDFAF6] max-w-4xl mx-auto">
                    
                    <div className="text-center mb-16 space-y-4">
                      <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#C29355]">
                        CHRONOLOGY
                      </span>
                      <h2 className="font-serif text-2xl text-gray-900 tracking-widest font-normal">
                        小屋紀事 ・ 歲月年輪
                      </h2>
                    </div>

                    {/* Timeline Line */}
                    <div className="relative pl-6 md:pl-0 border-l border-gray-100 md:border-l-0 md:before:absolute md:before:left-1/2 md:before:top-0 md:before:bottom-0 md:before:w-[1px] md:before:bg-gray-200">
                      
                      {CHRONICLE_ITEMS.map((chr, index) => {
                        const isEven = index % 2 === 0;
                        return (
                          <div 
                            key={chr.id} 
                            className={`relative md:mb-16 mb-12 flex flex-col md:flex-row items-start ${
                              isEven ? 'md:flex-row-reverse' : ''
                            }`}
                          >
                            {/* Dot indicator on Timeline */}
                            <div className="absolute left-[-29px] top-1 md:left-1/2 md:translate-x-[-3.5px] w-[8px] h-[8px] rounded-full bg-[#C29355] ring-4 ring-[#FDFAF6]" />

                            {/* Column box */}
                            <div className={`w-full md:w-[45%] ${
                              isEven ? 'md:pl-10 text-left' : 'md:pr-10 md:text-right'
                            }`}>
                              
                              <span className="font-mono text-xs text-[#C29355] font-semibold tracking-widest block uppercase">
                                {chr.chapter} — {chr.date}
                              </span>
                              
                              <h3 className="font-serif text-lg text-gray-900 font-medium tracking-wide mt-2">
                                {chr.title}
                              </h3>
                              
                              <p className={`text-gray-500 text-xs leading-relaxed mt-3 font-light text-justify max-w-md ${
                                isEven ? 'mr-auto' : 'md:ml-auto ml-0'
                              }`}>
                                {chr.desc}
                              </p>
                              
                            </div>

                            {/* Spacing alignment helper */}
                            <div className="hidden md:block w-[10%]" />
                            <div className="hidden md:block w-[45%]" />
                          </div>
                        );
                      })}

                    </div>
                  </section>


                  {/* Part 3: 琥珀切片與眾人花影 (Polaroid Masonry block) */}
                  <section id="gallery-section" className="space-y-12">
                    
                    <div className="text-center space-y-4 max-w-md mx-auto">
                      <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#C29355]">
                        MEMORIES IN AMBER
                      </span>
                      <h2 className="font-serif text-2xl text-gray-900 tracking-widest font-normal">
                        琥珀切片與眾人花影
                      </h2>
                      <p className="text-gray-500 text-xs tracking-wider font-light">
                        旅人在此留下的點滴光影。帶有優雅手寫感的拍立得風格與寬幅無邊框照片交錯。
                      </p>
                    </div>

                    {/* Masonry layout container */}
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8 max-w-6xl mx-auto py-8">
                      {PETAL_PHOTOS.map((photo, index) => {
                        const isPolaroid = photo.type === 'polaroid';
                        return (
                          <motion.div
                            key={index}
                            onClick={() => setSelectedPhoto(photo)}
                            whileHover={{ y: -6, scale: 1.02 }}
                            transition={{ duration: 0.4 }}
                            className={`break-inside-avoid cursor-pointer overflow-hidden relative group inline-block w-full text-left bg-white ${
                              isPolaroid 
                                ? 'p-4 pb-8 border border-gray-100 rounded-none shadow-sm rotate-[-1deg] hover:rotate-0 hover:shadow-md hover:z-20' 
                                : 'rounded-none hover:shadow-lg'
                            }`}
                          >
                            {/* Image wrapper */}
                            <div className={`overflow-hidden bg-gray-50 aspect-auto ${isPolaroid ? 'mb-4 border border-gray-50' : 'aspect-[3/2]'}`}>
                              <img 
                                src={photo.url} 
                                alt={photo.caption} 
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover group-hover:scale-105 duration-700 ease-out"
                              />
                            </div>

                            {/* Caption formatting */}
                            {isPolaroid ? (
                              <p className="text-gray-500 font-serif text-[12px] italic tracking-wide text-center pt-2 leading-relaxed font-normal">
                                {photo.caption}
                              </p>
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-6">
                                <p className="text-white font-serif text-sm tracking-widest">
                                  {photo.caption}
                                </p>
                                <span className="text-white/50 text-[10px] font-mono tracking-widest uppercase mt-1">
                                  [ EXQUISITE FULL SCREEN VIEWS ]
                                </span>
                              </div>
                            )}

                            {/* Magnifier indicator on hover */}
                            <div className="absolute top-4 right-4 bg-white/90 p-1.5 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 pointer-events-none text-emerald-950">
                              <Maximize2 size={12} />
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                  </section>

                </motion.div>
              )}

              {activeTab === 'staff' && (
                <motion.div
                  key="staff-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
                  className="space-y-16"
                >
                  
                  {/* Part 1: Page Header */}
                  <div className="text-center space-y-4 max-w-lg mx-auto">
                    <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#C29355]">
                      MEET THE CARETAKERS
                    </span>
                    <h2 className="font-serif text-3xl text-gray-900 tracking-widest font-normal">
                      屋簷下的人們
                    </h2>
                    <p className="text-gray-500 text-xs tracking-wider leading-relaxed font-light">
                      這座花園溫室與草藥茶店，由這群甘願離群索居的創作者共同澆灌。
                    </p>
                  </div>

                  {/* High elegance switch tabs - 'Scribes' vs 'Lantern Bearers' */}
                  <div className="flex justify-center max-w-md mx-auto relative border-b border-gray-100 pb-2">
                    <button
                      onClick={() => setStaffRole('scribe')}
                      className={`w-1/2 py-3 text-center font-serif text-sm tracking-widest transition-all relative z-10 cursor-pointer ${
                        staffRole === 'scribe' ? 'text-gray-900 font-bold' : 'text-gray-400 hover:text-gray-700'
                      }`}
                    >
                      執筆者 (The Scribes)
                      {staffRole === 'scribe' && (
                        <motion.span 
                          layoutId="activeStaffRoleUnderline"
                          className="absolute bottom-[-9px] left-0 right-0 h-[2px] bg-[#C29355]" 
                        />
                      )}
                    </button>
                    <button
                      onClick={() => setStaffRole('lantern')}
                      className={`w-1/2 py-3 text-center font-serif text-sm tracking-widest transition-all relative z-10 cursor-pointer ${
                        staffRole === 'lantern' ? 'text-gray-900 font-bold' : 'text-gray-400 hover:text-gray-700'
                      }`}
                    >
                      掌燈人 (The Lantern Bearers)
                      {staffRole === 'lantern' && (
                        <motion.span 
                          layoutId="activeStaffRoleUnderline"
                          className="absolute bottom-[-9px] left-0 right-0 h-[2px] bg-[#C29355]" 
                        />
                      )}
                    </button>
                  </div>

                  {/* Part 2: Editorial Magazine-style profile presentation */}
                  <div className="max-w-5xl mx-auto py-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={staffRole}
                        initial={{ opacity: 0, x: staffRole === 'scribe' ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: staffRole === 'scribe' ? 20 : -20 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-24"
                      >
                        {STAFF_PROFILES.filter(prof => prof.role === staffRole).map((profile) => (
                          <div 
                            key={profile.id} 
                            className="grid grid-cols-12 gap-8 lg:gap-16 items-start py-8 border-b border-gray-100/55 last:border-b-0"
                          >
                            
                            {/* Left Side Column: High-contrast portrait + Metadata (Grid columns 5) */}
                            <div className="col-span-12 lg:col-span-5 flex flex-col space-y-6">
                              <div className="relative overflow-hidden bg-gray-50 aspect-[3/4] outline outline-1 outline-gray-200 outline-offset-8">
                                <img 
                                  src={profile.avatarUrl} 
                                  alt={profile.name} 
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover scale-[1.01] hover:scale-103 transition-transform duration-700 filter saturate-90"
                                />
                                <div className="absolute bottom-4 left-4 bg-emerald-950 text-[#FDFAF6] text-[10px] font-mono tracking-widest px-4 py-1.5 uppercase">
                                  {profile.role === 'scribe' ? 'Scribe Division' : 'Watcher Division'}
                                </div>
                              </div>

                              {/* Character Metadata Block */}
                              <div className="space-y-3 pt-6 border-t border-gray-100">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-mono text-gray-400 uppercase tracking-widest">Job/Aetherial Art</span>
                                  <span className="font-serif text-gray-800 font-semibold">{profile.title}</span>
                                </div>
                                
                                {profile.astrologySign && (
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="font-mono text-gray-400 uppercase tracking-widest">Astrological Sign</span>
                                    <span className="font-serif text-gray-800">{profile.astrologySign}</span>
                                  </div>
                                )}

                                <div className="space-y-2">
                                  <span className="font-mono text-xs text-gray-400 uppercase tracking-widest block">Specialties / 領域專長</span>
                                  <div className="flex flex-wrap gap-2 pt-1">
                                    {profile.specialty.map((spec, sIdx) => (
                                      <span 
                                        key={sIdx}
                                        className="px-2.5 py-1 bg-gray-100 text-gray-700 font-serif text-[11px] tracking-wide rounded-none border border-gray-200"
                                      >
                                        🌿 {spec}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Right Side Column: Large Quotes & Interview details (Grid columns 7) */}
                            <div className="col-span-12 lg:col-span-7 space-y-6 flex flex-col justify-between">
                              
                              <div className="space-y-4">
                                <span className="font-serif text-lg text-gray-400 italic">Biography Spotlight</span>
                                <h3 className="font-serif text-3xl font-bold tracking-widest text-gray-900">
                                  {profile.name}
                                </h3>
                                <p className="font-serif text-xs tracking-wider text-[#C29355] font-semibold uppercase leading-none">
                                  {profile.englishName}
                                </p>
                              </div>

                              {/* Massive highlight quote block */}
                              <blockquote className="border-l-2 border-[#C29355] pl-6 py-2 my-4">
                                <p className="font-serif text-lg md:text-xl text-gray-800 italic leading-relaxed font-light text-justify">
                                  {profile.quote}
                                </p>
                              </blockquote>

                              {/* Detailed narrative paragraph (Renders standard non-tech editorial article style) */}
                              <div className="space-y-6 pt-2">
                                <h4 className="font-serif text-sm font-semibold text-gray-900 tracking-wider">
                                  [ 溫室草本記事與研究訪談 ]
                                </h4>
                                <p className="text-gray-600 text-sm leading-8 text-justify font-light">
                                  {profile.bio}
                                </p>
                                <p className="text-gray-500 text-xs italic leading-relaxed pt-2 font-light">
                                  「他在溫室的暖陽折射下安靜執筆。在琥珀小屋，他希望自己不只是一個侍茶者，更是一個甘願在黑衣森林的落葉裡聽松濤的觀察官。如果有著相同的頻率，他樂意在壁爐側為你翻開久未出版的冒險圖集。」
                                </p>
                              </div>

                              {/* Quick interaction button */}
                              <div className="pt-6">
                                <button
                                  onClick={() => setActiveTab('qa')}
                                  className="inline-flex items-center space-x-2 text-xs font-serif text-gray-900 border-b border-gray-900/40 hover:border-gray-900 pb-1 cursor-pointer tracking-wider"
                                >
                                  <span>查詢營業時間與地址，與他造訪對話</span>
                                  <ChevronRight size={13} />
                                </button>
                              </div>

                            </div>

                          </div>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                </motion.div>
              )}

              {activeTab === 'qa' && (
                <motion.div
                  key="qa-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
                  className="space-y-16 max-w-3xl mx-auto"
                >
                  
                  {/* Page Header */}
                  <div className="text-center space-y-4">
                    <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#C29355]">
                      TRAVELLER INQUISITION
                    </span>
                    <h2 className="font-serif text-3xl text-gray-900 tracking-widest font-normal">
                      旅人疑問 ・ 小屋指引
                    </h2>
                    <p className="text-gray-500 text-xs tracking-wider leading-relaxed font-light">
                      我們為首次造訪黑衣森林「琥珀與花影」溫室的旅人整理了以下常規指南。
                    </p>
                  </div>

                  {/* Real-time server card */}
                  <div className="bg-[#0B2415] text-[#FDFAF6] p-6 rounded-none relative overflow-hidden my-8">
                    <div className="absolute top-0 right-0 bg-[#C29355]/20 text-[#C29355] text-[10px] uppercase font-mono tracking-widest px-4 py-1">
                      Server Address
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 z-10 relative">
                      <div className="space-y-1">
                        <span className="text-[10px] text-[#C29355] font-mono tracking-widest uppercase block">[ FFXIV TC Location ]</span>
                        <h3 className="font-serif text-lg font-bold tracking-wide">
                          TC 數據中心 / Garuda（迦樓羅）伺服器
                        </h3>
                        <p className="text-[#FDFAF6]/60 text-xs font-light">
                          黑衣森林 薰衣草苗圃 (Lavender Beds) 第 28 區 46 號
                        </p>
                      </div>

                      <div className="flex flex-col text-left md:text-right font-mono text-[11px] text-[#FDFAF6]/40 tracking-wider space-y-1.5 border-t border-[#FDFAF6]/10 pt-3 md:border-t-0 md:pt-0">
                        <span className="flex items-center space-x-1 justify-start md:justify-end">
                          <MapPin size={11} className="text-[#C29355]" />
                          <span>別墅級溫室 (Emblem Estate Garden Hub)</span>
                        </span>
                        <span className="flex items-center space-x-1 justify-start md:justify-end">
                          <Clock size={11} className="text-[#C29355]" />
                          <span>每週五 / 週六 21:00 ~ 23:00 (現實時間)</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Accordion Questions container */}
                  <div className="space-y-4 pt-4">
                    {FAQS.map((faq) => {
                      const isOpen = openFaq === faq.id;
                      return (
                        <div 
                          key={faq.id}
                          className="border-b border-gray-100 pb-4 transition-all duration-300"
                        >
                          <button
                            onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                            className="w-full py-4 flex justify-between items-center text-left focus:outline-none group cursor-pointer"
                            aria-expanded={isOpen}
                            id={`faq-btn-${faq.id}`}
                          >
                            <span className="font-serif text-sm md:text-base font-semibold tracking-wide text-gray-800 group-hover:text-[#C29355] transition-colors pr-4">
                              Q: {faq.question}
                            </span>
                            <motion.span
                              animate={{ rotate: isOpen ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                              className="text-gray-400 group-hover:text-[#C29355] flex-shrink-0"
                            >
                              <ChevronDown size={18} />
                            </motion.span>
                          </button>

                          {/* Accordion body using framer motion */}
                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="overflow-hidden"
                              >
                                <div className="pb-4 font-sans text-xs md:text-sm leading-8 text-gray-500 font-light text-justify whitespace-pre-wrap pl-4 border-l border-[#C29355]/40 mt-1">
                                  {faq.answer}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>

                  <BotanicalDivider />

                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Core Footer Element */}
          <footer className="w-full bg-[#FDFAF6] border-t border-gray-100 py-16 mt-24">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
              
              {/* Box 1: Left Brand info */}
              <div className="space-y-4">
                <span className="font-serif text-xs tracking-widest text-[#C29355] font-semibold uppercase">[ 屋脊銘牌 ]</span>
                <h4 className="font-tegomin text-lg text-gray-900 tracking-widest leading-none mt-2">
                  琥珀與花影
                </h4>
                <p className="font-serif text-[10px] tracking-widest text-gray-400 uppercase">
                  Amber & Petal Shadows
                </p>
                <p className="text-gray-500 text-xs leading-relaxed max-w-xs font-light">
                  我們以調和花影與露水的暖茶，在時光聚合的溫柔微光中，守護您落入琥珀的夢境。
                </p>
              </div>

              {/* Box 2: Middle Address details */}
              <div className="space-y-4">
                <span className="font-serif text-xs tracking-widest text-[#C29355] font-semibold uppercase">[ 交通與宿地 ]</span>
                <div className="pt-2 space-y-2 text-xs text-gray-500 leading-relaxed font-light">
                  <p className="font-semibold text-gray-800">TC / Garuda Server</p>
                  <p>Lavender Beds — 第 28 區 46 號（薰衣草苗圃）</p>
                  <p>主要開放時段：每週五與週六 21:00 ~ 23:00</p>
                  <p className="text-[11px] text-gray-400 italic">※ 非開放日歡迎進行無聲探訪拍照</p>
                </div>
              </div>

              {/* Box 3: Social & disclaimer disclaimer */}
              <div className="space-y-4">
                <span className="font-serif text-xs tracking-widest text-[#C29355] font-semibold uppercase">[ 免責聲明 ]</span>
                <div className="text-xs text-gray-500 leading-relaxed space-y-2 font-light">
                  <p>
                    本空間為 FINAL FANTASY XIV 的同人非官方角色扮演與創作社群網站。所有故事背景、世界觀與虛擬歷史設定皆基於遊戲內之地方風土人文進行二次創作，與官方機關、真實團體、人物或現實事件無涉。
                  </p>
                  <p>
                    本站所引用或提及之遊戲原始素材、名詞與美術設定，其智慧財產權與商標等權利均係原開發商及 SQUARE ENIX 所有。本空間不涉及任何商業盈利行為，僅供同好社群交流、角色扮演與創作分享之用。
                  </p>
                  <p className="text-[10px] text-gray-400 pt-1">
                    © 2010 - 2026 SQUARE ENIX CO., LTD. All Rights Reserved.
                  </p>
                </div>
              </div>

            </div>

            {/* Absolute bottom minimal copyright */}
            <div className="max-w-7xl mx-auto px-6 pt-12 mt-12 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono tracking-widest text-gray-400">
              <span>DESIGNED FOR COLLECTIVE HEARTS AND EMBLAZONED PETALS.</span>
              <span className="mt-2 sm:mt-0 uppercase">MADE WITH CRAFT IN CLOUD WORKSPACE</span>
            </div>
          </footer>

        </div>
      )}

      {/* LIGHTBOX MODAL FOR POLAROID PHOTOS OR MAP DETAILS */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 bg-[#0B2415]/95 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-8 cursor-zoom-out"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl w-full bg-[#FDFAF6] p-4 pb-8 md:p-8 md:pb-12 shadow-2xl relative select-none"
            >
              <button 
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors p-1"
                aria-label="Close Lightbox"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col space-y-6">
                
                {/* Large responsive graphic view */}
                <div className="overflow-hidden max-h-[70vh] bg-gray-50">
                  <img 
                    src={selectedPhoto.url} 
                    alt={selectedPhoto.caption} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain mx-auto"
                  />
                </div>

                {/* Subtitle description metadata */}
                <div className="text-center space-y-2 px-4">
                  <span className="font-mono text-[9px] text-[#C29355] tracking-widest uppercase block">
                    [ GALLERY SLICE INDICES ]
                  </span>
                  <p className="font-serif text-base text-gray-900 tracking-wider leading-relaxed font-semibold">
                    {selectedPhoto.caption}
                  </p>
                  <p className="text-gray-400 font-sans text-xs font-light max-w-xl mx-auto">
                    「黑衣森林的風乾植物與茶藝，將在每一次快門中得以凝固有機的靈光。隨身標註 #琥珀與花影 與我們在漫長奇幻中分享。」
                  </p>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
