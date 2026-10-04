# VentureSketch

> From idea to build-ready product.

**Document status:** Engineering Baseline
**Version:** 1.0
**Last reviewed:** October 2026

---

# 1. Product Vision

VentureSketch helps non-technical founders transform an idea into an actionable software product plan.

A user should be able to say:

> "I want to build an app where people can find and book local tutors."

and receive:

```text
Raw Idea
   ↓
Idea Understanding
   ↓
Clarifying Questions
   ↓
Problem Definition
   ↓
Target Users
   ↓
Business Model
   ↓
Market Research
   ↓
Competitors
   ↓
MVP Scope
   ↓
Features
   ↓
User Stories
   ↓
User Flows
   ↓
Screen Specifications
   ↓
Technical Architecture
   ↓
Database Schema
   ↓
API Specification
   ↓
Development Roadmap
   ↓
Tasks + Acceptance Criteria
   ↓
Optional Code Generation
```

The platform should explain technical concepts in language appropriate to the user.

Supported explanation levels:

```text
BEGINNER
BUSINESS
PRODUCT
DEVELOPER
ARCHITECT
```

---

# 2. Core Product Principle

The **Project** is the source of product context.

AI conversations are not the source of truth.

```text
Workspace
   │
   └── Project
        │
        ├── Idea
        ├── Questions
        ├── Answers
        ├── Research
        ├── Personas
        ├── Problems
        ├── Solutions
        ├── Features
        ├── User Stories
        ├── User Flows
        ├── Screens
        ├── Architecture
        ├── Database Design
        ├── API Design
        ├── Roadmap
        ├── Tasks
        ├── Documents
        └── AI Generations
```

---

# 3. Technology Baseline

## Runtime

```text
Node.js 24.x LTS
```

Node.js 24.x is the preferred backend/runtime baseline. Node 24 is in LTS as of this architecture revision.

Use:

```text
.nvmrc
```

with:

```text
24
```

CI and production should use the same major runtime.

---

# 4. Package Manager

```text
pnpm 12.x
```

Pin the repository to the tested pnpm version using:

```json
{
  "packageManager": "pnpm@12.8.0"
}
```

Do not allow contributors to use arbitrary package-manager versions. pnpm 12.8 is the current 12.x release observed in the official release stream at the time of this architecture revision.

---

# 5. Monorepo

Use:

```text
Turborepo 2.x
```

Current stable releases are in the Turbo 2.x line; pin the exact version through the lockfile/package manager.

Repository:

```text
venture-sketch/
```

Structure:

```text
venture-sketch/
│
├── apps/
│   ├── web/
│   ├── api/
│   └── mobile/
│
├── packages/
│   ├── types/
│   ├── validators/
│   ├── api-client/
│   ├── database/
│   ├── auth/
│   ├── ai/
│   ├── ui/
│   ├── config/
│   ├── eslint-config/
│   └── tsconfig/
│
├── workers/
│   ├── ai-worker/
│   ├── research-worker/
│   ├── document-worker/
│   ├── export-worker/
│   └── notification-worker/
│
├── docs/
│   ├── architecture/
│   ├── adr/
│   ├── api/
│   ├── product/
│   ├── prompts/
│   └── runbooks/
│
├── scripts/
│
├── .github/
│   ├── workflows/
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
│
├── docker-compose.yml
├── .env.example
├── .gitignore
├── ARCHITECTURE.md
├── CONTRIBUTING.md
├── SECURITY.md
├── README.md
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

---

# 6. Web Application

Use:

```text
Next.js 16.x
React 19.3
TypeScript
Tailwind CSS
TanStack Query
Zod
```

Next.js 16.x is currently Active LTS.

React currently publishes 19.3 as its latest version; React does not use an LTS designation equivalent to Node.js.

Application:

```text
apps/web/
```

Responsibilities:

```text
Marketing website
Authentication
Dashboard
Workspace management
Project workspace
Idea wizard
Research UI
Feature management
Roadmap
Architecture viewer
AI assistant
Billing
Settings
Admin
```

---

# 7. Mobile Application

Use:

```text
React Native
Expo SDK 57
React 19.x
TypeScript
Expo Router
TanStack Query
Zod
```

Expo SDK 57 is the current stable Expo SDK reference at this architecture revision and targets React Native 0.86. React Native 0.86 is an active supported release.

Do not independently upgrade React Native outside the Expo-supported matrix.

Use:

```text
apps/mobile/
```

Mobile priorities:

```text
Project dashboard
Idea capture
Voice idea capture
AI conversation
Roadmap
Tasks
Notifications
```

Mobile is not required for MVP launch.

---

# 8. Backend

Use:

```text
Node.js 24 LTS
NestJS 12.x
TypeScript
REST API
SSE
```

NestJS 12 is the current major release line and is designed for modern Node.js runtimes.

Backend:

```text
apps/api/
```

Architecture:

```text
HTTP Controller
      ↓
