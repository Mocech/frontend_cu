// ==========================================
// SLIDESHOW FUNCTIONALITY
// ==========================================

// Sample data for slideshows (hardcoded) - Replace with AJAX call
const slideshowData = {
  weekly: [
    {
      id: 1,
      name: "Monday Nurture Class",
      image: "one.JPG",
      description: "Growth through biblical teaching",
    },
    {
      id: 2,
      name: "Friday Evening Worship",
      image: "crowd.JPG",
      description: "Powerful worship experience",
    },
    {
      id: 3,
      name: "Sunday Main Service",
      image: "two.JPG",
      description: "Our flagship spiritual gathering",
    },
    {
      id: 4,
      name: "Wednesday Midweek",
      image: "one.JPG",
      description: "Reconnect and refuel your faith",
    },
    {
      id: 5,
      name: "Youth Fellowship Thursday",
      image: "crowd.JPG",
      description: "Community and connection",
    },
  ],
  past: [
    {
      id: 1,
      name: "Power of Purpose - Nov 2025",
      image: "two.JPG",
      description: "Exploring divine purpose",
    },
    {
      id: 2,
      name: "Spiritual Awakening Conference",
      image: "crowd.JPG",
      description: "Multi-day transformative event",
    },
    {
      id: 3,
      name: "Encounter with Christ - Oct 2025",
      image: "one.JPG",
      description: "Deep spiritual experience",
    },
    {
      id: 4,
      name: "Community Outreach - Sep 2025",
      image: "crowd.JPG",
      description: "Serving our neighborhoods",
    },
    {
      id: 5,
      name: "Summer Fellowship Camp",
      image: "two.JPG",
      description: "Memorable community building",
    },
  ],
  upcoming: [
    {
      id: 1,
      name: "Encounter with Christ - Dec 27",
      image: "one.JPG",
      description: "This Friday's service",
    },
    {
      id: 2,
      name: "Living in Purpose - Dec 29",
      image: "crowd.JPG",
      description: "Sunday's main service",
    },
    {
      id: 3,
      name: "New Year Revival - Jan 3",
      image: "two.JPG",
      description: "Fresh start in faith",
    },
    {
      id: 4,
      name: "Bible Study & Discussion",
      image: "one.JPG",
      description: "Deep scripture exploration",
    },
    {
      id: 5,
      name: "Winter Spiritual Retreat",
      image: "crowd.JPG",
      description: "Multi-day retreat experience",
    },
  ],
}

class Slideshow {
  constructor(containerId, data) {
    this.container = document.getElementById(containerId)
    this.data = data
    this.currentIndex = 0
    this.autoPlayInterval = null
    this.isAutoPlaying = true

    if (this.container) {
      this.init()
    }
  }

  init() {
    this.renderSlides()
    this.renderDots()
    this.attachEventListeners()
    this.startAutoPlay()
  }

