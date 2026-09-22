/**
 * SCADA 2.0
 * Master Data Module Entry Point
 * Phase 1: Factory & Machine Master Data
 *
 * Single source of truth for:
 * 1. Factory Information
 * 2. Factory Areas / Zones
 * 3. Machines (M01 - M11)
 * 4. Technical Specifications (Electrical, Mechanical, Operational)
 * 5. Sensor Configurations
 *
 * Isomorphic TypeScript module: can be safely imported by Node backends,
 * Python data loaders, and frontend 3D Digital Twin dashboards (Phase 2 & 12).
 */

import { Machine, MachineType, Sensor } from "./types";
import { FACTORY_INFO, FACTORY_ZONES } from "./zones";
import { MACHINES } from "./machineCatalog";
import { validateMasterData, ValidationResult } from "./validator";

export * from "./types";
export { FACTORY_INFO, FACTORY_ZONES } from "./zones";
export { MACHINES } from "./machineCatalog";
export { validateMasterData, runStartupValidation } from "./validator";

/**
 * Validate on module initialization to prevent silent data corruption
 */
const initialValidation: ValidationResult = validateMasterData(
  FACTORY_INFO,
  FACTORY_ZONES,
  MACHINES,
  false
);

if (!initialValidation.isValid) {
  console.error("CRITICAL: Master Data initialization failed validation!");
  initialValidation.errors.forEach((err) => console.error(`  - ${err}`));
}

/**
 * Find machine by exact ID (e.g. "M01")
 */
export function getMachineById(machineId: string): Machine | undefined {
  return MACHINES.find((m) => m.id === machineId);
}

/**
 * Find all machines in a given factory zone (e.g. "Z01_FABRICATION")
 */
export function getMachinesByZone(zoneId: string): Machine[] {
  return MACHINES.filter((m) => m.zoneId === zoneId);
}

/**
 * Find machines by type (e.g. "metal_cutting", "hvac")
 */
export function getMachinesByType(type: MachineType): Machine[] {
  return MACHINES.filter((m) => m.type === type);
}

/**
 * Get flat list of all sensors across the factory
 */
export function getAllSensors(): Sensor[] {
  return MACHINES.flatMap((m) => m.sensors);
}

/**
 * Get all sensors attached to a specific machine
 */
export function getSensorsByMachine(machineId: string): Sensor[] {
  const machine = getMachineById(machineId);
  return machine ? machine.sensors : [];
}

/**
 * Find a sensor by its unique sensor ID (e.g. "SEN_M01_VLT")
 */
export function getSensorById(sensorId: string): Sensor | undefined {
  for (const m of MACHINES) {
    const s = m.sensors.find((sensor) => sensor.sensorId === sensorId);
    if (s) return s;
  }
  return undefined;
}

/**
 * Retrieve high-level factory summary statistics
 */
export function getFactorySummary() {
  const totalPowerKw = MACHINES.reduce((sum, m) => sum + m.electrical.ratedPower, 0);
  const totalSensors = getAllSensors().length;
  const zones = Object.values(FACTORY_ZONES);

  return {
    factory: FACTORY_INFO,
    totalZones: zones.length,
    totalMachines: MACHINES.length,
    totalConnectedSensors: totalSensors,
    totalConnectedLoadKw: Number(totalPowerKw.toFixed(1)),
    utilizationVsGridCapacity: Number(
      ((totalPowerKw / FACTORY_INFO.gridPowerCapacityKw) * 100).toFixed(1)
    ),
    zonesSummary: zones.map((z) => ({
      zoneId: z.zoneId,
      name: z.name,
      machineCount: getMachinesByZone(z.zoneId).length,
    })),
  };
}

/**
 * Returns a standardized snapshot payload of the entire master data model.
 */
export function getMasterDataSnapshot() {
  return {
    metadata: {
      generatedAt: new Date().toISOString(),
      schemaVersion: "2.0.0",
      description: "SCADA-2.0 Factory & Machine Master Data Snapshot",
    },
    factory: FACTORY_INFO,
    zones: FACTORY_ZONES,
    machines: MACHINES,
  };
}
