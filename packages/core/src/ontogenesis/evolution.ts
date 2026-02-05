/**
 * Self-evolution methods for kernels
 * 
 * Implements self-generation, self-optimization, and self-reproduction
 * capabilities for computational kernels.
 */

import type { 
  Kernel, 
  OptimizationOptions, 
  ReproductionOptions,
  DevelopmentEvent,
} from './types';
import { calculateGrip, updateGrip } from './grip';
import { createKernel, cloneKernel } from './kernel';

/**
 * Self-generate offspring through recursive composition
 * 
 * Uses chain rule: (f∘f)' = f'(f(x)) · f'(x)
 * 
 * @param parent - Parent kernel
 * @returns Offspring kernel
 */
export function selfGenerate(parent: Kernel): Kernel {
  // Get chain operator
  const chainOp = parent.genome.differentialOperators.find(op => op.type === 'chain');
  if (!chainOp) {
    throw new Error('Chain operator not found in kernel');
  }
  
  // Apply chain rule to compose kernel with itself
  const offspring = chainOp.apply(parent, parent);
  
  // Update ontogenetic state
  offspring.ontogeneticState.stage = 'embryonic';
  offspring.ontogeneticState.maturity = 0;
  offspring.ontogeneticState.experience = 0;
  
  // Record generation event
  const event: DevelopmentEvent = {
    type: 'generation',
    timestamp: new Date(),
    fitnessBefore: parent.genome.fitness,
    fitnessAfter: offspring.genome.fitness,
    details: {
      method: 'self-composition',
      parentId: parent.genome.id,
    },
  };
  
  offspring.ontogeneticState.developmentEvents.push(event);
  
  return offspring;
}

/**
 * Self-optimize through iterative grip improvement
 * 
 * @param kernel - Kernel to optimize
 * @param options - Optimization options
 * @returns Optimized kernel
 */
export function selfOptimize(kernel: Kernel, options: OptimizationOptions): Kernel {
  const {
    iterations,
    learningRate = 0.01,
    fitnessThreshold = 0.95,
    adaptiveLearningRate = false,
  } = options;
  
  let current = { ...kernel };
  let currentLearningRate = learningRate;
  let lastFitness = current.genome.fitness;
  
  for (let i = 0; i < iterations; i++) {
    // Calculate gradient (simplified - numerical approximation)
    const gradient = calculateGradient(current);
    
    // Update coefficients using gradient ascent
    const newCoefficients = current.genome.bSeriesCoefficients.map((coeff, idx) => {
      return coeff + currentLearningRate * (gradient[idx] || 0);
    });
    
    // Create updated kernel
    const updated = createKernel({
      domain: current.genome.domain,
      order: newCoefficients.length,
      coefficients: newCoefficients,
      lineage: [current.genome.id],
      generation: current.genome.generation,
    });
    
    // Update grip and fitness
    const newGrip = calculateGrip(updated);
    updated.grip = newGrip;
    updated.genome.fitness = newGrip.overall;
    
    // Increase maturity
    const maturityIncrease = 1 / iterations;
    updated.ontogeneticState.maturity = Math.min(
      1.0,
      current.ontogeneticState.maturity + maturityIncrease
    );
    updated.ontogeneticState.experience = current.ontogeneticState.experience + 1;
    
    // Update stage based on maturity
    if (updated.ontogeneticState.maturity < 0.3) {
      updated.ontogeneticState.stage = 'embryonic';
    } else if (updated.ontogeneticState.maturity < 0.7) {
      updated.ontogeneticState.stage = 'juvenile';
    } else {
      updated.ontogeneticState.stage = 'mature';
    }
    
    // Copy development events
    updated.ontogeneticState.developmentEvents = [...current.ontogeneticState.developmentEvents];
    
    // Record optimization event
    const event: DevelopmentEvent = {
      type: 'optimization',
      timestamp: new Date(),
      fitnessBefore: current.genome.fitness,
      fitnessAfter: updated.genome.fitness,
      details: {
        iteration: i + 1,
        learningRate: currentLearningRate,
        gripImprovement: updated.grip.overall - current.grip.overall,
      },
    };
    
    updated.ontogeneticState.developmentEvents.push(event);
    
    // Adaptive learning rate
    if (adaptiveLearningRate) {
      if (updated.genome.fitness > lastFitness) {
        // Increase learning rate if improving
        currentLearningRate *= 1.1;
      } else {
        // Decrease if not improving
        currentLearningRate *= 0.9;
      }
      lastFitness = updated.genome.fitness;
    }
    
    current = updated;
    
    // Early stopping if threshold reached
    if (current.genome.fitness >= fitnessThreshold) {
      break;
    }
  }
  
  return current;
}

