import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Queue } from 'bullmq';
import { AnalyzeIdeaInput, AnalyzeIdeaOutput } from './analyze-idea.dto';

export const AI_GENERATION_QUEUE = 'ai-generation';

@Injectable()
export class AnalyzeIdeaUseCase {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly aiQueue: Queue,
  ) {}

  async execute(input: AnalyzeIdeaInput): Promise<AnalyzeIdeaOutput> {
    // 1. Create the Idea record
    const idea = await this.prisma.idea.create({
      data: {
        workspaceId: input.workspaceId,
        projectId: input.projectId,
        rawDescription: input.rawDescription,
        status: 'ANALYZING',
      },
    });

    // 2. Create the AIGeneration audit record
    const generation = await this.prisma.aIGeneration.create({
      data: {
        workspaceId: input.workspaceId,
        projectId: input.projectId,
        userId: input.userId,
        workflow: 'idea-analyzer',
        workflowVersion: '1',
        provider: 'mock',
        model: 'mock-v1',
        promptVersion: 'v1',
        status: 'QUEUED',
        inputSnapshot: { rawDescription: input.rawDescription },
      },
    });

    // 3. Dispatch the background job to BullMQ
    await this.aiQueue.add('analyze-idea', {
      ideaId: idea.id,
      generationId: generation.id,
      workspaceId: input.workspaceId,
      projectId: input.projectId,
      rawDescription: input.rawDescription,
    });

    return {
      ideaId: idea.id,
      generationId: generation.id,
      status: 'QUEUED',
    };
  }
}
