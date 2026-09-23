/**
 * SCADA-2.0 - Main Application Orchestrator
 * Factory Digital Twin & Industrial Automation System
 */

import { FactoryScene } from './factoryScene.js';
import { UIController } from './uiController.js';
import { SensorEngine } from './sensorEngine.js';

document.addEventListener('DOMContentLoaded', () => {
    const canvasContainer = document.getElementById('factory-canvas-container');
    if (!canvasContainer) {
        console.error("Canvas container element #factory-canvas-container not found.");
        return;
    }

    // 1. Initialize 3D Factory Scene
    const factoryScene = new FactoryScene(canvasContainer);

    // 2. Initialize UI Controller
    const uiController = new UIController(factoryScene);

    // 3. Initialize Sensor Real-Time Engine (1000ms tick)
    const sensorEngine = new SensorEngine((stats) => {
        uiController.updateHeaderStats(stats);
    });
    sensorEngine.start();

    // 4. Main Animation & Render Loop
    function renderLoop(time) {
        requestAnimationFrame(renderLoop);
        factoryScene.animate(time);
        uiController.tick();
    }
    requestAnimationFrame(renderLoop);

    console.log("⚡ SCADA-2.0 initialized successfully.");
});
