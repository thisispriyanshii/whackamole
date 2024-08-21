let currMoleTile;
let currPlantTiles = [];
let score = 0;
let gameOver = false;
let intervalMole;
let intervalPlant;
let countdown;

window.onload = function() {
    setGame();
};

function setGame() {
    score = 0;
    gameOver = false;
    currPlantTiles = [];
    document.getElementById("score").innerText = "Score: 0";
    document.getElementById("timer").innerText = "Time: 60s";
    document.getElementById("retry").style.display = "none";

    const board = document.getElementById("board");
    board.innerHTML = ''; // Clear any existing tiles
    for (let i = 0; i < 9; i++) {
        let tile = document.createElement("div");
        tile.id = i.toString();
        tile.addEventListener("click", selectTile);
        board.appendChild(tile);
    }

    intervalMole = setInterval(setMole, 1000);
    intervalPlant = setInterval(setPlant, 2000);
    startTimer(60);
}

function getRandomTile() {
    return Math.floor(Math.random() * 9).toString();
}

function setMole() {
    if (gameOver) return;
    if (currMoleTile) currMoleTile.innerHTML = "";
    let mole = document.createElement("img");
    mole.src = "./monty-mole.png";

    let num = getRandomTile();
    while (currPlantTiles.includes(num)) {
        num = getRandomTile();
    }
    currMoleTile = document.getElementById(num);
    currMoleTile.appendChild(mole);
}

function setPlant() {
    if (gameOver) return;
    currPlantTiles.forEach(tile => document.getElementById(tile).innerHTML = "");
    currPlantTiles = [];

    for (let i = 0; i < 3; i++) {
        let plant = document.createElement("img");
        plant.src = "./piranha-plant.png";

        let num = getRandomTile();
        while (currPlantTiles.includes(num) || (currMoleTile && currMoleTile.id == num)) {
            num = getRandomTile();
        }
        currPlantTiles.push(num);
        document.getElementById(num).appendChild(plant);
    }
}

function selectTile() {
    if (gameOver) return;
    if (this == currMoleTile) {
        score += 10;
        document.getElementById("score").innerText = "Score: " + score.toString();
    } else if (currPlantTiles.includes(this.id)) {
        gameOver = true;
        clearInterval(intervalMole);
        clearInterval(intervalPlant);
        clearInterval(countdown);
        document.getElementById("score").innerText = "GAME OVER: " + score.toString();
        console.log("Game Over - Showing retry button");
        document.getElementById("retry").style.display = "block";
        updateHighScore();
    }
}

function startTimer(duration) {
    let timer = duration, minutes, seconds;
    countdown = setInterval(function () {
        if (gameOver) {
            clearInterval(countdown);
            return;
        }
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        document.getElementById("timer").innerText = "Time: " + minutes + ":" + seconds;

        if (--timer < 0) {
            gameOver = true;
            clearInterval(intervalMole);
            clearInterval(intervalPlant);
            clearInterval(countdown);
            document.getElementById("score").innerText = "TIME'S UP! Score: " + score.toString();
            console.log("Time's Up - Showing retry button");
            document.getElementById("retry").style.display = "block";
            updateHighScore();
        }
    }, 1000);
}

function updateHighScore() {
    const highScoreElem = document.getElementById("highscore");
    let highScore = parseInt(highScoreElem.innerText.replace("High Score: ", ""), 10) || 0;
    if (score > highScore) {
        highScore = score;
        highScoreElem.innerText = "High Score: " + highScore;
    }
}

// Retry button functionality
document.getElementById("retry").addEventListener("click", function() {
    console.log("Retry button clicked");
    document.getElementById("board").innerHTML = "";
    clearInterval(intervalMole);
    clearInterval(intervalPlant);
    clearInterval(countdown);
    setGame();
});
