document.addEventListener('DOMContentLoaded', () => {
    let balance = 1000;
    let playerScore = 0;
    let dealerScore = 0;
    const playerCards = [];
    const dealerCards = [];
    let currentBet = 0;

    // UI Elements
    const balanceElement = document.getElementById('balance');
    const playerScoreElement = document.getElementById('player-score');
    const dealerScoreElement = document.getElementById('dealer-score');
    const playerCardsElement = document.getElementById('player-cards');
    const dealerCardsElement = document.getElementById('dealer-cards');
    const resultMessageElement = document.getElementById('result-message');

    // Event Listeners
    document.getElementById('hit').addEventListener('click', playerHit);
    document.getElementById('stand').addEventListener('click', playerStand);
    document.getElementById('reset').addEventListener('click', resetGame);

    function playerHit() {
        const card = drawCard();
        playerCards.push(card);
        playerScore = calculateScore(playerCards);
        updateUI();
        if (playerScore > 21) {
            setTimeout(() => endGame('Bust! Dealer Wins', false), 500);
        } else if (playerScore === 21) {
            setTimeout(() => endGame('Player Wins with 21!', true), 500);
        }
    }

    function playerStand() {
        dealerTurn();
    }

    function dealerTurn() {
        if (dealerScore < 17) {
            const card = drawCard();
            dealerCards.push(card);
            dealerScore = calculateScore(dealerCards);
            updateUI();
            if (dealerScore > 21) {
                setTimeout(() => endGame('Dealer Busts! Player Wins', true), 500);
            } else if (dealerScore === 21) {
                setTimeout(() => endGame('Dealer Wins with 21!', false), 500);
            } else {
                setTimeout(dealerTurn, 500); // Continue dealer's turn
            }
        } else {
            determineWinner();
        }
    }

    function resetGame() {
        playerCards.length = 0;
        dealerCards.length = 0;
        playerScore = 0;
        dealerScore = 0;
        currentBet = 0;
        balance = 1000;
        updateUI();
        hideResultMessage();
    }

    function determineWinner() {
        const { result, balanceChange } = determineWinnerLogic(playerScore, dealerScore, currentBet, balance);
        balance += balanceChange;
        animateBalanceChange(balanceElement, balance);
        showResultMessage(result.includes('Wins') ? 'You Win!' : 'You Lose!');
        if (result.includes('Player Wins')) {
            showConfetti();
        }
        setTimeout(() => resetGame(), 5000);
    }

    function updateUI() {
        balanceElement.textContent = balance;
        playerScoreElement.textContent = `Score: ${playerScore}`;
        dealerScoreElement.textContent = `Score: ${dealerScore}`;
        playerCardsElement.innerHTML = playerCards.map((card, index) => {
            const cardElement = createCardElement(card);
            animateCardDealing(cardElement, index * 200);
            return cardElement.outerHTML;
        }).join('');
        dealerCardsElement.innerHTML = dealerCards.map((card, index) => {
            const cardElement = createCardElement(card);
            animateCardDealing(cardElement, index * 200);
            return cardElement.outerHTML;
        }).join('');
    }

    function createCardElement(card) {
        const cardElement = document.createElement('div');
        cardElement.className = `card ${card.suit}`;
        cardElement.innerHTML = `
            <div class="value">${card.value}</div>
            <div class="suit">${getSuitSymbol(card.suit)}</div>
        `;
        return cardElement;
    }

    function drawCard() {
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        const suit = suits[Math.floor(Math.random() * suits.length)];
        const value = values[Math.floor(Math.random() * values.length)];
        return { suit, value };
    }

    function calculateScore(cards) {
        let score = 0;
        let aces = 0;
        cards.forEach(card => {
            if (card.value === 'A') {
                score += 11;
                aces += 1;
            } else if (['K', 'Q', 'J'].includes(card.value)) {
                score += 10;
            } else {
                score += parseInt(card.value, 10);
            }
        });
        while (score > 21 && aces > 0) {
            score -= 10;
            aces -= 1;
        }
        return score;
    }

    function getSuitSymbol(suit) {
        switch (suit) {
            case 'hearts': return '♥';
            case 'diamonds': return '♦';
            case 'clubs': return '♣';
            case 'spades': return '♠';
        }
    }

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
        for (let i = 0; i < 300; i++) {
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
        setTimeout(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, 5000);
        draw();
    }

    function showResultMessage(message) {
        resultMessageElement.textContent = message;
        resultMessageElement.style.display = 'block';
    }

    function hideResultMessage() {
        resultMessageElement.style.display = 'none';
    }

    function determineWinnerLogic(playerScore, dealerScore, currentBet, balance) {
        if (playerScore > 21) {
            return { result: 'Bust! Dealer Wins', balanceChange: 0 };
        } else if (dealerScore > 21 || playerScore > dealerScore) {
            return { result: 'Player Wins', balanceChange: currentBet * 2 };
        } else if (playerScore < dealerScore) {
            return { result: 'Dealer Wins', balanceChange: 0 };
        } else {
            return { result: 'Push', balanceChange: currentBet };
        }
    }

    resetGame();
});
