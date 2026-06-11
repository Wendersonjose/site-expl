import * as userService from './users.service.js';
import { ok, created, noContent } from '../../shared/httpResponse.js';

export async function listUsers(req, res) {
  const users = await userService.listUsers();
  return ok(res, users);
}

export async function getUserById(req, res) {
  const user = await userService.getUserById(req.params.id);
  return ok(res, user);
}

export async function createUser(req, res) {
  const user = await userService.createUser(req.body);
  return created(res, user);
}

export async function updateUser(req, res) {
  const user = await userService.updateUser(req.params.id, req.body);
  return ok(res, user);
}

export async function deleteUser(req, res) {
  await userService.deleteUser(req.params.id);
  return noContent(res);
}
