const redCharacter = document.getElementById('redCharacter');
const blueSquare = document.getElementById('blueSquare');
const joystick = document.getElementById('joystick');
const knob = document.getElementById('knob');

let joystickActive = false;
let gameAreaRect = document.getElementById('gameArea').getBoundingClientRect();
let characterSpeed = 0.5;
let joystickCenter = { x: 0, y: 0 };
let maxKnobDistance = joystick.offsetWidth / 2 - knob.offsetWidth / 2;

const randomPosition = () => {
    const x = Math.random() * (gameAreaRect.width - 30);
    const y = Math.random() * (gameAreaRect.height - 30);
    blueSquare.style.left = `${x}px`;
    blueSquare.style.top = `${y}px`;
};

randomPosition();

// Initial position for character
redCharacter.style.left = `${gameAreaRect.width / 2 - redCharacter.offsetWidth / 2}px`;
redCharacter.style.top = `${gameAreaRect.height / 2 - redCharacter.offsetHeight / 2}px`;

joystick.addEventListener('touchstart', (e) => {
    joystickActive = true;
    const rect = joystick.getBoundingClientRect();
    joystickCenter.x = rect.left + rect.width / 2;
    joystickCenter.y = rect.top + rect.height / 2;
});

joystick.addEventListener('touchmove', (e) => {
    if (!joystickActive) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - joystickCenter.x;
    const deltaY = touch.clientY - joystickCenter.y;
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
    let newLeft = parseFloat(redCharacter.style.left || 0) + (limitedDeltaX / maxKnobDistance) * characterSpeed;
    let newTop = parseFloat(redCharacter.style.top || 0) + (limitedDeltaY / maxKnobDistance) * characterSpeed;

    // Keep the character within the game area
    newLeft = Math.max(0, Math.min(newLeft, gameAreaRect.width - redCharacter.offsetWidth));
    newTop = Math.max(0, Math.min(newTop, gameAreaRect.height - redCharacter.offsetHeight));

    redCharacter.style.left = `${newLeft}px`;
    redCharacter.style.top = `${newTop}px`;

    checkCollision();
});

joystick.addEventListener('touchend', () => {
    joystickActive = false;
    knob.style.transition = 'transform 0.2s ease';
    knob.style.transform = 'translate(0, 0)';
    setTimeout(() => {
        knob.style.transition = '';
    }, 200);
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
