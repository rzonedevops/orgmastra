/**
 * Kernel utilities for creating and managing computational kernels
 */

import type { 
  Kernel, 
  KernelGenome, 
  OntogeneticState, 
  DomainType,
  KernelGene,
  DifferentialOperator,
  DifferentialOperatorType,
} from './types';
import { calculateGrip } from './grip';
import { generateDefaultCoefficients } from './b-series';

/**
 * Generate unique kernel ID
 */
function generateKernelId(): string {
  return `kernel_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Create a new kernel genome
 * 
 * @param options - Kernel creation options
 * @returns New kernel genome
 */
export function createKernelGenome(options: {
  domain: DomainType;
  order: number;
  coefficients?: number[];
  lineage?: string[];
  generation?: number;
}): KernelGenome {
  const { domain, order, lineage = [], generation = 0 } = options;
  
  // Generate or use provided coefficients
  const bSeriesCoefficients = options.coefficients || generateDefaultCoefficients(domain, order);
  
  // Create genes from coefficients
  const genes: KernelGene[] = bSeriesCoefficients.map((value, idx) => ({
    type: 'coefficient',
    value,
    mutable: true,
    domain,
    metadata: { index: idx, order: Math.floor(Math.log2(idx + 1)) + 1 },
  }));
  
  // Add operator genes
  const operatorGenes: KernelGene[] = [
    { type: 'operator', value: 'chain', mutable: false, domain },
    { type: 'operator', value: 'product', mutable: false, domain },
  ];
  
  genes.push(...operatorGenes);
  
  return {
    id: generateKernelId(),
    generation,
    lineage,
    genes,
    fitness: 0.5, // Initial neutral fitness
    age: 0,
    bSeriesCoefficients,
    differentialOperators: createDifferentialOperators(),
    domain,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Create initial ontogenetic state
 */
export function createOntogeneticState(): OntogeneticState {
  return {
    stage: 'embryonic',
    maturity: 0,
    experience: 0,
    developmentEvents: [],
    metadata: {},
  };
}

/**
 * Create differential operators
 */
function createDifferentialOperators(): DifferentialOperator[] {
  return [
    createChainOperator(),
    createProductOperator(),
    createQuotientOperator(),
    createSumOperator(),
  ];
}

/**
 * Create chain rule operator: (f∘g)' = f'(g) · g'
 */
function createChainOperator(): DifferentialOperator {
  return {
    type: 'chain',
    apply: (kernel1: Kernel, kernel2?: Kernel) => {
      if (!kernel2) {
        // Self-composition: f∘f
        return composeKernels(kernel1, kernel1);
      }
      return composeKernels(kernel1, kernel2);
    },
    compatible: (domain1, domain2) => {
      // Chain rule works best when domains match or are compatible
      if (!domain2) return true;
      return domain1 === domain2 || domain1 === 'general' || domain2 === 'general';
    },
  };
}

/**
 * Create product rule operator: (f·g)' = f'·g + f·g'
 */
function createProductOperator(): DifferentialOperator {
  return {
    type: 'product',
    apply: (kernel1: Kernel, kernel2?: Kernel) => {
      if (!kernel2) {
        // Self-product: f·f
        return multiplyKernels(kernel1, kernel1);
      }
      return multiplyKernels(kernel1, kernel2);
    },
    compatible: (domain1, domain2) => {
      // Product works for all domains
      return true;
    },
  };
}

/**
 * Create quotient rule operator: (f/g)' = (f'·g - f·g')/g²
 */
function createQuotientOperator(): DifferentialOperator {
  return {
    type: 'quotient',
    apply: (kernel1: Kernel, kernel2?: Kernel) => {
      if (!kernel2) {
        throw new Error('Quotient operator requires two kernels');
      }
      return divideKernels(kernel1, kernel2);
    },
    compatible: (domain1, domain2) => {
      // Quotient requires compatible domains
      if (!domain2) return false;
      return domain1 === domain2;
    },
  };
}

/**
 * Create sum operator: (f+g)' = f' + g'
 */
function createSumOperator(): DifferentialOperator {
  return {
    type: 'sum',
    apply: (kernel1: Kernel, kernel2?: Kernel) => {
      if (!kernel2) {
        // Self-sum: 2f
        return scaleKernel(kernel1, 2);
      }
      return addKernels(kernel1, kernel2);
    },
    compatible: () => true,
  };
}

/**
 * Compose two kernels using chain rule
 */
function composeKernels(f: Kernel, g: Kernel): Kernel {
  // Simplified composition: combine coefficients
  // In full implementation, this uses rooted tree composition
  
  const maxLength = Math.max(f.genome.bSeriesCoefficients.length, g.genome.bSeriesCoefficients.length);
  const newCoeffs: number[] = new Array(maxLength).fill(0);
  
  // Chain rule approximately: weighted sum
  for (let i = 0; i < maxLength; i++) {
    const fCoeff = i < f.genome.bSeriesCoefficients.length ? (f.genome.bSeriesCoefficients[i] || 0) : 0;
    const gCoeff = i < g.genome.bSeriesCoefficients.length ? (g.genome.bSeriesCoefficients[i] || 0) : 0;
    newCoeffs[i] = fCoeff * gCoeff;
  }
  
  return createKernel({
    domain: f.genome.domain,
    order: maxLength,
    coefficients: newCoeffs,
    lineage: [f.genome.id, g.genome.id],
    generation: Math.max(f.genome.generation, g.genome.generation) + 1,
  });
}

/**
 * Multiply two kernels using product rule
 */
function multiplyKernels(f: Kernel, g: Kernel): Kernel {
  const maxLength = Math.max(f.genome.bSeriesCoefficients.length, g.genome.bSeriesCoefficients.length);
  const newCoeffs: number[] = new Array(maxLength).fill(0);
  
  for (let i = 0; i < maxLength; i++) {
    const fCoeff = i < f.genome.bSeriesCoefficients.length ? (f.genome.bSeriesCoefficients[i] || 0) : 0;
    const gCoeff = i < g.genome.bSeriesCoefficients.length ? (g.genome.bSeriesCoefficients[i] || 0) : 0;
    // Product rule: f'·g + f·g' simplified as sum
    newCoeffs[i] = fCoeff + gCoeff;
  }
  
  return createKernel({
    domain: f.genome.domain,
    order: maxLength,
    coefficients: newCoeffs,
    lineage: [f.genome.id, g.genome.id],
    generation: Math.max(f.genome.generation, g.genome.generation) + 1,
  });
}

/**
 * Divide two kernels using quotient rule
 */
function divideKernels(f: Kernel, g: Kernel): Kernel {
  const maxLength = Math.max(f.genome.bSeriesCoefficients.length, g.genome.bSeriesCoefficients.length);
  const newCoeffs: number[] = new Array(maxLength).fill(0);
  
  for (let i = 0; i < maxLength; i++) {
    const fCoeff = i < f.genome.bSeriesCoefficients.length ? (f.genome.bSeriesCoefficients[i] || 0) : 0;
    const gCoeff = i < g.genome.bSeriesCoefficients.length ? (g.genome.bSeriesCoefficients[i] || 0) : 0;
    
    // Avoid division by zero
    if (Math.abs(gCoeff) < 1e-10) {
      newCoeffs[i] = fCoeff;
    } else {
      newCoeffs[i] = fCoeff / gCoeff;
    }
  }
  
  return createKernel({
    domain: f.genome.domain,
    order: maxLength,
    coefficients: newCoeffs,
    lineage: [f.genome.id, g.genome.id],
    generation: Math.max(f.genome.generation, g.genome.generation) + 1,
  });
}

/**
 * Add two kernels
 */
function addKernels(f: Kernel, g: Kernel): Kernel {
  const maxLength = Math.max(f.genome.bSeriesCoefficients.length, g.genome.bSeriesCoefficients.length);
  const newCoeffs: number[] = new Array(maxLength).fill(0);
  
  for (let i = 0; i < maxLength; i++) {
    const fCoeff = i < f.genome.bSeriesCoefficients.length ? (f.genome.bSeriesCoefficients[i] || 0) : 0;
    const gCoeff = i < g.genome.bSeriesCoefficients.length ? (g.genome.bSeriesCoefficients[i] || 0) : 0;
    newCoeffs[i] = fCoeff + gCoeff;
  }
  
  return createKernel({
    domain: f.genome.domain,
    order: maxLength,
    coefficients: newCoeffs,
    lineage: [f.genome.id, g.genome.id],
    generation: Math.max(f.genome.generation, g.genome.generation) + 1,
  });
}

/**
 * Scale a kernel by a constant
 */
function scaleKernel(kernel: Kernel, scalar: number): Kernel {
  const newCoeffs = kernel.genome.bSeriesCoefficients.map(c => c * scalar);
  
  return createKernel({
    domain: kernel.genome.domain,
    order: newCoeffs.length,
    coefficients: newCoeffs,
    lineage: [kernel.genome.id],
    generation: kernel.genome.generation + 1,
  });
}

/**
 * Create a new kernel
 * 
 * @param options - Kernel options
 * @returns New kernel
 */
export function createKernel(options: {
  domain: DomainType;
  order: number;
  coefficients?: number[];
  lineage?: string[];
  generation?: number;
}): Kernel {
  const genome = createKernelGenome(options);
  const ontogeneticState = createOntogeneticState();
  
  // Create basic execute function
  const execute = (input: any) => {
    // Simplified execution - in production, this would use full B-series
    if (typeof input === 'number') {
      return input + (genome.bSeriesCoefficients[0] || 0) * input;
    }
    return input;
  };
  
  const kernel: Kernel = {
    genome,
    ontogeneticState,
    grip: { contact: 0, coverage: 0, efficiency: 0, stability: 0, overall: 0 },
    execute,
    metadata: {},
  };
  
  // Calculate initial grip
  kernel.grip = calculateGrip(kernel);
  
  return kernel;
}

/**
 * Initialize an ontogenetic kernel from base parameters
 * 
 * @param domain - Domain type
 * @param order - Kernel order
 * @returns Initialized kernel
 */
export function initializeOntogeneticKernel(domain: DomainType, order: number = 4): Kernel {
  return createKernel({ domain, order });
}

/**
 * Clone a kernel
 * 
 * @param kernel - Kernel to clone
 * @param mutate - Whether to apply mutations
 * @param mutationRate - Mutation rate if mutating
 * @returns Cloned kernel
 */
export function cloneKernel(kernel: Kernel, mutate: boolean = false, mutationRate: number = 0.1): Kernel {
  const coefficients = [...kernel.genome.bSeriesCoefficients];
  
  if (mutate) {
    for (let i = 0; i < coefficients.length; i++) {
      if (Math.random() < mutationRate && coefficients[i] !== undefined) {
        // Mutate coefficient by ±10%
        coefficients[i]! += coefficients[i]! * (Math.random() * 0.2 - 0.1);
      }
    }
  }
  
  return createKernel({
    domain: kernel.genome.domain,
    order: coefficients.length,
    coefficients,
    lineage: [kernel.genome.id],
    generation: kernel.genome.generation + 1,
  });
}
