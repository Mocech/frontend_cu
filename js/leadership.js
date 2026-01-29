// Leadership Management Page - Interactivity and Responsiveness

// ==========================================
// VIEW SWITCHER FUNCTIONALITY
// ==========================================

class ViewManager {
    constructor() {
        this.viewButtons = document.querySelectorAll('.mode-button');
        this.viewContents = document.querySelectorAll('.view-content');
        this.init();
    }

    init() {
        this.viewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const view = button.getAttribute('data-view');
                this.switchView(view);
            });
        });

        // Restore last active view from session
        const savedView = sessionStorage.getItem('activeLeadershipView') || 'overview';
        this.switchView(savedView);
    }

    switchView(view) {
        // Update button states
        this.viewButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-view') === view) {
                btn.classList.add('active');
            }
        });

        // Update content visibility
        this.viewContents.forEach(content => {
            content.classList.remove('active');
            if (content.getAttribute('data-view') === view) {
                content.classList.add('active');
            }
        });

        // Save view to session
        sessionStorage.setItem('activeLeadershipView', view);
    }
}

// ==========================================
// MINISTRY SEARCH & SELECTION
// ==========================================

class MinistrySearch {
    constructor() {
        this.searchInput = document.getElementById('ministrySearch');
        this.suggestionsBox = document.getElementById('suggestions');
        this.suggestionItems = document.querySelectorAll('.suggestion-item');
        this.ministryContext = document.getElementById('ministryContext');
        this.emptyState = document.getElementById('emptyState');
        this.selectedMinistry = document.getElementById('selectedMinistry');
        this.changeBtn = document.getElementById('changeMinistry');
        
        this.init();
    }

    init() {
        if (!this.searchInput) return;

        // Search input behavior
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Focus to show suggestions
        this.searchInput.addEventListener('focus', () => {
            this.showSuggestions();
        });

        // Click outside to hide suggestions
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-wrapper')) {
                this.hideSuggestions();
            }
        });

        // Suggestion item selection
        this.suggestionItems.forEach(item => {
            item.addEventListener('click', () => {
                const ministry = item.getAttribute('data-ministry');
                this.selectMinistry(ministry);
            });
        });

        // Change ministry button
        if (this.changeBtn) {
            this.changeBtn.addEventListener('click', () => {
                this.clearSelection();
            });
        }

        // Keyboard navigation
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const firstVisible = this.suggestionsBox.querySelector('.suggestion-item');
                if (firstVisible) {
                    const ministry = firstVisible.getAttribute('data-ministry');
                    this.selectMinistry(ministry);
                }
            }
            if (e.key === 'Escape') {
                this.hideSuggestions();
            }
        });
    }

    handleSearch(query) {
        if (!query.trim()) {
            this.showSuggestions();
            return;
        }

        const filtered = Array.from(this.suggestionItems).filter(item => {
            const text = item.getAttribute('data-ministry').toLowerCase();
            return text.includes(query.toLowerCase());
        });

        // Hide all first
        this.suggestionItems.forEach(item => item.style.display = 'none');

        // Show filtered
        filtered.forEach(item => item.style.display = 'flex');

        if (filtered.length > 0) {
            this.showSuggestions();
        }
    }

    showSuggestions() {
        this.suggestionsBox.classList.add('active');
    }

    hideSuggestions() {
        this.suggestionsBox.classList.remove('active');
    }

    selectMinistry(ministry) {
        this.selectedMinistry.textContent = ministry;
        this.searchInput.value = ministry;
        this.hideSuggestions();

        // Show context, hide empty state
        this.ministryContext.style.display = 'block';
        this.emptyState.style.display = 'none';

        // Scroll to context
        this.ministryContext.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    clearSelection() {
        this.searchInput.value = '';
        this.ministryContext.style.display = 'none';
        this.emptyState.style.display = 'block';
        this.suggestionsBox.classList.remove('active');
        this.searchInput.focus();
    }
}

// ==========================================
// MODAL MANAGEMENT
// ==========================================

class ModalManager {
    constructor() {
        this.modal = document.getElementById('assignmentModal');
        this.modalClose = document.getElementById('modalClose');
        this.modalCancel = document.getElementById('modalCancel');
        this.modalConfirm = document.getElementById('modalConfirm');
        this.modalPosition = document.getElementById('modalPosition');
        this.memberSearch = document.getElementById('memberSearch');
        this.memberRadios = document.querySelectorAll('input[name="selectedMember"]');
        this.init();
    }

