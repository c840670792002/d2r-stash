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

        const levenshteinDistance = (s1, s2) => {
            if (s1.length === 0) return s2.length;
            if (s2.length === 0) return s1.length;
            const matrix = [];
            for (let i = 0; i <= s1.length; i++) matrix[i] = [i];
            for (let j = 0; j <= s2.length; j++) matrix[0][j] = j;
            for (let i = 1; i <= s1.length; i++) {
                for (let j = 1; j <= s2.length; j++) {
                    const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j - 1] + cost
                    );
                }
            }
            return matrix[s1.length][s2.length];
        };

        const getSimilarity = (s1, s2) => {
            const maxLen = Math.max(s1.length, s2.length);
            if (maxLen === 0) return 1.0;
            return 1.0 - levenshteinDistance(s1, s2) / maxLen;
        };

        const calculateScore = (itemEntry, isGlobal = false) => {
            const itemName = typeof itemEntry === 'string' ? itemEntry : itemEntry.name;
            const cleanItemName = itemName.replace(/[()|]/g, '/');
            const aliasParts = cleanItemName.split('/')
                .map(n => n.trim().replace(/\s+/g, '').replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ''))
                .filter(n => n.length >= 2 && !BLACKLIST_WORDS.includes(n));

            if (aliasParts.length === 0) return { score: 0, alias: "" };

            let itemEntryMaxScore = 0;
            let bestAlias = "";
            let bestMatchLineIndex = -1;

            aliasParts.forEach(alias => {
                let currentAliasScore = 0;
                let matchedLineIdx = -1;

                // 1. Line-based Matching (Fuzzy + Sliding Window)
                structuredLines.slice(0, 8).forEach(line => {
                    const lineText = line.clean;
                    const isFirstLine = line.index === 0;

                    // Direct Similarity Compare
                    const sim = getSimilarity(lineText, alias);
                    let bestSubSim = 0;

                    // Sliding Window Substring Similarity (e.g. OCR: "巨角頭盔夜翼面紗" vs "夜翼面紗")
                    if (lineText.length >= alias.length) {
                        for (let i = 0; i <= lineText.length - alias.length; i++) {
                            const sub = lineText.substr(i, alias.length);
                            const subSim = getSimilarity(sub, alias);
                            if (subSim > bestSubSim) bestSubSim = subSim;
                        }
                    }

                    const bestSim = Math.max(sim, bestSubSim);

                    if (bestSim >= 0.75) {
                        // High similarity match (allows typos)
                        let lineBonus = isFirstLine ? 1000000 : 50000;
                        if (bestSim === 1.0) {
                            lineBonus = isFirstLine ? 1500000 : 80000;
                        }

                        const score = (lineBonus * Math.pow(bestSim, 2)) + (alias.length * 1000);
                        if (score > currentAliasScore) {
                            currentAliasScore = score;
                            matchedLineIdx = line.index;
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
                    bestMatchLineIndex = matchedLineIdx;
                }
            });

            // --- Line 0 Dominance Enforcement ---
            if (bestMatchLineIndex === 0) {
                itemEntryMaxScore += 500000;
            }

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
