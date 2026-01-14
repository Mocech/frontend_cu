// Password Reset and Verification Logic

document.addEventListener("DOMContentLoaded", () => {
    // Check which page we're on
    const pageType = detectPageType()
  
    if (pageType === "step1") {
      initializeStep1()
    } else if (pageType === "step2") {
      initializeStep2()
    }
  })
  
  // Detect which page we're on
  function detectPageType() {
    const pathname = window.location.pathname
    if (pathname.includes("password-reset-step2")) return "step2"
    if (pathname.includes("password-reset-step1")) return "step1"
    if (pathname.includes("verify-email")) return "verify"
    return null
  }
  
  // ============================================
  // STEP 1: CODE VERIFICATION
  // ============================================
  
  function initializeStep1() {
    initializeEmailDisplay()
    setupOTPInputs()
    startCountdown()
    setupEventListenersStep1()
  }
  
  // Initialize email display from localStorage or URL params
  function initializeEmailDisplay() {
    const admissionNumber = localStorage.getItem("admissionNumber")
    if (admissionNumber) {
      const generatedEmail = generateEmail(admissionNumber)
      document.getElementById("displayEmail").textContent = generatedEmail
    }
  }
  
  // Generate email from admission number
  function generateEmail(admissionNumber) {
    const numericPart = admissionNumber.replace(/\D/g, "")
    const emailNumber = numericPart.substring(numericPart.length - 5) || numericPart
    return `${emailNumber}@student.embuni.ac.ke`
  }
  
  // Setup OTP input boxes with auto-focus logic
  function setupOTPInputs() {
    const otpInputs = document.querySelectorAll(".otp-input")
  
    otpInputs.forEach((input, index) => {
      input.addEventListener("input", (e) => {
        // Only allow numeric input
        e.target.value = e.target.value.replace(/[^0-9]/g, "")
  
        // Move to next input on digit entry
        if (e.target.value.length === 1 && index < otpInputs.length - 1) {
          otpInputs[index + 1].focus()
        }
  
        // Enable verify button when all fields filled
        const allFilled = Array.from(otpInputs).every((inp) => inp.value.length === 1)
        const verifyBtn = document.getElementById("verifyCodeBtn")
        if (verifyBtn) {
          verifyBtn.disabled = !allFilled
        }
      })
  
      // Handle backspace to move to previous input
      input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !input.value && index > 0) {
          otpInputs[index - 1].focus()
        }
      })
  
      // Prevent non-numeric input
      input.addEventListener("keypress", (e) => {
        if (!/[0-9]/.test(e.key)) {
          e.preventDefault()
        }
      })
    })
  }
  
  // Countdown timer
  function startCountdown() {
    let countdownSeconds = 60
    const countdownElement = document.getElementById("countdown")
    const resendBtn = document.getElementById("resendBtn")
  
    const savedTime = localStorage.getItem("passwordResetCountdownEnd")
    if (savedTime) {
      const timeRemaining = Math.max(0, Math.ceil((Number.parseInt(savedTime) - Date.now()) / 1000))
      if (timeRemaining > 0) {
        countdownSeconds = timeRemaining
      } else {
        localStorage.removeItem("passwordResetCountdownEnd")
        if (resendBtn) resendBtn.disabled = false
        return
      }
    }
  
    localStorage.setItem("passwordResetCountdownEnd", Date.now() + countdownSeconds * 1000)
  
    const updateCountdown = setInterval(() => {
      countdownSeconds--
      if (countdownElement) {
        countdownElement.textContent = countdownSeconds
      }
  
      if (countdownSeconds <= 0) {
        clearInterval(updateCountdown)
        if (resendBtn) {
          resendBtn.disabled = false
        }
        if (countdownElement) {
          countdownElement.textContent = "60"
        }
        localStorage.removeItem("passwordResetCountdownEnd")
      }
    }, 1000)
  }
  
  // Event listeners for Step 1
  function setupEventListenersStep1() {
    const verifyBtn = document.getElementById("verifyCodeBtn")
    const resendBtn = document.getElementById("resendBtn")
    const backBtn = document.getElementById("backBtn")
  
    if (verifyBtn) {
      verifyBtn.addEventListener("click", verifyCode)
    }
  
    if (resendBtn) {
      resendBtn.addEventListener("click", resendCode)
    }
  
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        window.location.href = "login.html"
      })
    }
  }
  
  // Verify OTP code
  function verifyCode() {
    const otpInputs = document.querySelectorAll(".otp-input")
    const code = Array.from(otpInputs)
      .map((input) => input.value)
      .join("")
  
    if (code.length !== 6) {
      showNotification("Please enter all 6 digits", "error")
      return
    }
  
    // Show loading state
    const verifyBtn = document.getElementById("verifyCodeBtn")
    const originalText = verifyBtn.textContent
    verifyBtn.disabled = true
    verifyBtn.textContent = "Verifying..."
  
    // Simulate API call
    setTimeout(() => {
      // Store code for next step
      localStorage.setItem("verificationCode", code)
  
      // Redirect to password reset step 2
      window.location.href = "password-reset-step2.html"
    }, 1500)
  }
  
  // Resend code
  function resendCode() {
    const resendBtn = document.getElementById("resendBtn")
    resendBtn.disabled = true
  
    const originalText = resendBtn.textContent
    resendBtn.textContent = "Sending..."
  
    setTimeout(() => {
      resendBtn.textContent = originalText
      showNotification("Verification code has been resent to your email!", "success")
      startCountdown()
    }, 1500)
  }
  
  // ============================================
  // STEP 2: PASSWORD RESET
  // ============================================
  
  function initializeStep2() {
    setupPasswordFields()
    setupEventListenersStep2()
  }
  
  // Setup password fields with strength meter and visibility toggle
  function setupPasswordFields() {
    const newPasswordInput = document.getElementById("newPassword")
    const confirmPasswordInput = document.getElementById("confirmPassword")
    const toggleButtons = document.querySelectorAll(".toggle-password")
  
    // Password strength checking
    if (newPasswordInput) {
      newPasswordInput.addEventListener("input", checkPasswordStrength)
    }
  
    // Password match checking
    if (confirmPasswordInput) {
      confirmPasswordInput.addEventListener("input", checkPasswordMatch)
    }
  
    // Toggle password visibility
    toggleButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault()
        const input = btn.parentElement.querySelector(".form-input")
        const type = input.type === "password" ? "text" : "password"
        input.type = type
      })
    })
  }
  
  // Check password strength
  function checkPasswordStrength(e) {
    const password = e.target.value
    const strengthBar = document.querySelector(".strength-bar")
    const strengthLabel = document.getElementById("strengthLabel")
  
    let strength = "weak"
    const hasLength = password.length >= 8
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
  
    // Update requirements checkmarks
    updateRequirement("req-length", hasLength)
    updateRequirement("req-upper", hasUpper)
    updateRequirement("req-lower", hasLower)
    updateRequirement("req-number", hasNumber)
  
    // Calculate strength
    const meetsRequirements = hasLength + hasUpper + hasLower + hasNumber
    if (meetsRequirements === 4) {
      strength = "strong"
    } else if (meetsRequirements === 3) {
      strength = "good"
    } else if (meetsRequirements >= 2) {
      strength = "fair"
    } else {
      strength = "weak"
    }
  
    // Update strength meter
    if (strengthBar) {
      strengthBar.className = "strength-bar " + strength
    }
  
    if (strengthLabel) {
      strengthLabel.textContent = strength.charAt(0).toUpperCase() + strength.slice(1)
    }
  
    // Update submit button state
    updateSubmitButtonState()
  }
  
  // Update requirement indicator
  function updateRequirement(id, met) {
    const requirement = document.getElementById(id)
    if (requirement) {
      if (met) {
        requirement.classList.add("met")
      } else {
        requirement.classList.remove("met")
      }
    }
  }
  
  // Check if passwords match
  function checkPasswordMatch(e) {
    const newPassword = document.getElementById("newPassword").value
    const confirmPassword = e.target.value
    const matchText = document.getElementById("matchText")
  
    if (confirmPassword.length > 0) {
      matchText.classList.add("show")
      if (newPassword === confirmPassword) {
        matchText.textContent = "Passwords match!"
        matchText.classList.add("success")
      } else {
        matchText.textContent = "Passwords do not match"
        matchText.classList.remove("success")
      }
    } else {
      matchText.classList.remove("show")
    }
  
    updateSubmitButtonState()
  }
  
  // Update submit button state
  function updateSubmitButtonState() {
    const newPassword = document.getElementById("newPassword").value
    const confirmPassword = document.getElementById("confirmPassword").value
    const submitBtn = document.getElementById("submitBtn")
  
    const hasLength = newPassword.length >= 8
    const hasUpper = /[A-Z]/.test(newPassword)
    const hasLower = /[a-z]/.test(newPassword)
    const hasNumber = /[0-9]/.test(newPassword)
    const passwordsMatch = newPassword === confirmPassword && newPassword.length > 0
  
    const isValid = hasLength && hasUpper && hasLower && hasNumber && passwordsMatch
  
    if (submitBtn) {
      submitBtn.disabled = !isValid
    }
  }
  
  // Event listeners for Step 2
  function setupEventListenersStep2() {
    const resetForm = document.getElementById("resetPasswordForm")
    const backBtn = document.getElementById("backBtn")
  
    if (resetForm) {
      resetForm.addEventListener("submit", resetPassword)
    }
  
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        window.location.href = "login.html"
      })
    }
  }
  
  // Reset password
  function resetPassword(e) {
    e.preventDefault()
  
    const newPassword = document.getElementById("newPassword").value
    const confirmPassword = document.getElementById("confirmPassword").value
    const submitBtn = document.getElementById("submitBtn")
  
    // Validate
    if (newPassword !== confirmPassword) {
      showNotification("Passwords do not match", "error")
      return
    }
  
    // Show loading state
    const originalText = submitBtn.textContent
    submitBtn.disabled = true
    submitBtn.textContent = "Updating..."
  
    // Simulate API call
    setTimeout(() => {
      // Clear stored data
      localStorage.removeItem("admissionNumber")
      localStorage.removeItem("generatedEmail")
      localStorage.removeItem("verificationCode")
      localStorage.removeItem("passwordResetCountdownEnd")
  
      showNotification("Password updated successfully! Redirecting to login...", "success")
  
      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = "login.html"
      }, 2000)
    }, 1500)
  }
  
  // ============================================
  // VERIFY EMAIL PAGE
  // ============================================
  
  // Setup OTP for verify-email page
  function setupVerifyEmailOTP() {
    const otpInputs = document.querySelectorAll(".otp-input")
  
    otpInputs.forEach((input, index) => {
      input.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, "")
  
        if (e.target.value.length === 1 && index < otpInputs.length - 1) {
          otpInputs[index + 1].focus()
        }
      })
  
      input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !input.value && index > 0) {
          otpInputs[index - 1].focus()
        }
      })
  
      input.addEventListener("keypress", (e) => {
        if (!/[0-9]/.test(e.key)) {
          e.preventDefault()
        }
      })
    })
  }
  
  // Notification function
  function showNotification(message, type = "info") {
    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.textContent = message
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      background: ${type === "success" ? "var(--color-primary)" : type === "error" ? "var(--color-accent)" : "var(--color-primary)"};
      color: var(--color-white);
      border-radius: var(--border-radius-md);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideInRight 0.3s ease-out;
      z-index: 1000;
    `
  
    document.body.appendChild(notification)
  
    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.3s ease-out"
      setTimeout(() => notification.remove(), 300)
    }, 3000)
  }
  
  // Add CSS for notifications
  const style = document.createElement("style")
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `
  document.head.appendChild(style)
  