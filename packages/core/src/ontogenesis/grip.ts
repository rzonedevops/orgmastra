/**
 * Grip metric calculation
 * 
 * Grip measures how well a kernel's differential structure matches its domain.
 * Perfect grip (1.0) = perfect computation in that domain.
 */

import type { Kernel, GripMetric, DomainType } from './types';

/**
 * Calculate grip metric for a kernel
 * 
 * @param kernel - The kernel to evaluate
 * @param domain - Optional domain to evaluate against (uses kernel's domain if not provided)
 * @returns Grip metric with component scores
 */
export function calculateGrip(kernel: Kernel, domain?: DomainType): GripMetric {
  const targetDomain = domain || kernel.genome.domain;
  
  const contact = calculateContact(kernel, targetDomain);
  const coverage = calculateCoverage(kernel, targetDomain);
  const efficiency = calculateEfficiency(kernel);
  const stability = calculateStability(kernel);
  
  // Weighted combination
  const overall = (
    contact * 0.4 +
    coverage * 0.3 +
    efficiency * 0.2 +
    stability * 0.1
  );
  
  return {
    contact,
    coverage,
    efficiency,
    stability,
    overall,
  };
}

/**
 * Calculate contact - how well kernel touches the domain
 */
function calculateContact(kernel: Kernel, domain: DomainType): number {
  const { bSeriesCoefficients } = kernel.genome;
  
  // Domain-specific contact patterns
  const domainPatterns = getDomainPatterns(domain);
  
  // Check if coefficient pattern matches domain expectations
  let matchScore = 0;
  let totalChecks = domainPatterns.length;
  
  for (const pattern of domainPatterns) {
    if (pattern.check(bSeriesCoefficients)) {
      matchScore += 1;
    }
  }
  
  // Also check if domain field matches
  if (kernel.genome.domain === domain) {
    matchScore += 1;
    totalChecks += 1;
  }
  
  return totalChecks > 0 ? matchScore / totalChecks : 0.5;
}

/**
 * Calculate coverage - completeness of domain span
 */
function calculateCoverage(kernel: Kernel, domain: DomainType): number {
  const { bSeriesCoefficients } = kernel.genome;
  
  // Coverage based on number of non-zero coefficients
  // Higher order = better coverage
  const nonZeroCount = bSeriesCoefficients.filter(c => Math.abs(c) > 1e-10).length;
  const totalCoefficients = bSeriesCoefficients.length;
  
  if (totalCoefficients === 0) return 0;
  
  const baseCoverage = nonZeroCount / totalCoefficients;
  
  // Bonus for higher orders (more sophisticated kernels)
  const orderBonus = Math.min(totalCoefficients / 20, 1.0) * 0.2;
  
  return Math.min(baseCoverage + orderBonus, 1.0);
}

/**
 * Calculate efficiency - computational cost
 */
function calculateEfficiency(kernel: Kernel): number {
  const { bSeriesCoefficients } = kernel.genome;
  
  // Efficiency is higher for simpler kernels (fewer non-zero coefficients)
  const nonZeroCount = bSeriesCoefficients.filter(c => Math.abs(c) > 1e-10).length;
  const totalCoefficients = bSeriesCoefficients.length;
  
  if (totalCoefficients === 0) return 1.0;
  
  // Simple kernels are more efficient
  const simplicity = 1 - (nonZeroCount / totalCoefficients);
  
  // But not too simple - penalize if less than 3 coefficients
  const complexityPenalty = nonZeroCount < 3 ? 0.3 : 0;
  
  return Math.max(0, simplicity - complexityPenalty);
}

/**
 * Calculate stability - numerical properties
 */
function calculateStability(kernel: Kernel): number {
  const { bSeriesCoefficients } = kernel.genome;
  
  if (bSeriesCoefficients.length === 0) return 0;
  
  // Check coefficient magnitude (too large = unstable)
  const maxCoeff = Math.max(...bSeriesCoefficients.map(Math.abs));
  const magnitudeScore = maxCoeff < 10 ? 1.0 : Math.max(0, 1 - (maxCoeff - 10) / 100);
  
  // Check coefficient variance (too variable = unstable)
  const mean = bSeriesCoefficients.reduce((a, b) => a + b, 0) / bSeriesCoefficients.length;
  const variance = bSeriesCoefficients.reduce((sum, c) => sum + Math.pow(c - mean, 2), 0) / bSeriesCoefficients.length;
  const varianceScore = variance < 1 ? 1.0 : Math.max(0, 1 - variance / 10);
  
  return (magnitudeScore + varianceScore) / 2;
}

