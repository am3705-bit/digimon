
import * as THREE from "three";

let activeWorld = null;

export function createDigitalWorld() {
    if (activeWorld) return activeWorld;

    const mount = document.getElementById("digital-world-canvas");

    if (!mount) return;

    try {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x8bd8ff);
        scene.fog = new THREE.Fog(0x8bd8ff, 45, 150);

        const camera = new THREE.PerspectiveCamera(
            65,
            mount.clientWidth / mount.clientHeight,
            0.1,
            300
        );

        const renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
        mount.innerHTML = "";
        mount.appendChild(renderer.domElement);

        // LIGHTING
        scene.add(new THREE.HemisphereLight(0xffffff, 0x426044, 2));

        const sunlight = new THREE.DirectionalLight(0xffffff, 2);
        sunlight.position.set(-20, 35, 20);
        sunlight.castShadow = true;
        sunlight.shadow.mapSize.set(2048, 2048);
sunlight.shadow.camera.left = -80;
sunlight.shadow.camera.right = 80;
sunlight.shadow.camera.top = 80;
sunlight.shadow.camera.bottom = -80;
sunlight.shadow.bias = -0.0002;
        scene.add(sunlight);

        // GRASS TERRAIN
        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(180, 180),
            new THREE.MeshStandardMaterial({
                color: 0x4aab55,
                roughness: 1
            })
        );

        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);

        // DIRT PATH
        const path = new THREE.Mesh(
            new THREE.PlaneGeometry(6, 100),
            new THREE.MeshStandardMaterial({
                color: 0xb99a68
            })
        );

        path.rotation.x = -Math.PI / 2;
        path.position.set(0, 0.04, -10);
        scene.add(path);

        // WATER POND
        const pond = new THREE.Mesh(
            new THREE.CircleGeometry(9, 40),
            new THREE.MeshStandardMaterial({
                color: 0x159de0,
                metalness: 0.2,
                roughness: 0.25
            })
        );

        pond.rotation.x = -Math.PI / 2;
        pond.position.set(17, 0.08, -12);
        scene.add(pond);

        
function createTree(x, z, scale = 1) {
    const tree = new THREE.Group();

    // TREE TRUNK
    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.55, 4, 10),
        new THREE.MeshStandardMaterial({
            color: 0x68401f,
            roughness: 1
        })
    );

    trunk.position.y = 2;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    tree.add(trunk);

    // TREE BRANCHES
    const branchMaterial = new THREE.MeshStandardMaterial({
        color: 0x68401f
    });

    for (let i = 0; i < 3; i++) {
        const branch = new THREE.Mesh(
            new THREE.CylinderGeometry(0.09, 0.2, 2, 7),
            branchMaterial
        );

        branch.position.set(
            i % 2 === 0 ? 0.6 : -0.6,
            2 + i * 0.65,
            0
        );

        branch.rotation.z = i % 2 === 0 ? -0.7 : 0.7;
        branch.castShadow = true;
        tree.add(branch);
    }

    // FULL TREE CANOPY
    const leafMaterial = new THREE.MeshStandardMaterial({
        color: 0x176b35,
        roughness: 1
    });

    const leafPositions = [
        [0, 5, 0, 2.4],
        [-1.1, 4.7, 0.3, 1.8],
        [1.1, 4.8, -0.2, 1.9],
        [0, 6, 0, 1.7],
        [0, 4.5, 1, 1.6]
    ];

    leafPositions.forEach(([lx, ly, lz, size]) => {
        const leaves = new THREE.Mesh(
            new THREE.SphereGeometry(size, 12, 10),
            leafMaterial
        );

        leaves.position.set(lx, ly, lz);
        leaves.scale.y = 0.8;
        leaves.castShadow = true;
        tree.add(leaves);
    });

    tree.position.set(x, 0, z);
    tree.scale.setScalar(scale);

    scene.add(tree);
}

// GRASS PATCHES

const grassMaterial = new THREE.MeshStandardMaterial({
    color: 0x287d32,
    roughness: 1
});

for (let i = 0; i < 180; i++) {
    const x = (Math.random() - 0.5) * 150;
    const z = (Math.random() - 0.5) * 150;

    // Keep grass off the main path and pond
    if (Math.abs(x) < 4) continue;

    if (Math.hypot(x - 17, z + 12) < 11) continue;

    const tuft = new THREE.Group();

    for (let j = 0; j < 3; j++) {
        const blade = new THREE.Mesh(
            new THREE.ConeGeometry(0.09, 0.65, 4),
            grassMaterial
        );

        blade.position.set(
            (Math.random() - 0.5) * 0.35,
            0.3,
            (Math.random() - 0.5) * 0.35
        );

        blade.rotation.z = (Math.random() - 0.5) * 0.5;
        tuft.add(blade);
    }

    tuft.position.set(x, 0, z);
    scene.add(tuft);
}

// SMALL FLOWERS

const flowerColors = [
    0xffe45c,
    0xff7db8,
    0xffffff,
    0x9d83ff
];

