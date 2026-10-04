import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SecurityEvent } from '@venture-sketch/types';

export interface AuditLogEntry {
  workspaceId?: string;
  actorId?: string;
  actorType?: 'USER' | 'SYSTEM' | 'WORKER';
  resourceType: string;
  resourceId?: string;
  action: string;
  result: 'SUCCESS' | 'FAILURE' | 'BLOCKED';
  requestId?: string;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

/**
 * AuditLogService — append-only audit logging.
 *
 * Rules:
 * - Never update or delete audit records
 * - Redact sensitive fields before persistence
 * - Emit structured logs for real-time monitoring
 * - Failures to write audit logs must NOT propagate to the caller
 *   (audit log unavailability should not break business operations)
 */
@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  private static readonly REDACTED_KEYS = new Set([
    'password', 'token', 'secret', 'apiKey', 'api_key',
    'accessToken', 'refreshToken', 'authorization', 'creditCard',
    'cardNumber', 'cvv', 'ssn',
  ]);

  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Emit a security event to the audit log.
   * Failures are swallowed — never interrupt the business flow.
   */
  async emit(event: string, entry: AuditLogEntry): Promise<void> {
    const sanitizedMetadata = this.redact(entry.metadata ?? {});

    // Structured log for real-time monitoring / SIEM integration
    this.logger.log({
      event,
      ...entry,
      metadata: sanitizedMetadata,
      timestamp: new Date().toISOString(),
    });

    // Persist to append-only DB table
    try {
      await this.prisma.auditLog.create({
        data: {
          action: event,
          workspaceId: entry.workspaceId,
          actorId: entry.actorId,
          actorType: entry.actorType ?? 'SYSTEM',
          resourceType: entry.resourceType,
          resourceId: entry.resourceId,
          result: entry.result,
          requestId: entry.requestId,
          ip: entry.ip,
          userAgent: entry.userAgent,
          metadata: sanitizedMetadata,
        },
      });
    } catch (err) {
      // Audit log write failure must never propagate
      this.logger.error(`Failed to persist audit log for event: ${event}`, err);
    }
  }

  /**
   * Redact sensitive fields from metadata before logging.
   */
  private redact(obj: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (AuditLogService.REDACTED_KEYS.has(key.toLowerCase())) {
        result[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result[key] = this.redact(value as Record<string, unknown>);
      } else {
        result[key] = value;
      }
    }
    return result;
  }
}
