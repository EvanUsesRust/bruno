let balance = 100;
let betColor = null;
let betAmount = 0;

document.getElementById('betRed').addEventListener('click', () => placeBet('red'));
document.getElementById('betBlack').addEventListener('click', () => placeBet('black'));
document.getElementById('betGreen').addEventListener('click', () => placeBet('green'));
document.getElementById('spinButton').addEventListener('click', spinWheel);

function placeBet(color) {
    betAmount = parseInt(document.getElementById('betAmount').value);
    if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance) {
        showMessage('Invalid bet amount');
        return;
    }
    betColor = color;
    console.log(`Bet placed: $${betAmount} on ${color}`);
    showMessage(`You bet $${betAmount} on ${color}`);
    document.getElementById('spinButton').disabled = false;
}

function spinWheel() {
    console.log('Spinning the wheel...');
    const wheel = document.getElementById('wheel');
    const initialRotation = 360; // Initial fast rotation
    const segmentAngle = 30; // Each segment is 30 degrees
    const finalRotation = Math.floor(Math.random() * 12) * segmentAngle; // Final position
    const totalRotation = initialRotation * 10 + finalRotation; // 10 full rotations + final position

    // Initial fast spin for 1 second
    wheel.style.transition = 'transform 1s linear';
    wheel.style.transform = `rotate(${initialRotation}deg)`;

    setTimeout(() => {
        // Slower deceleration to final position
        wheel.style.transition = 'transform 3s ease-out';
        wheel.style.transform = `rotate(${totalRotation}deg)`;
    }, 1000); // After 1 second

    setTimeout(() => {
        setTimeout(() => {
            console.log(`Total Rotation: ${totalRotation} degrees`);
            const finalDegrees = (360 - (totalRotation % 360)) % 360; // Adjust for pointer position
            console.log(`Final Degrees (Adjusted): ${finalDegrees}`);
            const selectedColor = getSelectedColor(finalDegrees);
            console.log(`Selected color: ${selectedColor}`);

            // Display result
            const result = document.getElementById('result');
            result.innerText = `It landed on ${selectedColor.toUpperCase()}!`;

            // Update balance
            balance -= betAmount;
            document.getElementById('balance').innerText = balance;

            if (selectedColor === betColor) {
                let payoutMultiplier = selectedColor === 'green' ? 14 : 2;
                let winnings = betAmount * payoutMultiplier;
                balance += winnings;
                showMessage(`You win! Payout: $${winnings}`);
            } else {
                showMessage('You lose!');
            }
            document.getElementById('balance').innerText = balance;
            betColor = null;
            betAmount = 0;
            document.getElementById('spinButton').disabled = true;
        }, 100); // 100ms delay to ensure wheel is stopped
    }, 4000); // 4 seconds total (1s fast + 3s slow)
}
function getSelectedColor(degrees) {
    const segments = [
        { color: 'red', start: 0, end: 30 },
        { color: 'black', start: 30, end: 60 },
        { color: 'red', start: 60, end: 90 },
        { color: 'black', start: 90, end: 120 },
        { color: 'red', start: 120, end: 150 },
        { color: 'black', start: 150, end: 180 },
        { color: 'red', start: 180, end: 210 },
        { color: 'black', start: 210, end: 240 },
        { color: 'red', start: 240, end: 270 },
        { color: 'black', start: 270, end: 300 },
        { color: 'red', start: 300, end: 330 },
        { color: 'green', start: 330, end: 360 },
    ];
    const selectedSegment = segments.find(segment => degrees >= segment.start && degrees < segment.end);
    console.log(`Degrees: ${degrees}, Selected Segment: ${selectedSegment.color}`);
    return selectedSegment.color;
}

function showMessage(message) {
    const messageElement = document.getElementById('message');
    messageElement.innerText = message;
    messageElement.style.display = 'block';
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 5000); // Hide message after 5 seconds
}
