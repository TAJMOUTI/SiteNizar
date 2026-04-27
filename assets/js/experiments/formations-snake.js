// Déclaration des variables globales
let canvas, ctx;
let unit = 20; // Taille d'une unité du serpent et de la nourriture
let dates = ['2017', '2018', '2021', '2023']; // Dates à manger
let snake, direction, food, score; // Variables pour le serpent, la direction, la nourriture et le score
let gameInterval; // Intervalle pour la mise à jour du jeu

// Fonction d'initialisation du jeu
function initializeGame() {
    canvas = document.getElementById('snake-game');
    ctx = canvas.getContext('2d');
    snake = [{ x: 100, y: 100 }]; // Position initiale du serpent
    direction = 'RIGHT'; // Direction initiale
    score = 0; // Score initial

    // Générez la position de la nourriture
    generateValidFoodPosition();

    // Afficher la première date immédiatement
    drawInitialFood();

    if (gameInterval) clearInterval(gameInterval); // Nettoyer l'intervalle précédent
    gameInterval = setInterval(() => {
        updateSnakePosition(); // Mettre à jour la position du serpent
        draw(); // Dessiner le serpent et la nourriture
    }, 100);
}

// Fonction pour générer une unité aléatoire
function getRandomUnit() {
    return Math.floor(Math.random() * (canvas.width / unit)) * unit;
}

// Fonction pour dessiner le serpent
function drawSnake() {
    snake.forEach(part => {
        ctx.fillStyle = '#f5593d'; // Couleur du serpent
        ctx.fillRect(part.x, part.y, unit, unit); // Dessiner chaque partie du serpent
        ctx.strokeStyle = '#e04b28'; // Couleur de la bordure
        ctx.strokeRect(part.x, part.y, unit, unit); // Dessiner la bordure
    });
}

// Fonction pour dessiner la nourriture
function drawFood() {
    ctx.fillStyle = '#28a745'; // Couleur verte pour la nourriture
    ctx.fillRect(food.x, food.y, unit, unit); // Dessiner la nourriture
    ctx.font = '15px Arial'; // Définir la police
    ctx.fillStyle = '#000'; // Couleur noire pour le texte des dates

    if (score < dates.length) {
        ctx.fillText(dates[score], food.x + 5, food.y + 15); // Afficher la date actuelle
    }
}

// Fonction pour dessiner la première nourriture
function drawInitialFood() {
    food = { x: getRandomUnit(), y: getRandomUnit() }; // Générer une position aléatoire pour la nourriture
    drawFood(); // Dessiner la première nourriture avec la date
}

// Fonction pour générer une position de nourriture valide
function generateValidFoodPosition() {
    let validPosition = false;
    while (!validPosition) {
        food = { x: getRandomUnit(), y: getRandomUnit() }; // Générer une nouvelle position
        validPosition = !snake.some(part => part.x === food.x && part.y === food.y); // Vérifier que la nourriture ne soit pas sur le serpent
    }
}

// Fonction pour vérifier les collisions avec la nourriture
function checkCollision() {
    if (snake[0].x === food.x && snake[0].y === food.y) { // Si le serpent mange la nourriture
        score++; // Incrémenter le score
        snake.push({}); // Grandir le serpent

        // Vérifier si le score a atteint le nombre de dates
        if (score >= dates.length) {
            endGame(); // Fin du jeu
        } else {
            generateValidFoodPosition(); // Générer une nouvelle position pour la nourriture
        }
    }
}

// Écouter les événements de touches pour changer la direction
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
    if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
});

// Fonction pour mettre à jour la position du serpent
function updateSnakePosition() {
    const head = { ...snake[0] }; // Copier la tête du serpent

    // Déplacer le serpent dans la direction actuelle
    if (direction === 'RIGHT') head.x += unit;
    if (direction === 'LEFT') head.x -= unit;
    if (direction === 'UP') head.y -= unit;
    if (direction === 'DOWN') head.y += unit;

    // Logique de wrap autour : Si le serpent dépasse le canevas, il réapparaît de l'autre côté
    if (head.x >= canvas.width) head.x = 0;
    if (head.x < 0) head.x = canvas.width - unit;
    if (head.y >= canvas.height) head.y = 0;
    if (head.y < 0) head.y = canvas.height - unit;

    snake.unshift(head); // Ajouter la nouvelle tête
    snake.pop(); // Retirer la dernière partie du serpent
}

// Fonction pour dessiner le jeu
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Effacer le canevas
    drawFood(); // Dessiner la nourriture
    drawSnake(); // Dessiner le serpent
    checkCollision(); // Vérifier les collisions avec la nourriture
}

// Fonction pour gérer la fin du jeu
function endGame() {
    clearInterval(gameInterval); // Arrêter l'intervalle de jeu
    document.getElementById('snake-game-container').style.display = 'none'; // Cacher le jeu
    document.querySelector('.formation-container').style.display = 'block'; // Montrer la frise chronologique
    document.getElementById('replay-container').style.display = 'block'; // Montrer le bouton de rejouer
}

// Écouter le clic sur le bouton de rejouer
document.getElementById('replay-button').addEventListener('click', () => {
    document.querySelector('.formation-container').style.display = 'none'; // Cacher la frise
    document.getElementById('replay-container').style.display = 'none'; // Cacher le bouton de rejouer
    initializeGame(); // Redémarrer le jeu
});

// Initialiser le jeu lorsque la page se charge
initializeGame();
