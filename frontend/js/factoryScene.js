/**
 * SCADA-2.0
 * Three.js 3D Factory Floor Scene & Machine Procedural Builder
 * 100 x 70 Enclosed Industrial Floor Architecture with Exactly 11 Machines (M01 - M11)
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { machineData } from './data.js';
import { factoryLayoutConfig } from './layoutConfig.js';

export class FactoryScene {
    constructor(containerElement) {
        this.container = containerElement;
        this.machinesMap = new Map(); // key: machineKey, value: THREE.Group
        this.sensorNodes = [];
        this.selectedMachine = null;
        this.highlightMesh = null;

        this.initScene();
        this.initLights();
        this.buildEnvironment();
        this.buildControlRoom();
        this.buildMachines();
        this.initRaycaster();

        window.addEventListener('resize', () => this.onWindowResize());
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x040d1a);
        this.scene.fog = new THREE.FogExp2(0x040d1a, 0.004);

        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        // Elevated isometric factory perspective framing the entire 100 x 70 floor
        this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
        this.camera.position.set(0, 75, 92);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.15;

        this.container.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI / 2 - 0.03; // Prevent dipping below floor
        this.controls.minDistance = 15;
        this.controls.maxDistance = 175;
        this.controls.target.set(0, 0, 0);
    }

    initLights() {
        const ambientLight = new THREE.AmbientLight(0x384b66, 1.85);
        this.scene.add(ambientLight);

        // Main industrial overhead sunlight/bay light
        const mainLight = new THREE.DirectionalLight(0xe0f2fe, 2.3);
        mainLight.position.set(35, 80, 50);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        mainLight.shadow.camera.near = 10;
        mainLight.shadow.camera.far = 180;
        const d = 65;
        mainLight.shadow.camera.left = -d;
        mainLight.shadow.camera.right = d;
        mainLight.shadow.camera.top = d;
        mainLight.shadow.camera.bottom = -d;
        mainLight.shadow.bias = -0.0005;
        this.scene.add(mainLight);

        // Soft cyan fill light from rear-left
        const cyanFill = new THREE.DirectionalLight(0x00f0ff, 0.85);
        cyanFill.position.set(-50, 45, -45);
        this.scene.add(cyanFill);

        // Warning amber light over Reflow Oven (M07)
        const reflowLight = new THREE.PointLight(0xffb700, 2.8, 32);
        reflowLight.position.set(0, 10, 2);
        this.scene.add(reflowLight);

        // Critical red light over Air Compressor (M10)
        const compressorLight = new THREE.PointLight(0xff0055, 3.8, 32);
        compressorLight.position.set(34, 10, 23);
        this.scene.add(compressorLight);
    }

    buildEnvironment() {
        // 1. Industrial Concrete Floor (100 wide x 70 deep)
        const floorGeo = new THREE.PlaneGeometry(100, 70);
        const floorMat = new THREE.MeshStandardMaterial({
            color: 0x162333,
            roughness: 0.55,
            metalness: 0.2
        });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);

        // Subtly rendered floor grid
        const gridHelper = new THREE.GridHelper(100, 50, 0x00f0ff, 0x1e3a5f);
        gridHelper.position.y = 0.02;
        gridHelper.material.opacity = 0.22;
        gridHelper.material.transparent = true;
        this.scene.add(gridHelper);

        // 2. Light Grey Industrial Perimeter Walls (Height: 3.8, Thickness: 0.8)
        const wallMat = new THREE.MeshStandardMaterial({ color: 0x24354a, roughness: 0.7, metalness: 0.15 });
        const wallTrimMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, roughness: 0.3, emissive: 0x002233 });
        const wallHeight = 3.8;
        const wallThick = 0.8;

        // Rear Wall (Z = -35)
        const rearWall = new THREE.Mesh(new THREE.BoxGeometry(100, wallHeight, wallThick), wallMat);
        rearWall.position.set(0, wallHeight / 2, -35);
        rearWall.receiveShadow = true;
        this.scene.add(rearWall);

        const rearTrim = new THREE.Mesh(new THREE.BoxGeometry(100, 0.25, wallThick + 0.15), wallTrimMat);
        rearTrim.position.set(0, wallHeight + 0.12, -35);
        this.scene.add(rearTrim);

        // Left Wall (X = -50)
        const leftWall = new THREE.Mesh(new THREE.BoxGeometry(wallThick, wallHeight, 70), wallMat);
        leftWall.position.set(-50, wallHeight / 2, 0);
        leftWall.receiveShadow = true;
        this.scene.add(leftWall);

        const leftTrim = new THREE.Mesh(new THREE.BoxGeometry(wallThick + 0.15, 0.25, 70), wallTrimMat);
        leftTrim.position.set(-50, wallHeight + 0.12, 0);
        this.scene.add(leftTrim);

        // Right Wall (X = +50)
        const rightWall = new THREE.Mesh(new THREE.BoxGeometry(wallThick, wallHeight, 70), wallMat);
        rightWall.position.set(50, wallHeight / 2, 0);
        rightWall.receiveShadow = true;
        this.scene.add(rightWall);

        const rightTrim = new THREE.Mesh(new THREE.BoxGeometry(wallThick + 0.15, 0.25, 70), wallTrimMat);
        rightTrim.position.set(50, wallHeight + 0.12, 0);
        this.scene.add(rightTrim);

        // Front Boundary Wall with Two Wide Personnel/Freight Entrances (Z = +35)
        // Left Section (X = -50 to -22)
        const frontLeft = new THREE.Mesh(new THREE.BoxGeometry(28, 2.2, wallThick), wallMat);
        frontLeft.position.set(-36, 1.1, 35);
        this.scene.add(frontLeft);

        // Center Island Section (X = -8 to +8)
        const frontMid = new THREE.Mesh(new THREE.BoxGeometry(16, 2.2, wallThick), wallMat);
        frontMid.position.set(0, 1.1, 35);
        this.scene.add(frontMid);

        // Right Section (X = +22 to +50)
        const frontRight = new THREE.Mesh(new THREE.BoxGeometry(28, 2.2, wallThick), wallMat);
        frontRight.position.set(36, 1.1, 35);
        this.scene.add(frontRight);

        // Structural Steel Columns along Boundary Grid (8 columns)
        const colGeo = new THREE.BoxGeometry(1.4, 7.5, 1.4);
        const colMat = new THREE.MeshStandardMaterial({ color: 0x1b2838, metalness: 0.7, roughness: 0.3 });
        [
            [-48, -33.5], [0, -33.5], [48, -33.5],
            [-48, 0], [48, 0],
            [-48, 33.5], [0, 33.5], [48, 33.5]
        ].forEach(([x, z]) => {
            const col = new THREE.Mesh(colGeo, colMat);
            col.position.set(x, 3.75, z);
            col.castShadow = true;
            this.scene.add(col);
        });

        // 3. Thin Yellow Safety Boundary Lines
        this.buildSafetyMarkings();

        // 4. 3D Zone Signposts
        this.buildZoneLabels();
    }

    buildSafetyMarkings() {
        const lineMat = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
        const thick = 0.18;
        const y = 0.03;

        // Draw boundaries for all 11 machine safety cells defined in layoutConfig
        Object.values(machineData).forEach(m => {
            const sz = m.safetyZone || { width: m.size.width + 2, depth: m.size.depth + 2 };
            const cx = m.position.x;
            const cz = m.position.z;
            const hw = sz.width / 2;
            const hd = sz.depth / 2;

            // Top border
            const b1 = new THREE.Mesh(new THREE.BoxGeometry(sz.width, 0.02, thick), lineMat);
            b1.position.set(cx, y, cz - hd);
            this.scene.add(b1);

            // Bottom border
            const b2 = new THREE.Mesh(new THREE.BoxGeometry(sz.width, 0.02, thick), lineMat);
            b2.position.set(cx, y, cz + hd);
            this.scene.add(b2);

            // Left border
            const b3 = new THREE.Mesh(new THREE.BoxGeometry(thick, 0.02, sz.depth), lineMat);
            b3.position.set(cx - hw, y, cz);
            this.scene.add(b3);

            // Right border
            const b4 = new THREE.Mesh(new THREE.BoxGeometry(thick, 0.02, sz.depth), lineMat);
            b4.position.set(cx + hw, y, cz);
            this.scene.add(b4);
        });
    }

    buildZoneLabels() {
        const createTextSprite = (text) => {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 128;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'rgba(6, 26, 43, 0.88)';
            ctx.strokeStyle = '#00f0ff';
            ctx.lineWidth = 4;
            if (ctx.roundRect) {
                ctx.roundRect(10, 10, 492, 108, 16);
            } else {
                ctx.rect(10, 10, 492, 108);
            }
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#00f0ff';
            ctx.font = 'bold 32px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, 256, 64);

            const texture = new THREE.CanvasTexture(canvas);
            const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
            const sprite = new THREE.Sprite(spriteMat);
            sprite.scale.set(14, 3.5, 1);
            return sprite;
        };

        const fabZone = createTextSprite('Z01: FABRICATION AREA');
        fabZone.position.set(-18, 7.8, -31);
        this.scene.add(fabZone);

        const pcbZone = createTextSprite('Z03: PCB ASSEMBLY LINE');
        pcbZone.position.set(-10, 7.8, -5);
        this.scene.add(pcbZone);

        const utilZone = createTextSprite('Z05: UTILITY YARD');
        utilZone.position.set(34, 7.8, 15);
        this.scene.add(utilZone);

        const ctrlZone = createTextSprite('CONTROL / MONITORING ROOM');
        ctrlZone.position.set(-33, 7.8, 13);
        this.scene.add(ctrlZone);
    }

    buildControlRoom() {
        const roomGroup = new THREE.Group();
        // Lower-Left position: X = -33, Z = 22
        roomGroup.position.set(-33, 0, 22);

        // Interior Carpet Floor (18 x 14)
        const carpet = new THREE.Mesh(
            new THREE.BoxGeometry(18, 0.08, 14),
            new THREE.MeshStandardMaterial({ color: 0x0b3254, roughness: 0.6 })
        );
        carpet.position.set(0, 0.04, 0);
        roomGroup.add(carpet);

        // Glass Enclosure Walls
        const glassMat = new THREE.MeshPhysicalMaterial({
            color: 0x00d8ff,
            transparent: true,
            opacity: 0.32,
            roughness: 0.1,
            metalness: 0.1,
            transmission: 0.65
        });
        const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });

        // Rear Glass Wall (Z = -7 relative)
        const glassBack = new THREE.Mesh(new THREE.BoxGeometry(18, 3.8, 0.3), glassMat);
        glassBack.position.set(0, 1.9, -7);
        roomGroup.add(glassBack);

        // Right Glass Wall (X = +9 relative)
        const glassRight = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.8, 14), glassMat);
        glassRight.position.set(9, 1.9, 0);
        roomGroup.add(glassRight);

        // Front Glass Wall with Door Opening (Door gap between X = 0 and X = 4)
        const glassFrontLeft = new THREE.Mesh(new THREE.BoxGeometry(9, 3.8, 0.3), glassMat);
        glassFrontLeft.position.set(-4.5, 1.9, 7);
        const glassFrontRight = new THREE.Mesh(new THREE.BoxGeometry(5, 3.8, 0.3), glassMat);
        glassFrontRight.position.set(6.5, 1.9, 7);
        roomGroup.add(glassFrontLeft, glassFrontRight);

        // Door header transom
        const doorHeader = new THREE.Mesh(new THREE.BoxGeometry(4, 1.0, 0.3), frameMat);
        doorHeader.position.set(2, 3.3, 7);
        roomGroup.add(doorHeader);

        // Operator Monitoring Desk Console
        const desk = new THREE.Mesh(
            new THREE.BoxGeometry(8.5, 1.1, 2.5),
            new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 })
        );
        desk.position.set(0, 0.55, -2);
        roomGroup.add(desk);

        // Multi-Monitor Array
        for (let xOff of [-2.4, 0, 2.4]) {
            const monitor = new THREE.Mesh(
                new THREE.BoxGeometry(2.0, 1.3, 0.1),
                new THREE.MeshStandardMaterial({ color: 0x0284c7, emissive: 0x002233 })
            );
            monitor.position.set(xOff, 1.8, -1.9);
            roomGroup.add(monitor);
        }

        // Operator Chairs
        for (let xOff of [-1.8, 1.8]) {
            const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.3), frameMat);
            seat.position.set(xOff, 0.75, 0.5);
            roomGroup.add(seat);
        }

        this.scene.add(roomGroup);
    }

    buildMachines() {
        Object.keys(machineData).forEach(name => {
            const data = machineData[name];
            const group = new THREE.Group();
            group.position.set(data.position.x, data.position.y, data.position.z);
            if (data.rotation && data.rotation.y) {
                group.rotation.y = data.rotation.y;
            }
            group.userData = { name: data.name, key: name, data: data };

            // Construct recognizable procedural 3D machine geometry
            this.constructMachineMesh(group, name, data);

            // Add Sensor Node above machine
            const sensorNode = this.createSensorNode(data);
            sensorNode.position.set(0, data.size.height + 2.4, 0);
            group.add(sensorNode);
            this.sensorNodes.push({ node: sensorNode, status: data.status, group: group });

            this.scene.add(group);
            this.machinesMap.set(name, group);
        });
    }

    constructMachineMesh(group, name, data) {
        const darkBodyMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6, roughness: 0.3 });
        const steelMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.85, roughness: 0.25 });
        const accentCyanMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, metalness: 0.5, roughness: 0.2, emissive: 0x002233 });
        const glowGreenMat = new THREE.MeshBasicMaterial({ color: 0x00ff66 });
        const glowAmberMat = new THREE.MeshBasicMaterial({ color: 0xffb700 });
        const glowRedMat = new THREE.MeshBasicMaterial({ color: 0xff0055 });

        // Base machine shadow pedestal
        const basePlate = new THREE.Mesh(
            new THREE.BoxGeometry(data.size.width + 0.4, 0.2, data.size.depth + 0.4),
            new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 })
        );
        basePlate.position.y = 0.1;
        basePlate.receiveShadow = true;
        group.add(basePlate);

        const modelType = data.modelType || "";

        if (modelType === "cnc_laser" || name.includes("Laser")) {
            // M01: CNC FIBRE LASER CUTTING MACHINE
            const mainBody = new THREE.Mesh(
                new THREE.BoxGeometry(11.2, 3.4, 6.8),
                new THREE.MeshStandardMaterial({ color: 0x9f1239, metalness: 0.5, roughness: 0.3 })
            );
            mainBody.position.y = 1.8;
            mainBody.castShadow = true;
            group.add(mainBody);

            // Slat cutting bed
            const bed = new THREE.Mesh(new THREE.BoxGeometry(9.0, 0.4, 5.2), steelMat);
            bed.position.set(0, 3.6, 0);
            group.add(bed);

            // CNC Bridge Gantry
            const gantry = new THREE.Mesh(new THREE.BoxGeometry(1.0, 2.0, 5.8), accentCyanMat);
            gantry.position.set(1.5, 4.4, 0);
            group.add(gantry);

            // Optical Laser Head
            const laserHead = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.08, 1.5), glowGreenMat);
            laserHead.position.set(1.5, 3.2, 0);
            group.add(laserHead);

            // Dual Nitrogen assist gas cylinders
            for (let zOff of [-1.8, 1.8]) {
                const n2Tank = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.45, 0.45, 3.6),
                    new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8 })
                );
                n2Tank.position.set(-4.8, 1.9, zOff);
                group.add(n2Tank);
            }

            // CNC Operator Console
            const consoleMesh = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.6, 0.3), darkBodyMat);
            consoleMesh.position.set(-4.5, 3.6, 3.0);
            group.add(consoleMesh);
        }
        else if (modelType === "press_brake" || name.includes("Press Brake")) {
            // M02: HYDRAULIC PRESS BRAKE
            const sideLeft = new THREE.Mesh(new THREE.BoxGeometry(1.6, 5.6, 4.8), darkBodyMat);
            sideLeft.position.set(-3.6, 2.9, 0);
            const sideRight = new THREE.Mesh(new THREE.BoxGeometry(1.6, 5.6, 4.8), darkBodyMat);
            sideRight.position.set(3.6, 2.9, 0);
            group.add(sideLeft, sideRight);

            // Top Crossbeam
            const topBeam = new THREE.Mesh(new THREE.BoxGeometry(8.6, 1.8, 3.2), darkBodyMat);
            topBeam.position.set(0, 4.9, 0);
            group.add(topBeam);

            // Hydraulic Drive Cylinders
            for (let xOff of [-2.4, 2.4]) {
                const hydCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 2.4), steelMat);
                hydCyl.position.set(xOff, 5.0, 0);
                group.add(hydCyl);
            }

            // Bending Ram & V-Die
            const ramDie = new THREE.Mesh(
                new THREE.BoxGeometry(6.6, 1.5, 0.5),
                new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.7 })
            );
            ramDie.position.set(0, 2.5, 0);
            group.add(ramDie);

            const dieBed = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.9, 1.4), steelMat);
            dieBed.position.set(0, 1.1, 0);
            group.add(dieBed);
        }
        else if (modelType === "welding_station" || name.includes("Welding Station") || name.includes("Spot + TIG")) {
            // M03: UNIFIED DUAL-PROCESS SPOT + TIG/MIG WELDING CELL
            // Left Bay: Pneumatic Resistance Spot Welder
            const spotGroup = new THREE.Group();
            spotGroup.position.set(-3.5, 0, 0);

            const stand = new THREE.Mesh(new THREE.BoxGeometry(2.8, 4.6, 3.2), darkBodyMat);
            stand.position.set(-0.8, 2.4, 0);
            spotGroup.add(stand);

            const topArm = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.7, 1.0), accentCyanMat);
            topArm.position.set(0.6, 4.0, 0);
            const botArm = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.7, 1.0), accentCyanMat);
            botArm.position.set(0.6, 1.7, 0);
            spotGroup.add(topArm, botArm);

            const elec1 = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.1), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9 }));
            elec1.position.set(2.1, 3.3, 0);
            const elec2 = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.1), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9 }));
            elec2.position.set(2.1, 2.3, 0);
            spotGroup.add(elec1, elec2);

            const table = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.3, 2.2), steelMat);
            table.position.set(1.5, 1.2, 0);
            spotGroup.add(table);
            group.add(spotGroup);

            // Right Bay: TIG/MIG Welding Booth with Acoustic Enclosure & Amber Protective Curtain
            const migGroup = new THREE.Group();
            migGroup.position.set(2.8, 0, 0);

            const backPanel = new THREE.Mesh(new THREE.BoxGeometry(5.8, 4.3, 0.3), darkBodyMat);
            backPanel.position.set(0, 2.25, -2.2);
            const leftPanel = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4.3, 4.4), darkBodyMat);
            leftPanel.position.set(-2.8, 2.25, 0);
            migGroup.add(backPanel, leftPanel);

            // Amber translucent protective welding curtain
            const curtainMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.45 });
            const curtain = new THREE.Mesh(new THREE.BoxGeometry(0.1, 4.0, 4.2), curtainMat);
            curtain.position.set(2.8, 2.1, 0);
            migGroup.add(curtain);

            // Argon & CO2 shielding gas cylinders
            const tank1 = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 3.0), new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8 }));
            tank1.position.set(-1.8, 1.6, -1.2);
            const tank2 = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 3.0), new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 }));
            tank2.position.set(-0.9, 1.6, -1.2);
            migGroup.add(tank1, tank2);

            // Welding Inverter Power Source & Torch
            const powerSource = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.2, 1.8), accentCyanMat);
            powerSource.position.set(0.8, 1.2, 0);
            migGroup.add(powerSource);
            group.add(migGroup);
        }
        else if (modelType === "powder_coating" || name.includes("Coating")) {
            // M04: POWDER COATING BOOTH + CURING OVEN
            const booth = new THREE.Mesh(
                new THREE.BoxGeometry(10.5, 5.6, 7.0),
                new THREE.MeshStandardMaterial({ color: 0x0369a1, metalness: 0.4, roughness: 0.3 })
            );
            booth.position.y = 2.9;
            group.add(booth);

            // Top Cyclone Exhaust Recovery Tower
            const cyclone = new THREE.Mesh(
                new THREE.CylinderGeometry(1.5, 0.8, 2.8),
                new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.7 })
            );
            cyclone.position.set(2.4, 6.8, -1.2);
            group.add(cyclone);

            // Connected Oven Section Tunnel
            const ovenSec = new THREE.Mesh(
                new THREE.BoxGeometry(4.0, 4.4, 5.0),
                new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.6 })
            );
            ovenSec.position.set(-3.0, 2.4, 0);
            group.add(ovenSec);
        }
        else if (modelType === "stencil_printer" || name.includes("Stencil")) {
            // M05: SOLDER PASTE STENCIL PRINTER
            const body = new THREE.Mesh(new THREE.BoxGeometry(5.8, 3.6, 4.4), darkBodyMat);
            body.position.y = 1.9;
            group.add(body);

            const stencilBed = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.3, 3.2), steelMat);
            stencilBed.position.set(0, 3.8, 0);
            group.add(stencilBed);

            const squeegeeCarriage = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.9, 3.4), accentCyanMat);
            squeegeeCarriage.position.set(0.6, 4.4, 0);
            group.add(squeegeeCarriage);

            const cameraTower = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.2), glowGreenMat);
            cameraTower.position.set(0.6, 5.2, 0);
            group.add(cameraTower);
        }
        else if (modelType === "smt_pick_place" || name.includes("Pick and Place")) {
            // M06: SMT PICK AND PLACE MACHINE
            const chassis = new THREE.Mesh(new THREE.BoxGeometry(10.2, 3.8, 5.0), darkBodyMat);
            chassis.position.y = 2.0;
            group.add(chassis);

            const gantryRail = new THREE.Mesh(new THREE.BoxGeometry(8.6, 0.6, 0.6), steelMat);
            gantryRail.position.set(0, 4.1, 0);
            group.add(gantryRail);

            // Dual vacuum placement heads
            for (let xOff of [-2.0, 2.0]) {
                const head = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.6, 1.4), accentCyanMat);
                head.position.set(xOff, 4.2, 0);
                const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.8), glowGreenMat);
                nozzle.position.set(xOff, 3.2, 0);
                group.add(head, nozzle);
            }

            // Tape feeder banks on front and rear
            for (let zOff of [-2.3, 2.3]) {
                const feeders = new THREE.Mesh(new THREE.BoxGeometry(8.2, 1.2, 0.8), steelMat);
                feeders.position.set(0, 3.2, zOff);
                group.add(feeders);
            }
        }
        else if (modelType === "reflow_oven" || name.includes("Reflow")) {
            // M07: MULTIZONE REFLOW SOLDERING OVEN (Long 14m Tunnel)
            const ovenBody = new THREE.Mesh(
                new THREE.BoxGeometry(14.0, 4.2, 4.8),
                new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.3 })
            );
            ovenBody.position.y = 2.3;
            group.add(ovenBody);

            // Multi-zone convection heater covers with heating indicators
            for (let i = -5; i <= 5; i++) {
                const zoneCover = new THREE.Mesh(
                    new THREE.BoxGeometry(0.9, 0.5, 3.6),
                    i === 0 ? glowAmberMat : steelMat
                );
                zoneCover.position.set(i * 1.2, 4.5, 0);
                group.add(zoneCover);
            }

            // Mesh conveyor path through tunnel
            const meshConveyor = new THREE.Mesh(new THREE.BoxGeometry(14.2, 0.15, 2.2), steelMat);
            meshConveyor.position.set(0, 2.3, 0);
            group.add(meshConveyor);

            // Top exhaust chimney
            const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.6), steelMat);
            chimney.position.set(3.5, 5.0, 0);
            group.add(chimney);
        }
        else if (modelType === "wave_soldering" || name.includes("Wave Soldering")) {
            // M08: WAVE SOLDERING MACHINE
            const waveBody = new THREE.Mesh(new THREE.BoxGeometry(9.4, 3.9, 4.8), darkBodyMat);
            waveBody.position.y = 2.1;
            group.add(waveBody);

            // Titanium Solder Pot with Liquid Solder Glow
            const solderPot = new THREE.Mesh(
                new THREE.BoxGeometry(3.6, 1.2, 3.0),
                new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.1 })
            );
            solderPot.position.set(1.5, 3.6, 0);
            group.add(solderPot);

            // Ultrasonic fluxer unit
            const fluxer = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.6, 2.8), accentCyanMat);
            fluxer.position.set(-2.5, 3.6, 0);
            group.add(fluxer);
        }
        else if (modelType === "testing_chambers" || name.includes("Testing")) {
            // M09: TESTING & BURN-IN CHAMBERS (3 Adjacent Industrial Cabinets)
            for (let i = -1; i <= 1; i++) {
                const rackGroup = new THREE.Group();
                rackGroup.position.set(i * 3.3, 0, 0);

                const rackBody = new THREE.Mesh(new THREE.BoxGeometry(2.9, 5.0, 4.6), darkBodyMat);
                rackBody.position.y = 2.6;
                rackGroup.add(rackBody);

                // Tinted glass inspection door
                const doorGlass = new THREE.Mesh(
                    new THREE.BoxGeometry(2.4, 3.8, 0.1),
                    new THREE.MeshPhysicalMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.35, roughness: 0.1 })
                );
                doorGlass.position.set(0, 2.6, 2.3);
                rackGroup.add(doorGlass);

                // Status LED display panel on top
                const ledPanel = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.6, 0.2), glowGreenMat);
                ledPanel.position.set(0, 4.8, 2.2);
                rackGroup.add(ledPanel);

                group.add(rackGroup);
            }
        }
        else if (modelType === "air_compressor" || name.includes("Compressor")) {
            // M10: ROTARY SCREW AIR COMPRESSOR + HORIZONTAL AIR RECEIVER TANK
            // Royal Blue Compressor Unit
            const compBody = new THREE.Mesh(
                new THREE.BoxGeometry(4.2, 4.2, 4.4),
                new THREE.MeshStandardMaterial({ color: 0x1d4ed8, metalness: 0.5, roughness: 0.3 })
            );
            compBody.position.set(-1.8, 2.2, 0);
            group.add(compBody);

            // TEFC Electric Motor on side
            const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 2.4), steelMat);
            motor.rotation.z = Math.PI / 2;
            motor.position.set(-1.8, 4.2, 0);
            group.add(motor);

            // Large Horizontal Cylindrical Pressure Vessel (Air Receiver Tank)
            const tankGeo = new THREE.CylinderGeometry(1.0, 1.0, 4.6, 24);
            const tankMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.75, roughness: 0.25 });
            const tank = new THREE.Mesh(tankGeo, tankMat);
            tank.rotation.z = Math.PI / 2;
            tank.position.set(2.2, 2.2, 0);
            group.add(tank);

            // Domed end caps for pressure tank
            for (let xOff of [0.0, 4.4]) {
                const dome = new THREE.Mesh(new THREE.SphereGeometry(1.0, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), tankMat);
                dome.rotation.z = xOff === 0.0 ? -Math.PI / 2 : Math.PI / 2;
                dome.position.set(xOff === 0.0 ? -0.1 : 4.5, 2.2, 0);
                group.add(dome);
            }

            // Tank mounting saddle brackets
            for (let xOff of [0.8, 3.6]) {
                const saddle = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.2, 2.2), steelMat);
                saddle.position.set(xOff, 0.7, 0);
                group.add(saddle);
            }

            // Critical Alert Beacon on top
            const alertBeacon = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.9), glowRedMat);
            alertBeacon.position.set(-1.8, 4.7, 1.2);
            group.add(alertBeacon);
        }
        else if (modelType === "cleanroom_hvac" || name.includes("HVAC")) {
            // M11: CLEANROOM HVAC / AIR HANDLING SYSTEM
            const ahuBody = new THREE.Mesh(
                new THREE.BoxGeometry(8.0, 5.2, 6.0),
                new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7, roughness: 0.3 })
            );
            ahuBody.position.y = 2.7;
            group.add(ahuBody);

            // Dual circular fan blowers with spinning fan blades
            for (let zOff of [-1.8, 1.8]) {
                const fanCowl = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.6, 24), steelMat);
                fanCowl.position.set(2.2, 5.4, zOff);
                group.add(fanCowl);

                // Rotating fan blades
                const fanBladeGroup = new THREE.Group();
                fanBladeGroup.userData = { isFan: true };
                fanBladeGroup.position.set(2.2, 5.4, zOff);

                const b1 = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.1, 0.35), darkBodyMat);
                const b2 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.1, 2.0), darkBodyMat);
                fanBladeGroup.add(b1, b2);
                group.add(fanBladeGroup);
            }

            // HEPA Supply duct header
            const duct = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.8, 5.4), accentCyanMat);
            duct.position.set(-2.0, 4.8, 0);
            group.add(duct);
        }
    }

    createSensorNode(data) {
        const nodeGroup = new THREE.Group();

        let nodeColor = 0x00ff66;
        if (data.status === 'WARNING') nodeColor = 0xffb700;
        if (data.status === 'CRITICAL') nodeColor = 0xff0055;

        // Central glowing sphere
        const sphereGeo = new THREE.SphereGeometry(0.45, 16, 16);
        const sphereMat = new THREE.MeshBasicMaterial({ color: nodeColor });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        nodeGroup.add(sphere);

        // Outer halo ring
        const ringGeo = new THREE.RingGeometry(0.65, 0.9, 32);
        const ringMat = new THREE.MeshBasicMaterial({
            color: nodeColor,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.75
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        nodeGroup.add(ring);

        // Vertical laser dashed indicator line
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, -2.4, 0)
        ]);
        const lineMat = new THREE.LineDashedMaterial({
            color: nodeColor,
            dashSize: 0.3,
            gapSize: 0.2,
            transparent: true,
            opacity: 0.8
        });
        const line = new THREE.Line(lineGeo, lineMat);
        line.computeLineDistances();
        nodeGroup.add(line);

        nodeGroup.userData = { ring: ring, sphere: sphere, status: data.status, baseColor: nodeColor };
        return nodeGroup;
    }

    initRaycaster() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
    }

    getIntersectedMachine(event) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);

        for (let hit of intersects) {
            let curr = hit.object;
            while (curr && curr.parent && curr.parent !== this.scene) {
                if (curr.userData && curr.userData.key) {
                    return curr.userData.key;
                }
                if (curr.userData && curr.userData.name) {
                    return curr.userData.name;
                }
                curr = curr.parent;
            }
        }
        return null;
    }

    highlightMachine(machineKey) {
        if (this.highlightMesh) {
            this.scene.remove(this.highlightMesh);
            this.highlightMesh = null;
        }

        if (!machineKey || !this.machinesMap.has(machineKey)) return;

        const data = machineData[machineKey];

        // Cyan wireframe bounding box selection indicator
        const boxGeo = new THREE.BoxGeometry(data.size.width + 0.8, data.size.height + 0.8, data.size.depth + 0.8);
        const wireMat = new THREE.MeshBasicMaterial({
            color: 0x00f0ff,
            wireframe: true,
            transparent: true,
            opacity: 0.85
        });

        this.highlightMesh = new THREE.Mesh(boxGeo, wireMat);
        this.highlightMesh.position.set(data.position.x, data.position.y + data.size.height / 2, data.position.z);
        this.scene.add(this.highlightMesh);
    }

    focusCameraOnMachine(machineKey) {
        if (!machineKey || !this.machinesMap.has(machineKey)) return;

        const data = machineData[machineKey];
        const targetPos = new THREE.Vector3(data.position.x, data.position.y + 2, data.position.z);

        const duration = 900;
        const startTarget = this.controls.target.clone();
        const startCam = this.camera.position.clone();

        const endCam = new THREE.Vector3(data.position.x + 15, data.position.y + 16, data.position.z + 18);

        const startTime = performance.now();

        const animateCam = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);

            this.controls.target.lerpVectors(startTarget, targetPos, ease);
            this.camera.position.lerpVectors(startCam, endCam, ease);
            this.controls.update();

            if (progress < 1) {
                requestAnimationFrame(animateCam);
            }
        };

        requestAnimationFrame(animateCam);
    }

    resetCamera() {
        const duration = 900;
        const startTarget = this.controls.target.clone();
        const startCam = this.camera.position.clone();

        const endTarget = new THREE.Vector3(0, 0, 0);
        const endCam = new THREE.Vector3(0, 75, 92);

        const startTime = performance.now();

        const animateCam = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);

            this.controls.target.lerpVectors(startTarget, endTarget, ease);
            this.camera.position.lerpVectors(startCam, endCam, ease);
            this.controls.update();

            if (progress < 1) {
                requestAnimationFrame(animateCam);
            }
        };

        requestAnimationFrame(animateCam);
    }

    animate(time) {
        this.controls.update();

        // Pulsing animation for sensor nodes
        this.sensorNodes.forEach(({ node, status }) => {
            const pulse = 1 + Math.sin(time * 0.004) * 0.22;
            const ring = node.userData.ring;
            ring.scale.set(pulse, pulse, 1);

            if (status === 'CRITICAL') {
                const intense = 1 + Math.sin(time * 0.01) * 0.35;
                node.userData.sphere.scale.set(intense, intense, intense);
            }
        });

        // Rotate HVAC fans
        this.scene.traverse(obj => {
            if (obj.userData && obj.userData.isFan) {
                obj.rotation.y += 0.08;
            }
        });

        // Rotate selected wireframe bounding box
        if (this.highlightMesh) {
            this.highlightMesh.rotation.y += 0.005;
        }

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
}
