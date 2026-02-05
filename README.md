# Mastra

[![npm version](https://badge.fury.io/js/@mastra%2Fcore.svg)](https://www.npmjs.com/package/@mastra/core)
[![CodeQl](https://github.com/mastra-ai/mastra/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/mastra-ai/mastra/actions/workflows/github-code-scanning/codeql)
[![GitHub Repo stars](https://img.shields.io/github/stars/mastra-ai/mastra)](https://github.com/mastra-ai/mastra/stargazers)
[![Discord](https://img.shields.io/discord/1309558646228779139?logo=discord&label=Discord&labelColor=white&color=7289DA)](https://discord.gg/BTYqqHKUrf)
[![Twitter Follow](https://img.shields.io/twitter/follow/mastra_ai?style=social)](https://x.com/mastra_ai)
[![NPM Downloads](https://img.shields.io/npm/dm/%40mastra%252Fcore)](https://www.npmjs.com/package/@mastra/core)
[![Static Badge](https://img.shields.io/badge/Y%20Combinator-W25-orange)](https://www.ycombinator.com/companies?batch=W25)

Mastra is the Typescript framework for building AI agents and assistants. It’s used by some of the largest companies in the world to build internal AI automation tooling and customer-facing agents.

You can run Mastra on your local machine, bundle it into a Node.js server with Hono, or deploy to a serverless cloud.

The main Mastra features are:

| Features                                               | Description                                                                                                                                                                                                                                                                                            |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| LLM Models                                             | Mastra uses the [Vercel AI SDK](https://sdk.vercel.ai/docs/introduction) for model routing, providing a unified interface to interact with any LLM provider including OpenAI, Anthropic, and Google Gemini. You can choose the specific model and provider, and decide whether to stream the response. |
| [Agents](https://mastra.ai/docs/agents/overview)       | Agents are systems where the language model chooses a sequence of actions. In Mastra, agents provide LLM models with tools, workflows, and synced data. Agents can call your own functions or APIs of third-party integrations and access knowledge bases you build.                                   |
| [Tools](https://mastra.ai/docs/agents/adding-tools)    | Tools are typed functions that can be executed by agents or workflows, with built-in integration access and parameter validation. Each tool has a schema that defines its inputs, an executor function that implements its logic, and access to configured integrations.                               |
| [Workflows](https://mastra.ai/docs/workflows/overview) | Workflows are durable graph-based state machines. They have loops, branching, wait for human input, embed other workflows, do error handling, retries, parsing and so on. They can be built in code or with a visual editor. Each step in a workflow has built-in OpenTelemetry tracing.               |
| [RAG](https://mastra.ai/docs/rag/overview)             | Retrieval-augmented generation (RAG) lets you construct a knowledge base for agents. RAG is an ETL pipeline with specific querying techniques, including chunking, embedding, and vector search.                                                                                                       |
| [Integrations](https://mastra.ai/docs/integrations)    | In Mastra, integrations are auto-generated, type-safe API clients for third-party services that can be used as tools for agents or steps in workflows.                                                                                                                                                 |
| [Evals](https://mastra.ai/docs/08-running-evals)       | Evals are automated tests that evaluate LLM outputs using model-graded, rule-based, and statistical methods. Each eval returns a normalized score between 0-1 that can be logged and compared. Evals can be customized with your own prompts and scoring functions.                                    |
| **Ontogenesis** (New!)                                  | Self-evolving computational kernels and agents based on B-Series expansion as genetic code. Enables agents to self-generate, self-optimize, and reproduce through differential calculus, with population-based evolution for continuous improvement.                                                    |

## 🧬 Ontogenetic Evolution (OrgMastra)

**OrgMastra** extends Mastra with self-evolving capabilities inspired by biological development and evolutionary computation. Agents and computational kernels can now:

- **Self-Generate**: Create offspring through recursive composition (chain rule: f∘f)
- **Self-Optimize**: Improve themselves by maximizing "grip" on their domain
- **Self-Reproduce**: Combine genetic material via crossover and mutation
- **Evolve Populations**: Multi-generation evolution with natural selection

### Quick Example

```typescript
import { 
  UniversalKernelGenerator, 
  selfOptimize, 
  runOntogenesis 
} from '@mastra/core';

// Generate a consciousness kernel
const kernel = UniversalKernelGenerator.generateConsciousnessKernel(4);

// Self-optimize to improve domain fit
const optimized = selfOptimize(kernel, {
  iterations: 30,
  learningRate: 0.02,
});

// Evolve a population over multiple generations
const result = await runOntogenesis({
  evolution: {
    populationSize: 20,
    mutationRate: 0.15,
    maxGenerations: 50,
  },
  fitnessFunction: (kernel) => kernel.grip.overall,
});

console.log(`Best fitness: ${result.bestKernel.genome.fitness}`);
```

### Key Concepts

**Kernel Genome**: The "DNA" of computational structures, implemented as B-Series coefficients (genetic code) and elementary differentials following the A000081 sequence (1, 1, 2, 4, 9, 20, 48...).

**Grip Metric**: Measures how well a kernel fits its domain across four dimensions:
- Contact (40%): How well the kernel touches the domain
- Coverage (30%): Completeness of domain span
- Efficiency (20%): Computational cost
- Stability (10%): Numerical properties

**Perfect grip (1.0) = Perfect computation in that domain.**

**Domain-Specific Kernels**: Generate specialized kernels for Physics (Hamiltonian trees), Chemistry (reaction networks), Biology (metabolic systems), Computing (recursion), and Consciousness (echo states).

See [examples/ontogenesis-demo](./examples/ontogenesis-demo) for complete working examples.

| **Ontogenesis** (New!)                                  | Self-evolving computational kernels and agents based on B-Series expansion as genetic code. Enables agents to self-generate, self-optimize, and reproduce through differential calculus, with population-based evolution for continuous improvement.                                                    |

## Quick Start

### Prerequisites

- Node.js (v20.0+)

## Get an LLM provider API key

If you don't have an API key for an LLM provider, you can get one from the following services:

- [OpenAI](https://platform.openai.com/)
- [Anthropic](https://console.anthropic.com/settings/keys)
- [Google Gemini](https://ai.google.dev/gemini-api/docs)
- [Groq](https://console.groq.com/docs/overview)
- [Cerebras](https://inference-docs.cerebras.ai/introduction)

If you don't have an account with these providers, you can sign up and get an API key. Anthropic require a credit card to get an API key. Some OpenAI models and Gemini do not and have a generous free tier for its API.

## Create a new project

The easiest way to get started with Mastra is by using `create-mastra`. This CLI tool enables you to quickly start building a new Mastra application, with everything set up for you.

```bash
npx create-mastra@latest
```

### Run the script

Finally, run `mastra dev` to open the Mastra playground.

```bash copy
npm run dev
```

If you're using Anthropic, set the `ANTHROPIC_API_KEY`. If you're using Gemini, set the `GOOGLE_GENERATIVE_AI_API_KEY`.

# MCP Server ([@mastra/mcp-docs-server](https://www.npmjs.com/package/@mastra/mcp-docs-server))

Use our MCP server [@mastra/mcp-docs-server](https://www.npmjs.com/package/@mastra/mcp-docs-server) to teach your LLM how to use Mastra.

This is a Model Context Protocol (MCP) server that provides AI assistants with direct access to Mastra.ai's complete knowledge base.

## In Cursor

Create or update .cursor/mcp.json in your project root:

### MacOS/Linux

```
{
  "mcpServers": {
    "mastra": {
      "command": "npx",
      "args": ["-y", "@mastra/mcp-docs-server"]
    }
  }
}
```

### Windows

```
{
  "mcpServers": {
    "mastra": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@mastra/mcp-docs-server"]
    }
  }
}
```

This will make all Mastra documentation tools available in your Cursor workspace. Note that the MCP server wont be enabled by default. You'll need to go to Cursor settings -> MCP settings and click "enable" on the Mastra MCP server.

## In Windsurf

Create or update ~/.codeium/windsurf/mcp_config.json:

### MacOS/Linux

```
{
  "mcpServers": {
    "mastra": {
      "command": "npx",
      "args": ["-y", "@mastra/mcp-docs-server"]
    }
  }
}
```

For more installation options visit [https://www.npmjs.com/package/@mastra/mcp-docs-server](https://www.npmjs.com/package/@mastra/mcp-docs-server)

## Contributing

Looking to contribute? All types of help are appreciated, from coding to testing and feature specification.

If you are a developer and would like to contribute with code, please open an issue to discuss before opening a Pull Request.

Information about the project setup can be found in the [development documentation](./DEVELOPMENT.md)

## Support

We have an [open community Discord](https://discord.gg/BTYqqHKUrf). Come and say hello and let us know if you have any questions or need any help getting things running.

It's also super helpful if you leave the project a star here at the [top of the page](https://github.com/mastra-ai/mastra)

## Security

We are committed to maintaining the security of this repo and of Mastra as a whole. If you discover a security finding
we ask you to please responsibly disclose this to us at [security@mastra.ai](mailto:security@mastra.ai) and we will get
back to you.
