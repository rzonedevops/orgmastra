/**
 * Tests for ontogenesis module
 */

import { describe, expect, it } from 'vitest';

import {
  createKernel,
  initializeOntogeneticKernel,
  calculateGrip,
  selfGenerate,
  selfOptimize,
  selfReproduce,
  runOntogenesis,
  UniversalKernelGenerator,
  generateElementaryDifferentials,
  getElementaryDifferentialCount,
  type Kernel,
  type DomainType,
} from './index';

describe('B-Series and Elementary Differentials', () => {
  it('should return correct A000081 values', () => {
    expect(getElementaryDifferentialCount(1)).toBe(1);
    expect(getElementaryDifferentialCount(2)).toBe(1);
    expect(getElementaryDifferentialCount(3)).toBe(2);
    expect(getElementaryDifferentialCount(4)).toBe(4);
    expect(getElementaryDifferentialCount(5)).toBe(9);
  });
  
  it('should generate elementary differentials', () => {
    const differentials = generateElementaryDifferentials(3);
    
    // Should have 1 + 1 + 2 = 4 differentials for orders 1-3
    expect(differentials.length).toBe(4);
    
    // Check structure
    expect(differentials[0].order).toBe(1);
    expect(differentials[1].order).toBe(2);
    expect(differentials[2].order).toBe(3);
    expect(differentials[3].order).toBe(3);
  });
});

describe('Kernel Creation', () => {
  it('should create a basic kernel', () => {
    const kernel = createKernel({
      domain: 'general',
      order: 4,
    });
    
    expect(kernel.genome.id).toBeDefined();
    expect(kernel.genome.domain).toBe('general');
    expect(kernel.genome.bSeriesCoefficients.length).toBeGreaterThan(0);
    expect(kernel.ontogeneticState.stage).toBe('embryonic');
    expect(kernel.ontogeneticState.maturity).toBe(0);
  });
  
  it('should initialize ontogenetic kernel', () => {
    const kernel = initializeOntogeneticKernel('physics', 4);
    
    expect(kernel.genome.domain).toBe('physics');
    expect(kernel.ontogeneticState).toBeDefined();
    expect(kernel.grip).toBeDefined();
  });
  
  it('should create custom coefficients', () => {
    const customCoeffs = [1.0, 0.5, 0.25];
    const kernel = createKernel({
      domain: 'computing',
      order: 3,
      coefficients: customCoeffs,
    });
    
    expect(kernel.genome.bSeriesCoefficients).toEqual(customCoeffs);
  });
});

describe('Grip Metrics', () => {
  it('should calculate grip for a kernel', () => {
    const kernel = initializeOntogeneticKernel('physics', 4);
    const grip = calculateGrip(kernel);
    
    expect(grip.overall).toBeGreaterThanOrEqual(0);
    expect(grip.overall).toBeLessThanOrEqual(1);
    expect(grip.contact).toBeGreaterThanOrEqual(0);
    expect(grip.coverage).toBeGreaterThanOrEqual(0);
    expect(grip.efficiency).toBeGreaterThanOrEqual(0);
    expect(grip.stability).toBeGreaterThanOrEqual(0);
  });
  
  it('should give higher grip for domain-matched kernels', () => {
    const physicsKernel = UniversalKernelGenerator.generatePhysicsKernel(4);
    const generalKernel = UniversalKernelGenerator.generateGeneralKernel(4);
    
    const physicsGrip = calculateGrip(physicsKernel, 'physics');
    const generalGrip = calculateGrip(generalKernel, 'physics');
    
    // Physics kernel should have better contact with physics domain
    expect(physicsGrip.contact).toBeGreaterThanOrEqual(generalGrip.contact);
  });
});

