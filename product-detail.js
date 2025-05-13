// Initialize the product detail page
document.addEventListener("DOMContentLoaded", () => {
  initProductDetail();
});

// Product detail page initialization
function initProductDetail() {
  const backButton = document.querySelector(".back-button");
  const shareButton = document.querySelector(".share-button");
  const addToCartButton = document.querySelector(".add-to-cart-button");
  const minusButton = document.querySelector(".quantity-btn.minus");
  const plusButton = document.querySelector(".quantity-btn.plus");
  const quantityElement = document.querySelector(".quantity");

  let quantity = 1;
  let inCart = false;

  // Back button functionality
  if (backButton) {
    backButton.addEventListener("click", () => {
      window.history.back();
    });
  }

  // Share button functionality
  if (shareButton) {
    shareButton.addEventListener("click", () => {
      // Share functionality would go here
      alert("Share functionality would be implemented here");
    });
  }

  // Quantity control
  if (minusButton && plusButton && quantityElement) {
    minusButton.addEventListener("click", () => {
      if (quantity > 1) {
        quantity--;
        quantityElement.textContent = quantity;
      }
    });

    plusButton.addEventListener("click", () => {
      quantity++;
      quantityElement.textContent = quantity;
    });
  }

  // Add to cart functionality
  if (addToCartButton) {
    addToCartButton.addEventListener("click", () => {
      if (!inCart) {
        // Add to cart
        inCart = true;
        addToCartButton.textContent = "Savat: " + quantity;
        addToCartButton.classList.add("cart-button");

        // Show success message
        alert("Mahsulot savatchaga qo'shildi!");
      } else {
        // Go to cart
        alert("Savatchaga o'tish");
        // window.location.href = "cart.html"; // Uncomment when cart page is available
      }
    });
  }

  // Image gallery dots
  const dots = document.querySelectorAll(".dot");
  if (dots.length) {
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        // Remove active class from all dots
        dots.forEach((d) => d.classList.remove("active"));
        // Add active class to clicked dot
        dot.classList.add("active");

        // In a real implementation, this would change the product image
        // For now, just show a message
        console.log("Changed to image " + (index + 1));
      });
    });
  }
}