    init() {
        if (!this.modal) return;

        // Close buttons
        if (this.modalClose) {
            this.modalClose.addEventListener('click', () => this.closeModal());
        }
        if (this.modalCancel) {
            this.modalCancel.addEventListener('click', () => this.closeModal());
        }

        // Confirm button
        if (this.modalConfirm) {
            this.modalConfirm.addEventListener('click', () => this.confirmAssignment());
        }

        // Member search
        if (this.memberSearch) {
            this.memberSearch.addEventListener('input', (e) => {
                this.filterMembers(e.target.value);
            });
        }

        // Close on overlay click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    openModal(position) {
        this.modalPosition.textContent = position;
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Clear search and selections
        if (this.memberSearch) {
            this.memberSearch.value = '';
        }
        this.memberRadios.forEach(radio => radio.checked = false);
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    filterMembers(query) {
        const memberOptions = document.querySelectorAll('.member-option');
        const lowerQuery = query.toLowerCase();

        memberOptions.forEach(option => {
            const name = option.querySelector('.member-option-name').textContent.toLowerCase();
            const meta = option.querySelector('.member-option-meta').textContent.toLowerCase();
            
            if (name.includes(lowerQuery) || meta.includes(lowerQuery)) {
                option.style.display = 'flex';
            } else {
                option.style.display = 'none';
            }
        });
    }

    confirmAssignment() {
        const selected = document.querySelector('input[name="selectedMember"]:checked');
        if (!selected) {
            alert('Please select a member');
            return;
        }

        const memberName = selected.value;
        const position = this.modalPosition.textContent;

        // Here you would send data to backend
        console.log(`Assigned ${memberName} to ${position}`);

        // Show confirmation
        alert(`✓ ${memberName} has been assigned to ${position}`);
        this.closeModal();
    }
}

// ==========================================
// ASSIGN BUTTON HANDLERS (Global Function)
// ==========================================

let modalManager;

function openAssignModal(position) {
    if (!modalManager) {
        modalManager = new ModalManager();
    }
    modalManager.openModal(position);
}

// ==========================================
// RESPONSIVE BEHAVIOR
// ==========================================

function handleResponsive() {
    const viewport = window.innerWidth;
    
    // Adjust table visibility for mobile
    const tables = document.querySelectorAll('.assignment-table');
    tables.forEach(table => {
        if (viewport < 768) {
            // On mobile, you might want to add special handling
            table.setAttribute('data-responsive', 'true');
        }
    });
}

// ==========================================
// QUICK ACTIONS HANDLERS
// ==========================================

function initializeQuickActions() {
    const saveBtn = document.querySelector('.action-btn-primary');
    const clearBtn = document.querySelector('.action-btn-secondary');
    const downloadBtn = document.querySelector('.action-btn-tertiary');

    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            console.log('[v0] Save All Assignments clicked');
            // Add visual feedback
            saveBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                saveBtn.style.transform = '';
                alert('✓ All assignments saved successfully!');
            }, 100);
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            console.log('[v0] Clear Changes clicked');
            if (confirm('Are you sure you want to clear all unsaved changes?')) {
                clearBtn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    clearBtn.style.transform = '';
                    alert('✓ All changes cleared');
                }, 100);
            }
        });
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            console.log('[v0] Download Report clicked');
            downloadBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                downloadBtn.style.transform = '';
                alert('✓ Report download started');
                // In a real app, this would trigger actual file download
            }, 100);
        });
    }
}

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    new ViewManager();
    new MinistrySearch();
    new SubcommitteeManager();
    modalManager = new ModalManager();
    
    // Initialize quick actions
    initializeQuickActions();

    // Initialize Load More Roles (handles all cards - visible and hidden)
    new LoadMoreRoles('loadMoreBtn', 'execHiddenRoles');
  
    // Initialize Load More Roles for Associates
    new LoadMoreRoles('loadMoreBtnAssoc', 'assocHiddenRoles');
  
    // Initialize Compact Executives List (handles expand/collapse for role items)
    new CompactExecutivesList();

    // Initialize Executive Cards (legacy)
    new ExecutiveCards();

    // Initialize Subcommittee Manager
    new SubcommitteeManager();

    // Handle responsive
    handleResponsive();
    window.addEventListener('resize', handleResponsive);
});

