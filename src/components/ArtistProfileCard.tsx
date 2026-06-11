import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Maximize2, Coins, Palette, Sparkles, AlertCircle } from 'lucide-react';

export interface ArtistProfile {
  name: string;
  englishName: string;
  bio: string;
  avatarUrl: string;
  specialties: string[];
  commissionStatus: 'open' | 'queue' | 'closed';
  portfolio: { url: string; title: string }[];
  priceList: { item: string; price: string }[];
  ongoing: { thumbUrl: string; stage: '草稿' | '線稿' | '上色' | '完成' }[];
}

export interface ArtistProfileCardProps {
  profile: ArtistProfile;
  onPortfolioClick?: (item: { url: string; title: string }, index: number) => void;
}

export function ArtistProfileCard({ profile, onPortfolioClick }: ArtistProfileCardProps) {
  // Built-in lightbox state for portfolio images
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);

  // Status mapping helper
  const getStatusConfig = (status: 'open' | 'queue' | 'closed') => {
    switch (status) {
      case 'open':
        return {
          label: '開放委託 (Open)',
          badgeClass: 'border-emerald-200 text-emerald-800 bg-emerald-50/50',
          dotClass: 'bg-emerald-500',
        };
      case 'queue':
        return {
          label: '委託排單中 (Queue)',
          badgeClass: 'border-[#C29355]/30 text-[#C29355] bg-amber-50/30',
          dotClass: 'bg-[#C29355]',
        };
      case 'closed':
        return {
          label: '委託暫停 (Closed)',
          badgeClass: 'border-gray-200 text-gray-500 bg-gray-50',
          dotClass: 'bg-gray-400',
        };
    }
  };

  const statusConfig = getStatusConfig(profile.commissionStatus);

  return (
    <div id="artist-profile-card-container" className="w-full bg-[#FDFAF6] border border-gray-200 p-6 md:p-8 rounded-none relative">
      {/* Structural layout: 12-column grid on desktop, stacked on mobile */}
      <div className="grid grid-cols-12 gap-8 lg:gap-10 items-stretch">
        
        {/* 1. Left Column (approx 3 of 12 columns): 3:4 aspect illustration/portrait */}
        <div className="col-span-12 md:col-span-12 lg:col-span-3 flex flex-col justify-between">
          <div className="relative overflow-hidden group border border-gray-200 rounded-none bg-[#FDFAF6] aspect-[3/4] w-full">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter saturate-[0.85] contrast-[1.02]"
            />
            {/* Soft overlay gradient on image bottom */}
            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* 2. Central Column (approx 4 of 12 columns): Name, Bio, Tags, and Status badge */}
        <div className="col-span-12 md:col-span-7 lg:col-span-4 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            {/* Category / Role Label */}
            <span className="text-[10px] text-[#C29355] font-mono tracking-[0.3em] uppercase block">
              [ HOUSE SCRIBE / 執筆者 ]
            </span>

            {/* Artist title & name group */}
            <div className="space-y-1">
              <h3 className="font-serif text-3xl font-normal text-gray-950 tracking-widest leading-tight">
                {profile.name}
              </h3>
              <p className="font-mono text-xs text-[#C29355] tracking-[0.2em] font-semibold uppercase">
                {profile.englishName}
              </p>
            </div>

            {/* Brief Introduction */}
            <div className="border-l-2 border-[#C29355]/20 pl-4 py-1">
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed text-justify font-light">
                {profile.bio}
              </p>
            </div>

            {/* Specialty tag capsules */}
            <div className="space-y-2">
              <span className="font-mono text-[9px] text-gray-400 uppercase tracking-widest block">
                SPECIALIST FIELDS / 擅長學門
              </span>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {profile.specialties.map((spec, sIdx) => (
                  <span
                    key={spec}
                    className="px-2.5 py-1 bg-white border border-gray-200 text-gray-600 font-serif text-[10px] tracking-wide rounded-none flex items-center gap-1 select-none"
                  >
                    <Palette size={10} className="text-[#C29355]/70" />
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Underneath status badge */}
          <div className="pt-4 border-t border-gray-100 mt-auto">
            <span className="font-mono text-[9px] text-gray-400 uppercase tracking-widest block mb-2">
              COMMISSION STATUS / 委託狀態
            </span>
            <div className={`inline-flex items-center gap-2 border px-3 py-1 rounded-none text-xs font-serif tracking-widest ${statusConfig.badgeClass}`}>
              {/* Pulsing breathing dot */}
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusConfig.dotClass}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${statusConfig.dotClass}`}></span>
              </span>
              <span>{statusConfig.label}</span>
            </div>
          </div>
        </div>

        {/* 3. Right Column (approx 3 of 12 columns): Portfolio 2x2 & Price List card */}
        <div className="col-span-12 md:col-span-5 lg:col-span-3 flex flex-col justify-between space-y-6">
          {/* Upper Mini-Card: Portfolio */}
          <div className="bg-white border border-gray-200/80 p-4 rounded-none space-y-3">
            <span className="font-serif text-[11px] font-semibold tracking-widest text-[#C29355] border-b border-gray-100 pb-1.5 block uppercase">
              🎨 作品參考 / Portfolio
            </span>
            {/* 2x2 Thumbnail Grid */}
            <div className="grid grid-cols-2 gap-2">
              {profile.portfolio.slice(0, 4).map((img, idx) => (
                <div
                  key={img.url + idx}
                  onClick={() => {
                    setSelectedImage(img);
                    if (onPortfolioClick) onPortfolioClick(img, idx);
                  }}
                  className="aspect-square relative group overflow-hidden bg-gray-50 border border-gray-100 rounded-none cursor-zoom-in"
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108 filter saturate-[0.9]"
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Maximize2 size={12} className="text-[#FDFAF6]" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lower Mini-Card: Price List */}
          <div className="bg-[#0B2415] border border-gray-800 p-4 rounded-none space-y-3">
            <span className="font-serif text-[11px] font-semibold tracking-widest text-[#C29355] border-b border-emerald-950 pb-1.5 block uppercase flex items-center gap-1">
              <Coins size={12} className="text-[#C29355]" />
              委託價目 / Price Book
            </span>
            <div className="space-y-2">
              {profile.priceList.map((pi, pIdx) => (
                <div
                  key={pi.item + pIdx}
                  className="flex justify-between items-center text-xs pb-1.5 border-b border-emerald-900/40 last:border-0 last:pb-0 font-light"
                >
                  <span className="text-[#FDFAF6]/80 font-serif text-[11px]">
                    {pi.item}
                  </span>
                  <span className="font-mono text-[#C29355] font-semibold pl-2">
                    {pi.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Rightmost Column (approx 2 of 12 columns): Ongoing pipeline bar */}
        <div className="col-span-12 md:col-span-12 lg:col-span-2 border-t md:border-t-0 lg:border-l border-gray-100 lg:pl-6 pt-4 lg:pt-0 flex flex-col justify-between">
          <span className="font-serif text-[10px] font-semibold tracking-widest text-[#C29355] uppercase select-none block pb-3 text-left lg:text-right w-full">
            [ PROCESS / 進度展示 ]
          </span>

          {/* Horizontal layout on mobile/tablet, vertical stack on desktop */}
          <div className="flex lg:flex-col gap-3.5 py-2 overflow-x-auto scrollbar-none lg:overflow-visible items-center lg:items-end justify-start lg:justify-end mt-auto w-full">
            {profile.ongoing.map((wk, idx) => (
              <div
                key={wk.thumbUrl + idx}
                className="relative group shrink-0 w-24 md:w-20 lg:w-full lg:max-w-[120px] aspect-[3/4] bg-gray-50 border border-gray-200 rounded-none overflow-hidden"
              >
                {/* Purposely blurred preview image */}
                <img
                  src={wk.thumbUrl}
                  alt={`Ongoing #${idx}`}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-all duration-300 filter blur-[3px] group-hover:blur-0 scale-[1.05]"
                />
                
                {/* Progress stage badge overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-black/60 text-[10px] text-[#FDFAF6] text-center font-serif leading-relaxed font-light py-1 tracking-wider select-none">
                  {wk.stage}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Built-in Lightbox Modal using Framer Motion */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2415]/90 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative max-w-3xl w-full bg-[#FDFAF6] border border-gray-200 p-3 rounded-none overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-gray-900 bg-white/80 hover:bg-white border border-gray-200 rounded-none transition-colors z-10"
              >
                <X size={16} />
              </button>

              <div className="aspect-[4/3] w-full overflow-hidden border border-gray-100">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  className="w-full h-full object-cover filter saturate-[0.9]"
                />
              </div>

              {selectedImage.title && (
                <div className="mt-3 flex items-center justify-between">
                  <p className="font-serif text-sm font-semibold tracking-wider text-gray-900">
                    {selectedImage.title}
                  </p>
                  <span className="text-[10px] text-[#C29355] font-mono tracking-widest uppercase">
                    [ ILLUSTRATION REF ]
                  </span>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Beautiful Faux Data matching the "森林草藥小屋 × 日系雜誌" theme perfectly */
export const DEMO_ARTISTS: ArtistProfile[] = [
  {
    name: '繆斯 · 暮澄',
    englishName: 'MUSE WOOD-WHISPER',
    bio: '隱居於帕格爾贊及黑衣森林交界處的拂曉畫師。擅長以精雕細琢的水彩工筆與植物墨汁，在厚重的古老植物手札上描繪草本。近期於「琥珀與花影」常駐，協助茶寮將每一季神選茶飲的繾綣香氣幻化為羊皮插圖。',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800',
    specialties: ['古拉多草藥手稿繪製', '乙太殘卷美學修復', '全彩冒險者肖像風'],
    commissionStatus: 'open',
    portfolio: [
      {
        url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800',
        title: '香草標本手跡（Sage study）'
      },
      {
        url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800',
        title: '薩雷安玻璃溫室 (Ancient Glasshouse)'
      },
      {
        url: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=800',
        title: '星曆與占星術（Astrology charts）'
      },
      {
        url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=800',
        title: '下午茶與野雛菊 (Sprouting Brew)'
      }
    ],
    priceList: [
      { item: '草本墨研究細部線稿', price: '⦗ 4,000 Gil ⦘' },
      { item: '羊皮紙植物志手札（全彩）', price: '⦗ 6,500 Gil ⦘' },
      { item: '冒險者神情肖像立繪（精緻）', price: '⦗ 13,000 Gil ⦘' },
      { item: '世界觀舞台大型概念圖', price: '⦗ 26,000 Gil ⦘' }
    ],
    ongoing: [
      {
        thumbUrl: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=300',
        stage: '完成'
      },
      {
        thumbUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=300',
        stage: '上色'
      },
      {
        thumbUrl: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=300',
        stage: '線稿'
      }
    ]
  },
  {
    name: '克朗 · 薰櫻',
    englishName: 'CHRONO YOSAKURA',
    bio: '出身遠東之國黃金鄉的流浪繪師。擅長結合和風重彩與水墨技法，捕捉人物的情緒流動。性格慵懶灑脫，平日喜愛在小屋二層靠窗處打瞌睡，唯有聞到「晨曦花影」的茶香時，才會提起硃砂筆記錄人世百態。',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
    specialties: ['東洋古風浮世重彩', '和風摺扇背景繪製', 'Ｑ版精靈使魔隨筆'],
    commissionStatus: 'queue',
    portfolio: [
      {
        url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=800',
        title: '密林白櫻 (Midnight Plum Blossoms)'
      },
      {
        url: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=800',
        title: '靜夜爐火 (The Hearth Logs)'
      },
      {
        url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800',
        title: '靈藥草本沖泡 (Elixir Drippings)'
      },
      {
        url: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=800',
        title: '不落雪之林 (Deep Evergreen)'
      }
    ],
    priceList: [
      { item: '黃金鄉精靈裝扮隨筆（黑白）', price: '⦗ 3,500 Gil ⦘' },
      { item: '和洋折衷流彩風背景手裝', price: '⦗ 7,000 Gil ⦘' },
      { item: '極彩風冒險者長捲軸（滿單）', price: '⦗ 15,000 Gil ⦘' }
    ],
    ongoing: [
      {
        thumbUrl: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=300',
        stage: '上色'
      },
      {
        thumbUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=300',
        stage: '線稿'
      }
    ]
  }
];
