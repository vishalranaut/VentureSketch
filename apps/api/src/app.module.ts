import { Module } from '@nestjs/common';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';
import { UserStoriesModule } from './modules/user-stories/user-stories.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { SolutionsModule } from './modules/solutions/solutions.module';
import { ScreensModule } from './modules/screens/screens.module';
import { RoadmapsModule } from './modules/roadmaps/roadmaps.module';
import { ResearchModule } from './modules/research/research.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { ProblemsModule } from './modules/problems/problems.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { PersonasModule } from './modules/personas/personas.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { GithubModule } from './modules/github/github.module';
import { IdeasModule } from './modules/ideas/ideas.module';
import { FlowsModule } from './modules/flows/flows.module';
import { DatabaseDesignModule } from './modules/database-design/database-design.module';
import { ExportModule } from './modules/export/export.module';
import { ApiDesignModule } from './modules/api-design/api-design.module';
import { ArchitectureModule } from './modules/architecture/architecture.module';

@Module({
  imports: [
    WorkspacesModule,
    UserStoriesModule,
    TasksModule,
    SolutionsModule,
    ScreensModule,
    RoadmapsModule,
    ResearchModule,
    QuestionsModule,
    ProblemsModule,
    ProjectsModule,
    PersonasModule,
    OnboardingModule,
    GithubModule,
    IdeasModule,
    FlowsModule,
    DatabaseDesignModule,
    ExportModule,
    ApiDesignModule,
    ArchitectureModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
