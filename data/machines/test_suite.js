/**
 * SCADA 2.0
 * Master Data Automated Test Suite
 * Phase 1: Factory & Machine Master Data
 *
 * Verifies both positive validation (baseline master data)
 * and negative validation (rejecting corrupted, duplicate, or physically invalid configurations).
 */

const fs = require("fs");
const path = require("path");
const { validateData } = require("./validate.js");

const DATA_FILE = path.join(__dirname, "factory_master_data.json");
const baselineData = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

let testCount = 0;
let passedCount = 0;

function assertTest(testName, condition, details) {
  testCount++;
  if (condition) {
    passedCount++;
    console.log(`  [PASS] Test ${testCount}: ${testName}`);
  } else {
    console.error(`  [FAIL] Test ${testCount}: ${testName}`);
    if (details) console.error(`         Details: ${details}`);
  }
}

console.log("================================================================================");
console.log("🧪 RUNNING SCADA-2.0 MASTER DATA TEST SUITE (POSITIVE & NEGATIVE CHECKS)");
console.log("================================================================================");

// Test 1: Baseline Master Data Passes

const baselineResult = validateData(baselineData, true);
assertTest(
  "Baseline factory master data passes with 0 errors",
  baselineResult.isValid && baselineResult.errors.length === 0,
  baselineResult.errors.join("; ")
);
assertTest(
  "Contains exact required 11 machines",
  baselineResult.totalMachines === 11,
  `Got: ${baselineResult.totalMachines}`
);
assertTest(
  "All 11 machines have valid sensors configured (107 total)",
  baselineResult.totalSensors === 107,
  `Got: ${baselineResult.totalSensors}`
);

// Test 2: Duplicate Sensor Type Detection (Prompt requirement)

const dupSensorData = deepClone(baselineData);
const m07 = dupSensorData.machines.find((m) => m.id === "M07");
m07.sensors.push({
  sensorId: "SEN_M07_TMP_DUP",
  machineId: "M07",
  sensorType: "temperature_sensor",
  unit: "°C",
  samplingIntervalSec: 2,
  description: "Duplicate temperature sensor",
});
const dupSensorResult = validateData(dupSensorData, true);
const hasExpectedDupSensorMsg = dupSensorResult.errors.some((err) =>
  err.includes("Machine M07 contains duplicate sensor: temperature_sensor")
);
assertTest(
  "Rejects duplicate sensor type with exact prompt error format",
  !dupSensorResult.isValid && hasExpectedDupSensorMsg,
  `Errors: ${dupSensorResult.errors.join("; ")}`
);

// Test 3: Duplicate Machine ID Detection

const dupMachineData = deepClone(baselineData);
dupMachineData.machines[1].id = "M01"; // Duplicate M01
const dupMachineResult = validateData(dupMachineData, true);
const hasDupMachineErr = dupMachineResult.errors.some((err) =>
  err.includes("Duplicate machine_id detected: 'M01'")
);
assertTest(
  "Rejects duplicate machine ID",
  !dupMachineResult.isValid && hasDupMachineErr,
  `Errors: ${dupMachineResult.errors.join("; ")}`
);

// Test 4: Invalid Zone Foreign Key Detection

const invalidZoneData = deepClone(baselineData);
invalidZoneData.machines[0].zoneId = "Z99_UNKNOWN_ZONE";
const invalidZoneResult = validateData(invalidZoneData, true);
const hasInvalidZoneErr = invalidZoneResult.errors.some((err) =>
  err.includes("belongs to invalid or unregistered zone 'Z99_UNKNOWN_ZONE'")
);
assertTest(
  "Rejects machine assigned to unregistered factory zone",
  !invalidZoneResult.isValid && hasInvalidZoneErr,
  `Errors: ${invalidZoneResult.errors.join("; ")}`
);

// Test 5: Negative RPM Detection

const negRpmData = deepClone(baselineData);
negRpmData.machines.find((m) => m.id === "M10").mechanical.rpm = -1500;
const negRpmResult = validateData(negRpmData, true);
const hasNegRpmErr = negRpmResult.errors.some((err) =>
  err.includes("rpm cannot be negative")
);
assertTest(
  "Rejects negative RPM values",
  !negRpmResult.isValid && hasNegRpmErr,
  `Errors: ${negRpmResult.errors.join("; ")}`
);

// Test 6: Nullable RPM Accepted for Non-Rotary Equipment

const m01Rpm = baselineData.machines.find((m) => m.id === "M01").mechanical.rpm;
const m03Rpm = baselineData.machines.find((m) => m.id === "M03").mechanical.rpm;
const m07Rpm = baselineData.machines.find((m) => m.id === "M07").mechanical.rpm;
assertTest(
  "Preserves nullable RPM on non-rotational machines (M01, M03, M07)",
  m01Rpm === null && m03Rpm === null && m07Rpm === null,
  `M01: ${m01Rpm}, M03: ${m03Rpm}, M07: ${m07Rpm}`
);

// Test 7: Invalid Power Factor Detection

const invalidPfData = deepClone(baselineData);
invalidPfData.machines[0].electrical.powerFactor = 1.35; // Physical impossibility
const invalidPfResult = validateData(invalidPfData, true);
const hasPfErr = invalidPfResult.errors.some((err) =>
  err.includes("powerFactor must be between 0 and 1")
);
assertTest(
  "Rejects physically impossible power factor (> 1.0)",
  !invalidPfResult.isValid && hasPfErr,
  `Errors: ${invalidPfResult.errors.join("; ")}`
);

// Test 8: Unsupported Sensor Type Detection

const unsupportedSensorData = deepClone(baselineData);
unsupportedSensorData.machines[0].sensors[0].sensorType = "quantum_flux_detector";
const unsupportedSensorResult = validateData(unsupportedSensorData, true);
const hasUnsupportedSensorErr = unsupportedSensorResult.errors.some((err) =>
  err.includes("uses unsupported sensorType 'quantum_flux_detector'")
);
assertTest(
  "Rejects unsupported sensor type outside defined 18 types",
  !unsupportedSensorResult.isValid && hasUnsupportedSensorErr,
  `Errors: ${unsupportedSensorResult.errors.join("; ")}`
);

console.log("--------------------------------------------------------------------------------");
console.log(`🏁 TEST RESULTS: ${passedCount} / ${testCount} tests passed.`);
if (passedCount === testCount) {
  console.log("🎉 ALL TESTS PASSED WITH 100% SUCCESS!\n");
} else {
  console.error("❌ SOME TESTS FAILED.\n");
  process.exit(1);
}
