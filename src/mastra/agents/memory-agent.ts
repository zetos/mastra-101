import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore, LibSQLVector } from '@mastra/libsql';

// Create a memory instance with semantic recall configuration
const memory = new Memory({
  storage: new LibSQLStore({
    url: 'file:../basic-memory.db', // relative path from `.mastra/output` directory
  }), // Storage for message history
  vector: new LibSQLVector({
    connectionUrl: 'file:../basic-vector.db', // relative path from `.mastra/output` directory
  }), // Vector database for semantic search
  embedder: 'openai/text-embedding-3-small', // Embedder for message embeddings
  options: {
    lastMessages: 20, // Include the last 20 messages in the context instead of default 10
    semanticRecall: {
      topK: 3, // how many semantically similar messages are retrieved; default 4
      messageRange: {
        // parameter controls how much context is included with each match.
        before: 2,
        after: 1,
      },
    },
  },
});

// Create an agent with memory
export const memoryAgent = new Agent({
  name: 'MemoryAgent',
  instructions: `
    You are a helpful assistant with memory capabilities.
    You can remember previous conversations and user preferences.
    When a user shares information about themselves, acknowledge it and remember it for future reference.
    If asked about something mentioned earlier in the conversation, recall it accurately.
  `,
  model: 'openai/gpt-5-mini',
  memory: memory,
});
