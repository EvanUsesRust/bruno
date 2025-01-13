import * as THREE from 'three';

class Sky {
    constructor(scene, hemiLightColor = 0x0077ff, bottomColor = 0xffffff, offset = 33, exponent = 0.6) {
        this.scene = scene;
        this.scene.background = new THREE.Color().setHSL( 0.6, 0, 1 );
        this.scene.fog = new THREE.Fog( scene.background, 1, 5000 );

        // LIGHTS

        const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 2 );
        hemiLight.color.setHSL( 0.6, 1, 0.6 );
        hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
        hemiLight.position.set( 0, 50, 0 );
        this.scene.add( hemiLight );

        const hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
        this.scene.add( hemiLightHelper );

        //

        const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
        dirLight.color.setHSL( 0.1, 1, 0.95 );
        dirLight.position.set( - 1, 1.75, 1 );
        dirLight.position.multiplyScalar( 30 );
        scene.add( dirLight );

        dirLight.castShadow = true;

        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;

        const d = 50;

        dirLight.shadow.camera.left = - d;
        dirLight.shadow.camera.right = d;
        dirLight.shadow.camera.top = d;
        dirLight.shadow.camera.bottom = - d;

        dirLight.shadow.camera.far = 3500;
        dirLight.shadow.bias = - 0.0001;


        const uniforms = {
            'topColor': { value: new THREE.Color( 0x0077ff ) },
            'bottomColor': { value: new THREE.Color( 0xffffff ) },
            'offset': { value: 33 },
            'exponent': { value: 0.6 }
        };
        uniforms[ 'topColor' ].value.copy( hemiLight.color );

        scene.fog.color.copy( uniforms[ 'bottomColor' ].value );

        const skyGeo = new THREE.SphereGeometry( 4000, 32, 15 );
        const skyMat = new THREE.ShaderMaterial( {
            uniforms: uniforms,
            vertexShader: `
                varying vec3 vWorldPosition;
                void main() {
                    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                    vWorldPosition = worldPosition.xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 topColor;
                uniform vec3 bottomColor;
                uniform float offset;
                uniform float exponent;
                varying vec3 vWorldPosition;
                void main() {
                    float h = normalize(vWorldPosition + offset).y;
                    gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
                }
            `,
            side: THREE.BackSide
        } );

        const sky = new THREE.Mesh( skyGeo, skyMat );
        scene.add( sky );

    }

    updateHemisphereLightColor(hemiLightColor) {
        this.uniforms.topColor.value.set(hemiLightColor);
    }

    updateBottomColor(bottomColor) {
        this.uniforms.bottomColor.value.set(bottomColor);
        this.scene.fog.color.copy(this.uniforms.bottomColor.value);
    }

    updateOffset(offset) {
        this.uniforms.offset.value = offset;
    }

    updateExponent(exponent) {
        this.uniforms.exponent.value = exponent;
    }
}

export default Sky;
