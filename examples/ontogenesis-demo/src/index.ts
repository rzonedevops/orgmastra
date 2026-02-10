/**
 * Ontogenesis Demo - Main Entry Point
 * 
 * Quick demonstration of kernel self-evolution capabilities.
 */

import {
  initializeOntogeneticKernel,
  selfGenerate,
  selfOptimize,
  UniversalKernelGenerator,
} from '@mastra/core';

console.log('🧬 OrgMastra Ontogenesis Quick Demo\n');
console.log('═══════════════════════════════════════════════════\n');

// Create a consciousness kernel
const kernel = UniversalKernelGenerator.generateConsciousnessKernel(4);

console.log('1️⃣  Initial Kernel:');
console.log(`   Domain: ${kernel.genome.domain}`);
console.log(`   Fitness: ${kernel.genome.fitness.toFixed(4)}`);
console.log(`   Stage: ${kernel.ontogeneticState.stage}\n`);

// Self-optimize
console.log('2️⃣  Self-optimizing (20 iterations)...');
const optimized = selfOptimize(kernel, {
  iterations: 20,
  learningRate: 0.02,
});

console.log(`   Fitness: ${kernel.genome.fitness.toFixed(4)} → ${optimized.genome.fitness.toFixed(4)}`);
console.log(`   Stage: ${optimized.ontogeneticState.stage}`);
console.log(`   Maturity: ${optimized.ontogeneticState.maturity.toFixed(2)}\n`);

// Self-generate offspring
console.log('3️⃣  Self-generating offspring...');
const offspring = selfGenerate(optimized);

console.log(`   Parent gen: ${optimized.genome.generation}`);
console.log(`   Offspring gen: ${offspring.genome.generation}`);
console.log(`   Lineage: ${offspring.genome.lineage.length} ancestors\n`);

console.log('✅ Demo complete! See other examples:');
console.log('   • npm run kernel-evolution - Detailed kernel evolution');
console.log('   • npm run population - Multi-generation population evolution\n');
