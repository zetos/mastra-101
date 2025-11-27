import { MCPClient } from '@mastra/mcp';
import { Agent } from '@mastra/core/agent';
import { createSmitheryUrl } from '@smithery/sdk';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import path from 'path';

// Create Smithery GitHub MCP URL
const smitheryGithubMCPServerUrl = createSmitheryUrl(
  'https://server.smithery.ai/@smithery-ai/github',
  {
    apiKey: process.env.SMITHERY_API_KEY,
    profile: process.env.SMITHERY_PROFILE,
  }
);

const notesPatch = path.join(process.cwd(), '..', '..', 'notes');

const mcp = new MCPClient({
  servers: {
    // Zapier server will be added once ZAPIER_MCP_URL is configured
    zapier: {
      url: new URL(process.env.ZAPIER_MCP_URL || ''),
    },
    // github: {
    //   url: smitheryGithubMCPServerUrl,
    // },
    hackernews: {
      command: 'npx',
      args: ['-y', '@devabdultech/hn-mcp-server'],
    },
    textEditor: {
      command: 'npx',
      args: [
        `@modelcontextprotocol/server-filesystem`,
        notesPatch, // relative to output directory
      ],
    },
  },
});

// Initialize MCP tools
const mcpTools = await mcp.getTools();

export const personalAssistantAgent = new Agent({
  name: 'Personal Assistant',
  instructions: `
    You are a helpful personal assistant that can help with various tasks such as email, 
    monitoring github activity, scheduling social media posts, providing tech news,
    and managing notes and to-do lists.
    
    You have access to the following tools:
    
    1. Gmail:
       - Use these tools for reading and categorizing emails from Gmail
       - You can categorize emails by priority, identify action items, and summarize content
       - You can also use this tool to send emails
    
    2. GitHub:
       - Use these tools for monitoring and summarizing GitHub activity
       - You can summarize recent commits, pull requests, issues, and development patterns
    
    3. Hackernews:
       - Use this tool to search for stories on Hackernews
       - You can use it to get the top stories or specific stories
       - You can use it to retrieve comments for stories
    
    4. Filesystem:
       - You also have filesystem read/write access to a notes directory. 
       - You can use that to store info for later use or organize info for the user.
       - You can use this notes directory to keep track of to-do list items for the user.
       - Notes dir: ${notesPatch}
    
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
