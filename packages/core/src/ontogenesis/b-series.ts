/**
 * B-Series expansion and elementary differentials
 * 
 * Implements the mathematical foundation for kernel genetic code.
 * Elementary differentials are represented as rooted trees following the A000081 sequence:
 * 1, 1, 2, 4, 9, 20, 48, 115, 286, 719, ...
 */

import type { ElementaryDifferential } from './types';

/**
 * A000081 sequence - number of rooted trees by order
 * https://oeis.org/A000081
 */
const A000081 = [0, 1, 1, 2, 4, 9, 20, 48, 115, 286, 719, 1842, 4766, 12486, 32973];

/**
 * Get number of elementary differentials for a given order
 * 
 * @param order - Order of the differential
 * @returns Number of rooted trees of that order
 */
export function getElementaryDifferentialCount(order: number): number {
  if (order < 0) return 0;
  if (order >= A000081.length) {
    throw new Error(`A000081 sequence not computed for order ${order}. Maximum order: ${A000081.length - 1}`);
  }
  return A000081[order] || 0;
}

/**
 * Generate elementary differentials up to a given order
 * 
 * @param maxOrder - Maximum order to generate
 * @returns Array of elementary differentials
 */
export function generateElementaryDifferentials(maxOrder: number): ElementaryDifferential[] {
  if (maxOrder >= A000081.length) {
    maxOrder = A000081.length - 1;
  }
  
  const differentials: ElementaryDifferential[] = [];
  
  for (let order = 1; order <= maxOrder; order++) {
    const trees = generateRootedTrees(order);
    trees.forEach((tree, idx) => {
      differentials.push({
        id: `phi_${order}_${idx}`,
        order,
        tree,
        symmetry: calculateSymmetry(tree),
      });
    });
  }
  
  return differentials;
}

/**
 * Generate all rooted trees of a given order
 * 
 * This is a simplified implementation that generates canonical tree structures.
 * For higher orders, this should use proper tree enumeration algorithms.
 * 
 * @param order - Order (number of nodes)
 * @returns Array of tree adjacency lists
 */
function generateRootedTrees(order: number): number[][][] {
  if (order === 1) {
    // Single node - no edges
    return [[[]]];
  }
  
  if (order === 2) {
    // One edge: root -> child
    return [[[1], []]];
  }
  
  if (order === 3) {
    // Two trees of order 3:
    // 1. Root with two children: root -> [child1, child2]
    // 2. Root -> child -> grandchild (chain)
    return [
      [[1, 2], [], []], // Root with two children
      [[1], [2], []],   // Chain: root -> child -> grandchild
    ];
  }
  
  if (order === 4) {
    // Four trees of order 4 (A000081(4) = 4)
    return [
      [[1, 2, 3], [], [], []], // Star: root with three children
      [[1, 2], [3], [], []],   // Root with two children, one has child
      [[1], [2, 3], [], []],   // Root -> child with two children
      [[1], [2], [3], []],     // Chain: root -> c1 -> c2 -> c3
    ];
  }
  
  // For higher orders, use a simplified generation
  // In production, this should use proper combinatorial algorithms
  const trees: number[][][] = [];
  
  // Generate a few representative structures
  // 1. Star (root with n-1 children)
  const star: number[][] = [[]];
  for (let i = 1; i < order; i++) {
    star[0]!.push(i);
    star.push([]);
  }
  trees.push(star);
  
  // 2. Chain (linear sequence)
  const chain: number[][] = [];
  for (let i = 0; i < order; i++) {
    if (i < order - 1) {
      chain.push([i + 1]);
    } else {
      chain.push([]);
    }
  }
  trees.push(chain);
  
  // 3. Balanced tree (if order allows)
  if (order >= 3) {
    const balanced: number[][] = [[1]]; // Root with one child
    for (let i = 1; i < order; i++) {
      if (i * 2 + 1 < order) {
        balanced.push([i * 2 + 1, i * 2 + 2]);
      } else if (i * 2 + 1 === order - 1) {
        balanced.push([i * 2 + 1]);
      } else {
        balanced.push([]);
      }
    }
    trees.push(balanced);
  }
  
  return trees;
}

/**
 * Calculate symmetry factor for a tree
 * 
 * The symmetry factor accounts for automorphisms of the tree structure.
 * 
 * @param tree - Tree adjacency list
 * @returns Symmetry factor (typically 1, 2, 6, etc.)
 */
function calculateSymmetry(tree: number[][]): number {
  // Simplified symmetry calculation
  // In full implementation, this should count automorphisms
  
  if (tree.length === 0) return 1;
  
  // Check for star symmetry (root with identical children)
  if (tree.length >= 2) {
    const rootChildren = tree[0];
    if (rootChildren && rootChildren.length > 1) {
      const allChildrenLeaves = rootChildren.every(child => tree[child]?.length === 0);
      if (allChildrenLeaves) {
        // Star with n identical leaves has symmetry n!
        return factorial(rootChildren.length);
      }
    }
  }
  
  // Check for chain (no symmetry except identity)
  const isChain = tree.every(children => children.length <= 1);
  if (isChain) return 1;
  
  // Default symmetry
  return 1;
}

/**
 * Calculate factorial
 */
