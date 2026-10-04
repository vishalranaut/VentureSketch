import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { randomUUID } from 'crypto';

/**
 * GlobalExceptionFilter — sanitizes all API error responses.
 *
 * Rules:
 * - Never expose stack traces in production
 * - Never expose SQL, Redis, or internal service details
 * - Map all unknown errors to 500 with generic message
 * - Always include requestId for correlation
 * - Log full error internally with requestId
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const requestId = (request as any).requestId ?? randomUUID();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let publicCode = 'INTERNAL_ERROR';
    let publicMessage = 'An unexpected error occurred';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resp = exceptionResponse as Record<string, unknown>;
        publicCode = (resp.code as string) ?? this.statusToCode(statusCode);
        publicMessage = (resp.message as string) ?? exception.message;
      } else {
        publicCode = this.statusToCode(statusCode);
        publicMessage = exception.message;
      }
    } else {
      // Log full error internally — never expose to client
      this.logger.error(
        `Unhandled exception: ${(exception as Error)?.message ?? 'Unknown error'}`,
        (exception as Error)?.stack,
        { requestId },
      );
    }

    // Sanitize: strip any internal details from validation errors
    if (Array.isArray(publicMessage)) {
      // NestJS validation errors — safe to expose constraint failures
      publicMessage = (publicMessage as string[]).join(', ');
    }

    response.status(statusCode).json({
      error: {
        code: publicCode,
        message: publicMessage,
        requestId,
      },
    });
  }

  private statusToCode(status: number): string {
    const map: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'UNPROCESSABLE_ENTITY',
      429: 'RATE_LIMIT_EXCEEDED',
      500: 'INTERNAL_ERROR',
      503: 'SERVICE_UNAVAILABLE',
    };
    return map[status] ?? 'ERROR';
  }
}
