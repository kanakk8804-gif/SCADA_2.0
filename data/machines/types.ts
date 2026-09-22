/**
 * SCADA 2.0
 * Master Data Domain Types & Interfaces
 * Phase 1: Factory & Machine Master Data
 */

/**
 * 18 Supported sensor types for the factory
 */
export const SUPPORTED_SENSOR_TYPES = [
  "voltage_sensor",
  "current_sensor",
  "power_meter",
  "energy_meter",
  "temperature_sensor",
  "vibration_sensor",
  "rpm_sensor",
  "pressure_sensor",
  "flow_sensor",
  "humidity_sensor",
  "airflow_sensor",
  "acoustic_sensor",
  "door_status_sensor",
  "machine_status_sensor",
  "production_counter",
  "gas_flow_sensor",
  "differential_pressure_sensor",
  "particulate_sensor",
] as const;

export type SensorType = (typeof SUPPORTED_SENSOR_TYPES)[number];

/**
 * Factory operational zones / areas
 */
export interface FactoryZone {
  zoneId: string;
  name: string;
  code: string;
  floorLevel: string;
  areaSqm: number;
  description: string;
}

/**
 * Factory-level master information
 */
export interface FactoryInfo {
  factoryId: string;
  name: string;
  location: string;
  totalAreaSqm: number;
  gridPowerCapacityKw: number;
  backupGeneratorCapacityKw: number;
  nominalGridVoltage: number;
  gridFrequencyHz: number;
  description: string;
}

/**
 * Machine category types
 */
export type MachineType =
  | "metal_cutting"
  | "metal_forming"
  | "welding"
  | "coating"
  | "pcb_printing"
  | "pcb_assembly"
  | "thermal_processing"
  | "pcb_soldering"
  | "testing"
  | "compressed_air"
  | "hvac";

/**
 * Operational machine states
 */
export type MachineOperationalStatus =
  | "operational"
  | "standby"
  | "maintenance"
  | "offline";

/**
 * Electrical specification for a machine
 */
export interface ElectricalSpecification {
  ratedVoltage: number;       // Volts (e.g. 400 for 3-phase, 230 for 1-phase)
  ratedPower: number;         // kW (rated active power)
  ratedCurrent: number;       // Amperes (mathematically consistent with V, P, PF)
  powerFactor: number;        // 0.0 - 1.0 (typical industrial range 0.85 - 0.96)
  phases: 1 | 3;
  frequencyHz: number;        // Standard 50 Hz
  isCombinedRating: boolean;  // True if machine combines multiple subsystems
  ratingNotes?: string;       // Details of combined subsystem loads
}

/**
 * Mechanical specification for a machine
 */
export interface MechanicalSpecification {
  rpm: number | null;         // Null if rotational speed is not a primary parameter
  rpmNotes?: string;          // Context regarding the RPM measurement (e.g. pump motor vs linear gantry)
}

/**
 * Operational and life-cycle history
 */
export interface OperationalSpecification {
  installationYear: number;
  ageYears: number;
  operatingHours: number;     // Cumulative machine lifetime operating hours
  maintenanceIntervalHours: number;
}

/**
 * Real-world hardware acquisition target definition
 * Enables seamless transition in Phase 5 from simulated telemetry to physical hardware:
 * - Modbus RTU/TCP for modern machines with open ports
 * - CT Clamps + Energy Meter for locked/older machines
 * - ESP32 / Industrial Gateway for external sensor retrofits
 */
export type AcquisitionProtocol =
  | "MODBUS_TCP"
  | "MODBUS_RTU"
  | "CT_CLAMP_ADC"
  | "ESP32_GPIO"
  | "ENERGY_METER_MODBUS"
  | "SIMULATED";

export type GatewayType =
  | "ESP32_INDUSTRIAL"
  | "MODBUS_GATEWAY"
  | "ENERGY_METER_MODBUS"
  | "DIRECT_EMBEDDED";

export interface HardwareAcquisitionTarget {
  primaryProtocol: AcquisitionProtocol;
  portAccessible: boolean;
  gatewayType: GatewayType;
  hardwareNotes: string;
}

/**
 * Sensor configuration associated with a machine
 */
export interface Sensor {
  sensorId: string;           // Globally unique sensor ID (e.g. "SEN_M01_VOLT")
  machineId: string;          // Foreign key to Machine.id
  sensorType: SensorType;
  unit: string;               // e.g. "V", "A", "kW", "kWh", "°C", "bar", "RPM"
  samplingIntervalSec: number;// Sampling rate in seconds (e.g. 1, 5, 10)
  description: string;        // Human-readable sensor purpose
  hardwareChannel?: string;   // Modbus register or ADC channel for Phase 5 hardware binding
}

/**
 * Core Machine master record
 */
export interface Machine {
  id: string;                 // Stable unique ID: M01 - M11
  name: string;               // Machine name
  type: MachineType;
  function: string;           // Human-readable practical description of machine operation
  zoneId: string;             // Foreign key to FactoryZone.zoneId
  manufacturer: string;
  model: string;
  status: MachineOperationalStatus;
  electrical: ElectricalSpecification;
  mechanical: MechanicalSpecification;
  operation: OperationalSpecification;
  acquisition: HardwareAcquisitionTarget;
  sensors: Sensor[];
}