// ==========================================
// COMPACT EXECUTIVE ROLES LIST - EXPAND/COLLAPSE
// ==========================================

class CompactExecutivesList {
    constructor() {
        this.roleList = document.getElementById('execRoleList');
        this.roleItems = document.querySelectorAll('.exec-role-item');
        this.expandedItem = null;
        this.init();
    }

    init() {
        console.log('✅ CompactExecutivesList initialized');
        console.log('📋 Found role items:', this.roleItems.length);
        
        if (!this.roleList) {
            console.log('❌ ERROR: execRoleList not found!');
            return;
        }


        // Add click listeners to each role item header
        this.roleItems.forEach((item, index) => {
             console.log(`🔗 Attaching listeners to role item ${index + 1}`);
            const header = item.querySelector('.role-header');
            if (header) {
                header.addEventListener('click', (e) => {
                    // Prevent any nested elements from triggering this
                    if (e.target.closest('.role-member-search') || e.target.closest('.role-dropdown')) {
                        return;
                    }
                    e.stopPropagation();
                    this.toggleExpanded(item, index);
                });
            }

            // Add listeners to action buttons
            const actionBtn = item.querySelector('.role-action-button');
            if (actionBtn) {
                actionBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.handleActionClick(item, actionBtn);
                });
            }

            // Add listeners to member options
            const memberOptions = item.querySelectorAll('.member-option');
            memberOptions.forEach((option) => {
                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.selectMember(item, option);
                });
            });

            // Dropdown search
            const searchInput = item.querySelector('.role-member-search');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    e.stopPropagation();
                    this.filterMembers(item, e.target.value);
                });
                searchInput.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!this.roleList.contains(e.target)) {
                this.closeExpanded();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.expandedItem) {
                this.closeExpanded();
            }
        });
    }

    toggleExpanded(item, index) {
        if (this.expandedItem === item) {
            // Close if already open
            this.closeExpanded();
        } else {
            // Close previous and open new
            this.closeExpanded();
            this.openExpanded(item);
        }
    }

    openExpanded(item) {
        item.classList.add('expanded');
        const expandedContent = item.querySelector('.role-expanded-content');
        if (expandedContent) {
            expandedContent.classList.remove('hidden');
        }
        
        // Hide member name badge when expanding dropdown
        const assignedMemberDisplay = item.querySelector('.assigned-member-display');
        if (assignedMemberDisplay) {
            assignedMemberDisplay.style.display = 'none';
        }
        
        this.expandedItem = item;

        // Scroll into view on mobile
        if (window.innerWidth < 768) {
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    closeExpanded() {
        if (this.expandedItem) {
            this.expandedItem.classList.remove('expanded');
            const expandedContent = this.expandedItem.querySelector('.role-expanded-content');
            if (expandedContent) {
                expandedContent.classList.add('hidden');
            }
            
            // Show member name badge again after collapsing (only for assigned roles)
            const isAssigned = this.expandedItem.getAttribute('data-assigned') === 'true';
            if (isAssigned) {
                const assignedMemberDisplay = this.expandedItem.querySelector('.assigned-member-display');
                if (assignedMemberDisplay) {
                    assignedMemberDisplay.style.display = 'flex';
                }
            }
            
            this.expandedItem = null;
        }
    }

handleActionClick(item, btn) {
    // Hide the initial state dropdown and show the active state dropdown
    const initialDropdown = item.querySelector('.role-dropdown[data-state="initial"]');
    const activeDropdown = item.querySelector('.role-dropdown[data-state="active"]');
    
    if (initialDropdown && activeDropdown) {
        initialDropdown.style.display = 'none';
        activeDropdown.style.display = 'block';
        
        // Hide the action button completely instead of disabling it
        btn.style.display = 'none';
        
        // Auto-focus the search input
        const searchInput = activeDropdown.querySelector('.role-member-search');
        if (searchInput) {
            setTimeout(() => searchInput.focus(), 100);
        }
    }
}

    selectMember(item, option) {
        const memberName = option.getAttribute('data-member');
        const roleTitle = item.getAttribute('data-role');
        
        // Track if this was a new assignment
        const wasUnassigned = item.getAttribute('data-assigned') === 'false';
        
        // Update role item state
        item.setAttribute('data-member', memberName);
        item.setAttribute('data-assigned', 'true');
        item.classList.remove('unassigned');
        item.classList.add('assigned');

        // Update member name display (new design - shows name instead of "Assigned" badge)
        const memberDisplay = item.querySelector('.assigned-member-display');
        if (memberDisplay) {
            const memberBadge = memberDisplay.querySelector('.member-name-badge');
            if (memberBadge) {
                memberBadge.textContent = memberName;
            }
        }
        
        // Legacy: Update status pill if it exists (for backward compatibility)
        const statusPill = item.querySelector('.role-status-pill');
        if (statusPill) {
            statusPill.textContent = 'Assigned';
            statusPill.classList.remove('unassigned');
            statusPill.classList.add('assigned');
        }

        // Update action button - hide it when showing selected member preview
        const actionBtn = item.querySelector('.role-action-button');
        if (actionBtn) {
            // Hide the action button when showing the selected member preview
            actionBtn.style.display = 'none';
        }

        // Hide all dropdowns and show selected state
        const initialDropdown = item.querySelector('.role-dropdown[data-state="initial"]');
        const activeDropdown = item.querySelector('.role-dropdown[data-state="active"]');
        const selectedDropdown = item.querySelector('.role-dropdown[data-state="selected"]');
        
        if (initialDropdown) initialDropdown.style.display = 'none';
        if (activeDropdown) activeDropdown.style.display = 'none';
        
        if (selectedDropdown) {
            // Populate the selected member card
            const selectedNameEl = selectedDropdown.querySelector('.selected-member-name');
            const selectedEmailEl = selectedDropdown.querySelector('.selected-member-email');
            
            if (selectedNameEl) {
                selectedNameEl.textContent = memberName;
            }
            if (selectedEmailEl) {
                selectedEmailEl.textContent = memberName.toLowerCase().replace(' ', '.') + '@student.embuni.ac.ke';
            }
            
            // Show selected state
            selectedDropdown.style.display = 'block';
            
            // Add change selection button listener (only once)
            const changeSelectionBtn = selectedDropdown.querySelector('.change-selection-btn');
            if (changeSelectionBtn && !changeSelectionBtn.dataset.listenerAttached) {
                changeSelectionBtn.dataset.listenerAttached = 'true';
                changeSelectionBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.returnToSearch(item);
                });
            }
        }

        console.log(`[v0] Selected ${memberName} for ${roleTitle}`);
    }

    returnToSearch(item) {
    // Show active dropdown again (search state) and hide selected state
    const activeDropdown = item.querySelector('.role-dropdown[data-state="active"]');
    const selectedDropdown = item.querySelector('.role-dropdown[data-state="selected"]');
    const initialDropdown = item.querySelector('.role-dropdown[data-state="initial"]');
    
    if (activeDropdown && selectedDropdown) {
        selectedDropdown.style.display = 'none';
        activeDropdown.style.display = 'block';
        if (initialDropdown) initialDropdown.style.display = 'none';
        
        // Keep the action button hidden since we're back in search mode
        const actionBtn = item.querySelector('.role-action-button');
        if (actionBtn) {
            actionBtn.style.display = 'none';
        }
        
        // Clear the search input and reset member options visibility
        const searchInput = activeDropdown.querySelector('.role-member-search');
        if (searchInput) {
            searchInput.value = '';
            // Show all member options
            const memberOptions = activeDropdown.querySelectorAll('.member-option');
            memberOptions.forEach(option => {
                option.style.display = 'flex';
            });
            setTimeout(() => searchInput.focus(), 100);
        }
    }
}
    filterMembers(item, query) {
        const memberOptions = item.querySelectorAll('.member-option');
        const lowerQuery = query.toLowerCase();

        memberOptions.forEach((option) => {
            const name = option.querySelector('.member-name')?.textContent.toLowerCase() || '';
            if (name.includes(lowerQuery)) {
                option.style.display = 'flex';
            } else {
                option.style.display = 'none';
            }
        });
    }
}

