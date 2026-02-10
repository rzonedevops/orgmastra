/**
 * Ontogenesis Demo - Kernel Evolution
 * 
 * Demonstrates self-generation, self-optimization, and self-reproduction
 * of computational kernels using B-Series expansion.
 */

import {
  UniversalKernelGenerator,
  selfGenerate,
  selfOptimize,
  selfReproduce,
  calculateGrip,
  type Kernel,
} from '@mastra/core';

console.log('🧬 Ontogenesis Demo: Kernel Evolution\n');

// ============================================================================
// 1. Generate Domain-Specific Kernels
// ============================================================================

console.log('📦 Step 1: Generating domain-specific kernels...\n');

const physicsKernel = UniversalKernelGenerator.generatePhysicsKernel(4);
const chemistryKernel = UniversalKernelGenerator.generateChemistryKernel(4);
const consciousnessKernel = UniversalKernelGenerator.generateConsciousnessKernel(4);

console.log('Physics Kernel:');
console.log(`  Domain: ${physicsKernel.genome.domain}`);
console.log(`  Coefficients: [${physicsKernel.genome.bSeriesCoefficients.slice(0, 4).map(c => c.toFixed(3)).join(', ')}...]`);
console.log(`  Preserves: ${physicsKernel.metadata?.preserves?.join(', ')}`);
console.log(`  Grip: ${physicsKernel.grip.overall.toFixed(4)}\n`);

console.log('Chemistry Kernel:');
console.log(`  Domain: ${chemistryKernel.genome.domain}`);
console.log(`  Coefficients: [${chemistryKernel.genome.bSeriesCoefficients.slice(0, 4).map(c => c.toFixed(3)).join(', ')}...]`);
console.log(`  Preserves: ${chemistryKernel.metadata?.preserves?.join(', ')}`);
console.log(`  Grip: ${chemistryKernel.grip.overall.toFixed(4)}\n`);

console.log('Consciousness Kernel:');
console.log(`  Domain: ${consciousnessKernel.genome.domain}`);
console.log(`  Coefficients: [${consciousnessKernel.genome.bSeriesCoefficients.slice(0, 4).map(c => c.toFixed(3)).join(', ')}...]`);
console.log(`  Preserves: ${consciousnessKernel.metadata?.preserves?.join(', ')}`);
console.log(`  Grip: ${consciousnessKernel.grip.overall.toFixed(4)}\n`);

// ============================================================================
// 2. Self-Generation (Recursive Composition)
// ============================================================================

console.log('🔄 Step 2: Self-generation via chain rule (f∘f)...\n');

const parent = consciousnessKernel;
const offspring = selfGenerate(parent);

console.log(`Parent ID: ${parent.genome.id.substring(0, 20)}...`);
console.log(`Parent Generation: ${parent.genome.generation}`);
console.log(`Parent Stage: ${parent.ontogeneticState.stage}\n`);

console.log(`Offspring ID: ${offspring.genome.id.substring(0, 20)}...`);
console.log(`Offspring Generation: ${offspring.genome.generation}`);
console.log(`Offspring Stage: ${offspring.ontogeneticState.stage}`);
console.log(`Lineage: [${offspring.genome.lineage.map(id => id.substring(0, 12)).join(', ')}...]\n`);

// ============================================================================
// 3. Self-Optimization (Grip Improvement)
// ============================================================================

console.log('⚡ Step 3: Self-optimization via grip maximization...\n');

const unoptimized = UniversalKernelGenerator.generateGeneralKernel(4);
console.log(`Before optimization:`);
console.log(`  Fitness: ${unoptimized.genome.fitness.toFixed(4)}`);
console.log(`  Grip: ${unoptimized.grip.overall.toFixed(4)}`);
console.log(`  Maturity: ${unoptimized.ontogeneticState.maturity.toFixed(2)}`);
console.log(`  Stage: ${unoptimized.ontogeneticState.stage}\n`);

const optimized = selfOptimize(unoptimized, {
  iterations: 30,
  learningRate: 0.02,
  adaptiveLearningRate: true,
});

console.log(`After 30 optimization iterations:`);
console.log(`  Fitness: ${optimized.genome.fitness.toFixed(4)}`);
console.log(`  Grip: ${optimized.grip.overall.toFixed(4)}`);
console.log(`  Maturity: ${optimized.ontogeneticState.maturity.toFixed(2)}`);
console.log(`  Stage: ${optimized.ontogeneticState.stage}`);
console.log(`  Experience: ${optimized.ontogeneticState.experience} iterations\n`);

// ============================================================================
// 4. Self-Reproduction (Genetic Combination)
// ============================================================================

console.log('🧬 Step 4: Self-reproduction via genetic crossover...\n');

const parent1 = physicsKernel;
const parent2 = chemistryKernel;

console.log(`Parent 1: ${parent1.genome.domain} (fitness: ${parent1.genome.fitness.toFixed(4)})`);
console.log(`Parent 2: ${parent2.genome.domain} (fitness: ${parent2.genome.fitness.toFixed(4)})\n`);

const hybrid = selfReproduce(parent1, parent2, {
  method: 'crossover',
  crossoverPoint: 0.5,
  mutationRate: 0.1,
});

console.log(`Hybrid offspring:`);
console.log(`  ID: ${hybrid.genome.id.substring(0, 20)}...`);
console.log(`  Domain: ${hybrid.genome.domain}`);
console.log(`  Generation: ${hybrid.genome.generation}`);
console.log(`  Fitness: ${hybrid.genome.fitness.toFixed(4)}`);
console.log(`  Parents: ${hybrid.genome.lineage.length}\n`);

// ============================================================================
// 5. Development Events Tracking
// ============================================================================

console.log('📊 Step 5: Development events tracking...\n');

const testKernel = UniversalKernelGenerator.generateBiologyKernel(4);
const evolved = selfOptimize(testKernel, { iterations: 5 });
const nextGen = selfGenerate(evolved);

console.log(`Development history (${nextGen.ontogeneticState.developmentEvents.length} events):`);
nextGen.ontogeneticState.developmentEvents.forEach((event, idx) => {
  console.log(`  ${idx + 1}. ${event.type}: ${event.fitnessBefore.toFixed(4)} → ${event.fitnessAfter.toFixed(4)}`);
});

console.log('\n✅ Ontogenesis demo complete!\n');
console.log('Key Takeaways:');
console.log('  • Kernels can self-generate through composition (chain rule)');
console.log('  • Kernels self-optimize by maximizing grip on their domain');
console.log('  • Kernels reproduce through crossover and mutation');
console.log('  • All operations are tracked in development history');
console.log('  • Different domains have specialized coefficient patterns\n');
