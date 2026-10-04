import { Controller, Post, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { AnalyzeIdeaUseCase } from '../application/analyze-idea.use-case';

export class SubmitIdeaBodyDto {
  rawDescription: string;
  userId?: string;
}

@Controller('workspaces/:workspaceId/projects/:projectId/ideas')
export class IdeasController {
  constructor(private readonly analyzeIdeaUseCase: AnalyzeIdeaUseCase) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async analyzeIdea(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Body() body: SubmitIdeaBodyDto,
  ) {
    const result = await this.analyzeIdeaUseCase.execute({
      workspaceId,
      projectId,
      rawDescription: body.rawDescription,
      userId: body.userId,
    });

    return {
      message: 'Idea submitted for analysis. Results will be available shortly.',
      data: result,
    };
  }
}