for (let i = 0; i < 45; i++) {
    const flower = new THREE.Mesh(
        new THREE.SphereGeometry(0.13, 8, 8),
        new THREE.MeshStandardMaterial({
            color: flowerColors[i % flowerColors.length],
            emissive: flowerColors[i % flowerColors.length],
            emissiveIntensity: 0.08
        })
    );

    const x = (Math.random() - 0.5) * 140;
    const z = (Math.random() - 0.5) * 140;

    if (Math.abs(x) < 4) continue;

    flower.position.set(x, 0.2, z);
    scene.add(flower);
}


        // ROCKS
        for (let i = 0; i < 25; i++) {
            const rock = new THREE.Mesh(
                new THREE.DodecahedronGeometry(
                    0.8 + Math.random() * 1.5
                ),
                new THREE.MeshStandardMaterial({
                    color: 0x777e8c,
                    roughness: 1
                })
            );

            rock.position.set(
                (Math.random() - 0.5) * 90,
                0.6,
                (Math.random() - 0.5) * 90
            );

            rock.castShadow = true;
            scene.add(rock);
        }

        // DIGITAL CRYSTALS
        for (let i = 0; i < 12; i++) {
            const crystal = new THREE.Mesh(
                new THREE.OctahedronGeometry(1.3),
                new THREE.MeshStandardMaterial({
                    color: 0x35e5ff,
                    emissive: 0x087aab,
                    emissiveIntensity: 0.7,
                    metalness: 0.5
                })
            );

            crystal.position.set(
                (Math.random() - 0.5) * 75,
                1.4,
                (Math.random() - 0.5) * 75
            );

            scene.add(crystal);
        }

        // PLAYER PLACEHOLDER
        const playerCharacter = new THREE.Group();

        const playerBody = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.55, 1.1, 4, 8),
            new THREE.MeshStandardMaterial({ color: 0x315bdb })
        );

        playerBody.position.y = 1.1;
        playerCharacter.add(playerBody);

        const playerHead = new THREE.Mesh(
            new THREE.SphereGeometry(0.42, 16, 16),
            new THREE.MeshStandardMaterial({ color: 0xffd0a0 })
        );

        playerHead.position.y = 2.05;
        playerCharacter.add(playerHead);

        playerCharacter.position.set(0, 0, 4);
        scene.add(playerCharacter);

        // PARTNER DIGIMON PLACEHOLDER
        const partner = new THREE.Group();

        const partnerBody = new THREE.Mesh(
            new THREE.SphereGeometry(0.9, 16, 16),
            new THREE.MeshStandardMaterial({ color: 0xffa52f })
        );

        partnerBody.position.y = 0.9;
        partner.add(partnerBody);

        const partnerHead = new THREE.Mesh(
            new THREE.SphereGeometry(0.65, 16, 16),
            new THREE.MeshStandardMaterial({ color: 0xffc04d })
        );

        partnerHead.position.set(0, 1.65, -0.2);
        partner.add(partnerHead);

        partner.position.set(1.8, 0, 4);
        scene.add(partner);

        camera.position.set(0, 9, 16);
        camera.lookAt(0, 0, 0);

        // KEYBOARD MOVEMENT
        const keys = {};

        function keyDown(event) {
            keys[event.key.toLowerCase()] = true;

            if ([
                "arrowup", "arrowdown",
                "arrowleft", "arrowright"
            ].includes(event.key.toLowerCase())) {
                event.preventDefault();
            }
        }

        function keyUp(event) {
            keys[event.key.toLowerCase()] = false;
        }

        window.addEventListener("keydown", keyDown);
        window.addEventListener("keyup", keyUp);

        // RESIZE
        function resizeWorld() {
            const width = mount.clientWidth;
            const height = mount.clientHeight;

            if (!width || !height) return;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        }

        window.addEventListener("resize", resizeWorld);

        // GAME LOOP
        renderer.setAnimationLoop(() => {
            const speed = 0.13;

            if (keys["w"] || keys["arrowup"]) {
                playerCharacter.position.z -= speed;
            }

            if (keys["s"] || keys["arrowdown"]) {
                playerCharacter.position.z += speed;
            }

            if (keys["a"] || keys["arrowleft"]) {
                playerCharacter.position.x -= speed;
            }

            if (keys["d"] || keys["arrowright"]) {
                playerCharacter.position.x += speed;
            }

            partner.position.x =
                playerCharacter.position.x + 1.8;

            partner.position.z =
                playerCharacter.position.z + 0.5;

            partner.position.y =
                Math.abs(Math.sin(Date.now() * 0.003)) * 0.2;

            camera.position.x +=
                (playerCharacter.position.x - camera.position.x) * 0.05;

            camera.position.z +=
                (playerCharacter.position.z + 16 - camera.position.z) * 0.05;

            camera.lookAt(
                playerCharacter.position.x,
                1,
                playerCharacter.position.z
            );

            renderer.render(scene, camera);
        });

        activeWorld = { scene, camera, renderer };
        return activeWorld;

    } catch (error) {
        console.error("Digital World failed to load:", error);
        mount.textContent =
            "The 3D world could not load. Please check browser graphics support.";
    }
}

