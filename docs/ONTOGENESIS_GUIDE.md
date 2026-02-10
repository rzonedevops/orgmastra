# Ontogenesis Usage Guide

## Overview

The ontogenesis module provides self-evolving capabilities for computational kernels and AI agents. This guide explains how to use each feature with practical examples.

## Installation

The ontogenesis module is included in `@mastra/core`. No additional installation required.

```bash
npm install @mastra/core
# or
pnpm add @mastra/core
```

## Import

```typescript
import {
  // Core types
  type Kernel,
  type OntogeneticAgent,
  type OntogenesisConfig,
  
  // Kernel creation
  initializeOntogeneticKernel,
  UniversalKernelGenerator,
  
  // Self-evolution
  selfGenerate,
  selfOptimize,
  selfReproduce,
  
  // Population evolution
  runOntogenesis,
  
  // Agent integration
  initializeOntogeneticAgent,
  
  // Metrics
  calculateGrip,
} from '@mastra/core';
```

## Basic Usage

### 1. Create a Domain-Specific Kernel

```typescript
// Generate a consciousness kernel
const kernel = UniversalKernelGenerator.generateConsciousnessKernel(4);

console.log(kernel.genome.domain);        // 'consciousness'
console.log(kernel.genome.bSeriesCoefficients);  // [0.9, 0.1, 0.2, 0.15, ...]
console.log(kernel.grip.overall);         // ~0.80
console.log(kernel.ontogeneticState.stage); // 'embryonic'
```

**Available Domains:**
- `physics` - Hamiltonian systems, energy conservation
- `chemistry` - Reaction networks, mass conservation
- `biology` - Metabolic systems, homeostasis
- `computing` - Recursive structures, termination
- `consciousness` - Echo states, self-reference
- `general` - Standard numerical methods

### 2. Self-Generate Offspring

Create new kernels through recursive composition:

```typescript
const parent = UniversalKernelGenerator.generatePhysicsKernel(4);
const offspring = selfGenerate(parent);

console.log(offspring.genome.generation);  // parent.generation + 1
console.log(offspring.genome.lineage);     // [parent.id, parent.id]
```

**How it works:**
- Applies chain rule: (f∘f)' = f'(f(x)) · f'(x)
- Creates new kernel by composing parent with itself
- Offspring starts in embryonic stage

### 3. Self-Optimize

Improve kernel fitness through gradient ascent:

```typescript
const kernel = initializeOntogeneticKernel('biology', 4);

const optimized = selfOptimize(kernel, {
  iterations: 50,
  learningRate: 0.02,
  fitnessThreshold: 0.90,
  adaptiveLearningRate: true,
});

console.log(optimized.grip.overall);          // Improved grip
console.log(optimized.ontogeneticState.maturity);  // Increased maturity
console.log(optimized.ontogeneticState.stage);     // Progressed stage
```

**Optimization Process:**
1. Calculate gradient of grip metric
2. Update coefficients via gradient ascent
3. Increase maturity and experience
4. Progress through development stages
5. Track optimization events

### 4. Self-Reproduce

Combine genetic material from two kernels:

```typescript
const parent1 = UniversalKernelGenerator.generatePhysicsKernel(4);
const parent2 = UniversalKernelGenerator.generateChemistryKernel(4);

// Crossover
const offspring = selfReproduce(parent1, parent2, {
  method: 'crossover',
  crossoverPoint: 0.5,
  mutationRate: 0.1,
});

// Mutation
const mutated = selfReproduce(parent1, parent1, {
  method: 'mutation',
  mutationRate: 0.2,
});

// Cloning
const clone = selfReproduce(parent1, parent1, {
  method: 'cloning',
  mutationRate: 0.05,
});
```

**Reproduction Methods:**
- **crossover**: Single-point crossover on coefficient arrays
- **mutation**: Random perturbation of coefficients (±10%)
- **cloning**: Direct copy with optional mutations

### 5. Population Evolution

Evolve populations over multiple generations:

```typescript
const result = await runOntogenesis({
  evolution: {
    populationSize: 20,
    mutationRate: 0.15,
    crossoverRate: 0.80,
    elitismRate: 0.15,
    maxGenerations: 50,
    fitnessThreshold: 0.90,
    diversityPressure: 0.25,
    noveltyWeight: 0.15,
  },
  seedKernels: [
    UniversalKernelGenerator.generatePhysicsKernel(4),
    UniversalKernelGenerator.generateChemistryKernel(4),
  ],
  fitnessFunction: (kernel) => {
    // Custom fitness evaluation
    return kernel.grip.overall;
  },
});

console.log(result.bestKernel.genome.fitness);
console.log(result.totalGenerations);
console.log(result.converged);
```

