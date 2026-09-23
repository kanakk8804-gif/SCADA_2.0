/**
 * SCADA-2.0 - Central Machine Master Data & Telemetry
 * Single Source of Truth derived from Phase 1 Master Data (M01 - M11)
 */

import { factoryLayoutConfig } from "./layoutConfig.js";

export const machineData = {
  "CNC Fibre Laser Cutting": {
    id: "M01",
    code: "M01",
    name: "CNC Fibre Laser Cutting Machine",
    shortLabel: "CNC Laser Cutting",
    zoneId: "Z01_FABRICATION",
    category: "Sheet Metal Fabrication & Welding",
    status: "NORMAL",
    color: "#00ff66",
    manufacturer: "Bystronic Laser AG",
    model: "ByStar Fiber 3015 (4kW)",
    description: "The machine cuts sheet metal plates into precise geometric profiles using a high-energy focused fibre laser beam and assist gas (O2/N2).",
    electrical: {"ratedVoltage":400,"ratedPower":25,"ratedCurrent":40.1,"powerFactor":0.9,"phases":3,"frequencyHz":50,"isCombinedRating":true,"ratingNotes":"Combined rating representing 10 kW laser resonator, 9 kW closed-loop chiller, and 6 kW CNC axis servos & exhaust blower."},
    mechanical: {"rpm":null,"rpmNotes":"Not applicable. Machine kinematics are driven by linear direct-drive servo motors along X/Y/Z axes."},
    operation: {"installationYear":2021,"ageYears":5,"operatingHours":14250,"maintenanceIntervalHours":2000},
    sensors: [{"sensorId":"SEN_M01_VLT","machineId":"M01","sensorType":"voltage_sensor","unit":"V","samplingIntervalSec":1,"description":"3-phase mains incoming line-to-line voltage","hardwareChannel":"MODBUS_REG_30001"},{"sensorId":"SEN_M01_CUR","machineId":"M01","sensorType":"current_sensor","unit":"A","samplingIntervalSec":1,"description":"True RMS total incoming current","hardwareChannel":"MODBUS_REG_30002"},{"sensorId":"SEN_M01_PWR","machineId":"M01","sensorType":"power_meter","unit":"kW","samplingIntervalSec":1,"description":"Instantaneous active electrical power drawn by the laser system","hardwareChannel":"MODBUS_REG_30003"},{"sensorId":"SEN_M01_ENG","machineId":"M01","sensorType":"energy_meter","unit":"kWh","samplingIntervalSec":60,"description":"Cumulative active electrical energy consumed","hardwareChannel":"MODBUS_REG_30004"},{"sensorId":"SEN_M01_TMP","machineId":"M01","sensorType":"temperature_sensor","unit":"°C","samplingIntervalSec":5,"description":"Laser cutting optical head and chiller return water temperature","hardwareChannel":"MODBUS_REG_30010"},{"sensorId":"SEN_M01_GAS","machineId":"M01","sensorType":"gas_flow_sensor","unit":"L/min","samplingIntervalSec":2,"description":"Cutting assist gas volumetric flow rate (Nitrogen/Oxygen)","hardwareChannel":"MODBUS_REG_30012"},{"sensorId":"SEN_M01_PRS","machineId":"M01","sensorType":"pressure_sensor","unit":"bar","samplingIntervalSec":2,"description":"Assist gas delivery pressure at the cutting head nozzle","hardwareChannel":"MODBUS_REG_30014"},{"sensorId":"SEN_M01_STA","machineId":"M01","sensorType":"machine_status_sensor","unit":"status","samplingIntervalSec":1,"description":"Operating status (Cutting, Piercing, Rapid Traversing, Standby, Alarm)","hardwareChannel":"MODBUS_COIL_00001"},{"sensorId":"SEN_M01_CNT","machineId":"M01","sensorType":"production_counter","unit":"count","samplingIntervalSec":5,"description":"Total cut components and sheet completion counter","hardwareChannel":"MODBUS_REG_30020"},{"sensorId":"SEN_M01_ACS","machineId":"M01","sensorType":"acoustic_sensor","unit":"dB","samplingIntervalSec":1,"description":"Acoustic emission intensity for nozzle blowout and pierce detection","hardwareChannel":"ESP32_ADC_CH0"}],
    position: factoryLayoutConfig.machines["M01"].position,
    size: factoryLayoutConfig.machines["M01"].size,
    rotation: factoryLayoutConfig.machines["M01"].rotation,
    modelType: factoryLayoutConfig.machines["M01"].modelType,
    safetyZone: factoryLayoutConfig.machines["M01"].safetyZone,
    current: 25.4,
    power: 16.5,
    temperature: 46.3,
    vibration: 2.1,
    history: { current: [], power: [], temperature: [], vibration: [] },
    pinouts: [
      {
            "pin": "M01_VLT",
            "name": "3-phase mains incoming line-to-line voltage",
            "value": "400.0 V"
      },
      {
            "pin": "M01_CUR",
            "name": "True RMS total incoming current",
            "value": "25.4 A"
      },
      {
            "pin": "M01_PWR",
            "name": "Instantaneous active electrical power drawn by the laser system",
            "value": "16.5 kW"
      },
      {
            "pin": "M01_ENG",
            "name": "Cumulative active electrical energy consumed",
            "value": "12113 kWh"
      },
      {
            "pin": "M01_TMP",
            "name": "Laser cutting optical head and chiller return water temperature",
            "value": "46.3 °C"
      },
      {
            "pin": "M01_GAS",
            "name": "Cutting assist gas volumetric flow rate (Nitrogen/Oxygen)",
            "value": "1 (NORMAL)"
      },
      {
            "pin": "M01_PRS",
            "name": "Assist gas delivery pressure at the cutting head nozzle",
            "value": "7.50 bar"
      },
      {
            "pin": "M01_STA",
            "name": "Operating status (Cutting, Piercing, Rapid Traversing, Standby, Alarm)",
            "value": "1 (NORMAL)"
      },
      {
            "pin": "M01_CNT",
            "name": "Total cut components and sheet completion counter",
            "value": "1 (NORMAL)"
      },
      {
            "pin": "M01_ACS",
            "name": "Acoustic emission intensity for nozzle blowout and pierce detection",
            "value": "1 (NORMAL)"
      }
],
    alerts: []
  },
  "Hydraulic Press Brake": {
    id: "M02",
    code: "M02",
    name: "Hydraulic Press Brake",
    shortLabel: "Hydraulic Press Brake",
    zoneId: "Z01_FABRICATION",
    category: "Sheet Metal Fabrication & Welding",
    status: "NORMAL",
    color: "#00ff66",
    manufacturer: "Amada Co., Ltd.",
    model: "HFE3i-1003 (100 Ton / 3m)",
    description: "The machine bends sheet metal and plate workpieces into programmed angular profiles and channels using a high-tonnage hydraulic ram and precision V-dies.",
    electrical: {"ratedVoltage":400,"ratedPower":11,"ratedCurrent":18.7,"powerFactor":0.85,"phases":3,"frequencyHz":50,"isCombinedRating":false,"ratingNotes":"Primary AC induction motor powering the hydraulic axial piston pump and CNC backgauge servos."},
    mechanical: {"rpm":1450,"rpmNotes":"Nominal rotational speed of the main 4-pole hydraulic pump induction drive motor."},
    operation: {"installationYear":2022,"ageYears":4,"operatingHours":9850,"maintenanceIntervalHours":1500},
    sensors: [{"sensorId":"SEN_M02_VLT","machineId":"M02","sensorType":"voltage_sensor","unit":"V","samplingIntervalSec":1,"description":"Supply bus line voltage","hardwareChannel":"ADC_CH0_VOLT"},{"sensorId":"SEN_M02_CUR","machineId":"M02","sensorType":"current_sensor","unit":"A","samplingIntervalSec":1,"description":"Hydraulic pump motor current via external CT clamp","hardwareChannel":"ADC_CH1_CT"},{"sensorId":"SEN_M02_PWR","machineId":"M02","sensorType":"power_meter","unit":"kW","samplingIntervalSec":1,"description":"Active power drawn during bending stroke","hardwareChannel":"ENERGY_IC_SPI"},{"sensorId":"SEN_M02_ENG","machineId":"M02","sensorType":"energy_meter","unit":"kWh","samplingIntervalSec":60,"description":"Cumulative energy consumed","hardwareChannel":"ENERGY_IC_ACCUM"},{"sensorId":"SEN_M02_PRS","machineId":"M02","sensorType":"pressure_sensor","unit":"bar","samplingIntervalSec":1,"description":"Main hydraulic cylinder manifold hydraulic fluid pressure","hardwareChannel":"ADC_CH2_PRESSURE"},{"sensorId":"SEN_M02_TMP","machineId":"M02","sensorType":"temperature_sensor","unit":"°C","samplingIntervalSec":10,"description":"Hydraulic oil reservoir fluid temperature","hardwareChannel":"ONEWIRE_DS18B20"},{"sensorId":"SEN_M02_VIB","machineId":"M02","sensorType":"vibration_sensor","unit":"mm/s","samplingIntervalSec":2,"description":"Hydraulic pump and motor housing vibration (RMS velocity)","hardwareChannel":"I2C_MPU6050"},{"sensorId":"SEN_M02_RPM","machineId":"M02","sensorType":"rpm_sensor","unit":"RPM","samplingIntervalSec":2,"description":"Pump motor drive shaft speed via inductive proximity pulse counter","hardwareChannel":"GPIO_PULSE_IN"},{"sensorId":"SEN_M02_STA","machineId":"M02","sensorType":"machine_status_sensor","unit":"status","samplingIntervalSec":1,"description":"Ram operational cycle (Fast Approach, Bending, Decompression, Return, Idle)","hardwareChannel":"GPIO_OPT_IN"},{"sensorId":"SEN_M02_CNT","machineId":"M02","sensorType":"production_counter","unit":"count","samplingIntervalSec":5,"description":"Completed bend stroke cycle count","hardwareChannel":"CYCLE_COUNTER_INT"}],
    position: factoryLayoutConfig.machines["M02"].position,
    size: factoryLayoutConfig.machines["M02"].size,
    rotation: factoryLayoutConfig.machines["M02"].rotation,
    modelType: factoryLayoutConfig.machines["M02"].modelType,
    safetyZone: factoryLayoutConfig.machines["M02"].safetyZone,
    current: 18.7,
    power: 11,
    temperature: 52.1,
    vibration: 3.4,
    history: { current: [], power: [], temperature: [], vibration: [] },
    pinouts: [
      {
            "pin": "M02_VLT",
            "name": "Supply bus line voltage",
            "value": "400.0 V"
      },
      {
            "pin": "M02_CUR",
            "name": "Hydraulic pump motor current via external CT clamp",
            "value": "18.7 A"
      },
      {
            "pin": "M02_PWR",
            "name": "Active power drawn during bending stroke",
            "value": "11 kW"
      },
      {
            "pin": "M02_ENG",
            "name": "Cumulative energy consumed",
            "value": "8373 kWh"
      },
      {
            "pin": "M02_PRS",
            "name": "Main hydraulic cylinder manifold hydraulic fluid pressure",
            "value": "7.50 bar"
      },
      {
            "pin": "M02_TMP",
            "name": "Hydraulic oil reservoir fluid temperature",
            "value": "52.1 °C"
      },
      {
            "pin": "M02_VIB",
            "name": "Hydraulic pump and motor housing vibration (RMS velocity)",
            "value": "3.4 mm/s"
      },
      {
            "pin": "M02_RPM",
            "name": "Pump motor drive shaft speed via inductive proximity pulse counter",
            "value": "1450 RPM"
      },
      {
            "pin": "M02_STA",
            "name": "Ram operational cycle (Fast Approach, Bending, Decompression, Return, Idle)",
            "value": "1 (NORMAL)"
      },
      {
            "pin": "M02_CNT",
            "name": "Completed bend stroke cycle count",
            "value": "1 (NORMAL)"
      }
],
    alerts: []
  },
  "Spot + TIG/MIG Welding Station": {
    id: "M03",
    code: "M03",
    name: "Spot and TIG/MIG Welding Station",
    shortLabel: "Spot + TIG/MIG Welding",
    zoneId: "Z01_FABRICATION",
    category: "Sheet Metal Fabrication & Welding",
    status: "NORMAL",
    color: "#00ff66",
    manufacturer: "Fronius International / KUKA",
    model: "TPS 400i Pulse + SpotCell 50",
    description: "The station joins fabricated structural sheet metal assemblies through pneumatic resistance spot welding and precision TIG/MIG arc welding.",
    electrical: {"ratedVoltage":400,"ratedPower":18.5,"ratedCurrent":30.3,"powerFactor":0.88,"phases":3,"frequencyHz":50,"isCombinedRating":true,"ratingNotes":"Combined rating representing 15 kW inverter welding power supply and 3.5 kW pneumatic spot clamping gun and auxiliary wire feeder."},
    mechanical: {"rpm":null,"rpmNotes":"Not applicable. Equipment consists of stationary power source and articulating multi-axis robotic welding arm."},
    operation: {"installationYear":2023,"ageYears":3,"operatingHours":7120,"maintenanceIntervalHours":1000},
    sensors: [{"sensorId":"SEN_M03_VLT","machineId":"M03","sensorType":"voltage_sensor","unit":"V","samplingIntervalSec":1,"description":"Inverter mains incoming 3-phase voltage","hardwareChannel":"MODBUS_REG_30101"},{"sensorId":"SEN_M03_CUR","machineId":"M03","sensorType":"current_sensor","unit":"A","samplingIntervalSec":1,"description":"Primary inverter drawn current","hardwareChannel":"MODBUS_REG_30102"},{"sensorId":"SEN_M03_PWR","machineId":"M03","sensorType":"power_meter","unit":"kW","samplingIntervalSec":1,"description":"Active electrical power consumed during arc discharge and spot firing","hardwareChannel":"MODBUS_REG_30103"},{"sensorId":"SEN_M03_ENG","machineId":"M03","sensorType":"energy_meter","unit":"kWh","samplingIntervalSec":60,"description":"Cumulative electrical welding energy","hardwareChannel":"MODBUS_REG_30104"},{"sensorId":"SEN_M03_TMP","machineId":"M03","sensorType":"temperature_sensor","unit":"°C","samplingIntervalSec":5,"description":"Welding torch liquid cooling block return temperature","hardwareChannel":"MODBUS_REG_30105"},{"sensorId":"SEN_M03_GAS","machineId":"M03","sensorType":"gas_flow_sensor","unit":"L/min","samplingIntervalSec":2,"description":"Argon / CO2 shielding gas delivery flow rate","hardwareChannel":"MODBUS_REG_30106"},{"sensorId":"SEN_M03_ACS","machineId":"M03","sensorType":"acoustic_sensor","unit":"dB","samplingIntervalSec":1,"description":"Arc acoustic emission level for weld spatter and stability analysis","hardwareChannel":"ADC_CH0_MIC"},{"sensorId":"SEN_M03_STA","machineId":"M03","sensorType":"machine_status_sensor","unit":"status","samplingIntervalSec":1,"description":"Welder operating status (Arc Active, Wire Feeding, Idle, Fault)","hardwareChannel":"MODBUS_COIL_00010"},{"sensorId":"SEN_M03_CNT","machineId":"M03","sensorType":"production_counter","unit":"count","samplingIntervalSec":5,"description":"Total completed weld seams and spot-weld cycle counter","hardwareChannel":"MODBUS_REG_30108"}],
    position: factoryLayoutConfig.machines["M03"].position,
    size: factoryLayoutConfig.machines["M03"].size,
    rotation: factoryLayoutConfig.machines["M03"].rotation,
    modelType: factoryLayoutConfig.machines["M03"].modelType,
    safetyZone: factoryLayoutConfig.machines["M03"].safetyZone,
    current: 22.1,
    power: 14.2,
    temperature: 42.5,
    vibration: 1.6,
    history: { current: [], power: [], temperature: [], vibration: [] },
    pinouts: [
      {
            "pin": "M03_VLT",
            "name": "Inverter mains incoming 3-phase voltage",
            "value": "400.0 V"
      },
      {
            "pin": "M03_CUR",
            "name": "Primary inverter drawn current",
            "value": "22.1 A"
      },
      {
            "pin": "M03_PWR",
            "name": "Active electrical power consumed during arc discharge and spot firing",
            "value": "14.2 kW"
      },
      {
            "pin": "M03_ENG",
            "name": "Cumulative electrical welding energy",
            "value": "6052 kWh"
      },
      {
            "pin": "M03_TMP",
            "name": "Welding torch liquid cooling block return temperature",
            "value": "42.5 °C"
      },
      {
            "pin": "M03_GAS",
            "name": "Argon / CO2 shielding gas delivery flow rate",
            "value": "1 (NORMAL)"
      },
      {
            "pin": "M03_ACS",
            "name": "Arc acoustic emission level for weld spatter and stability analysis",
            "value": "1 (NORMAL)"
      },
      {
            "pin": "M03_STA",
            "name": "Welder operating status (Arc Active, Wire Feeding, Idle, Fault)",
            "value": "1 (NORMAL)"
      },
      {
            "pin": "M03_CNT",
            "name": "Total completed weld seams and spot-weld cycle counter",
            "value": "1 (NORMAL)"
      }
],
    alerts: []
  },
  "Power Coating Booth": {
    id: "M04",
    code: "M04",
    name: "Powder Coating Booth and Curing Oven",
    shortLabel: "Power Coating Booth",
    zoneId: "Z02_COATING",
    category: "Surface Treatment & Powder Coating",
    status: "NORMAL",
    color: "#00ff66",
    manufacturer: "Gema Switzerland / Eisenmann",
    model: "MagicCompact + ThermJet 60",
    description: "The system electrostatically applies polymer powder onto metal enclosures in a spray booth followed by continuous convection thermal curing in a hot-air oven.",
    electrical: {"ratedVoltage":400,"ratedPower":45,"ratedCurrent":68.4,"powerFactor":0.95,"phases":3,"frequencyHz":50,"isCombinedRating":true,"ratingNotes":"Combined rating representing 35 kW resistance convection oven heating elements and 10 kW booth exhaust blowers, electrostatic guns, and powder fluidization pumps."},
    mechanical: {"rpm":2880,"rpmNotes":"Rotational speed of the heavy-duty centrifugal exhaust recirculation blower motor."},
    operation: {"installationYear":2020,"ageYears":6,"operatingHours":18640,"maintenanceIntervalHours":2500},
    sensors: [{"sensorId":"SEN_M04_VLT","machineId":"M04","sensorType":"voltage_sensor","unit":"V","samplingIntervalSec":1,"description":"Main feeder bus voltage","hardwareChannel":"MODBUS_REG_30201"},{"sensorId":"SEN_M04_CUR","machineId":"M04","sensorType":"current_sensor","unit":"A","samplingIntervalSec":1,"description":"Combined total line current drawn by heaters and blowers","hardwareChannel":"MODBUS_REG_30202"},{"sensorId":"SEN_M04_PWR","machineId":"M04","sensorType":"power_meter","unit":"kW","samplingIntervalSec":1,"description":"Total active electric power","hardwareChannel":"MODBUS_REG_30203"},{"sensorId":"SEN_M04_ENG","machineId":"M04","sensorType":"energy_meter","unit":"kWh","samplingIntervalSec":60,"description":"Cumulative energy consumed","hardwareChannel":"MODBUS_REG_30204"},{"sensorId":"SEN_M04_TMP","machineId":"M04","sensorType":"temperature_sensor","unit":"°C","samplingIntervalSec":5,"description":"Curing oven central zone thermal profile temperature","hardwareChannel":"MODBUS_REG_30205"},{"sensorId":"SEN_M04_AIR","machineId":"M04","sensorType":"airflow_sensor","unit":"m/s","samplingIntervalSec":5,"description":"Exhaust duct air velocity maintaining negative booth pressure","hardwareChannel":"MODBUS_REG_30206"},{"sensorId":"SEN_M04_PRS","machineId":"M04","sensorType":"differential_pressure_sensor","unit":"Pa","samplingIntervalSec":5,"description":"Cyclone recovery cartridge filter differential pressure","hardwareChannel":"MODBUS_REG_30207"},{"sensorId":"SEN_M04_PRT","machineId":"M04","sensorType":"particulate_sensor","unit":"mg/m³","samplingIntervalSec":5,"description":"Exhaust stack fugitive powder particulate concentration","hardwareChannel":"MODBUS_REG_30208"},{"sensorId":"SEN_M04_RPM","machineId":"M04","sensorType":"rpm_sensor","unit":"RPM","samplingIntervalSec":5,"description":"Exhaust recirculation blower fan motor rotational speed","hardwareChannel":"MODBUS_REG_30209"},{"sensorId":"SEN_M04_STA","machineId":"M04","sensorType":"machine_status_sensor","unit":"status","samplingIntervalSec":1,"description":"Coating line state (Pre-heating, Spraying, Curing, Purge, Cooldown)","hardwareChannel":"MODBUS_COIL_00020"}],
    position: factoryLayoutConfig.machines["M04"].position,
    size: factoryLayoutConfig.machines["M04"].size,
    rotation: factoryLayoutConfig.machines["M04"].rotation,
    modelType: factoryLayoutConfig.machines["M04"].modelType,
    safetyZone: factoryLayoutConfig.machines["M04"].safetyZone,
    current: 48.2,
    power: 32,
    temperature: 68.2,
    vibration: 2.8,
    history: { current: [], power: [], temperature: [], vibration: [] },
    pinouts: [
      {
            "pin": "M04_VLT",
            "name": "Main feeder bus voltage",
            "value": "400.0 V"
      },
      {
            "pin": "M04_CUR",
            "name": "Combined total line current drawn by heaters and blowers",
            "value": "48.2 A"
      },
      {
            "pin": "M04_PWR",
            "name": "Total active electric power",
            "value": "32 kW"
      },
      {
            "pin": "M04_ENG",
            "name": "Cumulative energy consumed",
            "value": "15844 kWh"
      },
      {
            "pin": "M04_TMP",
            "name": "Curing oven central zone thermal profile temperature",
            "value": "68.2 °C"
      },
      {
            "pin": "M04_AIR",
            "name": "Exhaust duct air velocity maintaining negative booth pressure",
            "value": "1 (NORMAL)"
      },
      {
            "pin": "M04_PRS",
            "name": "Cyclone recovery cartridge filter differential pressure",
            "value": "1 (NORMAL)"
      },
      {
            "pin": "M04_PRT",
            "name": "Exhaust stack fugitive powder particulate concentration",
            "value": "1 (NORMAL)"
      },
      {
            "pin": "M04_RPM",
            "name": "Exhaust recirculation blower fan motor rotational speed",
            "value": "2880 RPM"
      },
      {
            "pin": "M04_STA",
            "name": "Coating line state (Pre-heating, Spraying, Curing, Purge, Cooldown)",
            "value": "1 (NORMAL)"
      }
],
    alerts: []
  },
  "Solder Paste Stencil Printer": {
    id: "M05",
    code: "M05",
    name: "Solder Paste Stencil Printer",
    shortLabel: "Stencil Printer",
    zoneId: "Z03_SMT_ASSEMBLY",
    category: "SMT Electronics Assembly Clean Line",
    status: "NORMAL",
    color: "#00ff66",
    manufacturer: "ASM Assembly Systems",
    model: "DEK NeoHorizon 03iX",
    description: "The machine deposits calibrated deposits of solder paste onto surface mount PCB pads through laser-cut stainless steel stencils using dual squeegee blades.",
    electrical: {"ratedVoltage":230,"ratedPower":1.5,"ratedCurrent":7.1,"powerFactor":0.92,"phases":1,"frequencyHz":50,"isCombinedRating":false,"ratingNotes":"Single-phase precision motion system powering optical alignment vision cameras, squeegee drives, and vacuum stencil wipe."},
    mechanical: {"rpm":null,"rpmNotes":"Not applicable. Squeegee motion and board transport operate via linear precision lead screws and belt actuators."},
    operation: {"installationYear":2024,"ageYears":2,"operatingHours":4320,"maintenanceIntervalHours":1000},
    sensors: [{"sensorId":"SEN_M05_VLT","machineId":"M05","sensorType":"voltage_sensor","unit":"V","samplingIntervalSec":2,"description":"Single-phase supply voltage","hardwareChannel":"ADC_CH0_VOLT"},{"sensorId":"SEN_M05_CUR","machineId":"M05","sensorType":"current_sensor","unit":"A","samplingIntervalSec":2,"description":"Operating current","hardwareChannel":"ADC_CH1_CURR"},{"sensorId":"SEN_M05_PWR","machineId":"M05","sensorType":"power_meter","unit":"kW","samplingIntervalSec":2,"description":"Active power drawn during print and wipe cycles","hardwareChannel":"ENERGY_IC_SPI"},{"sensorId":"SEN_M05_ENG","machineId":"M05","sensorType":"energy_meter","unit":"kWh","samplingIntervalSec":60,"description":"Cumulative energy consumed","hardwareChannel":"ENERGY_IC_ACCUM"},{"sensorId":"SEN_M05_TMP","machineId":"M05","sensorType":"temperature_sensor","unit":"°C","samplingIntervalSec":10,"description":"Internal chamber paste reservoir temperature","hardwareChannel":"I2C_SHT31_TEMP"},{"sensorId":"SEN_M05_HUM","machineId":"M05","sensorType":"humidity_sensor","unit":"%RH","samplingIntervalSec":10,"description":"Internal chamber relative humidity (critical for paste viscosity)","hardwareChannel":"I2C_SHT31_HUM"},{"sensorId":"SEN_M05_PRS","machineId":"M05","sensorType":"pressure_sensor","unit":"bar","samplingIntervalSec":2,"description":"Pneumatic squeegee down-force actuator air pressure","hardwareChannel":"ADC_CH2_PRS"},{"sensorId":"SEN_M05_DOR","machineId":"M05","sensorType":"door_status_sensor","unit":"status","samplingIntervalSec":1,"description":"Safety hood interlock switch status","hardwareChannel":"GPIO_DOOR_SW"},{"sensorId":"SEN_M05_STA","machineId":"M05","sensorType":"machine_status_sensor","unit":"status","samplingIntervalSec":1,"description":"Cycle state (Aligning, Printing, Cleaning Stencil, Idle, Error)","hardwareChannel":"GPIO_STATE_BITS"},{"sensorId":"SEN_M05_CNT","machineId":"M05","sensorType":"production_counter","unit":"count","samplingIntervalSec":5,"description":"Total printed circuit board counter","hardwareChannel":"SMEMA_OUT_CNT"}],
    position: factoryLayoutConfig.machines["M05"].position,
    size: factoryLayoutConfig.machines["M05"].size,
    rotation: factoryLayoutConfig.machines["M05"].rotation,
    modelType: factoryLayoutConfig.machines["M05"].modelType,
    safetyZone: factoryLayoutConfig.machines["M05"].safetyZone,
    current: 5.8,
    power: 1.2,
    temperature: 28.6,
    vibration: 0.9,
    history: { current: [], power: [], temperature: [], vibration: [] },
    pinouts: [
      {
            "pin": "M05_VLT",
            "name": "Single-phase supply voltage",
            "value": "230.0 V"
      },
      {
            "pin": "M05_CUR",
            "name": "Operating current",
            "value": "5.8 A"
      },
      {
            "pin": "M05_PWR",
            "name": "Active power drawn during print and wipe cycles",
            "value": "1.2 kW"
      },
      {
            "pin": "M05_ENG",
            "name": "Cumulative energy consumed",
            "value": "3672 kWh"
      },
      {
            "pin": "M05_TMP",
            "name": "Internal chamber paste reservoir temperature",
            "value": "28.6 °C"
      },
      {
            "pin": "M05_HUM",
            "name": "Internal chamber relative humidity (critical for paste viscosity)",
            "value": "1 (NORMAL)"
      },
      {
            "pin": "M05_PRS",
            "name": "Pneumatic squeegee down-force actuator air pressure",
            "value": "7.50 bar"
      },
      {
            "pin": "M05_DOR",
            "name": "Safety hood interlock switch status",
            "value": "1 (NORMAL)"
      },
      {
            "pin": "M05_STA",
            "name": "Cycle state (Aligning, Printing, Cleaning Stencil, Idle, Error)",
            "value": "1 (NORMAL)"
      },
      {
            "pin": "M05_CNT",
            "name": "Total printed circuit board counter",
            "value": "1 (NORMAL)"
      }
],
    alerts: []
  },
  "SMT Pick and Place Machine": {
    id: "M06",
    code: "M06",
    name: "SMT Pick and Place Machine",
    shortLabel: "SMT Pick & Place",
    zoneId: "Z03_SMT_ASSEMBLY",
    category: "SMT Electronics Assembly Clean Line",
    status: "NORMAL",
    color: "#00ff66",
    manufacturer: "Yamaha Motor Co., Ltd.",
    model: "YSM20R Modular High-Speed Mounter",
    description: "The machine mounts electronic surface-mount components (chips, ICs, BGAs) onto solder-printed circuit boards at high speed using flying vacuum nozzles and optical alignment.",
    electrical: {"ratedVoltage":400,"ratedPower":4.5,"ratedCurrent":7.4,"powerFactor":0.88,"phases":3,"frequencyHz":50,"isCombinedRating":false,"ratingNotes":"High-performance linear motor dual gantries, rotary placement heads, vacuum generators, and smart tape feeder banks."},
    mechanical: {"rpm":null,"rpmNotes":"Not applicable. Machine uses linear direct-drive gantries; individual component theta orientation is servo indexed."},
    operation: {"installationYear":2023,"ageYears":3,"operatingHours":8910,"maintenanceIntervalHours":2000},
    sensors: [{"sensorId":"SEN_M06_VLT","machineId":"M06","sensorType":"voltage_sensor","unit":"V","samplingIntervalSec":1,"description":"3-phase supply line voltage","hardwareChannel":"MODBUS_REG_30301"},{"sensorId":"SEN_M06_CUR","machineId":"M06","sensorType":"current_sensor","unit":"A","samplingIntervalSec":1,"description":"Total mounter operating current","hardwareChannel":"MODBUS_REG_30302"},{"sensorId":"SEN_M06_PWR","machineId":"M06","sensorType":"power_meter","unit":"kW","samplingIntervalSec":1,"description":"Active power drawn by gantry linear motors and heads","hardwareChannel":"MODBUS_REG_30303"},{"sensorId":"SEN_M06_ENG","machineId":"M06","sensorType":"energy_meter","unit":"kWh","samplingIntervalSec":60,"description":"Cumulative electrical energy consumed","hardwareChannel":"MODBUS_REG_30304"},{"sensorId":"SEN_M06_PRS","machineId":"M06","sensorType":"pressure_sensor","unit":"bar","samplingIntervalSec":1,"description":"Placement head vacuum pickup manifold negative pressure","hardwareChannel":"MODBUS_REG_30305"},{"sensorId":"SEN_M06_TMP","machineId":"M06","sensorType":"temperature_sensor","unit":"°C","samplingIntervalSec":5,"description":"Gantry linear motor core and camera vision processor temperature","hardwareChannel":"MODBUS_REG_30306"},{"sensorId":"SEN_M06_VIB","machineId":"M06","sensorType":"vibration_sensor","unit":"mm/s","samplingIntervalSec":1,"description":"Gantry frame dynamic motion vibration level","hardwareChannel":"MODBUS_REG_30307"},{"sensorId":"SEN_M06_DOR","machineId":"M06","sensorType":"door_status_sensor","unit":"status","samplingIntervalSec":1,"description":"Safety shield front and rear interlock doors","hardwareChannel":"MODBUS_COIL_00030"},{"sensorId":"SEN_M06_STA","machineId":"M06","sensorType":"machine_status_sensor","unit":"status","samplingIntervalSec":1,"description":"Machine state (Placing, Vision Inspecting, Feeder Empty, Paused, Fault)","hardwareChannel":"MODBUS_COIL_00031"},{"sensorId":"SEN_M06_CNT","machineId":"M06","sensorType":"production_counter","unit":"count","samplingIntervalSec":5,"description":"Total component placements and finished board counter","hardwareChannel":"MODBUS_REG_30310"}],
    position: factoryLayoutConfig.machines["M06"].position,
    size: factoryLayoutConfig.machines["M06"].size,
    rotation: factoryLayoutConfig.machines["M06"].rotation,
    modelType: factoryLayoutConfig.machines["M06"].modelType,
    safetyZone: factoryLayoutConfig.machines["M06"].safetyZone,
    current: 6.8,
    power: 3.8,
    temperature: 36.4,
    vibration: 2.4,
    history: { current: [], power: [], temperature: [], vibration: [] },
    pinouts: [
      {
            "pin": "M06_VLT",
            "name": "3-phase supply line voltage",
            "value": "400.0 V"
      },
      {
            "pin": "M06_CUR",
            "name": "Total mounter operating current",
            "value": "6.8 A"
      },
      {
            "pin": "M06_PWR",
            "name": "Active power drawn by gantry linear motors and heads",
            "value": "3.8 kW"
      },
      {
            "pin": "M06_ENG",
            "name": "Cumulative electrical energy consumed",
            "value": "7574 kWh"
      },
      {
            "pin": "M06_PRS",
            "name": "Placement head vacuum pickup manifold negative pressure",
            "value": "7.50 bar"
      },
      {
            "pin": "M06_TMP",
            "name": "Gantry linear motor core and camera vision processor temperature",
            "value": "36.4 °C"
      },
      {
            "pin": "M06_VIB",
            "name": "Gantry frame dynamic motion vibration level",
            "value": "2.4 mm/s"
      },
      {
            "pin": "M06_DOR",
            "name": "Safety shield front and rear interlock doors",
            "value": "1 (NORMAL)"
      },
      {
            "pin": "M06_STA",
            "name": "Machine state (Placing, Vision Inspecting, Feeder Empty, Paused, Fault)",
            "value": "1 (NORMAL)"
      },
      {
            "pin": "M06_CNT",
            "name": "Total component placements and finished board counter",
            "value": "1 (NORMAL)"
      }
],
    alerts: []
  },
  "Multizone Reflow Soldering Oven": {
    id: "M07",
    code: "M07",
    name: "Multizone Reflow Soldering Oven",
    shortLabel: "Reflow Oven",
    zoneId: "Z03_SMT_ASSEMBLY",
    category: "SMT Electronics Assembly Clean Line",
    status: "WARNING",
    color: "#ffb700",
    manufacturer: "Heller Industries",
    model: "Heller 1913 MK5 (10 Heat / 3 Cool Zones)",
    description: "The machine passes component-populated circuit boards through 10 independently heated convection zones to melt solder paste and establish metallurgical joints under nitrogen.",
    electrical: {"ratedVoltage":400,"ratedPower":35,"ratedCurrent":52.6,"powerFactor":0.96,"phases":3,"frequencyHz":50,"isCombinedRating":true,"ratingNotes":"Combined rating: 30 kW electric convection heating elements across 10 zones and 5 kW recirculation blowers and conveyor drive."},
    mechanical: {"rpm":null,"rpmNotes":"Not applicable. PCB mesh conveyor transport speed is calibrated in cm/min rather than primary motor RPM."},
    operation: {"installationYear":2022,"ageYears":4,"operatingHours":11450,"maintenanceIntervalHours":2000},
    sensors: [{"sensorId":"SEN_M07_VLT","machineId":"M07","sensorType":"voltage_sensor","unit":"V","samplingIntervalSec":1,"description":"3-phase line supply voltage","hardwareChannel":"MODBUS_REG_30401"},{"sensorId":"SEN_M07_CUR","machineId":"M07","sensorType":"current_sensor","unit":"A","samplingIntervalSec":1,"description":"Total reflow oven current draw across all heating zones","hardwareChannel":"MODBUS_REG_30402"},{"sensorId":"SEN_M07_PWR","machineId":"M07","sensorType":"power_meter","unit":"kW","samplingIntervalSec":1,"description":"Active heating and convection power","hardwareChannel":"MODBUS_REG_30403"},{"sensorId":"SEN_M07_ENG","machineId":"M07","sensorType":"energy_meter","unit":"kWh","samplingIntervalSec":60,"description":"Cumulative electrical heating energy consumed","hardwareChannel":"MODBUS_REG_30404"},{"sensorId":"SEN_M07_TMP","machineId":"M07","sensorType":"temperature_sensor","unit":"°C","samplingIntervalSec":2,"description":"Peak reflow zone thermal profile internal temperature","hardwareChannel":"MODBUS_REG_30405"},{"sensorId":"SEN_M07_GAS","machineId":"M07","sensorType":"gas_flow_sensor","unit":"L/min","samplingIntervalSec":2,"description":"Nitrogen (N2) atmosphere purge and consumption rate","hardwareChannel":"MODBUS_REG_30406"},{"sensorId":"SEN_M07_AIR","machineId":"M07","sensorType":"airflow_sensor","unit":"m/s","samplingIntervalSec":5,"description":"Cooling zone convection air velocity","hardwareChannel":"MODBUS_REG_30407"},{"sensorId":"SEN_M07_STA","machineId":"M07","sensorType":"machine_status_sensor","unit":"status","samplingIntervalSec":1,"description":"Oven operating state (Pre-heating, Temperature Ready, Conveying, Standby, Cool-down)","hardwareChannel":"MODBUS_COIL_00040"},{"sensorId":"SEN_M07_CNT","machineId":"M07","sensorType":"production_counter","unit":"count","samplingIntervalSec":5,"description":"Soldered circuit boards exit counter","hardwareChannel":"MODBUS_REG_30410"}],
    position: factoryLayoutConfig.machines["M07"].position,
    size: factoryLayoutConfig.machines["M07"].size,
    rotation: factoryLayoutConfig.machines["M07"].rotation,
    modelType: factoryLayoutConfig.machines["M07"].modelType,
    safetyZone: factoryLayoutConfig.machines["M07"].safetyZone,
    current: 42.6,
    power: 28.4,
    temperature: 184.2,
    vibration: 1.6,
    history: { current: [], power: [], temperature: [], vibration: [] },
    pinouts: [
      {
            "pin": "M07_VLT",
            "name": "3-phase line supply voltage",
            "value": "400.0 V"
      },
      {
            "pin": "M07_CUR",
            "name": "Total reflow oven current draw across all heating zones",
            "value": "42.6 A"
      },
      {
            "pin": "M07_PWR",
            "name": "Active heating and convection power",
            "value": "28.4 kW"
      },
      {
            "pin": "M07_ENG",
            "name": "Cumulative electrical heating energy consumed",
            "value": "9733 kWh"
      },
      {
            "pin": "M07_TMP",
            "name": "Peak reflow zone thermal profile internal temperature",
            "value": "184.2 °C"
      },
      {
            "pin": "M07_GAS",
            "name": "Nitrogen (N2) atmosphere purge and consumption rate",
            "value": "1 (NORMAL)"
      },
      {
            "pin": "M07_AIR",
            "name": "Cooling zone convection air velocity",
            "value": "1 (NORMAL)"
      },
      {
            "pin": "M07_STA",
            "name": "Oven operating state (Pre-heating, Temperature Ready, Conveying, Standby, Cool-down)",
            "value": "1 (NORMAL)"
      },
      {
            "pin": "M07_CNT",
            "name": "Soldered circuit boards exit counter",
            "value": "1 (NORMAL)"
      }
],
    alerts: ["⚠️ WARNING: Zone 5 peak temperature elevated (184.2°C / threshold 180.0°C)"]
  },
  "Wave Soldering Machine": {
    id: "M08",
    code: "M08",
    name: "Wave Soldering Machine",
    shortLabel: "Wave Soldering",
    zoneId: "Z03_SMT_ASSEMBLY",
    category: "SMT Electronics Assembly Clean Line",
    status: "NORMAL",
    color: "#00ff66",
    manufacturer: "Electrovert (ITW EAE)",
    model: "Electra Wave 500",
    description: "The machine solders through-hole electronic components onto populated circuit boards by transporting boards over a liquid fluxer and a molten solder wave produced by an impeller pump.",
    electrical: {"ratedVoltage":400,"ratedPower":28,"ratedCurrent":43,"powerFactor":0.94,"phases":3,"frequencyHz":50,"isCombinedRating":true,"ratingNotes":"Combined rating representing 22 kW solder bath immersion heaters, 4 kW IR pre-heaters, and 2 kW solder wave pump motor."},
    mechanical: {"rpm":1200,"rpmNotes":"Nominal rotational speed of the solder pot impeller pump motor generating the laminar solder wave."},
    operation: {"installationYear":2021,"ageYears":5,"operatingHours":13520,"maintenanceIntervalHours":1500},
    sensors: [{"sensorId":"SEN_M08_VLT","machineId":"M08","sensorType":"voltage_sensor","unit":"V","samplingIntervalSec":1,"description":"3-phase incoming supply voltage","hardwareChannel":"MODBUS_REG_30501"},{"sensorId":"SEN_M08_CUR","machineId":"M08","sensorType":"current_sensor","unit":"A","samplingIntervalSec":1,"description":"Total wave soldering machine current","hardwareChannel":"MODBUS_REG_30502"},{"sensorId":"SEN_M08_PWR","machineId":"M08","sensorType":"power_meter","unit":"kW","samplingIntervalSec":1,"description":"Active electrical power drawn by heaters and pumps","hardwareChannel":"MODBUS_REG_30503"},{"sensorId":"SEN_M08_ENG","machineId":"M08","sensorType":"energy_meter","unit":"kWh","samplingIntervalSec":60,"description":"Cumulative active electrical energy consumed","hardwareChannel":"MODBUS_REG_30504"},{"sensorId":"SEN_M08_TMP","machineId":"M08","sensorType":"temperature_sensor","unit":"°C","samplingIntervalSec":2,"description":"Molten solder alloy bath bulk temperature","hardwareChannel":"MODBUS_REG_30505"},{"sensorId":"SEN_M08_FLO","machineId":"M08","sensorType":"flow_sensor","unit":"mL/min","samplingIntervalSec":5,"description":"Ultrasonic fluxer spray delivery liquid flow rate","hardwareChannel":"MODBUS_REG_30506"},{"sensorId":"SEN_M08_RPM","machineId":"M08","sensorType":"rpm_sensor","unit":"RPM","samplingIntervalSec":2,"description":"Solder wave impeller pump motor rotational speed","hardwareChannel":"MODBUS_REG_30507"},{"sensorId":"SEN_M08_STA","machineId":"M08","sensorType":"machine_status_sensor","unit":"status","samplingIntervalSec":1,"description":"Wave soldering state (Melting, Wave Running, Fluxing, Standby)","hardwareChannel":"MODBUS_COIL_00050"},{"sensorId":"SEN_M08_CNT","machineId":"M08","sensorType":"production_counter","unit":"count","samplingIntervalSec":5,"description":"Completed wave soldered PCB board counter","hardwareChannel":"MODBUS_REG_30510"}],
    position: factoryLayoutConfig.machines["M08"].position,
    size: factoryLayoutConfig.machines["M08"].size,
    rotation: factoryLayoutConfig.machines["M08"].rotation,
    modelType: factoryLayoutConfig.machines["M08"].modelType,
    safetyZone: factoryLayoutConfig.machines["M08"].safetyZone,
    current: 34.2,
    power: 22.5,
    temperature: 245,
    vibration: 2,
    history: { current: [], power: [], temperature: [], vibration: [] },
    pinouts: [
      {
            "pin": "M08_VLT",
            "name": "3-phase incoming supply voltage",
            "value": "400.0 V"
      },
      {
            "pin": "M08_CUR",
            "name": "Total wave soldering machine current",
            "value": "34.2 A"
      },
      {
            "pin": "M08_PWR",
            "name": "Active electrical power drawn by heaters and pumps",
            "value": "22.5 kW"
      },
      {
            "pin": "M08_ENG",
            "name": "Cumulative active electrical energy consumed",
            "value": "11492 kWh"
      },
      {
            "pin": "M08_TMP",
            "name": "Molten solder alloy bath bulk temperature",
            "value": "245 °C"
      },
      {
            "pin": "M08_FLO",
            "name": "Ultrasonic fluxer spray delivery liquid flow rate",
            "value": "1 (NORMAL)"
      },
      {
            "pin": "M08_RPM",
            "name": "Solder wave impeller pump motor rotational speed",
            "value": "1200 RPM"
      },
      {
            "pin": "M08_STA",
            "name": "Wave soldering state (Melting, Wave Running, Fluxing, Standby)",
            "value": "1 (NORMAL)"
      },
      {
            "pin": "M08_CNT",
            "name": "Completed wave soldered PCB board counter",
            "value": "1 (NORMAL)"
      }
],
    alerts: []
  },
  "Testing & Burn-in Chambers": {
    id: "M09",
    code: "M09",
    name: "Testing and Burn-in Chambers",
    shortLabel: "Testing Chambers",
    zoneId: "Z04_TESTING_QA",
    category: "Testing, Reliability & Burn-in QA",
    status: "NORMAL",
    color: "#00ff66",
    manufacturer: "Weiss Technik",
    model: "ClimeEvent C/600/70/3",
    description: "The chamber executes accelerated thermal stress screening, electrical functional testing, and long-term burn-in reliability qualification on completed electronic assemblies.",
    electrical: {"ratedVoltage":400,"ratedPower":16,"ratedCurrent":26.5,"powerFactor":0.87,"phases":3,"frequencyHz":50,"isCombinedRating":true,"ratingNotes":"Combined rating representing 10 kW refrigeration compressor motors, 4 kW electric heating elements, and 2 kW circulation blowers."},
    mechanical: {"rpm":null,"rpmNotes":"Not applicable. Machine consists of enclosed hermetic refrigeration loops and static test racks."},
    operation: {"installationYear":2024,"ageYears":2,"operatingHours":5210,"maintenanceIntervalHours":2000},
    sensors: [{"sensorId":"SEN_M09_VLT","machineId":"M09","sensorType":"voltage_sensor","unit":"V","samplingIntervalSec":1,"description":"3-phase chamber supply voltage","hardwareChannel":"MODBUS_REG_30601"},{"sensorId":"SEN_M09_CUR","machineId":"M09","sensorType":"current_sensor","unit":"A","samplingIntervalSec":1,"description":"Total test chamber operating current","hardwareChannel":"MODBUS_REG_30602"},{"sensorId":"SEN_M09_PWR","machineId":"M09","sensorType":"power_meter","unit":"kW","samplingIntervalSec":1,"description":"Active electrical power during thermal cycling","hardwareChannel":"MODBUS_REG_30603"},{"sensorId":"SEN_M09_ENG","machineId":"M09","sensorType":"energy_meter","unit":"kWh","samplingIntervalSec":60,"description":"Cumulative electrical energy consumed","hardwareChannel":"MODBUS_REG_30604"},{"sensorId":"SEN_M09_TMP","machineId":"M09","sensorType":"temperature_sensor","unit":"°C","samplingIntervalSec":2,"description":"Internal chamber test volume air temperature (-40°C to +125°C)","hardwareChannel":"MODBUS_REG_30605"},{"sensorId":"SEN_M09_HUM","machineId":"M09","sensorType":"humidity_sensor","unit":"%RH","samplingIntervalSec":5,"description":"Chamber interior relative humidity (10% to 98% RH)","hardwareChannel":"MODBUS_REG_30606"},{"sensorId":"SEN_M09_DOR","machineId":"M09","sensorType":"door_status_sensor","unit":"status","samplingIntervalSec":1,"description":"Chamber sealed door magnetic latch interlock switch","hardwareChannel":"MODBUS_COIL_00060"},{"sensorId":"SEN_M09_ACS","machineId":"M09","sensorType":"acoustic_sensor","unit":"dB","samplingIntervalSec":2,"description":"Refrigeration compressor acoustic signature for expansion valve monitoring","hardwareChannel":"ADC_CH0_MIC"},{"sensorId":"SEN_M09_STA","machineId":"M09","sensorType":"machine_status_sensor","unit":"status","samplingIntervalSec":1,"description":"Chamber cycle state (Ramping, Soaking, Burn-in Underway, Complete, Defrost)","hardwareChannel":"MODBUS_COIL_00061"}],
    position: factoryLayoutConfig.machines["M09"].position,
    size: factoryLayoutConfig.machines["M09"].size,
    rotation: factoryLayoutConfig.machines["M09"].rotation,
    modelType: factoryLayoutConfig.machines["M09"].modelType,
    safetyZone: factoryLayoutConfig.machines["M09"].safetyZone,
    current: 18.5,
    power: 11.2,
    temperature: 65,
    vibration: 0.8,
    history: { current: [], power: [], temperature: [], vibration: [] },
    pinouts: [
      {
            "pin": "M09_VLT",
            "name": "3-phase chamber supply voltage",
            "value": "400.0 V"
      },
      {
            "pin": "M09_CUR",
            "name": "Total test chamber operating current",
            "value": "18.5 A"
      },
      {
            "pin": "M09_PWR",
            "name": "Active electrical power during thermal cycling",
            "value": "11.2 kW"
      },
      {
            "pin": "M09_ENG",
            "name": "Cumulative electrical energy consumed",
            "value": "4429 kWh"
      },
      {
            "pin": "M09_TMP",
            "name": "Internal chamber test volume air temperature (-40°C to +125°C)",
            "value": "65 °C"
      },
      {
            "pin": "M09_HUM",
            "name": "Chamber interior relative humidity (10% to 98% RH)",
            "value": "1 (NORMAL)"
      },
      {
            "pin": "M09_DOR",
            "name": "Chamber sealed door magnetic latch interlock switch",
            "value": "1 (NORMAL)"
      },
      {
            "pin": "M09_ACS",
            "name": "Refrigeration compressor acoustic signature for expansion valve monitoring",
            "value": "1 (NORMAL)"
      },
      {
            "pin": "M09_STA",
            "name": "Chamber cycle state (Ramping, Soaking, Burn-in Underway, Complete, Defrost)",
            "value": "1 (NORMAL)"
      }
],
    alerts: []
  },
  "Rotary Screw Air Compressor": {
    id: "M10",
    code: "M10",
    name: "Rotary Screw Air Compressor + Refrigerated Air Dryer",
    shortLabel: "Air Compressor & Dryer",
    zoneId: "Z05_UTILITIES",
    category: "Central Compressed Air Utility",
    status: "CRITICAL",
    color: "#ff0055",
    manufacturer: "Atlas Copco",
    model: "GA 37+ VSD with FD 90 Dryer",
    description: "The integrated plant generates centralized 7.5-bar clean, oil-free compressed air for pneumatic automation across the factory, paired with a refrigerated dryer for moisture removal.",
    electrical: {"ratedVoltage":400,"ratedPower":42,"ratedCurrent":68.1,"powerFactor":0.89,"phases":3,"frequencyHz":50,"isCombinedRating":true,"ratingNotes":"Combined rating: 37 kW variable-speed drive rotary screw compressor motor and 5 kW refrigerated air dryer refrigeration circuit and cooling fan."},
    mechanical: {"rpm":3000,"rpmNotes":"Maximum rated shaft speed of the permanent-magnet drive motor coupled to the rotary screw element."},
    operation: {"installationYear":2020,"ageYears":6,"operatingHours":26420,"maintenanceIntervalHours":4000},
    sensors: [{"sensorId":"SEN_M10_VLT","machineId":"M10","sensorType":"voltage_sensor","unit":"V","samplingIntervalSec":1,"description":"3-phase incoming distribution voltage","hardwareChannel":"MODBUS_REG_30701"},{"sensorId":"SEN_M10_CUR","machineId":"M10","sensorType":"current_sensor","unit":"A","samplingIntervalSec":1,"description":"Combined compressor drive and dryer current","hardwareChannel":"MODBUS_REG_30702"},{"sensorId":"SEN_M10_PWR","machineId":"M10","sensorType":"power_meter","unit":"kW","samplingIntervalSec":1,"description":"Active power consumption of compressor package","hardwareChannel":"MODBUS_REG_30703"},{"sensorId":"SEN_M10_ENG","machineId":"M10","sensorType":"energy_meter","unit":"kWh","samplingIntervalSec":60,"description":"Cumulative energy consumed","hardwareChannel":"MODBUS_REG_30704"},{"sensorId":"SEN_M10_PRS","machineId":"M10","sensorType":"pressure_sensor","unit":"bar","samplingIntervalSec":1,"description":"Central compressed air discharge receiver pressure","hardwareChannel":"MODBUS_REG_30705"},{"sensorId":"SEN_M10_FLO","machineId":"M10","sensorType":"flow_sensor","unit":"m³/min","samplingIntervalSec":2,"description":"Discharged compressed air volumetric flow rate","hardwareChannel":"MODBUS_REG_30706"},{"sensorId":"SEN_M10_TMP","machineId":"M10","sensorType":"temperature_sensor","unit":"°C","samplingIntervalSec":2,"description":"Screw element air-oil mixture discharge temperature","hardwareChannel":"MODBUS_REG_30707"},{"sensorId":"SEN_M10_VIB","machineId":"M10","sensorType":"vibration_sensor","unit":"mm/s","samplingIntervalSec":1,"description":"Air-end drive shaft bearing vibration level","hardwareChannel":"MODBUS_REG_30708"},{"sensorId":"SEN_M10_RPM","machineId":"M10","sensorType":"rpm_sensor","unit":"RPM","samplingIntervalSec":1,"description":"Variable-speed compressor drive motor rotational speed","hardwareChannel":"MODBUS_REG_30709"},{"sensorId":"SEN_M10_STA","machineId":"M10","sensorType":"machine_status_sensor","unit":"status","samplingIntervalSec":1,"description":"Compressor state (Loaded, Unloaded, Modulation, Standby, Alarm)","hardwareChannel":"MODBUS_COIL_00070"}],
    position: factoryLayoutConfig.machines["M10"].position,
    size: factoryLayoutConfig.machines["M10"].size,
    rotation: factoryLayoutConfig.machines["M10"].rotation,
    modelType: factoryLayoutConfig.machines["M10"].modelType,
    safetyZone: factoryLayoutConfig.machines["M10"].safetyZone,
    current: 54.2,
    power: 35.8,
    temperature: 78.4,
    vibration: 6.2,
    history: { current: [], power: [], temperature: [], vibration: [] },
    pinouts: [
      {
            "pin": "M10_VLT",
            "name": "3-phase incoming distribution voltage",
            "value": "400.0 V"
      },
      {
            "pin": "M10_CUR",
            "name": "Combined compressor drive and dryer current",
            "value": "54.2 A"
      },
      {
            "pin": "M10_PWR",
            "name": "Active power consumption of compressor package",
            "value": "35.8 kW"
      },
      {
            "pin": "M10_ENG",
            "name": "Cumulative energy consumed",
            "value": "22457 kWh"
      },
      {
            "pin": "M10_PRS",
            "name": "Central compressed air discharge receiver pressure",
            "value": "7.50 bar"
      },
      {
            "pin": "M10_FLO",
            "name": "Discharged compressed air volumetric flow rate",
            "value": "1 (NORMAL)"
      },
      {
            "pin": "M10_TMP",
            "name": "Screw element air-oil mixture discharge temperature",
            "value": "78.4 °C"
      },
      {
            "pin": "M10_VIB",
            "name": "Air-end drive shaft bearing vibration level",
            "value": "6.2 mm/s"
      },
      {
            "pin": "M10_RPM",
            "name": "Variable-speed compressor drive motor rotational speed",
            "value": "3000 RPM"
      },
      {
            "pin": "M10_STA",
            "name": "Compressor state (Loaded, Unloaded, Modulation, Standby, Alarm)",
            "value": "1 (NORMAL)"
      }
],
    alerts: ["🔴 CRITICAL ALARM: Main bearing temperature critical (78.4°C / threshold 70°C)","🔴 CRITICAL ALARM: Mechanical vibration spike detected (6.2 mm/s / threshold 4.5 mm/s)"]
  },
  "Cleanroom HVAC": {
    id: "M11",
    code: "M11",
    name: "Clean Room HVAC System",
    shortLabel: "Clean Room HVAC",
    zoneId: "Z06_HVAC_FACILITIES",
    category: "Cleanroom Climate Control & Facility HVAC",
    status: "NORMAL",
    color: "#00ff66",
    manufacturer: "Daikin Applied / Carrier",
    model: "CleanAir AHU-5000 with VAV Inverter",
    description: "The HVAC system conditions and circulates cleanroom air, regulating temperature, positive room pressure, HEPA filtration, and humidity for SMT assembly.",
    electrical: {"ratedVoltage":400,"ratedPower":55,"ratedCurrent":92.3,"powerFactor":0.86,"phases":3,"frequencyHz":50,"isCombinedRating":true,"ratingNotes":"Combined facility rating: 22 kW supply air plug fan, 15 kW return fan, and 18 kW chilled water circulation and condenser package."},
    mechanical: {"rpm":1480,"rpmNotes":"Nominal rotational speed of the main 4-pole supply air centrifugal blower fan motor."},
    operation: {"installationYear":2021,"ageYears":5,"operatingHours":32180,"maintenanceIntervalHours":4000},
    sensors: [{"sensorId":"SEN_M11_VLT","machineId":"M11","sensorType":"voltage_sensor","unit":"V","samplingIntervalSec":1,"description":"3-phase main distribution voltage","hardwareChannel":"MODBUS_REG_30801"},{"sensorId":"SEN_M11_CUR","machineId":"M11","sensorType":"current_sensor","unit":"A","samplingIntervalSec":1,"description":"Combined HVAC system supply current","hardwareChannel":"MODBUS_REG_30802"},{"sensorId":"SEN_M11_PWR","machineId":"M11","sensorType":"power_meter","unit":"kW","samplingIntervalSec":1,"description":"Total active power drawn by AHU blowers and chiller package","hardwareChannel":"MODBUS_REG_30803"},{"sensorId":"SEN_M11_ENG","machineId":"M11","sensorType":"energy_meter","unit":"kWh","samplingIntervalSec":60,"description":"Cumulative electrical HVAC energy consumed","hardwareChannel":"MODBUS_REG_30804"},{"sensorId":"SEN_M11_TMP","machineId":"M11","sensorType":"temperature_sensor","unit":"°C","samplingIntervalSec":5,"description":"Cleanroom conditioned supply air temperature (Set: 21.0°C ± 1°C)","hardwareChannel":"MODBUS_REG_30805"},{"sensorId":"SEN_M11_HUM","machineId":"M11","sensorType":"humidity_sensor","unit":"%RH","samplingIntervalSec":5,"description":"Cleanroom relative humidity (Set: 45% ± 5% RH)","hardwareChannel":"MODBUS_REG_30806"},{"sensorId":"SEN_M11_AIR","machineId":"M11","sensorType":"airflow_sensor","unit":"m³/h","samplingIntervalSec":5,"description":"Supply duct total air volumetric flow rate","hardwareChannel":"MODBUS_REG_30807"},{"sensorId":"SEN_M11_PRS","machineId":"M11","sensorType":"differential_pressure_sensor","unit":"Pa","samplingIntervalSec":2,"description":"Cleanroom room-to-corridor positive differential pressure (Set: +25 Pa)","hardwareChannel":"MODBUS_REG_30808"},{"sensorId":"SEN_M11_PRT","machineId":"M11","sensorType":"particulate_sensor","unit":"count/m³","samplingIntervalSec":10,"description":"Cleanroom airborne particle counter (0.5µm ISO 7 compliance)","hardwareChannel":"MODBUS_REG_30809"},{"sensorId":"SEN_M11_RPM","machineId":"M11","sensorType":"rpm_sensor","unit":"RPM","samplingIntervalSec":2,"description":"Supply air centrifugal blower fan motor rotational speed","hardwareChannel":"MODBUS_REG_30810"},{"sensorId":"SEN_M11_STA","machineId":"M11","sensorType":"machine_status_sensor","unit":"status","samplingIntervalSec":1,"description":"HVAC mode (Full Recirculation, Economizer, Purge, Reduced Night Setback)","hardwareChannel":"MODBUS_COIL_00080"}],
    position: factoryLayoutConfig.machines["M11"].position,
    size: factoryLayoutConfig.machines["M11"].size,
    rotation: factoryLayoutConfig.machines["M11"].rotation,
    modelType: factoryLayoutConfig.machines["M11"].modelType,
    safetyZone: factoryLayoutConfig.machines["M11"].safetyZone,
    current: 68.4,
    power: 42,
    temperature: 21.8,
    vibration: 1.4,
    history: { current: [], power: [], temperature: [], vibration: [] },
    pinouts: [
      {
            "pin": "M11_VLT",
            "name": "3-phase main distribution voltage",
            "value": "400.0 V"
      },
      {
            "pin": "M11_CUR",
            "name": "Combined HVAC system supply current",
            "value": "68.4 A"
      },
      {
            "pin": "M11_PWR",
            "name": "Total active power drawn by AHU blowers and chiller package",
            "value": "42 kW"
      },
      {
            "pin": "M11_ENG",
            "name": "Cumulative electrical HVAC energy consumed",
            "value": "27353 kWh"
      },
      {
            "pin": "M11_TMP",
            "name": "Cleanroom conditioned supply air temperature (Set: 21.0°C ± 1°C)",
            "value": "21.8 °C"
      },
      {
            "pin": "M11_HUM",
            "name": "Cleanroom relative humidity (Set: 45% ± 5% RH)",
            "value": "1 (NORMAL)"
      },
      {
            "pin": "M11_AIR",
            "name": "Supply duct total air volumetric flow rate",
            "value": "1 (NORMAL)"
      },
      {
            "pin": "M11_PRS",
            "name": "Cleanroom room-to-corridor positive differential pressure (Set: +25 Pa)",
            "value": "1 (NORMAL)"
      },
      {
            "pin": "M11_PRT",
            "name": "Cleanroom airborne particle counter (0.5µm ISO 7 compliance)",
            "value": "1 (NORMAL)"
      },
      {
            "pin": "M11_RPM",
            "name": "Supply air centrifugal blower fan motor rotational speed",
            "value": "1480 RPM"
      },
      {
            "pin": "M11_STA",
            "name": "HVAC mode (Full Recirculation, Economizer, Purge, Reduced Night Setback)",
            "value": "1 (NORMAL)"
      }
],
    alerts: []
  },
};

// Initialize telemetry history arrays (15 initial points for smooth sparklines)

Object.values(machineData).forEach(m => {
  for (let i = 0; i < 15; i++) {
    const factor = 1 + (Math.random() * 0.06 - 0.03);
    m.history.current.push(Number((m.current * factor).toFixed(1)));
    m.history.power.push(Number((m.power * factor).toFixed(1)));
    m.history.temperature.push(Number((m.temperature * factor).toFixed(1)));
    m.history.vibration.push(Number((m.vibration * factor).toFixed(1)));
  }
});