  renderSlides() {
    const track = this.container.querySelector(".slides-track")
    track.innerHTML = ""

    this.data.forEach((item, index) => {
      const slide = document.createElement("div")
      slide.className = `slideshow-slide ${index === 0 ? "active" : ""}`
      slide.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="slide-image">
        <div class="slide-overlay">
          <div class="slide-content">
            <h3 class="slide-title">${item.name}</h3>
            <div class="slide-actions">
              <button class="slide-btn slide-btn-primary" onclick="handleViewMore(${item.id}, '${this.container.id}')">
                <span>View More</span>
              </button>
              <button class="slide-btn slide-btn-secondary" onclick="handleGallery(${item.id}, '${this.container.id}')">
                <span>Gallery</span>
              </button>
            </div>
          </div>
        </div>
      `
      track.appendChild(slide)
    })
  }

  renderDots() {
    const dotsContainer = this.container.querySelector(".slideshow-dots")
    dotsContainer.innerHTML = ""

    this.data.forEach((_, index) => {
      const dot = document.createElement("button")
      dot.className = `slideshow-dot ${index === 0 ? "active" : ""}`
      dot.setAttribute("aria-label", `Go to slide ${index + 1}`)
      dot.addEventListener("click", () => this.goToSlide(index))
      dotsContainer.appendChild(dot)
    })
  }

  attachEventListeners() {
    const prevBtn = this.container.querySelector(".slideshow-btn.prev")
    const nextBtn = this.container.querySelector(".slideshow-btn.next")
    const wrapper = this.container.querySelector(".slideshow-wrapper")

    if (prevBtn) prevBtn.addEventListener("click", () => this.prevSlide())
    if (nextBtn) nextBtn.addEventListener("click", () => this.nextSlide())

    // Pause on hover
    if (wrapper) {
      wrapper.addEventListener("mouseenter", () => this.stopAutoPlay())
      wrapper.addEventListener("mouseleave", () => this.startAutoPlay())
    }

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.prevSlide()
      if (e.key === "ArrowRight") this.nextSlide()
    })
  }

  goToSlide(index) {
    this.currentIndex = index
    this.updateSlides()
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.data.length
    this.updateSlides()
    this.resetAutoPlay()
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.data.length) % this.data.length
    this.updateSlides()
    this.resetAutoPlay()
  }

  updateSlides() {
    const slides = this.container.querySelectorAll(".slideshow-slide")
    const dots = this.container.querySelectorAll(".slideshow-dot")

    slides.forEach((slide, index) => {
      slide.classList.toggle("active", index === this.currentIndex)
    })

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === this.currentIndex)
    })
  }

  startAutoPlay() {
    if (this.isAutoPlaying) {
      this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000)
    }
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval)
    }
  }

  resetAutoPlay() {
    this.stopAutoPlay()
    this.startAutoPlay()
  }
}

function handleViewMore(itemId, slideshowId) {
  console.log(`View More clicked for item ${itemId} in slideshow ${slideshowId}`)
  // TODO: Implement navigation to detailed view
  // window.location.href = `/event-details/${itemId}`;
}

function handleGallery(itemId, slideshowId) {
  console.log(`Gallery clicked for item ${itemId} in slideshow ${slideshowId}`)
  // TODO: Implement gallery modal or navigation
  // openGalleryModal(itemId);
}

// ==========================================
// UPCOMING EVENTS FILTERING SYSTEM
// ==========================================

function initUpcomingFilterSystem() {
  const segmentedBtns = document.querySelectorAll("#upcoming-content .segmented-btn")
  const filterGroups = document.querySelectorAll("#upcoming-filters .filter-group")
  const serviceChips = document.querySelectorAll("#upcoming-service-period-chips .chip")
  const eventChips = document.querySelectorAll("#upcoming-event-period-chips .chip")

  console.log("[Upcoming] Initializing Upcoming Filter System")

  function updateUpcomingResults() {
    const activeMode =
      document.querySelector("#upcoming-content .segmented-btn.active")?.getAttribute("data-target") ||
      "upcoming-services"
    const results = document.querySelectorAll("#upcoming-results .past-event-card")

    // Get active period filter
    let activePeriod = "1month" // default
    if (activeMode === "upcoming-services") {
      const activeChip = document.querySelector("#upcoming-service-period-chips .chip.active")
      activePeriod = activeChip?.getAttribute("data-value") || "1month"
    } else {
      const activeChip = document.querySelector("#upcoming-event-period-chips .chip.active")
      activePeriod = activeChip?.getAttribute("data-value") || "1month"
    }

    console.log("[Upcoming] Mode:", activeMode, "Period:", activePeriod)

    // Calculate date ranges
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    let maxDate
    if (activePeriod === "1week") {
      maxDate = new Date(today)
      maxDate.setDate(today.getDate() + 7)
    } else if (activePeriod === "1month") {
      maxDate = new Date(today)
      maxDate.setMonth(today.getMonth() + 1)
    } else if (activePeriod === "2month") {
      maxDate = new Date(today)
      maxDate.setMonth(today.getMonth() + 2)
    } else if (activePeriod === "semester") {
      maxDate = new Date(today)
      maxDate.setMonth(today.getMonth() + 4) // ~4 months for a semester
    }

    results.forEach((card) => {
      const cardType = card.getAttribute("data-type")
      const cardDateStr = card.getAttribute("data-date")
      const cardDate = cardDateStr ? new Date(cardDateStr) : new Date()

      let isVisible = true

      // Filter by type (service vs event)
      if (activeMode === "upcoming-services" && cardType !== "service") {
        isVisible = false
      }
      if (activeMode === "upcoming-events" && cardType !== "event") {
        isVisible = false
      }

      // Filter by date range
      if (isVisible && cardDate > today && cardDate <= maxDate) {
        isVisible = true
      } else if (isVisible) {
        isVisible = false
      }

      card.style.display = isVisible ? "flex" : "none"
    })

    // Update count or empty state if needed
    const visibleCount = Array.from(results).filter((card) => card.style.display !== "none").length
    console.log("[Upcoming] Visible cards:", visibleCount)
  }

  // Segmented Control
  segmentedBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      segmentedBtns.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")

      const target = btn.getAttribute("data-target")
      filterGroups.forEach((group) => {
        group.classList.remove("active")
        if (group.id === `${target}-filters`) {
          group.classList.add("active")
        }
      })

      updateUpcomingResults()
    })
  })

  // Service Period Chips
  serviceChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      serviceChips.forEach((c) => c.classList.remove("active"))
      chip.classList.add("active")
      updateUpcomingResults()
    })
  })

  // Event Period Chips
  eventChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      eventChips.forEach((c) => c.classList.remove("active"))
      chip.classList.add("active")
      updateUpcomingResults()
    })
  })

  // Initial update
  updateUpcomingResults()
}

// ==========================================
// REDESIGNED PAST EVENTS FILTERING SYSTEM
// Following progressive disclosure UX principles
// ==========================================

function initRedesignedPastArchiveSystem() {
  const filterTriggerBtn = document.getElementById("filterTriggerBtn")
  const filtersPanel = document.getElementById("filtersPanel")
  const moreFiltersToggle = document.getElementById("moreFiltersToggle")
  const advancedFiltersContent = document.getElementById("advancedFiltersContent")
  const clearFiltersBtn = document.getElementById("clearFiltersBtn")
  const activeFiltersBar = document.getElementById("activeFiltersBar")
  const filtersSummary = document.getElementById("filtersSummary")

  const filterChips = document.querySelectorAll(".filter-chip")
  const filterSelects = document.querySelectorAll(".filter-select")

  let activeFilters = {
    contentType: "all",
    timeRange: "6months",
    serviceType: ["sunday", "friday"],
    spiritualYear: "",
    semester: "",
    eventYear: "",
    eventSemester: "",
  }

  console.log("[v0] Initializing Redesigned Past Archive System")

  // Toggle main filters panel
  if (filterTriggerBtn && filtersPanel) {
    filterTriggerBtn.addEventListener("click", () => {
      const isExpanded = filterTriggerBtn.getAttribute("aria-expanded") === "true"
      filterTriggerBtn.setAttribute("aria-expanded", !isExpanded)
      filtersPanel.setAttribute("aria-hidden", isExpanded)
    })
  }

  // Toggle advanced filters
  if (moreFiltersToggle && advancedFiltersContent) {
    moreFiltersToggle.addEventListener("click", () => {
      const isExpanded = moreFiltersToggle.getAttribute("aria-expanded") === "true"
      moreFiltersToggle.setAttribute("aria-expanded", !isExpanded)
      advancedFiltersContent.setAttribute("aria-hidden", isExpanded)
    })
  }

  // Handle filter chip clicks
  filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const filterType = chip.getAttribute("data-filter")
      const filterValue = chip.getAttribute("data-value")
      const isMultiSelect = chip.classList.contains("multi-select")

      if (isMultiSelect) {
        // Multi-select behavior (for service types)
        chip.classList.toggle("active")
        updateServiceTypeFilter()
      } else {
        // Single-select behavior (for content type and time range)
        const siblings = chip.parentElement.querySelectorAll(".filter-chip")
        siblings.forEach((s) => s.classList.remove("active"))
        chip.classList.add("active")

        if (filterType === "content-type") {
          activeFilters.contentType = filterValue
          // Update filters panel data attribute to show/hide relevant advanced filters
          if (filtersPanel) {
            filtersPanel.setAttribute("data-content-type", filterValue)
          }
        } else if (filterType === "time-range") {
          activeFilters.timeRange = filterValue
        }
      }

      updateResults()
      updateFiltersSummary()
    })
  })

  // Handle select dropdowns
  filterSelects.forEach((select) => {
    select.addEventListener("change", (e) => {
      const selectId = e.target.id
      const value = e.target.value

      switch (selectId) {
        case "spiritualYear":
          activeFilters.spiritualYear = value
          break
        case "semester":
          activeFilters.semester = value
          break
        case "eventYear":
          activeFilters.eventYear = value
          break
        case "eventSemester":
          activeFilters.eventSemester = value
          break
      }

      updateResults()
      updateFiltersSummary()
    })
  })

  // Clear all filters
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", () => {
      // Reset to defaults
      activeFilters = {
        contentType: "all",
        timeRange: "6months",
        serviceType: ["sunday", "friday"],
        spiritualYear: "",
        semester: "",
        eventYear: "",
        eventSemester: "",
      }

      // Reset UI
      filterChips.forEach((chip) => {
        const filterType = chip.getAttribute("data-filter")
        const filterValue = chip.getAttribute("data-value")

        if (filterType === "content-type" && filterValue === "all") {
          chip.classList.add("active")
        } else if (filterType === "time-range" && filterValue === "6months") {
          chip.classList.add("active")
        } else if (chip.classList.contains("multi-select")) {
          chip.classList.add("active")
        } else {
          chip.classList.remove("active")
        }
      })

      filterSelects.forEach((select) => {
        select.value = ""
      })

      if (filtersPanel) {
        filtersPanel.setAttribute("data-content-type", "all")
      }

      updateResults()
      updateFiltersSummary()
    })
  }

  function updateServiceTypeFilter() {
    const serviceTypeChips = document.querySelectorAll('.filter-chip[data-filter="service-type"]')
    activeFilters.serviceType = []

    serviceTypeChips.forEach((chip) => {
      if (chip.classList.contains("active")) {
        activeFilters.serviceType.push(chip.getAttribute("data-value"))
      }
    })
  }

  function updateFiltersSummary() {
    if (!filtersSummary || !activeFiltersBar) return

    const parts = []

    // Content type
    if (activeFilters.contentType !== "all") {
      const contentText = activeFilters.contentType.charAt(0).toUpperCase() + activeFilters.contentType.slice(1)
      parts.push(contentText)
    }

    // Time range
    const timeRangeMap = {
      "3months": "Last 3 months",
      "6months": "Last 6 months",
      "1year": "Last year",
    }
    if (activeFilters.timeRange) {
      parts.push(timeRangeMap[activeFilters.timeRange])
    }

    // Show active filters bar if filters are applied
    const hasActiveFilters =
      activeFilters.contentType !== "all" ||
      activeFilters.spiritualYear ||
      activeFilters.semester ||
      activeFilters.eventYear ||
      activeFilters.eventSemester

    if (hasActiveFilters || parts.length > 0) {
      activeFiltersBar.style.display = "flex"
      filtersSummary.textContent = parts.length > 0 ? parts.join(" • ") : "All items"
    } else {
      activeFiltersBar.style.display = "none"
    }
  }

  function updateResults() {
    const results = document.querySelectorAll("#past-results .past-event-card")
    const now = new Date()
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(now.getMonth() - 3)

    // Calculate time range
    const minDate = new Date()
    if (activeFilters.timeRange === "3months") {
      minDate.setMonth(minDate.getMonth() - 3)
    } else if (activeFilters.timeRange === "6months") {
      minDate.setMonth(minDate.getMonth() - 6)
    } else if (activeFilters.timeRange === "1year") {
      minDate.setFullYear(minDate.getFullYear() - 1)
    }

    console.log("[v0] Updating results:", activeFilters)

    results.forEach((card) => {
      const cardType = card.getAttribute("data-type")
      const cardDateStr = card.getAttribute("data-date")
      const cardDate = cardDateStr ? new Date(cardDateStr) : new Date()

      let isVisible = true

      // Filter by content type
      if (activeFilters.contentType === "services" && cardType !== "service") {
        isVisible = false
      }
      if (activeFilters.contentType === "events" && cardType !== "event") {
        isVisible = false
      }

      // Filter by time range
      if (isVisible && cardDate < minDate) {
        isVisible = false
      }

      // Service-specific filters
      if (isVisible && cardType === "service" && activeFilters.serviceType.length > 0) {
        const serviceType = card.getAttribute("data-service-type")
        if (serviceType && !activeFilters.serviceType.includes(serviceType)) {
          isVisible = false
        }
      }

      card.style.display = isVisible ? "flex" : "none"

      // Evaluation eligibility
      const isEligible = cardDate >= threeMonthsAgo
      const footer = card.querySelector(".card-footer")

      if (isEligible) {
        card.classList.remove("evaluation-closed")
        if (footer && !footer.innerHTML.includes("btn-evaluate")) {
          footer.innerHTML = `<button class="btn-evaluate">Evaluate ${cardType === "service" ? "Service" : "Event"}</button>`
        }
      } else {
        card.classList.add("evaluation-closed")
        if (footer) {
          footer.innerHTML = `
            <div class="status-message">
              <strong>Evaluation Closed</strong>
              <p>Available for events within the last 3 months</p>
            </div>
          `
        }
      }
    })

    // Log visible count
    const visibleCount = Array.from(results).filter((card) => card.style.display !== "none").length
    console.log("[v0] Visible cards:", visibleCount)
  }
}

// ==========================================
// COMPACT FILTER SYSTEM - PAST EVENTS
// ==========================================

function initPastCompactFilters() {
  const moreFiltersBtn = document.getElementById("past-more-filters-btn")
  const advancedFiltersPanel = document.getElementById("past-advanced-filters")
  const clearFiltersBtn = document.getElementById("past-clear-filters")
  const filtersSummary = document.getElementById("past-filters-summary")

  if (moreFiltersBtn && advancedFiltersPanel) {
    moreFiltersBtn.addEventListener("click", () => {
      const isOpen = advancedFiltersPanel.classList.contains("open")

      if (isOpen) {
        advancedFiltersPanel.classList.remove("open")
        moreFiltersBtn.classList.remove("expanded")
      } else {
        advancedFiltersPanel.classList.add("open")
        moreFiltersBtn.classList.add("expanded")
      }
    })
  }

  const typeChips = document.querySelectorAll("#past-content .chip-inline")
  const periodChips = document.querySelectorAll("#past-advanced-filters .chip-advanced")

  typeChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      typeChips.forEach((c) => c.classList.remove("active"))
      chip.classList.add("active")

      const selectedType = chip.getAttribute("data-type")
      const contentGroups = document.querySelectorAll("#past-content .content-group")

      contentGroups.forEach((group) => {
        const groupType = group.getAttribute("data-group-type")

        if (selectedType === "all") {
          group.style.display = "block"
        } else if (selectedType === groupType) {
          group.style.display = "block"
        } else {
          group.style.display = "none"
        }
      })

      updatePastFilterSummary()
    })
  })

  periodChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      periodChips.forEach((c) => c.classList.remove("active"))
      chip.classList.add("active")
      updatePastFilterSummary()
    })
  })

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", () => {
      typeChips.forEach((chip) => {
        if (chip.getAttribute("data-type") === "all") {
          chip.classList.add("active")
        } else {
          chip.classList.remove("active")
        }
      })

      periodChips.forEach((chip) => {
        if (chip.getAttribute("data-period") === "6months") {
          chip.classList.add("active")
        } else {
          chip.classList.remove("active")
        }
      })

      // Show all content groups
      const contentGroups = document.querySelectorAll("#past-content .content-group")
      contentGroups.forEach((group) => {
        group.style.display = "block"
      })

      updatePastFilterSummary()
    })
  }

  function updatePastFilterSummary() {
    const activeType = document.querySelector("#past-content .chip-inline.active")?.getAttribute("data-type") || "all"
    const activePeriod =
      document.querySelector("#past-advanced-filters .chip-advanced.active")?.getAttribute("data-period") || "6months"

    const parts = []

    if (activeType !== "all") {
      parts.push(activeType.charAt(0).toUpperCase() + activeType.slice(1))
    } else {
      parts.push("All")
    }

    const periodLabels = {
      "3months": "Last 3 months",
      "6months": "Last 6 months",
      "1year": "Last year",
      all: "All time",
    }

    if (activePeriod) {
      parts.push(periodLabels[activePeriod])
    }

    const summaryText = document.getElementById("past-summary-text")
    if (summaryText) {
      summaryText.textContent = parts.join(" • ")
    }

    // Show/hide summary
    const hasFilters = activeType !== "all" || activePeriod !== "6months"
    if (filtersSummary) {
      filtersSummary.style.display = hasFilters ? "flex" : "none"
    }
  }

  updatePastFilterSummary()
}

// ==========================================
// COMPACT FILTER SYSTEM - UPCOMING EVENTS
// ==========================================

function initUpcomingCompactFilters() {
  const moreFiltersBtn = document.getElementById("upcoming-more-filters-btn")
  const advancedFiltersPanel = document.getElementById("upcoming-advanced-filters")
  const clearFiltersBtn = document.getElementById("upcoming-clear-filters")
  const filtersSummary = document.getElementById("upcoming-filters-summary")

  if (moreFiltersBtn && advancedFiltersPanel) {
    moreFiltersBtn.addEventListener("click", () => {
      const isOpen = advancedFiltersPanel.classList.contains("open")

      if (isOpen) {
        advancedFiltersPanel.classList.remove("open")
        moreFiltersBtn.classList.remove("expanded")
      } else {
        advancedFiltersPanel.classList.add("open")
        moreFiltersBtn.classList.add("expanded")
      }
    })
  }

  const typeChips = document.querySelectorAll("#upcoming-content .chip-inline")
  const periodChips = document.querySelectorAll("#upcoming-advanced-filters .chip-advanced")

  typeChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      typeChips.forEach((c) => c.classList.remove("active"))
      chip.classList.add("active")

      const selectedType = chip.getAttribute("data-type")
      const contentGroups = document.querySelectorAll("#upcoming-content .content-group")

      contentGroups.forEach((group) => {
        const groupType = group.getAttribute("data-group-type")

        if (selectedType === "all") {
          group.style.display = "block"
        } else if (selectedType === groupType) {
          group.style.display = "block"
        } else {
          group.style.display = "none"
        }
      })

      updateUpcomingFilterSummary()
    })
  })

  periodChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      periodChips.forEach((c) => c.classList.remove("active"))
      chip.classList.add("active")
      updateUpcomingFilterSummary()
    })
  })

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", () => {
      typeChips.forEach((chip) => {
        if (chip.getAttribute("data-type") === "all") {
          chip.classList.add("active")
        } else {
          chip.classList.remove("active")
        }
      })

      periodChips.forEach((chip) => {
        if (chip.getAttribute("data-period") === "1week") {
          chip.classList.add("active")
        } else {
          chip.classList.remove("active")
        }
      })

      // Show all content groups
      const contentGroups = document.querySelectorAll("#upcoming-content .content-group")
      contentGroups.forEach((group) => {
        group.style.display = "block"
      })

      updateUpcomingFilterSummary()
    })
  }

  function updateUpcomingFilterSummary() {
    const activeType =
      document.querySelector("#upcoming-content .chip-inline.active")?.getAttribute("data-type") || "all"
    const activePeriod =
      document.querySelector("#upcoming-advanced-filters .chip-advanced.active")?.getAttribute("data-period") || "1week"

    const parts = []

    if (activeType !== "all") {
      parts.push(activeType.charAt(0).toUpperCase() + activeType.slice(1))
    } else {
      parts.push("All")
    }

    const periodLabels = {
      "1week": "Next week",
      "2weeks": "Next 2 weeks",
      "1month": "Next month",
      all: "All upcoming",
    }

    if (activePeriod) {
      parts.push(periodLabels[activePeriod])
    }

    const summaryText = document.getElementById("upcoming-summary-text")
    if (summaryText) {
      summaryText.textContent = parts.join(" • ")
    }

    // Show/hide summary
    const hasFilters = activeType !== "all" || activePeriod !== "1week"
    if (filtersSummary) {
      filtersSummary.style.display = hasFilters ? "flex" : "none"
    }
  }

  updateUpcomingFilterSummary()
}

// ==========================================
// COURSERA-STYLE DROPDOWN FILTER SYSTEM
// ==========================================

function initCoureraStyleFilters(tabId) {
  const prefix = tabId === "past-content" ? "past" : "upcoming"

  // Selectors
  const filterTriggerBtn = document.getElementById(`${prefix}-filter-trigger`)
  const filterCount = document.getElementById(`${prefix}-filter-count`)
  const activeSummary = document.getElementById(`${prefix}-active-summary`)
  const clearBtn = document.getElementById(`${prefix}-clear-btn`)

  const typeBtn = document.getElementById(`${prefix}-type-btn`)
  const typeMenu = document.getElementById(`${prefix}-type-menu`)
  const durationBtn = document.getElementById(`${prefix}-duration-btn`)
  const durationMenu = document.getElementById(`${prefix}-duration-menu`)

  const activeFilters = {
    type: "all",
    duration: prefix === "past" ? "6months" : "1month",
    serviceTypes: [],
  }

  // Service type filter (only for past events)
  let serviceTypeBtn, serviceTypeMenu
  if (prefix === "past") {
    serviceTypeBtn = document.getElementById(`${prefix}-service-type-btn`)
    serviceTypeMenu = document.getElementById(`${prefix}-service-type-menu`)
    activeFilters.serviceTypes = ["sunday", "friday"]
  }

  console.log(`[v0] Initializing Coursera-style filters for ${prefix}`)

  // Toggle dropdown visibility
  function toggleDropdown(btn, menu) {
    const isExpanded = btn.getAttribute("aria-expanded") === "true"

    // Close all other dropdowns
    closeAllDropdowns()

    if (!isExpanded) {
      btn.setAttribute("aria-expanded", "true")
      menu.setAttribute("aria-hidden", "false")
    }
  }

  function closeAllDropdowns() {
    document.querySelectorAll(".filter-dropdown-btn").forEach((btn) => {
      btn.setAttribute("aria-expanded", "false")
    })
    document.querySelectorAll(".filter-dropdown-menu").forEach((menu) => {
      menu.setAttribute("aria-hidden", "true")
    })
  }

  // Close dropdowns when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".filter-dropdown-wrapper")) {
      closeAllDropdowns()
    }
  })

  // Type filter
  if (typeBtn && typeMenu) {
    typeBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      toggleDropdown(typeBtn, typeMenu)
    })

    typeMenu.querySelectorAll('input[type="radio"]').forEach((radio) => {
      radio.addEventListener("change", () => {
        activeFilters.type = radio.value
        updateResults()
        updateSummary()
        closeAllDropdowns()
      })
    })
  }

  // Duration filter
  if (durationBtn && durationMenu) {
    durationBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      toggleDropdown(durationBtn, durationMenu)
    })

    durationMenu.querySelectorAll('input[type="radio"]').forEach((radio) => {
      radio.addEventListener("change", () => {
        activeFilters.duration = radio.value
        updateResults()
        updateSummary()
        closeAllDropdowns()
      })
    })
  }

  // Service type filter (checkbox - multiple selection)
  if (serviceTypeBtn && serviceTypeMenu) {
    serviceTypeBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      toggleDropdown(serviceTypeBtn, serviceTypeMenu)
    })

    serviceTypeMenu.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        activeFilters.serviceTypes = Array.from(serviceTypeMenu.querySelectorAll('input[type="checkbox"]:checked')).map(
          (cb) => cb.value,
        )
        updateResults()
        updateSummary()
      })
    })
  }

  // Clear all filters
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      // Reset to defaults
      activeFilters.type = "all"
      activeFilters.duration = prefix === "past" ? "6months" : "1month"
      if (prefix === "past") {
        activeFilters.serviceTypes = ["sunday", "friday"]
      }

      // Reset UI
      typeMenu.querySelector('input[value="all"]').checked = true
      durationMenu.querySelector(`input[value="${activeFilters.duration}"]`).checked = true

      if (serviceTypeMenu) {
        serviceTypeMenu.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
          cb.checked = activeFilters.serviceTypes.includes(cb.value)
        })
      }

      updateResults()
      updateSummary()
      closeAllDropdowns()
    })
  }

  // Update summary text
  function updateSummary() {
    const durationMap = {
      "3months": "Last 3 months",
      "6months": "Last 6 months",
      "1year": "Last year",
      "1week": "Next 1 week",
      "1month": "Next 1 month",
      "2months": "Next 2 months",
      semester: "This semester",
    }

    const summaryText = durationMap[activeFilters.duration] || ""

    if (activeSummary) {
      activeSummary.textContent = summaryText
    }

    // Count active filters (non-default selections)
    let count = 0
    if (activeFilters.type !== "all") count++
    if (prefix === "past" && activeFilters.serviceTypes.length !== 2) count++
    if (prefix === "upcoming" && activeFilters.duration !== "1month") count++
    if (prefix === "past" && activeFilters.duration !== "6months") count++

    if (filterCount) {
      filterCount.textContent = `(${count})`
    }
  }

  // Update visible results
  function updateResults() {
    const resultsContainer = document.getElementById(prefix === "past" ? "past-results" : "upcoming-results")
    if (!resultsContainer) return

    const cards = resultsContainer.querySelectorAll(".past-event-card")
    const now = new Date()

    // Calculate date range
    let minDate, maxDate

    if (prefix === "past") {
      maxDate = now
      minDate = new Date()

      switch (activeFilters.duration) {
        case "3months":
          minDate.setMonth(minDate.getMonth() - 3)
          break
        case "6months":
          minDate.setMonth(minDate.getMonth() - 6)
          break
        case "1year":
          minDate.setFullYear(minDate.getFullYear() - 1)
          break
      }
    } else {
      minDate = now
      maxDate = new Date()

      switch (activeFilters.duration) {
        case "1week":
          maxDate.setDate(maxDate.getDate() + 7)
          break
        case "1month":
          maxDate.setMonth(maxDate.getMonth() + 1)
          break
        case "2months":
          maxDate.setMonth(maxDate.getMonth() + 2)
          break
        case "semester":
          maxDate.setMonth(maxDate.getMonth() + 4)
          break
      }
    }

    console.log(`[v0] Filtering ${prefix}:`, activeFilters)

    cards.forEach((card) => {
      const cardType = card.getAttribute("data-type")
      const cardDateStr = card.getAttribute("data-date")
      const cardDate = cardDateStr ? new Date(cardDateStr) : new Date()
      const serviceType = card.getAttribute("data-service-type")

      let isVisible = true

      // Filter by type
      if (activeFilters.type === "services" && cardType !== "service") {
        isVisible = false
      }
      if (activeFilters.type === "events" && cardType !== "event") {
        isVisible = false
      }

      // Filter by date range
      if (prefix === "past") {
        if (cardDate < minDate || cardDate > maxDate) {
          isVisible = false
        }
      } else {
        if (cardDate < minDate || cardDate > maxDate) {
          isVisible = false
        }
      }

      // Filter by service type (past only)
      if (prefix === "past" && cardType === "service" && serviceType) {
        if (activeFilters.serviceTypes.length > 0 && !activeFilters.serviceTypes.includes(serviceType)) {
          isVisible = false
        }
      }

      card.style.display = isVisible ? "flex" : "none"
    })

    const visibleCount = Array.from(cards).filter((card) => card.style.display !== "none").length
    console.log(`[v0] ${prefix} visible cards:`, visibleCount)
  }

  // Initialize
  updateSummary()
  updateResults()
}

// ==========================================
// INITIALIZE ON DOM READY
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  new Slideshow("weekly-slideshow", slideshowData.weekly)
  new Slideshow("past-slideshow", slideshowData.past)
  new Slideshow("upcoming-slideshow", slideshowData.upcoming)

  // Initialize all functionality
  initTimeTabs()
  initDaySelector()
  autoSelectCurrentDay()
  initHamburger()
  initExpandableEventCards()

  initPastCompactFilters()
  initUpcomingCompactFilters()

  // Initialize Coursera-style filters for Past and Upcoming tabs
  initCoureraStyleFilters("past-content")
  initCoureraStyleFilters("upcoming-content")
})

// ==========================================
// TIME TABS - Past, Weekly, Upcoming
// ==========================================
function initTimeTabs() {
  const timeTabs = document.querySelectorAll(".time-tab")
  const tabContents = document.querySelectorAll(".tab-content")

  timeTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetTab = tab.getAttribute("data-tab")

      timeTabs.forEach((t) => t.classList.remove("active"))
      tabContents.forEach((content) => content.classList.remove("active"))

      tab.classList.add("active")
      const targetContent = document.getElementById(`${targetTab}-content`)
      if (targetContent) {
        targetContent.classList.add("active")
      }
    })
  })
}

// ==========================================
// DAY SELECTOR - Weekly Events
// ==========================================
function initDaySelector() {
  const dayButtons = document.querySelectorAll(".day-btn")
  const dayEventContainers = document.querySelectorAll(".day-events")
  const daySelector = document.querySelector(".day-selector")

  dayButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedDay = button.getAttribute("data-day")

      // Update active button
      dayButtons.forEach((btn) => btn.classList.remove("active"))
      button.classList.add("active")

      // Update visible day events
      dayEventContainers.forEach((container) => {
        container.classList.remove("active")
        if (container.getAttribute("data-day") === selectedDay) {
          container.classList.add("active")
        }
      })

      // Scroll active button into view on mobile
      if (window.innerWidth <= 768 && daySelector) {
        const buttonRect = button.getBoundingClientRect()
        const selectorRect = daySelector.getBoundingClientRect()
        const scrollLeft = daySelector.scrollLeft
        const buttonCenter = buttonRect.left - selectorRect.left + scrollLeft + buttonRect.width / 2
        const selectorCenter = daySelector.offsetWidth / 2

        daySelector.scrollTo({
          left: buttonCenter - selectorCenter,
          behavior: "smooth",
        })
      }
    })
  })
}

// ==========================================
// EXPANDABLE EVENT CARDS (Weekly & Past)
// ==========================================
function initExpandableEventCards() {
  // Weekly Schedule Cards
  const weeklyCardItems = document.querySelectorAll(".event-card-compact")
  weeklyCardItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      const eventCard = item.closest(".event-card-expandable")
      if (!eventCard) return
      toggleCardExpansion(eventCard)
    })
  })

  // Past Activities Cards - Refined expansion logic for the new badge design
  const pastCards = document.querySelectorAll(".past-event-card")
  pastCards.forEach((card) => {
    const detailsTrigger = card.querySelector(".details-trigger")
    const titleTrigger = card.querySelector(".event-title")

    const handleToggle = (e) => {
      e.stopPropagation()
      toggleCardExpansion(card)
    }

    if (detailsTrigger) detailsTrigger.addEventListener("click", handleToggle)
    if (titleTrigger) titleTrigger.addEventListener("click", handleToggle)

    // Also allow clicking the card itself if not clicking another action
    card.addEventListener("click", (e) => {
      if (e.target.closest(".action-badge") || e.target.closest(".btn-evaluate") || e.target.tagName === "A") {
        return
      }
      toggleCardExpansion(card)
    })
  })
}

function toggleCardExpansion(card) {
  const isExpanded = card.classList.contains("expanded")

  // Close other cards in the same container
  const container = card.parentElement
  if (container) {
    container.querySelectorAll(".expanded").forEach((c) => {
      if (c !== card) c.classList.remove("expanded")
    })
  }

  card.classList.toggle("expanded")

  if (!isExpanded) {
    setTimeout(() => {
      card.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }, 350)
  }
}

// ==========================================
// HAMBURGER MENU
// ==========================================
function initHamburger() {
  const hamburger = document.getElementById("hamburger")
  const navMenu = document.getElementById("navMenu")

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active")
      navMenu.classList.toggle("active")
    })

    const navLinks = navMenu.querySelectorAll(".nav-link")
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active")
        navMenu.classList.remove("active")
      })
    })

    document.addEventListener("click", (e) => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove("active")
        navMenu.classList.remove("active")
      }
    })
  }
}

// ==========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href")
    if (href !== "#" && href.length > 1) {
      e.preventDefault()
      const target = document.querySelector(href)
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    }
  })
})

window.jumpToPast = () => {
  const pastTab = document.querySelector('.time-tab[data-tab="past"]')
  if (pastTab) {
    pastTab.click()
    const container = document.querySelector(".time-context-section")
    if (container) {
      container.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }
}

function autoSelectCurrentDay() {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
  const today = new Date().getDay() // 0 = Sunday, 1 = Monday, etc.
  const currentDay = days[today]

  const currentDayButton = document.querySelector(`.day-btn[data-day="${currentDay}"]`)
  const currentDayEvents = document.querySelector(`.day-events[data-day="${currentDay}"]`)

  if (currentDayButton && currentDayEvents) {
    // Remove any existing active states
    document.querySelectorAll(".day-btn").forEach((btn) => btn.classList.remove("active"))
    document.querySelectorAll(".day-events").forEach((events) => events.classList.remove("active"))

    // Set current day as active
    currentDayButton.classList.add("active")
    currentDayEvents.classList.add("active")
  }
}
