document.addEventListener('DOMContentLoaded', () => {
    const character = document.getElementById('character');
    const gameContainer = document.querySelector('.game-container');
    const stepSize = 50;  // La distance parcourue à chaque clic

    const controls = {
        up: document.getElementById('up'),
        down: document.getElementById('down'),
        left: document.getElementById('left'),
        right: document.getElementById('right')
    };

    // Gérer les clics sur les boutons de direction
    controls.up.addEventListener('click', () => moveCharacter(0, -stepSize));
    controls.down.addEventListener('click', () => moveCharacter(0, stepSize));
    controls.left.addEventListener('click', () => moveCharacter(-stepSize, 0));
    controls.right.addEventListener('click', () => moveCharacter(stepSize, 0));

    function moveCharacter(dx, dy) {
        // Obtenir les positions actuelles
        const currentLeft = parseFloat(getComputedStyle(character).left);
        const currentTop = parseFloat(getComputedStyle(character).top);

        // Calculer les nouvelles positions
        const newLeft = Math.max(0, Math.min(gameContainer.clientWidth - character.clientWidth, currentLeft + dx));
        const newTop = Math.max(0, Math.min(gameContainer.clientHeight - character.clientHeight, currentTop + dy));

        // Mettre à jour la position du personnage
        character.style.left = `${newLeft}px`;
        character.style.top = `${newTop}px`;
    }
});
