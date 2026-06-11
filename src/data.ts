export interface MenuItem {
  id: string;
  name: string;
  englishName: string;
  price: string;
  category: 'tea' | 'confection' | 'elixir';
  desc: string;
}

export interface ChronicleItem {
  id: string;
  chapter: string;
  title: string;
  date: string;
  desc: string;
}

export interface StaffProfile {
  id: string;
  name: string;
  englishName: string;
  role: 'scribe' | 'lantern';
  title: string;
  avatarUrl: string;
  quote: string;
  bio: string;
  specialty: string[];
  astrologySign?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const WINDOW_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
    title: '窗櫺暮色 (Dusk Window)',
    desc: '日光在橡木桌上拉出斜影，乾燥尤加利散發著微苦的療癒氣息。'
  },
  {
    url: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=800',
    title: '琥珀標本 (Amber Apothecary)',
    desc: '收納了古舊拉諾西亞香草的精油瓶，在夕陽下折射出金黃色澤。'
  },
  {
    url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=800',
    title: '茶香漫步 (Botanical Steeping)',
    desc: '沸水注入 Sharlayan 銀葉，熱氣中蒸騰出迷迭香與野雛菊的合奏。'
  },
  {
    url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=800',
    title: '密林晨曦 (Gridanian Morning)',
    desc: '穿透黑衣森林繁茂枝葉的第一道光，照亮了懸掛在樑上的風乾洋甘菊。'
  },
  {
    url: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=800',
    title: '花影微瀾 (Petal Stains)',
    desc: '落在陳舊皮質書籍上的白色洋槐花，將歲月染上淡淡的墨香與甜味。'
  }
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'm1',
    name: '琥珀之淚',
    englishName: 'Tears of Amber',
    price: '⦗ 400 Gil ⦘',
    category: 'tea',
    desc: '選用黑衣森林特產的甜楓樹汁凝露調和高山紅茶，茶湯呈現澄澈的琥珀色，入口帶有溫潤的煙燻焦糖香。'
  },
  {
    id: 'm2',
    name: '晨曦花影',
    englishName: 'Dawn Petal Shadows',
    price: '⦗ 450 Gil ⦘',
    category: 'tea',
    desc: '以薩雷安空運而來的薰衣草、洋甘菊為基底，佐以曬乾的星辰花瓣，帶給人極度放鬆的安神花香。'
  },
  {
    id: 'm3',
    name: '白銀鄉櫻落',
    englishName: 'Shirogane Sakura Steep',
    price: '⦗ 480 Gil ⦘',
    category: 'tea',
    desc: '遠東之國的醃漬櫻花辦隨熱氣舒展，湯色呈極淡微粉，微鹹中帶有甘甜的米蜜香氣，口感新穎。'
  },
  {
    id: 'm4',
    name: '密林晚鐘',
    englishName: 'Deepwood Vesper Chimes',
    price: '⦗ 500 Gil ⦘',
    category: 'tea',
    desc: '厚實的烏龍烘焙茶，融入迷迭香與丁香碎屑，強烈的草本與木質香氣堆疊，彷彿林中迴盪的微雨晚鐘。'
  },
  {
    id: 'm5',
    name: '花影水信玄餅',
    englishName: 'Petal Infused Agar Jelly',
    price: '⦗ 350 Gil ⦘',
    category: 'confection',
    desc: '剔透似水晶的球體中凝固著一整朵粉白櫻桃花，搭配自製的琥珀糖漿與研磨黃豆粉，如夢似幻。'
  },
  {
    id: 'm6',
    name: '苔岩抹茶生乳酪',
    englishName: 'Mossy Rock Matcha Cheesecake',
    price: '⦗ 380 Gil ⦘',
    category: 'confection',
    desc: '重乳酪的濃郁中融入了微苦的極上抹茶，不規則的表面撒上翠綠粉末，仿真森林深處的濕潤青苔。'
  },
  {
    id: 'm7',
    name: '精靈之羽迷迭鬆餅',
    englishName: 'Sylphan Rosemary Scone',
    price: '⦗ 320 Gil ⦘',
    category: 'confection',
    desc: '烤得金黃酥脆的松餅，混入現折的香草植物葉片，搭配野莓楓糖漿，散發森林特有的清爽氣息。'
  },
  {
    id: 'm8',
    name: '黑衣深處的解憂藥劑',
    englishName: 'Gridanian Soothing Draught',
    price: '⦗ 520 Gil ⦘',
    category: 'elixir',
    desc: '盛放在精緻琥珀玻璃瓶中的草本蘇打。薄荷、青檸、接骨木花與微量精製蜂蜜，薄霧感氣泡在舌尖跳躍。'
  }
];