Application Use Case
      ↓
Domain Logic
      ↓
Repository
      ↓
PostgreSQL
```

Controllers must remain thin.

---

# 9. Backend Modules

```text
apps/api/src/modules/

auth/
users/
workspaces/
projects/
ideas/
questions/
research/
personas/
problems/
solutions/
features/
user-stories/
flows/
screens/
architecture/
database-design/
api-design/
roadmaps/
tasks/
ai/
documents/
files/
notifications/
billing/
usage/
audit/
admin/
```

Each module owns its business logic.

Example:

```text
projects/
├── controllers/
├── application/
├── domain/
├── infrastructure/
├── dto/
├── tests/
└── projects.module.ts
```

---

# 10. Database

Use:

```text
PostgreSQL 18.x
Prisma 8.x
```

PostgreSQL 18 is currently supported through November 14, 2030. PostgreSQL recommends running the current minor release for the selected major version.

At initial deployment:

```text
PostgreSQL 18.x
```

Do not use PostgreSQL 19 Beta in production.

---

# 11. Prisma

Use:

```text
Prisma 8.x
```

Prisma 8 is available as the current Prisma release line as of this architecture revision.

Package:

```text
packages/database/
```

Contains:

```text
prisma/
├── schema/
├── migrations/
└── seed.ts

src/
├── client.ts
├── repositories/
└── database.ts
```

---

# 12. Redis

Use:

```text
Redis 8.x
```

Redis does not follow Node's exact "LTS" model, so pin a stable Redis 8.x release rather than chasing latest/RC versions.

Redis 8.10.2 is a stable release available in the current release stream.

Redis responsibilities:

```text
Queue backend
Caching
Rate limiting
Distributed locks
Temporary job state
Short-lived sessions where required
```

PostgreSQL remains the source of truth.

---

# 13. Background Workers

AI generation, research, file processing and exports should not block HTTP requests.

Architecture:

```text
API
 ↓
Create Job
 ↓
Redis
 ↓
BullMQ
 ↓
Worker
 ↓
Process
 ↓
PostgreSQL
 ↓
SSE
 ↓
Frontend
```

Workers:

```text
workers/
├── ai-worker/
├── research-worker/
├── document-worker/
├── export-worker/
└── notification-worker/
```

Queues:

```text
ai-generation
research
document-processing
export
notification
```

---

# 14. High-Level System Architecture

```text
                         ┌───────────────────┐
                         │       USERS       │
                         └─────────┬─────────┘
                                   │
                ┌──────────────────┴──────────────────┐
                │                                     │
         ┌──────▼───────┐                     ┌───────▼──────┐
         │   Next.js    │                     │ React Native │
         │     Web      │                     │    Mobile    │
         └──────┬───────┘                     └───────┬──────┘
                │                                     │
                └──────────────────┬──────────────────┘
                                   │
                              REST / SSE
                                   │
                           ┌───────▼────────┐
                           │    NestJS      │
                           │   API Layer    │
                           └───────┬────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         │                         │                         │
 ┌───────▼────────┐       ┌────────▼────────┐      ┌────────▼───────┐
 │  PostgreSQL 18 │       │    Redis 8      │      │ Object Storage │
 │                │       │                 │      │       S3       │
 └────────────────┘       └────────┬────────┘      └────────────────┘
                                   │
                               BullMQ
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
             AI Worker      Research Worker   Export Worker
                    │              │
                    └───────┬──────┘
                            │
                      AI / Search APIs