// ==========================================
// LOAD MORE ROLES FUNCTIONALITY
// ==========================================

class LoadMoreRoles {
    constructor(btnId = 'loadMoreBtn', containerId = 'execHiddenRoles') {
        this.loadMoreBtn = document.getElementById(btnId);
        this.hiddenRolesContainer = document.getElementById(containerId);
        this.loadMoreContainer = this.loadMoreBtn ? this.loadMoreBtn.closest('.load-more-container') : null;
        this.isExpanded = false;
        this.init();
    }

    init() {
        console.log('[v0] LoadMoreRoles init - Button:', this.loadMoreBtn, 'Container:', this.hiddenRolesContainer);
        
        if (!this.loadMoreBtn || !this.hiddenRolesContainer) {
            console.log('[v0] LoadMoreRoles - Missing button or container!');
            return;
        }

        // Click handler for load more button
        this.loadMoreBtn.addEventListener('click', () => {
            console.log('[v0] Load more button clicked!');
            this.toggleRoles();
        });

        console.log('[v0] LoadMoreRoles initialized successfully');

        // Initialize event listeners for newly added roles
        this.attachRoleListeners();
    }

    toggleRoles() {
        console.log('[v0] toggleRoles called, current state:', this.isExpanded);
        this.isExpanded = !this.isExpanded;
        console.log('[v0] New expanded state:', this.isExpanded);

        if (this.isExpanded) {
            this.showRoles();
        } else {
            this.hideRoles();
        }
    }

