const helloButton = document.getElementById("hello-button");
const helloMessage = document.getElementById("hello-message");
const profileToggle = document.getElementById("profile-toggle");
const profileCard = document.getElementById("profile-card");
const projectsToggle = document.getElementById("projects-toggle");
const projectsSection = document.getElementById("projects");

if (helloButton && helloMessage) {
    helloButton.addEventListener("click", () => {
        const hour = new Date().getHours();
        const timeOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";

        helloMessage.textContent = `Hello! Good ${timeOfDay}. I am ready to learn and build websites.`;
    });
}

if (profileToggle && profileCard) {
    profileToggle.addEventListener("click", () => {
        const isHidden = profileCard.classList.toggle("is-hidden");

        profileToggle.textContent = isHidden ? "Show Profile" : "Hide Profile";
        profileToggle.setAttribute("aria-expanded", String(!isHidden));
    });
}

if (projectsToggle && projectsSection) {
    projectsToggle.addEventListener("click", () => {
        const projectList = projectsSection.querySelector(".project-list");

        if (!projectList) {
            return;
        }

        const isHidden = projectList.classList.toggle("is-hidden");

        projectsToggle.textContent = isHidden ? "Show Projects" : "Hide Projects";
        projectsToggle.setAttribute("aria-expanded", String(!isHidden));
    });
}