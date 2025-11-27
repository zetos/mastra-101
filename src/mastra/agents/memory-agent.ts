import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';

// Create a basic memory instance
const memory = new Memory({
  storage: new LibSQLStore({
    url: 'file:../basic-memory.db', // relative path from `.mastra/output` directory
  }),
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
