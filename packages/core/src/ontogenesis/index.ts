/**
 * Ontogenesis - Self-Evolving Kernel System
 * 
 * This module implements ontogenetic evolution for computational kernels,
 * enabling self-generation, self-optimization, and population-based evolution
 * using B-Series expansion as genetic code.
 * 
 * @module ontogenesis
 */

// Core types
export type {
  DomainType,
  OntogeneticStage,
  GeneType,
  DifferentialOperatorType,
  ElementaryDifferential,
  DifferentialOperator,
  KernelGene,
  KernelGenome,
  OntogeneticState,
  DevelopmentEvent,
  GripMetric,
  Kernel,
  ReproductionMethod,
  ReproductionOptions,
  EvolutionConfig,
  OntogenesisConfig,
  DevelopmentSchedule,
  GenerationStats,
  EvolutionResult,
  OptimizationOptions,
  Objective,
  MultiObjectiveConfig,
  ParetoFront,
} from './types';

// B-Series and elementary differentials
export {
  getElementaryDifferentialCount,
  generateElementaryDifferentials,
  generateDefaultCoefficients,
  applyBSeries,
  createBSeriesExecutor,
} from './b-series';

// Kernel creation and management
export {
  createKernel,
  initializeOntogeneticKernel,
  cloneKernel,
  createKernelGenome,
  createOntogeneticState,
} from './kernel';

// Grip metrics
export {
  calculateGrip,
  updateGrip,
  calculateGeneticDistance,
  calculatePopulationDiversity,
} from './grip';

// Self-evolution methods
export {
  selfGenerate,
  selfOptimize,
  selfReproduce,
  updateDevelopmentStage,
} from './evolution';

// Population evolution
export {
  runOntogenesis,
  multiObjectiveEvolution,
} from './population';

// Universal kernel generator
export { UniversalKernelGenerator } from './generator';
