// Set up canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load images
const vespaImage = new Image();
vespaImage.src = 'assets/vespa.png';

const spaceshipImage = new Image();
spaceshipImage.src = 'assets/arqueiro.png';

const arrowImage = new Image();
arrowImage.src = 'assets/flecha.png';

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
let arrows = [];
let score = 0;
let joystick = document.getElementById('joystick');
let knob = document.getElementById('knob');
const centerX = joystick.offsetWidth / 2;
const centerY = joystick.offsetHeight / 2;
const maxRadius = centerX;

let isDragging = false;
let gameOver = false;

// Asteroid creation
function createAsteroid() {
    const x = Math.random() * (canvas.width - 40);
    const speed = Math.random() * 2 + 1;
    asteroids.push({ x, y: -40, width: 40, height: 40, speed });
}

// Arrow creation
function shootArrow() {
    arrows.push({ x: spaceship.x + spaceship.width / 2 - 5, y: spaceship.y, width: 10, height: 20, speed: 5 });
}

// Game loop
function updateGame() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw spaceship
    ctx.drawImage(spaceshipImage, spaceship.x, spaceship.y, spaceship.width, spaceship.height);

    // Move spaceship
    spaceship.x += spaceship.speedX;
    spaceship.y += spaceship.speedY;

    // Boundary checks
    if (spaceship.x < 0) spaceship.x = 0;
    if (spaceship.x + spaceship.width > canvas.width) spaceship.x = canvas.width - spaceship.width;
    if (spaceship.y < 0) spaceship.y = 0;
    if (spaceship.y + spaceship.height > canvas.height) spaceship.y = canvas.height - spaceship.height;

    // Draw and move asteroids
    asteroids.forEach((asteroid, index) => {
        asteroid.y += asteroid.speed;
        ctx.drawImage(vespaImage, asteroid.x, asteroid.y, asteroid.width, asteroid.height);

        // Collision detection
        if (
            spaceship.x < asteroid.x + asteroid.width &&
            spaceship.x + spaceship.width > asteroid.x &&
            spaceship.y < asteroid.y + asteroid.height &&
            spaceship.y + spaceship.height > asteroid.y
        ) {
            gameOver = true;
            setTimeout(() => {
                alert('Game Over! Your score: ' + score);
                document.location.reload();
            }, 100);
        }

        // Remove asteroids that go off-screen
        if (asteroid.y > canvas.height) {
            asteroids.splice(index, 1);
            score++;
        }
    });

    // Draw and move arrows
    arrows.forEach((arrow, index) => {
        arrow.y -= arrow.speed;
        ctx.drawImage(arrowImage, arrow.x, arrow.y, arrow.width, arrow.height);

        // Remove arrows that go off-screen
        if (arrow.y + arrow.height < 0) {
            arrows.splice(index, 1);
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

// Add shoot button functionality
const shootButton = document.createElement('div');
shootButton.style.position = 'absolute';
shootButton.style.bottom = '30px';
shootButton.style.right = '30px';
shootButton.style.width = '80px';
shootButton.style.height = '80px';
shootButton.style.background = '#09f';
shootButton.style.border = '3px solid #0cf';
shootButton.style.borderRadius = '50%';
shootButton.style.opacity = '0.8';
shootButton.style.touchAction = 'none';
document.body.appendChild(shootButton);

shootButton.addEventListener('touchstart', shootArrow);

// Start game
updateGame();
