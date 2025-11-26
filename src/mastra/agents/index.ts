import { MCPClient } from '@mastra/mcp';
import { Agent } from '@mastra/core/agent';

const mcp = new MCPClient({
  servers: {
    // We'll add servers in the next steps
  },
});

// Initialize MCP tools
const mcpTools = await mcp.getTools();

export const personalAssistantAgent = new Agent({
  name: 'Personal Assistant',
  instructions: `
    You are a helpful personal assistant that can help with various tasks.
    
    Keep your responses concise and friendly.
  `,
  model: 'openai/gpt-5.1',
  tools: { ...mcpTools }, // Add MCP tools to your agent
});

export { mcp, mcpTools };
