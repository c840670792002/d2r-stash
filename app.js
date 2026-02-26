/**
 * D2R Library - Main Application Logic
 * Refactored for stability and Smart Diagnosis (BETA) integration.
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

    // --- 3. Rendering Engine ---
    function renderItems(filter = '') {
        if (!cardGrid || !D2R_DATA) return;

        const data = D2R_DATA[currentSection];
        if (!data) return;

        // Update Headers
        if (sectionTitle) sectionTitle.textContent = data.title;
        if (sectionDesc) sectionDesc.textContent = data.desc;

        cardGrid.innerHTML = '';

        // Filter Logic
        const filteredItems = data.items.filter(item =>
            item.name.toLowerCase().includes(filter.toLowerCase()) ||
            item.category.toLowerCase().includes(filter.toLowerCase()) ||
            item.stats.toLowerCase().includes(filter.toLowerCase())
        );

        // Group by Category
        const groups = {};
        filteredItems.forEach(item => {
            if (!groups[item.category]) groups[item.category] = [];
            groups[item.category].push(item);
        });

        // DOM Injection
        Object.keys(groups).forEach(category => {
            const header = document.createElement('div');
            header.className = 'category-group-header';
            header.innerHTML = `<h3>--- ${category} ---</h3>`;
            cardGrid.appendChild(header);

            groups[category].forEach(item => {
                const card = document.createElement('div');
                card.className = 'item-card';

                const tagLabelMap = {
                    'high': '高價',
                    'keep': '必留',
                    'special': '特殊',
                    '收藏': '收藏'
                };
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

    // --- 5. Event Listeners ---

    // Sidebar Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // UI State
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Logic State
            currentSection = link.getAttribute('data-section');
            if (searchInput) searchInput.value = '';

            updateVisibility();
        });
    });

    // Search Box
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderItems(e.target.value);
        });
    }

    // Paste for Diagnosis
    window.addEventListener('paste', (e) => {
        if (currentSection !== 'diagnosis') return;

        const items = (e.clipboardData || e.originalEvent?.clipboardData)?.items;
        if (!items) return;

        let imageFound = false;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                imageFound = true;
                const blob = items[i].getAsFile();
                const reader = new FileReader();

                // Show Loading
                if (diagnosisResult && resultBody) {
                    diagnosisResult.classList.remove('hidden');
                    resultBody.innerHTML = '<div class="analysis-item"><p>⏳ 正在解析截圖數據...</p></div>';
                }

                reader.onload = (event) => {
                    if (previewImg) {
                        previewImg.src = event.target.result;
                        previewImg.classList.remove('hidden');
                    }
                    const dropZoneContent = document.querySelector('.drop-zone-content');
                    if (dropZoneContent) dropZoneContent.classList.add('hidden');
                    startAnalysis();
                };
                reader.readAsDataURL(blob);
            }
        }
    });

    function startAnalysis() {
        if (!diagnosisResult || !resultBody) return;

        diagnosisResult.classList.remove('hidden');
        resultBody.innerHTML = `
            <div class="analysis-item">
                <p>📸 <span class="analysis-label">截圖已成功接收</span></p>
                <p>請將此畫面截圖發送給 <strong>Antigravity (AI 助理)</strong>，或直接在此對話中貼上截圖。</p>
                <hr style="opacity: 0.1; margin: 1rem 0;">
                <p><strong>助理診斷項目：</strong></p>
                <ul style="margin-left: 1.5rem; color: var(--text-dim); font-size: 0.9rem;">
                    <li>辨識品名 (Unique/Base Name)</li>
                    <li>分析變量 (Variables Comparison)</li>
                    <li>最終評價 (Keep/Discard Rating)</li>
                </ul>
                <p style="margin-top: 1rem; color: var(--gold-bright);">系統已準備就緒，請隨時貼上截圖給我分析！</p>
            </div>
        `;
    }

    // --- 6. Initialization ---
    updateVisibility();
});