function factorial(n: number): number {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

import type { DomainType } from './types';

/**
 * Get domain-specific patterns for contact evaluation
 */
function getDomainPatterns(domain: DomainType): Array<{ check: (coeffs: number[]) => boolean }> {
  switch (domain) {
    case 'physics':
      return [
        { check: (coeffs) => coeffs.length >= 4 },
        { check: (coeffs) => Math.abs(coeffs[0] || 0) > 0 },
        // Check for symplectic structure: alternating signs sometimes
        { check: (coeffs) => {
          let alternations = 0;
          for (let i = 1; i < coeffs.length; i++) {
            if ((coeffs[i] || 0) * (coeffs[i - 1] || 0) < 0) alternations++;
          }
          return alternations > 0;
        }},
      ];
    
    case 'chemistry':
      return [
        // Mass conservation: sum near 1
        { check: (coeffs) => Math.abs(coeffs.reduce((a, b) => a + b, 0) - 1) < 0.2 },
        // Non-negative coefficients (reaction rates)
        { check: (coeffs) => coeffs.every(c => c >= -0.1) },
      ];
    
    case 'biology':
      return [
        // Bounded growth
        { check: (coeffs) => coeffs.every(c => Math.abs(c) < 10) },
        // Stable equilibrium
        { check: (coeffs) => {
          const firstOrder = coeffs[0] || 0;
          return Math.abs(firstOrder) < 2;
        }},
      ];
    
    case 'computing':
      return [
        // Recursive structure
        { check: (coeffs) => coeffs.length >= 2 },
        // Discrete steps (often integer-ish)
        { check: (coeffs) => {
          const nearInteger = coeffs.filter(c => Math.abs(c - Math.round(c)) < 0.1);
          return nearInteger.length > coeffs.length / 2;
        }},
      ];
    
    case 'consciousness':
      return [
        // Self-reference requires higher order
        { check: (coeffs) => coeffs.length >= 3 },
        // Non-zero highest order (feedback)
        { check: (coeffs) => Math.abs(coeffs[coeffs.length - 1] || 0) > 0.01 },
        // Complex internal structure
        { check: (coeffs) => coeffs.filter(c => Math.abs(c) > 0.01).length >= 3 },
      ];
    
    default:
      return [
        { check: (coeffs) => coeffs.length > 0 },
        { check: (coeffs) => coeffs.some(c => Math.abs(c) > 0) },
      ];
  }
}

/**
 * Generate default B-Series coefficients for a domain
 * 
 * @param domain - Domain type
 * @param order - Maximum order
 * @returns Array of B-series coefficients
 */
export function generateDefaultCoefficients(domain: DomainType, order: number): number[] {
  const count = getTotalCoefficientsUpToOrder(order);
  const coeffs = new Array(count).fill(0);
  
  switch (domain) {
    case 'physics':
      // Symplectic Euler-like structure
      coeffs[0] = 1.0;  // First order
      if (count > 1) coeffs[1] = 0.5;  // Second order
      if (count > 2) coeffs[2] = 0.5;
      break;
    
    case 'chemistry':
      // Mass-conserving structure
      coeffs[0] = 1.0;
      for (let i = 1; i < count; i++) {
        coeffs[i] = 0;
      }
      break;
    
    case 'biology':
      // Logistic growth-like structure
      coeffs[0] = 1.0;
      if (count > 1) coeffs[1] = -0.5;  // Negative feedback
      break;
    
    case 'computing':
      // Euler method (basic recursion)
      coeffs[0] = 1.0;
      break;
    
    case 'consciousness':
      // Echo state structure
      coeffs[0] = 0.9;  // Leaky integration
      if (count > 2) coeffs[2] = 0.1;  // Feedback term
      break;
    
    default:
      // Standard Euler method
      coeffs[0] = 1.0;
  }
  
  return coeffs;
}

/**
 * Get total number of coefficients up to a given order
 */
function getTotalCoefficientsUpToOrder(order: number): number {
  let total = 0;
  for (let i = 1; i <= Math.min(order, A000081.length - 1); i++) {
    total += A000081[i] || 0;
  }
  return total;
}

/**
 * Apply B-Series method to evolve state
 * 
 * @param f - Derivative function
 * @param y0 - Initial state
 * @param h - Step size
 * @param coefficients - B-series coefficients
 * @returns New state
 */
export function applyBSeries(
  f: (y: number) => number,
  y0: number,
  h: number,
  coefficients: number[]
): number {
  // This is a simplified B-series application
  // Full implementation would use rooted trees and elementary differentials
  
  if (coefficients.length === 0) return y0;
  
  // Order 1: y_{n+1} = y_n + h * b_1 * f(y_n)
  let result = y0 + h * (coefficients[0] || 0) * f(y0);
  
  // Order 2+: Add higher order terms
  if (coefficients.length > 1) {
    const f1 = f(y0);
    // Simplified second order: b_2 * h^2 * f'(y) * f(y)
    // We approximate f' numerically
    const epsilon = 1e-6;
    const fPrime = (f(y0 + epsilon) - f(y0)) / epsilon;
    result += h * h * (coefficients[1] || 0) * fPrime * f1;
  }
  
  return result;
}

/**
 * Create a kernel execute function from B-series coefficients
 * 
 * @param coefficients - B-series coefficients
 * @param derivative - Derivative function (f in y' = f(y))
 * @returns Execute function
 */
export function createBSeriesExecutor(
  coefficients: number[],
  derivative: (y: number) => number
): (input: { y: number; h: number }) => number {
  return ({ y, h }) => applyBSeries(derivative, y, h, coefficients);
}
