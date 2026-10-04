import { IDEA_ANALYZER_PROMPT_V1 } from '../../prompts/idea-analyzer/v1/prompt';
import { AIProvider, AIRequest, AIResponse } from '../provider.interface';
import { buildSafePrompt } from '../input-sanitizer';
import { z } from 'zod';

export const IdeaAnalysisSchema = z.object({
  coreProblem: z.string().min(1).max(2000),
  targetUsers: z.array(z.string().min(1).max(200)).min(1).max(10),
  proposedSolution: z.string().min(1).max(2000),
  platforms: z.array(z.enum(['web', 'ios', 'android', 'desktop', 'api'])).optional(),
  assumptions: z.array(z.string().max(500)).optional(),
});

export type IdeaAnalysis = z.infer<typeof IdeaAnalysisSchema>;

export class IdeaAnalyzerWorkflow {
  constructor(private readonly aiProvider: AIProvider) {}

  async execute(rawIdea: string): Promise<{
    analysis: IdeaAnalysis;
    tokens: { input: number; output: number };
  }> {
    // Build safe prompt — user input is sandboxed, never concatenated raw
    const userPrompt = buildSafePrompt(IDEA_ANALYZER_PROMPT_V1, rawIdea, 10_000);

    const request: AIRequest = {
      model: 'gpt-4o-mini',
      systemPrompt: IDEA_ANALYZER_PROMPT_V1,
      userPrompt,
      temperature: 0.3, // lower temperature for structured extraction
    };

    const response: AIResponse = await this.aiProvider.generate(request);

    // Parse and validate — never trust raw AI output
    let parsed: unknown;
    try {
      let content = response.content.trim();
      // Strip markdown code fences if present
      if (content.startsWith('```json')) {
        content = content.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (content.startsWith('```')) {
        content = content.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      parsed = JSON.parse(content);
    } catch {
      throw new Error('AI returned non-JSON response — output validation failed');
    }

    // Zod schema enforcement — rejects hallucinated fields, wrong types, etc.
    const result = IdeaAnalysisSchema.safeParse(parsed);
    if (!result.success) {
      throw new Error(
        `AI output schema validation failed: ${result.error.message}`
      );
    }

    return {
      analysis: result.data,
      tokens: {
        input: response.inputTokens,
        output: response.outputTokens,
      },
    };
  }
}