describe('Universal Kernel Generator', () => {
  it('should generate physics kernel', () => {
    const kernel = UniversalKernelGenerator.generatePhysicsKernel(4);
    
    expect(kernel.genome.domain).toBe('physics');
    expect(kernel.metadata?.preserves).toContain('energy');
    expect(kernel.genome.bSeriesCoefficients.length).toBeGreaterThan(0);
  });
  
  it('should generate chemistry kernel', () => {
    const kernel = UniversalKernelGenerator.generateChemistryKernel(4);
    
    expect(kernel.genome.domain).toBe('chemistry');
    expect(kernel.metadata?.preserves).toContain('mass');
    
    // Check mass conservation (sum ≈ 1)
    const sum = kernel.genome.bSeriesCoefficients.reduce((a, b) => a + b, 0);
    expect(Math.abs(sum - 1)).toBeLessThan(0.2);
  });
  
  it('should generate biology kernel', () => {
    const kernel = UniversalKernelGenerator.generateBiologyKernel(4);
    
    expect(kernel.genome.domain).toBe('biology');
    expect(kernel.metadata?.preserves).toContain('homeostasis');
  });
  
  it('should generate computing kernel', () => {
    const kernel = UniversalKernelGenerator.generateComputingKernel(4);
    
    expect(kernel.genome.domain).toBe('computing');
    expect(kernel.metadata?.preserves).toContain('church_rosser');
  });
  
  it('should generate consciousness kernel', () => {
    const kernel = UniversalKernelGenerator.generateConsciousnessKernel(4);
    
    expect(kernel.genome.domain).toBe('consciousness');
    expect(kernel.metadata?.preserves).toContain('self_reference');
  });
});

describe('Self-Evolution Methods', () => {
  it('should self-generate offspring', () => {
    const parent = UniversalKernelGenerator.generateConsciousnessKernel(4);
    const offspring = selfGenerate(parent);
    
    expect(offspring.genome.id).not.toBe(parent.genome.id);
    expect(offspring.genome.generation).toBe(parent.genome.generation + 1);
    expect(offspring.genome.lineage).toContain(parent.genome.id);
    expect(offspring.ontogeneticState.stage).toBe('embryonic');
    expect(offspring.ontogeneticState.developmentEvents.length).toBeGreaterThan(0);
    expect(offspring.ontogeneticState.developmentEvents[0].type).toBe('generation');
  });
  
  it('should self-optimize kernel', () => {
    const kernel = initializeOntogeneticKernel('physics', 4);
    const initialFitness = kernel.genome.fitness;
    
    const optimized = selfOptimize(kernel, {
      iterations: 10,
      learningRate: 0.01,
    });
    
    expect(optimized.ontogeneticState.maturity).toBeGreaterThan(kernel.ontogeneticState.maturity);
    expect(optimized.ontogeneticState.experience).toBe(10);
    expect(optimized.ontogeneticState.developmentEvents.length).toBeGreaterThan(0);
    expect(optimized.ontogeneticState.developmentEvents.every(e => e.type === 'optimization')).toBe(true);
  });
  
  it('should progress through development stages during optimization', () => {
    const kernel = initializeOntogeneticKernel('biology', 4);
    
    const optimized = selfOptimize(kernel, {
      iterations: 50,
      learningRate: 0.02,
    });
    
    // After many iterations, should progress beyond embryonic
    expect(['juvenile', 'mature']).toContain(optimized.ontogeneticState.stage);
    expect(optimized.ontogeneticState.maturity).toBeGreaterThan(0.3);
  });
  
  it('should self-reproduce via crossover', () => {
    const parent1 = UniversalKernelGenerator.generatePhysicsKernel(4);
    const parent2 = UniversalKernelGenerator.generatePhysicsKernel(4);
    
    const offspring = selfReproduce(parent1, parent2, {
      method: 'crossover',
      crossoverPoint: 0.5,
    });
    
    expect(offspring.genome.lineage).toContain(parent1.genome.id);
    expect(offspring.genome.lineage).toContain(parent2.genome.id);
    expect(offspring.genome.generation).toBeGreaterThan(parent1.genome.generation);
  });
  
  it('should self-reproduce via mutation', () => {
    const parent = UniversalKernelGenerator.generateChemistryKernel(4);
    
    const offspring = selfReproduce(parent, parent, {
      method: 'mutation',
      mutationRate: 0.2,
    });
    
    expect(offspring.genome.id).not.toBe(parent.genome.id);
    
    // Coefficients should be similar but potentially different
    // With mutation rate 0.2, we expect some mutations, but not guaranteed
    // Check that coefficients exist and offspring is created
    expect(offspring.genome.bSeriesCoefficients.length).toBeGreaterThan(0);
    expect(offspring.genome.generation).toBe(parent.genome.generation + 1);
    
    // Check mutation event was recorded
    const mutationEvent = offspring.ontogeneticState.developmentEvents.find(e => e.type === 'mutation');
    expect(mutationEvent).toBeDefined();
  });
  
  it('should self-reproduce via cloning', () => {
    const parent = UniversalKernelGenerator.generateComputingKernel(4);
    
    const offspring = selfReproduce(parent, parent, {
      method: 'cloning',
      mutationRate: 0.1,
    });
    
    expect(offspring.genome.domain).toBe(parent.genome.domain);
    expect(offspring.genome.generation).toBe(parent.genome.generation + 1);
  });
});