**Evolution Process:**
1. Initialize population (seeds + random)
2. Evaluate fitness for all kernels
3. For each generation:
   - Preserve elite kernels
   - Tournament selection for parents
   - Crossover and mutation
   - Update development stages
4. Track statistics and check convergence

## Advanced Usage

### Custom Fitness Function

Combine multiple metrics:

```typescript
const customFitness = (kernel: Kernel, population?: Kernel[]) => {
  // Grip on domain
  const grip = kernel.grip.overall;
  
  // Complexity (number of non-zero coefficients)
  const complexity = kernel.genome.bSeriesCoefficients
    .filter(c => Math.abs(c) > 0.01).length / 10;
  
  // Novelty (distance from population)
  let novelty = 0;
  if (population) {
    novelty = population.reduce((sum, other) => {
      if (other.genome.id !== kernel.genome.id) {
        return sum + calculateGeneticDistance(kernel, other);
      }
      return sum;
    }, 0) / (population.length - 1);
  }
  
  return (
    grip * 0.5 +
    complexity * 0.3 +
    novelty * 0.2
  );
};
```

### Development Schedule

Control stage transitions:

```typescript
const result = await runOntogenesis({
  evolution: { /* config */ },
  fitnessFunction: customFitness,
  developmentSchedule: {
    embryonicDuration: 3,      // Generations
    juvenileDuration: 7,       // Generations
    matureDuration: 15,        // Generations
    maturityThreshold: 0.85,   // Fitness threshold
    senescenceAge: 30,         // Max generations before senescence
  },
});
```

### Multi-Objective Optimization

Optimize for multiple competing goals:

```typescript
import { multiObjectiveEvolution } from '@mastra/core';

const objectives = [
  {
    name: 'accuracy',
    weight: 0.4,
    minimize: false,
    evaluate: (kernel) => kernel.grip.overall,
  },
  {
    name: 'speed',
    weight: 0.3,
    minimize: true,
    evaluate: (kernel) => kernel.genome.bSeriesCoefficients.length / 20,
  },
  {
    name: 'stability',
    weight: 0.3,
    minimize: false,
    evaluate: (kernel) => kernel.grip.stability,
  },
];

const paretoFront = await multiObjectiveEvolution(
  objectives,
  evolutionConfig,
  seedKernels
);
```

### Agent Integration

Extend Mastra agents with ontogenetic capabilities:

```typescript
import { Mastra } from '@mastra/core';
import { initializeOntogeneticAgent, evaluateAgentFitness } from '@mastra/core';

const mastra = new Mastra({ /* config */ });
const agent = mastra.getAgent('assistant');

// Add ontogenetic capabilities
const ontoAgent = initializeOntogeneticAgent(agent, {
  domain: 'consciousness',
  order: 4,
});

// Self-optimize based on performance
const metrics = {
  taskSuccess: 0.85,
  responseQuality: 0.90,
  efficiency: 0.75,
  userSatisfaction: 0.88,
};

const fitness = evaluateAgentFitness(ontoAgent, metrics);

if (fitness < 0.85) {
  const improved = ontoAgent.selfOptimize({
    iterations: 20,
    learningRate: 0.01,
  });
}

// Generate next version
const nextVersion = ontoAgent.selfGenerate();

// Serialize for storage
const serialized = serializeAgentGenome(ontoAgent);
await saveToDatabase(serialized);
```

## API Reference

### Types

#### `Kernel`
```typescript
interface Kernel {
  genome: KernelGenome;
  ontogeneticState: OntogeneticState;
  grip: GripMetric;
  execute: (input: any) => any;
  metadata?: Record<string, any>;
}
```

#### `KernelGenome`
```typescript
interface KernelGenome {
  id: string;
  generation: number;
  lineage: string[];
  genes: KernelGene[];
  fitness: number;
  age: number;
  bSeriesCoefficients: number[];
  differentialOperators: DifferentialOperator[];
  domain: DomainType;
  createdAt: Date;
  updatedAt: Date;
}
```

#### `OntogeneticState`
```typescript
interface OntogeneticState {
  stage: OntogeneticStage;  // 'embryonic' | 'juvenile' | 'mature' | 'senescent'
  maturity: number;         // 0-1
  experience: number;       // Accumulated interactions
  developmentEvents: DevelopmentEvent[];
}
```

### Functions

#### `UniversalKernelGenerator.generateKernel(domain, order)`
Generate domain-specific kernel with specialized coefficient patterns.

**Parameters:**
- `domain: DomainType` - Target domain
- `order: number` - Kernel order (default: 4)

**Returns:** `Kernel`

#### `selfGenerate(parent)`
Create offspring through recursive composition.

**Parameters:**
- `parent: Kernel` - Parent kernel

**Returns:** `Kernel` - Offspring with generation + 1

#### `selfOptimize(kernel, options)`
Improve kernel through iterative optimization.

