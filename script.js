// Set up canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
const spaceship = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 60,
    width: 40,
    height: 40,
    speedX: 0,
    speedY: 0
};

let asteroids = [];
let score = 0;
let joystick = document.getElementById('joystick');
let knob = document.getElementById('knob');
const centerX = joystick.offsetWidth / 2;
const centerY = joystick.offsetHeight / 2;
const maxRadius = centerX;

let isDragging = false;

// Asteroid creation
function createAsteroid() {
    const x = Math.random() * (canvas.width - 40);
    const speed = Math.random() * 2 + 1;
    asteroids.push({ x, y: -40, width: 40, height: 40, speed });
}

// Game loop
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw spaceship
    ctx.fillStyle = 'lime';
    ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);

    // Move spaceship
    spaceship.x += spaceship.speedX;
    spaceship.y += spaceship.speedY;

    // Boundary checks
    if (spaceship.x < 0) spaceship.x = 0;
    if (spaceship.x + spaceship.width > canvas.width) spaceship.x = canvas.width - spaceship.width;
    if (spaceship.y < 0) spaceship.y = 0;
    if (spaceship.y + spaceship.height > canvas.height) spaceship.y = canvas.height - spaceship.height;

    // Draw and move asteroids
    ctx.fillStyle = 'red';
    asteroids.forEach((asteroid, index) => {
        asteroid.y += asteroid.speed;
        ctx.fillRect(asteroid.x, asteroid.y, asteroid.width, asteroid.height);

        // Collision detection
        if (
            spaceship.x < asteroid.x + asteroid.width &&
            spaceship.x + spaceship.width > asteroid.x &&
            spaceship.y < asteroid.y + asteroid.height &&
            spaceship.y + spaceship.height > asteroid.y
        ) {
            alert('Game Over! Your score: ' + score);
            document.location.reload();
        }

        // Remove asteroids that go off-screen
        if (asteroid.y > canvas.height) {
            asteroids.splice(index, 1);
            score++;
        }
    });

    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);

    requestAnimationFrame(updateGame);
}

setInterval(createAsteroid, 1000); // Create an asteroid every second

// Joystick functionality
joystick.addEventListener('touchstart', (e) => {
    isDragging = true;
    updateKnob(e.touches[0]);
});

joystick.addEventListener('touchmove', (e) => {
    if (isDragging) {
        updateKnob(e.touches[0]);
    }
});

joystick.addEventListener('touchend', () => {
    isDragging = false;
    resetKnob();
});

function updateKnob(touch) {
    const rect = joystick.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;

    const deltaX = touchX - centerX;
    const deltaY = touchY - centerY;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxRadius);

    const angle = Math.atan2(deltaY, deltaX);

    const knobX = centerX + distance * Math.cos(angle);
    const knobY = centerY + distance * Math.sin(angle);

    knob.style.left = `${knobX}px`;
    knob.style.top = `${knobY}px`;

    // Update spaceship speed
    spaceship.speedX = (deltaX / maxRadius) * 4;
    spaceship.speedY = (deltaY / maxRadius) * 4;
}

function resetKnob() {
    knob.style.left = `50%`;
    knob.style.top = `50%`;
    spaceship.speedX = 0;
    spaceship.speedY = 0;
}

// Start game
updateGame();