describe('Population Evolution', () => {
  it('should run ontogenesis with simple fitness function', async () => {
    const seedKernel = UniversalKernelGenerator.generatePhysicsKernel(4);
    
    const result = await runOntogenesis({
      evolution: {
        populationSize: 10,
        mutationRate: 0.1,
        crossoverRate: 0.7,
        elitismRate: 0.2,
        maxGenerations: 5,
      },
      seedKernels: [seedKernel],
      fitnessFunction: (kernel) => {
        // Simple fitness based on grip
        return kernel.grip.overall;
      },
    });
    
    expect(result.generations.length).toBeGreaterThan(0);
    expect(result.generations.length).toBeLessThanOrEqual(5);
    expect(result.finalPopulation.length).toBe(10);
    expect(result.bestKernel).toBeDefined();
    expect(result.bestKernel.genome.fitness).toBeGreaterThanOrEqual(0);
  });
  
  it('should improve fitness over generations', async () => {
    const result = await runOntogenesis({
      evolution: {
        populationSize: 20,
        mutationRate: 0.15,
        crossoverRate: 0.8,
        elitismRate: 0.1,
        maxGenerations: 10,
      },
      fitnessFunction: (kernel) => kernel.grip.overall,
    });
    
    // First and last generation
    const firstGen = result.generations[0];
    const lastGen = result.generations[result.generations.length - 1];
    
    // Average fitness should improve or stay same
    expect(lastGen.averageFitness).toBeGreaterThanOrEqual(firstGen.averageFitness - 0.1);
    
    // Best fitness should improve or stay same
    expect(lastGen.bestFitness).toBeGreaterThanOrEqual(firstGen.bestFitness);
  });
  
  it('should converge when fitness threshold reached', async () => {
    const highFitnessKernel = createKernel({
      domain: 'general',
      order: 4,
      coefficients: [1, 0.5, 0.5, 0],
    });
    
    // Force high fitness
    highFitnessKernel.genome.fitness = 0.95;
    
    const result = await runOntogenesis({
      evolution: {
        populationSize: 5,
        mutationRate: 0.05,
        crossoverRate: 0.5,
        elitismRate: 0.2,
        maxGenerations: 100,
        fitnessThreshold: 0.9,
      },
      seedKernels: [highFitnessKernel],
      fitnessFunction: (kernel) => kernel.genome.fitness,
    });
    
    // Should converge early
    expect(result.converged).toBe(true);
    expect(result.totalGenerations).toBeLessThan(100);
  });
  
  it('should maintain population diversity', async () => {
    const result = await runOntogenesis({
      evolution: {
        populationSize: 15,
        mutationRate: 0.2,
        crossoverRate: 0.7,
        elitismRate: 0.1,
        maxGenerations: 8,
        diversityPressure: 0.3,
        noveltyWeight: 0.2,
      },
      fitnessFunction: (kernel) => kernel.grip.overall,
    });
    
    // Check diversity metrics exist
    result.generations.forEach(gen => {
      expect(gen.diversity).toBeGreaterThanOrEqual(0);
      expect(gen.diversity).toBeLessThanOrEqual(1);
    });
  });
});

