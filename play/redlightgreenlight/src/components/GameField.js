import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { Constant } from "../helper/Constant.js";
import Floor from "./Floor.js";
import Wall from "./Wall.js";

class GameField {
    constructor(scene, callback) {
        this.scene = scene;

        // Class properties
        this.floor = null;
        this.walls = [];
        this.clockGroup = null; // Group for clock and text
        this.timerValue = Constant.gameTime;
        this.timerInterval = null;
        this.timOut = false;

        this.initField(callback);
    }

    getObjectByName(name){
        return this.scene.getObjectByName(name);
    }

    initField(callback) {
        this.floor = new Floor();
        this.scene.add(this.floor.mesh);
        // Uncomment if walls are needed
        this.createWalls();

        this.loadFont(() => {
            this.clockGroup = this.createClock();
            if (callback) callback(); // Invoke callback after loading all resources
        });

        this.loadTree()

        this.clockGroup = this.createClock(() => {
            if (callback) callback(); // Invoke callback after loading all resources
        });
    }

    loadTree(onComplete){
        this.loader = new GLTFLoader();
        this.loader.load('../assets/model/tree.glb', async (gltf) => {
            this.tree = gltf.scene;
            this.tree.scale.set(1, 1.5, 1.5);
            this.tree.position.set(0,0,-60/2)
            this.scene.add(this.tree);
            if(onComplete) onComplete();
        })
    }

    loadFont(onComplete) {
        const loader = new FontLoader();
        loader.load('../assets/font/helvetiker_regular.typeface.json', (font) => {
            this.font = font; // Store the loaded font
            if (onComplete) onComplete();
        });
    }

    createWalls() {
        const wallHeight = 30;
        const floorWidth = this.floor.width; // Actual floor width
        const floorHeight = this.floor.height; // Actual floor height
        const wallThickness = 1;

        // Helper function to create a window
        const createWindow = (width, height, position) => {
            const geometry = new THREE.BoxGeometry(width, height, wallThickness / 2);
            const material = new THREE.MeshStandardMaterial({
                color: 0x888888,
                transparent: true,
                opacity: 0.8, // Semi-transparent windows
            });
            const windowMesh = new THREE.Mesh(geometry, material);
            windowMesh.position.set(position.x, position.y, position.z);
            return windowMesh;
        };

        // Front Wall
        const frontWall = new Wall(floorWidth, wallHeight, {
            x: 0,
            y: wallHeight / 2,
            z: -floorHeight / 2,
        }, {
            x: 0,
            y: 0,
            z: 0,
        });
        // Attach windows to the front wall
        // frontWall.mesh.add(createWindow(5, 3, { x: -10, y: 5, z: wallThickness / 2 })); // Left window
        // frontWall.mesh.add(createWindow(5, 3, { x: 10, y: 5, z: wallThickness / 2 })); // Right window
        this.scene.add(frontWall.mesh);

        // Back Wall
        const backWall = new Wall(floorWidth, wallHeight, {
            x: 0,
            y: wallHeight / 2,
            z: floorHeight / 2,
        }, {
            x: 0,
            y: Math.PI,
            z: 0,
        });
        // Attach windows to the back wall
        // backWall.mesh.add(createWindow(5, 3, { x: -10, y: 8, z: -wallThickness / 2 })); // Left window
        // backWall.mesh.add(createWindow(5, 3, { x: 10, y: 8, z: -wallThickness / 2 })); // Right window
        this.scene.add(backWall.mesh);

        // Left Wall
        const leftWall = new Wall(floorHeight, wallHeight, {
            x: -floorWidth / 2,
            y: wallHeight / 2,
            z: 0,
        }, {
            x: 0,
            y: Math.PI / 2,
            z: 0,
        });
        // Attach windows to the left wall
        // leftWall.mesh.add(createWindow(5, 3, { x: wallThickness / 2, y: 8, z: -10 })); // Bottom window
        // leftWall.mesh.add(createWindow(5, 3, { x: wallThickness / 2, y: 8, z: 10 })); // Top window
        this.scene.add(leftWall.mesh);

        // Right Wall
        const rightWall = new Wall(floorHeight, wallHeight, {
            x: floorWidth / 2,
            y: wallHeight / 2,
            z: 0,
        }, {
            x: 0,
            y: -Math.PI / 2,
            z: 0,
        });
        // Attach windows to the right wall
        // rightWall.mesh.add(createWindow(5, 3, { x: -wallThickness / 2, y: 8, z: -10 })); // Bottom window
        // rightWall.mesh.add(createWindow(5, 3, { x: -wallThickness / 2, y: 8, z: 10 })); // Top window
        this.scene.add(rightWall.mesh);
    }



    createClock() {
        // Create a group for clock and text
        const clockGroup = new THREE.Group();

        // Create clock mesh
        const clockGeometry = new THREE.BoxGeometry(5, 2, 0.1);
        const clockMaterial = new THREE.MeshStandardMaterial({color: 0xff0000});
        const clockMesh = new THREE.Mesh(clockGeometry, clockMaterial);
        clockMesh.position.set(0, 0, 0); // Center clock in the group

        clockGroup.add(clockMesh); // Add clock to the group

        // Create initial timer text
        if (this.font) {
            const textGeometry = new TextGeometry(`${this.timerValue}`, {
                font: this.font,
                size: 1,
                depth: 0.1,
            });
            const textMaterial = new THREE.MeshStandardMaterial({color: 0xffffff});
            const timerText = new THREE.Mesh(textGeometry, textMaterial);

            timerText.position.set(-0.8, -0.6, 0.1); // Position text relative to the clock
            clockGroup.add(timerText); // Add text to the group

            this.timerText = timerText; // Store for later updates
        }

        // Position the group in the scene
        clockGroup.position.set(10, 3, -(this.floor.height / 2));
        this.scene.add(clockGroup);

        return clockGroup;
    }

    updateTimerText() {
        if (!this.timerText || !this.font) return;
        this.clockGroup.remove(this.timerText);
        const textGeometry = new TextGeometry(`${this.timerValue}`, {
            font: this.font,
            size: 1,
            depth: 0.1,
        });
        const textMaterial = new THREE.MeshStandardMaterial({color: 0xffffff});
        const timerText = new THREE.Mesh(textGeometry, textMaterial);
        timerText.position.set(-0.8, -0.6, 0.1);
        this.clockGroup.add(timerText);
        this.timerText = timerText;
    }

    startClock() {
        if (this.timerInterval) return;
        this.timOut = false;
        this.updateTimerText();
        this.timerInterval = setInterval(() => {
            this.timerValue--;
            this.updateTimerText();

            if (this.timerValue <= 0) {
                this.stopClock();
            }
        }, 1000);
    }

    stopClock(){
        this.timOut = true;
        this.timerValue = Constant.gameTime;
        clearInterval(this.timerInterval);
        this.timerInterval = null;
    }

    stopClockWithWin(){
        this.timerValue = Constant.gameTime;
        clearInterval(this.timerInterval);
        this.timerInterval = null;
    }


}

export default GameField;
