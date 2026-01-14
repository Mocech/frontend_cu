/**
 * Verify Email Page Logic
 * Handles OTP jumping, Countdown, and Email Generation
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Page Elements
  initializeEmailDisplay();
  startCountdown();
  setupOTPInputs();
  setupEventListeners();
});

// ============================================
// 1. OTP INPUT LOGIC (Jumping & Backspace)
// ============================================
function setupOTPInputs() {
  const otpInputs = document.querySelectorAll(".otp-input");
  const verifyBtn = document.getElementById("verifyCodeBtn");

  otpInputs.forEach((input, index) => {
    // A. Handle Typing (Move Forward)
    input.addEventListener("input", (e) => {
      // Allow only numbers
      e.target.value = e.target.value.replace(/[^0-9]/g, "");

      if (e.target.value.length === 1 && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }

      checkComplete(otpInputs, verifyBtn);
    });

    // B. Handle Backspace (Move Backward)
    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace") {
        if (!input.value && index > 0) {
          // If current box is empty, move to previous and clear it
          otpInputs[index - 1].focus();
        }
      }
    });

    // C. Handle Paste (Fill all boxes at once)
    input.addEventListener("paste", (e) => {
      e.preventDefault();
      const pasteData = e.clipboardData.getData("text").slice(0, 6).replace(/[^0-9]/g, "");
      const digits = pasteData.split("");

      digits.forEach((digit, i) => {
        if (otpInputs[i]) {
          otpInputs[i].value = digit;
        }
      });

      // Focus the last filled box or the next empty one
      const lastIndex = Math.min(digits.length, otpInputs.length - 1);
      otpInputs[lastIndex].focus();
      
      checkComplete(otpInputs, verifyBtn);
    });
  });
}

function checkComplete(inputs, button) {
  const allFilled = Array.from(inputs).every((inp) => inp.value.length === 1);
  if (button) button.disabled = !allFilled;
}

// ============================================
// 2. EMAIL GENERATION LOGIC
// ============================================
function initializeEmailDisplay() {
  const urlParams = new URLSearchParams(window.location.search);
  const admissionNumber = urlParams.get("admission") || localStorage.getItem("admissionNumber");

  if (admissionNumber) {
    const generatedEmail = generateEmail(admissionNumber);
    document.getElementById("displayEmail").textContent = generatedEmail;
    localStorage.setItem("generatedEmail", generatedEmail);
  }
}

function generateEmail(admissionNumber) {
  // Regex to get middle digits from formats like B141/23421/2023
  const numericPart = admissionNumber.replace(/\D/g, "");
  // Assuming the student ID is the middle segment or last 5 digits
  const emailNumber = numericPart.substring(numericPart.length - 5) || numericPart;
  return `${emailNumber}@student.embuni.ac.ke`;
}

// ============================================
// 3. COUNTDOWN & RESEND LOGIC
// ============================================
function startCountdown() {
  let countdownSeconds = 60;
  const countdownElement = document.getElementById("countdown");
  const resendBtn = document.getElementById("resendBtn");

  const savedTime = localStorage.getItem("resendCountdownEnd");
  if (savedTime) {
    const timeRemaining = Math.max(0, Math.ceil((Number.parseInt(savedTime) - Date.now()) / 1000));
    if (timeRemaining > 0) {
      countdownSeconds = timeRemaining;
    } else {
      localStorage.removeItem("resendCountdownEnd");
      resendBtn.disabled = false;
      return;
    }
  }

  localStorage.setItem("resendCountdownEnd", Date.now() + countdownSeconds * 1000);

  const updateCountdown = setInterval(() => {
    countdownSeconds--;
    if (countdownElement) countdownElement.textContent = countdownSeconds;

    if (countdownSeconds <= 0) {
      clearInterval(updateCountdown);
      if (resendBtn) resendBtn.disabled = false;
      if (countdownElement) countdownElement.textContent = "60";
      localStorage.removeItem("resendCountdownEnd");
    }
  }, 1000);
}

// ============================================
// 4. EVENT LISTENERS & UI ACTIONS
// ============================================
function setupEventListeners() {
  // Verify Button Click
  const verifyBtn = document.getElementById("verifyCodeBtn");
  if (verifyBtn) {
    verifyBtn.addEventListener("click", () => {
      const code = Array.from(document.querySelectorAll(".otp-input")).map(i => i.value).join("");
      verifyBtn.textContent = "Verifying...";
      verifyBtn.disabled = true;
      
      // Simulate API verification
      setTimeout(() => {
        showNotification("Email Verified Successfully!", "success");
        // Redirect to Onboarding or Dashboard
        window.location.href = "welcome.html"; 
      }, 2000);
    });
  }

  // Resend Button
  document.getElementById("resendBtn").addEventListener("click", function() {
    this.disabled = true;
    showNotification("A new 6-digit code has been sent!", "success");
    startCountdown();
  });

  // Edit Details
  document.getElementById("editDetailsBtn").addEventListener("click", () => {
    localStorage.removeItem("admissionNumber");
    window.location.href = "signup.html";
  });
}

// ============================================
// 5. NOTIFICATION SYSTEM
// ============================================
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    background: ${type === "success" ? "#4CAF50" : "#f44336"};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    transition: all 0.3s ease;
  `;

  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}