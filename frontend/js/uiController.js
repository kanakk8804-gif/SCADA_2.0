/**
 * SCADA-2.0 - UI Controller & Industrial SCADA Dashboard Manager
 */

import * as THREE from 'three';
import { machineData } from './data.js';
import { SensorEngine } from './sensorEngine.js';

export class UIController {
    constructor(factoryScene) {
        this.factoryScene = factoryScene;
        this.selectedMachineName = null;

        this.initDOM();
        this.initHeaderClock();
        this.renderBottomBar();
        this.renderFloatingLabels();
        this.bindEvents();
    }

    initDOM() {
        this.panelElement = document.getElementById('machine-details-panel');
        this.panelContent = document.getElementById('panel-content');
        this.emptyState = document.getElementById('panel-empty-state');
        this.bottomBarContainer = document.getElementById('bottom-status-strip');
        this.floatingLabelsContainer = document.getElementById('floating-labels-layer');

        // Header statistics elements
        this.statMachines = document.getElementById('stat-total-machines');
        this.statOnline = document.getElementById('stat-online-count');
        this.statAlerts = document.getElementById('stat-active-alerts');
        this.statEnergy = document.getElementById('stat-total-energy');

        // Clock elements
        this.clockTime = document.getElementById('header-clock-time');
        this.clockDate = document.getElementById('header-clock-date');
    }

