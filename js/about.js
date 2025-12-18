// About Page Interactions

document.addEventListener("DOMContentLoaded", () => {
  const expandHistoryBtn = document.getElementById("expandHistoryBtn")
  const fullHistory = document.getElementById("fullHistory")

  if (expandHistoryBtn) {
    expandHistoryBtn.addEventListener("click", () => {
      fullHistory.classList.toggle("active")
      const isActive = fullHistory.classList.contains("active")
      expandHistoryBtn.innerHTML = isActive
        ? '<span>Hide Full History</span><i class="fas fa-chevron-up"></i>'
        : '<span>Read Full History</span><i class="fas fa-chevron-down"></i>'
    })
  }

  const viewAllLeadersBtn = document.getElementById("viewAllLeadersBtn")
  const leadersModal = document.getElementById("leadersModal")
  const modalOverlay = document.getElementById("modalOverlay")
  const modalCloseBtn = document.getElementById("modalCloseBtn")

  if (viewAllLeadersBtn) {
    viewAllLeadersBtn.addEventListener("click", () => {
      leadersModal.classList.add("active")
      document.body.style.overflow = "hidden"
    })
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", () => {
      leadersModal.classList.remove("active")
      document.body.style.overflow = "auto"
    })
  }

  if (modalOverlay) {
    modalOverlay.addEventListener("click", () => {
      leadersModal.classList.remove("active")
      document.body.style.overflow = "auto"
    })
  }

  // Hamburger menu toggle
  const hamburger = document.getElementById("hamburger")
  const navMenu = document.getElementById("navMenu")

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active")
    })
  }

  // Close menu when clicking on a link
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active")
    })
  })
})
