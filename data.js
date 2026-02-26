const D2R_DATA = {
    uniques: {
        title: "暗金裝備保留指南",
        desc: "全面收錄值得保留的暗金裝備，包含飾品、防具、武器等所有部位之精華。",
        items: [
            // 飾品與珠寶
            { category: "項鍊", name: "馬拉的萬花筒", stats: "抗性 25~30", note: "法系畢業項鍊，30抗最貴。", tag: "high" },
            { category: "項鍊", name: "大軍之怒", stats: "攻速、致命一擊", note: "物理職業終極項鍊，後期標配。", tag: "keep" },
            { category: "項鍊", name: "亞特瑪的聖甲蟲", stats: "傷害加深咒語", note: "物理職業破物免神器。", tag: "keep" },
            { category: "項鍊", name: "貓眼", stats: "攻速、跑速", note: "亞馬遜/物理職業重要裝備。", tag: "keep" },
            { category: "戒指", name: "喬丹之石 (SOJ)", stats: "必留", note: "法系神戒，召喚地表暗黑標的物。", tag: "high" },
            { category: "戒指", name: "烏鴉之霜", stats: "敏捷 20 / 準確 240+", note: "無法冰凍，敏捷/準確滿值最貴。", tag: "keep" },
            { category: "戒指", name: "布爾凱索之戒 (BK)", stats: "技能、吸血", note: "物理系常用技能戒。", tag: "keep" },
            { category: "珠寶", name: "彩虹刻面 (電)", stats: "5/5 滿值", note: "電系最貴；「死珠」優於「生珠」。", tag: "high" },

            // 盾牌
            { category: "盾牌", name: "撒卡蘭姆的使者", stats: "180%+ ED / 無形", note: "飾金盾，190%+ 為優質。", tag: "high" },
            { category: "盾牌", name: "暴風之盾", stats: "35% 物理減傷", note: "物免盾。物理職業、盾丁畢業盾。", tag: "keep" },
            { category: "盾牌", name: "魔胎 (HOM)", stats: "180%~200% ED", note: "死靈盾，200% ED 最貴。", tag: "keep" },
            { category: "盾牌", name: "魔力造生", stats: "3/3/3 技能", note: "極稀有，三系皆 3 才有高價值。", tag: "high" },

            // 頭盔
            { category: "頭盔", name: "諧角之冠", stats: "防禦 141 (滿值)", note: "俗稱軍帽。後期刷寶標配。", tag: "keep" },
            { category: "頭盔", name: "安達利爾的面貌", stats: "無形 / 10%吸血 / 30力", note: "俗稱安頭。傭兵終極神裝。", tag: "high" },
            { category: "頭盔", name: "格里風之眼", stats: "-20%電抗 / +15%電傷", note: "電系終極頭盔，極品天價。", tag: "high" },
            { category: "頭盔", name: "吸血鬼目光", stats: "15%~20% 減傷", note: "鬼頭。傭兵或物理職業頂級減傷選。", tag: "keep" },
            { category: "頭盔", name: "亞瑞特的面容", stats: "180%+ ED", note: "飛機頭。無形版身價極高。", tag: "keep" },

            // 盔甲
            { category: "盔甲", name: "海蛇皮甲", stats: "35全抗 / 13MDR", note: "法系畢業級，35抗滿值最優。", tag: "keep" },
            { category: "盔甲", name: "都瑞爾的殼", stats: "無形 / 200% ED", note: "蟲殼。無形版為傭兵神裝。", tag: "keep" },
            { category: "盔甲", name: "謝夫特斯得", stats: "無形 / 30% 減傷", note: "綿羊毛皮。無形高防版天價。", tag: "high" },
            { category: "盔甲", name: "斯寇德的憤怒", stats: "無形 / 高防", note: "頂級 MF 裝，無形具自動修復。", tag: "special" },

            // 手套、腰帶與鞋子
            { category: "手套", name: "運氣守護", stats: "40% MF 滿值", note: "頂 MF 手套。", tag: "keep" },
            { category: "手套", name: "法師拳", stats: "30% ED 滿值", note: "法系必備，頂 ED 才值錢。", tag: "keep" },
            { category: "手套", name: "德古拉之握", stats: "15力 / 10%吸血", note: "打火炬必備「偷取生命」。", tag: "keep" },
            { category: "手套", name: "碎鋼", stats: "60% ED / 20力", note: "物理畢業，極難掉落。", tag: "high" },
            { category: "腰帶", name: "蜘蛛之網", stats: "110%+ ED", note: "技能腰。法系畢業裝。", tag: "high" },
            { category: "腰帶", name: "維爾登戈的心結", stats: "15% 減傷 / 40 體力", note: "心結。15/40 數值最頂。", tag: "high" },
            { category: "腰帶", name: "長耳之串", stats: "15% 減傷 / 8% 吸血", note: "物理 survivability 優選。", tag: "keep" },
            { category: "腰帶", name: "雷神之力", stats: "必留", note: "吸電加抗，打魂神器。", tag: "keep" },
            { category: "鞋子", name: "戰爭旅者", stats: "50% MF 滿值", note: "戰旅。刷寶極品。", tag: "high" },
            { category: "鞋子", name: "蝕肉騎士", stats: "180%+ ED", note: "物理職業必備神鞋。", tag: "keep" },
            { category: "鞋子", name: "沙暴之旅", stats: "無形 / 15力/體", note: "無形 15/15 價值最高。", tag: "high" },

            // 武器
            { category: "武器", name: "死亡深度", stats: "冰傷 20%~30%", note: "次元碎片。冰法終極天價武器。", tag: "high" },
            { category: "武器", name: "死亡之網", stats: "+2 技 / -50% 毒抗", note: "破隱法杖。毒系死靈天價神兵。", tag: "high" },
            { category: "武器", name: "風之力", stats: "8% 吸法 / 稀有", note: "物理弓馬經典神弓。", tag: "high" },
            { category: "武器", name: "眼球 (The Oculus)", stats: "必留", note: "法師經典神器。", tag: "keep" },
            { category: "武器", name: "泰坦的復仇", stats: "無形 / 180%+ ED", note: "標馬標配，無形最貴。", tag: "keep" },
            { category: "武器", name: "死神喪鐘", stats: "無形 / 220%+ ED", note: "觸發衰老，無形版天價。", tag: "high" },
            { category: "武器", name: "盜墓者", stats: "3 洞 / 無形", note: "狂怒德神兵，無形 3 洞為天價。", tag: "high" },
            { category: "武器", name: "惡魔機弩", stats: "必留", note: "強化法師畢業武器。", tag: "special" }
        ]
    },
    bases: {
        title: "有價底材篩選指南",
        desc: "製作符文之語 (Runewords) 時最常用的有價底材。",
        items: [
            { category: "物理武器", name: "巨鷹爪 / 符紋爪", stats: "+3 鳳凰攻擊", note: "馬賽克 (Mosaic) 神級底材。鳳凰 3 必備。", tag: "high" },
            { category: "物理武器", name: "幻化之刃", stats: "15% ED / 3, 4, 5 洞", note: "悔恨、最後希望之選。", tag: "keep" },
            { category: "物理武器", name: "狂戰斧", stats: "無形 / 15% ED", note: "死神、悔恨優質底材。", tag: "keep" },
            { category: "弓箭", name: "主母之弓", stats: "+3 技能 / 4 洞 / 15% ED", note: "信心 (Faith) 頂級底材。", tag: "high" },
            { category: "長柄", name: "巨型斬鐮", stats: "4/5洞 / 無形", note: "無限、靈光。頂級無形底材。", tag: "high" },
            { category: "聖騎盾", name: "神聖小盾 (ST)", stats: "全抗 40~45", note: "精神 (Spirit) 畢業底材。", tag: "high" },
            { category: "聖騎盾", name: "漩渦盾 (無形)", stats: "全抗 40~45", note: "流亡 (Exile) 專用天價底材。", tag: "special" },
            { category: "防具", name: "法師鎧甲", stats: "3洞 / 15% ED", note: "謎團 (Enigma) 最熱門底材。", tag: "keep" },
            { category: "防具", name: "統御者鎧甲", stats: "3/4洞 / 15% ED", note: "剛毅、謎團熱門選擇。", tag: "keep" },
            { category: "法杖", name: "戰鬥/長者/統御", stats: "+3 能量護盾 (ES)", note: "撐 ES 用 (記憶)。", tag: "special" }
        ]
    },
    sets: {
        title: "套裝保留指南",
        desc: "具有高價值的單件與特定用途之實用全套。",
        items: [
            { category: "高價值單件", name: "安置手 (門徒)", stats: "350% 對惡魔傷害 / 50% 火抗", note: "物理系畢業手套。", tag: "keep" },
            { category: "高價值單件", name: "吉永之臉 (孤兒)", stats: "35% 壓碎打擊 (CB) / 15% 致命", note: "物理系神頭，打王必備。", tag: "keep" },
            { category: "高價值單件", name: "艾爾多的成長", stats: "50% 火抗 / 50生命", note: "補抗性與生命的神鞋。", tag: "keep" },
            { category: "高價值單件", name: "塔格奧的手套", stats: "20% FCR / 30% 毒傷", note: "法系通用，毒死靈必備。", tag: "keep" },
            { category: "高價值單件", name: "解迷杖 (納吉)", stats: "傳送聚氣 69 次", note: "副手必備，拓荒神器。", tag: "keep" },
            { category: "高價值單件", name: "天使之翼 (項鍊+戒指)", stats: "兩件套組", note: "提供海量準確率 (AR)。", tag: "keep" },
            { category: "實用全套", name: "塔拉夏的法衣", stats: "漆甲 / 項鍊 是重點", note: "MF 刷寶標配，法師穩定選擇。", tag: "high" },
            { category: "實用全套", name: "不朽之王 (IK)", stats: "胸甲最難掉", note: "野蠻人穩定的通關選擇。", tag: "special" },
            { category: "實用全套", name: "娜塔亞地圖騰", stats: "武器最稀有", note: "全套高物理減傷，自用強悍。", tag: "special" }
        ]
    },
    rings: {
        title: "稀有戒指鑑定基準",
        desc: "玩家提供的高階鑑定公式，幫助你從大量黃戒中篩選天價極品。",
        items: [
            {
                category: "法系 (FCR)",
                name: "10% FCR 高施戒",
                stats: "必備: 10% FCR\\n精華: 15-20力 / 10-15敏\\n其他: 8-11全抗 / 30-40生命",
                note: "公式: 10% FCR + (力/敏) + (全抗/高單抗) = 交易級神戒。",
                tag: "high"
            },
            {
                category: "物理 (雙吸)",
                name: "雙吸神戒",
                stats: "吸法: 5-6% / 吸血: 7-8%\\n準確: 80-120\\n屬性: 15力 / 10敏 以上",
                note: "公式: 雙吸 + 高 AR + 高力量/全抗 = 天價極品。",
                tag: "high"
            },
            {
                category: "鑑定懶人包",
                name: "【組合 A】",
                stats: "10 FCR / 15+ 力量 / 10+ 全抗",
                note: "法系萬用小神戒。",
                tag: "high"
            },
            {
                category: "鑑定懶人包",
                name: "【組合 B】",
                stats: "10 FCR / 30+ 生命 / 10+ 全抗 / 60+ 法力",
                note: "撐血撐法法系神戒。",
                tag: "high"
            },
            {
                category: "鑑定懶人包",
                name: "【組合 C】",
                stats: "6% 吸魔 / 8% 吸血 / 10+ 全抗",
                note: "物理職業畢業級。雙吸 + 抗性。",
                tag: "high"
            }
        ]
    },
    charms: {
        title: "咒符與破免之謎",
        desc: "包含 2.5 版本破免咒符與傳統生抗板。",
        items: [
            { category: "破免咒符", name: "寒冰破綻 (冰破)", stats: "-70% 敵人抗性 (最優)", note: "冰法核心。數值越低越貴。", tag: "keep" },
            { category: "破免咒符", name: "天裂之隙 (電破)", stats: "-70% 敵人抗性 (最優)", note: "電系職業標配。", tag: "keep" },
            { category: "破免咒符", name: "骨骸中斷 (物破)", stats: "敵人受傷 +10% (最優)", note: "物理職業破免用。", tag: "keep" },
            { category: "傳統咒符", name: "技能板", stats: "41-45 生命", note: "特大板天價極品。", tag: "high" },
            { category: "傳統咒符", name: "20生命 / 5全抗", stats: "小型咒符", note: "市場需求最穩定的高價物。", tag: "high" },
            { category: "傳統咒符", name: "3/20/20 小板", stats: "3大傷 / 20準確 / 20生命", note: "物理系神級小板。", tag: "high" }
        ]
    }
};
