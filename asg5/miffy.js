// referenced ChatGPT-4 responses
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

function main() {
    //
    // 1) Boilerplate: renderer, camera, controls, scene
    //
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    const fov = 45;
    const aspect = 2;  // we’ll update this in the render loop
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 20);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 5, 0);
    controls.update();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0.6745, 0.8039, 0.8784); // light‐blue sky
    // scene.background = new THREE.Color('black'); 
    addRandomHearts(scene, 20);
    addRandomIcos(scene, 20);
    const checkTexture = setInterval(() => {
        if (petalTexture) {
        // STOP checking once we have the texture
        clearInterval(checkTexture);

        // Build the flower at radius=7, segments=50, using the loaded texture:
        const flower = createFlowers(7, 50, petalTexture);

        // If you want it lying flat on XZ, rotate around X by –90°:
        flower.rotation.x = -Math.PI / 2;

        // Slightly lift off the ground so it doesn’t Z-fight:
        flower.position.set(0, 0.01, 0);

        scene.add(flower);
        }
    }, 50);





    //
    // 2) Simple ground plane
    //
    
        const planeSize = 40;
        const loader = new THREE.TextureLoader();
        const texture = loader.load('resources/images/birch.jpg');
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        const repeats = planeSize / 2;
        texture.repeat.set(repeats, repeats);



        const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
        const planeMat = new THREE.MeshPhongMaterial({
            map: texture,
            side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(planeGeo, planeMat);
        mesh.rotation.x = Math.PI * -0.5; // lay flat
        scene.add(mesh);

        let petalTexture;
        loader.load(
            'resources/images/sakura.jpg',
            (tex) => {
                
                tex.flipY = false;                    
                tex.encoding = THREE.sRGBEncoding;    
                petalTexture = tex;
            },
            undefined,
            (err) => {
                console.error('Failed to load petal texture:', err);
            }
        );

        const skyLoader = new THREE.CubeTextureLoader();
        const sky = skyLoader.load([
        'resources/images/sky.jpg', 
        'resources/images/sky.jpg', 
        'resources/images/sky.jpg', 
        'resources/images/sky.jpg', 
        'resources/images/sky.jpg', 
        'resources/images/sky.jpg', 
        ]);
        scene.background = sky;

    

    //
    // 3) GUI helpers
    //
    class MinMaxGUIHelper {
        constructor(obj, minProp, maxProp, minDif) {
            this.obj = obj;
            this.minProp = minProp;
            this.maxProp = maxProp;
            this.minDif = minDif;
        }
        get min() {
            return this.obj[this.minProp];
        }
        set min(v) {
            this.obj[this.minProp] = v;
            this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
        }
        get max() {
            return this.obj[this.maxProp];
        }
        set max(v) {
            this.obj[this.maxProp] = v;
            this.min = this.min; // call setter to enforce minDif
        }
    }

    class ColorGUIHelper {
        constructor(object, prop) {
            this.object = object;
            this.prop = prop;
        }
        get value() {
            return `#${this.object[this.prop].getHexString()}`;
        }
        set value(hexString) {
            this.object[this.prop].set(hexString);
        }
    }

    const gui = new GUI();
    gui.add(camera, 'fov', 1, 180).onChange(() => camera.updateProjectionMatrix());
    const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
    gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(() => camera.updateProjectionMatrix());
    gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far').onChange(() => camera.updateProjectionMatrix());

    //
    // 4) AMBIENT LIGHT
    //
    {
        const folder = gui.addFolder('Ambient Light');
        // Create a low‐intensity ambient so nothing is completely black.
        const ambientColor = 0xffffff;
        const ambientIntensity = 0.3;
        const ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
        scene.add(ambientLight);

        // GUI controls for color/intensity of the ambient
        folder.addColor(new ColorGUIHelper(ambientLight, 'color'), 'value').name('color');
        folder.add(ambientLight, 'intensity', 0, 2, 0.01).name('intensity');
        folder.open();
    }

    //
    // 5) HEMISPHERE LIGHT
    //
    {
        const folder = gui.addFolder('Hemisphere Light');
        // Sky‐color: light‐blue, Ground‐color: brownish orange
        const skyColor = 0xB1E1FF;
        const groundColor = 0xB97A20;
        const hemiIntensity = 1.0;
        const hemiLight = new THREE.HemisphereLight(skyColor, groundColor, hemiIntensity);
        scene.add(hemiLight);

        folder.addColor(new ColorGUIHelper(hemiLight, 'color'), 'value').name('skyColor');
        folder.addColor(new ColorGUIHelper(hemiLight, 'groundColor'), 'value').name('groundColor');
        folder.add(hemiLight, 'intensity', 0, 5, 0.01).name('intensity');
        folder.open();
    }

    //
    // 6) DIRECTIONAL LIGHT (with helper)
    //
    let dirLight, dirLightHelper;
    {
        const folder = gui.addFolder('Directional Light');
        dirLight = new THREE.DirectionalLight(0xffffff, 3.0);
        dirLight.position.set(5, 10, 2);
        // By default, DirectionalLight looks at (0,0,0). If you want to change the target:
        dirLight.target.position.set(-5, 0, 0);
        scene.add(dirLight);
        scene.add(dirLight.target);

        // Helper for debugging the “direction” of the light
        dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 2, 0xff0000);
        scene.add(dirLightHelper);

        // GUI: color/intensity
        folder.addColor(new ColorGUIHelper(dirLight, 'color'), 'value').name('color');
        folder.add(dirLight, 'intensity', 0, 5, 0.01).name('intensity');

        // GUI: move the target around
        folder.add(dirLight.target.position, 'x', -10, 10, 0.1).name('target.x');
        folder.add(dirLight.target.position, 'y', 0, 10, 0.1).name('target.y');
        folder.add(dirLight.target.position, 'z', -10, 10, 0.1).name('target.z');
        folder.open();
    }

    //
    // 7) LOAD YOUR .MTL + .OBJ
    //
    {
    const mtlLoader = new MTLLoader();
    mtlLoader.load('resources/orchid/Orchids.mtl', (mtl) => {
        mtl.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(mtl);

        objLoader.load('resources/orchid/Orchids.obj', (root) => {
        root.traverse((child) => {
            if (child.isMesh && child.material.map) {
            // Use a lit material so your lights will affect this mesh:
            child.material = new THREE.MeshPhongMaterial({
                map: child.material.map,
                side: THREE.DoubleSide,
                shininess: 30,
            });

            // If normals were missing, generate them so lighting works properly:
            if (!child.geometry.hasAttribute('normal')) {
                child.geometry.computeVertexNormals();
            }

            child.material.needsUpdate = true;
            }
        });

        scene.add(root);
        });
    });
    }

    function createHeartMesh() {
        // ────────────────────────── shape definition ───────────────────────────
        const shape = new THREE.Shape();
        const x = -2.5, y = -5;
        shape.moveTo(x + 2.5, y + 2.5);
        shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
        shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
        shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
        shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
        shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
        shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

        const geometry = new THREE.ShapeGeometry(shape);
        // (Optionally translate the geometry so the pivot is centered, scale it, etc.)
        geometry.translate(0, 0, 0); // pivot remains as‐drawn, but you could recenter if you like

        const material = new THREE.MeshPhongMaterial({
            color: 0xFFB6C1,       // light pink
            side: THREE.DoubleSide,
            shininess: 20
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.z = Math.PI;

        // Scale it down a bit so it’s not enormous:
        mesh.scale.set(0.1, 0.1, 0.1);
        mesh.userData.isHeart = true;

        return mesh;
    }

    function addRandomHearts(scene, count) {
        for (let i = 0; i < count; i++) {
            // 2a) pick a random radius between 4 and 20
            const minR = 4;
            const maxR = 20;
            const r = minR + Math.random() * (maxR - minR);

            // 2b) pick a random angle between 0 and 2π
            const θ = Math.random() * Math.PI * 2;

            // 2c) convert to Cartesian x, z
            const x = Math.cos(θ) * r;
            const z = Math.sin(θ) * r;

            // 2d) pick a random y > 0 (e.g. between 1 and 5 units above the ground)
            const minY = 1;
            const maxY = 5;
            const y = minY + Math.random() * (maxY - minY);

            // 2e) create a new heart and position it
            const heart = createHeartMesh();
            heart.position.set(x, y, z);

            // Optionally, give each heart a slight random rotation so they don’t all face exactly the same way:
            heart.rotation.y = Math.random() * Math.PI * 2;

            scene.add(heart);
        }
    }
    function createIcoMesh() {
    // ───────────────────────────── geometry ──────────────────────────────
    const radius = 7;
    const detail = 2; // how many subdivisions; 0 = the basic 20‐face shape
    const geometry = new THREE.IcosahedronGeometry(radius, detail);

    // ───────────────────────────── material ──────────────────────────────
    // I sampled the screenshot color and used a hex near rgb(90, 100, 184):
    // which is roughly 0x5A68B8. You can tweak that if you prefer another shade.
    const material = new THREE.MeshPhongMaterial({
        color: 0x899cb0,
        shininess: 50,
        flatShading: true,      // give each face a faceted look
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(0.05, 0.05, 0.05);

    // Tag it so we can spin it each frame in the render loop:
    mesh.userData.isIco = true;

    return mesh;
    }

    function addRandomIcos(scene, count) {
    for (let i = 0; i < count; i++) {
        // 2a) pick a random radius r ∈ [4,20]
        const minR = 4;
        const maxR = 20;
        const r = minR + Math.random() * (maxR - minR);

        // 2b) pick a random angle θ ∈ [0, 2π)
        const θ = Math.random() * Math.PI * 2;

        // 2c) convert to Cartesian (x, z):
        const x = Math.cos(θ) * r;
        const z = Math.sin(θ) * r;

        // 2d) pick a random y ∈ [1, 5] so it floats above the ground:
        const minY = 1;
        const maxY = 5;
        const y = minY + Math.random() * (maxY - minY);

        // 2e) create one icosahedron mesh, position it, and rotate it randomly:
        const icosa = createIcoMesh();
        icosa.position.set(x, y, z);
        icosa.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
        );

        scene.add(icosa);
    }
    }


function createFlowers(radius, segments, petalTex) {
  const flower = new THREE.Group();

  const baseGeom = new THREE.CircleGeometry(radius, segments);

  const baseMat = new THREE.MeshPhongMaterial({
    map: petalTex,
    side: THREE.DoubleSide,  
    shininess: 30
  });

  let a = 0;
  for (let i = 0; i < 5; i++) {
    const petalGeom = baseGeom.clone();
    const petalMat = baseMat.clone();
    const petal = new THREE.Mesh(petalGeom, petalMat);


    petal.scale.set(0.5, 1, 1);

    const angle = (i / 5) * Math.PI * 2;


    const offset = radius; 
    const px = Math.cos(angle) * offset;
    const py = Math.sin(angle) * offset;
    petal.position.set(px, py, 0 + a);

    petal.rotation.z = angle;

    flower.add(petal);
    a += 0.01;
  }

  return flower;
}


    //
    // 8) RESIZE & RENDER LOOP
    //
    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function render() {
        // 8a) Handle canvas resizing
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        // 8b) Update the directional light helper so it reflects any target changes
        dirLightHelper.update();

        // 8c) Update the background texture to fit the canvas size
		const canvasAspect = canvas.clientWidth / canvas.clientHeight;
		const imageAspect = bgTexture.image ? bgTexture.image.width / bgTexture.image.height : 1;
		const aspect = imageAspect / canvasAspect;

		bgTexture.offset.x = aspect > 1 ? ( 1 - 1 / aspect ) / 2 : 0;
		bgTexture.repeat.x = aspect > 1 ? 1 / aspect : 1;

		bgTexture.offset.y = aspect > 1 ? 0 : ( 1 - aspect ) / 2;
		bgTexture.repeat.y = aspect > 1 ? 1 : aspect;

        scene.traverse((obj) => {
            if (obj.isMesh) {
            if (obj.userData.isHeart) {
                // Spin hearts a little faster, for example:
                obj.rotation.y += 0.03;
            }
            if (obj.userData.isIco) {
                // Spin icosahedrons a bit slower:
                obj.rotation.y += 0.02;
            }
            }
        });
        // 8c) Finally, draw the scene
        renderer.render(scene, camera);
        // addRandomHearts(scene, 20);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();