    initHeaderClock() {
        const updateClock = () => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
            const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            if (this.clockTime) this.clockTime.textContent = timeStr;
            if (this.clockDate) this.clockDate.textContent = dateStr;
        };
        updateClock();
        setInterval(updateClock, 1000);
    }

    updateHeaderStats(stats) {
        if (this.statMachines) this.statMachines.textContent = stats.totalMachines;
        if (this.statOnline) this.statOnline.textContent = stats.onlineMachines;
        if (this.statAlerts) this.statAlerts.textContent = stats.alertCount;
        if (this.statEnergy) this.statEnergy.textContent = `${stats.totalEnergy} kW`;
    }

    bindEvents() {
        // 3D Canvas Click Detection
        const canvas = this.factoryScene.renderer.domElement;
        canvas.addEventListener('click', (e) => {
            const hitMachine = this.factoryScene.getIntersectedMachine(e);
            if (hitMachine) {
                this.selectMachine(hitMachine);
            }
        });

        // Close Panel Button
        document.getElementById('close-panel-btn').addEventListener('click', () => {
            this.deselectMachine();
        });

        // D-Pad Navigation Controls
        document.getElementById('nav-up').addEventListener('click', () => this.factoryScene.controls.pan(0, 4));
        document.getElementById('nav-down').addEventListener('click', () => this.factoryScene.controls.pan(0, -4));
        document.getElementById('nav-left').addEventListener('click', () => this.factoryScene.controls.pan(-4, 0));
        document.getElementById('nav-right').addEventListener('click', () => this.factoryScene.controls.pan(4, 0));
        document.getElementById('nav-reset').addEventListener('click', () => {
            this.factoryScene.resetCamera();
            this.deselectMachine();
        });

        document.getElementById('zoom-in').addEventListener('click', () => {
            this.factoryScene.camera.position.multiplyScalar(0.88);
            this.factoryScene.controls.update();
        });
        document.getElementById('zoom-out').addEventListener('click', () => {
            this.factoryScene.camera.position.multiplyScalar(1.12);
            this.factoryScene.controls.update();
        });

        // Hardware Architecture Modal Handler
        const protoBadge = document.getElementById('prototype-badge');
        const modal = document.getElementById('arch-modal');
        const closeModal = document.getElementById('close-modal-btn');

        if (protoBadge && modal) {
            protoBadge.addEventListener('click', () => modal.classList.add('visible'));
            closeModal.addEventListener('click', () => modal.classList.remove('visible'));
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.remove('visible');
            });
        }
    }

    renderFloatingLabels() {
        if (!this.floatingLabelsContainer) return;
        this.floatingLabelsContainer.innerHTML = '';
        this.labelElementsMap = new Map();

        Object.keys(machineData).forEach(name => {
            const data = machineData[name];
            const labelEl = document.createElement('div');
            labelEl.className = `floating-machine-label status-${data.status.toLowerCase()}`;
            const displayLabel = data.shortLabel || name;
            labelEl.innerHTML = `
                <span class="label-dot"></span>
                <span class="label-text">${displayLabel}</span>
            `;

            labelEl.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectMachine(name);
            });

            this.floatingLabelsContainer.appendChild(labelEl);
            this.labelElementsMap.set(name, labelEl);
        });
    }

    updateFloatingLabelPositions() {
        if (!this.labelElementsMap) return;

        const width = this.factoryScene.container.clientWidth;
        const height = this.factoryScene.container.clientHeight;
        const tempVec = new THREE.Vector3();

        Object.keys(machineData).forEach(name => {
            const data = machineData[name];
            const labelEl = this.labelElementsMap.get(name);
            if (!labelEl) return;

            // Project 3D machine top position to 2D screen space
            tempVec.set(data.position.x, data.position.y + data.size.height + 1.2, data.position.z);
            tempVec.project(this.factoryScene.camera);

            // Hide labels if behind camera near clip plane
            if (tempVec.z > 1.0) {
                labelEl.style.display = 'none';
                return;
            }

            const x = (tempVec.x * 0.5 + 0.5) * width;
            const y = (-tempVec.y * 0.5 + 0.5) * height;

            labelEl.style.display = 'flex';
            labelEl.style.transform = `translate(-50%, -100%) translate(${x}px, ${y}px)`;
        });
    }

    selectMachine(name) {
        if (!machineData[name]) return;

        this.selectedMachineName = name;
        this.factoryScene.highlightMachine(name);
        this.factoryScene.focusCameraOnMachine(name);

        // Show Details Panel
        this.emptyState.style.display = 'none';
        this.panelContent.style.display = 'block';

        this.updatePanelData();
        this.highlightBottomBarCard(name);
    }

    deselectMachine() {
        this.selectedMachineName = null;
        this.factoryScene.highlightMachine(null);
        this.emptyState.style.display = 'flex';
        this.panelContent.style.display = 'none';
        this.highlightBottomBarCard(null);
    }

    updatePanelData() {
        if (!this.selectedMachineName) return;

        const data = machineData[this.selectedMachineName];

        // Panel Title & Badges
        document.getElementById('panel-machine-title').textContent = data.name;
        document.getElementById('panel-machine-code').textContent = `${data.code} | ${data.category}`;

        const statusBadge = document.getElementById('panel-status-badge');
        statusBadge.className = `status-badge status-${data.status.toLowerCase()}`;
        statusBadge.innerHTML = `● ${data.status}`;

        document.getElementById('panel-machine-desc').textContent = data.description;

        // Telemetry Cards Values
        document.getElementById('telemetry-current-val').textContent = `${data.current} A`;
        document.getElementById('telemetry-power-val').textContent = `${data.power} kW`;
        document.getElementById('telemetry-temp-val').textContent = `${data.temperature} °C`;
        document.getElementById('telemetry-vib-val').textContent = `${data.vibration} mm/s`;

        // Render Telemetry Sparklines
        this.renderSparkline('sparkline-current', data.history.current, '#00f0ff');
        this.renderSparkline('sparkline-power', data.history.power, '#38bdf8');
        this.renderSparkline('sparkline-temp', data.history.temperature, data.status === 'WARNING' ? '#ffb700' : (data.status === 'CRITICAL' ? '#ff0055' : '#00ff66'));
        this.renderSparkline('sparkline-vib', data.history.vibration, data.status === 'CRITICAL' ? '#ff0055' : '#00ff66');

        // Render Live Pinouts / Real Phase 1 Sensor Catalog
        const pinoutTbody = document.getElementById('panel-pinouts-tbody');
        if (pinoutTbody && data.pinouts) {
            pinoutTbody.innerHTML = data.pinouts.map(p => `
                <tr>
                    <td class="pin-code">${p.pin}</td>
                    <td class="pin-name">${p.name}</td>
                    <td class="pin-val">${p.value}</td>
                </tr>
            `).join('');
        }

        // Render Active Alerts Box
        const alertBox = document.getElementById('panel-alerts-container');
        if (alertBox) {
            if (data.alerts && data.alerts.length > 0) {
                alertBox.style.display = 'block';
                alertBox.className = `alert-box alert-${data.status.toLowerCase()}`;
                alertBox.innerHTML = `
                    <div class="alert-title">ACTIVE DIAGNOSTIC ALERTS</div>
                    ${data.alerts.map(a => `<div class="alert-item">${a}</div>`).join('')}
                `;
            } else {
                alertBox.style.display = 'none';
            }
        }
    }

    renderSparkline(elementId, historyData, strokeColor) {
        const svgEl = document.getElementById(elementId);
        if (!svgEl || !historyData) return;

        const pointsStr = SensorEngine.generateSparklinePoints(historyData, 120, 32);
        svgEl.innerHTML = `
            <polyline
                fill="none"
                stroke="${strokeColor}"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                points="${pointsStr}"
            />
        `;
    }

    renderBottomBar() {
        if (!this.bottomBarContainer) return;
        this.bottomBarContainer.innerHTML = '';
        this.bottomCardsMap = new Map();

        Object.keys(machineData).forEach(name => {
            const data = machineData[name];
            const card = document.createElement('div');
            card.className = `bottom-machine-card status-${data.status.toLowerCase()}`;
            card.dataset.machine = name;

            const displayLabel = data.shortLabel || name;
            card.innerHTML = `
                <div class="bmc-header">
                    <span class="bmc-dot"></span>
                    <span class="bmc-name">${displayLabel}</span>
                </div>
                <div class="bmc-metrics">
                    <span>${data.current} A</span> | <span>${data.power} kW</span> | <span>${data.temperature} °C</span>
                </div>
            `;

            card.addEventListener('click', () => this.selectMachine(name));

            this.bottomBarContainer.appendChild(card);
            this.bottomCardsMap.set(name, card);
        });
    }

    updateBottomBarData() {
        if (!this.bottomCardsMap) return;

        Object.keys(machineData).forEach(name => {
            const data = machineData[name];
            const card = this.bottomCardsMap.get(name);
            if (!card) return;

            const metricsEl = card.querySelector('.bmc-metrics');
            if (metricsEl) {
                metricsEl.innerHTML = `<span>${data.current} A</span> | <span>${data.power} kW</span> | <span>${data.temperature} °C</span>`;
            }
        });
    }

    highlightBottomBarCard(selectedName) {
        if (!this.bottomCardsMap) return;

        this.bottomCardsMap.forEach((card, name) => {
            if (name === selectedName) {
                card.classList.add('active');
                card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } else {
                card.classList.remove('active');
            }
        });
    }

    tick() {
        this.updateFloatingLabelPositions();
        if (this.selectedMachineName) {
            this.updatePanelData();
        }
        this.updateBottomBarData();
    }
}
