// Leadership Management Page - Interactivity for Role Cards and Member Selection
// Note: View switching is now handled by page navigation (links), not JavaScript

// ==========================================
// EXECUTIVE/ASSOCIATE ROLE CARD MANAGEMENT
// ==========================================

class RoleCardManager {
    constructor() {
        this.initializeAllRoleCards();
    }

    initializeAllRoleCards() {
        // Initialize role cards for executives and associates
        const roleCards = document.querySelectorAll('.exec-role-item');
        roleCards.forEach(card => {
            this.attachRoleCardListeners(card);
        });
    }

    attachRoleCardListeners(card) {
        const header = card.querySelector('.role-header');
        const expandedContent = card.querySelector('.role-expanded-content');
        const actionBtn = card.querySelector('.role-action-button');

        // Header click to expand/collapse
        header.addEventListener('click', () => {
            const isExpanding = !card.classList.contains('expanded');
            card.classList.toggle('expanded');
            expandedContent.classList.toggle('hidden');
            
            // Hide/show member name badge on expand/collapse
            const isAssigned = card.getAttribute('data-assigned') === 'true';
            if (isAssigned) {
                const assignedMemberDisplay = card.querySelector('.assigned-member-display');
                if (assignedMemberDisplay) {
                    assignedMemberDisplay.style.display = isExpanding ? 'none' : 'flex';
                }
            }
        });

        // Action button click
        if (actionBtn) {
            actionBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const currentState = actionBtn.getAttribute('data-button-state');
                if (currentState === 'initial') {
                    this.transitionToActive(card);
                }
            });
        }

        // Member option selection
        const memberOptions = card.querySelectorAll('.member-option');
        memberOptions.forEach(option => {
            option.addEventListener('click', () => {
                this.selectMemberForRole(card, option.getAttribute('data-member'));
            });
        });

        // Change selection button
        const changeBtn = card.querySelector('.change-selection-btn');
        if (changeBtn) {
            changeBtn.addEventListener('click', () => {
                this.transitionToActive(card);
            });
        }

        // Search input for filtering members
        const searchInput = card.querySelector('.role-member-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                const options = card.querySelectorAll('.member-option');
                options.forEach(opt => {
                    const name = opt.querySelector('.member-name').textContent.toLowerCase();
                    opt.style.display = name.includes(query) ? 'block' : 'none';
                });
            });
        }
    }

    transitionToActive(card) {
        const actionBtn = card.querySelector('.role-action-button');
        const dropdowns = card.querySelectorAll('.role-dropdown');

        // Hide all dropdowns
        dropdowns.forEach(dd => dd.style.display = 'none');

        // Show active dropdown with search
        const activeDropdown = card.querySelector('[data-state="active"]');
        if (activeDropdown) {
            activeDropdown.style.display = 'block';
            const searchInput = activeDropdown.querySelector('.role-member-search');
            if (searchInput) searchInput.focus();
        }

        // Show the action button again
        if (actionBtn) {
            actionBtn.style.display = 'block';
        }

        actionBtn.setAttribute('data-button-state', 'active');
    }

    selectMemberForRole(card, memberName) {
        const actionBtn = card.querySelector('.role-action-button');
        const dropdowns = card.querySelectorAll('.role-dropdown');

        // Hide all dropdowns
        dropdowns.forEach(dd => dd.style.display = 'none');

        // Show selected state
        const selectedDropdown = card.querySelector('[data-state="selected"]');
        if (selectedDropdown) {
            selectedDropdown.style.display = 'block';
            const nameDiv = selectedDropdown.querySelector('.selected-member-name');
            if (nameDiv) {
                nameDiv.textContent = memberName;
            }
        }

        // Hide the action button when showing selected member preview
        if (actionBtn) {
            actionBtn.style.display = 'none';
        }

        actionBtn.setAttribute('data-button-state', 'selected');

        // Update member name badge in header
        const assignedMemberDisplay = card.querySelector('.assigned-member-display');
        if (assignedMemberDisplay) {
            const memberBadge = assignedMemberDisplay.querySelector('.member-name-badge');
            if (memberBadge) {
                memberBadge.textContent = memberName;
            }
        } else {
            // Create assigned-member-display if converting from unassigned to assigned
            const roleHeader = card.querySelector('.role-header');
            const unassignedDisplay = card.querySelector('.unassigned-member-display');
            if (unassignedDisplay) {
                unassignedDisplay.remove();
            }
            const newDisplay = document.createElement('div');
            newDisplay.className = 'assigned-member-display';
            newDisplay.innerHTML = `<span class="member-name-badge">${memberName}</span>`;
            roleHeader.insertBefore(newDisplay, roleHeader.querySelector('.role-chevron'));
        }

        card.classList.remove('unassigned');
        card.classList.add('assigned');
        card.setAttribute('data-assigned', 'true');
        card.setAttribute('data-member', memberName);

        console.log(`Member "${memberName}" assigned to role "${card.getAttribute('data-role')}"`);
    }
}

