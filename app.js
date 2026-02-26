/**
 * D2R Library - Main Application Logic
 * Automated Diagnosis via OCR (Tesseract.js)
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. State Management ---
    let currentSection = 'uniques';

    // --- 2. Element Selectors ---
    const cardGrid = document.getElementById('card-grid');
    const searchInput = document.getElementById('search-input');
    const navLinks = document.querySelectorAll('.nav-links li');
    const sectionTitle = document.getElementById('section-title');
    const sectionDesc = document.getElementById('section-desc');

    const diagnosisSection = document.getElementById('diagnosis-section');
    const contentHeader = document.querySelector('.content-header');
    const diagnosisResult = document.getElementById('diagnosis-result');
    const resultBody = document.getElementById('result-body');
    const previewImg = document.getElementById('preview-img');
    const mainView = document.getElementById('main-view');
    const btnClear = document.getElementById('clear-diagnosis');

    // --- 3. Rendering Engine ---
    function renderItems(filter = '') {
        if (!cardGrid || !D2R_DATA) return;

        const data = D2R_DATA[currentSection];
        // Handle normal sections (Guide data)
        if (data) {
            if (sectionTitle) sectionTitle.textContent = data.title;
            if (sectionDesc) sectionDesc.textContent = data.desc;
            cardGrid.innerHTML = '';

            const filteredItems = data.items.filter(item =>
                item.name.toLowerCase().includes(filter.toLowerCase()) ||
                item.category.toLowerCase().includes(filter.toLowerCase()) ||
                item.stats.toLowerCase().includes(filter.toLowerCase())
            );

            const groups = {};
            filteredItems.forEach(item => {
                if (!groups[item.category]) groups[item.category] = [];
                groups[item.category].push(item);
            });

            Object.keys(groups).forEach(category => {
                const header = document.createElement('div');
                header.className = 'category-group-header';
                header.innerHTML = `<h3>--- ${category} ---</h3>`;
                cardGrid.appendChild(header);

                groups[category].forEach(item => {
                    const card = document.createElement('div');
                    card.className = 'item-card';
                    const tagLabelMap = { 'high': '高價', 'keep': '必留', 'special': '特殊', '收藏': '收藏' };
                    const tagLabel = tagLabelMap[item.tag] || '保留';
                    const tagClass = `tag-${item.tag || 'keep'}`;
                    card.innerHTML = `
                        <div class="card-tag ${tagClass}">${tagLabel}</div>
                        <div class="item-name">${item.name}</div>
                        <div class="item-stats">${item.stats.replace(/\\n/g, '<br>')}</div>
                        <div class="item-notes">${item.note.replace(/\\n/g, '<br>')}</div>
                    `;
                    cardGrid.appendChild(card);
                });
            });
        }

        // --- Global Unique Search Integration ---
        // If searching, also look into the full unique dictionary
        if (filter.length >= 2 && typeof D2R_ALL_UNIQUES !== 'undefined') {
            const globalResults = D2R_ALL_UNIQUES.filter(name =>
                name.includes(filter) &&
                !JSON.stringify(D2R_DATA).includes(name.split(' (')[0]) // Avoid duplicates already in guide
            );

            if (globalResults.length > 0) {
                const globalHeader = document.createElement('div');
                globalHeader.className = 'category-group-header';
                globalHeader.innerHTML = `<h3>--- 全量暗金資料庫 (指南未收錄) ---</h3>`;
                cardGrid.appendChild(globalHeader);

                globalResults.forEach(name => {
                    const card = document.createElement('div');
                    card.className = 'item-card';
                    card.style.opacity = '0.7';
                    card.innerHTML = `
                        <div class="card-tag" style="background: #555;">未收錄</div>
                        <div class="item-name">${name}</div>
                        <div class="item-stats">這是一件暗金裝備，但在此指南中被評定為「過渡/無交易價值」。</div>
                        <div class="item-notes">建議用途：拓荒自用、NPC 換錢、或作外觀收藏。</div>
                    `;
                    cardGrid.appendChild(card);
                });
            }
        }
    }

    // --- 4. Visibility Controller ---
    function updateVisibility() {
        if (!diagnosisSection || !contentHeader || !mainView) return;

        if (currentSection === 'diagnosis') {
            diagnosisSection.classList.remove('hidden');
            contentHeader.classList.add('hidden');
            mainView.classList.add('hidden');
        } else {
            diagnosisSection.classList.add('hidden');
            contentHeader.classList.remove('hidden');
            mainView.classList.remove('hidden');
            renderItems(searchInput ? searchInput.value : '');
        }
    }

    // --- 5. Automated Diagnosis (OCR) Logic ---
    async function performOCR(imageSrc) {
        resultBody.innerHTML = '<div class="analysis-item"><p>⏳ 正在初始化辨識引擎...</p></div>';

        try {
            const worker = await Tesseract.createWorker('chi_tra');
            resultBody.innerHTML = '<div class="analysis-item"><p>⏳ 正在從截圖中提取文字...</p></div>';

            const { data: { text } } = await worker.recognize(imageSrc);
            console.log('Recognized Text:', text);
            await worker.terminate();

            processRecognitionResult(text);
        } catch (err) {
            console.error(err);
            resultBody.innerHTML = '<div class="analysis-item"><p>❌ 辨識出錯。可能是網路問題或圖片格式支不援。</p></div>';
        }
    }

    function processRecognitionResult(rawText) {
        const normalizedText = rawText.replace(/\s+/g, '');
        let bestMatch = null;
        let maxScore = 0;
        let matchIsGlobal = false;

        // --- Helper: Scoring Logic ---
        function calculateScore(itemName, isGlobal = false) {
            const cleanItemName = itemName.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '');
            const cleanOCRText = normalizedText.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '');

            // 1. Exact Substring Match: Massive weight based on length
            if (cleanOCRText.includes(cleanItemName)) {
                return (isGlobal ? 500 : 1000) + (cleanItemName.length * 20);
            }

            // 2. Fuzzy Match: Char overlap, but penalize short noisy matches
            const textChars = cleanItemName.replace(/[0-9]/g, '').replace(/[^\u4e00-\u9fa5a-zA-Z]/g, '');
            if (textChars.length < 2) return 0;

            let matchCount = 0;
            const uniqueChars = [...new Set(textChars.split(''))];
            uniqueChars.forEach(char => {
                if (normalizedText.includes(char)) matchCount++;
            });

            // Require at least 70% match AND at least 2 chars
            if (matchCount / uniqueChars.length >= 0.7 && matchCount >= 2) {
                // Scoring: Longer names get much higher absolute scores to beat short noise
                return (isGlobal ? 100 : 200) + (matchCount * 30);
            }
            return 0;
        }

        // --- Pass 1: Check D2R_DATA (Guide items) ---
        for (let section in D2R_DATA) {
            D2R_DATA[section].items.forEach(item => {
                const names = item.name.replace(/[()]/g, '/').split('/').map(n => n.trim().replace(/\s+/g, '')).filter(n => n.length >= 2);
                names.forEach(name => {
                    const score = calculateScore(name, false);
                    if (score > maxScore) {
                        maxScore = score;
                        bestMatch = item;
                        matchIsGlobal = false;
                    }
                });
            });
        }

        // --- Pass 2: Check D2R_ALL_UNIQUES (Global fallback) ---
        if (typeof D2R_ALL_UNIQUES !== 'undefined') {
            D2R_ALL_UNIQUES.forEach(name => {
                const score = calculateScore(name, true);
                if (score > maxScore) {
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

        if (bestMatch) {
            const isGuideItem = !matchIsGlobal;
            resultBody.innerHTML = `
                <div class="analysis-item">
                    <p><span class="analysis-label">識別結果：</span><span class="${isGuideItem ? 'status-keep' : ''}">${bestMatch.name.split(' (')[0]}</span></p>
                    <div class="match-box" ${matchIsGlobal ? 'style="border-color: #666;"' : ''}>
                        <p><span class="analysis-label">指南建議：</span>${isGuideItem ? (bestMatch.tag === 'high' ? '🔥 價值極高，務必保留！' : '✅ 建議保留') : '⚪ 指南未收錄'}</p>
                        <p><span class="analysis-label">關鍵變量：</span>${bestMatch.stats}</p>
                        <hr style="opacity: 0.1; margin: 0.5rem 0;">
                        <p><span class="analysis-label">筆記：</span>${bestMatch.note}</p>
                    </div>
                    <p style="margin-top: 1rem; font-size: 0.8rem; color: var(--text-secondary);">提示：OCR 僅辨識品名，詳細變量請手動對照指南庫。</p>
                </div>
            `;
        } else {
            resultBody.innerHTML = `
                <div class="analysis-item">
                    <p>🔍 <span class="analysis-label">未匹配到特定裝備</span></p>
                    <p>未能從截圖中辨識出高價值暗金、套裝或常見暗金名稱。系統已採用長文本優先權重。</p>
                </div>
            `;
        }
    }

    // --- 6. Event Listeners ---
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            currentSection = link.getAttribute('data-section');
            if (searchInput) searchInput.value = '';
            updateVisibility();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderItems(e.target.value);
        });
    }

    window.addEventListener('paste', (e) => {
        if (currentSection !== 'diagnosis') return;

        const items = (e.clipboardData || e.originalEvent?.clipboardData)?.items;
        if (!items) return;

        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                const reader = new FileReader();

                diagnosisResult.classList.remove('hidden');

                reader.onload = (event) => {
                    const imageSrc = event.target.result;
                    if (previewImg) {
                        previewImg.src = imageSrc;
                        previewImg.classList.remove('hidden');
                    }
                    const dropZoneContent = document.querySelector('.drop-zone-content');
                    if (dropZoneContent) dropZoneContent.classList.add('hidden');

                    performOCR(imageSrc);
                };
                reader.readAsDataURL(blob);
            }
        }
    });

    if (btnClear) {
        btnClear.addEventListener('click', () => {
            diagnosisResult.classList.add('hidden');
            previewImg.classList.add('hidden');
            previewImg.src = '';
            document.querySelector('.drop-zone-content').classList.remove('hidden');
        });
    }

    // --- 7. Initialization ---
    updateVisibility();
});
