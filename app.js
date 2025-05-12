function saveToLocalStorage(event) {
    event.preventDefault(); // Prevent form submission and page reload

    // Get form values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const course = document.getElementById("course").value;

    // Validate inputs
    if (!validateName(name)) {
        alert("Please enter a valid name (minimum 3 characters).");
        return;
    }
    if (!validateEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }
    if (!validatePhone(phone)) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }
    if (!course) {
        alert("Please select a course.");
        return;
    }

    // Create an object for the student
    const student = {
        name: name,
        email: email,
        phone: phone,
        course: course
    };

    // Get existing data from localStorage
    const existingData = JSON.parse(localStorage.getItem("students")) || [];

    // Add new student to existing data
    existingData.push(student);

    // Save updated data back to localStorage
    localStorage.setItem("students", JSON.stringify(existingData));

    // Clear the form
    document.getElementById("registrationForm").reset();

    // Notify the user
    alert("Registration successful!");
}

// Validate name (minimum 3 characters)
function validateName(name) {
    return name.length >= 3;
}

// Validate email using a regex pattern
function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// Validate phone number (must be 10 digits)
function validatePhone(phone) {
    const phonePattern = /^[0-9]{10}$/;
    return phonePattern.test(phone);
}


