import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { Sparkles, Compass, Shield, BookOpen, Quote, HelpCircle, Palette } from 'lucide-react';

export interface WaiterProfile {
  name: string;
  englishName: string;
  quote: string;            // 對話泡泡的口頭禪
  bio: string;
  services: string[];       // 服務內容標籤
  avatarUrl: string;        // 去背立繪 / 角色立繪
  iconUrl: string;          // 左欄圓形小頭像
}

interface WaiterProfileSwitcherProps {
  waiters?: WaiterProfile[];
}

// ==========================================
// 預設示範假資料 (FF14 琥珀與花影 掌燈人服務生團隊)
// ==========================================
export const DEFAULT_WAITERS: WaiterProfile[] = [
  {
    name: '一口',
    englishName: 'YIKOU',
    quote: '「一口清茶，一縷暖風。今晚，想聽聽你的心裡話。」',
    bio: '「琥珀與花影」的資深掌燈人。性格溫和恬靜，擅長調配各類熱飲與陪伴傾聽。對治癒系植物與深夜安神香氣有著獨到的見解。',
    services: ['聊天茶敘', '深夜伴桌', '情緒樹洞'],
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
    iconUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150'
  },
  {
    name: '時羽',
    englishName: 'TOKIHA',
    quote: '「時光掠過指尖，羽毛輕飄於掌心。讓我為你記錄今宵的琥珀光影。」',
    bio: '擅長使用各類投影與拍照機制的掌燈閣員。對黑衣森林與溫室中不同時段的自然光感極為敏銳，是替旅人們留下永恆紀念的最佳引路人。',
    services: ['光影捕捉', '溫室導覽', '幻術保養'],
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    iconUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
  },
  {
    name: '泉蓮',
    englishName: 'SENREN',
    quote: '「清寒似泉，溫潤如蓮。於這琥珀微光中，洗淨僕僕塵埃。」',
    bio: '精通東方香道、茶道與古老木質香調。行止高雅婉約、言辭溫和，常在清幽一隅以嫋嫋細煙與一杯暖茶，撫平旅途中的疲憊與喧囂。',
    services: ['古風香席', '夜間茶席', '安靜治癒'],
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
    iconUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'
  },
  {
    name: '閻羅',
    englishName: 'ENRA',
    quote: '「夜色已深，陰影才是靈魂的真實形狀。要來占卜一局命運，還是一杯烈茶？」',
    bio: '帶著神祕氣息的夜班掌燈人。不苟言笑的外表下，有著敏銳洞察人心與命運軌跡的思維。擅長使用各式卡牌批註與特殊香料配方的特調。',
    services: ['深夜占卜', '特調烈茶', '奇術諮商'],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    iconUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
  },
  {
    name: '衍',
    englishName: 'YEN',
    quote: '「琴弦微顫，衍續著千萬年的歌謠。長夜漫漫，我們以故事下酒。」',
    bio: '性情隨和散淡、懷抱古老樂器的吟唱者。喜愛在無人打擾的藤架下，隨性彈撥撫琴，講述第六星曆那些不為人知的黑衣森林舊夢。',
    services: ['音律彈奏', '古籍考據', '星夜聆聽'],
    avatarUrl: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=600',
    iconUrl: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=150'
  }
];