    showRoles() {
        console.log('[v0] Loading more roles');
        console.log('[v0] Hidden roles container before:', this.hiddenRolesContainer.className);
        
        // Make hidden roles visible
        this.hiddenRolesContainer.classList.add('visible');
        
        console.log('[v0] Hidden roles container after:', this.hiddenRolesContainer.className);

        // Update button state
        this.loadMoreBtn.classList.add('expanded');
        const btnText = this.loadMoreBtn.querySelector('.btn-text');
        if (btnText) {
            btnText.textContent = 'Show Less Roles';
        }
        console.log('[v0] Button text updated to: Show Less Roles');

        // Add smooth scroll animation
        setTimeout(() => {
            this.hiddenRolesContainer.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }, 100);

        // Attach event listeners to newly visible roles
        this.attachRoleListeners();
    }

    hideRoles() {
        console.log('[v0] Hiding extra roles');
        
        // Hide additional roles
        this.hiddenRolesContainer.classList.remove('visible');

        // Update button state
        this.loadMoreBtn.classList.remove('expanded');
        this.loadMoreBtn.querySelector('.btn-text').textContent = 'Load More Roles';
    }

    attachRoleListeners() {
        // Get all role items (both visible and newly visible)
        const allRoleItems = document.querySelectorAll('.exec-role-item');
        
        allRoleItems.forEach((item) => {
            const header = item.querySelector('.role-header');
            
            // Avoid duplicate listeners by checking if already added
            if (!item.dataset.listenerAttached) {
                if (header) {
                    header.addEventListener('click', (e) => {
                        if (e.target.closest('.role-member-search') || e.target.closest('.role-dropdown')) {
                            return;
                        }
                        e.stopPropagation();
                        this.toggleRoleExpanded(item);
                    });
                }

                const actionBtn = item.querySelector('.role-action-button');
                if (actionBtn) {
                    actionBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.handleActionClick(item, actionBtn);
                    });
                    
                }

                item.dataset.listenerAttached = 'true';
            }
        });
    }

    toggleRoleExpanded(item) {
        const allItems = document.querySelectorAll('.exec-role-item');
        
        // Close all other expanded items
        allItems.forEach((otherItem) => {
            if (otherItem !== item && otherItem.classList.contains('expanded')) {
                this.closeRoleExpanded(otherItem);
            }
        });

        // Toggle current item
        if (item.classList.contains('expanded')) {
            this.closeRoleExpanded(item);
        } else {
            this.openRoleExpanded(item);
        }
    }

    openRoleExpanded(item) {
        item.classList.add('expanded');
        const expandedContent = item.querySelector('.role-expanded-content');
        if (expandedContent) {
            expandedContent.classList.remove('hidden');
        }
    }

    closeRoleExpanded(item) {
        item.classList.remove('expanded');
        const expandedContent = item.querySelector('.role-expanded-content');
        if (expandedContent) {
            expandedContent.classList.add('hidden');
        }
    }

    handleActionClick(item, btn) {
        const dropdown = item.querySelector('.role-dropdown');
        if (dropdown) {
            if (dropdown.classList.contains('hidden')) {
                dropdown.classList.remove('hidden');
                const searchInput = item.querySelector('.role-member-search');
                if (searchInput) {
                    setTimeout(() => searchInput.focus(), 100);
                }
            } else {
                dropdown.classList.add('hidden');
            }
        }
    }
}

