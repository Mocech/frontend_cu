// Pending Approval Page - Interactivity

// Navigate to home page
function goToHome() {
  window.location.href = "/"
}

// Logout user
function logout() {
  localStorage.removeItem("userEmail")
  localStorage.removeItem("authToken")
  window.location.href = "/login"
}

// Add entrance animations when page loads
document.addEventListener("DOMContentLoaded", () => {
  const card = document.querySelector(".approval-card")

  if (card) {
    card.style.opacity = "0"
    card.style.transform = "translateY(10px)"

    setTimeout(() => {
      card.style.transition = "opacity 0.6s ease, transform 0.6s ease"
      card.style.opacity = "1"
      card.style.transform = "translateY(0)"
    }, 100)
  }

  const timelineSteps = document.querySelectorAll(".timeline-step")
  timelineSteps.forEach((step, index) => {
    step.style.opacity = "0"
    step.style.transform = "scale(0.9)"

    setTimeout(
      () => {
        step.style.transition = "opacity 0.4s ease, transform 0.4s ease"
        step.style.opacity = "1"
        step.style.transform = "scale(1)"
      },
      400 + index * 80,
    )
  })

  const infoCards = document.querySelectorAll(".info-card")
  infoCards.forEach((card, index) => {
    card.style.opacity = "0"
    card.style.transform = "translateY(8px)"

    setTimeout(
      () => {
        card.style.transition = "opacity 0.4s ease, transform 0.4s ease"
        card.style.opacity = "1"
        card.style.transform = "translateY(0)"
      },
      700 + index * 60,
    )
  })

  const timelineHorizontal = document.querySelector(".timeline-horizontal")
  if (timelineHorizontal && window.innerWidth <= 640) {
    // Center the active step on load
    setTimeout(() => {
      const activeStep = timelineHorizontal.querySelector(".timeline-step.active")
      if (activeStep) {
        activeStep.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
      }
    }, 800)
  }
})
