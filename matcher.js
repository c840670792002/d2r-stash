/**
 * D2R Item Matcher - Core Scoring Engine
 * Separated for automated testing and modularity.
 */

const D2R_MATCHER = {
    /**
     * Core matching logic.
     * @param {string} rawText - Full OCR text
     * @param {Array} lines - Tesseract line objects
     * @returns {Object|null} Best match result
     */
    match(rawText, lines = []) {
        const normalizedFullText = rawText.replace(/\s+/g, '');
        const cleanFullText = normalizedFullText.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '');

        const structuredLines = lines.map((l, index) => {
            const clean = l.text.replace(/\s+/g, '').replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '');
            return { clean, original: l.text.trim(), index };
        }).filter(l => l.clean.length >= 2);

        let bestMatch = null;
        let maxScore = 0;
        let matchIsGlobal = false;
        let matchDetails = [];

        const BLACKLIST_WORDS = ["精英", "卓越", "普通", "項鍊", "戒指", "手套", "鞋子", "護甲", "盔甲", "盾牌", "腰帶", "飾品", "武器", "防具", "套裝", "暗金", "獨特", "精華", "拓荒", "建議", "保留", "有價", "基礎", "等級", "需要", "力量", "敏捷", "技能", "生命"];

        const calculateScore = (itemEntry, isGlobal = false) => {
            const itemName = typeof itemEntry === 'string' ? itemEntry : itemEntry.name;
            const cleanItemName = itemName.replace(/[()|]/g, '/');
            const aliasParts = cleanItemName.split('/')
                .map(n => n.trim().replace(/\s+/g, '').replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ''))
                .filter(n => n.length >= 2 && !BLACKLIST_WORDS.includes(n));

            if (aliasParts.length === 0) return { score: 0, alias: "" };

            let itemEntryMaxScore = 0;
            let bestAlias = "";

            aliasParts.forEach(alias => {
                let currentAliasScore = 0;

                // 1. Line-based Matching (Aggressive First-Line Priority)
                structuredLines.slice(0, 8).forEach(line => {
                    const lineText = line.clean;
                    const isFirstLine = line.index === 0;

                    if (lineText === alias) {
                        // Perfect match
                        const lineBonus = isFirstLine ? 1000000 : 50000;
                        currentAliasScore = Math.max(currentAliasScore, lineBonus + (alias.length * 1000));
                    } else if (lineText.includes(alias) || alias.includes(lineText)) {
                        const shorter = Math.min(alias.length, lineText.length);
                        const longer = Math.max(alias.length, lineText.length);
                        const overlap = shorter / longer;

                        if (overlap >= 0.7) {
                            const lineBonus = isFirstLine ? 500000 : 20000;
                            currentAliasScore = Math.max(currentAliasScore, (lineBonus * overlap) + (alias.length * 500));
                        }
                    }
                });

                // 2. Full Text Substring (Fallback)
                if (currentAliasScore < 8000 && cleanFullText.includes(alias)) {
                    currentAliasScore = Math.max(currentAliasScore, 8000 + (alias.length * 100));
                }

                if (currentAliasScore > itemEntryMaxScore) {
                    itemEntryMaxScore = currentAliasScore;
                    bestAlias = alias;
                }
            });

            // --- Line 0 Dominance Enforcement ---
            // If we have a very strong match on the actual first line of the image, 
            // increase its score exponentially to lock it in.
            const firstLineMatch = structuredLines[0] && structuredLines[0].clean.includes(bestAlias);
            if (firstLineMatch) itemEntryMaxScore += 500000;

            // --- Numeric vs Text Content Ratio Penalty ---
            const alphanumericCount = (itemName.match(/[a-zA-Z0-9]/g) || []).length;
            const totalCount = itemName.length;
            const isNumericHeavy = (alphanumericCount / totalCount) > 0.4;

            if (isNumericHeavy && itemEntryMaxScore < 30000) {
                const topLinesContent = structuredLines.slice(0, 3).map(l => l.clean).join('');
                const topHasStrongChinese = (topLinesContent.match(/[\u4e00-\u9fa5]/g) || []).length >= 2;
                if (topHasStrongChinese) {
                    itemEntryMaxScore -= 60000;
                }
            }

            if (isGlobal) itemEntryMaxScore *= 0.9;
            return { score: itemEntryMaxScore, alias: bestAlias };
        };

        const addCandidate = (item, result, isGlobal) => {
            if (result.score > 1000) { // Only log meaningful matches
                matchDetails.push({
                    name: typeof item === 'string' ? item : item.name,
                    score: result.score,
                    isGlobal,
                    alias: result.alias
                });
            }
        };

        // Pass 1: Guide
        if (typeof D2R_DATA !== 'undefined') {
            for (let section in D2R_DATA) {
                D2R_DATA[section].items.forEach(item => {
                    const res = calculateScore(item, false);
                    addCandidate(item, res, false);
                    if (bestMatch === null || res.score > maxScore) {
                        maxScore = res.score;
                        bestMatch = item;
                        matchIsGlobal = false;
                    }
                });
            }
        }

        // Pass 2: Global
        if (typeof D2R_ALL_UNIQUES !== 'undefined') {
            D2R_ALL_UNIQUES.forEach(name => {
                const res = calculateScore(name, true);
                addCandidate(name, res, true);
                if (bestMatch === null || res.score > maxScore) {
                    maxScore = res.score;
                    bestMatch = {
                        name: name,
                        tag: 'none',
                        stats: '這是一件獨特 (暗金) 裝備，但「保留指南」中未列出具體數值備註。',
                        note: '這通常表示該裝備雖具獨特性，但在中後期刷寶中價值較低，或屬於拓荒性質裝備。'
                    };
                    matchIsGlobal = true;
                }
            });
        }

        matchDetails.sort((a, b) => b.score - a.score);

        return bestMatch ? {
            item: bestMatch,
            isGlobal: matchIsGlobal,
            score: maxScore,
            details: matchDetails.slice(0, 10),
            rawLines: structuredLines
        } : { details: matchDetails.slice(0, 10), rawLines: structuredLines };
    }
};