// Leaders Section - Mobile Modal Functionality

// Initialize Executive Cards


// Get elements for leaders modal
const viewMoreBtn = document.getElementById("viewMoreLeadersBtn");
const modal = document.getElementById("leadersModal");
const modalOverlay = document.getElementById("modalOverlay");
const modalCloseBtn = document.getElementById("modalCloseBtn");

// Open modal
function openModal() {
    modal.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent background scrolling

    // Add entrance animation
    setTimeout(() => {
        modal.style.opacity = "1";
    }, 10);
}

// Close modal
function closeModal() {
    modal.style.opacity = "0";

    setTimeout(() => {
        modal.classList.remove("active");
        document.body.style.overflow = ""; // Restore scrolling
    }, 300);
}

// Event listeners
if (viewMoreBtn && modal) {
    viewMoreBtn.addEventListener("click", openModal);
    modalCloseBtn.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", closeModal);

    // Close on escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("active")) {
            closeModal();
        }
    });

    // Prevent modal content clicks from closing modal
    const modalContent = modal.querySelector(".modal-content");
    if (modalContent) {
        modalContent.addEventListener("click", (e) => {
            e.stopPropagation();
        });
    }

    // Handle window resize
    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Close modal if resized to desktop view
            if (window.innerWidth > 768 && modal.classList.contains("active")) {
                closeModal();
            }
        }, 250);
    });
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Smooth scroll to section
function smoothScrollToElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ViewManager, MinistrySearch, ModalManager };
}

// ==========================================
// EXECUTIVE SECTION - CARD GRID FUNCTIONALITY
// ==========================================

class ExecutiveCards {
    constructor() {
        this.cardsGrid = document.getElementById('execCardsGrid');
        this.cards = document.querySelectorAll('.exec-card');
        this.searchInput = document.getElementById('execSearchInput');
        this.resultsSection = document.getElementById('execResultsSection');
        this.saveBtn = document.getElementById('execSaveBtn');
        this.resultsCloseBtn = document.getElementById('resultsCloseBtn');
        this.activeDropdown = null;
        this.init();
    }

