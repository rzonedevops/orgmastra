# Ontogenesis Demo

This example demonstrates the **ontogenetic evolution** capabilities of OrgMastra - self-evolving computational kernels based on B-Series expansion as genetic code.

## What is Ontogenesis?

Ontogenesis is the process by which computational kernels (and AI agents) can:

1. **Self-generate** - Create offspring through recursive composition (chain rule)
2. **Self-optimize** - Improve themselves through grip maximization
3. **Self-reproduce** - Combine genetic material through crossover and mutation
4. **Evolve** - Improve over multiple generations via natural selection

## Mathematical Foundation

The core insight: **All kernels are B-Series expansions** with domain-specific elementary differentials:

```
y_{n+1} = y_n + h × Σ b_i × Φ_i(f, y_n)
```

Where:
- `b_i` are coefficient genes (mutable)
- `Φ_i` are elementary differentials (rooted trees)
- Trees follow A000081 sequence: 1, 1, 2, 4, 9, 20, 48, 115, ...

## Running the Examples

```bash
# Install dependencies (from repository root)
pnpm install

# Build the core package
pnpm build:core

# Run the examples
cd examples/ontogenesis-demo

# Quick demo
npm run dev

# Detailed kernel evolution
npm run kernel-evolution

# Population evolution over multiple generations
npm run population
```

## Examples Overview

### 1. Quick Demo (`src/index.ts`)

Basic demonstration of:
- Creating domain-specific kernels
- Self-optimization
- Self-generation

**Output:**
```
1️⃣  Initial Kernel: consciousness (fitness: 0.5000)
2️⃣  Self-optimizing → fitness improved to 0.7234
3️⃣  Self-generating offspring → generation 1
```

### 2. Kernel Evolution (`src/kernel-evolution.ts`)

Comprehensive demonstration of:
- Domain-specific kernel generation (Physics, Chemistry, Consciousness)
- Self-generation via chain rule
- Self-optimization via grip maximization
- Self-reproduction via genetic operators
- Development event tracking

**Output:**
```
🧬 Ontogenesis Demo: Kernel Evolution

📦 Domain-specific kernels
🔄 Self-generation (recursive composition)
⚡ Self-optimization (grip improvement)
🧬 Self-reproduction (genetic crossover)
📊 Development history tracking
```

### 3. Population Evolution (`src/population-evolution.ts`)

Multi-generation evolution demonstrating:
- Tournament selection
- Elite preservation
- Crossover and mutation
- Diversity pressure
- Convergence analysis

**Output:**
```
Gen | Best    | Avg     | Worst   | Diversity | New
----|---------|---------|---------|-----------|----
  0 | 0.65432 | 0.52341 | 0.38765 | 0.4523... | 16
  1 | 0.71234 | 0.58432 | 0.42123 | 0.4234... | 17
...
 15 | 0.92341 | 0.85432 | 0.71234 | 0.3123... | 18

✨ Converged: Yes ✓
🏆 Best Fitness: 0.923410
```

## Key Concepts

### Kernel Genome

The "DNA" of computational kernels:
- **B-Series coefficients** - Genetic code
- **Elementary differentials** - Rooted tree structures
- **Lineage** - Evolutionary ancestry
- **Generation** - Number of reproduction steps

### Grip Metric

Measures how well a kernel fits its domain:
- **Contact** (40%) - How well kernel touches domain
- **Coverage** (30%) - Completeness of domain span
- **Efficiency** (20%) - Computational cost
- **Stability** (10%) - Numerical properties

**Perfect grip = 1.0 = Perfect computation**

### Development Stages

Kernels progress through life stages:
- **Embryonic** - Just generated
- **Juvenile** - Developing, optimizing
- **Mature** - Fully developed, reproduction capable
- **Senescent** - Declining, ready for replacement

### Differential Operators

Kernels combine through calculus:
- **Chain Rule**: (f∘g)' = f'(g) · g' - Sequential composition
- **Product Rule**: (f·g)' = f'·g + f·g' - Parallel combination
- **Quotient Rule**: (f/g)' = (f'·g - f·g')/g² - Ratio operations
- **Sum Rule**: (f+g)' = f' + g' - Additive combination

## Domain-Specific Kernels

### Physics
- **Preserves**: Symplectic structure, energy conservation
- **Use case**: Numerical integration of dynamical systems
- **Coefficient pattern**: Alternating signs, symmetric structure

### Chemistry
- **Preserves**: Mass conservation, detailed balance
- **Use case**: Chemical kinetics simulation
- **Coefficient pattern**: Sum ≈ 1, non-negative

### Biology
- **Preserves**: Homeostasis, population bounds
- **Use case**: Systems biology modeling
- **Coefficient pattern**: Bounded growth, negative feedback

### Computing
- **Preserves**: Church-Rosser property, termination
- **Use case**: Program optimization, compilation
- **Coefficient pattern**: Discrete, recursive structure

### Consciousness
- **Preserves**: Self-reference, gestalt coherence
- **Use case**: AI agent self-awareness, memory integration
- **Coefficient pattern**: Echo structure, feedback loops

## Advanced Usage

### Custom Fitness Function

```typescript
const customFitness = (kernel: Kernel, population?: Kernel[]) => {
  const grip = kernel.grip.overall;
  const novelty = calculateNovelty(kernel, population || []);
  const performance = evaluatePerformance(kernel);
  
  return grip * 0.3 + novelty * 0.3 + performance * 0.4;
};
```

### Multi-Objective Optimization

```typescript
import { multiObjectiveEvolution } from '@mastra/core';

const paretoFront = await multiObjectiveEvolution(
  [
    { name: 'accuracy', weight: 0.4, minimize: false, evaluate: ... },
    { name: 'speed', weight: 0.3, minimize: true, evaluate: ... },
    { name: 'memory', weight: 0.3, minimize: true, evaluate: ... },
  ],
  evolutionConfig,
  seedKernels
);
```

## Learn More

- **Documentation**: See `/docs` for full API reference
- **Agent Instructions**: `.github/agents/orgmastra.md` for complete overview
- **Research**: Referenced papers on B-Series, rooted trees, and evolutionary computation

## Mathematical References

- Butcher, J.C. (2016). *Numerical Methods for Ordinary Differential Equations*
- Hairer, E., et al. (1993). *Solving Ordinary Differential Equations I*
- Cayley, A. (1857). *On the Theory of the Analytical Forms called Trees* (A000081)
- Holland, J.H. (1992). *Adaptation in Natural and Artificial Systems*
