const canvas = document.getElementById('plinkoCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 700;

const pegs = [];
const balls = [];
let particles = [];
const history = [];
const rows = 10;
const pegRadius = 5;
const ballRadius = 5;
const gravity = 0.3;
const friction = 0.98;
let money = 100;

const multipliers = [2, 1.4, 1.2, 1, 0.5, 1, 1.2, 1.4, 2];

function initPegs() {
    pegs.length = 0; // Clear the pegs array
    const pegSpacingX = canvas.width / (rows + 1);
    const pegSpacingY = (canvas.height - 100) / (rows + 1);
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col <= row; col++) {
            const x = (canvas.width / 2) - (row * pegSpacingX / 2) + (col * pegSpacingX);
            const y = (row + 1) * pegSpacingY;
            pegs.push({ x, y });
        }
    }
}

function drawPegs() {
    ctx.fillStyle = '#333';
    for (const peg of pegs) {
        ctx.beginPath();
        ctx.arc(peg.x, peg.y, pegRadius, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawMultipliers() {
    const sectionWidth = canvas.width / multipliers.length;
    for (let i = 0; i < multipliers.length; i++) {
        ctx.fillStyle = `rgba(${i * 30}, ${255 - i * 30}, ${i * 20}, 0.2)`;
        ctx.fillRect(i * sectionWidth, canvas.height - 100, sectionWidth, 100);
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.font = '20px Arial';
        ctx.fillText(`x${multipliers[i]}`, (i + 0.5) * sectionWidth, canvas.height - 70);
    }
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getRandomOpacity() {
    return Math.random() * 0.12;
}

function getRandomParticleSize() {
    return Math.random() * 4 + 1;
}

function createParticles(x, y, color) {
    for (let i = 0; i < 5; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            color: color,
            opacity: getRandomOpacity(),
            size: getRandomParticleSize(),
            life: 50
        });
    }
}

function updateParticles() {
    for (const particle of particles) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 1;
    }
    // Remove particles that have expired
    particles = particles.filter(particle => particle.life > 0);
}

function drawParticles() {
    for (const particle of particles) {
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0; // Reset opacity for other elements
    }
}

function addHistory(ballColor, multiplier, moneyChange) {
    const historyEntry = document.createElement('div');
    historyEntry.style.opacity = 1;
    historyEntry.innerHTML = `<div style="display: inline-block; width: 12px; height: 12px; background-color: ${ballColor}; border-radius: 50%; margin-right: 10px;"></div> ${multiplier}x multiplier ${moneyChange >= 0 ? '+' : ''}${moneyChange}$`;
    document.getElementById('historyContainer').prepend(historyEntry);
    
    setTimeout(() => {
        let fadeOutInterval = setInterval(() => {
            if (historyEntry.style.opacity > 0) {
                historyEntry.style.opacity -= 0.01;
            } else {
                clearInterval(fadeOutInterval);
                historyEntry.remove();
            }
        }, 30);
    }, 3000);
}

function dropBall() {
    const betAmount = parseInt(document.getElementById('betAmount').value, 10);
    if (money >= betAmount) {
        money -= betAmount;
        updateMoney();
        balls.push({
            x: canvas.width / 2,
            y: 20, // Spawn the ball just below the top inside the triangle
            vx: Math.random() * 2 - 1,
            vy: 2,
            color: getRandomColor(),
            betAmount: betAmount,
            glowing: false
        });
    }
}

function updateBalls() {
    for (const ball of balls) {
        ball.vy += gravity;
        ball.vx *= friction;
        ball.vy *= friction;
        ball.x += ball.vx;
        ball.y += ball.vy;

        if (ball.y + ballRadius > canvas.height - 100) {
            const sectionWidth = canvas.width / multipliers.length;
            const index = Math.floor(ball.x / sectionWidth);
            const multiplier = multipliers[index] || 0;
            const moneyChange = ball.betAmount * multiplier;
            money += moneyChange;
            updateMoney();
            createParticles(ball.x, ball.y, ball.color); // Create particles when ball lands in a section
            addHistory(ball.color, multiplier, moneyChange); // Add history entry
            balls.splice(balls.indexOf(ball), 1);
        }

        // Ball and peg collision
        for (const peg of pegs) {
            const dx = ball.x - peg.x;
            const dy = ball.y - peg.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < pegRadius + ballRadius) {
                const angle = Math.atan2(dy, dx);
                const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy) * 0.5; // Reduce intensity
                ball.vx = speed * Math.cos(angle + (Math.random() - 0.5) * 0.5);
                ball.vy = speed * Math.sin(angle + (Math.random() - 0.5) * 0.5);
                ball.x = peg.x + (pegRadius + ballRadius) * Math.cos(angle);
                ball.y = peg.y + (pegRadius + ballRadius) * Math.sin(angle);
                createParticles(ball.x, ball.y, ball.color); // Create particles on collision

                // Make the ball glow briefly
                ball.glowing = true;
                setTimeout(() => {
                    ball.glowing = false;
                }, 100); // Glowing duration: 100ms
            }
        }

        // Invisible border collision
        if (ball.x - ballRadius < 0) {
            ball.x = ballRadius;
            ball.vx = Math.abs(ball.vx) * 0.5;
        }
        if (ball.x + ballRadius > canvas.width) {
            ball.x = canvas.width - ballRadius;
            ball.vx = -Math.abs(ball.vx) * 0.5;
        }
        if (ball.y - ballRadius < 0) {
            ball.y = ballRadius;
            ball.vy = Math.abs(ball.vy) * 0.5;
        }
    }
}

function drawBalls() {
    for (const ball of balls) {
        ctx.fillStyle = ball.color;
        ctx.shadowBlur = ball.glowing ? 20 : 0; // Apply glow effect
        ctx.shadowColor = ball.color; // Same color as the ball
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow blur for other elements
    }
}

function updateMoney() {
    document.getElementById('moneyDisplay').innerText = `Money: $${money.toFixed(2)}`;
    checkBetAmount();
}

function checkBetAmount() {
    const betAmount = parseInt(document.getElementById('betAmount').value, 10);
    const dropBallButton = document.getElementById('dropBallButton');
    if (betAmount > money) {
        dropBallButton.disabled = true;
    } else {
        dropBallButton.disabled = false;
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPegs();
    drawMultipliers();
    updateBalls();
    drawBalls();
    updateParticles();
    drawParticles();
    requestAnimationFrame(animate);
}

document.getElementById('betAmount').addEventListener('input', checkBetAmount);
document.getElementById('dropBallButton').addEventListener('click', dropBall);

initPegs();
animate();