/**
 * Calculate gradient for grip optimization
 * 
 * Uses numerical differentiation to estimate gradient
 */
function calculateGradient(kernel: Kernel): number[] {
  const epsilon = 1e-4;
  const gradient: number[] = [];
  const baseGrip = kernel.grip.overall;
  
  for (let i = 0; i < kernel.genome.bSeriesCoefficients.length; i++) {
    // Create perturbed coefficients
    const perturbedCoeffs = [...kernel.genome.bSeriesCoefficients];
    if (perturbedCoeffs[i] !== undefined) {
      perturbedCoeffs[i]! += epsilon;
    }
    
    // Create perturbed kernel
    const perturbedKernel = createKernel({
      domain: kernel.genome.domain,
      order: perturbedCoeffs.length,
      coefficients: perturbedCoeffs,
      lineage: kernel.genome.lineage,
      generation: kernel.genome.generation,
    });
    
    // Calculate grip for perturbed kernel
    const perturbedGrip = calculateGrip(perturbedKernel).overall;
    
    // Numerical gradient
    gradient[i] = (perturbedGrip - baseGrip) / epsilon;
  }
  
  return gradient;
}

/**
 * Self-reproduce through genetic combination
 * 
 * @param parent1 - First parent kernel
 * @param parent2 - Second parent kernel
 * @param options - Reproduction options
 * @returns Offspring kernel
 */
export function selfReproduce(
  parent1: Kernel,
  parent2: Kernel,
  options: ReproductionOptions
): Kernel {
  const { method, mutationRate = 0.1, crossoverPoint = 0.5, inheritFitness = false } = options;
  
  let offspring: Kernel;
  
  switch (method) {
    case 'crossover':
      offspring = crossover(parent1, parent2, crossoverPoint);
      break;
    
    case 'mutation':
      // Mutate parent1
      offspring = mutate(parent1, mutationRate);
      break;
    
    case 'cloning':
      offspring = cloneKernel(parent1, true, mutationRate);
      break;
    
    default:
      throw new Error(`Unknown reproduction method: ${method}`);
  }
  
  // Set fitness
  if (inheritFitness) {
    offspring.genome.fitness = (parent1.genome.fitness + parent2.genome.fitness) / 2;
  } else {
    // Recalculate grip and fitness
    offspring.grip = calculateGrip(offspring);
    offspring.genome.fitness = offspring.grip.overall;
  }
  
  // Record reproduction event
  const event: DevelopmentEvent = {
    type: 'reproduction',
    timestamp: new Date(),
    fitnessBefore: (parent1.genome.fitness + parent2.genome.fitness) / 2,
    fitnessAfter: offspring.genome.fitness,
    details: {
      method,
      parent1Id: parent1.genome.id,
      parent2Id: parent2.genome.id,
      mutationRate,
      crossoverPoint,
    },
  };
  
  offspring.ontogeneticState.developmentEvents.push(event);
  
  return offspring;
}

/**
 * Perform genetic crossover
 */