```

---

# 15. Domain Architecture

```text
Workspace
    │
    ├── Members
    │
    └── Projects
          │
          ├── Idea
          │
          ├── Discovery
          │     ├── Questions
          │     ├── Answers
          │     ├── Personas
          │     └── Problems
          │
          ├── Validation
          │     ├── Research
          │     ├── Competitors
          │     └── Assumptions
          │
          ├── Product
          │     ├── Features
          │     ├── User Stories
          │     └── Requirements
          │
          ├── UX
          │     ├── User Flows
          │     └── Screens
          │
          ├── Engineering
          │     ├── Architecture
          │     ├── Database
          │     └── APIs
          │
          └── Execution
                ├── Roadmap
                ├── Phases
                └── Tasks
```

---

# 16. Project Lifecycle

```text
DRAFT
  ↓
DISCOVERY
  ↓
VALIDATING
  ↓
MVP_DEFINED
  ↓
UX_DEFINED
  ↓
TECH_DEFINED
  ↓
READY_TO_BUILD
  ↓
BUILDING
  ↓
LAUNCHED
```

Allowed status transitions should be implemented as domain rules.

---

# 17. Multi-Tenant SaaS

The platform is multi-tenant.

The tenant boundary is:

```text
Workspace
```

Every workspace-owned record must be associated with:

```text
workspaceId
```

Examples:

```text
Project
Feature
Roadmap
Task
Document
AI Generation
Research
Subscription
Usage
```

Never trust client-supplied tenant identifiers.

The server resolves:

```text
Authenticated User
       ↓
Workspace Membership
       ↓
Permission
       ↓
Resource
```

---

# 18. Roles

Initial roles:

```text
OWNER
ADMIN
MEMBER
VIEWER
```

Internal permissions:

```text
workspace.read
workspace.update
workspace.members.manage

project.read
project.create
project.update
project.delete

research.run
architecture.update
roadmap.update
task.update

billing.read
billing.manage
```

Authorization should be permission-oriented.

---

# 19. Core Database Entities

```text
users
workspaces
workspace_members

projects
project_versions

ideas
idea_questions
idea_answers

personas
problems
solutions
assumptions

research_reports
research_sources
competitors

features
feature_dependencies
user_stories

user_flows
user_flow_nodes

screens
screen_components

technical_architectures
architecture_decisions

database_designs
database_entities
database_fields

api_designs
api_endpoints

roadmaps
roadmap_phases
tasks

ai_conversations
ai_messages
ai_generations

documents
files

subscriptions
usage_events

notifications
audit_logs
```

---

# 20. Project Versioning

All significant product changes should be versionable.

```text
Project
│
├── Version 1
│
├── Version 2
│
├── Version 3
│
└── Current Version
```

Example:

```text
project_versions
├── id
├── projectId
├── versionNumber
├── snapshot
├── createdBy
└── createdAt
```

AI changes should never silently destroy previous product decisions.

---

# 21. Idea Engine

Input:

```text
rawDescription
```

Process:

```text
Raw Idea
 ↓
Idea Analyzer
 ↓
Structured Product Model
 ↓
Completeness Analysis
 ↓