export const CHRONICLE_ITEMS: ChronicleItem[] = [
  {
    id: 'c1',
    chapter: 'Ch. 00',
    title: '枯葉與萌芽',
    date: '第六星曆・晚秋',
    desc: '我們在黑衣森林（Black Shroud）中央林區的一處廢棄護林員木屋停下腳步。這裡被苔蘚覆蓋，四周環繞著茂盛的古代蕨類。小屋的主人曾是位頑固的幻術皇部下，臨走前留下了滿牆乾枯的風乾藥草。我們決定整理這裡，取名為「琥珀與花影」。'
  },
  {
    id: 'c2',
    chapter: 'Ch. 01',
    title: '琥珀微光的聚集',
    date: '第六星曆・仲冬',
    desc: '我們點亮了黃銅油燈，微光穿透黑夜中的密林。冒險者與詩人開始踏足此地。在跳躍的燭光下，他們解下行囊，將收集到的薩維奈草藥、基拉巴尼亞乾燥花與我們交換。我們在筆記本中記下了第一張草本茶配方。'
  },
  {
    id: 'c3',
    chapter: 'Ch. 02',
    title: '花影蔓延之時',
    date: '第七靈災後・新綠季節',
    desc: '世界在陣痛中重建，但小屋的溫室奇蹟般地保存了下來。攀爬的常春藤爬滿了東側的天窗。我們正式設立了「植物讀寫專區」與「花影調香台」，旅人們在這裡不再只是過客，而是用角色人生共同澆灌這片靜謐的土壤。'
  },
  {
    id: 'c4',
    chapter: 'Ch. 03',
    title: '共生之林',
    date: '今日',
    desc: '作為 Odin 伺服器中最幽靜的 RP 植物咖啡與創作沙龍，琥珀小屋依然在每個週末靜靜營業。壁爐燃燒著北境冷杉，桌上攤開著精密的艾歐澤亞草本繪卷。我們在等一陣敲門聲，和下一篇屬於你的冒險詩章。'
  }
];

export const STAFF_PROFILES: StaffProfile[] = [
  {
    id: 's1',
    name: '艾莉亞·席爾菲',
    englishName: 'Aria Sylphie',
    role: 'scribe',
    title: '「草藥筆記者」兼 賢者 (Sage)',
    avatarUrl: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=600',
    quote: '「每一片枯萎的葉脈裡，都留存著拂曉日光親吻過的微溫。我負責將這些溫度，翻譯成紙上的墨痕。」',
    bio: '出生於格里達尼亞幻術部族，因對傳統幻術的教條感到疲倦而轉向賢者醫學與實物植物學的研究。隨身攜帶厚重的皮革手札與壓花板，性格溫和，對植物極度專注，在小屋中負責茶配方的調配與植物史誌的編纂。',
    specialty: ['草本診斷', '植物製圖', '賢醫生命學導論'],
    astrologySign: '雙子座 (雙子之神眷屬)'
  },
  {
    id: 's2',
    name: '尤里安·阿貝爾',
    englishName: 'Yulian Abel',
    role: 'scribe',
    title: '「密林編年史教授」兼 學者 (Scholar)',
    avatarUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=600',
    quote: '「香氣是轉瞬即逝的魔法，文字則是封存魔法的蠟印。在漫長的黑夜中，我們用歷史禦寒。」',
    bio: '曾任教於薩雷安（Sharlayan）神殿神學院，因沉迷於黑衣森林的古代植物神話而申請永久外訪。他帶著一隻名為「薄荷」的小精靈，會在壁爐旁慢條斯理地講述第六星曆的巨森與百合。執著於完美的古典鋼筆字，負責撰寫小屋的宣傳刊物。',
    specialty: ['古代艾歐澤亞植物學', '星曆歷史考察', '小精靈召喚護理'],
    astrologySign: '天蠍座 (沙利雅之印)'
  },
  {
    id: 's3',
    name: '瑟蕾斯蒂亞',
    englishName: 'Celestia Lantern-bearer',
    role: 'lantern',
    title: '「星座引路者」兼 占星術士 (Astrologian)',
    avatarUrl: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=600',
    quote: '「黑衣森林的霧氣很重，容易遮蔽前方的路。不過別擔心，星宿從未離去，而我的燈盞正為你長明。」',
    bio: '來自伊修加德的天空觀測者。在漫漫風雪中與星圖交談了十餘年後，她決定來到氣候溫和繁盛的小屋，擔任小屋的「掌燈人」。她會在庭院四周懸掛由純乙太充能的黃銅星座燈，並為心靈疲憊的旅人占卜命運的流向。',
    specialty: ['阿爾迪拉德天球占卜', '乙太恆燈保養', '夜空星軌辨識'],
    astrologySign: '雙魚座 (妮美雅之眼)'
  },
  {
    id: 's4',
    name: '羅蘭·德維爾',
    englishName: 'Roland de Ville',
    role: 'lantern',
    title: '「門扉夜守者」兼 騎士 (Paladin)',
    avatarUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=600',
    quote: '「風暴與荒蕪都將止步於這道門欄外。在『琥珀與花影』的世界，你可以安心地解下所有的武裝與偽裝。」',
    bio: '曾是烏爾達哈銀冑團的一員，退役後渴望尋求一片不被銅臭與爭鬥打擾的綠意。因此，他接受阿利亞的邀請，負責在深夜守護這座溫室別墅。雖然外表高大冷峻，實則善於烘焙松餅，並能細心地為脆弱的盆栽搭建防雨遮雨棚。',
    specialty: ['防禦壁壘構築', '黑衣森林安全導引', '重度手工松餅'],
    astrologySign: '金牛座 (阿爾迪雅神諭)'
  }
];

