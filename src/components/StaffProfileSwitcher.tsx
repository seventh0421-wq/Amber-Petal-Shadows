import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import gsap from 'gsap';
import { ArrowLeft, ArrowRight, Palette, Coins, Maximize2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface ArtistProfile {
  name: string;
  englishName: string;
  bio: string;
  avatarUrl: string;
  specialties: string[];
  commissionStatus: 'open' | 'queue' | 'closed';
  portfolio?: { url: string; title: string }[];
  priceList?: { item: string; price: string }[];
  ongoing?: { thumbUrl: string; stage: '草稿' | '線稿' | '上色' | '完成' }[];
}

interface StaffProfileSwitcherProps {
  profiles: ArtistProfile[];
}

const COMMISSION_LABELS = {
  open: { 
    text: '開放委託 / OPEN', 
    bg: 'border-emerald-250 text-emerald-800 bg-emerald-50/50', 
    dot: 'bg-emerald-500' 
  },
  queue: { 
    text: '預約排單 / QUEUE', 
    bg: 'border-amber-200 text-amber-800 bg-amber-50/50', 
    dot: 'bg-[#C29355]' 
  },
  closed: { 
    text: '暫停委託 / CLOSED', 
    bg: 'border-gray-250 text-gray-500 bg-gray-50', 
    dot: 'bg-gray-400' 
  },
};

const getStageDetails = (stage: string) => {
  switch (stage) {
    case '草稿':
      return { percent: 25, color: 'bg-amber-500', label: '草稿 / DRAFT' };
    case '線稿':
      return { percent: 50, color: 'bg-amber-600/95', label: '線稿 / LINEART' };
    case '上色':
      return { percent: 75, color: 'bg-[#C29355]', label: '上色 / COLOR' };
    case '完成':
      return { percent: 100, color: 'bg-emerald-700', label: '完成 / DONE' };
    default:
      return { percent: 10, color: 'bg-gray-400', label: stage };
  }
};

export const StaffProfileSwitcher: React.FC<StaffProfileSwitcherProps> = ({ profiles }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);

  // References for GSAP
  const containerRef = useRef<HTMLDivElement>(null);
  const oldSlideRef = useRef<HTMLDivElement>(null);
  const newSlideRef = useRef<HTMLDivElement>(null);
  const newContentRef = useRef<HTMLDivElement>(null);
  
  // Double-track numbers
  const oldNumRef = useRef<HTMLDivElement>(null);
  const newNumRef = useRef<HTMLDivElement>(null);

  // Bottom scrollbar indicator
  const tabUnderlineRef = useRef<HTMLDivElement>(null);
  const tabButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Ref locks to avoid multi-clicking
  const isAnimatingRef = useRef<boolean>(false);

  // prefers-reduced-motion check
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Preset next/prev images to accelerate load times
  useEffect(() => {
    if (profiles.length <= 1) return;
    const nextIdx = (activeIndex + 1) % profiles.length;
    const prevIdx = (activeIndex - 1 + profiles.length) % profiles.length;
    
    [profiles[nextIdx].avatarUrl, profiles[prevIdx].avatarUrl].forEach(url => {
      if (url) {
        const img = new Image();
        img.src = url;
      }
    });

    // Warm-up item catalogs
    const preloads: string[] = [];
    profiles[nextIdx].portfolio?.forEach(x => preloads.push(x.url));
    profiles[prevIdx].portfolio?.forEach(x => preloads.push(x.url));
    preloads.slice(0, 4).forEach(url => {
      if (url) {
        const img = new Image();
        img.src = url;
      }
    });
  }, [activeIndex, profiles]);

  // Adjust bottom active menu indicator position
  useLayoutEffect(() => {
    const activeBtn = tabButtonRefs.current[activeIndex];
    if (activeBtn && tabUnderlineRef.current) {
      gsap.to(tabUnderlineRef.current, {
        left: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth,
        duration: 0.45,
        ease: 'power2.out',
      });
    }
  }, [activeIndex, profiles]);

  // Clean indices when target list changes
  useEffect(() => {
    setActiveIndex(0);
    setPrevIndex(null);
    setIsTransitioning(false);
    isAnimatingRef.current = false;
  }, [profiles]);

  // Core GSAP Parallax Animation
  useLayoutEffect(() => {
    if (prevIndex === null || !isTransitioning) return;

    isAnimatingRef.current = true;

    const ctx = gsap.context(() => {
      const isNext = direction === 'next';
      
      const tl = gsap.timeline({
        onComplete: () => {
          isAnimatingRef.current = false;
          setIsTransitioning(false);
          setPrevIndex(null);
        }
      });

      // Reduced motion fallback
      if (reducedMotion) {
        tl.to(oldSlideRef.current, {
          opacity: 0,
          duration: 0.15,
          ease: 'power1.out',
        })
        .fromTo(newSlideRef.current, {
          opacity: 0
        }, {
          opacity: 1,
          duration: 0.2,
          ease: 'power1.in',
        }, 0.1);
        return;
      }

      // Parallax coordinate configurations
      const slideStart = isNext ? '100%' : '-100%';
      const contentOffset = isNext ? '-40%' : '40%';

      // Prep positions
      gsap.set(newSlideRef.current, {
        x: slideStart,
        opacity: 1,
      });
      gsap.set(newContentRef.current, {
        x: contentOffset,
      });

      // 1. Old page disappears at final 0.3s
      tl.to(oldSlideRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
      }, 0.9);

      // 2. New pane slides on top
      tl.to(newSlideRef.current, {
        x: '0%',
        duration: 1.2,
        ease: 'power3.inOut',
      }, 0);

      // 3. New contents parallax offset gets aligned
      tl.to(newContentRef.current, {
        x: '0%',
        duration: 1.2,
        ease: 'power3.inOut',
      }, 0);

      // 4. Stagger items underneath content (right details)
      const staggerItems = newContentRef.current?.querySelectorAll('.stagger-item');
      if (staggerItems && staggerItems.length > 0) {
        gsap.set(staggerItems, {
          y: 16,
          opacity: 0,
        });
        tl.to(staggerItems, {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.08,
          ease: 'power2.out',
        }, 0.8);
      }

      // 5. High aesthetic number slider swap
      if (oldNumRef.current && newNumRef.current) {
        gsap.set(oldNumRef.current, { y: 0, opacity: 1 });
        tl.to(oldNumRef.current, {
          y: -80,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.inOut',
        }, 0);

        gsap.set(newNumRef.current, { y: 80, opacity: 0 });
        tl.to(newNumRef.current, {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.inOut',
        }, 0);
      }

    }, containerRef);

    return () => ctx.revert();
  }, [activeIndex, prevIndex, direction, isTransitioning, reducedMotion]);

  const handleSwitch = (targetIndex: number) => {
    if (isAnimatingRef.current || targetIndex === activeIndex || targetIndex < 0 || targetIndex >= profiles.length) {
      return;
    }

    let dir: 'next' | 'prev' = 'next';
    if (targetIndex < activeIndex) {
      dir = 'prev';
    }

    // Wrap around sense cases
    if (activeIndex === 0 && targetIndex === profiles.length - 1) {
      dir = 'prev';
    } else if (activeIndex === profiles.length - 1 && targetIndex === 0) {
      dir = 'next';
    }

    setDirection(dir);
    setPrevIndex(activeIndex);
    setActiveIndex(targetIndex);
    setIsTransitioning(true);
  };

  const nextProfile = () => {
    handleSwitch((activeIndex + 1) % profiles.length);
  };

  const prevProfile = () => {
    handleSwitch((activeIndex - 1 + profiles.length) % profiles.length);
  };

  const renderProfilePage = (profile: ArtistProfile, isOld: boolean = false) => {
    const isCommissionOpen = profile.commissionStatus === 'open';
    return (
      <div className="w-full h-full relative flex flex-col justify-end lg:justify-center">
        {/* Giant structural watermark text behind transparent artwork */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center select-none pointer-events-none z-0 overflow-hidden w-full h-full">
          <span className="font-serif italic font-extrabold text-[#0B2415] opacity-[0.035] select-none pointer-events-none text-center whitespace-nowrap block tracking-tighter" style={{ fontSize: '12vw', width: '90%' }}>
            {profile.englishName}
          </span>
        </div>

        {/* Profile layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 w-full max-w-[1440px] mx-auto px-6 md:px-10 lg:px-8 xl:px-12 items-start pb-8 lg:pb-4 pt-16">
          
          {/* Transparent artwork panel - aligned bottom left */}
          <div className="col-span-12 lg:col-span-3 relative flex justify-center items-center h-[220px] md:h-[280px] lg:h-[480px] border border-dashed border-gray-200/60 bg-[#FBF9F6]/50 lg:self-stretch">
            <div className="text-center font-serif text-[14px] text-[#A6947D] tracking-[0.2em] font-light space-y-1.5 p-6">
              <div className="text-2xl opacity-80">✿</div>
              <div className="text-[14px] font-medium tracking-widest text-[#0B2415]">PORTRAIT</div>
              <div className="text-[12px] text-gray-450 font-sans tracking-normal font-light">照片準備中</div>
            </div>
          </div>

          {/* Right layout description stack */}
          <div className="col-span-12 lg:col-span-4 flex flex-col justify-start space-y-4 lg:space-y-5 text-left relative z-10 lg:pb-6">
            
            {/* Header profile details */}
            <div className={`${isOld ? '' : 'stagger-item'} space-y-2`}>
              <div className="flex flex-wrap items-baseline gap-4">
                <h2 className="font-serif text-[30px] font-normal text-[#0B2415] tracking-widest leading-none">
                  {profile.name}
                </h2>
                <div className={`inline-flex items-center gap-2 border px-2.5 py-0.5 text-[10px] font-mono tracking-widest rounded-none ${COMMISSION_LABELS[profile.commissionStatus].bg}`}>
                  <span className="relative flex h-1.5 w-1.5">
                    {isCommissionOpen && (
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${COMMISSION_LABELS[profile.commissionStatus].dot}`}></span>
                    )}
                    <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${COMMISSION_LABELS[profile.commissionStatus].dot}`}></span>
                  </span>
                  <span>{COMMISSION_LABELS[profile.commissionStatus].text}</span>
                </div>
              </div>
              
              <p className="font-mono text-[11px] text-[#C29355] tracking-[0.25em] uppercase font-medium">
                {profile.englishName}
              </p>
            </div>

            {/* Custom bio statement */}
            <div className={`${isOld ? '' : 'stagger-item'} border-l border-gray-200 pl-4 py-0.5`}>
              <p className="text-gray-600 text-xs md:text-[13px] leading-relaxed md:leading-loose text-justify font-light max-w-lg">
                {profile.bio}
              </p>
            </div>

            {/* Specialty tag lists */}
            <div className={`${isOld ? '' : 'stagger-item'} space-y-2`}>
              <span className="font-mono text-[9px] text-gray-400 uppercase tracking-widest block font-medium">
                SPECIALTIES / 擅長學門
              </span>
              <div className="flex flex-wrap gap-1.5">
                {profile.specialties.map((spec) => (
                  <span
                    key={spec}
                    className="px-3.5 py-1.5 bg-[#FDFAF6] border border-gray-200 text-gray-500 font-serif text-[14px] tracking-wider rounded-none flex items-center gap-1.5 select-none"
                  >
                    <Palette size={12} className="text-[#C29355]/70 text-xs shrink-0" />
                    {spec}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Third column: 作品參考 & 委託價目表 */}
          <div className="col-span-12 lg:col-span-3 flex flex-col justify-start space-y-4 text-left relative z-10 lg:pb-6 border-t lg:border-t-0 lg:border-l border-gray-250/30 pt-4 lg:pt-0 lg:pl-6">
            <div className={`${isOld ? '' : 'stagger-item'} space-y-4`}>
              {profile.portfolio && profile.portfolio.length > 0 && (
                <div className="bg-white border border-gray-150 p-3.5 rounded-none space-y-2.5 shadow-[sm_0_1px_2px_rgba(0,0,0,0.02)]">
                  <span className="font-serif text-[14px] font-semibold tracking-widest text-[#C29355] block uppercase pb-1 border-b border-gray-100">
                    作品參照 / portfolio
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {profile.portfolio.slice(0, 4).map((port, pIdx) => (
                      <div
                        key={pIdx}
                        onClick={() => setSelectedImage(port)}
                        className="aspect-square bg-[#FBF9F6] border border-gray-100 overflow-hidden cursor-zoom-in relative group"
                      >
                        <img
                          src={port.url}
                          alt={port.title}
                          className="w-full h-full object-cover group-hover:scale-108 transition-all duration-300 filter saturate-[0.8]"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Maximize2 size={10} className="text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {profile.priceList && profile.priceList.length > 0 && (
                <div className="bg-[#0B2415] border border-emerald-950 p-3.5 rounded-none space-y-3 shadow-sm">
                  <span className="font-serif text-[14px] font-semibold tracking-widest text-[#C29355] block uppercase pb-1 border-b border-emerald-900/30 flex items-center gap-1">
                    <Coins size={12} className="text-[#C29355]" />
                    委託價目 / price lists
                  </span>
                  <div className="space-y-2.5">
                    {profile.priceList.map((item, iIdx) => (
                      <div key={iIdx} className="flex items-baseline justify-between gap-3 border-b border-emerald-950 pb-1.5 last:border-0 last:pb-0">
                        <span className="text-[#FDFAF6]/85 font-serif text-[14px] font-light tracking-wide">{item.item}</span>
                        <span className="text-[#C29355] font-mono text-[14px] font-semibold shrink-0">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Rightmost column: 進行中的委託 (Ongoing Commissions) */}
          <div className="col-span-12 lg:col-span-2 flex flex-col justify-start space-y-4 text-left relative z-10 lg:pb-6 border-t lg:border-t-0 lg:border-l border-gray-250/50 pt-4 lg:pt-0 lg:pl-6">
            <div className={`${isOld ? '' : 'stagger-item'} space-y-3`}>
              <span className="font-mono text-[14px] text-[#C29355] tracking-[0.1em] uppercase block font-semibold pb-1 border-b border-gray-200 leading-tight">
                ONGOING /
                <span className="block mt-1 font-serif text-[14px] tracking-normal">進行中的委託</span>
              </span>
              
              <div className="space-y-3">
                {profile.ongoing && profile.ongoing.length > 0 ? (
                  profile.ongoing.map((item, itemIdx) => {
                    const stageDetails = getStageDetails(item.stage);
                    return (
                      <div key={itemIdx} className="flex items-center gap-2.5 border border-gray-150/60 p-2.5 bg-white/70 shadow-sm relative group">
                        {item.thumbUrl && (
                          <div className="w-10 h-10 bg-[#FDFAF6] border border-gray-100 overflow-hidden shrink-0">
                            <img
                              src={item.thumbUrl}
                              alt={item.stage}
                              className="w-full h-full object-cover filter saturate-[0.8] hover:saturate-100 transition-all duration-300"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2.5 leading-none">
                            <span className="font-serif text-[14px] text-gray-700 font-medium truncate">
                              案件 #{itemIdx + 1}
                            </span>
                            <span className="font-mono text-[11px] text-[#C29355] font-semibold shrink-0">
                              {stageDetails.label.split(' / ')[1]}
                            </span>
                          </div>
                          
                          {/* Mini Progress Bar */}
                          <div className="mt-2 w-full bg-gray-100 h-1 rounded-none overflow-hidden relative">
                            <div
                              className={`h-full ${stageDetails.color} transition-all duration-300`}
                              style={{ width: `${stageDetails.percent}%` }}
                            />
                          </div>
                          <div className="mt-1 text-[12px] font-sans text-gray-500 font-light flex justify-between leading-none w-full">
                            <span className="truncate max-w-[60px]">{stageDetails.label.split(' / ')[0]}</span>
                            <span>{stageDetails.percent}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="border border-dashed border-gray-200 p-4 text-center bg-white/40">
                    <span className="font-serif text-[14px] text-gray-400 block tracking-wider">
                      暫無進行中案件
                    </span>
                    <span className="font-mono text-[11px] text-gray-350 block mt-1 tracking-wider">
                      [ ATELIER SECURE ]
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  };

  const displayedProfile = profiles[activeIndex] || profiles[0];
  const oldProfile = prevIndex !== null ? profiles[prevIndex] : null;

  if (!displayedProfile) return null;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[85vh] min-h-[660px] lg:h-[80vh] bg-[#FDFAF6] border border-gray-200/50 rounded-none overflow-hidden select-none flex flex-col justify-between"
    >
      {/* 1. FIXED CONTENT PORT - Transition Track */}
      <div className="relative w-full flex-1 overflow-hidden">
        
        {/* Fixed upper numeric counter overlay */}
        <div className="absolute left-6 md:left-14 top-6 md:top-12 h-[80px] overflow-hidden z-35 select-none pointer-events-none">
          <div className="relative h-[80px] w-[150px]">
            <div
              ref={oldNumRef}
              className="absolute left-0 top-0 font-serif italic text-[#C29355] text-[72px] leading-none block font-light"
            >
              {oldProfile ? String(prevIndex! + 1).padStart(2, '0') : ''}
            </div>
            <div
              ref={newNumRef}
              className="absolute left-0 top-0 font-serif italic text-[#C29355] text-[72px] leading-none block font-light"
            >
              {String(activeIndex + 1).padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Dynamic slides stacking */}
        {oldProfile && isTransitioning && (
          <div
            ref={oldSlideRef}
            className="absolute inset-0 w-full h-full bg-[#FDFAF6] select-none z-10 pointer-events-none"
          >
            {renderProfilePage(oldProfile, true)}
          </div>
        )}

        <div
          ref={newSlideRef}
          className="absolute inset-0 w-full h-full bg-[#FDFAF6] select-none z-20"
        >
          {/* Aesthetic solid Forest Green decorative vertical edge lines */}
          <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-[#0B2415] z-30 pointer-events-none" />

          <div ref={newContentRef} className="w-full h-full">
            {renderProfilePage(displayedProfile, false)}
          </div>
        </div>

      </div>

      {/* 2. FIXED BOTTOM MENUBAR (Does not move or transform) */}
      <div className="relative z-30 bg-[#FDFAF6] border-t border-gray-150/60 flex flex-col md:flex-row items-center justify-between gap-4 py-4 px-6 md:px-12 w-full">
        
        {/* Horizontal scroll selector tabs */}
        <div className="relative flex flex-wrap items-center justify-center md:justify-start gap-x-2 md:gap-x-5 gap-y-1.5 order-1 w-full md:w-auto pb-2 md:pb-0">
          <div
            ref={tabUnderlineRef}
            className="absolute bottom-0 h-[2px] bg-[#C29355] pointer-events-none z-10"
          />

          {profiles.map((prof, pIdx) => (
            <button
              key={prof.name}
              ref={(el) => {
                tabButtonRefs.current[pIdx] = el;
              }}
              onClick={() => handleSwitch(pIdx)}
              disabled={isTransitioning}
              className={`py-1.5 px-3 font-serif text-xs md:text-sm tracking-widest cursor-pointer border-b border-transparent transition-all ${
                activeIndex === pIdx
                  ? 'text-[#0B2415] font-extrabold'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              {prof.name}
            </button>
          ))}
        </div>

        {/* Carousel buttons */}
        <div className="flex items-center space-x-2.5 order-2">
          <button
            onClick={prevProfile}
            disabled={isTransitioning}
            className="w-10 h-10 border border-gray-200 hover:border-[#C29355] hover:text-[#C29355] flex items-center justify-center rounded-none text-gray-450 bg-white hover:bg-[#FDFAF6] transition-all cursor-pointer disabled:opacity-40"
            aria-label="Previous profile"
          >
            <ArrowLeft size={15} />
          </button>
          
          <button
            onClick={nextProfile}
            disabled={isTransitioning}
            className="w-10 h-10 border border-gray-200 hover:border-[#C29355] hover:text-[#C29355] flex items-center justify-center rounded-none text-gray-450 bg-white hover:bg-[#FDFAF6] transition-all cursor-pointer disabled:opacity-40"
            aria-label="Next profile"
          >
            <ArrowRight size={15} />
          </button>
        </div>

      </div>

      {/* Exquisite pop modal view */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2415]/95 backdrop-blur-xs"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="relative max-w-2xl w-full bg-[#FDFAF6] border border-gray-200/50 p-3 rounded-none overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2.5 right-2.5 p-1.5 text-gray-400 hover:text-gray-900 bg-white border border-gray-200 rounded-none transition-colors z-10 cursor-pointer"
              >
                <X size={15} />
              </button>

              <div className="aspect-[4/3] w-full overflow-hidden border border-gray-100 bg-[#FBF9F6]">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  className="w-full h-full object-cover filter saturate-[0.8]"
                  referrerPolicy="no-referrer"
                />
              </div>

              {selectedImage.title && (
                <div className="mt-3 flex items-center justify-between px-1">
                  <p className="font-serif text-[13px] font-semibold tracking-wider text-gray-900">
                    {selectedImage.title}
                  </p>
                  <span className="text-[9px] text-[#C29355] font-mono tracking-widest uppercase">
                    [ PORTFOLIO PREVIEW ]
                  </span>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
