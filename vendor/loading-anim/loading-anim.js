const animationOverlay = document.querySelector(".animation-overlay"),
    loadingText = document.querySelector(".animation-overlay>h5");

let Anim = {
    ShowAnimation(text = "Loading...") {
        animationOverlay.classList.add("active");
        loadingText.innerHTML = text;
    },
    UpdateText(text) {
        loadingText.innerHTML = text;
    },
    CloseAnimation() {
        animationOverlay.classList.remove("active");
    }
}