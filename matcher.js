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
            const cleanItemName = itemName.replace(/[()|]/g, '/');
            const aliasParts = cleanItemName.split('/').map(n => n.trim().replace(/\s+/g, '').replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '')).filter(n => n.length >= 2);

            let itemEntryMaxScore = 0;

            aliasParts.forEach(alias => {
                let currentAliasScore = 0;

                // 1. Line-based Matching (Aggressive Priority)
                structuredLines.slice(0, 8).forEach(line => {
                    const lineText = line.clean;
                    if (lineText === alias) {
                        // Perfect match in a line
                        const lineBonus = (line.index < 3) ? 100000 : 30000; // Total dominance for top lines
                        currentAliasScore = Math.max(currentAliasScore, lineBonus + (alias.length * 1000));
                    } else if (lineText.includes(alias) || alias.includes(lineText)) {
                        const shorter = Math.min(alias.length, lineText.length);
                        const longer = Math.max(alias.length, lineText.length);
                        const overlap = shorter / longer;

                        if (overlap >= 0.6) {
                            const lineBonus = (line.index < 3) ? 50000 : 10000;
                            currentAliasScore = Math.max(currentAliasScore, (lineBonus * overlap) + (alias.length * 500));
                        }
                    }
                });

                // 2. Full Text Substring (Fallback)
                if (currentAliasScore < 5000 && cleanFullText.includes(alias)) {
                    // Item names rarely match purely as a substring outside of lines unless OCR failed line breaks
                    currentAliasScore = Math.max(currentAliasScore, 5000 + (alias.length * 50));
                }

                if (currentAliasScore > itemEntryMaxScore) itemEntryMaxScore = currentAliasScore;
            });

            // --- Numeric vs Text Content Ratio Penalty ---
            // If the item name is predominantly numeric/symbols (like "3/20/20")
            // but the top of the OCR is predominantly Chinese, heavily penalize.
            const alphanumericCount = (itemName.match(/[a-zA-Z0-9]/g) || []).length;
            const totalCount = itemName.length;
            const isNumericHeavy = (alphanumericCount / totalCount) > 0.4; // 40%+ numbers/letters (common in stats)

            if (isNumericHeavy) {
                const topLinesContent = structuredLines.slice(0, 3).map(l => l.clean).join('');
                const topHasStrongChinese = (topLinesContent.match(/[\u4e00-\u9fa5]/g) || []).length >= 3;
                const nameHasFewerChinese = (itemName.match(/[\u4e00-\u9fa5]/g) || []).length <= 2;

                if (topHasStrongChinese && nameHasFewerChinese) {
                    itemEntryMaxScore -= 60000; // Absolute shutdown for numeric items when title is Chinese
                }
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
