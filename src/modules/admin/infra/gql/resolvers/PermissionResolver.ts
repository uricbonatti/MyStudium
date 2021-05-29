// type Mutation {
import { IContext } from '@shared/utils/interfaces';
import { container } from 'tsyringe';
import ChangeUserPermissionService from '@modules/admin/services/ChangeUserPermissionService';
import verifyToken from '@shared/utils/tokenValidation';
import GenerateAdminOnFirstRunService from '@modules/admin/services/GenerateAdminOnFirstRunService';

interface RequestChange {
  userId: string;
  permissionLevel: 'admin' | 'moderator' | 'user';
}

export async function changeUserPermission(
  _: any,
  { userId, permissionLevel }: RequestChange,
  { token }: IContext,
) {
  const id = verifyToken(token);
  const service = container.resolve(ChangeUserPermissionService);
  const isPermissionChanged = await service.execute({
    id,
    permissionLevel,
    targetUserId: userId,
  });
  return isPermissionChanged;
}

export async function firstRun() {
  const service = container.resolve(GenerateAdminOnFirstRunService);
  await service.execute();
  return;
}
