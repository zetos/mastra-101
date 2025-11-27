# Mastra Course Agent Guidelines

## Project Overview

This repository is for the Mastra 101 course, teaching AI agent development using the Mastra framework with MCP (Model Context Protocol) integrations.

## Commands

- `npm run dev` - Start development server with playground at http://localhost:4111/
- `npm run build` - Build the project
- `npm run start` - Start production server
- `npm run examples` - Run agent examples with tsx

## Code Style

- Import Mastra packages from `@mastra/*` namespace
- Use Zod for schema validation in tools
- TypeScript strict mode enabled
- Use async/await for API calls
- Error handling with descriptive messages

## Agent Structure

- Export agents from `src/mastra/agents/index.ts`
- Tools in `src/mastra/tools/` with descriptive IDs
- Use MCPClient for external integrations (Zapier, GitHub, HackerNews, Filesystem)
- Memory with LibSQLStore for persistence
- Model format: `'openai/gpt-5.1'`

## MCP Integrations

- Zapier: Email and social media automation
- GitHub: Repository monitoring and management
- HackerNews: Tech news and discussions
- Filesystem: Local file operations for notes/data

## File Organization

- Keep agents, tools, workflows, and scorers in separate directories
- Use descriptive names for tools and agents
- Comment complex logic and API integrations
- Store agent data in `notes/` directory for filesystem operations
