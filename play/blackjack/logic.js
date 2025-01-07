function determineWinnerLogic(playerScore, dealerScore, currentBet, balance) {
    if (playerScore > 21) {
        return { result: 'Bust! Dealer Wins', balanceChange: 0 };
    } else if (dealerScore > 21 || playerScore > dealerScore) {
        showConfetti(); // Show confetti when the player wins
        return { result: 'Player Wins', balanceChange: currentBet * 2 };
    } else if (playerScore < dealerScore) {
        return { result: 'Dealer Wins', balanceChange: 0 };
    } else {
        return { result: 'Push', balanceChange: currentBet };
    }
}
