// Global state to store user data across screens
const appState = {
  phoneNumber: "",
  verificationCode: "",
  language: "English",
  formData: {
    username: "",
    email: "",
    region: "",
    address: "",
  },
};

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  // Determine which screen we're on based on the HTML file
  const currentPage = window.location.pathname.split("/").pop();

  // Initialize the appropriate screen
  switch (currentPage) {
    case "index.html":
    case "":
      initHomePage();
      break;
    case "loading.html":
      initSplashScreen();
      break;
    case "login.html":
      initLoginScreen();
      break;
    case "otp.html":
    case "otp-filled.html":
    case "otp-error.html":
      initOTPScreen();
      break;
    case "signup.html":
      initSignupScreen();
      break;
    case "language.html":
      initLanguageScreen();
      break;
  }
});

// Home page initialization
function initHomePage() {
  // Nothing special needed for the home page
}

// Splash screen initialization
function initSplashScreen() {
  // Automatically redirect to login page after 3 seconds
  setTimeout(() => {
    window.location.href = "login.html";
  }, 3000);
}

// Login screen initialization
function initLoginScreen() {
  const loginButton = document.querySelector(".primary-button");
  const phoneInput = document.querySelector('input[type="tel"]');
  const languageSelector = document.querySelector(".language-selector");

  // Restore phone number if it exists in state
  if (appState.phoneNumber) {
    phoneInput.value = appState.phoneNumber;
  }

  // Add event listener to login button
  if (loginButton) {
    loginButton.addEventListener("click", () => {
      if (validatePhoneNumber(phoneInput.value)) {
        // Save phone number to state
        appState.phoneNumber = phoneInput.value;
        // Navigate to OTP screen
        window.location.href = "otp.html";
      } else {
        // Show error for invalid phone number
        alert("Please enter a valid phone number");
      }
    });
  }

  // Add event listener to language selector
  if (languageSelector) {
    languageSelector.addEventListener("click", () => {
      window.location.href = "language.html";
    });
  }
}

// OTP screen initialization
function initOTPScreen() {
  const verifyButton = document.querySelector(".verify-button");
  const otpInputs = document.querySelectorAll(".otp-input");
  const backButton = document.querySelector(".back-button");
  const resendCode = document.querySelector(".resend-code");
  const errorNotification = document.querySelector(".error-notification");
  const closeIcon = document.querySelector(".close-icon");

  // Update phone number display
  const phoneDisplay = document.querySelector(".verification-text");
  if (phoneDisplay && appState.phoneNumber) {
    phoneDisplay.innerHTML = `A verification code has been sent to <br>+998 ${formatPhoneNumber(
      appState.phoneNumber
    )}`;
  }

  // Set up OTP input behavior
  if (otpInputs && otpInputs.length) {
    setupOTPInputs(otpInputs);
  }

  // Add event listener to verify button
  if (verifyButton) {
    verifyButton.addEventListener("click", () => {
      const code = getOTPValue(otpInputs);

      if (code.length === 6) {
        appState.verificationCode = code;

        // For demo purposes, any 6-digit code works except "222222"
        if (code === "222222") {
          window.location.href = "otp-error.html";
        } else {
          window.location.href = "signup.html";
        }
      } else {
        alert("Please enter the complete 6-digit verification code");
      }
    });
  }

  // Add event listener to back button
  if (backButton) {
    backButton.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }

  // Add event listener to resend code
  if (resendCode) {
    resendCode.addEventListener("click", () => {
      // Reset timer
      startResendTimer();
    });
  }

  // Add event listener to close error notification
  if (closeIcon && errorNotification) {
    closeIcon.addEventListener("click", () => {
      errorNotification.style.display = "none";
    });
  }

  // Start the resend timer if it has a timer element
  const timerElement = document.querySelector(".timer");
  if (timerElement) {
    startResendTimer();
  }
}

