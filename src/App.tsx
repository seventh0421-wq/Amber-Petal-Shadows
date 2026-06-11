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
  Maximize2,
  Sprout,
  Users,
  CakeSlice,
  Cookie,
  Dumbbell,
  Moon,
  Snowflake,
  Utensils
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

import { ArtistProfileCard, DEMO_ARTISTS } from './components/ArtistProfileCard';
import { StaffProfileSwitcher, ArtistProfile as SwitchedArtistProfile } from './components/StaffProfileSwitcher';
import { WaiterProfileSwitcher } from './components/WaiterProfileSwitcher';

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

const getMenuItemIcon = (iconName?: string) => {
  switch (iconName) {
    case 'Coffee':
      return <Coffee className="w-5 h-5 text-[#C29355]" />;
    case 'CakeSlice':
      return <CakeSlice className="w-5 h-5 text-[#C29355]" />;
    case 'Cookie':
      return <Cookie className="w-5 h-5 text-[#C29355]" />;
    case 'Dumbbell':
      return <Dumbbell className="w-5 h-5 text-[#C29355]" />;
    case 'Moon':
      return <Moon className="w-5 h-5 text-[#C29355]" />;
    case 'Snowflake':
      return <Snowflake className="w-5 h-5 text-[#C29355]" />;
    default:
      return <Coffee className="w-5 h-5 text-[#C29355]" />;
  }
};

const getPhotoIcon = (iconKey: string, className = "w-3.5 h-3.5 text-[#C29355]") => {
  switch (iconKey) {
    case 'Sprout':
      return <Sprout className={className} />;
    case 'Coffee':
      return <Coffee className={className} />;
    case 'Compass':
      return <Compass className={className} />;
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'Feather':
      return <Feather className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    default:
      return null;
  }
};

