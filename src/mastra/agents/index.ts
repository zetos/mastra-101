import { MCPClient } from '@mastra/mcp';
import { Agent } from '@mastra/core/agent';
import { createSmitheryUrl } from '@smithery/sdk';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';

// Create Smithery GitHub MCP URL
const smitheryGithubMCPServerUrl = createSmitheryUrl(
  'https://server.smithery.ai/@smithery-ai/github',
  {
    apiKey: process.env.SMITHERY_API_KEY,
    profile: process.env.SMITHERY_PROFILE,
  }
);

const mcp = new MCPClient({
  servers: {
    // Zapier server will be added once ZAPIER_MCP_URL is configured
    zapier: {
      url: new URL(process.env.ZAPIER_MCP_URL || ''),
    },
    // github: {
    //   url: smitheryGithubMCPServerUrl,
    // },
  },
});

// Initialize MCP tools
const mcpTools = await mcp.getTools();

export const personalAssistantAgent = new Agent({
  name: 'Personal Assistant',
  instructions: `
    You are a helpful personal assistant that can help with various tasks such as email, 
    monitoring github activity, and scheduling social media posts.
    
    You have access to the following tools:
    
    1. Gmail:
       - Use these tools for reading and categorizing emails from Gmail
       - You can categorize emails by priority, identify action items, and summarize content
       - You can also use this tool to send emails
    
    2. GitHub:
       - Use these tools for monitoring and summarizing GitHub activity
       - You can summarize recent commits, pull requests, issues, and development patterns
    
    Keep your responses concise and friendly.
  `,
  model: 'openai/gpt-5.1',
  tools: { ...mcpTools }, // Add MCP tools to your agent
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../personal-assistant-mastra.db',
    }),
  }),
});

export { mcp, mcpTools };
