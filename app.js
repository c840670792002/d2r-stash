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
        if (!data) return;

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
        // Simple heuristic: search for item names in our database
        const normalizedText = rawText.replace(/\s+/g, '');
        let bestMatch = null;
        let maxScore = 0;

        // Fuzzy match: Score based on how many characters of item name appear in OCR text
        for (let section in D2R_DATA) {
            D2R_DATA[section].items.forEach(item => {
                const pureName = item.name.split(' (')[0].replace(/\s+/g, '');
                let matchCount = 0;

                // Count how many unique characters of the item name exist in the found text
                const uniqueChars = [...new Set(pureName.split(''))];
                uniqueChars.forEach(char => {
                    if (normalizedText.includes(char)) matchCount++;
                });

                const score = (matchCount / uniqueChars.length) * 100;

                // We need a threshold (e.g., 70% match and at least 3 chars)
                if (score > maxScore && score > 70 && pureName.length >= 2) {
                    maxScore = score;
                    bestMatch = item;
                }
            });
        }

        if (bestMatch) {
            resultBody.innerHTML = `
                <div class="analysis-item">
                    <p><span class="analysis-label">識別結果：</span><span class="status-keep">${bestMatch.name.split(' (')[0]}</span></p>
                    <div class="match-box">
                        <p><span class="analysis-label">指南建議：</span>${bestMatch.tag === 'high' ? '🔥 價值極高，務必保留！' : '✅ 建議保留'}</p>
                        <p><span class="analysis-label">關鍵變量：</span>${bestMatch.stats}</p>
                        <hr style="opacity: 0.1; margin: 0.5rem 0;">
                        <p><span class="analysis-label">筆記：</span>${bestMatch.note}</p>
                    </div>
                    <p style="margin-top: 1rem; font-size: 0.8rem; color: var(--text-secondary);">提示：OCR 僅辨識品名，詳細變量請手動對照指南。</p>
                </div>
            `;
        } else {
            resultBody.innerHTML = `
                <div class="analysis-item">
                    <p>🔍 <span class="analysis-label">未匹配到特定裝備</span></p>
                    <p>我未能從截圖中辨識出高價值暗金或套裝的名稱。</p>
                    <div class="match-box" style="border-color: #ff4444;">
                        <p><strong>可能原因：</strong></p>
                        <ul style="margin-left: 1.5rem; font-size: 0.9rem;">
                            <li>這是一件過渡用的普通裝備（指南已剔除）。</li>
                            <li>截圖字體太模糊或背景干擾過強。</li>
                            <li>這是一件「黃色或藍色」極品，需參閱戒指/咒符鑑定標準。</li>
                        </ul>
                    </div>
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
