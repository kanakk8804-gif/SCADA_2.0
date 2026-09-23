/**
 * SCADA-2.0 - Simulated Real-Time Sensor Data & Telemetry Engine
 * 11 Phase 1 Machines (M01 - M11)
 */

import { machineData } from './data.js';

export class SensorEngine {
    constructor(updateCallback) {
        this.updateCallback = updateCallback;
        this.intervalId = null;
    }

    start() {
        if (this.intervalId) return;
        this.intervalId = setInterval(() => this.tick(), 1000);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    tick() {
        let totalEnergy = 0;
        let onlineCount = 0;
        let activeAlerts = 0;

        Object.keys(machineData).forEach(name => {
            const m = machineData[name];
            onlineCount++;

            // Apply realistic random telemetry fluctuations (jitter)
            const randomJitter = (base, jitterPct = 0.04) => {
                const delta = (Math.random() * 2 - 1) * (base * jitterPct);
                return Math.max(0.1, Number((base + delta).toFixed(1)));
            };

            if (m.id === "M07" || name.includes("Reflow")) {
                m.temperature = Number((180 + Math.random() * 8.0).toFixed(1)); // 180-188°C (WARNING)
                m.current = randomJitter(42.6, 0.03);
                m.power = randomJitter(28.4, 0.03);
                m.vibration = randomJitter(1.6, 0.05);
                activeAlerts++;
            } else if (m.id === "M10" || name.includes("Compressor")) {
                m.temperature = Number((76 + Math.random() * 5.0).toFixed(1)); // 76-81°C (CRITICAL)
                m.vibration = Number((5.8 + Math.random() * 0.8).toFixed(1));   // 5.8-6.6 mm/s (CRITICAL)
                m.current = randomJitter(54.2, 0.03);
                m.power = randomJitter(35.8, 0.03);
                activeAlerts++;
            } else {
                m.current = randomJitter(m.current, 0.02);
                m.power = randomJitter(m.power, 0.02);
                m.temperature = randomJitter(m.temperature, 0.015);
                m.vibration = randomJitter(m.vibration, 0.03);
            }

            totalEnergy += m.power;

            // Update rolling history queues (keep max 15 points)
            this.pushHistory(m.history.current, m.current);
            this.pushHistory(m.history.power, m.power);
            this.pushHistory(m.history.temperature, m.temperature);
            this.pushHistory(m.history.vibration, m.vibration);
        });

        const stats = {
            totalMachines: Object.keys(machineData).length,
            onlineMachines: onlineCount,
            alertCount: activeAlerts,
            totalEnergy: Number(totalEnergy.toFixed(1))
        };

        if (this.updateCallback) {
            this.updateCallback(stats);
        }
    }

    pushHistory(array, val) {
        array.push(val);
        if (array.length > 15) {
            array.shift();
        }
    }

    static generateSparklinePoints(dataArray, width = 120, height = 32) {
        if (!dataArray || dataArray.length < 2) return "";

        const min = Math.min(...dataArray);
        const max = Math.max(...dataArray);
        const range = (max - min) || 1;

        const points = dataArray.map((val, idx) => {
            const x = (idx / (dataArray.length - 1)) * width;
            const y = height - ((val - min) / range) * (height - 6) - 3;
            return `${x.toFixed(1)},${y.toFixed(1)}`;
        });

        return points.join(" ");
    }
}
