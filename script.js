
"use strict";

// Get website elements
const stars = document.getElementById("stars");
const confettiLayer = document.getElementById("confetti");
const balloonLayer = document.getElementById("balloons");

const openSurprise = document.getElementById("openSurprise");
const closeSurprise = document.getElementById("closeSurprise");
const surpriseOverlay = document.getElementById("surpriseOverlay");

const celebrateButton = document.getElementById("celebrateButton");
const surpriseCelebrate = document.getElementById("surpriseCelebrate");

const musicButton = document.getElementById("musicButton");
const musicIcon = document.getElementById("musicIcon");
const musicLabel = document.getElementById("musicLabel");

const toast = document.getElementById("toast");

// Create twinkling background stars
for (let i = 0; i < 85; i++) {
    const star = document.createElement("span");

    star.className = "star";
    star.textContent = Math.random() > 0.5 ? "✦" : "·";

    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.fontSize = Math.random() * 12 + 5 + "px";
    star.style.animationDelay = Math.random() * 4 + "s";
    star.style.animationDuration = 2 + Math.random() * 4 + "s";

    stars.appendChild(star);
}

// Toast notifications
let toastTimeout;

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

// Golden confetti
function launchConfetti(amount = 120) {
    const colors = [
        "#d7b56d",
        "#ffe8ae",
        "#fff6df",
        "#9f762f",
        "#f5d48b"
    ];

    for (let i = 0; i < amount; i++) {
        const piece = document.createElement("span");

        piece.className = "confetti-piece";

        piece.style.left = Math.random() * 100 + "%";
        piece.style.width = 5 + Math.random() * 6 + "px";
        piece.style.height = 8 + Math.random() * 9 + "px";

        piece.style.backgroundColor =
            colors[Math.floor(Math.random() * colors.length)];

        piece.style.animationDuration =
            2.5 + Math.random() * 3.5 + "s";

        piece.style.animationDelay = Math.random() * 1.5 + "s";

        confettiLayer.appendChild(piece);

        setTimeout(() => {
            piece.remove();
        }, 7500);
    }
}

// Floating balloons and celebration emojis
const balloonEmojis = ["🎈", "🎈", "✨", "🎉", "⭐", "💛"];

function launchBalloons(amount = 15) {
    for (let i = 0; i < amount; i++) {
        setTimeout(() => {
            const balloon = document.createElement("span");

            balloon.className = "balloon";
            balloon.textContent =
                balloonEmojis[
                    Math.floor(Math.random() * balloonEmojis.length)
                ];

            balloon.style.left = Math.random() * 95 + "%";
            balloon.style.animationDuration =
                5 + Math.random() * 5 + "s";

            balloonLayer.appendChild(balloon);

            setTimeout(() => {
                balloon.remove();
            }, 11000);
        }, i * 140);
    }
}

// Celebration effect
function celebrate() {
    launchConfetti(150);
    launchBalloons(18);

    showToast("💛 Happy Birthday! You deserve the very best!");

    if (musicPlaying && audioContext) {
        playNextNote();
    }
}

// Surprise popup
function openSurprisePopup() {
    surpriseOverlay.classList.add("active");
    surpriseOverlay.setAttribute("aria-hidden", "false");

    document.body.classList.add("no-scroll");

    launchConfetti(90);

    closeSurprise.focus();
}

function closeSurprisePopup() {
    surpriseOverlay.classList.remove("active");
    surpriseOverlay.setAttribute("aria-hidden", "true");

    document.body.classList.remove("no-scroll");

    openSurprise.focus();
}

openSurprise.addEventListener("click", openSurprisePopup);

closeSurprise.addEventListener("click", closeSurprisePopup);

surpriseOverlay.addEventListener("click", (event) => {
    if (event.target === surpriseOverlay) {
        closeSurprisePopup();
    }
});

document.addEventListener("keydown", (event) => {
    if (
        event.key === "Escape" &&
        surpriseOverlay.classList.contains("active")
    ) {
        closeSurprisePopup();
    }
});

// Celebrate buttons
celebrateButton.addEventListener("click", celebrate);

surpriseCelebrate.addEventListener("click", () => {
    closeSurprisePopup();
    celebrate();
});

// Browser-generated birthday melody
// No external audio file required.
let audioContext = null;
let musicPlaying = false;
let melodyTimer = null;
let noteIndex = 0;

const melody = [
    392, 392, 440, 392, 523, 494,
    392, 392, 440, 392, 587, 523,
    392, 392, 784, 659, 523, 494, 440,
    698, 698, 659, 523, 587, 523
];

function playNote(frequency, duration = 0.3) {
    if (!audioContext || audioContext.state !== "running") {
        return;
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    const now = audioContext.currentTime;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.07, now + 0.03);
    gain.gain.setTargetAtTime(
        0.0001,
        now + duration - 0.05,
        0.04
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start(now);
    oscillator.stop(now + duration);
}

function playNextNote() {
    if (!musicPlaying) return;

    playNote(melody[noteIndex % melody.length], 0.32);
    noteIndex++;
}

async function startMusic() {
    try {
        if (!audioContext) {
            const AudioContextClass =
                window.AudioContext || window.webkitAudioContext;

            if (!AudioContextClass) {
                showToast("Audio is not supported in this browser.");
                return;
            }

            audioContext = new AudioContextClass();
        }

        await audioContext.resume();

        musicPlaying = true;
        noteIndex = 0;

        clearInterval(melodyTimer);

        playNextNote();

        melodyTimer = setInterval(playNextNote, 400);

        musicButton.setAttribute("aria-pressed", "true");
        musicIcon.textContent = "♪";
        musicLabel.textContent = "STOP MUSIC";

        showToast("🎵 Let the birthday magic begin!");

    } catch (error) {
        showToast("Please check your browser audio settings.");
    }
}

function stopMusic() {
    musicPlaying = false;

    clearInterval(melodyTimer);
    melodyTimer = null;

    musicButton.setAttribute("aria-pressed", "false");
    musicIcon.textContent = "♫";
    musicLabel.textContent = "PLAY MUSIC";
}

musicButton.addEventListener("click", () => {
    if (musicPlaying) {
        stopMusic();
    } else {
        startMusic();
    }
});

// Initial celebration when the page loads
window.addEventListener("load", () => {
    setTimeout(() => {
        launchConfetti(45);
    }, 900);
});

// Stop audio if the visitor changes tabs
document.addEventListener("visibilitychange", () => {
    if (document.hidden && musicPlaying) {
        stopMusic();
    }
});