// ==========================================
// SUBCOMMITTEE MINISTRY SEARCH & SELECTION
// ==========================================

class SubcommitteeManager {
    constructor() {
        this.ministrySearch = document.getElementById('ministrySearch');
        this.ministriesGridContainer = document.getElementById('ministriesGridContainer');
        
        if (this.ministrySearch && this.ministriesGridContainer) {
            this.init();
        }
    }

    init() {
        console.log('[Subcommittee] Manager initialized');

        // Search functionality for ministry grid
        if (this.ministrySearch) {
            this.ministrySearch.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Initialize role cards on ministry detail page
        this.initializeRoleCards();
    }

    handleSearch(query) {
        const searchTerm = query.toLowerCase();
        const ministryItems = this.ministriesGridContainer.querySelectorAll('.ministry-item');

        ministryItems.forEach(item => {
            const name = item.getAttribute('data-ministry').toLowerCase();
            item.style.display = name.includes(searchTerm) ? 'flex' : 'none';
        });
    }

    initializeRoleCards() {
        // Initialize role cards for subcommittee roles
        const roleCards = document.querySelectorAll('.exec-role-item');
        const roleManager = new RoleCardManager();
        
        roleCards.forEach(card => {
            roleManager.attachRoleCardListeners(card);
        });
    }
}

// ==========================================
// LOAD MORE FUNCTIONALITY
// ==========================================

class LoadMoreManager {
    constructor() {
        this.loadMoreBtns = document.querySelectorAll('.load-more-button');
        this.init();
    }

    init() {
        this.loadMoreBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleLoadMore(btn);
            });
        });
    }

    handleLoadMore(button) {
        // Find hidden role items
        const container = button.closest('.exec-section, .assoc-section');
        if (!container) return;

        const hiddenRoles = container.querySelectorAll('.exec-role-item[style*="display: none"], .exec-role-item.hidden');
        
        // Show next batch (e.g., 5 items)
        const batchSize = 5;
        let shown = 0;
        
        hiddenRoles.forEach((role, index) => {
            if (shown < batchSize) {
                role.style.display = '';
                role.classList.remove('hidden');
                shown++;
            }
        });

        // Hide button if no more items
        if (shown === 0 || hiddenRoles.length <= batchSize) {
            button.style.display = 'none';
        }

        console.log(`Loaded ${shown} more roles`);
    }
}

// ==========================================
// INITIALIZE ALL MANAGERS ON PAGE LOAD
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('[Leadership] Page loaded - initializing managers');
    
    // Initialize role card manager (for executives and associates pages)
    new RoleCardManager();
    
    // Initialize subcommittee manager (for subcommittees page)
    new SubcommitteeManager();
    
    // Initialize load more functionality
    new LoadMoreManager();
    
    console.log('[Leadership] All managers initialized');
});

// ==========================================
// NAVIGATION HAMBURGER MENU (if needed)
// ==========================================

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}