export const FAQS: FaqItem[] = [
  {
    id: 'f1',
    question: '「琥珀與花影 (Amber & Petal Shadows)」在哪個伺服器？該如何前往？',
    answer: '我們位於 Mana 數據中心的 Odin（奧丁）伺服器。店面具體地址在黑衣森林的「薰衣草苗圃（Lavender Beds）」別墅區第 28 區 46 號（大別墅）。旅人可直接傳送至格里達尼亞，前往薰衣草苗圃住宅區，或在玩家集聚地尋找我們的冒險者分部傳送。'
  },
  {
    id: 'f2',
    question: '這裡是一個怎樣的 Roleplay (RP) 空間？需要遵守哪些規則？',
    answer: '琥珀與花影致力於打造「精緻植物學、藥香與慢節奏創作」的硬核與休閒兼具 RP 氛圍。我們不提倡劇烈的戰鬥與喧嘩。請旅人遵守以下小屋禮儀：\n\n1. 進入時請將武器收起，並使用 /walk（步行）移動。\n2. 發言請遵循角色（IC）視角。若需進行現實對話，請使用括號（OOC）或密語。\n3. 請尊重其他旅人的創作空間，避免強行干擾他人正在進行的精緻 RP 對話。'
  },
  {
    id: 'f3',
    question: '非 RP 玩家（例如單純想參觀外觀或拍照的玩家）可以前來嗎？',
    answer: '非常歡迎！我們在非特定營業時段（即靜態開放期）提供「靜默造訪」。您可以自由在溫室中散步、在窗前閱讀拍照，但請不要在其他玩家進行 RP 時使用大範圍炫目技能或打擾他人。拍照時如果能標註「#琥珀與花影」，這會給小屋的執筆者們極大的鼓勵！'
  },
  {
    id: 'f4',
    question: '「雅事與今日菜單」的點餐機制是怎樣的？',
    answer: '每逢週五與週六深夜的「營業日（Open House）」，執筆者與掌燈人會在櫃檯親自接待。您可以根據今日黑板上的手寫配方與我們互動，我們會以精緻的文字 RP 描述調茶、斟茶及盛上點心的完整過程，將茶飲特有的溫度、香氣與魔法效果具體傳達。所得的 400 ~ 500 Gil 均為象徵性收費。'
  },
  {
    id: 'f5',
    question: '可以向「執筆者」或「掌燈人」委託故事創作或星座占卜嗎？',
    answer: '可以的！在營業日，凡是點選「晨曦花影」或「深林晚鐘」的旅人，皆可附帶一次簡短的「天球卡牌占卜」（由占星術士接待），或委託「植物手札壓花」（由賢者接待）。如果您有更長篇的角色故事想要紀錄，可以向學者尤里安遞交委託手稿，我們將不定期將旅人的故事整理編入「小屋紀事」中。'
  }
];

export const PETAL_PHOTOS = [
  {
    url: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=800',
    caption: '🌲 密林沉睡中的小屋一角 (Quiet Woods)',
    aspect: 'aspect-[3/4]',
    type: 'polaroid'
  },
  {
    url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800',
    caption: '☕ 注入乙太的微溫花草茶 (Infusing Eather)',
    aspect: 'aspect-square',
    type: 'polaroid'
  },
  {
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800',
    caption: '🌫️ 晨煙裊裊的黑衣深處 (Deepwood Haze)',
    aspect: 'aspect-[4/5]',
    type: 'polaroid'
  },
  {
    url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
    caption: '📜 草藥師的風乾筆記本 (Dried Leaf Studies)',
    aspect: 'aspect-[3/2]',
    type: 'full'
  },
  {
    url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800',
    caption: '✍️ 夜半燃燭的執筆手札 (深夜的精靈微光)',
    aspect: 'aspect-square',
    type: 'polaroid'
  },
  {
    url: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=800',
    caption: '✨ 掌燈人點亮的黃銅星空星座燈 (Astral Constellations)',
    aspect: 'aspect-[4/3]',
    type: 'full'
  }
];
