import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { IdeasController } from './controllers/ideas.controller';
import { AnalyzeIdeaUseCase, AI_GENERATION_QUEUE } from './application/analyze-idea.use-case';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [
    BullModule.registerQueue({
      name: AI_GENERATION_QUEUE,
    }),
  ],
  controllers: [IdeasController],
  providers: [
    AnalyzeIdeaUseCase,
    {
      provide: PrismaClient,
      useValue: new PrismaClient(),
    },
  ],
})
export class IdeasModule {}
