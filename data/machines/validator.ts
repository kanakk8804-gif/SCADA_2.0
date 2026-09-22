/**
 * SCADA 2.0
 * Master Data Integrity & Physical Rule Validator
 * Phase 1: Factory & Machine Master Data
 *
 * Enforces:
 * 1. Global uniqueness of Machine IDs and Sensor IDs
 * 2. Mandatory non-empty machine names and human-readable function descriptions
 * 3. Foreign key validity: Machine.zoneId must exist in FACTORY_ZONES
 * 4. Foreign key validity: Sensor.machineId must match enclosing Machine.id
 * 5. Electrical constraints:
 *    - ratedVoltage > 0
 *    - ratedPower > 0
 *    - ratedCurrent > 0
 *    - 0 < powerFactor <= 1.0
 *    - Mathematical consistency between Power, Voltage, Current, and Power Factor
 * 6. Mechanical constraints:
 *    - RPM must be null or >= 0 (no negative RPM, nullable for non-rotary machines)
 * 7. Operational constraints:
 *    - ageYears >= 0
 *    - operatingHours >= 0
 * 8. Sensor constraints:
 *    - sensorType must belong to SUPPORTED_SENSOR_TYPES
 *    - No duplicate sensors or sensor types on the same machine
 *    - samplingIntervalSec > 0
 *    - unit non-empty
 */

import {
  FactoryInfo,
  FactoryZone,
  Machine,
  SUPPORTED_SENSOR_TYPES,
  SensorType,
} from "./types";
import { FACTORY_INFO, FACTORY_ZONES } from "./zones";
import { MACHINES } from "./machineCatalog";

export interface ValidationResult {
  isValid: boolean;
  totalMachines: number;
  totalSensors: number;
  totalZones: number;
  errors: string[];
  warnings: string[];
}

/**
 * Validates the entire Factory Master Data model.
 * If throwOnError is true, throws an Error with human-readable diagnostic messages.
 */

