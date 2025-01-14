import * as THREE from './libs/three/build/three.core.js';
import { GLTFLoader } from './libs/three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from './libs/three/examples/jsm/loaders/FontLoader.js';


console.log('main.js is loaded');

const scene = new THREE.Scene();
console.log('Scene created');

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
console.log('Camera created');

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
console.log('Renderer initialized and added to DOM');

// GLTF Loader Example
const gltfLoader = new GLTFLoader();
gltfLoader.load('./public/assets/model/die.glb', (gltf) => {
    console.log('GLTF Model loaded successfully');
    scene.add(gltf.scene);
}, undefined, (error) => {
    console.error('An error occurred loading the GLTF model:', error);
});

// Font Loader Example
const fontLoader = new FontLoader();
fontLoader.load('./public/assets/font/helvetiker_regular.typeface.json', (font) => {
    console.log('Font loaded successfully');
}, undefined, (error) => {
    console.error('An error occurred loading the font:', error);
});

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
