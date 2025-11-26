# Mastra 101 Course Repository

Welcome to the Mastra 101 course repository! This project is designed to teach you how to build AI agents using the Mastra framework with Model Context Protocol (MCP) integrations.

## About Mastra 101

Mastra 101 is an introductory course that covers:
- Building AI agents with the Mastra framework
- Integrating external services via MCP (Model Context Protocol)
- Creating custom tools and workflows
- Implementing memory and persistence
- Working with various data sources and APIs

## Getting Started

### Prerequisites
- Node.js 20.9.0 or higher
- npm or pnpm package manager

### Installation
1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development
Start the development server with the interactive playground:
```bash
npm run dev
```

This will start the server at http://localhost:4111/ where you can interact with your agents.

## Available Scripts

- `npm run dev` - Start development server with playground
- `npm run build` - Build the project for production
- `npm run start` - Start production server
- `npm run examples` - Run agent examples

## Project Structure

```
src/mastra/
├── agents/          # Agent definitions
├── tools/           # Custom tools
├── workflows/       # Workflow definitions
├── scorers/         # Evaluation scorers
└── index.ts         # Main Mastra configuration
```

## MCP Integrations

This course demonstrates integration with:
- **Zapier** - Email and social media automation
- **GitHub** - Repository monitoring and management
- **HackerNews** - Tech news and discussions
- **Filesystem** - Local file operations for notes and data

## Learning Path

The course is structured into progressive lessons:
1. **First Agent** - Basic agent creation and tools
2. **Agent Tools & MCP** - External service integrations
3. **Agent Memory** - Conversation history and persistence
4. **Workflows** - Multi-step agent processes

## Environment Setup

Copy `.env.example` to `.env` and configure your API keys for the MCP services you want to use.

## Resources

- [Mastra Documentation](https://mastra.ai/docs)
- [Course Progress](https://mastra.ai/course)
- [MCP Specification](https://modelcontextprotocol.io)

Happy building! 🚀