// Authentication Forms Handler
class AuthHandler {
  constructor() {
    this.studentForm = document.getElementById("studentForm")
    this.associateForm = document.getElementById("associateForm")
    this.loadingOverlay = document.getElementById("loadingOverlay")
    this.currentSlide = 0
    this.currentFormType = "student"
    this.init()
  }

  init() {
    // Signup forms
    if (this.studentForm) {
      this.studentForm.addEventListener("submit", (e) => this.handleSignup(e, "student"))
    }
    if (this.associateForm) {
      this.associateForm.addEventListener("submit", (e) => this.handleSignup(e, "associate"))
    }

    // Login form
    const loginForm = document.getElementById("loginForm")
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => this.handleLogin(e))
    }

    // Password visibility toggle
    this.setupPasswordToggle()

    // Carousel functionality
    this.setupCarousel()

    // Add faith-based animations on load
    this.animateOnLoad()

    // Form toggle functionality
    this.setupFormToggle()
  }

  setupFormToggle() {
    const toggleButtons = document.querySelectorAll(".form-toggle")
    const contentPanels = document.querySelectorAll(".content-panel")
    const forms = document.querySelectorAll(".auth-form")
    const backgroundLayer = document.getElementById("backgroundLayer")

    toggleButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const formType = btn.getAttribute("data-form")

        toggleButtons.forEach((b) => b.classList.remove("active"))
        btn.classList.add("active")

        contentPanels.forEach((panel) => {
          panel.classList.remove("active")
        })

        const activePanel = document.querySelector(`.${formType}-panel`)
        if (activePanel) {
          activePanel.classList.add("active")
        }

        forms.forEach((form) => {
          form.classList.remove("active-form")
        })
        const activeForm = document.getElementById(`${formType}Form`)
        if (activeForm) {
          activeForm.classList.add("active-form")
        }

        if (backgroundLayer) {
          if (formType === "student") {
            backgroundLayer.style.backgroundImage = "url('../images/technical.jpg')"
          } else if (formType === "associate") {
            backgroundLayer.style.backgroundImage = "url('../images/associates.JPG')"
          }
        }

        this.currentFormType = formType
      })
    })
  }

  setupCarousel() {
    const dots = document.querySelectorAll(".carousel-dot")
    const slides = document.querySelectorAll(".benefit-slide")

    // Auto-rotate carousel
    this.autoRotateCarousel(dots, slides)

    // Click on dots
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        this.showSlide(index, dots, slides)
      })
    })
  }

  showSlide(index, dots, slides) {
    this.currentSlide = index

    slides.forEach((slide) => {
      slide.classList.remove("active")
    })
    dots.forEach((dot) => {
      dot.classList.remove("active")
    })

    slides[index].classList.add("active")
    dots[index].classList.add("active")
  }

  autoRotateCarousel(dots, slides) {
    const totalSlides = slides.length
    setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % totalSlides
      this.showSlide(this.currentSlide, dots, slides)
    }, 5000)
  }

  handleSignup(e, formType) {
    e.preventDefault()

    let formData = {}
    if (formType === "student") {
      formData = {
        regNo: document.getElementById("studentRegNo").value,
        firstName: document.getElementById("studentFirstName").value,
        lastName: document.getElementById("studentLastName").value,
        phone: document.getElementById("studentPhone").value,
        password: document.getElementById("studentPassword").value,
        confirmPassword: document.getElementById("studentConfirmPassword").value,
      }
    } else {
      formData = {
        email: document.getElementById("associateEmail").value,
        firstName: document.getElementById("associateFirstName").value,
        lastName: document.getElementById("associateLastName").value,
        phone: document.getElementById("associatePhone").value,
        password: document.getElementById("associatePassword").value,
        confirmPassword: document.getElementById("associateConfirmPassword").value,
      }
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      this.showError("Passwords do not match")
      return
    }

    // Validate password strength
    if (!this.isPasswordStrong(formData.password)) {
      this.showError("Password must be 8+ characters with uppercase, lowercase, and numbers")
      return
    }

    const typeLabel = formType === "student" ? "Student" : "Associate"
    this.showLoading(`Creating your ${typeLabel} account...`)

    // Simulate API call
    setTimeout(() => {
      this.hideLoading()
      this.showSuccess(`${typeLabel} account created! Welcome to the journey.`)
      setTimeout(() => {
        window.location.href = "index.html"
      }, 2000)
    }, 2000)
  }

  handleLogin(e) {
    e.preventDefault()

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    if (!email || !password) {
      this.showError("Please fill in all fields")
      return
    }

    this.showLoading("Signing you in...")

    // Simulate API call
    setTimeout(() => {
      this.hideLoading()
      this.showSuccess("Welcome back home!")
      setTimeout(() => {
        window.location.href = "index.html"
      }, 1500)
    }, 1500)
  }

  setupPasswordToggle() {
    const toggleButtons = document.querySelectorAll(".password-toggle")

    toggleButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault()
        const input = btn.previousElementSibling
        const isPassword = input.type === "password"

        input.type = isPassword ? "text" : "password"
        btn.textContent = isPassword ? "🙈" : "👁️"
      })
    })
  }

  isPasswordStrong(password) {
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const isLongEnough = password.length >= 8

    return hasUpperCase && hasLowerCase && hasNumbers && isLongEnough
  }

  showLoading(message = "Processing...") {
    if (this.loadingOverlay) {
      this.loadingOverlay.classList.add("active")
      const text = this.loadingOverlay.querySelector("p")
      if (text) {
        text.textContent = message
      }
    }
  }

  hideLoading() {
    if (this.loadingOverlay) {
      this.loadingOverlay.classList.remove("active")
    }
  }

  showSuccess(message) {
    const toast = document.createElement("div")
    toast.className = "toast toast-success"
    toast.textContent = message
    document.body.appendChild(toast)

    setTimeout(() => {
      toast.classList.add("show")
    }, 100)

    setTimeout(() => {
      toast.classList.remove("show")
      setTimeout(() => toast.remove(), 300)
    }, 3000)
  }

  showError(message) {
    const toast = document.createElement("div")
    toast.className = "toast toast-error"
    toast.textContent = message
    document.body.appendChild(toast)

    setTimeout(() => {
      toast.classList.add("show")
    }, 100)

    setTimeout(() => {
      toast.classList.remove("show")
      setTimeout(() => toast.remove(), 300)
    }, 4000)
  }

  animateOnLoad() {
    const elements = document.querySelectorAll(".premium-header, .faith-section, .auth-form")
    elements.forEach((el, index) => {
      el.style.animation = `fadeInUp 0.7s ease-out ${index * 0.1}s both`
    })
  }
}

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  new AuthHandler()
})

// Add toast styles dynamically
const style = document.createElement("style")
style.textContent = `
  .toast {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    padding: 1.2rem 1.8rem;
    border-radius: 12px;
    font-weight: 600;
    font-size: 0.9rem;
    z-index: 2000;
    transform: translateY(100px);
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    max-width: 350px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  }

  .toast.show {
    transform: translateY(0);
    opacity: 1;
  }

  .toast-success {
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
    color: var(--color-white);
    border-left: 4px solid var(--color-yellow);
  }

  .toast-error {
    background: #f8d7da;
    color: #721c24;
    border-left: 4px solid #dc3545;
  }

  @media (max-width: 768px) {
    .toast {
      bottom: 1rem;
      right: 1rem;
      left: 1rem;
      max-width: none;
    }
  }
`
document.head.appendChild(style)