// Sign up screen initialization
function initSignupScreen() {
  const continueButton = document.querySelector(".continue-button");
  const formInputs = document.querySelectorAll("input");
  const selectInput = document.querySelector(".select-input");

  // Add event listener to continue button
  if (continueButton) {
    continueButton.addEventListener("click", () => {
      // Collect form data
      const username = document.querySelector(
        'input[placeholder="Username/string"]'
      ).value;
      const email = document.querySelector(
        'input[placeholder="Email/string"]'
      ).value;
      const region = document.querySelector(
        'input[placeholder="Hudud/string"]'
      ).value;
      const address = document.querySelector(
        'input[placeholder="Manzil/string"]'
      ).value;

      if (validateSignupForm(username, email, region, address)) {
        // Save form data to state
        appState.formData = {
          username,
          email,
          region,
          address,
        };

        // Show success message
        alert("Registration successful! Welcome to BS Gazobeton.");

        // Redirect to home page
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1000);
      }
    });
  }

  // Make the region dropdown functional
  if (selectInput) {
    selectInput.addEventListener("click", () => {
      // For demo purposes, just populate with a value when clicked
      const input = selectInput.querySelector("input");
      if (input.value === "") {
        input.value = "Tashkent";
      }
    });
  }
}

// Language screen initialization
function initLanguageScreen() {
  const languageItems = document.querySelectorAll(".language-item");
  const backButton = document.querySelector(".back-button");

  // Add event listeners to language items
  if (languageItems && languageItems.length) {
    languageItems.forEach((item) => {
      item.addEventListener("click", () => {
        // Remove selected class from all items
        languageItems.forEach((i) => i.classList.remove("selected"));

        // Add selected class to clicked item
        item.classList.add("selected");

        // Update language in state
        const languageName = item.querySelector("span").textContent;
        appState.language = languageName;

        // Go back to previous page after a short delay
        setTimeout(() => {
          window.history.back();
        }, 500);
      });
    });
  }

  // Add event listener to back button
  if (backButton) {
    backButton.addEventListener("click", () => {
      window.history.back();
    });
  }
}

// Helper function to validate phone number
function validatePhoneNumber(phone) {
  // Simple validation - just check if it's not empty
  return phone.trim() !== "";
}

// Helper function to format phone number for display
function formatPhoneNumber(phone) {
  // Simple formatting for display
  return `(${phone.substring(0, 2)})-${phone.substring(2, 5)}-${phone.substring(
    5,
    7
  )}-${phone.substring(7, 9)}`;
}

// Helper function to set up OTP input behavior
function setupOTPInputs(inputs) {
  inputs.forEach((input, index) => {
    // Skip if it's a div (for filled state)
    if (input.tagName === "DIV") return;

    input.addEventListener("keyup", (e) => {
      // If a digit was entered
      if (e.key >= "0" && e.key <= "9") {
        // Move focus to next input
        if (index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
      } else if (e.key === "Backspace") {
        // Move focus to previous input on backspace
        if (index > 0) {
          inputs[index - 1].focus();
        }
      }
    });

    // Handle paste event
    input.addEventListener("paste", (e) => {
      e.preventDefault();
      const pasteData = e.clipboardData.getData("text");

      // If pasted data is numeric and has the right length
      if (/^\d+$/.test(pasteData) && pasteData.length <= inputs.length) {
        // Fill inputs with pasted digits
        for (let i = 0; i < pasteData.length; i++) {
          if (index + i < inputs.length) {
            inputs[index + i].value = pasteData[i];
          }
        }

        // Focus the next empty input or the last one
        const nextIndex = Math.min(index + pasteData.length, inputs.length - 1);
        inputs[nextIndex].focus();
      }
    });
  });
}

// Helper function to get the complete OTP value
function getOTPValue(inputs) {
  let otp = "";

  inputs.forEach((input) => {
    // Handle both input elements and div elements with filled class
    if (input.tagName === "INPUT") {
      otp += input.value || "";
    } else if (input.tagName === "DIV" && input.classList.contains("filled")) {
      otp += input.textContent || "";
    }
  });

  return otp;
}

// Helper function to validate signup form
function validateSignupForm(username, email, region, address) {
  if (!username || !email || !region || !address) {
    alert("Please fill in all fields");
    return false;
  }

  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address");
    return false;
  }

  return true;
}

// Helper function to start the resend timer
function startResendTimer() {
  const timerElement = document.querySelector(".timer");
  if (!timerElement) return;

  let seconds = 59;
  timerElement.textContent = `00:${seconds.toString().padStart(2, "0")}`;

  const interval = setInterval(() => {
    seconds--;

    if (seconds < 0) {
      clearInterval(interval);
      const resendElement = document.querySelector(".resend-code");
      if (resendElement) {
        resendElement.innerHTML = "<span>Resend Code</span>";
        resendElement.style.cursor = "pointer";
      }
    } else {
      timerElement.textContent = `00:${seconds.toString().padStart(2, "0")}`;
    }
  }, 1000);
}
