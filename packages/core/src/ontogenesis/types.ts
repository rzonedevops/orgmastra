/**
 * Core types for ontogenetic evolution system
 * 
 * This module defines the foundational types for implementing self-evolving
 * computational kernels and agents based on B-Series expansion as genetic code.
 */

/**
 * Domain type for kernel specialization
 */
export type DomainType = 
  | 'physics'        // Hamiltonian trees, energy conservation
  | 'chemistry'      // Reaction trees, mass conservation
  | 'biology'        // Metabolic trees, homeostasis
  | 'computing'      // Recursion trees, Church-Rosser property
  | 'consciousness'  // Echo trees, self-reference
  | 'general';       // Generic computational kernel

/**
 * Ontogenetic development stage
 */
export type OntogeneticStage = 
  | 'embryonic'   // Just generated, basic structure
  | 'juvenile'    // Developing, optimizing
  | 'mature'      // Fully developed, reproduction capable
  | 'senescent';  // Declining, ready for replacement

/**
 * Gene type in kernel genome
 */
export type GeneType = 
  | 'coefficient'  // B-series coefficient
  | 'operator'     // Differential operator
  | 'symmetry'     // Symmetry preservation rule
  | 'preservation'; // Conservation law

/**
 * Differential operator type
 */
export type DifferentialOperatorType = 
  | 'chain'    // (f∘g)' = f'(g) · g'
  | 'product'  // (f·g)' = f'·g + f·g'
  | 'quotient' // (f/g)' = (f'·g - f·g')/g²
  | 'sum';     // (f+g)' = f' + g'

/**
 * Elementary differential represented as rooted tree
 */
export interface ElementaryDifferential {
  /** Unique identifier */
  id: string;
  /** Order of the differential (number of nodes) */
  order: number;
  /** Tree structure as adjacency list */
  tree: number[][];
  /** Symmetry factor */
  symmetry: number;
  /** Domain-specific meaning */
  interpretation?: string;
}

/**
 * Differential operator definition
 */
export interface DifferentialOperator {
  /** Type of differential operator */
  type: DifferentialOperatorType;
  /** Application function */
  apply: (kernel1: Kernel, kernel2?: Kernel) => Kernel;
  /** Domain compatibility check */
  compatible?: (domain1: DomainType, domain2?: DomainType) => boolean;
}

/**
 * Gene in kernel genome
 */
export interface KernelGene {
  /** Gene type */
  type: GeneType;
  /** Gene value (coefficient, operator reference, etc.) */
  value: any;
  /** Whether this gene can mutate */
  mutable: boolean;
  /** Domain context */
  domain: DomainType;
  /** Optional metadata */
  metadata?: Record<string, any>;
}

/**
 * Kernel genome - the "DNA" of computational kernels
 */
export interface KernelGenome {
  /** Unique identifier */
  id: string;
  /** Generation number (0 for seed kernels) */
  generation: number;
  /** Parent kernel IDs */
  lineage: string[];
  /** Genetic information */
  genes: KernelGene[];
  /** Overall fitness score (0-1) */
  fitness: number;
  /** Age in generations */
  age: number;
  /** B-Series coefficients (genetic code) */
  bSeriesCoefficients: number[];
  /** Differential operators */
  differentialOperators: DifferentialOperator[];
  /** Domain specialization */
  domain: DomainType;
  /** Creation timestamp */
  createdAt: Date;
  /** Last modified timestamp */
  updatedAt: Date;
}

/**
 * Ontogenetic state tracking development
 */
export interface OntogeneticState {
  /** Current development stage */
  stage: OntogeneticStage;
  /** Development progress (0-1) */
  maturity: number;
  /** Accumulated interactions/evaluations */
  experience: number;
  /** History of development events */
  developmentEvents: DevelopmentEvent[];
  /** Metadata for tracking state transitions */
  metadata?: Record<string, any>;
}

/**
 * Development event in ontogenetic history
 */
export interface DevelopmentEvent {
  /** Event type */
  type: 'generation' | 'optimization' | 'reproduction' | 'mutation' | 'stage_transition';
  /** Event timestamp */
  timestamp: Date;
  /** Fitness before event */
  fitnessBefore: number;
  /** Fitness after event */
  fitnessAfter: number;
  /** Event details */
  details: Record<string, any>;
}

/**
 * Grip metric - measure of domain fit
 */
export interface GripMetric {
  /** How well kernel touches domain (0-1) */
  contact: number;
  /** Completeness of domain coverage (0-1) */
  coverage: number;
  /** Computational efficiency (0-1) */
  efficiency: number;
  /** Numerical stability (0-1) */
  stability: number;
  /** Overall grip score */
  overall: number;
}

