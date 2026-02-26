const D2R_DATA = {
    uniques: {
        title: "暗金裝備保留指南",
        desc: "整理遊戲中值得保留的暗金裝備，標註關鍵屬性與建議保留的數值範圍。",
        items: [
            { category: "項鍊", name: "馬拉的萬花筒", stats: "抗性 25~30", note: "法系畢業項鍊，30抗最貴。", tag: "high" },
            { category: "項鍊", name: "大軍之怒", stats: "攻速、致命一擊", note: "物理職業終極項鍊，後期標配。", tag: "keep" },
            { category: "項鍊", name: "亞特瑪的聖甲蟲", stats: "傷害加深咒語", note: "物理職業破物免神器。", tag: "keep" },
            { category: "戒指", name: "喬丹之石 (SOJ)", stats: "必留", note: "法系神戒，召喚地表暗黑標的物。", tag: "high" },
            { category: "戒指", name: "烏鴉之霜", stats: "敏捷 20 / 準確 240+", note: "無法冰凍，敏捷/準確滿值最貴。", tag: "keep" },
            { category: "戒指", name: "布爾凱索之戒 (BK)", stats: "技能、吸血", note: "物理系常用技能戒。", tag: "keep" },
            { category: "珠寶", name: "彩虹刻面 (電)", stats: "5/5 滿值", note: "電系最貴；「死珠」優於「生珠」。", tag: "high" },
            { category: "盾牌", name: "撒卡蘭姆的使者", stats: "180%+ ED / 無形", note: "飾金盾，聖騎畢業裝。", tag: "keep" },
            { category: "盾牌", name: "暴風之盾", stats: "35% 物理減傷", note: "物免盾。物理職業、盾丁畢業盾。", tag: "keep" },
            { category: "盾牌", name: "魔胎 (HOM)", stats: "180%~200% ED", note: "死靈盾，200% ED 最貴。", tag: "keep" },
            { category: "頭盔", name: "諧角之冠", stats: "防禦 141 (滿值)", note: "俗稱軍帽。後期刷寶標配。", tag: "keep" },
            { category: "頭盔", name: "安達利爾的面貌", stats: "無形 / 10%吸血 / 30力", note: "俗稱安頭。傭兵終極神裝。", tag: "high" },
            { category: "頭盔", name: "格里風之眼", stats: "-20%電抗 / +15%電傷", note: "電系終極頭盔，極品天價。", tag: "high" },
            { category: "頭盔", name: "亞瑞特的面容", stats: "180%+ ED", note: "飛機頭。無形版身價極高。", tag: "keep" },
            { category: "盔甲", name: "海蛇皮甲", stats: "35全抗 / 13MDR", note: "法系畢業級，35抗滿值最優。", tag: "keep" },
            { category: "武器", name: "眼球 (The Oculus)", stats: "必留", note: "法師經典神器。", tag: "keep" },
            { category: "武器", name: "死亡深度", stats: "冰傷 20%~30%", note: "冰法終極天價武器。", tag: "high" },
            { category: "武器", name: "死亡之網", stats: "+2 技 / -50% 毒抗", note: "毒系死靈天價神兵。", tag: "high" },
            { category: "武器", name: "風之力", stats: "8% 吸法 / 稀有", note: "物理弓馬經典神弓。", tag: "high" },
            { category: "鞋子", name: "戰爭旅者", stats: "MF 45%~50%", note: "50% 滿值為極品。", tag: "keep" }
        ]
    },
    bases: {
        title: "有價底材篩選指南",
        desc: "製作符文之語 (Runewords) 時最常用的有價底材。",
        items: [
            { category: "刺客爪", name: "巨鷹爪 / 符紋爪", stats: "+3 鳳凰攻擊", note: "馬賽克 (Mosaic) 神級底材。鳳凰 3 必備。", tag: "high" },
            { category: "盾牌", name: "神聖小盾 (ST)", stats: "全抗 40~45", note: "精神 (Spirit) 畢業底材。", tag: "high" },
            { category: "盾牌", name: "漩渦盾 (無形)", stats: "全抗 40~45", note: "流亡 (Exile) 專用天價底材。", tag: "special" },
            { category: "鎧甲", name: "法師鎧甲", stats: "3洞 / 15% ED", note: "謎團 (Enigma) 最熱門底材。", tag: "keep" },
            { category: "鎧甲", name: "統御者鎧甲", stats: "3/4洞 / 15% ED", note: "剛毅、謎團熱門選擇。", tag: "keep" },
            { category: "長柄", name: "巨型斬鐮", stats: "4/5洞 / 無形", note: "無限、靈光。頂級無形底材。", tag: "high" },
            { category: "法杖", name: "戰鬥/長者/統御", stats: "+3 能量護盾 (ES)", note: "撐 ES 用 (記憶)。", tag: "special" }
        ]
    },
    runewords: {
        title: "2.4-2.7 版本符文組",
        desc: "D2R 新增的關鍵符文組與其製作建議。",
        items: [
            { category: "武器", name: "馬賽克 (Mosaic)", stats: "Mal + Gul + Amn", note: "刺客畢業神兵，徹底改變玩法。", tag: "high" },
            { category: "頭盔", name: "搖曳火焰", stats: "Nef + Pul + Vex", note: "火系核心，提供抗火靈氣與減抗。", tag: "keep" },
            { category: "頭盔", name: "治療 (Cure)", stats: "Shael + Io + Tal", note: "提供淨化靈氣，傭兵回血陣核心。", tag: "keep" },
            { category: "武器/盔甲", name: "趕工 (Hustle)", stats: "Shael + Ko + Eld", note: "提供狂熱靈氣與高跑速。", tag: "special" },
            { category: "武器", name: "迷霧 (Mist)", stats: "Cham + Shaft + Gul + Thul + Ith", note: "提供專注靈氣，弓馬優質選擇。", tag: "keep" }
        ]
    },
    sets: {
        title: "套裝保留指南",
        desc: "具有高價值的單件與實用全套。",
        items: [
            { category: "手套", name: "安置手 (門徒)", stats: "350% 對惡魔傷害", note: "物理系畢業手套。", tag: "keep" },
            { category: "頭盔", name: "吉永之臉", stats: "35% 壓碎打擊 (CB)", note: "物理系神頭，打王必備。", tag: "keep" },
            { category: "靴子", name: "艾爾多的成長", stats: "50% 火抗 / 50命", note: "補抗性與生命的神鞋。", tag: "keep" },
            { category: "武器", name: "解迷杖 (納吉)", stats: "傳送聚氣 69 次", note: "副手必備，不用謎團也能飛。", tag: "keep" },
            { category: "全套", name: "塔拉夏的法衣", stats: "整套", note: "MF 刷寶標配，法師穩定選擇。", tag: "high" }
        ]
    },
    charms: {
        title: "咒符與破免之謎",
        desc: "特大/小型咒符與 2.5 版本破免咒符。",
        items: [
            { category: "特大", name: "技能板", stats: "41~45 生命", note: "天價極品，需特定 BOSS 掉落。", tag: "high" },
            { category: "特大", name: "寒冰破綻 (冰破)", stats: "-70% 敵人抗性", note: "冰法打破免疫核心。", tag: "keep" },
            { category: "特大", name: "天裂之隙 (電破)", stats: "-70% 敵人抗性", note: "電系職業必備。", tag: "keep" },
            { category: "特大", name: "骨骸中斷 (物破)", stats: "+10% 受到傷害", note: "物理職業破物免用。", tag: "keep" },
            { category: "小型", name: "20生命 / 5全抗", stats: "頂值組合", note: "市場需求最穩定的高價物。", tag: "high" },
            { category: "小型", name: "7% MF 小板", stats: "單一屬性", note: "帶 5全抗或11單抗為天價。", tag: "keep" }
        ]
    },
    rings: {
        title: "稀有戒指鑑定基準",
        desc: "來自玩家的高階鑑定公式，幫助你從大量黃戒中篩選天價極品。",
        items: [
            {
                category: "法系",
                name: "10% FCR 高施戒",
                stats: "必備: 10% FCR\\n力量: 15~20 / 敏捷: 10~15\\n全抗: 8~11 / 生命: 30~40",
                note: "公式: 10% FCR + (力/敏) + (全抗/高單抗) = 交易級神戒。",
                tag: "high"
            },
            {
                category: "物理",
                name: "雙吸神戒",
                stats: "吸法: 5~6% / 吸血: 7~8%\\n準確 (AR): 80~120\\n屬性: 15力 / 10敏 以上",
                note: "公式: 雙吸 + 高 AR + 高力量/全抗 = 天價極品。",
                tag: "high"
            },
            {
                category: "組合 A",
                name: "高施力抗戒",
                stats: "10 FCR / 15+ 力量 / 10+ 全抗",
                note: "法系通用神戒。",
                tag: "high"
            },
            {
                category: "組合 C",
                name: "頂級雙吸戒",
                stats: "6% 吸魔 / 8% 吸血 / 10+ 全抗",
                note: "物理職業畢業級戒指。",
                tag: "high"
            }
        ]
    },
    stash: {
        title: "個人倉庫診斷報告",
        desc: "基於你提供的截圖所分析的高價值裝備列表。",
        items: [
            { category: "暗金盾", name: "暴風之盾 (君主盾)", stats: "35% 物理減傷", note: "來源：image copy 2.png。物免盾畢業級。", tag: "keep" },
            { category: "暗金腰帶", name: "心結 (秘銀腰帶)", stats: "15% 減傷 / 40體", note: "來源：image copy 2.png。終極減傷腰帶。", tag: "keep" },
            { category: "暗金盔甲", name: "蛇魔法師之皮", stats: "35 全抗滿值", note: "來源：image copy.png。法系畢業。", tag: "keep" },
            { category: "暗金靴", name: "水上飄 (鯊皮靴)", stats: "65 生命滿值", note: "來源：image.png。頂級生命加成。", tag: "keep" },
            { category: "暗金手套", name: "運氣守護", stats: "40% MF 滿值", note: "來源：image.png。頂級刷寶手套。", tag: "high" }
        ]
    }
};
