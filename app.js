/**
 * D2R Library - Main Application Logic
 * Automated Diagnosis via OCR (Tesseract.js)
 */

document.addEventListener('DOMContentLoaded', () => {
    // initApp is now called based on document ready state or onload
});

function initApp() {
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

        if (filter.length >= 2 && typeof D2R_ALL_UNIQUES !== 'undefined') {
            const globalResults = D2R_ALL_UNIQUES.filter(name =>
                name.includes(filter) &&
                !JSON.stringify(D2R_DATA).includes(name.split(' (')[0])
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

            const { data: { text, lines } } = await worker.recognize(imageSrc);
            console.log('Recognized Text:', text);
            await worker.terminate();

            processRecognitionResult(text, lines);
        } catch (err) {
            console.error(err);
            resultBody.innerHTML = '<div class="analysis-item"><p>❌ 辨識出錯。可能是網路問題或圖片格式支不援。</p></div>';
        }
    }

    function processRecognitionResult(rawText, lines = []) {
        if (typeof D2R_MATCHER === 'undefined') {
            resultBody.innerHTML = '<div class="analysis-item"><p>❌ 辨識核心載入失敗，請重新整理頁面。</p></div>';
            return;
        }

        const result = D2R_MATCHER.match(rawText, lines);

        if (result) {
            const bestMatch = result.item;
            const matchIsGlobal = result.isGlobal;
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
                </div>
            `;
        } else {
            resultBody.innerHTML = `
                <div class="analysis-item">
                    <p>🔍 <span class="analysis-label">未匹配到特定裝備</span></p>
                    <p>未能清晰辨識。請確保截圖清晰且包含完整的品名。</p>
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
            const dropZoneContent = document.querySelector('.drop-zone-content');
            if (dropZoneContent) dropZoneContent.classList.remove('hidden');
        });
    }

    updateVisibility();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
