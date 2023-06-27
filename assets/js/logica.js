const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;


//Getting high score fron th local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const updadeFoodPosition = () => {
    //passing a random 1-30 value as food position
    foodX = Math.floor(Math.random() * 50) + 1;
    foodY = Math.floor(Math.random() * 50) + 1;
}

const updateIntervalTime = () => {
    // Update time range based on score
    const intervalTime = Math.max(100 - score * 10, 50);

    // Use intervalTime to update game speed
    clearInterval(setIntervalId);
    setIntervalId = setInterval(initGame, intervalTime);
}

const handleGameOver = () => {
    // clearing the timer and reloading the page on game over
    clearInterval(setIntervalId);
    alert("Game Over! press ok to replay...");
    location.reload();
    updateIntervalTime();
}

const changeDirection = e => {
    if (e.key === "ArrowUp" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;

    } else if (e.key === "ArrowDown" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    }
    else if (e.key === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    }
    else if (e.key === "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

const initGame = () => {
    if (gameOver) return handleGameOver();
    let html = ``;

    //Cheking if the snake hit the food
    if (snakeX === foodX && snakeY === foodY) {
        updadeFoodPosition();
        snakeBody.push([foodX, foodY]);
        score++;
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
        updadeFoodPosition();
    }
    snakeX += velocityX;
    snakeY += velocityY;

    const newSnakeBody = [];
    newSnakeBody.unshift([snakeX, snakeY]);

    for (let i = 0; i < snakeBody.length - 1; i++) {
        newSnakeBody.push([...snakeBody[i]]);
    }
    snakeBody = newSnakeBody;


    if (snakeX <= 0 || snakeX > 50 || snakeY <= 0 || snakeY > 50) {
        return gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {

        //Adding a div for each part of the snake's body
        html += `<div class = "head" style = "grid-area: 
        ${snakeBody[i][1]}/${snakeBody[i][0]}"></div>`;

        //cheking if the snake head hit the body, if so set gameOver to true
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1]
            && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    html += `<div class = "food" style ="grid-area:${foodY}/${foodX}"></div>`;
    playBoard.innerHTML = html;
    updateIntervalTime()
}

updadeFoodPosition();
setIntervalId = setInterval(initGame, 200);
document.addEventListener("keyup", changeDirection);
