import { z } from 'zod';

/**
 * Zod schemas for BullMQ job payloads.
 *
 * Every job received by a worker must be validated against one of these
 * schemas before processing begins. Malformed payloads are moved to the
 * dead-letter queue — never silently processed or retried indefinitely.
 */

/** Common IDs schema — CUIDs only */
const CuidString = z.string().min(1).max(50).regex(/^c[a-z0-9]{24,}$/, 'Must be a valid CUID');

/** Analyze Idea job */
export const AnalyzeIdeaJobSchema = z.object({
  ideaId: CuidString,
  generationId: CuidString,
  workspaceId: CuidString,
  projectId: CuidString,
  rawDescription: z.string().min(1).max(10_000),
});
export type AnalyzeIdeaJobPayload = z.infer<typeof AnalyzeIdeaJobSchema>;

/** Generate MVP Features job */
export const GenerateMvpJobSchema = z.object({
  generationId: CuidString,
  workspaceId: CuidString,
  projectId: CuidString,
  ideaId: CuidString,
});
export type GenerateMvpJobPayload = z.infer<typeof GenerateMvpJobSchema>;

/** Generate Roadmap job */
export const GenerateRoadmapJobSchema = z.object({
  generationId: CuidString,
  workspaceId: CuidString,
  projectId: CuidString,
});
export type GenerateRoadmapJobPayload = z.infer<typeof GenerateRoadmapJobSchema>;

/** Research job */
export const ResearchJobSchema = z.object({
  reportId: CuidString,
  workspaceId: CuidString,
  projectId: CuidString,
  query: z.string().min(1).max(500),
  urls: z.array(z.string().url()).max(10).optional(),
});
export type ResearchJobPayload = z.infer<typeof ResearchJobSchema>;

/** Document processing job */
export const DocumentJobSchema = z.object({
  fileId: CuidString,
  workspaceId: CuidString,
  projectId: CuidString,
  storageKey: z.string().min(1).max(1000),
  mimeType: z.enum([
    'application/pdf',
    'text/plain',
    'text/markdown',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]),
});
export type DocumentJobPayload = z.infer<typeof DocumentJobSchema>;

/** Export job */
export const ExportJobSchema = z.object({
  exportId: CuidString,
  workspaceId: CuidString,
  projectId: CuidString,
  format: z.enum(['pdf', 'markdown', 'json', 'zip']),
});
export type ExportJobPayload = z.infer<typeof ExportJobSchema>;

/**
 * Allowlisted job names per queue.
 * Any job name not on this list is rejected and moved to DLQ.
 */
export const ALLOWED_AI_JOBS = ['analyze-idea', 'generate-mvp', 'generate-roadmap'] as const;
export const ALLOWED_RESEARCH_JOBS = ['research-report'] as const;
export const ALLOWED_DOCUMENT_JOBS = ['process-document'] as const;
export const ALLOWED_EXPORT_JOBS = ['export-project'] as const;

export type AllowedAIJob = typeof ALLOWED_AI_JOBS[number];
export type AllowedResearchJob = typeof ALLOWED_RESEARCH_JOBS[number];
export type AllowedDocumentJob = typeof ALLOWED_DOCUMENT_JOBS[number];
export type AllowedExportJob = typeof ALLOWED_EXPORT_JOBS[number];
