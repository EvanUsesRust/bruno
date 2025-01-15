function animateCardDealing(cardElement, delay) {
    cardElement.style.opacity = '0';
    cardElement.style.transform = 'translateY(-20px)';
    setTimeout(() => {
        cardElement.style.transition = 'all 0.5s ease';
        cardElement.style.opacity = '1';
        cardElement.style.transform = 'translateY(0)';
    }, delay);
}

function animateBalanceChange(balanceElement, balance) {
    balanceElement.style.transition = 'color 0.5s ease';
    balanceElement.style.color = balance >= 0 ? 'lime' : 'red';
    setTimeout(() => {
        balanceElement.textContent = balance;
        balanceElement.style.color = 'white';
    }, 500);
}

function showConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confetti = [];
    for (let i = 0; i < 30; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            w: Math.random() * 10 + 5,
            h: Math.random() * 10 + 5,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            speed: Math.random() * 3 + 2,
            angle: Math.random() * Math.PI * 2,
            spin: Math.random() * 0.2 - 0.1
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confetti.forEach((p) => {
            p.y += p.speed;
            p.angle += p.spin;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + p.w * Math.cos(p.angle), p.y + p.h * Math.sin(p.angle));
            ctx.lineTo(p.x + p.w * Math.cos(p.angle + Math.PI / 2), p.y + p.h * Math.sin(p.angle + Math.PI / 2));
            ctx.lineTo(p.x + p.w * Math.cos(p.angle + Math.PI), p.y + p.h * Math.sin(p.angle + Math.PI));
            ctx.closePath();
            ctx.fill();
            if (p.y > canvas.height) {
                p.y = 0;
                p.x = Math.random() * canvas.width;
            }
        });
        requestAnimationFrame(draw);
    }
    draw();
}
