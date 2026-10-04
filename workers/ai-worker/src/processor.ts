import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job, UnrecoverableError } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import { IdeaAnalyzerWorkflow, MockAIProvider } from '@venture-sketch/ai';
import {
  ALLOWED_AI_JOBS,
  AnalyzeIdeaJobSchema,
  type AnalyzeIdeaJobPayload,
} from '@venture-sketch/types';

@Processor('ai-generation')
export class AiGenerationProcessor extends WorkerHost {
  private readonly logger = new Logger(AiGenerationProcessor.name);
  private readonly prisma: PrismaClient;

  constructor() {
    super();
    this.prisma = new PrismaClient();
  }

  async process(job: Job): Promise<void> {
    // 1. Job type allowlist check
    if (!ALLOWED_AI_JOBS.includes(job.name as any)) {
      // UnrecoverableError moves job to DLQ immediately — no retry
      throw new UnrecoverableError(`Rejected: unknown job type "${job.name}"`);
    }

    // 2. Route to correct handler
    switch (job.name) {
      case 'analyze-idea':
        return this.handleAnalyzeIdea(job);
      default:
        throw new UnrecoverableError(`No handler for job: ${job.name}`);
    }
  }

  private async handleAnalyzeIdea(job: Job): Promise<void> {
    // 3. Validate payload schema with Zod
    const parsed = AnalyzeIdeaJobSchema.safeParse(job.data);
    if (!parsed.success) {
      throw new UnrecoverableError(
        `Invalid job payload for analyze-idea: ${parsed.error.message}`
      );
    }

    const { ideaId, generationId, workspaceId, projectId } = parsed.data;
    this.logger.log(`Processing analyze-idea job for ideaId=${ideaId}`);

    // 4. Re-verify resource ownership from DB — never trust job payload alone
    const idea = await this.prisma.idea.findFirst({
      where: { id: ideaId, workspaceId, projectId },
    });
    if (!idea) {
      throw new UnrecoverableError(
        `Cross-tenant or stale job rejected: ideaId=${ideaId} workspaceId=${workspaceId}`
      );
    }

    // 5. Mark as running
    await this.prisma.aIGeneration.update({
      where: { id: generationId },
      data: { status: 'RUNNING' },
    });

    try {
      // 6. Execute the AI workflow
      const provider = new MockAIProvider(); // swap to real provider via config
      const workflow = new IdeaAnalyzerWorkflow(provider);
      const { analysis, tokens } = await workflow.execute(idea.rawDescription);

      // 7. Persist structured result
      await this.prisma.idea.update({
        where: { id: ideaId },
        data: { structured: analysis, status: 'COMPLETED' },
      });

      await this.prisma.aIGeneration.update({
        where: { id: generationId },
        data: {
          status: 'COMPLETED',
          inputTokens: tokens.input,
          outputTokens: tokens.output,
          outputSnapshot: analysis,
        },
      });

      this.logger.log(`analyze-idea completed for ideaId=${ideaId}`);
    } catch (err) {
      const errorMessage = (err as Error).message;
      this.logger.error(`analyze-idea failed for ideaId=${ideaId}: ${errorMessage}`);

      await Promise.all([
        this.prisma.idea.update({
          where: { id: ideaId },
          data: { status: 'FAILED' },
        }),
        this.prisma.aIGeneration.update({
          where: { id: generationId },
          data: { status: 'FAILED', error: errorMessage },
        }),
      ]);

      throw err; // re-throw for BullMQ retry handling
    }
  }
}
