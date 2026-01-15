document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("verificationForm")
  const codeInput = document.getElementById("verificationCode")
  const resendBtn = document.getElementById("resendBtn")
  const editRegBtn = document.getElementById("editRegBtn")
  const userEmailDisplay = document.getElementById("userEmail")

  // Get email from URL params or localStorage
  const urlParams = new URLSearchParams(window.location.search)
  const userEmail = urlParams.get("email") || localStorage.getItem("userEmail") || "user@example.com"

  // Display the email
  userEmailDisplay.textContent = userEmail

  codeInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6)
  })

  codeInput.focus()

  // Form submission with improved feedback
  form.addEventListener("submit", (e) => {
    e.preventDefault()

    const code = codeInput.value.trim()
    if (code.length !== 6) {
      console.log("[v0] Invalid code length:", code.length)
      alert("Please enter a valid 6-digit code")
      return
    }

    const verifyBtn = form.querySelector(".btn-verify")
    const buttonContent = verifyBtn.innerHTML
    verifyBtn.disabled = true
    verifyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Verifying...</span>'

    // Simulate API call to verify code
    setTimeout(() => {
      console.log("[v0] Code verified successfully:", code)
      // In production, verify with backend
      localStorage.setItem("emailVerified", "true")
      verifyBtn.innerHTML = '<i class="fas fa-check-circle"></i><span>Email Verified</span>'

      // Redirect after brief delay
      setTimeout(() => {
        window.location.href = "index.html"
      }, 1000)
    }, 1500)
  })

  let resendCountdown = 0
  const COUNTDOWN_DURATION = 60

  function startResendCountdown() {
    resendCountdown = COUNTDOWN_DURATION
    resendBtn.disabled = true

    const resendText = document.getElementById("resendText")
    const resendCountdownEl = document.getElementById("resendCountdown")
    const countdownTimer = document.getElementById("countdownTimer")

    resendText.style.display = "none"
    resendCountdownEl.style.display = "inline"

    const countdownInterval = setInterval(() => {
      resendCountdown--
      countdownTimer.textContent = resendCountdown

      if (resendCountdown === 0) {
        clearInterval(countdownInterval)
        resendBtn.disabled = false
        resendText.style.display = "inline"
        resendCountdownEl.style.display = "none"
      }
    }, 1000)
  }

  resendBtn.addEventListener("click", () => {
    console.log("[v0] Resending code to:", userEmail)
    // Simulate API call to resend code
    alert(`Verification code resent to ${userEmail}`)
    startResendCountdown()
  })

  // Edit registration button
  editRegBtn.addEventListener("click", () => {
    console.log("[v0] Opening edit registration form")
    window.location.href = "onboarding.html"
  })
})
