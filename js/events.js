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
// INITIALIZE ON DOM READY
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  new Slideshow("weekly-slideshow", slideshowData.weekly)
  new Slideshow("past-slideshow", slideshowData.past)
  new Slideshow("upcoming-slideshow", slideshowData.upcoming)

  // Initialize all functionality
  initTimeTabs()
  initDaySelector()
  initHamburger()
  initExpandableEventCards()
  autoSelectCurrentDay()
  initPastArchiveSystem()
  initUpcomingFilterSystem()

  // Initialize Upcoming tab with default results
  updateUpcomingResults()
})

function autoSelectCurrentDay() {
  const dayButtons = document.querySelectorAll(".day-btn")
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
  const today = new Date().getDay()
  const todayName = days[today]

  dayButtons.forEach((btn) => {
    if (btn.getAttribute("data-day") === todayName) {
      btn.click()
    }
  })
}

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
// PAST EVENTS ARCHIVE SYSTEM
// ==========================================
function initPastArchiveSystem() {
  const segmentedBtns = document.querySelectorAll(".segmented-btn")
  const filterGroups = document.querySelectorAll(".filter-group")
  const chips = document.querySelectorAll(".chip")

  // Selects
  const serviceYearSelect = document.getElementById("spiritual-year")
  const serviceSemesterSelect = document.getElementById("semester")
  const eventYearSelect = document.getElementById("event-year")
  const eventSemesterSelect = document.getElementById("event-semester")
  const eventSemesterLabel = document.getElementById("event-semester-label")

  console.log("[v0] Initializing Past Archive System")

  function updateResults() {
    const activeMode = document.querySelector(".segmented-btn.active")?.getAttribute("data-target") || "services"
    const results = document.querySelectorAll(".past-event-card")
    const now = new Date()
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(now.getMonth() - 3)

    console.log("[v0] Updating results for mode:", activeMode)

    results.forEach((card) => {
      const cardType = card.getAttribute("data-type")
      const cardDateStr = card.getAttribute("data-date")
      const cardDate = cardDateStr ? new Date(cardDateStr) : new Date()

      let isVisible = true
      if (activeMode === "services" && cardType !== "service") isVisible = false
      if (activeMode === "events" && cardType !== "event") isVisible = false

      card.style.display = isVisible ? "flex" : "none"

      // Evaluation Window Logic
      const isEligible = cardDate >= threeMonthsAgo
      const footer = card.querySelector(".card-footer")

      if (isEligible) {
        card.classList.remove("evaluation-closed")
        if (footer && !footer.innerHTML.includes("btn-evaluate")) {
          footer.innerHTML = `<button class="btn-evaluate">Evaluate ${cardType === "service" ? "Service" : "Event"}</button>`
        }
      } else {
        card.classList.add("evaluation-closed")
        if (footer && !footer.classList.contains("status-message")) {
          footer.innerHTML = `
            <div class="status-message">
              <strong>Evaluation Closed</strong>
              <p>Available for events within the last 3 months</p>
            </div>
          `
        }
      }
    })
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

      updateResults()
    })
  })

  // Chip Selection
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const parent = chip.parentElement
      if (parent.classList.contains("single-select")) {
        parent.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"))
        chip.classList.add("active")
      } else {
        chip.classList.toggle("active")
      }
      updateResults()
    })
  })

  // Select Listeners
  const allSelects = [serviceYearSelect, serviceSemesterSelect, eventYearSelect, eventSemesterSelect].filter(Boolean)
  allSelects.forEach((select) => {
    select.addEventListener("change", updateResults)
  })

  // Event-specific semester dependency
  if (eventYearSelect && eventSemesterSelect && eventSemesterLabel) {
    eventYearSelect.addEventListener("change", () => {
      const hasValue = eventYearSelect.value !== ""
      eventSemesterSelect.disabled = !hasValue
      eventSemesterLabel.classList.toggle("disabled", !hasValue)
    })
  }

  // Initial update
  updateResults()
}

function updateUpcomingResults() {
  console.log("[v0] Upcoming results initialized")
  // The actual filtering is now handled by initUpcomingFilterSystem
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
