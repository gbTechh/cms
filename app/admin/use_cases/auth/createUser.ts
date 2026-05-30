import { IUserCreate } from "~/admin/interfaces";
import { PrismaUserRepository } from "~/admin/infraestructure";
import { AuthService } from "./service";

export const createUser = async (data: IUserCreate) => {
  const service = new AuthService(new PrismaUserRepository());
  return service.createUser(data.name, data.email, data.password);
};

export const listUsers = async () => {
  const service = new AuthService(new PrismaUserRepository());
  return service.getAll();
};

export const deleteUser = async (id: string) => {
  const service = new AuthService(new PrismaUserRepository());
  return service.delete(id);
};

export const updateUser = async (
  id: string,
  data: { name?: string; email?: string; password?: string }
) => {
  const service = new AuthService(new PrismaUserRepository());
  return service.updateUser(id, data);
};

export const countUsers = async () => {
  const service = new AuthService(new PrismaUserRepository());
  return service.count();
};
