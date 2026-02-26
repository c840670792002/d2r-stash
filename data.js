const D2R_DATA = {
    uniques: {
        title: "暗金裝備保留指南",
        desc: "全面收錄所有值得保留的暗金裝備，並標註「底材 | 稀有度」。",
        items: [
            // 飾品與珠寶
            { category: "項鍊", name: "貓眼 (貓眼 | 飾品)", stats: "攻速、跑速", note: "亞馬遜/物理職業重要裝備。", tag: "keep" },
            { category: "項鍊", name: "亞特瑪的聖甲蟲 (亞特瑪 | 飾品)", stats: "傷害加深 詛咒", note: "物理職業破物免神器。", tag: "keep" },
            { category: "項鍊", name: "大軍之怒 (大軍 | 飾品)", stats: "攻速、致命一擊", note: "物理職業終極項鍊，後期標配。", tag: "keep" },
            { category: "項鍊", name: "馬拉的萬花筒 (馬拉 | 飾品)", stats: "抗性 25~30", note: "法系畢業項鍊，30抗最貴。", tag: "high" },
            { category: "項鍊", name: "金屬網格 (金屬網格 | 飾品)", stats: "抗性 30、準確率", note: "增加防禦與準確，高端物理職業使用。", tag: "special" },
            { category: "戒指", name: "拿各的戒指 (拿各 | 飾品)", stats: "MF 25%~30%", note: "30% 滿值才有交易價值。", tag: "special" },
            { category: "戒指", name: "喬丹之石 (喬丹 | 飾品)", stats: "必留", note: "法系神戒，召喚地表暗黑標的物。", tag: "high" },
            { category: "戒指", name: "烏鴉之霜 (烏鴉 | 飾品)", stats: "敏捷 20 / 準確 240+", note: "無法冰凍，敏捷/準確滿值最貴。", tag: "keep" },
            { category: "戒指", name: "布爾凱索之戒 (布戒 | 飾品)", stats: "技能、吸血", note: "物理系常用技能戒。", tag: "keep" },
            { category: "珠寶", name: "彩虹刻面 (彩虹刻面 | 飾品)", stats: "5/5 滿值 / 電系", note: "電系最貴；「死珠」優於「生珠」。", tag: "high" },

            // 盾牌
            { category: "盾牌", name: "摩西的祝福之環 (圓盾 | 卓越)", stats: "2 洞", note: "鑲嵌鑽石後為過渡神器。", tag: "special" },
            { category: "盾牌", name: "警戒之牆 (冷酷盾牌 | 卓越)", stats: "+1 全技能", note: "副手配戰招首選，低力量需求。", tag: "special" },
            { category: "盾牌", name: "黑橡樹盾 (月亮盾 | 精華)", stats: "冰冷吸收、高敏捷", note: "克制冰系專用。", tag: "special" },
            { category: "盾牌", name: "獵頭人的榮耀 (洞察之盾 | 精華)", stats: "3 洞 (滿洞)", note: "抗毒越高越好，具備交易價值。", tag: "special" },
            { category: "盾牌", name: "撒卡蘭姆的使者 (飾金盾牌 | 卓越)", stats: "180%+ ED / 無形", note: "飾金盾，190%+ 為優質。", tag: "high" },
            { category: "盾牌", name: "魔胎 (祭司印記 | 卓越)", stats: "180%~200% ED", note: "必留死靈盾，200% ED 最貴。", tag: "keep" },
            { category: "盾牌", name: "魔力造生 (血之王頭骨 | 精華)", stats: "3/3/3 技能", note: "極稀有，三系皆 3 才有高價值。", tag: "high" },
            { category: "盾牌", name: "塔亞馬特的斥責 (龍盾 | 卓越)", stats: "全抗 35% (滿值)", note: "俗稱龍盾。極優過渡與元素傷害盾。", tag: "special" },

            // 頭盔
            { category: "頭盔", name: "吸血鬼目光 (死神面具 | 卓越)", stats: "減傷 15% / 雙吸", note: "傭兵或物理職業頂級減傷選。", tag: "keep" },
            { category: "頭盔", name: "諧角之冠 (軍帽 | 精華)", stats: "防禦 141 (滿值)", note: "俗稱軍帽。後期刷寶標配。", tag: "keep" },
            { category: "頭盔", name: "安達利爾的面貌 (惡魔頭蓋骨面具 | 精華)", stats: "無形 / 10%吸血 / 30力", note: "俗稱安頭。傭兵終極神裝。", tag: "high" },
            { category: "頭盔", name: "格里風之眼 (權冠 | 精華)", stats: "-20%電抗 / +15%電傷", note: "電系終極頭盔，極品天價。", tag: "high" },
            { category: "頭盔", name: "亞瑞特的面容 (殺手防護面具 | 卓越)", stats: "180%+ ED / 6%吸血", note: "俗稱飛機頭。無形版身價極高。", tag: "keep" },
            { category: "頭盔", name: "奇拉的守護 (三重冠 | 精華)", stats: "抗性 65 以上", note: "無法冰凍，打火炬或給傭兵。", tag: "special" },

            // 盔甲
            { category: "盔甲", name: "海蛇皮甲 (蛇皮綢緞甲 | 卓越)", stats: "全抗 35 / 魔法減傷 13", note: "法系畢業級，35抗滿值最優。", tag: "keep" },
            { category: "盔甲", name: "都瑞爾的殼 (護胸甲 | 卓越)", stats: "無形 (Eth)", note: "無法冰凍，無形版為傭兵神裝。", tag: "keep" },
            { category: "盔甲", name: "謝夫特斯得 (網眼甲 | 卓越)", stats: "無形 / 220% ED", note: "30% 減傷，無形高防版天價。", tag: "high" },
            { category: "盔甲", name: "斯寇德的憤怒 (羅瑟戰甲 | 卓越)", stats: "無形 / 高防", note: "頂級 MF 裝，無形具自動修復。", tag: "special" },
            { category: "盔甲", name: "泰瑞爾的力量 (神聖戰甲 | 精華)", stats: "必留 (收藏用)", note: "最稀有暗金，最具觀賞價值。", tag: "收藏" },
            { category: "盔甲", name: "黃金之皮 (全面皮甲 | 卓越)", stats: "150% ED / 35全抗", note: "100%打錢與高全抗。", tag: "special" },

            // 手套、腰帶與鞋子
            { category: "手套", name: "運氣守護 (鎖鏈手套 | 普通)", stats: "MF 35%~40%", note: "40% 頂值具交易價值。", tag: "keep" },
            { category: "手套", name: "法師拳 (輕型鐵手套 | 普通)", stats: "30% ED (滿值)", note: "法系必備，頂 ED 才值錢。", tag: "keep" },
            { category: "手套", name: "德古拉之握 (吸血鬼骸骨手套 | 精華)", stats: "15力 / 10%吸血", note: "打火炬必備「偷取生命」。", tag: "keep" },
            { category: "手套", name: "碎鋼 (食人魔鐵手套 | 精華)", stats: "60% ED / 20力", note: "物理畢業，極難掉落。", tag: "high" },
            { category: "腰帶", name: "長耳之串 (魔皮勳帶 | 卓越)", stats: "15% 減傷 / 8% 吸血", note: "高減傷版本，物理 survivability。", tag: "keep" },
            { category: "腰帶", name: "雷神之力 (巨戰腰帶 | 卓越)", stats: "必留", note: "吸電/加抗上限，克魂神器。", tag: "keep" },
            { category: "腰帶", name: "蜘蛛之網 (蛛網腰帶 | 精華)", stats: "110%+ ED", note: "法系畢業裝。", tag: "high" },
            { category: "腰帶", name: "維爾登戈的心結 (秘銀腰帶 | 精華)", stats: "15% 減傷 / 40 體力", note: "15/40 數值最頂。", tag: "high" },
            { category: "鞋子", name: "戰爭旅者 (戰場之靴 | 卓越)", stats: "MF 45%~50%", note: "50% 滿值為極品。", tag: "high" },
            { category: "鞋子", name: "蝕肉騎士 (巨戰之靴 | 卓越)", stats: "180%+ ED", note: "物理職業必備神鞋。", tag: "keep" },
            { category: "鞋子", name: "沙暴之旅 (聖甲蟲殼靴 | 精華)", stats: "無形 / 15力/體", note: "無形 15/15 價值最高。", tag: "high" },
            { category: "鞋子", name: "骨髓行走 (骸骨靴 | 精華)", stats: "+2 支配骷髏", note: "必留 +2 技能版本。", tag: "special" },

            // 武器
            { category: "武器", name: "眼球 (渦流水晶 | 卓越)", stats: "必留", note: "初期神器。", tag: "keep" },
            { category: "武器", name: "死亡深度 (次元碎片 | 精華)", stats: "冰傷 20%~30%", note: "冰法終極天價武器。", tag: "high" },
            { category: "武器", name: "死亡之網 (破隱法杖 | 精華)", stats: "+2 技 / -50% 毒抗", note: "毒系死靈天價神兵。", tag: "high" },
            { category: "武器", name: "里奧瑞克王的手骨 (古墓之杖 | 卓越)", stats: "必留", note: "召喚死靈經典神器。", tag: "keep" },
            { category: "武器", name: "自殘之牙 (尖牙匕首 | 普通)", stats: "50% FCR / 必留", note: "拓荒極品，無形具交易價值。", tag: "keep" },
            { category: "武器", name: "泰坦的復仇 (祭典標槍 | 卓越)", stats: "無形 / 180% ED+", note: "標馬標配，無形最貴。", tag: "keep" },
            { category: "武器", name: "雷擊 (女傑標槍 | 精華)", stats: "+4 技能 / 190% ED", note: "純電傷標馬首選，必須 +4 技。", tag: "keep" },
            { category: "武器", name: "霸圖克的歌喉爪 (大爪 | 卓越)", stats: "無形 / 200% ED", note: "刺客標配，無形高 ED 有價值。", tag: "special" },
            { category: "武器", name: "風之力 (九頭蛇弓 | 精華)", stats: "8% 吸法 / 稀有度", note: "物理弓馬經典神弓。", tag: "high" },
            { category: "武器", name: "暴雪砲弩 (重弩 | 卓越)", stats: "200% ED", note: "俗稱砲渣。高穿透力。", tag: "keep" },
            { category: "武器", name: "惡魔機弩 (連發十字弩 | 卓越)", stats: "-", note: "強化法師畢業武器。", tag: "special" },
            { category: "武器", name: "狂巫之弦 (長圍弓 | 卓越)", stats: "170% ED / 2 洞", note: "物理馬優質選。", tag: "keep" },
            { category: "武器", name: "掠鴉之爪 (長弓 | 普通)", stats: "-", note: "內建爆炸箭，小號神兵。", tag: "special" },
            { category: "武器", name: "社角久子 (短攻城弓 | 卓越)", stats: "180% ED", note: "內建穿透與爆炸箭。", tag: "special" },
            { category: "武器", name: "血鴉之擊 (女傑之弓 | 精華)", stats: "+4 技 / 230% ED", note: "菁英級特定職業弓。", tag: "special" },
            { category: "武器", name: "巫師之刺 (骸骨匕首 | 精華)", stats: "必留", note: "50% FCR / 75全抗。", tag: "keep" },
            { category: "武器", name: "死神喪鐘 (銳利槍 | 精華)", stats: "無形 / 220% ED+", note: "觸發衰老，無形版天價。", tag: "high" },
            { category: "武器", name: "盜墓者 (神秘之斧 | 精華)", stats: "3 洞 / 無形", note: "物理狂怒德神兵，無形 3 洞為天價。", tag: "high" },
            { category: "武器", name: "水魔陷阱 (魔鬼之叉 | 卓越)", stats: "無形 / 75% 減速", note: "打王神物，建議保留無形版。", tag: "special" },
            { category: "武器", name: "骨寸斷 (三叉長槍 | 普通)", stats: "無形 / 45% CB / 3 洞", note: "物理輸出極佳。", tag: "special" },
            { category: "武器", name: "天堂之光 (強大的權杖 | 精華)", stats: "+3 技能 / 2 洞", note: "聖騎/盾丁優質選擇。", tag: "keep" },
            { category: "武器", name: "艾斯特龍的鐵衛 (神使之杖 | 精華)", stats: "+4 技能 / 滿準", note: "極難掉落之神兵。", tag: "high" },
            { category: "武器", name: "阿里巴巴彎刀 (圓月彎刀 | 普通)", stats: "無形 / 120% ED", note: "刷寶 (MF) 必備。", tag: "special" },
            { category: "武器", name: "痛苦之鎚 (戰鎚 | 卓越)", stats: "必留", note: "破防副手神器。", tag: "special" }
        ]
    },
    bases: {
        title: "有價底材篩選指南",
        desc: "製作符文之語 (Runewords) 時最常用的有價底材。",
        items: [
            { category: "刺客爪", name: "巨鷹爪 / 符紋爪", stats: "0 或 3 洞 / +3 鳳凰攻擊", note: "馬賽克 (Mosaic) 神級底材。鳳凰 3 必備。", tag: "high" },
            { category: "亞馬遜弓", name: "主母之弓", stats: "4 洞 / +3 技能 / 15% ED", note: "信心 (Faith) 頂級底材。", tag: "high" },
            { category: "亞馬遜弓", name: "女傑之弓", stats: "4 洞 / +3 技能", note: "信心 (Faith) 底材。", tag: "keep" },
            { category: "長柄武器", name: "巨型斬鐮", stats: "4 或 5 洞 / 無形", note: "無限、靈光。頂級無形底材。", tag: "high" },
            { category: "長柄武器", name: "斬鐮", stats: "4 或 5 洞 / 無形", note: "無限、靈光。優質無形底材。", tag: "keep" },
            { category: "單手劍", name: "幻化之刃", stats: "3, 4, 5 洞 / 15% ED", note: "悔恨、執法者、最後希望。", tag: "keep" },
            { category: "單手斧", name: "狂戰斧", stats: "3, 4, 5 洞 / 無形 / 15% ED", note: "悔恨、死神、野獸。", tag: "keep" },
            { category: "聖騎士盾", name: "神聖小盾 (ST)", stats: "0 或 4 洞 / 全抗 40~45", note: "精神 (Spirit) 畢業底材。", tag: "high" },
            { category: "聖騎士盾", name: "漩渦盾", stats: "0 或 4 洞 / 全抗 40~45 / 無形", note: "精神、流亡 (Exile)。", tag: "high" },
            { category: "精英鎧甲", name: "法師鎧甲", stats: "3 洞 / 15% ED", note: "謎團 (Enigma) 最熱門底材。", tag: "keep" },
            { category: "精英鎧甲", name: "統御者鎧甲", stats: "3 或 4 洞 / 15% ED", note: "剛毅、謎團熱門選擇。", tag: "keep" },
            { category: "精英鎧甲", name: "漆護 / 神聖戰甲", stats: "4 洞 / 無形", note: "剛毅用。基礎防禦 800-900+。", tag: "keep" },
            { category: "法師法杖", name: "戰鬥 / 長者 / 統御者", stats: "4 洞 / +3 能量護盾 (ES)", note: "製作「記憶」撐 ES 用。", tag: "special" },
            { category: "德魯伊", name: "皮帽系", stats: "3 洞 / +3 龍捲風", note: "搖曳火焰。+3 龍捲或火系技能。", tag: "keep" },
            { category: "野蠻人", name: "頭盔系", stats: "3 洞 / +3 戰吼", note: "迪勒瑞姆或收藏。", tag: "special" },
            { category: "死靈法師", name: "手杖系", stats: "0 或 2 洞 / +3 骨矛", note: "白色 (White) 底材。", tag: "keep" }
        ]
    },
    sets: {
        title: "套裝保留指南",
        desc: "具有高價值的單件與特定用途之實用全套。",
        items: [
            { category: "高價值單件", name: "安置手 (門徒)", stats: "350% 對惡魔傷害 / 50% 火抗", note: "物理系畢業手套。", tag: "keep" },
            { category: "高價值單件", name: "誦唸珠 (門徒)", stats: "高抗性", note: "極稀有，具收藏價值。", tag: "special" },
            { category: "高價值單件", name: "吉永之臉 (孤兒)", stats: "35% 壓碎打擊 (CB) / 15% 致命", note: "物理系神頭，打王必備。", tag: "keep" },
            { category: "高價值單件", name: "艾爾多的成長", stats: "50% 火抗 / 50生命", note: "補抗性與生命的神鞋。", tag: "keep" },
            { category: "高價值單件", name: "塔格奧的手套", stats: "20% FCR / 30% 毒傷", note: "法系通用，毒死靈必備。", tag: "keep" },
            { category: "高價值單件", name: "塔格奧之束縛", stats: "無法冰凍", note: "死靈法師撐抗必備。", tag: "special" },
            { category: "高價值單件", name: "解迷杖 (納吉)", stats: "傳送聚氣 69 次", note: "副手必備，拓荒神器。", tag: "keep" },
            { category: "高價值單件", name: "天使之翼 (項鍊+戒指)", stats: "兩件套組", note: "提供海量準確率 (AR)。", tag: "keep" },
            { category: "實用全套", name: "塔拉夏的法衣 (塔拉夏的守護/判決)", stats: "漆甲 / 項鍊 是重點", note: "MF 刷寶標配，法師穩定選擇。", tag: "high" },
            { category: "實用全套", name: "不朽之王 (IK)", stats: "胸甲最難掉", note: "野蠻人穩定的通關選擇。", tag: "special" },
            { category: "實用全套", name: "娜塔亞地圖騰", stats: "武器最稀有", note: "全套高物理減傷，自用強悍。", tag: "special" },
            { category: "實用全套", name: "牛王之皮", stats: "全套", note: "具備趣味性，適合特殊玩法。", tag: "收藏" }
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
            },
            {
                category: "鑑定懶人包",
                name: "【組合 D】",
                stats: "10 FCR / 15 敏捷 / 大量單抗 (如火抗 25+)",
                note: "法系高敏抗性戒指。",
                tag: "high"
            }
        ]
    },
    charms: {
        title: "咒符、珠寶與工藝品",
        desc: "包含特大/小型咒符、破免咒符、珠寶以及魔法與手工極品之鑑定。",
        items: [
            { category: "特大咒符 (GC)", name: "技能板", stats: "+1 特定技能 / 41-45 生命", note: "必須由高等 BOSS 掉落。41+ 命為天價。", tag: "high" },
            { category: "特大咒符 (GC)", name: "傷準命板", stats: "10大傷 / 76準確 / 45生命", note: "物理系終極極品。", tag: "high" },
            { category: "小型咒符 (SC)", name: "生抗小板", stats: "20 生命 / 5 全抗", note: "市場需求最穩定的高價物。", tag: "high" },
            { category: "小型咒符 (SC)", name: "生單抗小板", stats: "20 生命 / 11 單抗", note: "電抗最貴，火抗其次。", tag: "keep" },
            { category: "小型咒符 (SC)", name: "3/20/20 小板", stats: "3大傷 / 20準確 / 20生命", note: "物理系神級小板。", tag: "high" },
            { category: "破免咒符", name: "寒冰破綻 (冰破)", stats: "-70% 敵人抗性 (最優)", note: "冰法核心。數值越低越貴。", tag: "keep" },
            { category: "破免咒符", name: "天裂之隙 (電破)", stats: "-70% 敵人抗性 (最優)", note: "電系標配（搭配無限）。", tag: "keep" },
            { category: "珠寶", name: "15/40 珠寶", stats: "15% 攻速 / 40% ED", note: "物理職業終極珠寶，天價。", tag: "high" },
            { category: "珠寶", name: "減需抗性珠寶", stats: "-15% 需求 / 15 全抗", note: "常用於統盾。", tag: "keep" },
            { category: "藍黃極品", name: "施法者項鍊 (手工)", stats: "+2 技能 / 15-20% FCR", note: "法系終極項鍊。", tag: "high" },
            { category: "藍黃極品", name: "三抗鞋 (黃)", stats: "30% 跑速 / 10% FHR / 三抗 100%+", note: "極昂貴。找電/火抗。", tag: "high" },
            { category: "藍黃極品", name: "偏向盾 (JMoD)", stats: "4 洞 / 30% FBR / 20% 格擋率", note: "君主盾底材。極昂貴藍裝。", tag: "high" }
        ]
    }
};
