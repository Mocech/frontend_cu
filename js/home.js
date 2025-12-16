// Hero Slideshow Functionality

// Segmented Switch for Testimonies/Articles
class SegmentedSwitch {
  constructor() {
    this.switchOptions = document.querySelectorAll('.switch-option');
    this.indicator = document.querySelector('.switch-indicator');
    this.contentAreas = document.querySelectorAll('.content-area');
    
    this.init();
  }

  init() {
    if (!this.switchOptions.length || !this.indicator) return;

    // Add click listeners
    this.switchOptions.forEach((option, index) => {
      option.addEventListener('click', (e) => {
        this.handleSwitch(e.target, index);
      });
    });
  }

  handleSwitch(clickedOption, index) {
    // Remove active class from all options
    this.switchOptions.forEach(opt => opt.classList.remove('active'));
    
    // Add active class to clicked option
    clickedOption.classList.add('active');
    
    // Move indicator (0% for first, 100% for second)
    this.indicator.style.transform = `translateX(${index * 100}%)`;
    
    // Switch content
    const contentId = clickedOption.getAttribute('data-content');
    this.switchContent(contentId);
  }

  switchContent(contentId) {
    // Hide all content areas
    this.contentAreas.forEach(area => {
      area.classList.remove('active');
    });
    
    // Show selected content area
    const targetContent = document.getElementById(contentId);
    if (targetContent) {
      targetContent.classList.add('active');
    }
  }
}

// Initialize segmented switch when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SegmentedSwitch();
});

class Slideshow {
  constructor() {
    this.slides = document.querySelectorAll(".slide")
    this.prevBtn = document.getElementById("prevSlide")
    this.nextBtn = document.getElementById("nextSlide")
    this.pagination = document.getElementById("slidePagination")
    this.currentIndex = 0
    this.autoplayInterval = null
    this.autoplayDelay = 7000 // 7 seconds
    this.isPaused = false

    this.init()
  }

  init() {
    if (!this.slides.length) return

    // Create pagination dots
    this.createPagination()

    // Set up event listeners
    if (this.prevBtn) {
      this.prevBtn.addEventListener("click", () => this.prevSlide())
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener("click", () => this.nextSlide())
    }

    // Pause on hover (desktop)
    const slideshow = document.querySelector(".hero-slideshow")
    if (slideshow) {
      slideshow.addEventListener("mouseenter", () => this.pause())
      slideshow.addEventListener("mouseleave", () => this.resume())
    }

    // Touch swipe support
    this.setupTouchEvents()

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.prevSlide()
      if (e.key === "ArrowRight") this.nextSlide()
    })

    // Start autoplay
    this.startAutoplay()
  }

  createPagination() {
    if (!this.pagination) return

    this.slides.forEach((_, index) => {
      const dot = document.createElement("button")
      dot.classList.add("pagination-dot")
      dot.setAttribute("aria-label", `Go to slide ${index + 1}`)

      if (index === 0) {
        dot.classList.add("active")
      }

      dot.addEventListener("click", () => this.goToSlide(index))
      this.pagination.appendChild(dot)
    })
  }

  updatePagination() {
    const dots = this.pagination?.querySelectorAll(".pagination-dot")
    if (!dots) return

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === this.currentIndex)
    })
  }

  goToSlide(index) {
    this.slides[this.currentIndex].classList.remove("active")
    this.currentIndex = index
    this.slides[this.currentIndex].classList.add("active")
    this.updatePagination()
  }

  nextSlide() {
    const nextIndex = (this.currentIndex + 1) % this.slides.length
    this.goToSlide(nextIndex)
  }

  prevSlide() {
    const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length
    this.goToSlide(prevIndex)
  }

  startAutoplay() {
    this.autoplayInterval = setInterval(() => {
      if (!this.isPaused) {
        this.nextSlide()
      }
    }, this.autoplayDelay)
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval)
      this.autoplayInterval = null
    }
  }

  pause() {
    this.isPaused = true
  }

  resume() {
    this.isPaused = false
  }

  setupTouchEvents() {
    const slideshow = document.querySelector(".hero-slideshow")
    if (!slideshow) return

    let touchStartX = 0
    let touchEndX = 0

    slideshow.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX
      },
      { passive: true },
    )

    slideshow.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX
        this.handleSwipe()
      },
      { passive: true },
    )

    const handleSwipe = () => {
      const swipeThreshold = 50
      const diff = touchStartX - touchEndX

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          this.nextSlide()
        } else {
          this.prevSlide()
        }
      }
    }

    this.handleSwipe = handleSwipe
  }
}

