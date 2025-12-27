// Mobile Navigation Toggle
// Mobile Navigation Toggle
const hamburger = document.getElementById("hamburger")
const navMenu = document.getElementById("navMenu")

if (hamburger && navMenu) {
  // Toggle menu
  hamburger.addEventListener("click", () => {
    const isOpen = hamburger.classList.toggle("active")
    navMenu.classList.toggle("active")

    // Accessibility
    hamburger.setAttribute("aria-expanded", isOpen)
  })

  // Close menu when clicking a link
  const navLinks = navMenu.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")
      hamburger.setAttribute("aria-expanded", "false")
    })
  })

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")
      hamburger.setAttribute("aria-expanded", "false")
    }
  })
}

// Segmented Switch Toggle
const switchOptions = document.querySelectorAll(".switch-option")
const contentAreas = document.querySelectorAll(".content-area")

switchOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const targetContent = option.getAttribute("data-content")

    // Update active state on buttons
    switchOptions.forEach((opt) => opt.classList.remove("active"))
    option.classList.add("active")

    // Update visible content
    contentAreas.forEach((area) => {
      area.classList.remove("active")
      if (area.id === targetContent) {
        area.classList.add("active")
      }
    })
  })
})

// Smooth scrolling for anchor links
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

// Navbar scroll effect
let lastScroll = 0
const navbar = document.getElementById("navbar")

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset

  if (currentScroll <= 0) {
    navbar.style.boxShadow = "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
  } else {
    navbar.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
  }

  lastScroll = currentScroll
})