Question Generator
```

Example output:

```json
{
  "problem": "...",
  "solution": "...",
  "targetUsers": [],
  "businessModel": "...",
  "platforms": ["web", "android", "ios"],
  "assumptions": [],
  "risks": [],
  "missingInformation": []
}
```

---

# 22. Question Engine

Questions exist to reduce uncertainty.

Question types:

```text
TEXT
SINGLE_CHOICE
MULTI_CHOICE
NUMBER
BOOLEAN
```

Question lifecycle:

```text
GENERATED
SHOWN
ANSWERED
SKIPPED
ARCHIVED
```

The engine should prefer high-impact questions.

---

# 23. Research Engine

Research is an independent capability.

```text
Research Request
       ↓
Search
       ↓
Collect Sources
       ↓
Normalize
       ↓
Deduplicate
       ↓
Extract
       ↓
Analyze
       ↓
Research Report
```

Store sources separately from conclusions.

Every research conclusion should be traceable to source records.

---

# 24. AI Architecture

Never write:

```text
ProjectService
   ↓
OpenAI SDK
```

Instead:

```text
Application
   ↓
AI Service
   ↓
AI Workflow
   ↓
AI Provider
```

Provider abstraction:

```ts
export interface AIProvider {
  generate(
    request: AIRequest
  ): Promise<AIResponse>;

  stream(
    request: AIRequest
  ): AsyncIterable<AIChunk>;

  embed(
    input: string[]
  ): Promise<Embedding[]>;
}
```

Possible providers:

```text
OpenAI
Anthropic
Google
```

The application should not depend directly on vendor SDKs.

---

# 25. AI Workflows

```text
IdeaAnalyzer
QuestionGenerator
ProductBriefGenerator
PersonaGenerator
ProblemGenerator
SolutionGenerator
ResearchAnalyzer
CompetitorAnalyzer
FeatureGenerator
UserStoryGenerator
FlowGenerator
ScreenGenerator
ArchitectureGenerator
DatabaseGenerator
ApiGenerator
RoadmapGenerator
TaskGenerator
CodeGenerator
```

Each workflow has:

```text
Input schema
Prompt version
Context builder
AI provider
Output schema
Validation
Persistence
Evaluation
```

---

# 26. AI Context Builder

AI should receive controlled project context.

```text
Project Context
├── Current Idea
├── Accepted Answers
├── Research
├── Personas
├── Existing Features
├── Product Decisions
└── Previous Generated Artifacts
```

Do not dump the entire database into every prompt.

Create explicit context builders:

```text
IdeaContextBuilder
ResearchContextBuilder
FeatureContextBuilder
ArchitectureContextBuilder
RoadmapContextBuilder
```

---

# 27. AI Structured Output

Never trust raw model output.

```text
LLM
 ↓
JSON
 ↓
Schema Validation
 ↓
Business Validation
 ↓
Persistence
```

Example:

```ts
const featureSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  priority: z.enum([
    "must_have",
    "should_have",
    "nice_to_have"
  ]),
  complexity: z.enum([
    "low",
    "medium",
    "high"
  ]),
  userValue: z.string()
});
```

---

# 28. AI Generation Record

Every AI operation must be auditable.

```text
ai_generations
├── id
├── workspaceId
├── projectId
├── userId
├── workflow
├── workflowVersion
├── provider
├── model
├── promptVersion
├── inputTokens
├── outputTokens
├── estimatedCost
├── status
├── inputSnapshot
├── outputSnapshot
├── error
└── createdAt
```

Statuses:

```text
QUEUED
RUNNING
COMPLETED
FAILED
CANCELLED
```

---

# 29. Prompt Versioning

Prompts are versioned artifacts.

```text
packages/ai/prompts/

idea-analyzer/
├── v1/
├── v2/
└── v3/

feature-generator/
├── v1/
└── v2/
```

A generation must record:

```text
workflowVersion
promptVersion
model
```

This enables reproducibility.

---

# 30. AI Cost Tracking

Track:

```text
inputTokens
outputTokens
model
provider
cost
```

Usage:

```text
usage_events
```

Examples:

```text
AI_GENERATION
RESEARCH_REQUEST
EXPORT
STORAGE
```

This data is later used for subscription limits and billing.

---

# 31. Rate Limiting

Rate limits should exist at multiple levels:

```text
IP
User
Workspace
API endpoint
AI workflow
```

For example:

```text
Normal API:
100 requests/minute