// Initialize slideshow when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new Slideshow()
})

class BannerCarousel {
  constructor() {
    this.banner = document.getElementById("floatingBanner")
    if (!this.banner) return

    this.slides = this.banner.querySelectorAll(".banner-slide")
    this.dotsContainer = document.getElementById("bannerDots")
    this.currentIndex = 0
    this.autoplayInterval = null
    this.autoplayDelay = 4500

    this.init()
  }

  init() {
    if (!this.slides.length) return

    // Create dots
    this.createDots()

    // Touch swipe support
    this.setupTouchEvents()

    // Start autoplay
    this.startAutoplay()

    // Pause on hover
    this.banner.addEventListener("mouseenter", () => this.stopAutoplay())
    this.banner.addEventListener("mouseleave", () => this.startAutoplay())
  }

  createDots() {
    if (!this.dotsContainer) return

    this.slides.forEach((_, index) => {
      const dot = document.createElement("button")
      dot.classList.add("banner-dot")
      dot.setAttribute("aria-label", `Go to event ${index + 1}`)

      if (index === 0) {
        dot.classList.add("active")
      }

      dot.addEventListener("click", () => this.goToSlide(index))
      this.dotsContainer.appendChild(dot)
    })
  }

  updateDots() {
    const dots = this.dotsContainer?.querySelectorAll(".banner-dot")
    if (!dots) return

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === this.currentIndex)
    })
  }

  goToSlide(index) {
    this.slides[this.currentIndex].classList.remove("active")
    this.currentIndex = index
    this.slides[this.currentIndex].classList.add("active")
    this.updateDots()
  }

  nextSlide() {
    const nextIndex = (this.currentIndex + 1) % this.slides.length
    this.goToSlide(nextIndex)
  }

  startAutoplay() {
    this.stopAutoplay()
    this.autoplayInterval = setInterval(() => {
      this.nextSlide()
    }, this.autoplayDelay)
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval)
      this.autoplayInterval = null
    }
  }

  setupTouchEvents() {
    let touchStartX = 0
    let touchEndX = 0

    this.banner.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX
      },
      { passive: true },
    )

    this.banner.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX
        const diff = touchStartX - touchEndX
        const swipeThreshold = 50

        if (Math.abs(diff) > swipeThreshold) {
          if (diff > 0) {
            this.nextSlide()
          } else {
            const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length
            this.goToSlide(prevIndex)
          }
        }
      },
      { passive: true },
    )
  }
}

// Initialize banner carousel when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new BannerCarousel()
})

// Horizontal scroll with mouse wheel for events
const eventsScroll = document.querySelector(".events-scroll")
if (eventsScroll) {
  eventsScroll.addEventListener(
    "wheel",
    (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault()
        eventsScroll.scrollLeft += e.deltaY
      }
    },
    { passive: false },
  )
}

// Lazy loading images
const observerOptions = {
  root: null,
  rootMargin: "50px",
  threshold: 0.01,
}

const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target
      if (img.dataset.src) {
        img.src = img.dataset.src
        img.removeAttribute("data-src")
      }
      imageObserver.unobserve(img)
    }
  })
}, observerOptions)

// Observe all images with data-src attribute
document.querySelectorAll("img[data-src]").forEach((img) => {
  imageObserver.observe(img)
})
