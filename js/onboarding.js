// Onboarding Page JavaScript

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("onboardingForm")
    const loadingOverlay = document.getElementById("loadingOverlay")
    const userGreeting = document.getElementById("userGreeting")
  
    // Get user name from URL params or localStorage (from Google signup)
    const urlParams = new URLSearchParams(window.location.search)
    const userName = urlParams.get("name") || localStorage.getItem("userName") || "Friend"
  
    // Update greeting with user's name
    if (userName && userName !== "Friend") {
      userGreeting.textContent = `Just a few more details, ${userName}!`
    }
  
    // Form submission
    form.addEventListener("submit", (e) => {
      e.preventDefault()
  
      // Show loading overlay
      loadingOverlay.classList.add("active")
  
      // Collect form data
      const formData = {
        registrationNumber: document.getElementById("registrationNumber").value,
        graduationYear: document.getElementById("graduationYear").value,
        gender: document.querySelector('input[name="gender"]:checked').value,
        userName: userName,
      }
  
      // Simulate API call
      setTimeout(() => {
        // Save to localStorage (in production, send to backend)
        localStorage.setItem("userProfile", JSON.stringify(formData))
  
        // Redirect to dashboard or home
        window.location.href = "index.html"
      }, 2000)
    })
  
    // Form validation
    const registrationInput = document.getElementById("registrationNumber")
    registrationInput.addEventListener("input", (e) => {
      // Simple validation for registration number format
      const value = e.target.value
      if (value && !value.match(/^[A-Z]{3}\d{3}-\d{4}\/\d{4}$/)) {
        // Optional: Add visual feedback for format
      }
    })
  
    // Prevent form submission if fields are empty
    const inputs = form.querySelectorAll("input, select")
    inputs.forEach((input) => {
      input.addEventListener("change", validateForm)
    })
  
    function validateForm() {
      const isValid = form.checkValidity()
      const submitBtn = form.querySelector(".btn-finish")
      submitBtn.style.opacity = isValid ? "1" : "0.6"
    }
  })
  