export function validateMasterData(
  factory: FactoryInfo = FACTORY_INFO,
  zones: Record<string, FactoryZone> = FACTORY_ZONES,
  machines: Machine[] = MACHINES,
  throwOnError: boolean = false
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Validate Factory Information
  if (!factory.factoryId || factory.factoryId.trim() === "") {
    errors.push("Factory master record is missing a valid factoryId.");
  }
  if (!factory.name || factory.name.trim() === "") {
    errors.push("Factory master record is missing a valid name.");
  }
  if (factory.gridPowerCapacityKw <= 0) {
    errors.push(`Factory grid power capacity must be > 0. Found: ${factory.gridPowerCapacityKw}`);
  }

  // 2. Validate Zones
  const zoneIdSet = new Set<string>();
  for (const [key, zone] of Object.entries(zones)) {
    if (!zone.zoneId || zone.zoneId.trim() === "") {
      errors.push(`Zone entry '${key}' has an empty or missing zoneId.`);
      continue;
    }
    if (zoneIdSet.has(zone.zoneId)) {
      errors.push(`Duplicate zoneId detected: '${zone.zoneId}'`);
    }
    zoneIdSet.add(zone.zoneId);

    if (!zone.name || zone.name.trim() === "") {
      errors.push(`Zone '${zone.zoneId}' has an empty name.`);
    }
    if (zone.areaSqm <= 0) {
      errors.push(`Zone '${zone.zoneId}' area must be > 0. Found: ${zone.areaSqm}`);
    }
  }

  // 3. Validate Machines
  const seenMachineIds = new Set<string>();
  const seenSensorIds = new Set<string>();
  let totalSensors = 0;

  for (const machine of machines) {
    const mId = machine.id;

    // A. Machine ID checks
    if (!mId || mId.trim() === "") {
      errors.push("Detected a machine with an empty or missing machine_id.");
      continue;
    }

    if (seenMachineIds.has(mId)) {
      errors.push(`Duplicate machine_id detected: '${mId}'. Every machine ID must be unique.`);
    }
    seenMachineIds.add(mId);

    // B. Machine Name and Function
    if (!machine.name || machine.name.trim() === "") {
      errors.push(`Machine '${mId}' is missing a required name.`);
    }
    if (!machine.function || machine.function.trim() === "") {
      errors.push(`Machine '${mId}' is missing a human-readable functional description.`);
    }

    // C. Zone Foreign Key Validation
    if (!machine.zoneId || !zoneIdSet.has(machine.zoneId)) {
      errors.push(
        `Machine '${mId}' belongs to invalid or unregistered zone '${machine.zoneId}'. Must match an existing factory zone.`
      );
    }

    // D. Electrical Specifications Validation
    const elec = machine.electrical;
    if (!elec) {
      errors.push(`Machine '${mId}' is missing electrical specifications.`);
    } else {
      if (elec.ratedVoltage <= 0) {
        errors.push(`Machine '${mId}' ratedVoltage must be > 0. Found: ${elec.ratedVoltage} V`);
      }
      if (elec.ratedPower <= 0) {
        errors.push(`Machine '${mId}' ratedPower must be > 0. Found: ${elec.ratedPower} kW`);
      }
      if (elec.ratedCurrent <= 0) {
        errors.push(`Machine '${mId}' ratedCurrent must be > 0. Found: ${elec.ratedCurrent} A`);
      }
      if (elec.powerFactor <= 0 || elec.powerFactor > 1.0) {
        errors.push(
          `Machine '${mId}' powerFactor must be between 0 and 1. Found: ${elec.powerFactor}`
        );
      }

      // Mathematical consistency check:
      // 3-Phase: I = (P * 1000) / (sqrt(3) * V * PF)
      // 1-Phase: I = (P * 1000) / (V * PF)
      if (elec.ratedVoltage > 0 && elec.ratedPower > 0 && elec.powerFactor > 0) {
        const expectedCurrent =
          elec.phases === 3
            ? (elec.ratedPower * 1000) / (Math.sqrt(3) * elec.ratedVoltage * elec.powerFactor)
            : (elec.ratedPower * 1000) / (elec.ratedVoltage * elec.powerFactor);

        const currentDiff = Math.abs(expectedCurrent - elec.ratedCurrent);
        // Allow up to 0.5 A tolerance for rounding
        if (currentDiff > 0.5) {
          warnings.push(
            `Machine '${mId}' electrical consistency notice: ratedCurrent is ${elec.ratedCurrent} A, calculated expected is ${expectedCurrent.toFixed(1)} A (difference: ${currentDiff.toFixed(2)} A).`
          );
        }
      }
    }

    // E. Mechanical Specifications Validation (RPM nullability & positivity)
    const mech = machine.mechanical;
    if (!mech) {
      errors.push(`Machine '${mId}' is missing mechanical specifications.`);
    } else {
      if (mech.rpm !== null) {
        if (typeof mech.rpm !== "number" || isNaN(mech.rpm)) {
          errors.push(`Machine '${mId}' rpm must be a valid number or null.`);
        } else if (mech.rpm < 0) {
          errors.push(`Machine '${mId}' rpm cannot be negative. Found: ${mech.rpm}`);
        }
      }
    }

    // F. Operational Specifications Validation
    const op = machine.operation;
    if (!op) {
      errors.push(`Machine '${mId}' is missing operational specifications.`);
    } else {
      if (op.ageYears < 0) {
        errors.push(`Machine '${mId}' ageYears cannot be negative. Found: ${op.ageYears}`);
      }
      if (op.operatingHours < 0) {
        errors.push(
          `Machine '${mId}' operatingHours cannot be negative. Found: ${op.operatingHours}`
        );
      }
    }

    // G. Sensors Validation
    if (!Array.isArray(machine.sensors) || machine.sensors.length === 0) {
      errors.push(`Machine '${mId}' must have at least one configured sensor.`);
    } else {
      const machineSensorTypes = new Set<SensorType>();

      for (const sensor of machine.sensors) {
        totalSensors++;

        // Global sensor ID uniqueness
        if (!sensor.sensorId || sensor.sensorId.trim() === "") {
          errors.push(`Machine '${mId}' has a sensor with an empty sensorId.`);
        } else {
          if (seenSensorIds.has(sensor.sensorId)) {
            errors.push(
              `Duplicate sensor ID detected: '${sensor.sensorId}'. Every sensor ID must be globally unique across the factory.`
            );
          }
          seenSensorIds.add(sensor.sensorId);
        }

        // Sensor belongs to valid machine
        if (sensor.machineId !== mId) {
          errors.push(
            `Sensor '${sensor.sensorId}' has machineId '${sensor.machineId}' which does not match enclosing machine '${mId}'.`
          );
        }

        // Sensor type is in supported list
        if (!SUPPORTED_SENSOR_TYPES.includes(sensor.sensorType)) {
          errors.push(
            `Sensor '${sensor.sensorId}' on Machine '${mId}' uses unsupported sensorType '${sensor.sensorType}'. Must be one of the 18 supported types.`
          );
        }

        // No duplicate sensor types per machine
        if (machineSensorTypes.has(sensor.sensorType)) {
          errors.push(`Machine ${mId} contains duplicate sensor: ${sensor.sensorType}`);
        }
        machineSensorTypes.add(sensor.sensorType);

        // Sampling interval check
        if (sensor.samplingIntervalSec <= 0) {
          errors.push(
            `Sensor '${sensor.sensorId}' samplingIntervalSec must be > 0. Found: ${sensor.samplingIntervalSec}`
          );
        }

        // Unit check
        if (!sensor.unit || sensor.unit.trim() === "") {
          errors.push(`Sensor '${sensor.sensorId}' on Machine '${mId}' is missing a unit.`);
        }
      }
    }
  }

  const isValid = errors.length === 0;

  if (throwOnError && !isValid) {
    const errorDetails = errors.map((err, idx) => `  ${idx + 1}. ${err}`).join("\n");
    throw new Error(
      `\n❌ Factory Master Data Validation Failed with ${errors.length} error(s):\n${errorDetails}\n`
    );
  }

  return {
    isValid,
    totalMachines: machines.length,
    totalSensors,
    totalZones: Object.keys(zones).length,
    errors,
    warnings,
  };
}

/**
 * Direct self-test runner when executed directly
 */
export function runStartupValidation(): ValidationResult {
  console.log("🔍 Validating SCADA-2.0 Factory & Machine Master Data...");
  const result = validateMasterData(FACTORY_INFO, FACTORY_ZONES, MACHINES, false);

  if (result.isValid) {
    console.log("✅ Master Data validation passed successfully!");
    console.log(`   - Factory: ${FACTORY_INFO.name}`);
    console.log(`   - Zones: ${result.totalZones}`);
    console.log(`   - Machines: ${result.totalMachines} (M01 to M11)`);
    console.log(`   - Configured Sensors: ${result.totalSensors}`);
    if (result.warnings.length > 0) {
      console.log(`   - Notices (${result.warnings.length}):`);
      result.warnings.forEach((w) => console.log(`     ℹ️  ${w}`));
    }
  } else {
    console.error(`❌ Validation failed with ${result.errors.length} error(s):`);
    result.errors.forEach((err) => console.error(`   - ${err}`));
  }

  return result;
}
