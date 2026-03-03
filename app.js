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
    const dcloneSection = document.getElementById('dclone-section');
    const contentHeader = document.querySelector('.content-header');
    const diagnosisResult = document.getElementById('diagnosis-result');
    const resultBody = document.getElementById('result-body');
    const previewImg = document.getElementById('preview-img');
    const mainView = document.getElementById('main-view');
    const btnClear = document.getElementById('clear-diagnosis');

    // --- 3. Rendering Engine ---
    function renderItems(filter = '') {
        const tableBody = document.getElementById('table-body');
        if (!tableBody || !D2R_DATA) return;

        const data = D2R_DATA[currentSection];
        if (data) {
            if (sectionTitle) sectionTitle.textContent = data.title;
            if (sectionDesc) sectionDesc.textContent = data.desc;
            tableBody.innerHTML = '';

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
                const groupRow = document.createElement('tr');
                groupRow.className = 'group-row';
                groupRow.innerHTML = `<td colspan="4">${category}</td>`;
                tableBody.appendChild(groupRow);

                groups[category].forEach(item => {
                    const row = document.createElement('tr');
                    const tagLabelMap = { 'high': '高價', 'keep': '必留', 'special': '特殊', '收藏': '收藏' };
                    const tagLabel = tagLabelMap[item.tag] || '保留';
                    const tagClass = `tag-${item.tag || 'keep'}`;
                    row.innerHTML = `
                        <td><div class="card-tag ${tagClass}">${tagLabel}</div></td>
                        <td>
                            <div class="item-name">${item.name}</div>
                        </td>
                        <td class="item-stats">${item.stats.replace(/\\n/g, '<br>')}</td>
                        <td class="item-notes">${item.note.replace(/\\n/g, '<br>')}</td>
                    `;
                    tableBody.appendChild(row);
                });
            });
        }

        if (filter.length >= 2 && typeof D2R_ALL_UNIQUES !== 'undefined') {
            const globalResults = D2R_ALL_UNIQUES.filter(name =>
                name.includes(filter) &&
                !JSON.stringify(D2R_DATA).includes(name.split(' (')[0])
            );

            if (globalResults.length > 0) {
                const globalRow = document.createElement('tr');
                globalRow.className = 'group-row';
                globalRow.innerHTML = `<td colspan="4">全量暗金資料庫 (指南未收錄)</td>`;
                tableBody.appendChild(globalRow);

                globalResults.forEach(name => {
                    const row = document.createElement('tr');
                    row.style.opacity = '0.7';
                    row.innerHTML = `
                        <td><div class="card-tag" style="background: #555;">未收錄</div></td>
                        <td><div class="item-name">${name}</div></td>
                        <td class="item-stats">這是一件暗金裝備，但在此指南中被評定為「過渡/無交易價值」。</td>
                        <td class="item-notes">建議用途：拓荒自用、NPC 換錢、或作外觀收藏。</td>
                    `;
                    tableBody.appendChild(row);
                });
            }
        }
    }

    // --- 4. Visibility Controller ---
    function updateVisibility() {
        if (!diagnosisSection || !dcloneSection || !contentHeader || !mainView) return;

        // Hide all sections first
        diagnosisSection.classList.add('hidden');
        dcloneSection.classList.add('hidden');
        contentHeader.classList.add('hidden');
        mainView.classList.add('hidden');

        if (currentSection === 'diagnosis') {
            diagnosisSection.classList.remove('hidden');
        } else if (currentSection === 'dclone') {
            dcloneSection.classList.remove('hidden');
            // Trigger initial fetch if DClone module is loaded
            if (window.DCloneTracker && typeof window.DCloneTracker.init === 'function') {
                window.DCloneTracker.init();
            }
        } else {
            contentHeader.classList.remove('hidden');
            mainView.classList.remove('hidden');
            renderItems(searchInput ? searchInput.value : '');
        }
    }

    // --- 5. Automated Diagnosis (OCR) Logic ---
    async function preprocessImage(imageSrc) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                // Thresholding for OCR (Dark background, bright text -> White background, black text)
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];

                    // Calculate relative luminance
                    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

                    // High Contrast Binarization: threshold at luminance 90
                    if (luminance > 90) {
                        data[i] = 0;     // R -> Black
                        data[i + 1] = 0; // G -> Black
                        data[i + 2] = 0; // B -> Black
                    } else {
                        data[i] = 255;   // R -> White
                        data[i + 1] = 255; // G -> White
                        data[i + 2] = 255; // B -> White
                    }
                }
                ctx.putImageData(imageData, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            };
            img.src = imageSrc;
        });
    }

    async function performOCR(imageSrc) {
        resultBody.innerHTML = '<div class="analysis-item"><p>⏳ 正在優化影像對比度 (Binarization)...</p></div>';

        try {
            const processedImageSrc = await preprocessImage(imageSrc);

            resultBody.innerHTML = '<div class="analysis-item"><p>⏳ 正在初始化辨識引擎...</p></div>';
            const worker = await Tesseract.createWorker('chi_tra');

            resultBody.innerHTML = '<div class="analysis-item"><p>⏳ 正在從高對比圖像中提取文字...</p></div>';
            const { data: { text, lines } } = await worker.recognize(processedImageSrc);

            console.log('Recognized Text:', text);
            await worker.terminate();

            processRecognitionResult(text, lines, processedImageSrc);
        } catch (err) {
            console.error(err);
            resultBody.innerHTML = '<div class="analysis-item"><p>❌ 辨識出錯。可能是網路問題或圖片格式不支援。</p></div>';
        }
    }

    function processRecognitionResult(rawText, lines = [], processedImageSrc = null) {
        if (typeof D2R_MATCHER === 'undefined') {
            resultBody.innerHTML = '<div class="analysis-item"><p>❌ 辨識核心載入失敗，請重新整理頁面。</p></div>';
            return;
        }

        const result = D2R_MATCHER.match(rawText, lines);
        const bestMatch = result.item;
        const matchIsGlobal = result.isGlobal;
        const isGuideItem = !!(bestMatch && !matchIsGlobal);

        let debugHtml = '';
        if (result.details) {
            const imgHtml = processedImageSrc ? `<div style="margin-bottom:10px;"><p style="margin-bottom:5px;"><strong>前處理掃描圖：</strong></p><img src="${processedImageSrc}" style="max-width:100%;height:auto;border:1px solid #444;background:#fff;" /></div>` : '';
            debugHtml = `
                <details style="margin-top:1rem; font-size:11px; opacity:0.6;">
                    <summary>🔍 辨識細節 (Debug Info)</summary>
                    <div style="background:#000; padding:10px; margin-top:5px; border-radius:4px;">
                        ${imgHtml}
                        <p><strong>OCR 提取行：</strong></p>
                        <ul style="padding-left:15px; color:#aaa;">
                            ${result.rawLines.map(l => `<li>[行${l.index}] ${l.clean}</li>`).join('')}
                        </ul>
                        <p><strong>前 5 名匹配候選：</strong></p>
                        <table style="width:100%; border-collapse:collapse;">
                            <tr style="border-bottom:1px solid #333;"><td>名稱</td><td>分數</td><td>類型</td></tr>
                            ${result.details.slice(0, 5).map(d => `<tr><td>${d.name}</td><td>${Math.round(d.score)}</td><td>${d.isGlobal ? '全量' : '指南'}</td></tr>`).join('')}
                        </table>
                    </div>
                </details>
            `;
        }

        if (bestMatch) {
            resultBody.innerHTML = `
                <div class="analysis-item">
                    <p><span class="analysis-label">識別結果：</span><span class="${isGuideItem ? 'status-keep' : ''}">${bestMatch.name.split(' (')[0]}</span></p>
                    <div class="match-box" ${matchIsGlobal ? 'style="border-color: #666;"' : ''}>
                        <p><span class="analysis-label">指南建議：</span>${isGuideItem ? (bestMatch.tag === 'high' ? '🔥 價值極高，務必保留！' : '✅ 建議保留') : '⚪ 指南未收錄'}</p>
                        <p><span class="analysis-label">關鍵變量：</span>${bestMatch.stats}</p>
                        <hr style="opacity: 0.1; margin: 0.5rem 0;">
                        <p><span class="analysis-label">筆記：</span>${bestMatch.note}</p>
                    </div>
                    ${debugHtml}
                </div>
            `;
        } else {
            resultBody.innerHTML = `
                <div class="analysis-item">
                    <p>🔍 <span class="analysis-label">未匹配到特定裝備</span></p>
                    <p>未能清晰辨識。請確保截圖清晰且包含完整的品名。</p>
                    ${debugHtml}
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
