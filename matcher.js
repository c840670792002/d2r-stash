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

        // Structure lines with basic cleanup
        const structuredLines = lines.map((l, index) => {
            const clean = l.text.replace(/\s+/g, '').replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '');
            return { clean, original: l.text.trim(), index };
        }).filter(l => l.clean.length >= 2);

        let bestMatch = null;
        let maxScore = 0;
        let matchIsGlobal = false;

        const calculateScore = (itemEntry, isGlobal = false) => {
            const itemName = typeof itemEntry === 'string' ? itemEntry : itemEntry.name;
            const aliasParts = itemName.replace(/[()]/g, '/').split('/').map(n => n.trim().replace(/\s+/g, '').replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '')).filter(n => n.length >= 2);

            let itemEntryMaxScore = 0;

            aliasParts.forEach(name => {
                let currentMatchScore = 0;

                // 1. Line-based Matching (Highest Priority)
                structuredLines.slice(0, 6).forEach(line => {
                    if (line.clean === name) {
                        // Exact line match: Highest priority
                        currentMatchScore = Math.max(currentMatchScore, 30000 + (2000 / (line.index + 1)) + (name.length * 200));
                    } else if (line.clean.includes(name) || name.includes(line.clean)) {
                        // Partial or container match: Calculate overlap
                        const shorterLen = Math.min(name.length, line.clean.length);
                        const longerLen = Math.max(name.length, line.clean.length);
                        const overlapRatio = shorterLen / longerLen;

                        // If it's the item name itself being partial in a line at the top
                        if (overlapRatio >= 0.7) {
                            currentMatchScore = Math.max(currentMatchScore, 15000 * overlapRatio + (1000 / (line.index + 1)));
                        } else if (line.index === 0 && overlapRatio >= 0.5) {
                            // Very high priority for first line even with more noise
                            currentMatchScore = Math.max(currentMatchScore, 10000 * overlapRatio);
                        }
                    }
                });

                // 2. Full Text Substring (Secondary)
                if (currentMatchScore < 5000 && cleanFullText.includes(name)) {
                    currentMatchScore = Math.max(currentMatchScore, 5000 + (name.length * 20));
                }

                // 3. Fuzzy Logic (Char overlap) - Only if length is decent
                if (currentMatchScore < 1000 && name.length >= 3) {
                    let matchCount = 0;
                    const nameChars = name.replace(/[0-9]/g, '').replace(/[^\u4e00-\u9fa5a-zA-Z]/g, '');
                    const uniqueChars = [...new Set(nameChars.split(''))];
                    if (uniqueChars.length > 0) {
                        uniqueChars.forEach(char => {
                            if (cleanFullText.includes(char)) matchCount++;
                        });
                        const ratio = matchCount / uniqueChars.length;
                        if (ratio >= 0.8) {
                            currentMatchScore = Math.max(currentMatchScore, 3000 * ratio + (matchCount * 20));
                        }
                    }
                }

                if (currentMatchScore > itemEntryMaxScore) itemEntryMaxScore = currentMatchScore;
            });

            // --- Numeric Penalty ---
            // If the item name is purely numeric or special (e.g. "3/20/20") 
            // and the OCR top line is Chinese, we kill the numeric score.
            const hasChineseInName = itemName.match(/[\u4e00-\u9fa5]/);
            const topLinesHaveChinese = structuredLines.slice(0, 3).some(l => l.clean.match(/[\u4e00-\u9fa5]/));

            if (!hasChineseInName && topLinesHaveChinese) {
                itemEntryMaxScore -= 25000;
            }

            if (isGlobal) itemEntryMaxScore *= 0.8;
            return itemEntryMaxScore;
        };

        // Pass 1: Guide
        if (typeof D2R_DATA !== 'undefined') {
            for (let section in D2R_DATA) {
                D2R_DATA[section].items.forEach(item => {
                    const score = calculateScore(item, false);
                    if (score > maxScore && score > 0) {
                        maxScore = score;
                        bestMatch = item;
                        matchIsGlobal = false;
                    }
                });
            }
        }

        // Pass 2: Global
        if (typeof D2R_ALL_UNIQUES !== 'undefined') {
            D2R_ALL_UNIQUES.forEach(name => {
                const score = calculateScore(name, true);
                if (score > maxScore && score > 0) {
                    maxScore = score;
                    bestMatch = {
                        name: name,
                        tag: 'none',
                        stats: '這是一件獨特 (暗金) 裝備，但「保留指南」中未列出具體數值基準。',
                        note: '這通常代表該裝備屬於過渡性質，或市場價值較低。建議自用或販售給 NPC。'
                    };
                    matchIsGlobal = true;
                }
            });
        }

        return bestMatch ? { item: bestMatch, isGlobal: matchIsGlobal, score: maxScore } : null;
    }
};
