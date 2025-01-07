function updateUIElements(balance, playerScore, dealerScore, playerCards, dealerCards, splitCards, hasSplit, hasDoubleDown) {
    const balanceElement = document.getElementById('balance');
    const playerScoreElement = document.getElementById('player-score');
    const dealerScoreElement = document.getElementById('dealer-score');
    const playerCardsElement = document.getElementById('player-cards');
    const dealerCardsElement = document.getElementById('dealer-cards');
    const splitCardsElement = document.getElementById('split-cards');
    const insuranceElement = document.getElementById('insurance');

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

    if (hasSplit) {
        splitCardsElement.innerHTML = splitCards.map((card, index) => {
            const cardElement = createCardElement(card);
            animateCardDealing(cardElement, index * 200);
            return cardElement.outerHTML;
        }).join('');
    } else {
        splitCardsElement.innerHTML = '';
    }

    insuranceElement.style.display = dealerCards.length > 0 && dealerCards[0].value === 'A' ? 'block' : 'none';
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

function logGameHistory(result, playerScore, dealerScore, currentBet) {
    const gameHistory = document.getElementById('game-history');
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.innerHTML = `
        <p>${result}</p>
        <p>Player Score: ${playerScore} - Dealer Score: ${dealerScore}</p>
        <p>Bet: $${currentBet}</p>
    `;
    gameHistory.prepend(logEntry);
}

function clearGameHistory() {
    const gameHistory = document.getElementById('game-history');
    gameHistory.innerHTML = '';
}
