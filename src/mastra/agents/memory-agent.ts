import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore, LibSQLVector } from '@mastra/libsql';

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
    workingMemory: {
      enabled: true,
      template: `
# User Profile

## Personal Info

- Name:
- Location:
- Timezone:

## Preferences

- Communication Style: [e.g., Formal, Casual]
- Interests:
- Favorite Topics:

## Session State

- Current Topic:
- Open Questions:
  - [Question 1]
  - [Question 2]
`,
    },
  },
});

// Create an agent with memory
export const memoryAgent = new Agent({
  name: 'MemoryAgent',
  instructions: `
    You are a helpful assistant with advanced memory capabilities.
    You can remember previous conversations and user preferences.
    
    IMPORTANT: You have access to working memory to store persistent information about user.
    When you learn something important about user, update your working memory.
    This includes:
    - Their name
    - Their location
    - Their preferences
    - Their interests
    - Any other relevant information that would help personalize conversation
    
    Always refer to your working memory before asking for information user has already provided.
    Use information in your working memory to provide personalized responses.
    
    You also have access to semantic recall to find relevant information from older conversations.
    Use this capability to provide context-aware responses even for topics discussed long ago.
  `,
  model: 'openai/gpt-5-mini',
  memory: memory,
});
