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

const aiAnalysisStep = createStep({
  id: "ai-analysis",
  description: "AI-powered content analysis",
  inputSchema: z.object({
    content: z.string(),
    type: z.string(),
    wordCount: z.number(),
    metadata: z.object({
      readingTime: z.number(),
      difficulty: z.enum(["easy", "medium", "hard"]),
      processedAt: z.string(),
    }),
    summary: z.string(),
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
    summary: z.string(),
    aiAnalysis: z.object({
      score: z.number(),
      feedback: z.string(),
    }),
  }),
  execute: async ({ inputData, mastra }) => {
    const { content, type, wordCount, metadata, summary } = inputData;

    // Create prompt for the AI agent
    const prompt = `
Analyze this ${type} content:

Content: "${content}"
Word count: ${wordCount}
Reading time: ${metadata.readingTime} minutes
Difficulty: ${metadata.difficulty}

Please provide:
1. A quality score from 1-10
2. Brief feedback on strengths and areas for improvement

Format as JSON: {"score": number, "feedback": "your feedback here"}
    `;

    // Get the contentAgent from the mastra instance.
    // NOTE: This is unsafe at runtime - TypeScript can't verify the agent exists.
    // For production code, consider importing the agent directly:
    // import { contentAgent } from '../agents/content-agent';
    // const { text } = await contentAgent.generate([...]);
    const contentAgent = mastra.getAgent("contentAgent");
    const { text } = await contentAgent.generate([
      { role: "user", content: prompt },
    ]);

    // Parse AI response (with fallback)
    let aiAnalysis;
    try {
      aiAnalysis = JSON.parse(text);
    } catch {
      aiAnalysis = {
        score: 7,
        feedback: "AI analysis completed. " + text,
      };
    }

    console.log(`🤖 AI Score: ${aiAnalysis.score}/10`);

    return {
      content,
      type,
      wordCount,
      metadata,
      summary,
      aiAnalysis,
    };
  },
});

// SEO Analysis
const seoAnalysisStep = createStep({
  id: "seo-analysis",
  description: "SEO optimization analysis",
  inputSchema: z.object({
    content: z.string(),
    type: z.enum(["article", "blog", "social"]).default("article"),
  }),
  outputSchema: z.object({
    seoScore: z.number(),
    keywords: z.array(z.string()),
  }),
  execute: async ({ inputData }) => {
    console.log("🔍 Running SEO analysis...");
    await new Promise((resolve) => setTimeout(resolve, 800));

    const words = inputData.content.toLowerCase().split(/\s+/);
    const keywords = words.filter((word) => word.length > 4).slice(0, 3);

    return {
      seoScore: Math.floor(Math.random() * 40) + 60,
      keywords,
    };
  },
});

// Readability Analysis
const readabilityStep = createStep({
  id: "readability-analysis",
  description: "Content readability analysis",
  inputSchema: z.object({
    content: z.string(),
    type: z.enum(["article", "blog", "social"]).default("article"),
  }),
  outputSchema: z.object({
    readabilityScore: z.number(),
    gradeLevel: z.string(),
  }),
  execute: async ({ inputData }) => {
    console.log("📖 Running readability analysis...");
    await new Promise((resolve) => setTimeout(resolve, 600));

    const sentences = inputData.content.split(/[.!?]+/).length;
    const words = inputData.content.split(/\s+/).length;
    const avgWordsPerSentence = words / sentences;

    const score = Math.max(0, 100 - avgWordsPerSentence * 3);
    const gradeLevel = score > 80 ? "Easy" : score > 60 ? "Medium" : "Hard";

    return {
      readabilityScore: Math.floor(score),
      gradeLevel,
    };
  },
});

// Sentiment Analysis
const sentimentStep = createStep({
  id: "sentiment-analysis",
  description: "Content sentiment analysis",
  inputSchema: z.object({
    content: z.string(),
    type: z.enum(["article", "blog", "social"]).default("article"),
  }),
  outputSchema: z.object({
    sentiment: z.enum(["positive", "neutral", "negative"]),
    confidence: z.number(),
  }),
  execute: async ({ inputData }) => {
    console.log("😊 Running sentiment analysis...");
    await new Promise((resolve) => setTimeout(resolve, 700));

    const content = inputData.content.toLowerCase();
    const positiveWords = ["good", "great", "excellent", "amazing"];
    const negativeWords = ["bad", "terrible", "awful", "horrible"];

    const positive = positiveWords.filter((word) =>
      content.includes(word),
    ).length;
    const negative = negativeWords.filter((word) =>
      content.includes(word),
    ).length;

    let sentiment: "positive" | "neutral" | "negative" = "neutral";
    if (positive > negative) sentiment = "positive";
    if (negative > positive) sentiment = "negative";

    return {
      sentiment,
      confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
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

export const aiContentWorkflow = createWorkflow({
  id: "ai-content-workflow",
  description: "AI-enhanced content processing with analysis",
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
    summary: z.string(),
    aiAnalysis: z.object({
      score: z.number(),
      feedback: z.string(),
    }),
  }),
})
  .then(validateContentStep)
  .then(enhanceContentStep)
  .then(generateSummaryStep)
  .then(aiAnalysisStep)
  .commit();