/**
 * Computational kernel
 */
export interface Kernel {
  /** Kernel genome */
  genome: KernelGenome;
  /** Ontogenetic state */
  ontogeneticState: OntogeneticState;
  /** Grip metric */
  grip: GripMetric;
  /** Kernel execution function */
  execute: (input: any) => any;
  /** Metadata */
  metadata?: Record<string, any>;
}

/**
 * Reproduction method
 */
export type ReproductionMethod = 
  | 'crossover'  // Single-point genetic crossover
  | 'mutation'   // Random perturbation
  | 'cloning';   // Direct copy with optional mutations

/**
 * Reproduction options
 */
export interface ReproductionOptions {
  /** Reproduction method */
  method: ReproductionMethod;
  /** Mutation rate (0-1) */
  mutationRate?: number;
  /** Crossover point (0-1) */
  crossoverPoint?: number;
  /** Whether to inherit average fitness */
  inheritFitness?: boolean;
}

/**
 * Evolution configuration
 */
export interface EvolutionConfig {
  /** Population size */
  populationSize: number;
  /** Mutation rate (0-1) */
  mutationRate: number;
  /** Crossover rate (0-1) */
  crossoverRate: number;
  /** Elite preservation rate (0-1) */
  elitismRate: number;
  /** Maximum generations */
  maxGenerations: number;
  /** Fitness threshold for early stopping */
  fitnessThreshold?: number;
  /** Diversity pressure (0-1) */
  diversityPressure?: number;
  /** Novelty weight in fitness (0-1) */
  noveltyWeight?: number;
}

/**
 * Ontogenesis configuration
 */
export interface OntogenesisConfig {
  /** Evolution parameters */
  evolution: EvolutionConfig;
  /** Seed kernels to start population */
  seedKernels?: Kernel[];
  /** Fitness evaluation function */
  fitnessFunction: (kernel: Kernel, population?: Kernel[]) => number | Promise<number>;
  /** Optional development schedule */
  developmentSchedule?: DevelopmentSchedule;
}

/**
 * Development schedule for stage transitions
 */
export interface DevelopmentSchedule {
  /** Duration in generations for embryonic stage */
  embryonicDuration: number;
  /** Duration in generations for juvenile stage */
  juvenileDuration: number;
  /** Duration in generations for mature stage */
  matureDuration: number;
  /** Fitness threshold for maturity */
  maturityThreshold: number;
  /** Maximum age before senescence */
  senescenceAge: number;
}

/**
 * Generation statistics
 */
export interface GenerationStats {
  /** Generation number */
  generation: number;
  /** Population size */
  populationSize: number;
  /** Best fitness in generation */
  bestFitness: number;
  /** Average fitness in generation */
  averageFitness: number;
  /** Worst fitness in generation */
  worstFitness: number;
  /** Genetic diversity measure */
  diversity: number;
  /** Number of new kernels created */
  newKernels: number;
  /** Number of optimizations performed */
  optimizations: number;
  /** Timestamp */
  timestamp: Date;
}

/**
 * Evolution result
 */
export interface EvolutionResult {
  /** All generation statistics */
  generations: GenerationStats[];
  /** Final population */
  finalPopulation: Kernel[];
  /** Best kernel overall */
  bestKernel: Kernel;
  /** Whether evolution converged */
  converged: boolean;
  /** Total generations run */
  totalGenerations: number;
}

/**
 * Optimization options
 */
export interface OptimizationOptions {
  /** Number of optimization iterations */
  iterations: number;
  /** Learning rate for gradient ascent */
  learningRate?: number;
  /** Fitness threshold for early stopping */
  fitnessThreshold?: number;
  /** Whether to use adaptive learning rate */
  adaptiveLearningRate?: boolean;
}

/**
 * Multi-objective optimization objective
 */
export interface Objective {
  /** Objective name */
  name: string;
  /** Weight in combined fitness (0-1) */
  weight: number;
  /** Whether to minimize (true) or maximize (false) */
  minimize: boolean;
  /** Evaluation function */
  evaluate: (kernel: Kernel) => number | Promise<number>;
}

/**
 * Multi-objective optimization config
 */
export interface MultiObjectiveConfig {
  /** List of objectives to optimize */
  objectives: Objective[];
  /** Evolution configuration */
  evolution: EvolutionConfig;
  /** Seed kernels */
  seedKernels?: Kernel[];
}

/**
 * Pareto front result
 */
export interface ParetoFront {
  /** Non-dominated kernels */
  solutions: Kernel[];
  /** Objective values for each solution */
  objectiveValues: number[][];
  /** Generation statistics */
  generations: GenerationStats[];
}
