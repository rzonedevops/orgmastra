/**
 * Ontogenetic Agent Extensions
 * 
 * Extends the Agent class with self-evolution capabilities including
 * genome tracking, self-generation, optimization, and reproduction.
 */

import type { Agent } from '../agent';
import type { 
  Kernel, 
  OntogeneticState, 
  OptimizationOptions,
  ReproductionOptions,
  DomainType,
} from './types';
import { createKernel, createKernelGenome, createOntogeneticState } from './kernel';
import { selfGenerate, selfOptimize, selfReproduce } from './evolution';
import { calculateGrip } from './grip';

/**
 * Ontogenetic Agent - Agent with self-evolution capabilities
 */
export interface OntogeneticAgent<TAgentId extends string = string> {
  /** Base agent */
  agent: Agent<TAgentId>;
  /** Kernel genome representing agent's computational structure */
  kernel: Kernel;
  /** Ontogenetic state */
  ontogeneticState: OntogeneticState;
  
  // Self-evolution methods
  selfGenerate(): OntogeneticAgent<TAgentId>;
  selfOptimize(options: OptimizationOptions): OntogeneticAgent<TAgentId>;
  reproduce(partner: OntogeneticAgent<TAgentId>, options: ReproductionOptions): OntogeneticAgent<TAgentId>;
}

/**
 * Options for initializing an ontogenetic agent
 */
export interface InitializeOntogeneticAgentOptions {
  /** Domain type for the agent's kernel */
  domain?: DomainType;
  /** Kernel order */
  order?: number;
  /** Custom B-series coefficients */
  coefficients?: number[];
  /** Initial fitness */
  initialFitness?: number;
}

/**
 * Initialize an agent with ontogenetic capabilities
 * 
 * @param agent - Base Mastra agent
 * @param options - Initialization options
 * @returns Ontogenetic agent with self-evolution capabilities
 */
export function initializeOntogeneticAgent<TAgentId extends string = string>(
  agent: Agent<TAgentId>,
  options: InitializeOntogeneticAgentOptions = {}
): OntogeneticAgent<TAgentId> {
  const {
    domain = 'consciousness', // Default to consciousness for AI agents
    order = 4,
    coefficients,
    initialFitness = 0.5,
  } = options;
  
  // Create kernel for agent
  const kernel = createKernel({
    domain,
    order,
    coefficients,
  });
  
  // Set initial fitness
  kernel.genome.fitness = initialFitness;
  
  // Update grip
  kernel.grip = calculateGrip(kernel);
  
  // Create ontogenetic state
  const ontogeneticState = createOntogeneticState();
  
  const ontogeneticAgent: OntogeneticAgent<TAgentId> = {
    agent,
    kernel,
    ontogeneticState,
    
    selfGenerate() {
      const offspringKernel = selfGenerate(this.kernel);
      
      // Create offspring agent (same configuration, new kernel)
      return {
        ...this,
        kernel: offspringKernel,
        ontogeneticState: offspringKernel.ontogeneticState,
      };
    },
    
    selfOptimize(optimizationOptions: OptimizationOptions) {
      const optimizedKernel = selfOptimize(this.kernel, optimizationOptions);
      
      // Update agent with optimized kernel
      return {
        ...this,
        kernel: optimizedKernel,
        ontogeneticState: optimizedKernel.ontogeneticState,
      };
    },
    
    reproduce(partner: OntogeneticAgent<TAgentId>, reproductionOptions: ReproductionOptions) {
      const offspringKernel = selfReproduce(this.kernel, partner.kernel, reproductionOptions);
      
      // Create offspring agent
      return {
        ...this,
        kernel: offspringKernel,
        ontogeneticState: offspringKernel.ontogeneticState,
      };
    },
  };
  
  return ontogeneticAgent;
}

/**
 * Serialize ontogenetic agent genome to JSON
 * 
 * @param agent - Ontogenetic agent
 * @returns Serialized genome data
 */
export function serializeAgentGenome<TAgentId extends string = string>(
  agent: OntogeneticAgent<TAgentId>
): string {
  const data = {
    agentId: agent.agent.name,
    kernel: {
      genome: {
        ...agent.kernel.genome,
        createdAt: agent.kernel.genome.createdAt.toISOString(),
        updatedAt: agent.kernel.genome.updatedAt.toISOString(),
      },
      ontogeneticState: {
        ...agent.kernel.ontogeneticState,
        developmentEvents: agent.kernel.ontogeneticState.developmentEvents.map(event => ({
          ...event,
          timestamp: event.timestamp.toISOString(),
        })),
      },
      grip: agent.kernel.grip,
    },
  };
  
  return JSON.stringify(data, null, 2);
}

/**
 * Deserialize ontogenetic agent genome from JSON
 * 
 * @param agent - Base agent
 * @param jsonData - Serialized genome data
 * @returns Ontogenetic agent with restored genome
 */
export function deserializeAgentGenome<TAgentId extends string = string>(
  agent: Agent<TAgentId>,
  jsonData: string
): OntogeneticAgent<TAgentId> {
  const data = JSON.parse(jsonData);
  
  // Reconstruct kernel
  const kernel: Kernel = {
    genome: {
      ...data.kernel.genome,
      createdAt: new Date(data.kernel.genome.createdAt),
      updatedAt: new Date(data.kernel.genome.updatedAt),
    },
    ontogeneticState: {
      ...data.kernel.ontogeneticState,
      developmentEvents: data.kernel.ontogeneticState.developmentEvents.map((event: any) => ({
        ...event,
        timestamp: new Date(event.timestamp),
      })),
    },
    grip: data.kernel.grip,
    execute: (input: any) => input, // Placeholder execute function
    metadata: {},
  };
  
  return initializeOntogeneticAgent(agent, {
    domain: kernel.genome.domain,
    order: kernel.genome.bSeriesCoefficients.length,
    coefficients: kernel.genome.bSeriesCoefficients,
    initialFitness: kernel.genome.fitness,
  });
}

/**
 * Evaluate agent fitness based on performance metrics
 * 
 * @param agent - Ontogenetic agent
 * @param metrics - Performance metrics
 * @returns Fitness score (0-1)
 */
export function evaluateAgentFitness(
  agent: OntogeneticAgent,
  metrics: {
    taskSuccess?: number;      // 0-1
    responseQuality?: number;  // 0-1
    efficiency?: number;       // 0-1
    userSatisfaction?: number; // 0-1
  }
): number {
  const {
    taskSuccess = 0.5,
    responseQuality = 0.5,
    efficiency = 0.5,
    userSatisfaction = 0.5,
  } = metrics;
  
  // Combine kernel grip with performance metrics
  const kernelGrip = agent.kernel.grip.overall;
  
  const fitness = (
    kernelGrip * 0.2 +
    taskSuccess * 0.3 +
    responseQuality * 0.2 +
    efficiency * 0.15 +
    userSatisfaction * 0.15
  );
  
  return Math.min(1.0, Math.max(0.0, fitness));
}