describe('Domain-Specific Kernels', () => {
  const domains: DomainType[] = ['physics', 'chemistry', 'biology', 'computing', 'consciousness'];
  
  domains.forEach(domain => {
    it(`should generate ${domain} kernel with domain-specific properties`, () => {
      const kernel = UniversalKernelGenerator.generateKernel(domain, 4);
      
      expect(kernel.genome.domain).toBe(domain);
      expect(kernel.genome.bSeriesCoefficients.length).toBeGreaterThan(0);
      expect(kernel.metadata?.preserves).toBeDefined();
      expect(Array.isArray(kernel.metadata?.preserves)).toBe(true);
    });
  });
  
  it('should have different coefficient patterns for different domains', () => {
    const physics = UniversalKernelGenerator.generatePhysicsKernel(4);
    const chemistry = UniversalKernelGenerator.generateChemistryKernel(4);
    const consciousness = UniversalKernelGenerator.generateConsciousnessKernel(4);
    
    // Check that they're different
    const physicsCoeffs = physics.genome.bSeriesCoefficients.join(',');
    const chemistryCoeffs = chemistry.genome.bSeriesCoefficients.join(',');
    const consciousnessCoeffs = consciousness.genome.bSeriesCoefficients.join(',');
    
    expect(physicsCoeffs).not.toBe(chemistryCoeffs);
    expect(physicsCoeffs).not.toBe(consciousnessCoeffs);
    expect(chemistryCoeffs).not.toBe(consciousnessCoeffs);
  });
});

describe('Genetic Operations', () => {
  it('should track lineage through generations', () => {
    const parent = initializeOntogeneticKernel('biology', 4);
    const child = selfGenerate(parent);
    const grandchild = selfGenerate(child);
    
    expect(child.genome.lineage).toContain(parent.genome.id);
    expect(grandchild.genome.lineage).toContain(child.genome.id);
    expect(grandchild.genome.generation).toBe(parent.genome.generation + 2);
  });
  
  it('should record development events', () => {
    const kernel = initializeOntogeneticKernel('computing', 4);
    const optimized = selfOptimize(kernel, { iterations: 5 });
    
    expect(optimized.ontogeneticState.developmentEvents.length).toBe(5);
    expect(optimized.ontogeneticState.developmentEvents[0].type).toBe('optimization');
  });
  
  it('should maintain genetic diversity in crossover', () => {
    const parent1 = createKernel({
      domain: 'general',
      order: 4,
      coefficients: [1, 0, 0, 0],
    });
    
    const parent2 = createKernel({
      domain: 'general',
      order: 4,
      coefficients: [0, 0, 0, 1],
    });
    
    const offspring = selfReproduce(parent1, parent2, {
      method: 'crossover',
      crossoverPoint: 0.5,
    });
    
    // Offspring should have mix of parent genes
    const coeffs = offspring.genome.bSeriesCoefficients;
    expect(coeffs.some(c => c !== 0)).toBe(true);
  });
});

describe('Integration Tests', () => {
  it('should run complete evolution workflow', async () => {
    // Create diverse seed population
    const seeds = [
      UniversalKernelGenerator.generatePhysicsKernel(4),
      UniversalKernelGenerator.generateChemistryKernel(4),
      UniversalKernelGenerator.generateBiologyKernel(4),
    ];
    
    const result = await runOntogenesis({
      evolution: {
        populationSize: 12,
        mutationRate: 0.12,
        crossoverRate: 0.75,
        elitismRate: 0.15,
        maxGenerations: 6,
      },
      seedKernels: seeds,
      fitnessFunction: (kernel) => {
        // Composite fitness
        const grip = calculateGrip(kernel);
        const complexity = kernel.genome.bSeriesCoefficients.filter(c => Math.abs(c) > 0.01).length;
        const complexityScore = Math.min(complexity / 8, 1.0);
        
        return grip.overall * 0.7 + complexityScore * 0.3;
      },
    });
    
    expect(result.totalGenerations).toBe(6);
    expect(result.bestKernel.genome.fitness).toBeGreaterThan(0);
    
    // Verify statistics are tracked
    result.generations.forEach(gen => {
      expect(gen.populationSize).toBe(12);
      expect(gen.bestFitness).toBeGreaterThanOrEqual(gen.averageFitness);
      // Use toBeCloseTo to avoid floating point precision issues
      expect(gen.averageFitness).toBeGreaterThanOrEqual(gen.worstFitness - 0.001);
    });
  });
  
  it('should evolve and optimize a single kernel', async () => {
    const initial = initializeOntogeneticKernel('consciousness', 4);
    
    // Self-optimize
    const optimized = selfOptimize(initial, {
      iterations: 20,
      learningRate: 0.02,
      adaptiveLearningRate: true,
    });
    
    // Self-generate offspring
    const offspring = selfGenerate(optimized);
    
    // Verify progression
    expect(optimized.ontogeneticState.maturity).toBeGreaterThan(initial.ontogeneticState.maturity);
    expect(offspring.genome.generation).toBe(optimized.genome.generation + 1);
  });
});
