// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", function() {
    // Scroll to top button
    window.onscroll = function() {
      const scrollToTopButton = document.getElementById("scrollToTop");
      if (scrollToTopButton) {
        // Show button when user scrolls down 200px
        if (window.scrollY > 200) {
          scrollToTopButton.style.display = "block";
        } else {
          scrollToTopButton.style.display = "none";
        }
      }
    };
  
    const scrollToTopButton = document.getElementById("scrollToTop");
    if (scrollToTopButton) {
      scrollToTopButton.addEventListener("click", function() {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  
    // Simple Form Validation
    const form = document.querySelector("form");
    if (form) {
      form.addEventListener("submit", function(e) {
        e.preventDefault();
        
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;
        
        if (!name || !email || !message) {
          alert("Please fill out all fields!");
          return;
        }
  
        alert("Your message has been sent!");
        form.reset(); // Reset form after submission
      });
    }
  });
  