AI generation:
10 jobs/minute/workspace

Research:
5 jobs/minute/workspace
```

Actual limits should be configurable.

---

# 32. API Design

Base path:

```text
/api/v1
```

Projects:

```text
POST   /projects
GET    /projects
GET    /projects/:projectId
PATCH  /projects/:projectId
DELETE /projects/:projectId
```

Idea:

```text
POST  /projects/:projectId/idea
GET   /projects/:projectId/idea
PATCH /projects/:projectId/idea
```

Questions:

```text
GET  /projects/:projectId/questions
POST /projects/:projectId/questions/:questionId/answer
```

Generation:

```text
POST /projects/:projectId/generations/brief
POST /projects/:projectId/generations/mvp
POST /projects/:projectId/generations/research
POST /projects/:projectId/generations/architecture
POST /projects/:projectId/generations/roadmap
```

Jobs:

```text
GET /jobs/:jobId
GET /jobs/:jobId/events
```

---

# 33. API Response Standard

Success:

```json
{
  "data": {},
  "meta": {
    "requestId": "req_123"
  }
}
```

List:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "requestId": "req_123"
  }
}
```

Error:

```json
{
  "error": {
    "code": "PROJECT_NOT_FOUND",
    "message": "Project was not found",
    "requestId": "req_123"
  }
}
```

Never expose internal stack traces.

---

# 34. API Idempotency

Use:

```http
Idempotency-Key
```

for operations such as:

```text
AI generation
Payment
Export
Webhook processing
External integrations
```

Retries should not create duplicate resources.

---

# 35. Frontend Architecture

```text
apps/web/

app/
components/
features/
hooks/
lib/
providers/
styles/
tests/
```

Feature-based structure:

```text
features/
├── auth/
├── workspace/
├── projects/
├── idea/
├── research/
├── product/
├── roadmap/
├── architecture/
├── ai-chat/
└── billing/
```

Avoid putting all business functionality into one global `components` folder.

---

# 36. Frontend State

Use:

```text
TanStack Query
```

for server state.

Use local React state for temporary UI state.

Do not create a global state store unless a real requirement exists.

Data flow:

```text
Component
   ↓
Query / Mutation
   ↓
Typed API Client
   ↓
NestJS API
```

---

# 37. Shared API Client

```text
packages/api-client/
```

Example:

```ts
export const projectsApi = {
  get(projectId: string) {},
  create(input: CreateProjectInput) {},
  update(
    projectId: string,
    input: UpdateProjectInput
  ) {}
};
```

The web and mobile applications should use the same contract.

---

# 38. Shared Types

```text
packages/types/
```

Contains:

```text
User
Workspace
Project
Idea
Feature
Roadmap
Task
AIGeneration
```

Do not duplicate API types across apps.

---

# 39. Shared Validation

```text
packages/validators/
```

Contains:

```text
project.ts
workspace.ts
idea.ts
feature.ts
roadmap.ts
task.ts
auth.ts
```

Zod schemas should validate:

```text
HTTP input
Forms
AI output
Webhook input
External provider responses
```

---

# 40. Mobile Data Architecture

```text
React Native
      ↓
TanStack Query
      ↓
Shared API Client
      ↓
NestJS API
```

Mobile should not directly access PostgreSQL.

Mobile should not contain server business logic.

---

# 41. Files

Files live in object storage.

```text
Client
 ↓
Signed Upload URL
 ↓
S3-compatible storage
 ↓
File Metadata
 ↓
PostgreSQL
```

Database stores:

```text
fileId
workspaceId
projectId
storageKey
filename
mimeType
size
checksum
```

---

# 42. Documents

Supported future documents:

```text
PDF
DOCX
TXT
Markdown
Images
```

Processing:

```text
Upload
 ↓
Document Worker
 ↓
Extract
 ↓
Normalize
 ↓
Chunk
 ↓
Embed if needed
 ↓
Store
```