export default function App() {
  const [entered, setEntered] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('hasSeenIntro') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [activeTab, setActiveTab] = useState<'home' | 'services' | 'staff' | 'qa'>('home');
  const [hoveredTab, setHoveredTab] = useState<'home' | 'services' | 'staff' | 'qa' | null>(null);
  const [menuFilter, setMenuFilter] = useState<'all' | 'tea_delight' | 'conceptual_set'>('all');
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
    try {
      sessionStorage.setItem('hasSeenIntro', 'true');
    } catch (e) {}
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
          <main className={`flex-grow w-full mx-auto px-6 py-8 md:py-16 transition-all duration-300 ${activeTab === 'staff' ? 'max-w-[1560px]' : 'max-w-7xl'}`}>
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
                          <h4 className="font-serif text-gray-800 text-base font-semibold tracking-wider pb-2 border-b border-gray-100 flex items-center gap-2">
                            <Sprout size={18} className="text-[#C29355]" />
                            <span>社群引流與原創扶持</span>
                          </h4>
                          <p className="text-justify">
                            善用 FF14 社群的互動性，以同人創作帶動曝光，進而反哺創作者的原創作品，協助提升原創作品的能見度。
                          </p>
                        </div>
                        
                        <div className="space-y-6">
                          <h4 className="font-serif text-gray-800 text-base font-semibold tracking-wider pb-2 border-b border-gray-100 flex items-center gap-2">
                            <Users size={18} className="text-[#C29355]" />
                            <span>角色放置與交流空間</span>
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
                    </div>

                     {/* Filter buttons - pure typography elegance */}
                    <div className="flex flex-wrap justify-center gap-6 md:gap-12 pb-4 border-b border-gray-100 max-w-2xl mx-auto">
                      {[
                        { id: 'all', label: '全部 (All)', icon: null },
                        { id: 'tea_delight', label: '微光茶點 (Teatime - 20k)', icon: <Sparkles className="w-4 h-4 text-[#C29355]" /> },
                        { id: 'conceptual_set', label: '概念套餐 (Course - 50k)', icon: <Utensils className="w-4 h-4 text-[#C29355]" /> }
                      ].map((filter) => (
                        <button
                          key={filter.id}
                          onClick={() => setMenuFilter(filter.id as any)}
                          className={`font-serif text-xs md:text-sm tracking-widest transition-all cursor-pointer flex items-center space-x-2 pb-2 ${
                            menuFilter === filter.id 
                              ? 'text-[#C29355] font-bold border-b-2 border-[#C29355]' 
                              : 'text-gray-400 hover:text-gray-800'
                          }`}
                        >
                          {filter.icon}
                          <span>{filter.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Menu grid: Elegant block-cards with layout structure representing menus */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                      {MENU_ITEMS.filter(item => menuFilter === 'all' || item.category === menuFilter).map((item) => (
                        <div 
                          key={item.id} 
                          className="flex flex-col space-y-4 bg-[#FCF8F2] border border-amber-900/10 hover:border-amber-900/20 shadow-sm p-6 transition-all duration-300 rounded-none relative overflow-hidden"
                        >
                          {/* Top bar */}
                          <div className="flex justify-between items-start">
                            <div className="flex items-start space-x-3">
                              <div className="mt-0.5">{getMenuItemIcon(item.icon)}</div>
                              <div className="flex flex-col">
                                <h3 className="font-serif text-base md:text-[17px] text-gray-900 font-medium tracking-wide">
                                  {item.name}
                                </h3>
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                                  <span className="font-serif italic text-[11px] text-gray-400">
                                    {item.englishName}
                                  </span>
                                  {item.gameItemName && (
                                    <span className="text-[10px] text-[#C29355] bg-[#F4EFE6] px-1.5 py-0.5 font-light">
                                      遊戲內：{item.gameItemName}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <span className="font-mono text-xs text-[#C29355] font-semibold tracking-widest pl-2 whitespace-nowrap">
                              {item.price}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 text-[12.5px] leading-relaxed pt-1 font-light text-justify">
                            {item.desc}
                          </p>
                          
                          {/* Footer label with custom category tag */}
                          <div className="flex items-center justify-between pt-1 mt-auto">
                            <div className="flex items-center space-x-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#C29355]" />
                              <span className="font-mono text-[9px] text-[#C29355] uppercase tracking-widest">
                                {item.category === 'tea_delight' ? 'Shimmering Delight / 微光茶點' : 'Conceptual Set / 概念套餐'}
                              </span>
                            </div>
                            {item.category === 'conceptual_set' && (
                              <span className="text-[9px] font-sans text-emerald-800 font-light bg-emerald-50 border border-emerald-100 px-1.5 py-0.5">
                                * 可要求 僅登記累積消費，不要餐
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>


                  {/* Part 2: 小屋紀事 (Minimalist space for chronicles and activity) */}
                  <section id="chronology-section" className="py-12 bg-[#FDFAF6] max-w-4xl mx-auto px-4">
                    
                    <div className="text-center mb-10 space-y-3">
                      <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#C29355] block">
                        CHRONOLOGY / 小屋紀事 ・ 琥珀活動
                      </span>
                      <h2 className="font-serif text-2xl text-gray-900 tracking-widest font-normal">
                        微光林間「每月速寫夜」
                      </h2>
                    </div>

                    {/* 活動企劃卡片 (日系雜誌精緻細邊框) */}
                    <div className="border border-[#0B2415]/15 bg-white p-6 md:p-8 space-y-8 shadow-[0_4px_20px_rgba(11,36,21,0.01)] text-left rounded-none">
                      
                      {/* 上側：企劃資訊 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-[#0B2415]/10">
                        {/* 人員配置 */}
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2 text-[#C29355]">
                            <Users size={16} />
                            <span className="font-mono text-xs uppercase tracking-[0.2em] font-semibold">
                              CO-STAFF / 人員配置
                            </span>
                          </div>
                          <div className="space-y-2 pl-6">
                            <p className="font-serif text-[13.5px] text-gray-700 tracking-wider">
                              <span className="text-gray-400 mr-2 font-mono text-xs">// 模特人選</span>
                              蹲、茉、泉蓮、時羽
                            </p>
                            <p className="font-serif text-[13.5px] text-gray-700 tracking-wider">
                              <span className="text-gray-400 mr-2 font-mono text-xs">// 主持人 / 計時員</span>
                              <span className="italic text-gray-300">本期留空</span>
                            </p>
                          </div>
                        </div>

                        {/* 酬勞與時長 */}
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2 text-[#C29355]">
                            <Sparkles size={16} />
                            <span className="font-mono text-xs uppercase tracking-[0.2em] font-semibold">
                              PAY & TIME / 酬勞與時長
                            </span>
                          </div>
                          <div className="space-y-2 pl-6">
                            <p className="font-serif text-[13.5px] text-gray-700 tracking-wider">
                              <span className="text-gray-400 mr-2 font-mono text-xs">// 模特薪資</span>
                              時薪 50,000 Gil
                            </p>
                            <p className="font-serif text-[13.5px] text-gray-700 tracking-wider">
                              <span className="text-gray-400 mr-2 font-mono text-xs">// 活動總長</span>
                              約 120 分鐘
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* 下側：流程表 */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 text-[#C29355]">
                          <BookOpen size={16} />
                          <span className="font-mono text-xs uppercase tracking-[0.2em] font-semibold">
                            SCHEDULE / 流程表
                          </span>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse border-y-2 border-[#0B2415] text-left">
                            <thead>
                              <tr className="border-b border-[#0B2415] bg-[#0B2415]/5">
                                <th className="py-3 px-4 font-serif text-sm font-semibold text-[#0B2415] tracking-wider w-[120px] border-r border-[#0B2415]/10">時間分配</th>
                                <th className="py-3 px-4 font-serif text-sm font-semibold text-[#0B2415] tracking-wider w-[180px] border-r border-[#0B2415]/10">階段任務</th>
                                <th className="py-3 px-4 font-serif text-sm font-semibold text-[#0B2415] tracking-wider">模特動作與規則</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#0B2415]/10 text-gray-700 font-serif text-[13px] leading-relaxed">
                              <tr>
                                <td className="py-4 px-4 font-mono font-medium text-xs text-[#C29355] border-r border-[#0B2415]/10">10 min</td>
                                <td className="py-4 px-4 font-medium border-r border-[#0B2415]/10">迎賓與開場</td>
                                <td className="py-4 px-4 text-gray-600 font-light">主持人說明今日主題，模特至舞台中央就位。</td>
                              </tr>
                              <tr>
                                <td className="py-4 px-4 font-mono font-medium text-xs text-[#C29355] border-r border-[#0B2415]/10">15 - 35 min</td>
                                <td className="py-4 px-4 font-medium border-r border-[#0B2415]/10">第一階段 (動作：站姿)</td>
                                <td className="py-4 px-4 text-gray-600 font-light">繪師拍照留存並開始 20 分鐘速寫。</td>
                              </tr>
                              <tr>
                                <td className="py-4 px-4 font-mono font-medium text-xs text-[#C29355] border-r border-[#0B2415]/10">40 - 60 min</td>
                                <td className="py-4 px-4 font-medium border-r border-[#0B2415]/10">第二階段 (動作2)</td>
                                <td className="py-4 px-4 text-gray-600 font-light">
                                  <span className="block font-medium mb-1">動作二</span>
                                  <span className="text-gray-500 font-light">模特動作+表情，繪師拍照留存並開始 20 分鐘速寫。</span>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-4 px-4 font-mono font-medium text-xs text-[#C29355] border-r border-[#0B2415]/10">65 - 85 min</td>
                                <td className="py-4 px-4 font-medium border-r border-[#0B2415]/10">第三階段 (動作3)</td>
                                <td className="py-4 px-4 text-gray-600 font-light">
                                  <span className="block font-medium mb-1">動作三</span>
                                  <span className="text-gray-500 font-light">模特動作+表情，繪師拍照留存並開始 20 分鐘速寫。</span>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-4 px-4 font-mono font-medium text-xs text-[#C29355] border-r border-[#0B2415]/10">85 - 120 min</td>
                                <td className="py-4 px-4 font-medium border-r border-[#0B2415]/10">大合照與成果發表</td>
                                <td className="py-4 px-4 text-gray-600 font-light space-y-1">
                                  <p className="font-light">・ 繪師將作品上傳至 Discord</p>
                                  <p className="font-light">・ 攝影師安排大合照、交流放鬆時間。</p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                    </div>
                  </section>


                  {/* Part 3: 琥珀切片 (Polaroid Wall) */}
                  <section id="amber-slices-section" className="space-y-12 pt-12 border-t border-gray-100/60">
                    
                    <div className="text-center space-y-4 max-w-md mx-auto">
                      <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#C29355]">
                        AMBER SLICES
                      </span>
                      <h2 className="font-serif text-2xl text-gray-900 tracking-widest font-normal">
                        琥珀切片
                      </h2>
                    </div>

                    {/* Polaroid Grid Layout */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto py-8">
                      {PETAL_PHOTOS.filter(photo => photo.type === 'polaroid').map((photo, index) => {
                        const angles = ['rotate-[-1.5deg]', 'rotate-[1deg]', 'rotate-[-1deg]', 'rotate-[1.5deg]'];
                        const angle = angles[index % angles.length];
                        return (
                          <motion.div
                            key={'slice-' + index}
                            onClick={() => setSelectedPhoto(photo)}
                            whileHover={{ y: -8, scale: 1.03, rotate: 0 }}
                            transition={{ duration: 0.4 }}
                            className={`cursor-pointer overflow-hidden relative group bg-white p-4 pb-8 border border-gray-150 rounded-none shadow-sm hover:shadow-md hover:z-20 inline-block w-full text-left transition-all ${angle}`}
                          >
                            {/* Image wrapper */}
                            <div className="overflow-hidden bg-[#FBF8F3] aspect-[4/5] relative">
                              <img 
                                src={photo.url} 
                                alt={photo.caption} 
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover filter saturate-[0.9] hover:saturate-100 transition-all duration-700 ease-out"
                              />
                            </div>

                            {/* Caption formatting */}
                            <div className="flex items-center justify-center space-x-1.5 pt-4">
                              {photo.iconKey && getPhotoIcon(photo.iconKey)}
                              <p className="text-gray-600 font-serif text-[11.5px] italic tracking-wide text-center leading-normal font-normal">
                                {photo.caption}
                              </p>
                            </div>

                            {/* Magnifier indicator on hover */}
                            <div className="absolute top-4 right-4 bg-white/90 p-1.5 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 pointer-events-none text-emerald-950">
                              <Maximize2 size={12} />
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                  </section>


                  {/* Part 4: 眾人花影 (Photos block) */}
                  <section id="flowers-crowd-section" className="space-y-12 pt-16 border-t border-gray-100/60 transition-all">
                    
                    <div className="text-center space-y-4 max-w-md mx-auto">
                      <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#C29355]">
                        FLOWERS OF THE CROWD
                      </span>
                      <h2 className="font-serif text-2xl text-gray-900 tracking-widest font-normal">
                        眾人花影
                      </h2>
                    </div>

                    {/* Frameless Photos Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto py-8">
                      {PETAL_PHOTOS.filter(photo => photo.type === 'full').map((photo, index) => {
                        return (
                          <motion.div
                            key={'photo-' + index}
                            onClick={() => setSelectedPhoto(photo)}
                            whileHover={{ y: -4, scale: 1.015 }}
                            transition={{ duration: 0.4 }}
                            className="relative group overflow-hidden cursor-pointer shadow-sm hover:shadow-lg rounded-none aspect-[3/2] bg-gray-50 transition-all"
                          >
                            <img 
                              src={photo.url} 
                              alt={photo.caption} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 duration-700 ease-out"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-90 md:opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col justify-end p-6 select-none">
                              <div className="flex items-center space-x-2">
                                {photo.iconKey && getPhotoIcon(photo.iconKey, "w-4 h-4 text-white/90")}
                                <p className="text-white font-serif text-sm tracking-widest font-medium">
                                  {photo.caption}
                                </p>
                              </div>
                              <span className="text-white/40 text-[9px] font-mono tracking-widest uppercase mt-1.5 block">
                                [ CLICK TO INSPECT DETAIL • 點擊檢視放大 ]
                              </span>
                            </div>

                            <div className="absolute top-4 right-4 bg-white/95 p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 text-emerald-950">
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
                  className="space-y-10"
                >
                  
                  {/* Part 1: Page Header */}
                  <div className="text-center space-y-4 max-w-lg mx-auto">
                    <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#C29355]">
                      MEET THE CARETAKERS
                    </span>
                    <h2 className="font-serif text-3xl text-gray-900 tracking-widest font-normal">
                      屋簷下的人們
                    </h2>
                  </div>

                  {/* High elegance switch tabs - 'Scribes' and 'Lantern Bearers' */}
                  <div className="flex justify-center max-w-xl mx-auto relative border-b border-gray-100 pb-2">
                    <button
                      onClick={() => setStaffRole('scribe')}
                      className={`w-1/2 py-3 text-center font-serif text-xs md:text-sm tracking-widest transition-all relative z-10 cursor-pointer ${
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
                      className={`w-1/2 py-3 text-center font-serif text-xs md:text-sm tracking-widest transition-all relative z-10 cursor-pointer ${
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

                  <div className="max-w-none mx-auto py-2">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={staffRole}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      >
                        {staffRole === 'scribe' ? (
                          <StaffProfileSwitcher 
                            profiles={[
                              {
                                name: '三更',
                                englishName: 'Midnight',
                                bio: '擅長營造深夜寂靜、爐火微光的深色重彩插畫。以細膩的明暗光衰與哥德式墨線，描繪在黑夜中閃爍的精靈與古老靈藥。平日喜愛在黎明到來前點燃琥珀色煤油燈，靜靜雕琢夢境中的破碎片段。',
                                avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800',
                                specialties: ['深夜星光與暗部光影', '古老法典羊皮紙質感', '哥德幻象肖像彩繪'],
                                commissionStatus: 'open',
                                portfolio: [
                                  {
                                    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800',
                                    title: '星曆與占星術研究'
                                  },
                                  {
                                    url: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=800',
                                    title: '秘境中的草藥研磨'
                                  },
                                  {
                                    url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800',
                                    title: '黃昏下的小屋別墅'
                                  },
                                  {
                                    url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=800',
                                    title: '深夜爐火微光手稿'
                                  }
                                ],
                                priceList: [
                                  { item: '深夜星光重彩肖像', price: '⦗ 15,000 Gil ⦘' },
                                  { item: '古典植物誌羊皮研究細節線稿', price: '⦗ 6,000 Gil ⦘' }
                                ],
                                ongoing: []
                              },
                              {
                                name: '小藍',
                                englishName: 'Bleu',
                                bio: '偏愛清冷而透明的靛藍色調，猶如古老冰川融化時的情感流動。擅長以輕靈的半透明水彩技法繪製植物花瓣、澄澈小溪與冒險者的溫柔眼眸。在其筆下，冰冷的乙太也能展現出水波般的感性。',
                                avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
                                specialties: ['極地冰晶透明質感', '清晨露珠與微光渲染', '溫和舒緩肖像手繪'],
                                commissionStatus: 'open',
                                portfolio: [
                                  {
                                    url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800',
                                    title: '澄澈藍冰水華圖'
                                  },
                                  {
                                    url: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=800',
                                    title: '寒霜玫瑰的微光'
                                  },
                                  {
                                    url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=800',
                                    title: '漫風雪觀星台夜景'
                                  },
                                  {
                                    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800',
                                    title: '半透明植物手帳'
                                  }
                                ],
                                priceList: [
                                  { item: '半透明水彩感植物肖像', price: '⦗ 12,000 Gil ⦘' },
                                  { item: '精緻冰晶水彩單體速寫', price: '⦗ 5,000 Gil ⦘' }
                                ],
                                ongoing: []
                              },
                              {
                                name: '阿琪',
                                englishName: 'Aki',
                                bio: '擁有秋季落葉般溫暖色調的拂曉繪師。其作品多帶有手造紙的粗糙紋理與古樸的金箔裝飾，常年在小屋的文獻庫協助古籍手繪重製。筆觸沈實，自帶一種午後暖陽照透塵埃的靜謐香氣。',
                                avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
                                specialties: ['古典羊皮古文重塑', '秋實與落葉色調營造', '金箔手藝飾邊設計'],
                                commissionStatus: 'queue',
                                portfolio: [
                                  {
                                    url: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=800',
                                    title: '秋實拂曉的文獻重塑'
                                  },
                                  {
                                    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800',
                                    title: '羊皮手抄金色符號'
                                  },
                                  {
                                    url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800',
                                    title: '落葉時光的茶寮一角'
                                  },
                                  {
                                    url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=800',
                                    title: '冒險行囊速寫彩頁'
                                  }
                                ],
                                priceList: [
                                  { item: '羊皮手抄金色修飾肖像', price: '⦗ 14,000 Gil ⦘' },
                                  { item: '古典金箔植物手繪速寫', price: '⦗ 5,500 Gil ⦘' }
                                ],
                                ongoing: []
                              },
                              {
                                name: '一口',
                                englishName: 'One Bite',
                                bio: '擅長描繪冒險茶寮中各種誘人甜點與熱氣騰騰的草藥茶飲。其畫風飽滿溫柔，色彩溫潤香甜，讓人彷彿能透過古老的羊皮紙，嗅到廚房剛出爐的脆皮鬆餅與炙烤肉排的濃郁香氣。',
                                avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800',
                                specialties: ['溫暖系食物與靜物畫', '午後茶飲霧氣描摹', '幸福感隨身小插圖'],
                                commissionStatus: 'open',
                                portfolio: [
                                  {
                                    url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800',
                                    title: '熱烘鬆餅與香草薄荷茶'
                                  },
                                  {
                                    url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=800',
                                    title: '精靈蜂蜜果凍杯'
                                  },
                                  {
                                    url: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=800',
                                    title: '暖意烤肉與香料果酒'
                                  },
                                  {
                                    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800',
                                    title: '茶寮甜點合輯隨筆'
                                  }
                                ],
                                priceList: [
                                  { item: '精緻全彩茶寮美饌插圖', price: '⦗ 8,000 Gil ⦘' },
                                  { item: '手繪幸福感茶飲甜點隨筆', price: '⦗ 3,500 Gil ⦘' }
                                ],
                                ongoing: []
                              },
                              {
                                name: '毛熊',
                                englishName: 'Ursa',
                                bio: '筆觸如同其名般厚實穩重，喜愛使用厚重油彩與炭棒描繪森林中高大的樹木、古老巨石與冒險者的旅伴。畫作帶著沉穩的泥土芬芳，給予觀者無比安心的林野氣息，是頑強歷史的沈默歌頌者。',
                                avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800',
                                specialties: ['重油彩炭棒林木描繪', '古老巨石苔蘚質感', '寫實派野外地圖與馱獸'],
                                commissionStatus: 'closed',
                                portfolio: [
                                  {
                                    url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800',
                                    title: '黑衣森林深處的古木'
                                  },
                                  {
                                    url: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=800',
                                    title: '覆苔巨石與以太流'
                                  },
                                  {
                                    url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=800',
                                    title: '冒險者的陸行鳥旅伴'
                                  },
                                  {
                                    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800',
                                    title: '林地庇護所概念稿'
                                  }
                                ],
                                priceList: [
                                  { item: '林野厚油彩場景巨繪', price: '⦗ 22,000 Gil ⦘' },
                                  { item: '冒險者與忠誠馱獸立繪', price: '⦗ 16,000 Gil ⦘' }
                                ],
                                ongoing: []
                              },
                              {
                                name: '鮮魚',
                                englishName: 'Poisson',
                                bio: '擅長用流暢如水、變幻莫測的藍紫色筆觸，描繪深海中的以太漩渦與發光生物。其畫作中常伴有流動的水汽、飛散的透明氣泡與波光粼粼的夢幻光效，猶如利姆薩·羅敏薩深海下的瑰麗奇境。',
                                avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800',
                                specialties: ['海洋以太流動繪製', '深海發光蕈生存錄', '波光瀲灩水體刻畫'],
                                commissionStatus: 'open',
                                portfolio: [
                                  {
                                    url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800',
                                    title: '深海發光以太水汽'
                                  },
                                  {
                                    url: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=800',
                                    title: '波光粼粼的潮池精靈'
                                  },
                                  {
                                    url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=800',
                                    title: '利姆薩羅敏薩浪花圖'
                                  },
                                  {
                                    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800',
                                    title: '水下乙太結晶速寫'
                                  }
                                ],
                                priceList: [
                                  { item: '斑斕深海極光肖像插畫', price: '⦗ 15,500 Gil ⦘' },
                                  { item: '流動水汽與潮汐單色速寫', price: '⦗ 6,000 Gil ⦘' }
                                ],
                                ongoing: []
                              },
                              {
                                name: '篁上',
                                englishName: 'Takamura',
                                bio: '來自遠東黃金鄉的傳統畫師，精通竹影、日本摺扇、金箔與細膩工筆。擅長將東洋古典重彩與小屋庭院的西方草藥完美的跨界結合，其線條勾勒流暢古雅，作品中透出超然脫俗的雅緻。',
                                avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800',
                                specialties: ['東洋摺扇屏風細繪', '水墨竹石意境營造', '古典精靈使魔全彩'],
                                commissionStatus: 'queue',
                                portfolio: [
                                  {
                                    url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800',
                                    title: '東洋竹影水墨屏風'
                                  },
                                  {
                                    url: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=800',
                                    title: '金箔仙鶴櫻花扇面'
                                  },
                                  {
                                    url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=800',
                                    title: '神選仙獸使魔圖'
                                  },
                                  {
                                    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800',
                                    title: '遠東異界神明插像'
                                  }
                                ],
                                priceList: [
                                  { item: '大和摺扇極彩古典肖像', price: '⦗ 18,000 Gil ⦘' },
                                  { item: '細膩工筆水墨竹石寫意隨筆', price: '⦗ 7,500 Gil ⦘' }
                                ],
                                ongoing: []
                              },
                              {
                                name: '阿樹',
                                englishName: 'Arbor',
                                bio: '隱居在小屋溫室一角的本草速寫員。其線稿剛勁有力，能在數分鐘內以單色鋼筆優雅勾勒出最複雜的草藥根莖與魔力結晶。他用樸實的筆尖向大自然致敬，是小屋中最受草藥學徒歡迎的導師。',
                                avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800',
                                specialties: ['鋼筆本草綱目速寫', '草藥根莖局部解剖圖', '黑白線條版畫雕繪'],
                                commissionStatus: 'open',
                                portfolio: [
                                  {
                                    url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800',
                                    title: '格里達尼亞根莖解剖'
                                  },
                                  {
                                    url: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=800',
                                    title: '鋼筆勾勒魔力結晶'
                                  },
                                  {
                                    url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=800',
                                    title: '古老草本根鬚版畫'
                                  },
                                  {
                                    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800',
                                    title: '極簡精靈露水速寫'
                                  }
                                ],
                                priceList: [
                                  { item: '黑白鋼筆剖析本草志圖錄(大)', price: '⦗ 11,000 Gil ⦘' },
                                  { item: '本草根莖黑白速寫插卡', price: '⦗ 4,500 Gil ⦘' }
                                ],
                                ongoing: []
                              },
                              {
                                name: '厂丁',
                                englishName: 'Handing',
                                bio: '專注於小屋機械結構與以太管道透視繪製的理性畫師。其筆下充滿了完美的幾何線條、精密的發條零件與散發著幽光的魔力黃銅。對於透視學有著極近偏執的追求，認為齒輪的和諧即是藝術。',
                                avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800',
                                specialties: ['魔力蒸氣活塞透視', '發條裝置結構拆解', '古典羊皮精確製圖'],
                                commissionStatus: 'open',
                                portfolio: [
                                  {
                                    url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800',
                                    title: '魔力飛輪機械結構'
                                  },
                                  {
                                    url: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=800',
                                    title: '蒸汽以太管道透視'
                                  },
                                  {
                                    url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=800',
                                    title: '發條精靈機械肢分解'
                                  },
                                  {
                                    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800',
                                    title: '黃銅魔力齒輪製圖'
                                  }
                                ],
                                priceList: [
                                  { item: '發條裝置蒸汽龐克精細立繪', price: '⦗ 16,500 Gil ⦘' },
                                  { item: '機械飛輪羊皮紙幾何製圖', price: '⦗ 8,000 Gil ⦘' }
                                ],
                                ongoing: []
                              },
                              {
                                name: 'CC',
                                englishName: 'CC',
                                bio: '充滿神祕感的符文與命理插畫師，僅在深夜光影曖昧時出沒。其筆底的塔羅牌面與星輪運行圖，線條交織如蛛網，色彩華麗中帶著一絲不祥與狂喜，隱藏著通往魔力深處的密碼，深不可測。',
                                avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800',
                                specialties: ['古典符文星輪設計', '塔羅牌面神秘重塑', '以太法術陣幾何繪'],
                                commissionStatus: 'open',
                                portfolio: [
                                  {
                                    url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800',
                                    title: '命運之輪塔羅牌重绘'
                                  },
                                  {
                                    url: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=800',
                                    title: '星盤大以太軌跡運行'
                                  },
                                  {
                                    url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=800',
                                    title: '深空召喚法陣圖騰'
                                  },
                                  {
                                    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800',
                                    title: '神秘盧恩符文雕印'
                                  }
                                ],
                                priceList: [
                                  { item: '占星塔羅神聖重塑插畫', price: '⦗ 17,500 Gil ⦘' },
                                  { item: '以太法陣古典符文幾何手繪', price: '⦗ 7,500 Gil ⦘' }
                                ],
                                ongoing: []
                              }
                            ]} 
                          />
                        ) : (
                          <WaiterProfileSwitcher />
                        )}
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
            <div className="max-w-7xl mx-auto px-6 pt-12 mt-12 border-t border-gray-100 flex justify-center items-center text-[10px] font-mono tracking-widest text-gray-400 text-center">
              <span>DESIGNED FOR COLLECTIVE HEARTS AND EMBLAZONED PETALS.</span>
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
