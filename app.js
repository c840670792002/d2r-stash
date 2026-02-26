document.addEventListener('DOMContentLoaded', () => {
    let currentSection = 'uniques';
    const cardGrid = document.getElementById('card-grid');
    const searchInput = document.getElementById('search-input');
    const navLinks = document.querySelectorAll('.nav-links li');
    const sectionTitle = document.getElementById('section-title');
    const sectionDesc = document.getElementById('section-desc');

    function renderItems(filter = '') {
        const data = D2R_DATA[currentSection];
        if (!data) return;

        sectionTitle.textContent = data.title;
        sectionDesc.textContent = data.desc;
        cardGrid.innerHTML = '';

        const filteredItems = data.items.filter(item =>
            item.name.toLowerCase().includes(filter.toLowerCase()) ||
            item.category.toLowerCase().includes(filter.toLowerCase()) ||
            item.stats.toLowerCase().includes(filter.toLowerCase())
        );

        // Grouping logic
        const groups = {};
        filteredItems.forEach(item => {
            if (!groups[item.category]) groups[item.category] = [];
            groups[item.category].push(item);
        });

        Object.keys(groups).forEach(category => {
            // Add category header
            const header = document.createElement('div');
            header.className = 'category-group-header';
            header.innerHTML = `<h3>${category}</h3>`;
            cardGrid.appendChild(header);

            // Add items under this category
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

    // Initial render
    renderItems();

    // Navigation Logic
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            currentSection = link.getAttribute('data-section');
            searchInput.value = '';
            renderItems();
        });
    });

    // Search Logic
    searchInput.addEventListener('input', (e) => {
        renderItems(e.target.value);
    });
});
