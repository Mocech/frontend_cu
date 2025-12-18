// Leaders Section - Mobile Modal Functionality

document.addEventListener("DOMContentLoaded", () => {
  // Get elements
  const viewMoreBtn = document.getElementById("viewMoreLeadersBtn")
  const modal = document.getElementById("leadersModal")
  const modalOverlay = document.getElementById("modalOverlay")
  const modalCloseBtn = document.getElementById("modalCloseBtn")

  // Check if elements exist (mobile only)
  if (!viewMoreBtn || !modal) {
    return // Exit if elements don't exist (desktop view)
  }

  // Open modal
  function openModal() {
    modal.classList.add("active")
    document.body.style.overflow = "hidden" // Prevent background scrolling

    // Add entrance animation
    setTimeout(() => {
      modal.style.opacity = "1"
    }, 10)
  }

  // Close modal
  function closeModal() {
    modal.style.opacity = "0"

    setTimeout(() => {
      modal.classList.remove("active")
      document.body.style.overflow = "" // Restore scrolling
    }, 300)
  }

  // Event listeners
  viewMoreBtn.addEventListener("click", openModal)
  modalCloseBtn.addEventListener("click", closeModal)
  modalOverlay.addEventListener("click", closeModal)

  // Close on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal()
    }
  })

  // Prevent modal content clicks from closing modal
  const modalContent = modal.querySelector(".modal-content")
  if (modalContent) {
    modalContent.addEventListener("click", (e) => {
      e.stopPropagation()
    })
  }

  // Handle window resize
  let resizeTimer
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      // Close modal if resized to desktop view
      if (window.innerWidth > 768 && modal.classList.contains("active")) {
        closeModal()
      }
    }, 250)
  })
})