**Parameters:**
- `kernel: Kernel` - Kernel to optimize
- `options: OptimizationOptions` - Configuration
  - `iterations: number` - Number of iterations
  - `learningRate?: number` - Step size (default: 0.01)
  - `fitnessThreshold?: number` - Early stopping (default: 0.95)
  - `adaptiveLearningRate?: boolean` - Adaptive rate (default: false)

**Returns:** `Kernel` - Optimized kernel

#### `selfReproduce(parent1, parent2, options)`
Combine genetic material from two kernels.

**Parameters:**
- `parent1: Kernel` - First parent
- `parent2: Kernel` - Second parent
- `options: ReproductionOptions` - Configuration
  - `method: 'crossover' | 'mutation' | 'cloning'`
  - `mutationRate?: number` - Mutation probability (default: 0.1)
  - `crossoverPoint?: number` - Crossover location (default: 0.5)

**Returns:** `Kernel` - Offspring

#### `runOntogenesis(config)`
Run multi-generation population evolution.

**Parameters:**
- `config: OntogenesisConfig` - Evolution configuration
  - `evolution: EvolutionConfig` - Population parameters
  - `seedKernels?: Kernel[]` - Initial kernels
  - `fitnessFunction: (kernel, population?) => number` - Evaluation
  - `developmentSchedule?: DevelopmentSchedule` - Stage transitions

**Returns:** `Promise<EvolutionResult>` - Complete evolution history

#### `calculateGrip(kernel, domain?)`
Evaluate kernel's fit to a domain.

