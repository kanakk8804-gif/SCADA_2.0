/**
 * SCADA 2.0
 * Master Factory Information and Operational Zones
 * Phase 1: Factory & Machine Master Data
 */

import { FactoryInfo, FactoryZone } from "./types";

/**
 * Single source of truth for plant-level metadata
 */
export const FACTORY_INFO: FactoryInfo = {
  factoryId: "FACT-01",
  name: "Precision Discrete & Electronics Manufacturing Plant",
  location: "Industrial Cyber-Physical Park, Sector 4",
  totalAreaSqm: 12000,
  gridPowerCapacityKw: 500,
  backupGeneratorCapacityKw: 250,
  nominalGridVoltage: 400,
  gridFrequencyHz: 50,
  description:
    "Integrated SME smart manufacturing facility featuring sheet metal fabrication, precision surface coating, cleanroom SMT electronics assembly, and central plant utilities.",
};

/**
 * Factory operational zones catalog
 * All machines must be mapped to one of these valid zones.
 */
export const FACTORY_ZONES: Record<string, FactoryZone> = {
  Z01_FABRICATION: {
    zoneId: "Z01_FABRICATION",
    name: "Sheet Metal Fabrication & Welding",
    code: "FAB",
    floorLevel: "Ground Floor - Bay A",
    areaSqm: 3200,
    description:
      "Heavy fabrication zone housing laser cutting, CNC bending, and robotic/manual welding stations.",
  },
  Z02_COATING: {
    zoneId: "Z02_COATING",
    name: "Surface Treatment & Powder Coating",
    code: "COAT",
    floorLevel: "Ground Floor - Bay B",
    areaSqm: 1800,
    description:
      "Automated electrostatic powder spray booth with continuous convection curing oven and exhaust filtration.",
  },
  Z03_SMT_ASSEMBLY: {
    zoneId: "Z03_SMT_ASSEMBLY",
    name: "SMT Electronics Assembly Clean Line",
    code: "SMT",
    floorLevel: "First Floor - Cleanroom Class 10,000",
    areaSqm: 2500,
    description:
      "Climate and ESD-controlled high-speed surface-mount PCB printing, component placement, and reflow/wave soldering line.",
  },
  Z04_TESTING_QA: {
    zoneId: "Z04_TESTING_QA",
    name: "Testing, Reliability & Burn-in QA",
    code: "TEST",
    floorLevel: "First Floor - Bay C",
    areaSqm: 1200,
    description:
      "Quality assurance and reliability laboratory equipped with environmental stress screening, thermal burn-in, and electrical testing chambers.",
  },
  Z05_UTILITIES: {
    zoneId: "Z05_UTILITIES",
    name: "Central Compressed Air & Pneumatics Utility",
    code: "UTIL",
    floorLevel: "Utility Yard - Ground Level",
    areaSqm: 800,
    description:
      "Central utility building generating 7.5-bar clean compressed air and process drying for the entire plant.",
  },
  Z06_HVAC_FACILITIES: {
    zoneId: "Z06_HVAC_FACILITIES",
    name: "Cleanroom Climate Control & Facility HVAC",
    code: "HVAC",
    floorLevel: "Mezzanine Level Plant Room",
    areaSqm: 1500,
    description:
      "High-efficiency air handling units (AHU), HEPA filtration stages, and variable air volume systems maintaining cleanroom pressurization and temperature.",
  },
};
