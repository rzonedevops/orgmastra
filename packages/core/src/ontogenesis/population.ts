/**
 * Population evolution engine
 * 
 * Implements multi-generation evolution with tournament selection,
 * elite preservation, and diversity pressure.
 */

import type {
  Kernel,
  OntogenesisConfig,
  EvolutionResult,
  GenerationStats,
  EvolutionConfig,
} from './types';
import { calculateGrip, calculatePopulationDiversity } from './grip';
import { selfReproduce, updateDevelopmentStage } from './evolution';
import { initializeOntogeneticKernel } from './kernel';

/**
 * Run multi-generation ontogenesis
 * 
 * @param config - Ontogenesis configuration
 * @returns Evolution result with all generation statistics
 */
export async function runOntogenesis(config: OntogenesisConfig): Promise<EvolutionResult> {
  const { evolution, seedKernels = [], fitnessFunction, developmentSchedule } = config;
  
  // Initialize population
  let population = await initializePopulation(seedKernels, evolution);
  
  // Evaluate initial fitness
  population = await evaluatePopulation(population, fitnessFunction);
  
  const generations: GenerationStats[] = [];
  let converged = false;
  
  for (let gen = 0; gen < evolution.maxGenerations; gen++) {
    // Record generation statistics
    const stats = calculateGenerationStats(population, gen);
    generations.push(stats);
    
    // Check convergence
    if (evolution.fitnessThreshold && stats.bestFitness >= evolution.fitnessThreshold) {
      converged = true;
      break;
    }
    
    // Evolve to next generation
    population = await evolveGeneration(population, evolution, fitnessFunction);
    
    // Update development stages
    if (developmentSchedule) {
      population = population.map(k => {
        k.genome.age += 1;
        return updateDevelopmentStage(k, developmentSchedule);
      });
    }
  }
  
  // Find best kernel
  const bestKernel = population.reduce((best, current) => 
    current.genome.fitness > best.genome.fitness ? current : best
  );
  
  return {
    generations,
    finalPopulation: population,
    bestKernel,
    converged,
    totalGenerations: generations.length,
  };
}

/**
 * Initialize population with seed kernels or generate new ones
 */
async function initializePopulation(
  seedKernels: Kernel[],
  config: EvolutionConfig
): Promise<Kernel[]> {
  const population: Kernel[] = [];
  
  // Add seed kernels
  population.push(...seedKernels);
  
  // Generate additional kernels if needed
  const needed = config.populationSize - population.length;
  for (let i = 0; i < needed; i++) {
    // Generate random kernel
    const domain = ['physics', 'chemistry', 'biology', 'computing', 'consciousness', 'general'][
      Math.floor(Math.random() * 6)
    ] as any;
    const order = 3 + Math.floor(Math.random() * 3); // Order 3-5
    
    const kernel = initializeOntogeneticKernel(domain, order);
    population.push(kernel);
  }
  
  return population;
}

/**
 * Evaluate fitness for entire population
 */
async function evaluatePopulation(
  population: Kernel[],
  fitnessFunction: (kernel: Kernel, population?: Kernel[]) => number | Promise<number>
): Promise<Kernel[]> {
  // Evaluate each kernel
  const evaluated = await Promise.all(
    population.map(async (kernel) => {
      const fitness = await fitnessFunction(kernel, population);
      kernel.genome.fitness = fitness;
      return kernel;
    })
  );
  
  return evaluated;
}

/**
 * Evolve population to next generation
 */
async function evolveGeneration(
  population: Kernel[],
  config: EvolutionConfig,
  fitnessFunction: (kernel: Kernel, population?: Kernel[]) => number | Promise<number>
): Promise<Kernel[]> {
  const newPopulation: Kernel[] = [];
  
  // Elite preservation
  const eliteCount = Math.floor(population.length * config.elitismRate);
  const elites = [...population]
    .sort((a, b) => b.genome.fitness - a.genome.fitness)
    .slice(0, eliteCount);
  
  newPopulation.push(...elites);
  
  // Generate offspring to fill population
  while (newPopulation.length < config.populationSize) {
    // Tournament selection for parents
    const parent1 = tournamentSelect(population, 3);
    const parent2 = tournamentSelect(population, 3);
    
    let offspring: Kernel;
    
    // Apply crossover or mutation
    if (Math.random() < config.crossoverRate) {
      offspring = selfReproduce(parent1, parent2, {
        method: 'crossover',
        mutationRate: config.mutationRate,
        crossoverPoint: Math.random(),
      });
    } else {
      offspring = selfReproduce(parent1, parent1, {
        method: 'mutation',
        mutationRate: config.mutationRate,
      });
    }
    
    newPopulation.push(offspring);
  }
  
  // Evaluate new population
  const evaluated = await evaluatePopulation(newPopulation, fitnessFunction);
  
  // Apply diversity pressure if configured
  if (config.diversityPressure && config.diversityPressure > 0) {
    return applyDiversityPressure(evaluated, config.diversityPressure, config.noveltyWeight);
  }
  
  return evaluated;
}