function crossover(parent1: Kernel, parent2: Kernel, crossoverPoint: number): Kernel {
  const coeffs1 = parent1.genome.bSeriesCoefficients;
  const coeffs2 = parent2.genome.bSeriesCoefficients;
  
  const maxLength = Math.max(coeffs1.length, coeffs2.length);
  const splitIndex = Math.floor(maxLength * crossoverPoint);
  
  const newCoeffs: number[] = [];
  
  for (let i = 0; i < maxLength; i++) {
    const c1 = i < coeffs1.length ? coeffs1[i] : 0;
    const c2 = i < coeffs2.length ? coeffs2[i] : 0;
    
    // Take from parent1 before split, parent2 after
    newCoeffs[i] = i < splitIndex ? (c1 || 0) : (c2 || 0);
  }
  
  return createKernel({
    domain: parent1.genome.domain,
    order: newCoeffs.length,
    coefficients: newCoeffs,
    lineage: [parent1.genome.id, parent2.genome.id],
    generation: Math.max(parent1.genome.generation, parent2.genome.generation) + 1,
  });
}

/**
 * Perform genetic mutation
 */
function mutate(parent: Kernel, mutationRate: number): Kernel {
  const newCoeffs = parent.genome.bSeriesCoefficients.map(coeff => {
    if (Math.random() < mutationRate) {
      // Mutate by ±10%
      return coeff + coeff * (Math.random() * 0.2 - 0.1);
    }
    return coeff;
  });
  
  const offspring = createKernel({
    domain: parent.genome.domain,
    order: newCoeffs.length,
    coefficients: newCoeffs,
    lineage: [parent.genome.id],
    generation: parent.genome.generation + 1,
  });
  
  // Record mutation event
  const event: DevelopmentEvent = {
    type: 'mutation',
    timestamp: new Date(),
    fitnessBefore: parent.genome.fitness,
    fitnessAfter: offspring.genome.fitness,
    details: {
      mutationRate,
      mutatedGenes: newCoeffs.filter((c, i) => c !== parent.genome.bSeriesCoefficients[i]).length,
    },
  };
  
  offspring.ontogeneticState.developmentEvents.push(event);
  
  return offspring;
}

/**
 * Update kernel's development stage based on age and maturity
 * 
 * @param kernel - Kernel to update
 * @param schedule - Development schedule
 * @returns Updated kernel
 */
export function updateDevelopmentStage(
  kernel: Kernel,
  schedule?: {
    embryonicDuration: number;
    juvenileDuration: number;
    matureDuration: number;
    maturityThreshold: number;
    senescenceAge: number;
  }
): Kernel {
  const defaultSchedule = {
    embryonicDuration: 2,
    juvenileDuration: 5,
    matureDuration: 10,
    maturityThreshold: 0.8,
    senescenceAge: 20,
  };
  
  const sched = schedule || defaultSchedule;
  const age = kernel.genome.age;
  const maturity = kernel.ontogeneticState.maturity;
  
  let newStage = kernel.ontogeneticState.stage;
  
  if (age >= sched.senescenceAge) {
    newStage = 'senescent';
  } else if (maturity >= sched.maturityThreshold && age >= sched.embryonicDuration + sched.juvenileDuration) {
    newStage = 'mature';
  } else if (age >= sched.embryonicDuration) {
    newStage = 'juvenile';
  } else {
    newStage = 'embryonic';
  }
  
  // Record stage transition if changed
  if (newStage !== kernel.ontogeneticState.stage) {
    const event: DevelopmentEvent = {
      type: 'stage_transition',
      timestamp: new Date(),
      fitnessBefore: kernel.genome.fitness,
      fitnessAfter: kernel.genome.fitness,
      details: {
        fromStage: kernel.ontogeneticState.stage,
        toStage: newStage,
        age,
        maturity,
      },
    };
    
    kernel.ontogeneticState.developmentEvents.push(event);
    kernel.ontogeneticState.stage = newStage;
  }
  
  return kernel;
}
