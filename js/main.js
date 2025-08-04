let level = 1;
let gBalloons = [];
let balloonsPopped = 0;
let isGameOver = false;
let intervalMap = new Map();

const MAX_BALLOONS = 12;
const MAX_LEVEL = 20;

/**
 * Returns a random color from a predefined list.
 */
function randomColor() {
    const colors = ["greenyellow", "blue", "black", "red", "green", "pink", "#F18F01", "#92140C", "#CACF85", "#FEC196", "#56445D"];
    return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Creates a balloons array with random speed.
 * @param {number} num Number of balloons for this level
 */
function createBalloons(num) {
    gBalloons = [];
    for (let i = 0; i < num; i++) {
        gBalloons.push({
            id: i + 1,
            speed: Math.max(5, 25 - level * 2 + Math.floor(Math.random() * 7)),
            backgroundColor: randomColor()
        });
    }
}

/**
 * Renders the balloons and animates their upward movement.
 */
function move_up() {
    const balloonContainer = document.querySelector(".ballons_cont");
    balloonContainer.innerHTML = '';
    let containerWidth = balloonContainer.offsetWidth;
    let balloonSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--balloon-size') || 60);
    let balloonPositions = [];

    gBalloons.forEach((balloonConfig, index) => {
        let balloon = document.createElement('div');
        balloon.className = `balloon balloon${index + 1}`;
        balloon.style.backgroundColor = balloonConfig.backgroundColor;

        // Calculate safe left position for this balloon
        let maxLeft = containerWidth - balloonSize;
        let leftPos;
        let attempts = 0;
        do {
            leftPos = Math.floor(Math.random() * maxLeft);
            attempts++;
        } while (
            balloonPositions.some(pos => Math.abs(pos - leftPos) < balloonSize * 0.85) && attempts < 30
        );
        balloonPositions.push(leftPos);
        balloon.style.left = leftPos + "px";

        // Always start from bottom 0 for consistency
        let currentBottom = 0;
        balloon.style.bottom = currentBottom + "px";

        // Support both click and touch events
        balloon.onclick = function () { play_sound(this); }
        balloon.ontouchstart = function (e) { 
            if (e.cancelable) e.preventDefault(); 
            play_sound(this); 
        }

        balloonContainer.appendChild(balloon);

        let speed = balloonConfig.speed;

        const interval_id = setInterval(() => {
            if (isGameOver) {
                clearInterval(interval_id);
                return;
            }
            currentBottom++;
            balloon.style.bottom = currentBottom + "px";

            // Use getBoundingClientRect to detect if balloon left the visible top of the container
            const rect = balloon.getBoundingClientRect();
            const containerRect = balloonContainer.getBoundingClientRect();
            if (rect.bottom < containerRect.top + 10) {
                clearInterval(interval_id);
                if (!isGameOver) {
                    gameOver('You lose 😭');
                }
            }
        }, speed);

        intervalMap.set(balloon, interval_id);
    });
}

/**
 * Handles popping a balloon, playing a sound and checking for win/level up.
 * @param {HTMLElement} elBalloon The balloon element that was clicked or touched
 */
function play_sound(elBalloon) {
    if (isGameOver || !intervalMap.has(elBalloon)) return;
    const audio = new Audio("assets/pop.mp3");
    audio.play().catch(e => {});
    elBalloon.style.opacity = "0";
    clearInterval(intervalMap.get(elBalloon));
    intervalMap.delete(elBalloon);

    setTimeout(() => {
        elBalloon.remove();
        balloonsPopped++;
        if (balloonsPopped === gBalloons.length) {
            setTimeout(() => {
                level++;
                if (level <= MAX_LEVEL) {
                    gameOver(`Level ${level - 1} complete! 🎉 Next: Level ${level}`);
                    setTimeout(startLevel, 1400);
                } else {
                    gameOver('You win all levels! 🏆');
                }
            }, 200);
        }
    }, 400);
}

/**
 * Stops all balloons and shows game over modal.
 * @param {string} message The message to display
 */
function gameOver(message) {
    isGameOver = true;
    document.querySelector(".game_over").style.display = "block";
    document.getElementById("game-over-message").textContent = message;
    intervalMap.forEach(id => clearInterval(id));
    if (message.includes("You lose")) {
        level = 1;
    }
}

/**
 * Starts or restarts the level and hides game over modal.
 */
function startLevel() {
    setBalloonSize(level)
    balloonsPopped = 0;
    isGameOver = false;
    intervalMap.forEach((id) => clearInterval(id));
    intervalMap = new Map();
    document.querySelector('.game_over').style.display = "none";
    // Cap number of balloons for higher levels for small screens
    let maxBalloons = Math.min(MAX_BALLOONS, 5 + level * 2);
    createBalloons(maxBalloons);
    move_up();
}

/**
 * Handles pressing the start over button.
 */
function startOver() {
    level = 1;
    startLevel();
}

// Start game on page load
window.onload = function () {
    level = 1;
    startLevel();
};

// Support pressing Enter key for restart if game is over
document.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && isGameOver) {
        startOver();
    }
});

function setBalloonSize(level) {
    let size = Math.max(35, 80 - (level - 1) * 3);
    document.documentElement.style.setProperty('--balloon-size', size + 'px');
}