---

# 43. Search / Knowledge Layer

Start with PostgreSQL full-text search where practical.

Add vector search only when the product has a demonstrated semantic-search requirement.

Potential future architecture:

```text
PostgreSQL
   +
pgvector
```

Avoid introducing a dedicated vector database unnecessarily during MVP.

---

# 44. Caching

Redis can cache:

```text
Project summaries
Frequently requested metadata
Rate limits
AI temporary state
Search results
```

Never rely on cached data as the authoritative product state.

---

# 45. Events

Use internal application/domain events.

Examples:

```text
ProjectCreated
IdeaUpdated
ResearchStarted
ResearchCompleted
MvpGenerated
RoadmapGenerated
TaskCompleted
SubscriptionChanged
```

Initially:

```text
NestJS Event Bus / Application Events
```

Do not introduce Kafka or another distributed event platform until scale requires it.

---

# 46. Notifications

Types:

```text
IN_APP
EMAIL
PUSH
```

Events:

```text
ResearchCompleted
GenerationCompleted
GenerationFailed
InvitationCreated
SubscriptionChanged
```

Notifications should be processed asynchronously.

---

# 47. Billing

Billing should be isolated from product modules.

```text
billing/
├── subscriptions
├── plans
├── usage
├── invoices
└── webhooks
```

Plans:

```text
FREE
STARTER
PRO
TEAM
ENTERPRISE
```

Billing should be usage-aware because AI has variable infrastructure cost.

---

# 48. Usage Model

Example:

```text
FREE
10 AI generations/month

STARTER
100 generations/month

PRO
500 generations/month

TEAM
2000 generations/month
```

Do not hard-code these values.

Store them in subscription-plan configuration.

---

# 49. Audit Logs

Record important actions:

```text
User
Workspace
Project
Action
Resource
IP
Timestamp
Metadata
```

Examples:

```text
PROJECT_CREATED
PROJECT_DELETED
MEMBER_INVITED
MEMBER_REMOVED
AI_GENERATION_REQUESTED
AI_GENERATION_COMPLETED
BILLING_CHANGED
```

---

# 50. Security Model

Required:

```text
Authentication
Authorization
Tenant isolation
Rate limiting
Input validation
Output validation
CORS
Secure headers
Secret management
Audit logging
Webhook verification
File validation
```

AI security:

```text
Treat web content as untrusted.
Treat uploaded documents as untrusted.
Treat AI output as untrusted.
Never execute generated code automatically.
Never allow AI to bypass authorization.
```

---

# 51. Environment Strategy

```text
local
development
staging
production
```

Required configuration:

```env
NODE_ENV=

DATABASE_URL=
REDIS_URL=

AUTH_SECRET=

AI_PROVIDER=
AI_API_KEY=

OBJECT_STORAGE_ENDPOINT=
OBJECT_STORAGE_BUCKET=
OBJECT_STORAGE_ACCESS_KEY=
OBJECT_STORAGE_SECRET_KEY=

PAYMENT_SECRET=

WEB_URL=
API_URL=
```

Secrets never belong in Git.

---

# 52. Docker

Local infrastructure:

```text
PostgreSQL
Redis
Object Storage
```

Example:

```text
docker-compose.yml
```

Services:

```text
postgres
redis
minio
```

Application containers are optional for local development but required for reproducible CI/staging environments.

---

# 53. Observability

Every API request should have:

```text
requestId
userId
workspaceId
projectId
```

where applicable.

Track:

```text
HTTP latency
HTTP errors
database latency
queue latency
AI latency
AI tokens
AI cost
worker failures
provider failures
```

Use structured JSON logging.

---

# 54. Testing

## Unit

```text
Domain logic
Use cases
Validators
Permission checks
AI parsing
Utility functions
```

## Integration

```text
API
Database
Repositories
Authentication
Authorization
Redis
Queues
Webhooks
```

## E2E

Primary journey:

```text
Sign up
 ↓
Create workspace
 ↓
Create project
 ↓
Enter idea
 ↓
Answer questions
 ↓
Generate product brief
 ↓
Generate MVP
 ↓
Generate roadmap
 ↓
View tasks
```

This workflow is the highest-priority regression test.

---

# 55. AI Evaluation

Maintain benchmark ideas:

```text
docs/evals/
├── marketplace/
├── saas/
├── education/
├── healthcare/
├── fintech/
├── ecommerce/
└── mobile/
```

Evaluate:

```text
Completeness
Consistency
Feasibility
MVP quality
Duplicate detection
Hallucinations
Technical quality
Clarity
```

Every major AI workflow change should run regression evaluation.

---

# 56. Architecture Decision Records

Location:

```text
docs/adr/
```

Naming:

```text
001-monorepo.md
002-postgresql.md
003-nestjs.md
004-ai-provider-abstraction.md
005-background-workers.md
006-multi-tenancy.md
007-project-versioning.md
```

Every durable architectural decision should have an ADR.

---

# 57. Coding Standards

TypeScript:

```text
strict: true
```

Rules:

```text
No unnecessary any.
Validate external inputs.
Validate AI output.
No hidden database access from controllers.
No direct AI provider calls outside AI package.
No cross-module database access without a defined application contract.
```

Naming:

```text
Folders: kebab-case
Files: kebab-case
Classes: PascalCase
Functions: camelCase
Types: PascalCase
Constants: UPPER_SNAKE_CASE
```

---

# 58. Dependency Rules

Allowed:

```text
Web → packages
Mobile → packages
API → packages
Workers → packages
```

Not allowed:

```text
packages → apps
mobile → API implementation
web → database
mobile → database
AI workflow → controller
```

The dependency direction should remain:

```text
UI
 ↓
Application
 ↓
Domain
 ↓
Infrastructure
```

---

# 59. Pull Request Process

Branch:

```text
feature/*
fix/*
refactor/*
chore/*
security/*
```

Example:

```text
feature/idea-question-engine
```

PR must contain:

```text
What changed?
Why?
How tested?
Database migration?
API change?
Environment change?
Security impact?
```

Checklist:

```text
[ ] Tests
[ ] Typecheck
[ ] Lint
[ ] Build
[ ] Migration reviewed
[ ] Authorization reviewed
[ ] Tenant isolation reviewed
[ ] Documentation updated
```

---

# 60. Commit Convention

Use Conventional Commits.

```text
feat:
fix:
refactor:
test:
docs:
chore:
perf:
security:
```

Examples:

```text
feat(projects): add project creation

feat(ai): add mvp generation workflow

fix(auth): enforce workspace membership

test(roadmap): add generation tests

security(api): restrict cross-tenant project access
```

---

# 61. Definition of Done

A feature is not done until:

```text
[ ] Requirement implemented
[ ] API completed
[ ] Validation added
[ ] Authorization added
[ ] Tenant isolation verified
[ ] Database migration added
[ ] UI completed
[ ] Loading state handled
[ ] Error state handled
[ ] Tests added
[ ] Logging added where required
[ ] Documentation updated
[ ] Code reviewed
```

AI features additionally require:

```text
[ ] Prompt version
[ ] Structured schema
[ ] Output validation
[ ] Retry strategy
[ ] Failure handling
[ ] Token tracking
[ ] Cost tracking
[ ] Evaluation cases
[ ] Regression tests
```

---

# 62. Development Phases

## Phase 1 — Foundation

```text
Monorepo
Node 24
NestJS
Next.js
PostgreSQL
Prisma
Redis
Docker
CI
Authentication
```

## Phase 2 — Core Product

```text
Workspace
Project
Idea
Questions
Answers
Dashboard
```

## Phase 3 — AI MVP

```text
Idea Analyzer
Product Brief
MVP Generator
Feature Generator
Roadmap Generator
Task Generator
```

## Phase 4 — Validation

