// components/Game.js
import * as THREE from 'three';
import Character from './components/Character.js';
import AIPlayer from './components/AIPlayer.js'; // Import AIPlayer
import InputHandler from './systems/InputHandler.js';
import AnimationSystem from './systems/AnimationSystem.js';
import GameLogic from './systems/GameLogic.js';
import GameLoop from './systems/GameLoop.js';
import Sky from './components/Sky.js';
import CameraController from './components/CameraController.js';
import Doll from "./components/Doll.js";
import GameField from "./components/GameField.js";
import GunMan from "./components/GunMan.js";
import AssetManager from "./systems/AssetManager.js";
import UIManager from "./systems/UIManager.js";
import SoundManager from "./systems/SoundManager.js";
import TouchControl from "./systems/TouchControl.js";

class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });

        this.assetManager = new AssetManager(5, this.onAssetsLoaded.bind(this));
        this.uiManager = new UIManager(this.start.bind(this), this.restart.bind(this));
        this.inputHandler = new InputHandler();

        this.isGameReady = false;

        this.initScene();
        this.initSky();
        this.loadAssets();
        this.loadSounds();

        this.clock = new THREE.Clock();
    }

    initScene() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.scene.background = new THREE.Color(0x87ceeb); // Default background color
        this.scene.fog = new THREE.Fog(this.scene.background, 1, 5000);

        this.camera.position.set(0, 0, 0);
        this.camera.lookAt(0, 0, 0);

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    initSky() {
        this.sky = new Sky(this.scene);
    }

    loadAssets() {
        this.gameField = new GameField(this.scene, () => this.assetManager.assetLoaded());
        this.character = new Character('You', () => this.assetManager.assetLoaded());
        this.character.loadModel();
        this.doll = new Doll('Doll', () => this.assetManager.assetLoaded());
        this.doll.loadModel();
        this.gunMan = new GunMan(this.scene, () => this.assetManager.assetLoaded());
        this.gunMan.loadModel();
    }

    loadSounds() {
        this.soundManager = new SoundManager(this.camera, () => this.assetManager.assetLoaded());
        this.soundManager.loadSounds();
    }

    onAssetsLoaded() {
        this.uiManager.hideLoadingScreen();
        this.uiManager.showStartButton();
    }

    addCharacterToScene() {
        this.character.mesh.position.set(3, 0, (this.gameField.floor.height / 2) - 4); // Adjusted character position
        this.scene.add(this.character.mesh);

        this.doll.mesh.position.set(0, 4.79, -(this.gameField.floor.height / 2) + 4); // Adjusted character position
        this.scene.add(this.doll.mesh);

        this.gunMan.mesh.position.set(-10, 0, -(this.gameField.floor.height / 2) + 4);
        this.scene.add(this.gunMan.mesh);
    }

    createAIPlayers() {
        this.aiPlayers = [];
        for (let i = 0; i < 50; i++) {
            const position = new THREE.Vector3(Math.random() * 20 - 10, 0, Math.random() * -30 + 10);
            const aiPlayer = new AIPlayer(`AI_${i}`, position, this.scene, this.onAssetsLoaded.bind(this));
            this.aiPlayers.push(aiPlayer);
        }
    }

    start() {
        this.animationSystem = new AnimationSystem(this.character);
        this.gameLogic = new GameLogic(this.character, this.inputHandler, this.animationSystem, this.gunMan, this.doll, this.soundManager, this.gameField, this.uiManager);
        this.cameraController = new CameraController(this.camera, this.character.mesh, 4.2, 2);
        this.touchController = new TouchControl(this.character.mesh, this.inputHandler);
        this.addCharacterToScene();
        this.createAIPlayers(); // Add this line
        this.gameLoop = new GameLoop([
            this.character,
            this.gameLogic,
            this.cameraController,
            this.gunMan,
            this.doll,
            ...this.aiPlayers // Add AI players to the game loop
        ]);
        this.isGameReady = true;
        this.gameField.startClock();
        this.soundManager.playSound('gamePlayMusic');
        this.animate();
    }

    restart() {
        this.uiManager.hideAllScreens();
        this.gameLogic.resetGame();
        this.gameLoop.resetClock();
    }

    checkGameOver() {
        if (!this.character.isAlive) {
            this.uiManager.showGameOverScreen();
            this.gameField.stopClock();
            this.soundManager.stopAllSounds();
            return true;
        }
    }

    checkGameWin() {
        if (this.gameLogic.gameWin) {
            this.uiManager.showWinScreen();
            this.gameField.stopClockWithWin();
            this.soundManager.stopAllSounds();
            return true;
        }
    }

    animate() {
        if (!this.isGameReady) return;
        this.checkGameOver();
        this.checkGameWin();

        requestAnimationFrame(this.animate.bind(this));
        const deltaTime = this.clock.getDelta();

        this.gameLoop.update(deltaTime);

        // Update AI players
        const light = this.gameLogic.getCurrentLight();
        this.aiPlayers.forEach(aiPlayer => aiPlayer.update(deltaTime, light));

        this.renderer.render(this.scene, this.camera);
    }
}

export default Game;
