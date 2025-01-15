

export function createLoadingScreen() {
    // Create a div for the loading screen
    let loadingScreen
    loadingScreen = document.createElement('div');
    loadingScreen.style.position = 'fixed';
    loadingScreen.style.top = '0';
    loadingScreen.style.left = '0';
    loadingScreen.style.width = '100%';
    loadingScreen.style.height = '100%';
    loadingScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    loadingScreen.style.color = 'white';
    loadingScreen.style.display = 'flex';
    loadingScreen.style.justifyContent = 'center';
    loadingScreen.style.alignItems = 'center';
    loadingScreen.style.zIndex = '1000';
    loadingScreen.innerHTML = `<h1>Loading...</h1>`;
    document.body.appendChild(loadingScreen);
    return loadingScreen
}

// helper/Utils.js

export function createStartButton(onStartCallback) {
    // Create a container for game rules and start button
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '50%';
    container.style.left = '50%';
    container.style.transform = 'translate(-50%, -50%)';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Semi-transparent background
    container.style.padding = '20px';
    container.style.borderRadius = '10px';
    container.style.zIndex = '1001';
    container.style.color = 'white';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.maxWidth = '90%';
    container.style.minWidth = '300px';
    container.style.boxSizing = 'border-box';

    // Create Game Rules element
    const gameRules = document.createElement('div');
    gameRules.innerHTML = `
        <h2>Red Light Green Light </h2>
        <h4>Game Rules</h4>
        <ul style="text-align: left; list-style: disc; padding-left: 20px;">
            <li>Use arrow keys or touch controls to move your character.</li>
            <li>Don't Move During Red Light.</li>
            <li>Move using touch or arrow during Green light</li>
            <li>Touch the finish line before timeout</li>
        </ul>
    `;
    gameRules.style.marginBottom = '20px';
    gameRules.style.fontSize = '18px';

    // Create Start Button
    const startButton = document.createElement('button');
    startButton.textContent = 'Start Game';
    startButton.style.padding = '10px 20px';
    startButton.style.fontSize = '20px';
    startButton.style.backgroundColor = '#28a745';
    startButton.style.color = 'white';
    startButton.style.border = 'none';
    startButton.style.borderRadius = '5px';
    startButton.style.cursor = 'pointer';
    startButton.style.transition = 'background-color 0.3s';

    // Hover effect for Start Button
    startButton.addEventListener('mouseenter', () => {
        startButton.style.backgroundColor = '#218838';
    });
    startButton.addEventListener('mouseleave', () => {
        startButton.style.backgroundColor = '#28a745';
    });

    // Click event to start the game
    startButton.addEventListener('click', () => {
        container.style.display = 'none';
    });

    // Append Game Rules and Start Button to the container
    container.appendChild(gameRules);
    container.appendChild(startButton);

    // Initially hide the container
    container.style.display = 'none';

    // Append the container to the document body
    document.body.appendChild(container);

    return container; // Return the container for control over visibility
}