```text
Research
Competitors
Assumptions
Risk analysis
```

## Phase 5 — Product Design

```text
User Stories
User Flows
Screen Specifications
```

## Phase 6 — Technical Planning

```text
Architecture
Database Design
API Design
Technical Decisions
```

## Phase 7 — Execution

```text
Code Generation
GitHub Integration
Repository Generation
CI/CD Generation
Deployment
```

---

# 63. MVP Boundary

The first public release should contain:

```text
Authentication
Workspace
Project
Idea capture
AI clarification
Product brief
MVP features
Roadmap
Tasks
Export
Basic usage limits
```

Do not make these MVP requirements:

```text
Code generation
GitHub integration
Deployment automation
Advanced collaboration
Mobile application
Complex visual editor
Microservices
Kafka
Dedicated vector database
```

---

# 64. Target End-State

The eventual platform should support:

```text
                VENTURESKETCH
                     │
           ┌─────────┴─────────┐
           │                   │
      PRODUCT INTELLIGENCE   EXECUTION
           │                   │
       Idea                  Code
       Research              Repository
       Validation            Tests
       MVP                   CI/CD
       UX                    Deployment
       Architecture          Monitoring
       Roadmap
       Tasks
           │                   │
           └─────────┬─────────┘
                     │
                 LIVE PRODUCT
```

The platform becomes:

> **An operating system for turning product ideas into software.**

---

# 65. Engineering Golden Rule

Before implementing any feature, answer:

```text
1. Which domain owns it?
2. What is the source of truth?
3. What database entities are required?
4. What API contract is required?
5. What permission is required?
6. Does it need a background job?
7. Does it use AI?
8. How is AI output validated?
9. How is usage/cost tracked?
10. How is it tested?
11. How is it observed?
12. Does it need versioning?
```

If these questions cannot be answered clearly, the feature is not ready for implementation.

---

# 66. Initial Build Order

```text
01  Repository
02  CI/CD
03  Local Docker
04  PostgreSQL
05  Prisma
06  NestJS API
07  Next.js
08  Authentication
09  Workspace
10  Project
11  Idea
12  Questions
13  AI provider abstraction
14  Idea analyzer
15  Product brief
16  MVP generator
17  Feature management
18  Roadmap generator
19  Tasks
20  Usage tracking
21  Export
```

Only after this flow is stable should the team expand into:

```text
Research
UX
Architecture
Database generation
API generation
Code generation
GitHub
Deployment
Mobile
```

---

# 67. Repository Naming

```text
Repository:
venture-sketch

Web:
@venture-sketch/web

API:
@venture-sketch/api

Mobile:
@venture-sketch/mobile

Packages:
@venture-sketch/types
@venture-sketch/validators
@venture-sketch/api-client
@venture-sketch/database
@venture-sketch/ai
@venture-sketch/auth
@venture-sketch/ui

Workers:
@venture-sketch/ai-worker
@venture-sketch/research-worker
```

---

# 68. Architecture Status

This document is the default engineering baseline.

Changes to the following require an ADR:

```text
Database technology
Backend framework
Frontend framework
Authentication architecture
Tenant model
AI provider abstraction
Queue architecture
Event architecture
Storage architecture
Major monorepo changes
```

Normal implementation details do not require an ADR.

---

# 69. Final Principle

VentureSketch should never be just:

```text
Chatbot + prompt
```

It should be:

```text
                STRUCTURED PRODUCT MODEL
                         │
        ┌────────────────┼─────────────────┐
        │                │                 │
      BUSINESS           UX            ENGINEERING
        │                │                 │
     Problem           Flows           Architecture
     Users             Screens         Database
     Market            Stories         APIs
     Pricing                           Stack
        │                │                 │
        └────────────────┼─────────────────┘
                         │
                      ROADMAP
                         │
                       TASKS
                         │
                    EXECUTION
```

That structured model is the core intellectual property of the platform.

AI should help create, validate, explain and evolve that model — but the model itself belongs to the user's project.
