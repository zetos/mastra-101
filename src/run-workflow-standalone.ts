import { config } from 'dotenv';
import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';

// Load environment variables
config();

// Create the validate content step
const validateContentStep = createStep({
  id: "validate-content",
  description: "Validates incoming text content",
  inputSchema: z.object({
    content: z.string().min(1, "Content cannot be empty"),
    type: z.enum(["article", "blog", "social"]).default("article"),
  }),
  outputSchema: z.object({
    content: z.string(),
    type: z.string(),
    wordCount: z.number(),
    isValid: z.boolean(),
  }),
  execute: async ({ inputData }: any) => {
    const { content, type } = inputData;

    const wordCount = content.trim().split(/\s+/).length;
    const isValid = wordCount >= 5; // Minimum 5 words

    if (!isValid) {
      throw new Error(`Content too short: ${wordCount} words`);
    }

    return {
      content: content.trim(),
      type,
      wordCount,
      isValid,
    };
  },
});

const enhanceContentStep = createStep({
  id: "enhance-content",
  description: "Enhances content with metadata and analysis",
  inputSchema: z.object({
    content: z.string(),
    type: z.string(),
    wordCount: z.number(),
    isValid: z.boolean(),
  }),
  outputSchema: z.object({
    content: z.string(),
    type: z.string(),
    wordCount: z.number(),
    metadata: z.object({
      readingTime: z.number(),
      difficulty: z.enum(["easy", "medium", "hard"]),
      processedAt: z.string(),
    }),
  }),
  execute: async ({ inputData }: any) => {
    const { content, type, wordCount } = inputData;
    
    // Calculate reading time (average 200 words per minute)
    const readingTime = Math.ceil(wordCount / 200);
    
    // Determine difficulty based on word count
    let difficulty: "easy" | "medium" | "hard";
    if (wordCount < 100) difficulty = "easy";
    else if (wordCount < 500) difficulty = "medium";
    else difficulty = "hard";
    
    return {
      content,
      type,
      wordCount,
      metadata: {
        readingTime,
        difficulty,
        processedAt: new Date().toISOString(),
      },
    };
  },
});

// Create the workflow
const contentWorkflow = createWorkflow({
  id: "content-processing-workflow",
  description: "Validates and enhances content",
  inputSchema: z.object({
    content: z.string(),
    type: z.enum(["article", "blog", "social"]).default("article"),
  }),
  outputSchema: z.object({
    content: z.string(),
    type: z.string(),
    wordCount: z.number(),
    metadata: z.object({
      readingTime: z.number(),
      difficulty: z.enum(["easy", "medium", "hard"]),
      processedAt: z.string(),
    }),
  }),
})
  .then(validateContentStep)
  .then(enhanceContentStep)
  .commit();

async function runContentWorkflow() {
  console.log('🚀 Running workflow programmatically...\n');

  try {
    // Create a run instance
    const run = await contentWorkflow.createRunAsync();

    // Execute with test data
    const result = await run.start({
      inputData: {
        content:
          'Climate change is one of the most pressing challenges of our time, requiring immediate action from governments, businesses, and individuals worldwide.',
        type: 'blog',
      },
    });

    if (result.status === 'success') {
      console.log('✅ Success!');
      console.log(
        '📊 Reading time:',
        result.result.metadata.readingTime,
        'minutes'
      );
      console.log('🎯 Difficulty:', result.result.metadata.difficulty);
      console.log('📅 Processed at:', result.result.metadata.processedAt);
    }
  } catch (error) {
    console.error('❌ Error:', (error as Error).message);
  }
}

// Run the workflow
runContentWorkflow();