/**
 * Get domain-specific patterns for contact calculation
 */
function getDomainPatterns(domain: DomainType): Array<{ check: (coeffs: number[]) => boolean }> {
  switch (domain) {
    case 'physics':
      // Physics kernels should preserve symplectic structure
      // Often have symmetric coefficient patterns
      return [
        { check: (coeffs) => coeffs.length >= 4 }, // At least order 4
        { check: (coeffs) => Math.abs(coeffs[0] || 0) > 0 }, // Non-zero base
      ];
    
    case 'chemistry':
      // Chemistry kernels preserve mass conservation
      // Sum of coefficients should be near 1
      return [
        { check: (coeffs) => {
          const sum = coeffs.reduce((a, b) => a + b, 0);
          return Math.abs(sum - 1) < 0.1;
        }},
      ];
    
    case 'biology':
      // Biology kernels preserve homeostasis
      // Typically have bounded growth
      return [
        { check: (coeffs) => coeffs.every(c => Math.abs(c) < 5) }, // Bounded coefficients
      ];
    
    case 'computing':
      // Computing kernels preserve Church-Rosser property
      // Often have recursive structure
      return [
        { check: (coeffs) => coeffs.length >= 2 }, // At least basic recursion
      ];
    
    case 'consciousness':
      // Consciousness kernels have self-reference
      // Echo structure with feedback
      return [
        { check: (coeffs) => coeffs.length >= 3 }, // Complex enough for self-reference
        { check: (coeffs) => Math.abs(coeffs[coeffs.length - 1] || 0) > 0 }, // Non-zero highest order
      ];
    
    case 'general':
    default:
      // General kernels have basic validity
      return [
        { check: (coeffs) => coeffs.length > 0 },
        { check: (coeffs) => coeffs.some(c => Math.abs(c) > 0) },
      ];
  }
}

/**
 * Update grip metric for a kernel
 * 
 * @param kernel - The kernel to update
 * @returns Updated kernel with new grip metric
 */
export function updateGrip(kernel: Kernel): Kernel {
  const newGrip = calculateGrip(kernel);
  
  return {
    ...kernel,
    grip: newGrip,
  };
}

/**
 * Calculate genetic distance between two kernels
 * 
 * @param kernel1 - First kernel
 * @param kernel2 - Second kernel
 * @returns Distance metric (0 = identical, 1 = maximally different)
 */
export function calculateGeneticDistance(kernel1: Kernel, kernel2: Kernel): number {
  const coeffs1 = kernel1.genome.bSeriesCoefficients;
  const coeffs2 = kernel2.genome.bSeriesCoefficients;
  
  // Euclidean distance normalized by vector length
  const maxLength = Math.max(coeffs1.length, coeffs2.length);
  let sumSquaredDiff = 0;
  
  for (let i = 0; i < maxLength; i++) {
    const c1 = i < coeffs1.length ? (coeffs1[i] || 0) : 0;
    const c2 = i < coeffs2.length ? (coeffs2[i] || 0) : 0;
    sumSquaredDiff += Math.pow(c1 - c2, 2);
  }
  
  // Normalize to 0-1 range
  const distance = Math.sqrt(sumSquaredDiff);
  return Math.min(distance / 10, 1.0); // Cap at 1.0
}

/**
 * Calculate population diversity
 * 
 * @param population - Array of kernels
 * @returns Diversity metric (0 = all identical, 1 = maximally diverse)
 */
export function calculatePopulationDiversity(population: Kernel[]): number {
  if (population.length < 2) return 0;
  
  let totalDistance = 0;
  let comparisons = 0;
  
  // Calculate pairwise distances
  for (let i = 0; i < population.length; i++) {
    for (let j = i + 1; j < population.length; j++) {
      const kernel1 = population[i];
      const kernel2 = population[j];
      if (kernel1 && kernel2) {
        totalDistance += calculateGeneticDistance(kernel1, kernel2);
        comparisons++;
      }
    }
  }
  
  return comparisons > 0 ? totalDistance / comparisons : 0;
}
