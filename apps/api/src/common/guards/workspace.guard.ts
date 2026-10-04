import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * WorkspaceGuard — enforces multi-tenant boundary.
 *
 * Resolves workspaceId from URL params (never from the request body).
 * Performs a live DB lookup on WorkspaceMember to verify the authenticated
 * user is an active member of the requested workspace.
 *
 * Attaches `request.workspaceMember` for downstream permission checks.
 */
@Injectable()
export class WorkspaceGuard implements CanActivate {
  private readonly logger = new Logger(WorkspaceGuard.name);

  constructor(private readonly prisma: PrismaClient) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // userId comes from verified JWT (set by AuthGuard)
    const userId: string | undefined = request.user?.sub;
    if (!userId) {
      throw new ForbiddenException('Unauthenticated');
    }

    // workspaceId comes from URL params — never from body, query, or headers
    const workspaceId: string | undefined = request.params?.workspaceId;
    if (!workspaceId) {
      throw new ForbiddenException('Workspace context missing');
    }

    // Live DB lookup — no cached trust, no JWT claim trust for workspace
    const member = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: { workspaceId, userId },
      },
      select: { role: true, workspaceId: true, userId: true },
    });

    if (!member) {
      this.logger.warn(`TENANT_ACCESS_DENIED userId=${userId} workspaceId=${workspaceId}`);
      // NOTE: emit audit event here in production
      throw new ForbiddenException('Access denied to workspace');
    }

    // Attach resolved membership — downstream can use this without another DB call
    request.workspaceMember = member;
    return true;
  }
}
