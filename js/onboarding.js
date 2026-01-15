// Onboarding Page - Interactivity Only
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("onboardingForm")
  const loadingOverlay = document.getElementById("loadingOverlay")
  const userNameDisplay = document.getElementById("userNameDisplay")

  const urlParams = new URLSearchParams(window.location.search)
  const userName = urlParams.get("name") || localStorage.getItem("userName") || "Friend"

  if (userName && userName !== "Friend") {
    userNameDisplay.textContent = userName.split(" ")[0]
  }

  const phoneInput = document.getElementById("phoneNumber")
  phoneInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^0-9+ -]/g, "")
  })

  const yearInput = document.getElementById("graduationYear")
  yearInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 4)
  })

  form.addEventListener("submit", (e) => {
    e.preventDefault()

    loadingOverlay.classList.add("active")

    const formData = {
      registrationNumber: document.getElementById("registrationNumber").value,
      phoneNumber: document.getElementById("phoneNumber").value,
      graduationYear: document.getElementById("graduationYear").value,
      gender: document.querySelector('input[name="gender"]:checked').value,
      userName: userName,
    }

    setTimeout(() => {
      localStorage.setItem("userProfile", JSON.stringify(formData))
      window.location.href = "index.html"
    }, 2000)
  })

  const inputs = form.querySelectorAll("input, select")
  inputs.forEach((input) => {
    input.addEventListener("change", validateForm)
    input.addEventListener("input", validateForm)
  })

  function validateForm() {
    const isValid = form.checkValidity()
    const submitBtn = form.querySelector(".btn-finish")
    submitBtn.style.opacity = isValid ? "1" : "0.6"
    submitBtn.style.pointerEvents = isValid ? "auto" : "none"
  }

  validateForm()
})
 