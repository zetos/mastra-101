import { MCPClient } from "@mastra/mcp";

const mcp = new MCPClient({
  servers: {
    // We'll add servers in the next steps
  },
});

// Initialize MCP tools
const mcpTools = await mcp.getTools();

export { mcp, mcpTools };