import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export type Permission =
  | 'workspace.read'
  | 'workspace.update'
  | 'workspace.members.manage'
  | 'project.read'
  | 'project.create'
  | 'project.update'
  | 'project.delete'
  | 'research.run'
  | 'architecture.update'
  | 'roadmap.update'
  | 'task.update'
  | 'billing.read'
  | 'billing.manage';

export type WorkspaceRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';

/**
 * Role → Permission mapping.
 * Each role inherits all permissions of less-privileged roles.
 */
const ROLE_PERMISSIONS: Record<WorkspaceRole, Permission[]> = {
  OWNER: [
    'workspace.read', 'workspace.update', 'workspace.members.manage',
    'project.read', 'project.create', 'project.update', 'project.delete',
    'research.run', 'architecture.update', 'roadmap.update', 'task.update',
    'billing.read', 'billing.manage',
  ],
  ADMIN: [
    'workspace.read', 'workspace.update', 'workspace.members.manage',
    'project.read', 'project.create', 'project.update', 'project.delete',
    'research.run', 'architecture.update', 'roadmap.update', 'task.update',
    'billing.read',
  ],
  MEMBER: [
    'workspace.read',
    'project.read', 'project.create', 'project.update',
    'research.run', 'architecture.update', 'roadmap.update', 'task.update',
  ],
  VIEWER: [
    'workspace.read',
    'project.read',
  ],
};

export const PERMISSIONS_KEY = 'required_permissions';
export const RequirePermission = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

@Injectable()
export class PermissionGuard implements CanActivate {
  private readonly logger = new Logger(PermissionGuard.name);

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no permissions required, allow (WorkspaceGuard already verified membership)
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const member = request.workspaceMember;

    if (!member) {
      // WorkspaceGuard must run before PermissionGuard
      throw new ForbiddenException('Workspace context not resolved');
    }

    const role = member.role as WorkspaceRole;
    const userPermissions = ROLE_PERMISSIONS[role] ?? [];

    const hasAll = requiredPermissions.every((p) => userPermissions.includes(p));

    if (!hasAll) {
      this.logger.warn(
        `AUTHZ_DENIED userId=${request.user?.sub} role=${role} ` +
        `required=${requiredPermissions.join(',')} workspaceId=${member.workspaceId}`
      );
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
