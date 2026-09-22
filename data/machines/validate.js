/**
 * SCADA 2.0
 * Universal Node.js Master Data Verification Engine & Runner
 * Phase 1: Factory & Machine Master Data
 */

const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "factory_master_data.json");

const SUPPORTED_SENSOR_TYPES = [
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
];

const REQUIRED_MACHINE_IDS = [
  "M01",
  "M02",
  "M03",
  "M04",
  "M05",
  "M06",
  "M07",
  "M08",
  "M09",
  "M10",
  "M11",
];

function validateData(data, silent = false) {
  const errors = [];
  const warnings = [];

  const { factory, zones, machines } = data || {};

  // 1. Factory Info
  if (!factory || !factory.factoryId) {
    errors.push("Missing factory information or factoryId.");
  } else if (!silent) {
    console.log(`📍 Factory: ${factory.name} (${factory.factoryId})`);
    console.log(`   Location: ${factory.location}`);
    console.log(
      `   Sanctioned Grid Power: ${factory.gridPowerCapacityKw} kW @ ${factory.nominalGridVoltage}V ${factory.gridFrequencyHz}Hz`
    );
  }

  // 2. Zones
  const zoneKeys = Object.keys(zones || {});
  if (!silent) {
    console.log(`\n🏢 Configured Factory Zones (${zoneKeys.length}):`);
    zoneKeys.forEach((zk) => {
      console.log(`   • [${zk}] ${zones[zk].name} (${zones[zk].floorLevel})`);
    });
    console.log(`\n⚙️  Validating Machines (Required: M01 - M11)...`);
  }

  // 3. Machine Validation
  const seenMachineIds = new Set();
  const seenSensorIds = new Set();
  let totalConnectedLoadKw = 0;
  let totalSensors = 0;

  (machines || []).forEach((m) => {
    const mId = m.id;

    // Check unique machine ID
    if (!mId) {
      errors.push("Detected a machine with an empty or missing machine_id.");
      return;
    }
    if (seenMachineIds.has(mId)) {
      errors.push(`Duplicate machine_id detected: '${mId}'. Every machine ID must be unique.`);
    }
    seenMachineIds.add(mId);

    // Name & Function
    if (!m.name || m.name.trim() === "") {
      errors.push(`Machine '${mId}' is missing a required name.`);
    }
    if (!m.function || m.function.trim() === "") {
      errors.push(`Machine '${mId}' is missing a human-readable functional description.`);
    }

    // Zone foreign key
    if (!m.zoneId || !zones[m.zoneId]) {
      errors.push(
        `Machine '${mId}' belongs to invalid or unregistered zone '${m.zoneId}'. Must match an existing factory zone.`
      );
    }

    // Electrical Specs
    const e = m.electrical;
    if (!e) {
      errors.push(`Machine '${mId}' is missing electrical specifications.`);
    } else {
      if (e.ratedVoltage <= 0) errors.push(`Machine '${mId}' ratedVoltage must be > 0. Found: ${e.ratedVoltage} V`);
      if (e.ratedPower <= 0) errors.push(`Machine '${mId}' ratedPower must be > 0. Found: ${e.ratedPower} kW`);
      if (e.ratedCurrent <= 0) errors.push(`Machine '${mId}' ratedCurrent must be > 0. Found: ${e.ratedCurrent} A`);
      if (e.powerFactor <= 0 || e.powerFactor > 1.0) {
        errors.push(`Machine '${mId}' powerFactor must be between 0 and 1. Found: ${e.powerFactor}`);
      }

      totalConnectedLoadKw += e.ratedPower || 0;

      // Mathematical consistency
      if (e.ratedVoltage > 0 && e.ratedPower > 0 && e.powerFactor > 0) {
        const expectedI =
          e.phases === 3
            ? (e.ratedPower * 1000) / (Math.sqrt(3) * e.ratedVoltage * e.powerFactor)
            : (e.ratedPower * 1000) / (e.ratedVoltage * e.powerFactor);

        const diff = Math.abs(expectedI - e.ratedCurrent);
        if (diff > 0.5) {
          warnings.push(
            `Machine '${mId}' current rounding notice: rated=${e.ratedCurrent}A, calculated=${expectedI.toFixed(1)}A`
          );
        }
      }
    }

    // Mechanical Specs (Nullable RPM)
    const mech = m.mechanical;
    if (!mech) {
      errors.push(`Machine '${mId}' is missing mechanical specifications.`);
    } else {
      if (mech.rpm !== null) {
        if (typeof mech.rpm !== "number" || isNaN(mech.rpm) || mech.rpm < 0) {
          errors.push(`Machine '${mId}' rpm cannot be negative. Found: ${mech.rpm}`);
        }
      }
    }

    // Operational Specs
    const op = m.operation;
    if (!op) {
      errors.push(`Machine '${mId}' is missing operational specifications.`);
    } else {
      if (op.ageYears < 0) errors.push(`Machine '${mId}' ageYears cannot be negative. Found: ${op.ageYears}`);
      if (op.operatingHours < 0) errors.push(`Machine '${mId}' operatingHours cannot be negative. Found: ${op.operatingHours}`);
    }

    // Sensor Configuration
    const sensors = m.sensors || [];
    if (sensors.length === 0) {
      errors.push(`Machine '${mId}' must have at least one configured sensor.`);
    }

    const machineSensorTypes = new Set();
    sensors.forEach((s) => {
      totalSensors++;

      // Global sensor ID uniqueness
      if (!s.sensorId) {
        errors.push(`Machine '${mId}' has a sensor with an empty sensorId.`);
      } else {
        if (seenSensorIds.has(s.sensorId)) {
          errors.push(
            `Duplicate sensor ID detected: '${s.sensorId}'. Every sensor ID must be globally unique across the factory.`
          );
        }
        seenSensorIds.add(s.sensorId);
      }

      // Machine ID consistency
      if (s.machineId !== mId) {
        errors.push(`Sensor '${s.sensorId}' has machineId '${s.machineId}' which does not match enclosing machine '${mId}'.`);
      }

      // Supported type
      if (!SUPPORTED_SENSOR_TYPES.includes(s.sensorType)) {
        errors.push(
          `Sensor '${s.sensorId}' on Machine '${mId}' uses unsupported sensorType '${s.sensorType}'. Must be one of the 18 supported types.`
        );
      }

      // No duplicate sensor type per machine
      if (machineSensorTypes.has(s.sensorType)) {
        errors.push(`Machine ${mId} contains duplicate sensor: ${s.sensorType}`);
      }
      machineSensorTypes.add(s.sensorType);

      // Sampling interval & unit
      if (s.samplingIntervalSec <= 0) {
        errors.push(`Sensor '${s.sensorId}' samplingIntervalSec must be > 0. Found: ${s.samplingIntervalSec}`);
      }
      if (!s.unit || s.unit.trim() === "") {
        errors.push(`Sensor '${s.sensorId}' on Machine '${mId}' is missing a unit.`);
      }
    });

    if (!silent) {
      const rpmStr = mech && mech.rpm !== null ? `${mech.rpm} RPM` : "null (N/A)";
      console.log(
        `   ✓ [${m.id}] ${m.name.padEnd(46)} | ${(e ? e.ratedPower : 0).toFixed(1).padStart(4)} kW | ${String(e ? e.ratedCurrent : 0).padStart(5)} A | RPM: ${rpmStr.padEnd(10)} | Sensors: ${String(sensors.length).padStart(2)}`
      );
    }
  });

  // Check all required machine IDs exist
  REQUIRED_MACHINE_IDS.forEach((reqId) => {
    if (!seenMachineIds.has(reqId)) {
      errors.push(`Missing mandatory machine ID: '${reqId}'`);
    }
  });

  if (!silent) {
    console.log("--------------------------------------------------------------------------------");
    console.log(`📊 MASTER DATA SUMMARY:`);
    console.log(`   • Total Machines:           ${(machines || []).length} / 11`);
    console.log(`   • Total Configured Sensors: ${totalSensors}`);
    console.log(`   • Total Connected Load:     ${totalConnectedLoadKw.toFixed(1)} kW`);
    if (factory && factory.gridPowerCapacityKw) {
      console.log(
        `   • Grid Load Utilization:    ${((totalConnectedLoadKw / factory.gridPowerCapacityKw) * 100).toFixed(1)}% of ${factory.gridPowerCapacityKw} kW`
      );
    }
    console.log("--------------------------------------------------------------------------------");

    if (warnings.length > 0) {
      console.log(`⚠️  Notices (${warnings.length}):`);
      warnings.forEach((w) => console.log(`   ℹ️  ${w}`));
    }

    if (errors.length > 0) {
      console.error(`\n❌ VALIDATION FAILED with ${errors.length} error(s):`);
      errors.forEach((err, i) => console.error(`   ${i + 1}. ${err}`));
    } else {
      console.log(`\n✅ ALL VALIDATION CHECKS PASSED PERFECTLY! (0 errors)\n`);
    }
  }

  return {
    isValid: errors.length === 0,
    totalMachines: (machines || []).length,
    totalSensors,
    totalConnectedLoadKw,
    errors,
    warnings,
  };
}

function runValidation() {
  console.log("================================================================================");
  console.log("🏭 SCADA-2.0 / FACTORY DIGITAL TWIN — PHASE 1 MASTER DATA VALIDATOR");
  console.log("================================================================================");

  if (!fs.existsSync(DATA_FILE)) {
    console.error(`❌ Master data file not found at: ${DATA_FILE}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  const data = JSON.parse(raw);
  const result = validateData(data, false);

  if (!result.isValid) {
    process.exit(1);
  }
}

if (require.main === module) {
  runValidation();
}

module.exports = { validateData, runValidation, SUPPORTED_SENSOR_TYPES, REQUIRED_MACHINE_IDS };