**Parameters:**
- `kernel: Kernel` - Kernel to evaluate
- `domain?: DomainType` - Target domain (uses kernel's domain if omitted)

**Returns:** `GripMetric` - Multi-component grip score

## Best Practices

### 1. Start with Domain-Specific Generators

Don't create kernels manually - use the generators:

```typescript
// ✅ Good
const kernel = UniversalKernelGenerator.generatePhysicsKernel(4);

// ❌ Avoid
const kernel = createKernel({ domain: 'physics', order: 4 });
```

### 2. Optimize Before Reproduction

Optimize parent fitness before creating offspring:

```typescript
// ✅ Good
const optimized = selfOptimize(parent, { iterations: 20 });
const offspring = selfGenerate(optimized);

// ❌ Suboptimal
const offspring = selfGenerate(parent);  // Parent not optimized
```

### 3. Use Appropriate Population Sizes

Scale population to problem complexity:

- Simple tasks: 10-20 individuals
- Medium tasks: 20-50 individuals
- Complex tasks: 50-100 individuals

### 4. Balance Exploration vs Exploitation

Adjust mutation and crossover rates:

```typescript
// Exploration (early evolution)
{
  mutationRate: 0.20,    // Higher mutation
  crossoverRate: 0.70,   // Lower crossover
  diversityPressure: 0.3,
}

// Exploitation (late evolution)
{
  mutationRate: 0.05,    // Lower mutation
  crossoverRate: 0.90,   // Higher crossover
  diversityPressure: 0.1,
}
```

### 5. Monitor Convergence

Check if evolution is making progress:

```typescript
const result = await runOntogenesis(config);

result.generations.forEach((gen, idx) => {
  if (idx > 0) {
    const prev = result.generations[idx - 1];
    const improvement = gen.bestFitness - prev.bestFitness;
    
    if (improvement < 0.001) {
      console.log(`Convergence at generation ${gen.generation}`);
    }
  }
});
```

### 6. Preserve Diversity

Avoid premature convergence:

```typescript
{
  evolution: {
    // ... other config
    diversityPressure: 0.25,  // Encourage genetic variety
    noveltyWeight: 0.15,      // Reward unique solutions
    elitismRate: 0.10,        // Don't preserve too many elites
  },
}
```

## Common Patterns

### Pattern 1: Incremental Self-Improvement

```typescript
let kernel = UniversalKernelGenerator.generateGeneralKernel(4);

for (let i = 0; i < 10; i++) {
  // Optimize
  kernel = selfOptimize(kernel, { iterations: 10 });
  
  // Generate next version if mature enough
  if (kernel.ontogeneticState.stage === 'mature') {
    kernel = selfGenerate(kernel);
  }
}
```

### Pattern 2: Hybrid Evolution (Manual + Automatic)

```typescript
// Manual optimization phase
let kernel = initializeOntogeneticKernel('computing', 4);
kernel = selfOptimize(kernel, { iterations: 50 });

// Automatic population evolution phase
const result = await runOntogenesis({
  evolution: { /* config */ },
  seedKernels: [kernel],
  fitnessFunction: customFitness,
});

const best = result.bestKernel;
```

### Pattern 3: Multi-Domain Evolution

```typescript
const seeds = [
  UniversalKernelGenerator.generatePhysicsKernel(4),
  UniversalKernelGenerator.generateChemistryKernel(4),
  UniversalKernelGenerator.generateBiologyKernel(4),
];

const result = await runOntogenesis({
  evolution: { populationSize: 30, /* ... */ },
  seedKernels: seeds,
  fitnessFunction: (kernel) => {
    // Domain-specific fitness
    return calculateGrip(kernel, kernel.genome.domain).overall;
  },
});

// Best kernels per domain
const byDomain = result.finalPopulation.reduce((acc, k) => {
  if (!acc[k.genome.domain] || k.genome.fitness > acc[k.genome.domain].genome.fitness) {
    acc[k.genome.domain] = k;
  }
  return acc;
}, {} as Record<string, Kernel>);
```

### Pattern 4: Periodic Re-Seeding

```typescript
let population = initialSeeds;

for (let epoch = 0; epoch < 5; epoch++) {
  // Evolve for some generations
  const result = await runOntogenesis({
    evolution: { maxGenerations: 20, /* ... */ },
    seedKernels: population,
    fitnessFunction: customFitness,
  });
  
  // Take best performers as seeds for next epoch
  population = result.finalPopulation
    .sort((a, b) => b.genome.fitness - a.genome.fitness)
    .slice(0, 5);
  
  // Add some random diversity
  population.push(
    UniversalKernelGenerator.generateGeneralKernel(4)
  );
}
```

## Performance Tips

### 1. Limit Population Size

Larger populations = better diversity but slower evolution:

```typescript
// Fast but may converge prematurely
{ populationSize: 10, maxGenerations: 100 }

// Balanced
{ populationSize: 20, maxGenerations: 50 }

// Thorough but slow
{ populationSize: 50, maxGenerations: 30 }
```

### 2. Use Early Stopping

Stop when threshold reached:

```typescript
{
  evolution: {
    maxGenerations: 100,
    fitnessThreshold: 0.90,  // Stop if any kernel reaches 0.90
  },
}
```

### 3. Parallelize Fitness Evaluation

If fitness function is async:

```typescript
fitnessFunction: async (kernel) => {
  // This can run in parallel for each kernel
  const result = await expensiveEvaluation(kernel);
  return result.score;
}
```

### 4. Cache Grip Calculations

Grip is expensive to calculate - cache if evaluating same kernel multiple times:

```typescript
const gripCache = new Map<string, GripMetric>();

fitnessFunction: (kernel) => {
  const cached = gripCache.get(kernel.genome.id);
  if (cached) return cached.overall;
  
  const grip = calculateGrip(kernel);
  gripCache.set(kernel.genome.id, grip);
  return grip.overall;
}
```

## Troubleshooting

### Issue: Evolution Not Improving

**Symptoms:** Fitness plateaus or decreases

**Solutions:**
1. Increase mutation rate (0.15-0.25)
2. Reduce elitism rate (0.05-0.10)
3. Add diversity pressure (0.2-0.3)
4. Check fitness function - ensure it returns 0-1
5. Increase population size

### Issue: Premature Convergence

**Symptoms:** All individuals become very similar

**Solutions:**
1. Increase diversity pressure
2. Add novelty weighting
3. Reduce elitism rate
4. Increase mutation rate
5. Re-seed periodically with random kernels

### Issue: Slow Evolution

**Symptoms:** Takes too many generations

**Solutions:**
1. Reduce population size
2. Increase mutation rate
3. Use adaptive learning rate
4. Optimize fitness function performance
5. Use early stopping threshold

### Issue: Unstable Coefficients

**Symptoms:** Grip drops, coefficients become extreme

**Solutions:**
1. Add stability check to fitness function
2. Clip coefficient values during mutation
3. Reduce learning rate
4. Increase stability weight in grip calculation

## Examples

See `examples/ontogenesis-demo/` for complete working examples:

- **Quick Demo** (`src/index.ts`) - Basic ontogenesis in action
- **Kernel Evolution** (`src/kernel-evolution.ts`) - Detailed self-evolution
- **Population Evolution** (`src/population-evolution.ts`) - Multi-generation dynamics

Run examples:

```bash
cd examples/ontogenesis-demo
npm install
npm run dev              # Quick demo
npm run kernel-evolution # Detailed demo
npm run population       # Population evolution
```

## Related Documentation

- **Agent Instructions**: `.github/agents/orgmastra.md` - Complete conceptual overview
- **Core README**: `packages/core/README.md` - Core package documentation
- **Type Definitions**: `packages/core/src/ontogenesis/types.ts` - All types
- **Tests**: `packages/core/src/ontogenesis/ontogenesis.test.ts` - Example usage in tests

## Support

Questions or issues? Open an issue on GitHub or join our Discord community.
