import { MCPClient } from '@mastra/mcp';
import { Agent } from '@mastra/core/agent';

const mcp = new MCPClient({
  servers: {
    // Zapier server will be added once ZAPIER_MCP_URL is configured
    zapier: {
      url: new URL(process.env.ZAPIER_MCP_URL || ''),
    },
  },
});

// Initialize MCP tools
const mcpTools = await mcp.getTools();

export const personalAssistantAgent = new Agent({
  name: 'Personal Assistant',
  instructions: `
    You are a helpful personal assistant that can help with various tasks such as email 
    and scheduling social media posts.
    
    You have access to the following tools:
    
    1. Gmail:
       - Use these tools for reading and categorizing emails from Gmail
       - You can categorize emails by priority, identify action items, and summarize content
       - You can also use this tool to send emails
    
    Keep your responses concise and friendly.
  `,
  model: 'openai/gpt-5.1',
  tools: { ...mcpTools }, // Add MCP tools to your agent
});

export { mcp, mcpTools };
