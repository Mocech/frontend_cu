// Event page specific JavaScript

function initializeEventCountdown() {
  const countdownTimer = document.getElementById("countdownTimer")
  const countdownValue = document.getElementById("countdownValue")
  const watchLiveBtn = document.getElementById("watchLiveBtn")

  // Sample event date - replace with actual event start time
  // For demo: next Sunday at 9:00 AM
  const eventDate = getNextSunday9AM()

  function updateCountdown() {
    const now = new Date().getTime()
    const distance = eventDate - now

    // Event is live (within the event window: Sunday 9 AM - 12 PM)
    if (isEventLive()) {
      // Hide countdown, show Watch Live button
      if (countdownTimer) countdownTimer.style.display = "none"
      if (watchLiveBtn) watchLiveBtn.style.display = "inline-flex"
      return
    }

    // Event is upcoming
    if (distance > 0) {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))

      if (countdownValue) {
        countdownValue.innerHTML = `${days}d ${hours}h ${minutes}m`
      }

      // Show countdown, hide Watch Live button
      if (countdownTimer) countdownTimer.style.display = "flex"
      if (watchLiveBtn) watchLiveBtn.style.display = "none"
    } else {
      // Event has passed
      if (countdownValue) {
        countdownValue.innerHTML = "Event Completed"
      }
      if (watchLiveBtn) watchLiveBtn.style.display = "none"
    }
  }

  // Helper: Check if event is currently live (Sunday 9 AM - 12 PM)
  function isEventLive() {
    const now = new Date()
    const day = now.getDay() // 0 = Sunday
    const hour = now.getHours()
    return day === 0 && hour >= 9 && hour < 12
  }

  // Helper: Get next Sunday at 9:00 AM
  function getNextSunday9AM() {
    const now = new Date()
    const dayOfWeek = now.getDay()
    const daysUntilSunday = dayOfWeek === 0 ? 7 : 7 - dayOfWeek
    const nextSunday = new Date(now)
    nextSunday.setDate(now.getDate() + daysUntilSunday)
    nextSunday.setHours(9, 0, 0, 0)

    // If today is Sunday and it's before 9 AM, use today
    if (dayOfWeek === 0 && now.getHours() < 9) {
      nextSunday.setDate(now.getDate())
    }

    return nextSunday.getTime()
  }

  // Update immediately and then every minute
  updateCountdown()
  setInterval(updateCountdown, 60000)
}

/* 
AJAX placeholder for backend integration:
fetch('/api/event/start-time')
  .then(res => res.json())
  .then(data => {
    // Use data.startTime to replace static eventDate
    // const eventDate = new Date(data.startTime).getTime();
  })
  .catch(err => console.error('Error fetching event time:', err));
*/

// Initialize countdown on page load
if (document.getElementById("countdownTimer")) {
  initializeEventCountdown()
}

// Smooth scroll to sections
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

// Update countdown timer (if exists)
function updateCountdown() {
  const countdownElements = document.querySelectorAll(".countdown-timer")

  countdownElements.forEach((element) => {
    const eventDate = new Date(element.dataset.eventDate)
    const now = new Date()
    const diff = eventDate - now

    if (diff > 0) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

      element.textContent = `Starts in ${days}d ${hours}h ${minutes}m`
    } else {
      element.textContent = "Event is live!"
      element.classList.add("live")
    }
  })
}

// Initialize countdown if present
if (document.querySelector(".countdown-timer")) {
  updateCountdown()
  setInterval(updateCountdown, 60000) // Update every minute
}

// Animate program items on scroll
const observerOptions = {
  threshold: 0.2,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "0"
      entry.target.style.transform = "translateX(-20px)"

      setTimeout(() => {
        entry.target.style.transition = "all 0.6s ease"
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateX(0)"
      }, 100)

      observer.unobserve(entry.target)
    }
  })
}, observerOptions)

// Observe program items
document.querySelectorAll(".program-item").forEach((item) => {
  observer.observe(item)
})

// Handle livestream status
function updateLivestreamStatus() {
  const statusDot = document.querySelector(".status-dot")
  const statusText = document.querySelector(".livestream-status span:last-child")

  // This would normally check an API endpoint
  // For now, we'll just check the day of the week
  const now = new Date()
  const day = now.getDay()
  const hour = now.getHours()

  // Sunday (0) between 9 AM and 12 PM
  if (day === 0 && hour >= 9 && hour < 12) {
    if (statusDot) {
      statusDot.style.backgroundColor = "#ef4444"
      statusDot.style.animation = "pulse 1s ease-in-out infinite"
    }
    if (statusText) {
      statusText.textContent = "LIVE NOW"
      statusText.style.color = "#ef4444"
      statusText.style.fontWeight = "700"
    }
  }
}

updateLivestreamStatus()
setInterval(updateLivestreamStatus, 60000) // Check every minute
