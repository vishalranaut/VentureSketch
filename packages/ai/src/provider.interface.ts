export interface AIRequest {
  model: string;
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
}

export interface AIResponse {
  content: string;
  inputTokens: number;
  outputTokens: number;
}

export interface AIChunk {
  content: string;
}

export interface Embedding {
  vector: number[];
}

export interface AIProvider {
  generate(request: AIRequest): Promise<AIResponse>;
  stream(request: AIRequest): AsyncIterable<AIChunk>;
  embed(input: string[]): Promise<Embedding[]>;
}
