// Represents the input for the analyze idea use case
export interface AnalyzeIdeaInput {
  workspaceId: string;
  projectId: string;
  rawDescription: string;
  userId?: string;
}

// Represents the output of the analyze idea use case
export interface AnalyzeIdeaOutput {
  ideaId: string;
  generationId: string;
  status: 'QUEUED';
}