/**
 * Tournament selection
 * 
 * @param population - Population to select from
 * @param tournamentSize - Number of individuals in tournament
 * @returns Selected kernel
 */
function tournamentSelect(population: Kernel[], tournamentSize: number): Kernel {
  const tournament: Kernel[] = [];
  
  for (let i = 0; i < tournamentSize; i++) {
    const randomIndex = Math.floor(Math.random() * population.length);
    const selected = population[randomIndex];
    if (selected) {
      tournament.push(selected);
    }
  }
  
  // Return fittest from tournament
  return tournament.reduce((best, current) => 
    current.genome.fitness > best.genome.fitness ? current : best
  );
}

/**
 * Apply diversity pressure to maintain genetic variety
 */
function applyDiversityPressure(
  population: Kernel[],
  diversityPressure: number,
  noveltyWeight: number = 0.15
): Kernel[] {
  // Calculate genetic distances for novelty
  population.forEach(kernel => {
    // Calculate average distance to rest of population
    let totalDistance = 0;
    population.forEach(other => {
      if (other.genome.id !== kernel.genome.id) {
        totalDistance += calculateGeneticDistanceSimple(kernel, other);
      }
    });
    
    const avgDistance = totalDistance / (population.length - 1);
    
    // Adjust fitness based on novelty
    const noveltyBonus = avgDistance * noveltyWeight * diversityPressure;
    kernel.genome.fitness = Math.min(1.0, kernel.genome.fitness + noveltyBonus);
  });
  
  return population;
}

/**
 * Calculate simple genetic distance
 */
function calculateGeneticDistanceSimple(k1: Kernel, k2: Kernel): number {
  const coeffs1 = k1.genome.bSeriesCoefficients;
  const coeffs2 = k2.genome.bSeriesCoefficients;
  
  const maxLength = Math.max(coeffs1.length, coeffs2.length);
  let sumSquaredDiff = 0;
  
  for (let i = 0; i < maxLength; i++) {
    const c1 = i < coeffs1.length ? (coeffs1[i] || 0) : 0;
    const c2 = i < coeffs2.length ? (coeffs2[i] || 0) : 0;
    sumSquaredDiff += Math.pow(c1 - c2, 2);
  }
  
  return Math.sqrt(sumSquaredDiff) / 10;
}

/**
 * Calculate generation statistics
 */
function calculateGenerationStats(population: Kernel[], generation: number): GenerationStats {
  const fitnesses = population.map(k => k.genome.fitness);
  
  return {
    generation,
    populationSize: population.length,
    bestFitness: Math.max(...fitnesses),
    averageFitness: fitnesses.reduce((a, b) => a + b, 0) / fitnesses.length,
    worstFitness: Math.min(...fitnesses),
    diversity: calculatePopulationDiversity(population),
    newKernels: population.filter(k => k.genome.generation === generation).length,
    optimizations: 0, // Would track this in production
    timestamp: new Date(),
  };
}

/**
 * Run multi-objective optimization
 * 
 * @param config - Multi-objective configuration
 * @returns Pareto front of non-dominated solutions
 */
export async function multiObjectiveEvolution(
  objectives: Array<{
    name: string;
    weight: number;
    minimize: boolean;
    evaluate: (kernel: Kernel) => number | Promise<number>;
  }>,
  evolution: EvolutionConfig,
  seedKernels?: Kernel[]
): Promise<Kernel[]> {
  // Combined fitness function
  const fitnessFunction = async (kernel: Kernel) => {
    const objectiveScores = await Promise.all(
      objectives.map(obj => obj.evaluate(kernel))
    );
    
    // Weighted sum with normalization
    let combinedFitness = 0;
    
    objectiveScores.forEach((score, idx) => {
      const obj = objectives[idx];
      if (obj) {
        const normalizedScore = obj.minimize ? 1 - score : score;
        combinedFitness += normalizedScore * obj.weight;
      }
    });
    
    return combinedFitness / objectives.reduce((sum, obj) => sum + obj.weight, 0);
  };
  
  const result = await runOntogenesis({
    evolution,
    seedKernels,
    fitnessFunction,
  });
  
  // Return Pareto front (simplified - just return top performers)
  return result.finalPopulation
    .sort((a, b) => b.genome.fitness - a.genome.fitness)
    .slice(0, Math.floor(evolution.populationSize * 0.2));
}
