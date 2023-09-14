let gBalloons = [
    {id:1, bottom: 100, speed: 10, backgroundColor: "greenyellow"},
    {id:2, bottom: 20, speed: 30, backgroundColor: "blue"},
    {id:3, bottom: 0, speed: 20, backgroundColor: "black"},
    {id:4, bottom: 50, speed: 10, backgroundColor: "red"},
    {id:5, bottom: 80, speed: 20, backgroundColor: "green"},
    {id:6, bottom: 10, speed: 10, backgroundColor: "pink"},
    {id:7, bottom: 80, speed: 15, backgroundColor: "#F18F01"},
    {id:8, bottom: 80, speed: 35, backgroundColor: "#92140C"},
    {id:9, bottom: 80, speed: 5, backgroundColor: "#CACF85"},
    {id:10, bottom: 80, speed: 35, backgroundColor: "#FEC196"},
    {id:11, bottom: 80, speed: 25, backgroundColor: "#56445D"},
    {id:12, bottom: 20, speed: 5, backgroundColor: "blue"}
];

let intervalIds = [];
let intervalMap = new Map();
let balloonsPopped = 0;  // Counter for balloons popped
let isGameOver = false; 


function move_up(){
    const balloonContainer = document.querySelector(".ballons_cont");
    let initialLeft = 50;

    gBalloons.forEach((balloonConfig, index) => {
        // generate the divs using the data model
        let balloon = document.createElement('div');
        balloon.className = `balloon balloon${index+1}`;
        balloon.style.backgroundColor= balloonConfig.backgroundColor;
        balloonContainer.appendChild(balloon);

        // play sound by click
        balloon.onclick = function() {play_sound(this);}

        //  set the margin for balloons
        balloon.style.left = initialLeft + "px";
        initialLeft += 100;

        let currentBottom = balloonConfig.bottom;
        let speed = balloonConfig.speed;

        const interval_id = setInterval(()=>{
        currentBottom++;

        //this is my idea
        if(currentBottom > 700) {
            clearInterval(interval_id);
            gameOver('You lose 😭');
        }

        balloon.style.bottom = currentBottom + "px";
        },speed);

        intervalMap.set(balloon, interval_id);  // Associate this balloon with its interval ID

    });
}

function play_sound(elBalloon){
    const audio = new Audio("assets/pop.mp3");
    audio.play();
    elBalloon.style.transition = "0.3s";
    elBalloon.style.opacity = "0";
    
    // Clear the interval for this balloon immediately when popped
    clearInterval(intervalMap.get(elBalloon));
    intervalMap.delete(elBalloon);  // Remove the entry from the map

    setTimeout(() => {
        elBalloon.remove();
        balloonsPopped++;
        
        if (balloonsPopped === gBalloons.length) {
            gameOver('You win! 🏆');
        }
    }, 500);
}

function gameOver(message) {
    isGameOver = true;
    const modalContainer = document.querySelector(".game_over");
    const gameOverMessage = document.getElementById("game-over-message");
    gameOverMessage.textContent = message;  // Update the message
    modalContainer.style.display = "block";

    // Stop all balloon movements
    intervalIds.forEach(id => {
        clearInterval(id);
    });
}

// This function reloads the page
function reloadPage(){
    location.reload();
}

// This function handles the button click
function startOver(){
    reloadPage();
}

// This function listens for the 'Enter' key press on the entire document
document.addEventListener("keydown", function(event){
    if(event.key === "Enter" && isGameOver){
        reloadPage();
    }
});