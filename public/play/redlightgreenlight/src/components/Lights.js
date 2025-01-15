// components/Lights.js
import * as THREE from './libs/three/build/three.core.js'
import { GLTFLoader } from '../libs/three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from '../libs/three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from '../libs/three/examples/jsm/geometries/TextGeometry.js';


class Lights {
    constructor(scene) {
        this.ambientLight = new THREE.AmbientLight(0x404040, 1);
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        this.directionalLight.position.set(5, 10, 7.5);

        scene.add(this.ambientLight);
        scene.add(this.directionalLight);
    }
}

export default Lights;
