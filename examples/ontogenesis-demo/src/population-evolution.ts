/**
 * Ontogenesis Demo - Population Evolution
 * 
 * Demonstrates multi-generation evolution of kernel populations
 * with tournament selection, elite preservation, and diversity pressure.
 */

import {
  runOntogenesis,
  UniversalKernelGenerator,
  type Kernel,
} from '@mastra/core';

console.log('🌱 Ontogenesis Demo: Population Evolution\n');

// ============================================================================
// Fitness Function: Composite Grip + Complexity
// ============================================================================

function evaluateFitness(kernel: Kernel): number {
  // Multi-factor fitness
  const grip = kernel.grip.overall;
  
  // Complexity score (reward diverse coefficients)
  const nonZeroCoeffs = kernel.genome.bSeriesCoefficients.filter(c => Math.abs(c) > 0.01).length;
  const complexity = Math.min(nonZeroCoeffs / 8, 1.0);
  
  // Stability score (penalize extreme values)
  const maxCoeff = Math.max(...kernel.genome.bSeriesCoefficients.map(Math.abs));
  const stability = maxCoeff < 5 ? 1.0 : Math.max(0, 1 - (maxCoeff - 5) / 10);
  
  return (
    grip * 0.5 +
    complexity * 0.3 +
    stability * 0.2
  );
}

// ============================================================================
// Run Evolution
// ============================================================================

async function runEvolution() {
  console.log('🧬 Initializing evolution with diverse seed kernels...\n');
  
  const seeds = [
    UniversalKernelGenerator.generatePhysicsKernel(4),
    UniversalKernelGenerator.generateChemistryKernel(4),
    UniversalKernelGenerator.generateBiologyKernel(4),
    UniversalKernelGenerator.generateConsciousnessKernel(4),
  ];
  
  console.log(`Seed kernels: ${seeds.map(k => k.genome.domain).join(', ')}\n`);
  
  console.log('⚙️ Evolution parameters:');
  console.log('  Population size: 20');
  console.log('  Mutation rate: 0.15');
  console.log('  Crossover rate: 0.80');
  console.log('  Elite preservation: 15%');
  console.log('  Max generations: 15');
  console.log('  Diversity pressure: 0.25\n');
  
  const result = await runOntogenesis({
    evolution: {
      populationSize: 20,
      mutationRate: 0.15,
      crossoverRate: 0.80,
      elitismRate: 0.15,
      maxGenerations: 15,
      fitnessThreshold: 0.90,
      diversityPressure: 0.25,
      noveltyWeight: 0.15,
    },
    seedKernels: seeds,
    fitnessFunction: evaluateFitness,
  });
  
  // ============================================================================
  // Display Results
  // ============================================================================
  
  console.log('📈 Evolution Progress:\n');
  console.log('Gen | Best    | Avg     | Worst   | Diversity | New');
  console.log('----|---------|---------|---------|-----------|----');
  
  result.generations.forEach(gen => {
    console.log(
      `${gen.generation.toString().padStart(3)} | ` +
      `${gen.bestFitness.toFixed(5)} | ` +
      `${gen.averageFitness.toFixed(5)} | ` +
      `${gen.worstFitness.toFixed(5)} | ` +
      `${gen.diversity.toFixed(7)} | ` +
      `${gen.newKernels.toString().padStart(2)}`
    );
  });
  
  console.log('\n✨ Evolution Results:\n');
  console.log(`Total Generations: ${result.totalGenerations}`);
  console.log(`Converged: ${result.converged ? 'Yes ✓' : 'No'}`);
  console.log(`Final Population Size: ${result.finalPopulation.length}\n`);
  
  console.log('🏆 Best Kernel:');
  console.log(`  ID: ${result.bestKernel.genome.id.substring(0, 30)}...`);
  console.log(`  Domain: ${result.bestKernel.genome.domain}`);
  console.log(`  Generation: ${result.bestKernel.genome.generation}`);
  console.log(`  Age: ${result.bestKernel.genome.age}`);
  console.log(`  Fitness: ${result.bestKernel.genome.fitness.toFixed(6)}`);
  console.log(`  Stage: ${result.bestKernel.ontogeneticState.stage}`);
  console.log(`  Maturity: ${result.bestKernel.ontogeneticState.maturity.toFixed(2)}\n`);
  
  console.log('🔬 Grip Analysis:');
  console.log(`  Overall: ${result.bestKernel.grip.overall.toFixed(4)}`);
  console.log(`  Contact: ${result.bestKernel.grip.contact.toFixed(4)}`);
  console.log(`  Coverage: ${result.bestKernel.grip.coverage.toFixed(4)}`);
  console.log(`  Efficiency: ${result.bestKernel.grip.efficiency.toFixed(4)}`);
  console.log(`  Stability: ${result.bestKernel.grip.stability.toFixed(4)}\n`);
  
  console.log('🧬 Genetic Profile:');
  console.log(`  Coefficients: [${result.bestKernel.genome.bSeriesCoefficients.slice(0, 6).map(c => c.toFixed(3)).join(', ')}...]`);
  console.log(`  Lineage depth: ${result.bestKernel.genome.lineage.length} ancestors`);
  console.log(`  Gene count: ${result.bestKernel.genome.genes.length}\n`);
  
  // ============================================================================
  // Analyze Evolution Trends
  // ============================================================================
  
  console.log('📊 Evolution Trends:\n');
  
  const firstGen = result.generations[0];
  const lastGen = result.generations[result.generations.length - 1];
  
  const fitnessImprovement = ((lastGen.bestFitness - firstGen.bestFitness) / firstGen.bestFitness) * 100;
  const avgFitnessImprovement = ((lastGen.averageFitness - firstGen.averageFitness) / firstGen.averageFitness) * 100;
  
  console.log(`Best Fitness Improvement: ${fitnessImprovement > 0 ? '+' : ''}${fitnessImprovement.toFixed(2)}%`);
  console.log(`Avg Fitness Improvement: ${avgFitnessImprovement > 0 ? '+' : ''}${avgFitnessImprovement.toFixed(2)}%`);
  console.log(`Diversity Change: ${firstGen.diversity.toFixed(4)} → ${lastGen.diversity.toFixed(4)}\n`);
  
  console.log('✅ Population evolution complete!\n');
}

runEvolution().catch(console.error);
