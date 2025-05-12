function alertMessage() {
    alert("Thank you for your interest in VK Academy! Stay tuned for more updates.");
}

// Subject video mapping
const subjectVideos = {
    "English": "https://www.youtube.com/embed/kLZuut1fYzQ",
    "Maths": "https://www.youtube.com/embed/AC2yRk_kYVQ",
    "Science": "https://www.youtube.com/embed/FtA9Y_MHkUo",
    "Social Science": "https://www.youtube.com/embed/BM1nXoVNi-k",
    "Mathematics": "https://www.youtube.com/embed/OyH2uk5T8mY",
    "Physics": "https://www.youtube.com/embed/9D3SoUbLmzI",
    "Chemistry": "https://www.youtube.com/embed/lhQ1WjMZ5T8",
    "Biology": "https://www.youtube.com/embed/o__JNyhDjeM",
    "Computer Science": "https://www.youtube.com/embed/GLk7-imcjiI",
    "Accountancy": "https://www.youtube.com/embed/g6W-3Y6Q7YA",
    "M1": "https://www.youtube.com/embed/tnGTrfw2r3o",
    "M2": "https://www.youtube.com/embed/sHfJq6n2jQ0",
    "M3": "https://www.youtube.com/embed/ZzXoWzCW3vA",
    "M4": "https://www.youtube.com/embed/NQj5ggzBIyo"
};

// Toggle subject visibility and attach subject click listeners
function toggleSubjects(card) {
    const subjectsList = card.querySelector(".subjects");
    if (!subjectsList) return;
    const isVisible = subjectsList.style.display === "block";

    // Hide all
    document.querySelectorAll(".course-card .subjects").forEach((list) => {
        list.style.display = "none";
    });

    subjectsList.style.display = isVisible ? "none" : "block";

    // Add click listeners to subjects
    subjectsList.querySelectorAll("li").forEach((subject) => {
        subject.onclick = () => showSubjectVideo(subject.innerText.trim());
    });
}

// Show the subject-specific video
function showSubjectVideo(subjectName) {
    const videoURL = subjectVideos[subjectName];
    const videoFrame = document.getElementById("video-frame");
    const videoContainer = document.getElementById("video-container");

    if (videoURL) {
        videoFrame.src = videoURL;
        videoContainer.style.display = "block";
        document.getElementById("subject-video").scrollIntoView({ behavior: "smooth" });
    } else {
        videoContainer.style.display = "none";
        videoFrame.src = "";
    }
}
// Track video progress
function trackProgress(videoFrame, subjectName, progressBar, progressText) {
    videoFrame.onload = function () {
        const video = videoFrame.contentWindow.document.querySelector('video');
        if (video) {
            video.addEventListener('timeupdate', () => {
                const progress = Math.floor((video.currentTime / video.duration) * 100);
                progressBar.value = progress;
                progressText.textContent = `${progress}% watched`;

                // Save progress in localStorage
                localStorage.setItem(subjectName, progress);
            });
        }
    }
}