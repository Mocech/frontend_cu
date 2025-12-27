// Tab switching functionality
const tabs = document.querySelectorAll('.tab');
const cardsContainer = document.getElementById('cards-container');
const filterSection = document.querySelector('.filter-section');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabType = tab.dataset.tab;

        // Toggle Filter Section Visibility
        // Visible only when 'ministries' tab is active
        if (tabType === 'ministries') {
            filterSection.style.display = 'block';
        } else {
            filterSection.style.display = 'none';
        }

        // Remove active class from all tabs
        tabs.forEach(t => {
            t.classList.remove('active');
            t.classList.add('inactive');
        });
        
        // Add active class to clicked tab
        tab.classList.add('active');
        tab.classList.remove('inactive');

        // Show/hide cards based on tab
        const allCards = cardsContainer.querySelectorAll('.ministry-card, .docket-card');
        
        if (tabType === 'dockets') {
            allCards.forEach(card => {
                if (card.classList.contains('docket-card')) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        } else if (tabType === 'ministries') {
            allCards.forEach(card => {
                card.style.display = 'block';
            });
        } else if (tabType === 'my-ministries') {
            // Logic currently shows all cards; can be customized later to user-specific cards
            allCards.forEach(card => {
                card.style.display = 'block';
            });
        }
    });
});

// Filter functionality
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all filter buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterCategory = button.dataset.filter;
        const allCards = cardsContainer.querySelectorAll('.ministry-card, .docket-card');
        
        // Filter cards based on category
        allCards.forEach(card => {
            const cardCategory = card.dataset.category;
            if (filterCategory === 'all' || cardCategory === filterCategory) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});