export const WaiterProfileSwitcher: React.FC<WaiterProfileSwitcherProps> = ({ 
  waiters = DEFAULT_WAITERS 
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // 用於 React 同時掛載新舊畫面，進行覆蓋 Parallax 轉場。
  // 陣列結構為: { key, index, isIncoming, direction }
  const [visibleViews, setVisibleViews] = useState<Array<{
    key: string;
    index: number;
    isIncoming: boolean;
    direction: 'forward' | 'backward';
  }>>([
    { key: `sc-${selectedIndex}-init`, index: selectedIndex, isIncoming: false, direction: 'forward' }
  ]);

  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);

  // 預載相鄰立繪，提升轉場載入體驗
  useEffect(() => {
    waiters.forEach((waiter) => {
      const img = new Image();
      img.src = waiter.avatarUrl;
    });
  }, [waiters]);

  // 點擊左欄切換頭像
  const handleSelect = (targetIndex: number) => {
    if (targetIndex === selectedIndex) return;
    if (isAnimatingRef.current) return;

    // 檢查使用者是否偏好減少動畫
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setSelectedIndex(targetIndex);
      setVisibleViews([
        { key: `sc-${targetIndex}-${Date.now()}`, index: targetIndex, isIncoming: false, direction: 'forward' }
      ]);
      return;
    }

    isAnimatingRef.current = true;
    const direction = targetIndex > selectedIndex ? 'forward' : 'backward';
    
    // 生成一個全新唯一的 Key
    const newKey = `sc-${targetIndex}-${Date.now()}`;
    const oldKey = visibleViews[0]?.key || 'old';

    // 1. 同時掛載新舊視圖
    setVisibleViews([
      { key: oldKey, index: selectedIndex, isIncoming: false, direction },
      { key: newKey, index: targetIndex, isIncoming: true, direction }
    ]);
    
    setSelectedIndex(targetIndex);
  };

  // 每次 visibleViews 變更，且有 incoming 視圖時，觸發 GSAP Parallax 轉場
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const incomingItem = visibleViews.find(v => v.isIncoming);
      if (!incomingItem) return;

      const incomingKey = incomingItem.key;
      const outgoingKey = visibleViews.find(v => !v.isIncoming)?.key;
      const direction = incomingItem.direction;

      const incomingEl = containerRef.current?.querySelector(`[data-view-key="${incomingKey}"]`);
      const outgoingEl = outgoingKey ? containerRef.current?.querySelector(`[data-view-key="${outgoingKey}"]`) : null;

      if (!incomingEl) {
        isAnimatingRef.current = false;
        return;
      }

      // 取得新舊視圖內部的 Parallax 內容包裝層
      const incomingContent = incomingEl.querySelector('.parallax-content');
      
      // 計算方向偏移量
      const slideStartPercent = direction === 'forward' ? 100 : -100;
      const contentStartPercent = direction === 'forward' ? -40 : 40;

      const tl = gsap.timeline({
        onComplete: () => {
          // 轉場結束：解除鎖定，移除舊視圖，只保留新選中的視圖
          setVisibleViews([
            { key: incomingKey, index: incomingItem.index, isIncoming: false, direction }
          ]);
          isAnimatingRef.current = false;
        }
      });

      // 初始化新畫面位置：整層絕對定位於 side 側，前導色條與內容向後壓縮
      gsap.set(incomingEl, { xPercent: slideStartPercent, opacity: 1, zIndex: 10 });
      gsap.set(incomingContent, { xPercent: contentStartPercent });
      
      // 泡沫對話框：預設隱藏且縮小
      const speechBubble = incomingEl.querySelector('.quote-bubble');
      if (speechBubble) gsap.set(speechBubble, { opacity: 0, scale: 0.9, y: 10 });

      // 自介、標籤、邊框元素：預設隱藏且微幅下移 16px，做 stagger 進場
      const staggerElements = incomingEl.querySelectorAll('.transition-stagger');
      if (staggerElements.length > 0) {
        gsap.set(staggerElements, { opacity: 0, y: 16 });
      }

      // 立繪背景的大金圓
      const backingCircle = incomingEl.querySelector('.backing-circle');
      if (backingCircle) {
        gsap.set(backingCircle, { scale: 0.8, opacity: 0 });
      }

      // 2. 舊畫面一開始完全靜止，最後 0.3s 稍微淡出 (0.3s)
      if (outgoingEl) {
        tl.to(outgoingEl, {
          opacity: 0.65,
          duration: 0.3,
          ease: 'power2.inOut'
        }, '+=0.9'); // 在 1.2s 的後段觸發淡出
      }

      // 3. 新畫面整層覆蓋：1.2s Power3.inOut
      tl.to(incomingEl, {
        xPercent: 0,
        duration: 1.2,
        ease: 'power3.inOut'
      }, 0);

      // 4. 內容 Parallax 視差：以較慢速度跟進，結束時慢慢漂移到位
      tl.to(incomingContent, {
        xPercent: 0,
        duration: 1.2,
        ease: 'power3.inOut'
      }, 0);

      // 立繪背景大圓於轉場後半段放大顯存
      if (backingCircle) {
        tl.to(backingCircle, {
          scale: 1,
          opacity: 0.18,
          duration: 0.8,
          ease: 'power2.out'
        }, '-=0.6');
      }

      // 5. 服務標籤、自介、裝飾線：轉場最後 0.4s 依序 stagger 進場
      if (staggerElements.length > 0) {
        tl.to(staggerElements, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out'
        }, '-=0.4');
      }

      // 6. 對話泡泡最後出場：轉場結束後 0.2s 彈出顯現
      if (speechBubble) {
        tl.to(speechBubble, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.45,
          ease: 'back.out(1.6)'
        }, '+=0.15');
      }

    }, containerRef);

    return () => ctx.revert();
  }, [visibleViews]);

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-8" id="waiter-introduction-section">
      
      {/* 總體布局容器：手機直向堆疊 + 頂部左右滾動頭像；桌上型寬闊分欄，固定高度 80vh */}
      <div className="grid grid-cols-1 md:grid-cols-12 border border-[#0B2415]/15 bg-[#FDFAF6] shadow-[0_12px_40px_rgba(11,36,21,0.03)] relative overflow-hidden">
        
        {/* ==========================================
            最左側直欄 (切換器)：不參與 parallax 轉場
            ========================================== */}
        <div className="col-span-12 md:col-span-1 border-b md:border-b-0 md:border-r border-[#0B2415]/15 bg-[#FDFAF6] py-3 md:py-8 px-4 md:px-0 flex md:flex-col justify-between md:justify-start items-center gap-4 md:gap-8 z-30 relative shrink-0">
          
          {/* 直書小字 (裝飾) */}
          <div className="hidden md:block writing-mode-vertical text-center self-center opacity-70">
            <span className="font-serif text-[12px] text-[#C29355] tracking-[0.4em] uppercase block [writing-mode:vertical-rl] whitespace-nowrap font-light">
              掌燈人
            </span>
            <span className="font-mono text-[9px] text-[#0B2415]/40 tracking-widest block mt-4 rotate-180">
              AMBER & PETAL
            </span>
          </div>

          <div className="md:hidden">
            <span className="font-serif text-[13px] text-[#C29355] tracking-widest font-semibold">
              閣員 / 掌燈人
            </span>
          </div>

          {/* 頭像按鈕清單 */}
          <div className="flex md:flex-col items-center gap-3.5 overflow-x-auto no-scrollbar md:mt-4 max-w-full px-3 py-3">
            {waiters.map((waiter, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`relative shrink-0 transition-all duration-300 group focus:outline-none rounded-full p-[3px] border-2 ${
                    isSelected 
                      ? 'scale-110 border-[#C29355]' 
                      : 'border-transparent grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:scale-105'
                  }`}
                  aria-label={`切換至服務生 ${waiter.name}`}
                  id={`waiter-btn-${idx}`}
                >
                  <div className="w-11 h-11 md:w-13 md:h-13 rounded-full overflow-hidden">
                    <img
                      src={waiter.iconUrl}
                      alt={waiter.name}
                      loading="lazy"
                      className="w-full h-full object-cover rounded-full select-none pointer-events-none"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* 底部小裝飾 */}
          <div className="hidden md:block mt-auto pb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#C29355]"></div>
          </div>
        </div>

        {/* ==========================================
            中央與右側：轉場動畫視窗 (GSAP 託管區域)
            高度在桌上型限制為 80vh (~680px)
            ========================================== */}
        <div 
          ref={containerRef}
          className="col-span-12 md:col-span-11 h-[480px] md:h-[620px] lg:h-[680px] relative overflow-hidden bg-[#FDFAF6]"
          id="waiter-parallaxs-viewport"
        >
          {visibleViews.map((viewsItem) => {
            const waiter = waiters[viewsItem.index];
            const isIncoming = viewsItem.isIncoming;
            
            return (
              <div
                key={viewsItem.key}
                data-view-key={viewsItem.key}
                className="absolute inset-0 w-full h-full bg-[#FDFAF6] flex flex-col justify-between"
                style={{
                  zIndex: isIncoming ? 10 : 1,
                  opacity: 1 // 保持為 1，避免與 GSAP 的 ctx.revert() 產生還原衝突而導致轉場後消失
                }}
              >
                
                {/* 轉場前緣 6px 森林綠滿高色條 (進入側帶，就位後保留在最左邊) */}
                <div className={`absolute top-0 bottom-0 w-[6px] bg-[#0B2415] z-45 ${
                  viewsItem.direction === 'forward' ? 'left-0' : 'right-0'
                }`} />

                {/* 內層視差內容包裝袋 */}
                <div className="parallax-content w-full h-full relative flex flex-col justify-between p-6 md:p-12 lg:p-16 select-text">
                  
                  {/* ====== 上側：店名小標 ====== */}
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 z-20">
                    
                    {/* 左上店名 */}
                    <div className="space-y-1 text-left transition-stagger select-none">
                      <span className="font-mono text-[10px] md:text-[11px] font-semibold text-[#0B2415] tracking-[0.25em] block leading-none">
                        AMBER & PETAL
                      </span>
                      <span className="font-mono text-[9px] md:text-[10px] text-[#C29355] tracking-[0.2em] block leading-none">
                        SHADOWS ATELIER
                      </span>
                    </div>

                  </div>

                  {/* ====== 中間主體：文字層、立繪與對話泡泡 ====== */}
                  <div className="grid grid-cols-1 md:grid-cols-12 items-center flex-1 w-full gap-4 md:gap-0 mt-4 md:mt-0">
                    
                    {/* 1. 左側(5欄)：大英文名字底圖與實心文字群、自介 */}
                    <div className="col-span-12 md:col-span-6 flex flex-col justify-center text-left relative z-10 h-full mt-4 md:mt-0">
                      
                      {/* 後層：超大空心描邊描線字 */}
                      <div 
                        className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 font-mono text-[11vw] md:text-[8.5vw] font-black uppercase select-none pointer-events-none opacity-15 leading-none"
                        style={{
                          WebkitTextStroke: '1px #0B2415',
                          color: 'transparent'
                        }}
                      >
                        {waiter.englishName}
                      </div>

                      {/* 前層內容 */}
                      <div className="relative pl-2 md:pl-4 space-y-4 md:space-y-5">
                        
                        {/* 服務標籤列 (細框精緻小膠囊，移至名前空白處) */}
                        <div className="flex flex-wrap items-center gap-2 transition-stagger mb-2">
                          {waiter.services.map((service, sIdx) => (
                            <span 
                              key={sIdx}
                              className="px-2.5 py-1 border border-[#0B2415]/15 bg-white text-gray-600 font-serif text-[11px] md:text-[12px] tracking-wider rounded-none flex items-center gap-1.5 select-none shadow-[sm_0_1px_2px_rgba(0,0,0,0.01)]"
                            >
                              <span className="w-1 h-1 rounded-full bg-[#C29355] inline-block"></span>
                              {service}
                            </span>
                          ))}
                        </div>

                        <div className="transition-stagger">
                          <span className="font-mono text-[11px] md:text-[12px] text-[#C29355] tracking-[0.3em] font-semibold block uppercase">
                            // STAFF ATELIER MEMBER
                          </span>
                          <h2 className="font-serif text-[42px] md:text-[56px] font-bold text-[#0B2415] tracking-widest mt-1 md:mt-2 leading-tight">
                            {waiter.name}
                          </h2>
                        </div>

                        {/* 直線分隔裝飾 */}
                        <div className="w-12 h-[2px] bg-[#C29355] transition-stagger"></div>

                        {/* 兩到三行優雅自介 */}
                        <p className="font-serif text-[14px] text-gray-600 leading-relaxed md:leading-loose tracking-widest max-w-sm transition-stagger">
                          {waiter.bio}
                        </p>

                      </div>
                    </div>

                    {/* 2. 右側(6欄)：去背立繪 + 裝飾大金圓 + 對話泡泡 */}
                    <div className="col-span-12 md:col-span-6 h-[260px] md:h-full relative flex items-end justify-center md:justify-end md:pr-12 lg:pr-16">
                      
                      {/* 背景圓扁：#C29355 透明度 0.18, 直徑為立繪高度75% */}
                      <div className="backing-circle absolute bottom-1/2 translate-y-1/2 md:bottom-2 lg:bottom-4 left-1/2 md:left-auto md:right-[5%] lg:right-[10%] w-[180px] h-[180px] md:w-[320px] md:h-[320px] lg:w-[380px] lg:h-[380px] bg-[#C29355] rounded-full opacity-18 select-none pointer-events-none z-1" />

                      {/* 立繪畫布 (object-contain, 底部對齊) —— 為了整體美感，此處照片配合要求暫時留白 */}
                      <div className="relative h-full w-[240px] md:w-[340px] lg:w-[400px] flex items-end justify-center z-5">
                        {/* 留白（可供後續隨時填入去背立繪） */}
                      </div>

                      {/* 對話泡泡：絕對定位，立繪右上 */}
                      <div className="quote-bubble absolute top-2 md:top-[12%] right-[5%] md:right-0 bg-white border border-[#0B2415] px-4.5 py-3 rounded-none max-w-[180px] md:max-w-[260px] shadow-[6px_6px_0_rgba(11,36,21,0.04)] z-20 text-left">
                        {/* 對話小箭頭 (不使用SVG，使用純CSS三角直角) */}
                        <div className="absolute bottom-[-6px] left-8 w-2.5 h-2.5 bg-white border-b border-r border-[#0B2415] rotate-45 z-10"></div>
                        
                        <div className="relative">
                          <span className="font-serif italic text-xs md:text-[13.5px] leading-snug font-medium text-[#0B2415] tracking-wide block">
                            {waiter.quote}
                          </span>
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* ====== 下側：右下角裝飾條碼與小英文字 ====== */}
                  <div className="flex justify-end items-end select-none z-20 pt-2 border-t border-[#0B2415]/5">
                    
                    {/* 假條碼樣式 */}
                    <div className="text-right transition-stagger opacity-80 scale-90 md:scale-100 flex items-center gap-3">
                      
                      {/* 仿條碼 */}
                      <div className="flex items-center h-4 gap-[2px]">
                        <div className="w-[1px] h-full bg-[#0B2415]"></div>
                        <div className="w-[3px] h-full bg-[#0B2415]"></div>
                        <div className="w-[1px] h-full bg-[#0B2415]"></div>
                        <div className="w-[1px] h-full bg-[#0B2415]"></div>
                        <div className="w-[2px] h-full bg-[#0B2415]"></div>
                        <div className="w-[4px] h-full bg-[#0B2415]"></div>
                        <div className="w-[1px] h-full bg-[#0B2415]"></div>
                        <div className="w-[2px] h-full bg-[#0B2415]"></div>
                      </div>

                      <div className="flex flex-col text-right font-mono text-[8px] md:text-[9.5px]">
                        <span className="text-[#0B2415]/75 font-semibold tracking-widest uppercase">
                          AMBER & PETAL © 2026
                        </span>
                        <span className="text-[#C29355] tracking-widest text-[7.5px] -mt-0.5">
                          ATELIER PATRON SPEC.
                        </span>
                      </div>

                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>
        
      </div>
    </div>
  );
};
