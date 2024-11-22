const redCharacter = document.getElementById('redCharacter');
const blueSquare = document.getElementById('blueSquare');
const joystick = document.getElementById('joystick');
const knob = document.getElementById('knob');

let joystickActive = false;
let knobStartX, knobStartY;
let gameAreaRect = document.getElementById('gameArea').getBoundingClientRect();

const randomPosition = () => {
    const x = Math.random() * (gameAreaRect.width - 30);
    const y = Math.random() * (gameAreaRect.height - 30);
    blueSquare.style.left = `${x}px`;
    blueSquare.style.top = `${y}px`;
};

randomPosition();

joystick.addEventListener('touchstart', (e) => {
    joystickActive = true;
    const touch = e.touches[0];
    knobStartX = touch.clientX;
    knobStartY = touch.clientY;
});

joystick.addEventListener('touchmove', (e) => {
    if (!joystickActive) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - knobStartX;
    const deltaY = touch.clientY - knobStartY;

    const characterRect = redCharacter.getBoundingClientRect();
    let newLeft = characterRect.left + deltaX;
    let newTop = characterRect.top + deltaY;

    // Keep the character within the game area
    if (newLeft >= gameAreaRect.left && newLeft + characterRect.width <= gameAreaRect.right) {
        redCharacter.style.left = `${newLeft - gameAreaRect.left}px`;
    }
    if (newTop >= gameAreaRect.top && newTop + characterRect.height <= gameAreaRect.bottom) {
        redCharacter.style.top = `${newTop - gameAreaRect.top}px`;
    }

    knobStartX = touch.clientX;
    knobStartY = touch.clientY;

    checkCollision();
});

joystick.addEventListener('touchend', () => {
    joystickActive = false;
});

const checkCollision = () => {
    const redRect = redCharacter.getBoundingClientRect();
    const blueRect = blueSquare.getBoundingClientRect();

    if (
        redRect.left < blueRect.left + blueRect.width &&
        redRect.left + redRect.width > blueRect.left &&
        redRect.top < blueRect.top + blueRect.height &&
        redRect.top + redRect.height > blueRect.top
    ) {
        alert('You win!');
        randomPosition();
    }
};
