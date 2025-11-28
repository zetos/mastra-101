import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';

export const validateContentStep = createStep({
  id: 'validate-content',
  description: 'Validates incoming text content',
  inputSchema: z.object({
    content: z.string().min(1, 'Content cannot be empty'),
    type: z.enum(['article', 'blog', 'social']).default('article'),
  }),
  outputSchema: z.object({
    content: z.string(),
    type: z.string(),
    wordCount: z.number(),
    isValid: z.boolean(),
  }),
  execute: async ({ inputData }) => {
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

export const enhanceContentStep = createStep({
  id: 'enhance-content',
  description: 'Enhances content with metadata and analysis',
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
      difficulty: z.enum(['easy', 'medium', 'hard']),
      processedAt: z.string(),
    }),
  }),
  execute: async ({ inputData }) => {
    const { content, type, wordCount } = inputData;

    // Calculate reading time (average 200 words per minute)
    const readingTime = Math.ceil(wordCount / 200);

    // Determine difficulty based on word count
    let difficulty: 'easy' | 'medium' | 'hard';
    if (wordCount < 100) difficulty = 'easy';
    else if (wordCount < 500) difficulty = 'medium';
    else difficulty = 'hard';

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

export const generateSummaryStep = createStep({
  id: 'generate-summary',
  description: 'Generates a concise summary of the content',
  inputSchema: z.object({
    content: z.string(),
    type: z.string(),
    wordCount: z.number(),
    metadata: z.object({
      readingTime: z.number(),
      difficulty: z.enum(['easy', 'medium', 'hard']),
      processedAt: z.string(),
    }),
  }),
  outputSchema: z.object({
    content: z.string(),
    type: z.string(),
    wordCount: z.number(),
    metadata: z.object({
      readingTime: z.number(),
      difficulty: z.enum(['easy', 'medium', 'hard']),
      processedAt: z.string(),
    }),
    summary: z.string(),
  }),
  execute: async ({ inputData }) => {
    const { content, wordCount } = inputData;
    
    // Simple summary logic - take first sentence and last sentence
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    let summary: string;
    
    if (sentences.length <= 2) {
      summary = content.trim();
    } else {
      const firstSentence = sentences[0]?.trim() || '';
      const lastSentence = sentences[sentences.length - 1]?.trim() || '';
      summary = `${firstSentence}. ... ${lastSentence}.`;
    }
    
    return {
      ...inputData,
      summary,
    };
  },
});

export const contentWorkflow = createWorkflow({
  id: 'content-processing-workflow',
  description: 'Validates, enhances, and summarizes content',
  inputSchema: z.object({
    content: z.string(),
    type: z.enum(['article', 'blog', 'social']).default('article'),
  }),
  outputSchema: z.object({
    content: z.string(),
    type: z.string(),
    wordCount: z.number(),
    metadata: z.object({
      readingTime: z.number(),
      difficulty: z.enum(['easy', 'medium', 'hard']),
      processedAt: z.string(),
    }),
    summary: z.string(),
  }),
})
  .then(validateContentStep)
  .then(enhanceContentStep)
  .then(generateSummaryStep)
  .commit();
