import { config } from 'dotenv';
import { financialAgent } from './mastra/agents/financial-agent';
import { weatherAgent } from './mastra/agents/weather-agent';
import { z } from 'zod';

// Load environment variables
config();

// Example 1: Basic text generation (like OpenAI's chat completion)
async function basicAgentInteraction() {
  console.log('=== Basic Agent Interaction ===');

  const response = await financialAgent.generate(
    'What are my recent transactions?'
  );
  console.log('Response:', response.text);
}

// Example 2: Streaming responses (like OpenAI streaming)
async function streamingAgentInteraction() {
  console.log('\n=== Streaming Agent Interaction ===');

  const stream = await financialAgent.stream('Analyze my spending patterns');

  // Access the text stream from the response
  const textStream = stream.textStream;
  for await (const chunk of textStream) {
    process.stdout.write(chunk);
  }
  console.log('\n');
}

// Example 3: With custom options (temperature, maxTokens, etc.)
async function agentWithOptions() {
  console.log('\n=== Agent with Custom Options ===');

  const response = await financialAgent.generate(
    'Summarize my financial data',
    {
      modelSettings: {
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    }
  );
  console.log('Response:', response.text);
}

// Example 4: Multi-turn conversation with memory
async function conversationWithMemory() {
  console.log('\n=== Multi-turn Conversation ===');

  // First message
  const response1 = await financialAgent.generate(
    'Show me my largest transaction',
    {
      memory: {
        thread: 'user-123-thread',
        resource: 'user-123',
      },
    }
  );
  console.log('User: Show me my largest transaction');
  console.log('Agent:', response1.text);

  // Follow-up message (agent will remember context)
  const response2 = await financialAgent.generate(
    'What was the category of that transaction?',
    {
      memory: {
        thread: 'user-123-thread',
        resource: 'user-123',
      },
    }
  );
  console.log('User: What was the category of that transaction?');
  console.log('Agent:', response2.text);
}

// Example 5: Using different agents
async function multipleAgents() {
  console.log('\n=== Multiple Agents ===');

  // Financial agent
  const financialResponse = await financialAgent.generate(
    'How much did I spend on Amazon?'
  );
  console.log('Financial Agent:', financialResponse.text);

  // Weather agent
  const weatherResponse = await weatherAgent.generate(
    "What's the weather like in New York?"
  );
  console.log('Weather Agent:', weatherResponse.text);
}

// Example 6: Structured output with Zod schema
async function structuredOutputExample() {
  console.log('\n=== Structured Output ===');

  const spendingSchema = z.object({
    totalSpent: z.number(),
    categories: z.array(
      z.object({
        name: z.string(),
        amount: z.number(),
      })
    ),
    insights: z.array(z.string()),
  });

  const response = await financialAgent.generate(
    'Analyze my spending and categorize it',
    {
      structuredOutput: {
        schema: spendingSchema,
      },
    }
  );

  console.log('Structured Response:', response.object);
}

// Example 7: Tool usage control
async function toolControlExample() {
  console.log('\n=== Tool Control ===');

  // Force tool usage
  const response1 = await financialAgent.generate('Get my transactions', {
    toolChoice: 'required',
  });
  console.log('Forced tool usage:', response1.text);

  // Disable tool usage
  const response2 = await financialAgent.generate(
    'Just give me financial advice',
    {
      toolChoice: 'none',
    }
  );
  console.log('No tools:', response2.text);
}

// Run all examples
async function runExamples() {
  try {
    await basicAgentInteraction();
    await streamingAgentInteraction();
    await agentWithOptions();
    await conversationWithMemory();
    await multipleAgents();
    await structuredOutputExample();
    await toolControlExample();
  } catch (error) {
    console.error('Error:', error);
  }
}

// Export individual functions for use in your app
export {
  basicAgentInteraction,
  streamingAgentInteraction,
  agentWithOptions,
  conversationWithMemory,
  multipleAgents,
  structuredOutputExample,
  toolControlExample,
};

runExamples();
