"""
SCADA 2.0
Master Data Python Accessor & Validator
Phase 1: Factory & Machine Master Data

Allows Python simulation (Phase 3), data pipeline (Phase 4),
analytics (Phase 7), and ML models (Phases 8 & 9) to consume the exact
same validated single source of truth without code duplication.
"""

import json
from pathlib import Path
from typing import Dict, Any, List, Optional

MASTER_DATA_PATH = Path(__file__).resolve().parent / "factory_master_data.json"

SUPPORTED_SENSOR_TYPES = {
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
}


def load_master_data() -> Dict[str, Any]:
    """Loads the parsed factory master data snapshot."""
    if not MASTER_DATA_PATH.exists():
        raise FileNotFoundError(f"Master data file not found at {MASTER_DATA_PATH}")
    with open(MASTER_DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def get_factory_info() -> Dict[str, Any]:
    """Returns factory-level metadata."""
    return load_master_data()["factory"]


def get_zones() -> Dict[str, Any]:
    """Returns all factory zones."""
    return load_master_data()["zones"]


def get_all_machines() -> List[Dict[str, Any]]:
    """Returns all 11 configured machine master records."""
    return load_master_data()["machines"]


def get_machine(machine_id: str) -> Optional[Dict[str, Any]]:
    """Finds a machine by ID (e.g. 'M01')."""
    for machine in get_all_machines():
        if machine.get("id") == machine_id:
            return machine
    return None


def get_sensors_for_machine(machine_id: str) -> List[Dict[str, Any]]:
    """Returns the sensor configuration list for a specific machine."""
    m = get_machine(machine_id)
    return m.get("sensors", []) if m else []


def get_all_sensors() -> List[Dict[str, Any]]:
    """Returns a flat list of all sensors across the entire plant."""
    sensors = []
    for m in get_all_machines():
        sensors.extend(m.get("sensors", []))
    return sensors


def validate() -> bool:
    """Performs full integrity and constraint checks on master data."""
    data = load_master_data()
    factory = data.get("factory", {})
    zones = data.get("zones", {})
    machines = data.get("machines", [])

    errors = []
    seen_machine_ids = set()
    seen_sensor_ids = set()

    for m in machines:
        m_id = m.get("id")
        if not m_id:
            errors.append("Machine missing 'id'")
            continue
        if m_id in seen_machine_ids:
            errors.append(f"Duplicate machine ID: {m_id}")
        seen_machine_ids.add(m_id)

        if not m.get("name"):
            errors.append(f"Machine {m_id} missing name")
        if not m.get("function"):
            errors.append(f"Machine {m_id} missing functional description")
        if m.get("zoneId") not in zones:
            errors.append(f"Machine {m_id} references invalid zone {m.get('zoneId')}")

        elec = m.get("electrical", {})
        if elec.get("ratedVoltage", 0) <= 0:
            errors.append(f"Machine {m_id} ratedVoltage <= 0")
        if elec.get("ratedPower", 0) <= 0:
            errors.append(f"Machine {m_id} ratedPower <= 0")
        if elec.get("ratedCurrent", 0) <= 0:
            errors.append(f"Machine {m_id} ratedCurrent <= 0")
        pf = elec.get("powerFactor", 0)
        if not (0 < pf <= 1.0):
            errors.append(f"Machine {m_id} powerFactor {pf} not in (0, 1]")

        mech = m.get("mechanical", {})
        rpm = mech.get("rpm")
        if rpm is not None and rpm < 0:
            errors.append(f"Machine {m_id} negative RPM {rpm}")

        op = m.get("operation", {})
        if op.get("ageYears", 0) < 0:
            errors.append(f"Machine {m_id} negative ageYears")
        if op.get("operatingHours", 0) < 0:
            errors.append(f"Machine {m_id} negative operatingHours")

        machine_sensor_types = set()
        for s in m.get("sensors", []):
            s_id = s.get("sensorId")
            if not s_id or s_id in seen_sensor_ids:
                errors.append(f"Duplicate/empty sensor ID {s_id}")
            seen_sensor_ids.add(s_id)

            st = s.get("sensorType")
            if st not in SUPPORTED_SENSOR_TYPES:
                errors.append(f"Machine {m_id} unsupported sensorType {st}")
            if st in machine_sensor_types:
                errors.append(f"Machine {m_id} contains duplicate sensor: {st}")
            machine_sensor_types.add(st)

    if errors:
        print(f"[FAIL] Validation failed with {len(errors)} error(s):")
        for e in errors:
            print(f"   - {e}")
        return False

    print(f"[SUCCESS] Python validation passed for {len(machines)} machines & {len(seen_sensor_ids)} sensors.")
    return True


if __name__ == "__main__":
    validate()
