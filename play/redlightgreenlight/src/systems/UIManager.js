import {createLoadingScreen, createStartButton} from "../helper/Utils.js";

export default class UIManager {
    constructor(startGameCallback, restartGameCallback) {
        this.startGameCallback = startGameCallback;
        this.restartGameCallback =restartGameCallback;
        this.loadingScreen = createLoadingScreen();
        this.startButton = this.createStartButton(this.startGameCallback);
        this.gameWinScreen = this.gameWinScreen();
        this.createGameOverScreen(this.restartGameCallback);
    }
    goToFullScreen(){
        const gameContainer = document.body; // or a specific game container element
        if (gameContainer.requestFullscreen) {
            gameContainer.requestFullscreen();
        } else if (gameContainer.webkitRequestFullscreen) { // For Safari compatibility
            gameContainer.webkitRequestFullscreen();
        } else if (gameContainer.mozRequestFullScreen) { // For Firefox compatibility
            gameContainer.mozRequestFullScreen();
        } else if (gameContainer.msRequestFullscreen) { // For IE/Edge compatibility
            gameContainer.msRequestFullscreen();
        }
    }

    createStartButton(onStart) {
        const startButton = createStartButton();
        startButton.addEventListener('click', () => {
            document.body.removeChild(startButton);
            this.goToFullScreen();
            onStart();
        });
        return startButton;
    }


    hideLoadingScreen() {
        if (this.loadingScreen) document.body.removeChild(this.loadingScreen);
        this.loadingScreen = null;
    }

    showStartButton() {
        if (this.startButton) this.startButton.style.display = 'block';
    }


    createGameOverScreen() {
        this.gameOverScreen = document.createElement('div');
        this.gameOverScreen.style.position = 'absolute';
        this.gameOverScreen.style.top = '0';
        this.gameOverScreen.style.left = '0';
        this.gameOverScreen.style.width = '100%';
        this.gameOverScreen.style.height = '100%';
        this.gameOverScreen.style.background = 'rgba(0, 0, 0, 0.5)';
        this.gameOverScreen.style.display = 'flex';
        this.gameOverScreen.style.flexDirection = 'column';
        this.gameOverScreen.style.justifyContent = 'center';
        this.gameOverScreen.style.alignItems = 'center';
        this.gameOverScreen.style.color = 'white';
        this.gameOverScreen.style.fontSize = '2em';
        this.gameOverScreen.style.display = 'none'; // Hidden by default

        const gameOverText = document.createElement('div');
        gameOverText.innerText = 'Game Over';
        this.gameOverScreen.appendChild(gameOverText);

        const restartButton = document.createElement('button');
        restartButton.innerText = 'Restart';
        restartButton.style.marginTop = '1em';
        restartButton.style.padding = '0.5em 1em';
        restartButton.style.fontSize = '1.2em';
        restartButton.addEventListener('click', () => {
            this.gameOverScreen.style.display = 'none';
            this.restartGameCallback();
        });
        this.gameOverScreen.appendChild(restartButton);

        document.body.appendChild(this.gameOverScreen);
    }

    showGameOverScreen() {
        // this.gameOverScreen.innerText = 'Game Over';
        this.gameOverScreen.style.display = 'flex';
    }
    hideGameOverScreen() {
        this.gameOverScreen.style.display = 'none';
    }

    hideAllScreens() {
        this.hideLoadingScreen();
        this.hideGameOverScreen();
        this.hideGameWinScreen();
    }

    gameWinScreen(){
        let gameWinScreen ;
        gameWinScreen = document.createElement('div');
        gameWinScreen.style.position = 'absolute';
        gameWinScreen.style.top = '0';
        gameWinScreen.style.left = '0';
        gameWinScreen.style.width = '100%';
        gameWinScreen.style.height = '100%';
        gameWinScreen.style.background = 'rgba(0, 0, 0, 0.5)';
        gameWinScreen.style.display = 'flex';
        gameWinScreen.style.flexDirection = 'column';
        gameWinScreen.style.justifyContent = 'center';
        gameWinScreen.style.alignItems = 'center';
        gameWinScreen.style.color = 'white';
        gameWinScreen.style.fontSize = '2em';
        gameWinScreen.style.display = 'none'; // Hidden by default

        const gameOverText = document.createElement('div');
        gameOverText.innerText = 'You Win';
        gameWinScreen.appendChild(gameOverText);

        const restartButton = document.createElement('button');
        restartButton.innerText = 'Restart';
        restartButton.style.marginTop = '1em';
        restartButton.style.padding = '0.5em 1em';
        restartButton.style.fontSize = '1.2em';
        restartButton.addEventListener('click', () => {
            gameWinScreen.style.display = 'none';
            this.restartGameCallback();
        });
        gameWinScreen.appendChild(restartButton);

        document.body.appendChild(gameWinScreen);
        return gameWinScreen;
    }

    showWinScreen() {
       this.gameWinScreen.style.display = 'flex';
    }

    hideGameWinScreen(){
        this.gameWinScreen.style.display = 'none';
    }

}
