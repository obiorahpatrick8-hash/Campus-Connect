const feedbackForm = document.querySelector("#feedback-form");

if (feedbackForm) {
    const ratingButtons = feedbackForm.querySelectorAll(".emoji button");
    const status = feedbackForm.querySelector("#feedback-status");
    let selectedRating = 0;

    ratingButtons.forEach((button) => {
        button.addEventListener("click", () => {
            selectedRating = Number(button.dataset.rating);
            ratingButtons.forEach((item) => item.classList.remove("selected"));
            button.classList.add("selected");
            button.setAttribute("aria-pressed", "true");
            Array.from(ratingButtons)
                .filter((item) => item !== button)
                .forEach((item) => item.setAttribute("aria-pressed", "false"));
        });
    });

    feedbackForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!selectedRating) {
            status.textContent = "Please choose an experience rating.";
            status.style.color = "#b42318";
            ratingButtons[0].focus();
            return;
        }

        const suggestions = feedbackForm.querySelector("#suggestions").value.trim();
        localStorage.setItem("campusConnectFeedback", JSON.stringify({
            rating: selectedRating,
            suggestions,
            submittedAt: new Date().toISOString()
        }));

        status.textContent = "Thank you! Your feedback has been submitted.";
        status.style.color = "#26804b";
        feedbackForm.reset();
        selectedRating = 0;
        ratingButtons.forEach((item) => {
            item.classList.remove("selected");
            item.removeAttribute("aria-pressed");
        });
    });
}