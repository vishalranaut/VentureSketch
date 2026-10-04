import { AIProvider, AIRequest, AIResponse, AIChunk, Embedding } from './provider.interface';

export class MockAIProvider implements AIProvider {
  async generate(request: AIRequest): Promise<AIResponse> {
    console.log(`[MockAIProvider] Generating response for model: ${request.model}`);
    
    // Hardcoded mock response for the idea analyzer
    const mockOutput = {
      coreProblem: "People struggle to find and book reliable local tutors.",
      targetUsers: ["Parents", "Students", "Local Tutors"],
      proposedSolution: "A marketplace app connecting local tutors with students, handling scheduling and payments."
    };

    return {
      content: JSON.stringify(mockOutput),
      inputTokens: request.systemPrompt.length + request.userPrompt.length,
      outputTokens: 150,
    };
  }

  async *stream(request: AIRequest): AsyncIterable<AIChunk> {
    yield { content: "Mock " };
    yield { content: "stream " };
    yield { content: "response." };
  }

  async embed(input: string[]): Promise<Embedding[]> {
    return input.map(() => ({ vector: [0.1, 0.2, 0.3] }));
  }
}
