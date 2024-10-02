document.addEventListener('DOMContentLoaded', (event) => {
    const canvas = document.getElementById('snake-game');
    const ctx = canvas.getContext('2d');
    const unit = 20;
    const dates = ['2017', '2018', '2021', '2023'];
    let snake = [{ x: 100, y: 100 }];
    let direction = 'RIGHT';
    let food = { x: getRandomUnit(), y: getRandomUnit() };
    let score = 0;

    function getRandomUnit() {
        return Math.floor(Math.random() * (canvas.width / unit)) * unit;
    }

    function drawSnake() {
        snake.forEach(part => {
            ctx.fillStyle = '#f5593d';
            ctx.fillRect(part.x, part.y, unit, unit);
            ctx.strokeStyle = '#e04b28';
            ctx.strokeRect(part.x, part.y, unit, unit);
        });
    }

    function drawFood() {
        ctx.fillStyle = '#28a745';  // Green color for the food
        ctx.fillRect(food.x, food.y, unit, unit);
        ctx.font = '15px Arial';
        ctx.fillStyle = '#000';  // Black color for the date text
        ctx.fillText(dates[score], food.x + 5, food.y + 15); // Display the current date
    }

    function generateValidFoodPosition() {
        let validPosition = false;
        while (!validPosition) {
            food = { x: getRandomUnit(), y: getRandomUnit() };
            validPosition = !snake.some(part => part.x === food.x && part.y === food.y);
        }
    }

    function checkCollision() {
        if (snake[0].x === food.x && snake[0].y === food.y) {
            score++;
            snake.push({}); // Grow the snake
            if (score >= dates.length) {
                endGame();
            } else {
                generateValidFoodPosition();
            }
        }
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
        if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
        if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
        if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
    });

    function updateSnakePosition() {
        const head = { ...snake[0] };

        // Move the snake in the current direction
        if (direction === 'RIGHT') head.x += unit;
        if (direction === 'LEFT') head.x -= unit;
        if (direction === 'UP') head.y -= unit;
        if (direction === 'DOWN') head.y += unit;

        // Wrap around logic: If the snake goes beyond the canvas, it reappears on the opposite side
        if (head.x >= canvas.width) head.x = 0;
        if (head.x < 0) head.x = canvas.width - unit;
        if (head.y >= canvas.height) head.y = 0;
        if (head.y < 0) head.y = canvas.height - unit;

        snake.unshift(head);
        snake.pop();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas
        drawFood();  // Draw the food (green square with date)
        drawSnake();  // Draw the snake
        checkCollision();  // Check for collisions with the food
    }

    const gameInterval = setInterval(() => {
        updateSnakePosition();
        draw();
    }, 100);

    function endGame() {
        clearInterval(gameInterval);
        document.getElementById('snake-game-container').style.display = 'none';  // Hide the game
        document.querySelector('.formation-container').style.display = 'block';  // Show the formations
        document.getElementById('replay-container').style.display = 'block';  // Show the replay button
    }

    document.getElementById('replay-button').addEventListener('click', () => {
        window.location.reload();  // Reload the page to restart the game
    });
});