    init() {
        if (!this.cardsGrid) return;

        // Initialize each card
        this.cards.forEach((card) => {
            this.initCard(card);
        });

        // Global click to close dropdowns
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.exec-card')) {
                this.closeAllDropdowns();
            }
        });

        // Executive search functionality
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.searchExecutives(e.target.value);
            });
        }

        // Save button - show results
        if (this.saveBtn) {
            this.saveBtn.addEventListener('click', () => {
                this.showResults();
            });
        }

        // Close results button
        if (this.resultsCloseBtn) {
            this.resultsCloseBtn.addEventListener('click', () => {
                this.hideResults();
            });
        }

        // Escape key to close dropdowns
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllDropdowns();
            }
        });
    }

    initCard(card) {
        const actionBtn = card.querySelector('.exec-card-action');
        const dropdown = card.querySelector('.exec-card-dropdown');
        const closeBtn = dropdown?.querySelector('.dropdown-close');
        const searchInput = dropdown?.querySelector('.dropdown-search');
        const options = dropdown?.querySelectorAll('.dropdown-option');

        // Action button click (Change/Assign)
        if (actionBtn && dropdown) {
            actionBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown(card, dropdown);
            });
        }

        // Close button in dropdown
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeDropdown(dropdown);
            });
        }

        // Search within dropdown
        if (searchInput && options) {
            searchInput.addEventListener('input', (e) => {
                this.filterOptions(e.target.value, options);
            });

            searchInput.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // Option selection
        if (options) {
            options.forEach((option) => {
                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.selectMember(card, option, dropdown);
                });
            });
        }
    }

    toggleDropdown(card, dropdown) {
        const isOpen = !dropdown.classList.contains('hidden');

        // Close all other dropdowns first
        this.closeAllDropdowns();

        if (!isOpen) {
            dropdown.classList.remove('hidden');
            this.activeDropdown = dropdown;
            
            // Focus search input
            const searchInput = dropdown.querySelector('.dropdown-search');
            if (searchInput) {
                setTimeout(() => searchInput.focus(), 100);
            }
        }
    }

    closeDropdown(dropdown) {
        dropdown.classList.add('hidden');
        if (this.activeDropdown === dropdown) {
            this.activeDropdown = null;
        }
    }

    closeAllDropdowns() {
        this.cards.forEach((card) => {
            const dropdown = card.querySelector('.exec-card-dropdown');
            if (dropdown) {
                dropdown.classList.add('hidden');
            }
        });
        this.activeDropdown = null;
    }

    filterOptions(query, options) {
        const lowerQuery = query.toLowerCase();

        options.forEach((option) => {
            const name = option.querySelector('.option-name')?.textContent.toLowerCase() || '';
            const meta = option.querySelector('.option-meta')?.textContent.toLowerCase() || '';

            if (name.includes(lowerQuery) || meta.includes(lowerQuery)) {
                option.style.display = 'flex';
            } else {
                option.style.display = 'none';
            }
        });
    }

    selectMember(card, option, dropdown) {
        const memberName = option.querySelector('.option-name')?.textContent || '';
        const initials = this.getInitials(memberName);

        // Update card display
        const avatar = card.querySelector('.member-avatar');
        const displayName = card.querySelector('.member-display-name');
        const statusBadge = card.querySelector('.exec-card-status');
        const actionBtn = card.querySelector('.exec-card-action');
        const cardIcon = card.querySelector('.exec-card-icon');
        const memberSection = card.querySelector('.exec-card-member');

        if (avatar) {
            avatar.textContent = initials;
            avatar.classList.remove('empty');
        }

        if (displayName) {
            displayName.textContent = memberName;
        }

        if (memberSection) {
            memberSection.classList.remove('empty');
        }

        if (statusBadge) {
            statusBadge.textContent = 'Assigned';
            statusBadge.classList.remove('unassigned');
            statusBadge.classList.add('assigned');
        }

        if (actionBtn) {
            actionBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                Change
            `;
            actionBtn.classList.remove('assign');
        }

        if (cardIcon) {
            cardIcon.classList.remove('empty');
        }

        // Update card classes
        card.classList.remove('unassigned');
        card.classList.add('assigned');
        card.setAttribute('data-assigned', 'true');
        card.setAttribute('data-member', memberName);

        // Mark selected option
        const allOptions = dropdown.querySelectorAll('.dropdown-option');
        allOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');

        // Close dropdown
        this.closeDropdown(dropdown);

        // Update stats
        this.updateStats();
    }

    getInitials(name) {
        return name.split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('');
    }

    updateStats() {
        const totalRoles = document.querySelectorAll('.exec-card').length;
        const assignedCount = document.querySelectorAll('.exec-card.assigned').length;
        const unassignedCount = totalRoles - assignedCount;

        const totalEl = document.getElementById('totalRoles');
        const assignedEl = document.getElementById('assignedCount');
        const unassignedEl = document.getElementById('unassignedCount');

        if (totalEl) totalEl.textContent = totalRoles;
        if (assignedEl) assignedEl.textContent = assignedCount;
        if (unassignedEl) unassignedEl.textContent = unassignedCount;
    }

    searchExecutives(query) {
        const lowerQuery = query.toLowerCase();

        this.cards.forEach((card) => {
            const roleTitle = card.querySelector('.exec-card-title')?.textContent.toLowerCase() || '';
            const memberName = card.querySelector('.member-display-name')?.textContent.toLowerCase() || '';

            if (roleTitle.includes(lowerQuery) || memberName.includes(lowerQuery)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    showResults() {
        if (this.resultsSection) {
            this.resultsSection.style.display = 'block';
            this.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    hideResults() {
        if (this.resultsSection) {
            this.resultsSection.style.display = 'none';
        }
    }
}

// ==========================================
// SUBCOMMITTEE MANAGER - Ministry Selector
// ==========================================

class SubcommitteeManager {
    constructor() {
        this.ministrySearch = document.getElementById('ministrySearch');
        this.ministriesGridContainer = document.getElementById('ministriesGridContainer');
        this.selectedMinistryView = document.getElementById('selectedMinistryView');
        this.selectedMinistryTitle = document.getElementById('selectedMinistryTitle');
        this.subcomRoleGrids = document.querySelectorAll('[id="subcomRoleGrid"]');
        this.backBtn = document.getElementById('backToMinistries');
        this.selectedMinistry = null;

        this.init();
    }

    init() {
        console.log('[v0] SubcommitteeManager initialized');

        // Ministry item buttons
        const ministryItems = this.ministriesGridContainer.querySelectorAll('.ministry-item');
        ministryItems.forEach(item => {
            const btn = item.querySelector('.ministry-item-btn');
            if (btn) {
                btn.addEventListener('click', () => {
                    const ministry = item.getAttribute('data-ministry');
                    this.selectMinistry(ministry);
                });
            }
        });

        // Back button
        if (this.backBtn) {
            this.backBtn.addEventListener('click', () => {
                this.backToMinistries();
            });
        }

        // Search functionality
        if (this.ministrySearch) {
            this.ministrySearch.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Initialize all role cards from HTML (for all ministries)
        this.initializeAllRoleCards();
    }

    handleSearch(query) {
        const searchTerm = query.toLowerCase();
        const ministryItems = this.ministriesGridContainer.querySelectorAll('.ministry-item');

        ministryItems.forEach(item => {
            const name = item.getAttribute('data-ministry').toLowerCase();
            item.style.display = name.includes(searchTerm) ? 'flex' : 'none';
        });
    }

    selectMinistry(ministry) {
        this.selectedMinistry = ministry;
        this.selectedMinistryTitle.textContent = ministry;
        
        // Hide grid, show role cards
        this.ministriesGridContainer.style.display = 'none';
        this.selectedMinistryView.style.display = 'block';
        
        // Show the correct role grid for this ministry
        this.showMinistryRoles(ministry);
    }

    showMinistryRoles(ministry) {
        // Hide all role grids
        this.subcomRoleGrids.forEach(grid => {
            grid.style.display = 'none';
        });

        // Show the grid matching this ministry
        const gridToShow = Array.from(this.subcomRoleGrids).find(grid => 
            grid.getAttribute('data-ministry') === ministry
        );
        
        if (gridToShow) {
            gridToShow.style.display = 'grid';
        }
    }

    initializeAllRoleCards() {
        // Initialize role cards for all visible ministry grids
        this.subcomRoleGrids.forEach(grid => {
            const roleCards = grid.querySelectorAll('.exec-role-item');
            roleCards.forEach(card => {
                this.attachRoleCardListeners(card);
            });
        });
    }

    attachRoleCardListeners(card) {
        const header = card.querySelector('.role-header');
        const expandedContent = card.querySelector('.role-expanded-content');
        const actionBtn = card.querySelector('.role-action-button');

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

        if (actionBtn) {
            actionBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const currentState = actionBtn.getAttribute('data-button-state');
                if (currentState === 'initial') {
                    this.transitionToActive(card);
                }
            });
        }

        const memberOptions = card.querySelectorAll('.member-option');
        memberOptions.forEach(option => {
            option.addEventListener('click', () => {
                this.selectMemberForRole(card, option.getAttribute('data-member'));
            });
        });

        const changeBtn = card.querySelector('.change-selection-btn');
        if (changeBtn) {
            changeBtn.addEventListener('click', () => {
                this.transitionToActive(card);
            });
        }

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

        dropdowns.forEach(dd => dd.style.display = 'none');

        const activeDropdown = card.querySelector('[data-state="active"]');
        if (activeDropdown) {
            activeDropdown.style.display = 'block';
            const searchInput = activeDropdown.querySelector('.role-member-search');
            if (searchInput) searchInput.focus();
        }

        // Show the action button again when transitioning back to active
        if (actionBtn) {
            actionBtn.style.display = 'block';
        }

        actionBtn.setAttribute('data-button-state', 'active');
    }

    selectMemberForRole(card, memberName) {
        const actionBtn = card.querySelector('.role-action-button');
        const dropdowns = card.querySelectorAll('.role-dropdown');

        dropdowns.forEach(dd => dd.style.display = 'none');

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
            // If no assigned-member-display exists yet, create it (when converting from unassigned to assigned)
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

        console.log(`[v0] Member "${memberName}" assigned to role "${card.getAttribute('data-role')}"`);
        card.setAttribute('data-assigned', 'true');
        card.setAttribute('data-member', memberName);
    }

    backToMinistries() {
        this.ministriesGridContainer.style.display = 'grid';
        this.selectedMinistryView.style.display = 'none';
        this.ministrySearch.value = '';
        this.selectedMinistry = null;
    }
}
