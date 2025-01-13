// components/Doll.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


class Doll {
    constructor(name = "Doll", onLoadCallback) {
        this.loader = new GLTFLoader();
        this.mesh = null;
        this.name = name;
        this.onLoadCallback = onLoadCallback;
    }

    loadModel() {
        this.loader.load('../assets/model/doll.glb', (gltf) => {
            this.mesh = gltf.scene;
            this.mesh.scale.set(1, 1, 1);
            this.mesh.rotation.y = Math.PI; // Default rotation
            if (this.onLoadCallback) {
                this.onLoadCallback();
            }
        });
    }

    setRotation(angle) {
        if (this.mesh) {
            this.mesh.rotation.y = angle;
        }
    }

    getCurrentRotation() {
        return this.mesh ? this.mesh.rotation.y : 0;
    }

    resetStates(){
        this.mesh.rotation.y = Math.PI;
    }
}



export default Doll;
