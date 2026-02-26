document.addEventListener('DOMContentLoaded', () => {
    // 1. Data & State Initialization
    let currentSection = 'uniques';
    const cardGrid = document.getElementById('card-grid');
    const searchInput = document.getElementById('search-input');
    const navLinks = document.querySelectorAll('.nav-links li');
    const sectionTitle = document.getElementById('section-title');
    const sectionDesc = document.getElementById('section-desc');

    // 2. Navigation Elements (Diagnosis View)
    const diagnosisSection = document.getElementById('diagnosis-section');
    const contentHeader = document.querySelector('.content-header');
    const previewImg = document.getElementById('preview-img');
    const diagnosisResult = document.getElementById('diagnosis-result');
    const resultBody = document.getElementById('result-body');
    const mainView = document.getElementById('main-view');

    // 3. UI Logic Functions
    function renderItems(filter = '') {
        const data = D2R_DATA[currentSection];
        if (!data || !cardGrid) return;

        sectionTitle.textContent = data.title;
        sectionDesc.textContent = data.desc;
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
            header.innerHTML = `<h3>${category}</h3>`;
            cardGrid.appendChild(header);

            groups[category].forEach(item => {
                const card = document.createElement('div');
                card.className = 'item-card';

                const tagLabel = item.tag === 'high' ? '高價' : (item.tag === 'keep' ? '必留' : (item.tag === 'special' ? '特殊' : '收藏'));
                const tagClass = `tag-${item.tag}`;

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
            renderItems(searchInput.value);
        }
    }

    // 4. Event Listeners Initialization

    // Search Listener
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderItems(e.target.value);
        });
    }

    // Navigation Listeners
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            currentSection = link.getAttribute('data-section');
            searchInput.value = '';
            updateVisibility();
        });
    });

    // Smart Diagnosis (Paste) Listener
    window.addEventListener('paste', (e) => {
        if (currentSection !== 'diagnosis') return;

        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        let foundImage = false;

        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                foundImage = true;
                const blob = items[i].getAsFile();
                const reader = new FileReader();

                resultBody.innerHTML = '<div class="analysis-item"><p>⏳ 正在讀取截圖數據...</p></div>';
                diagnosisResult.classList.remove('hidden');

                reader.onload = (event) => {
                    previewImg.src = event.target.result;
                    previewImg.classList.remove('hidden');
                    const dropZoneContent = document.querySelector('.drop-zone-content');
                    if (dropZoneContent) dropZoneContent.classList.add('hidden');
                    startAnalysis();
                };
                reader.onerror = () => {
                    resultBody.innerHTML = '<div class="analysis-item"><p>❌ 讀取圖片失敗，請再試一次。</p></div>';
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
                <p>📸 <span class="analysis-label">截圖已接收</span></p>
                <p>由於網頁端權限限制，請將此截圖同步發送給 <strong>Antigravity (AI 助理)</strong>。</p>
                <hr style="opacity: 0.1; margin: 1rem 0;">
                <p><strong>助理將為你比對：</strong></p>
                <ul style="margin-left: 1.5rem; color: var(--text-dim);">
                    <li>品名識別 (Uniques/Bases/Sets)</li>
                    <li>屬性量化 (Variable Roll Analysis)</li>
                    <li>最終判定 (Keep or Discard)</li>
                </ul>
                <p style="margin-top: 1rem; color: var(--gold-bright);">請直接在對話框中貼上截圖，我會立刻為你分析！</p>
            </div>
        `;
    }

    // 5. Initial Render
    updateVisibility();
});
