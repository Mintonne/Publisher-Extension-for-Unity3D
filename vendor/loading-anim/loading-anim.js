const animationOverlay = document.querySelector(".animation-overlay"),
    loadingText = document.querySelector(".animation-overlay>h5");

let Anim = {
    ShowAnimation(text = "Loading...") {
        animationOverlay.classList.add("active");
        loadingText.innerText = text;
    },
    UpdateText(text) {
        loadingText.innerText = text;
    },
    CloseAnimation() {
        animationOverlay.classList.remove("active");
    }
}