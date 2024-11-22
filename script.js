const redCharacter = document.getElementById('redCharacter');
const blueSquare = document.getElementById('blueSquare');
const joystick = document.getElementById('joystick');
const knob = document.getElementById('knob');

let joystickActive = false;
let knobCenterX, knobCenterY;
let gameAreaRect = document.getElementById('gameArea').getBoundingClientRect();
let characterSpeed = 2;  // Adjust speed for smoother control
let maxKnobDistance = joystick.offsetWidth / 2 - knob.offsetWidth / 2;

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
    knobCenterX = joystick.offsetLeft + joystick.offsetWidth / 2;
    knobCenterY = joystick.offsetTop + joystick.offsetHeight / 2;
});

joystick.addEventListener('touchmove', (e) => {
    if (!joystickActive) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - knobCenterX;
    const deltaY = touch.clientY - knobCenterY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    let limitedDeltaX = deltaX;
    let limitedDeltaY = deltaY;

    // Limit the knob movement within the joystick area
    if (distance > maxKnobDistance) {
        const angle = Math.atan2(deltaY, deltaX);
        limitedDeltaX = Math.cos(angle) * maxKnobDistance;
        limitedDeltaY = Math.sin(angle) * maxKnobDistance;
    }

    knob.style.transform = `translate(${limitedDeltaX}px, ${limitedDeltaY}px)`;

    // Move the character
    const characterRect = redCharacter.getBoundingClientRect();
    let newLeft = characterRect.left + limitedDeltaX * characterSpeed * 0.01;
    let newTop = characterRect.top + limitedDeltaY * characterSpeed * 0.01;

    // Keep the character within the game area
    if (newLeft >= gameAreaRect.left && newLeft + characterRect.width <= gameAreaRect.right) {
        redCharacter.style.left = `${newLeft - gameAreaRect.left}px`;
    }
    if (newTop >= gameAreaRect.top && newTop + characterRect.height <= gameAreaRect.bottom) {
        redCharacter.style.top = `${newTop - gameAreaRect.top}px`;
    }

    checkCollision();
});

joystick.addEventListener('touchend', () => {
    joystickActive = false;
    knob.style.transform = 'translate(0, 0)';
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
