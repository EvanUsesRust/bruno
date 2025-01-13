// components/Floor.js
import * as THREE from 'three';
import {Constant} from "../helper/Constant.js";

class Floor {
    constructor() {
        this.width = Constant.floorWidth;
        this.height = Constant.floorHeight;
        this.mesh = this.createFloor();

    }

    createFloor() {
        // Create geometry for the floor
        const geometry = new THREE.PlaneGeometry(this.width, this.height);  // Width and height of the plane

        // Load texture
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('../assets/texture/groundtexturre.jpg');  // Replace with your texture path

        // Adjust texture properties
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 2);  // Repeats texture across the surface

        // Create material with texture
        const material = new THREE.MeshLambertMaterial({map: texture, color: 0xffffff});

        // Create and position the floor mesh
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI / 2;  // Rotate to lie flat
        mesh.rotation.x = -Math.PI / 2;  // Rotate to lie flat
        mesh.receiveShadow = true;  // Enable shadow receiving

        const redLine = this.createRedLine();
        mesh.add(redLine);

        return mesh;
    }

    createRedLine() {
        // Geometry for the red line (a thin, long rectangle)
        const lineWidth = 3; // Adjust the width of the line
        const lineHeight = this.height; // Line spans the height of the plane
        const geometry = new THREE.BoxGeometry(lineHeight, lineWidth, 0.01);

        // Material for the red line
        const material = new THREE.MeshBasicMaterial({
            color: 0xff0000, transparent: true, // Enable transparency
            opacity: 0.5,
        });

        // Create the line mesh
        const redLine = new THREE.Mesh(geometry, material);
        // give a name
        redLine.name = "redLine";

        // Position the red line (centered along the X-axis, spans Y-axis)
        // redLine.position.y = 0.01; // Slightly above the floor to prevent z-fighting
        redLine.position.y = (this.width / 2) - 3;    // Centered in the Z direction
        // redLine.rotation.x = -Math.PI / 2; // Make it flat along the floor

        return redLine;
    }

}

export default Floor;
