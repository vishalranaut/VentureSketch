import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { randomUUID } from 'crypto';

/**
 * RequestLoggingInterceptor — attaches a requestId to every request
 * and emits structured JSON log entries.
 *
 * Never logs: Authorization header, passwords, secrets, or API keys.
 */
@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const requestId = randomUUID();

    // Attach requestId for downstream use (error filter, audit log)
    (request as any).requestId = requestId;

    const { method, url, ip } = request;
    const userAgent = request.get('user-agent') ?? '';
    const userId = (request as any).user?.sub ?? 'anonymous';
    const workspaceId = request.params?.workspaceId ?? '-';
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const { statusCode } = context.switchToHttp().getResponse();
          this.logger.log({
            requestId,
            method,
            url,
            statusCode,
            duration: Date.now() - start,
            userId,
            workspaceId,
            ip,
            userAgent,
          });
        },
        error: (error) => {
          this.logger.error({
            requestId,
            method,
            url,
            duration: Date.now() - start,
            error: error?.message,
            userId,
            workspaceId,
          });
        },
      }),
    );
  }
}
