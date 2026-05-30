import { PrismaSingleton } from "../bd";
import { IUser, IUserCreate, IUserError, IUserUpdate, UserRepository } from "~/admin/interfaces";
import { CatchError, TError } from "~/admin/lib";

const prisma = PrismaSingleton.getInstance();

const mapUser = (u: any): IUser => ({
  id: u.id,
  name: u.name,
  email: u.email,
  password: u.password,
  createdAt: u.createdAt.toISOString(),
  updatedAt: u.updatedAt.toISOString(),
});

export class PrismaUserRepository implements UserRepository {
  async getAll(): Promise<IUser[]> {
    const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });
    return users.map(mapUser);
  }

  async findById(id: string): Promise<IUser | null> {
    const u = await prisma.user.findUnique({ where: { id } });
    return u ? mapUser(u) : null;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const u = await prisma.user.findUnique({ where: { email } });
    return u ? mapUser(u) : null;
  }

  async count(): Promise<number> {
    return prisma.user.count();
  }

  async create(data: IUserCreate): Promise<{ error: TError<IUserError> | null; user: IUser | null }> {
    try {
      const u = await prisma.user.create({ data });
      return { error: null, user: mapUser(u) };
    } catch (error) {
      return { error: CatchError(error, "crear"), user: null };
    }
  }

  async update(id: string, data: IUserUpdate): Promise<{ error: TError<IUserError> | null; user: IUser | null }> {
    try {
      const u = await prisma.user.update({ where: { id }, data });
      return { error: null, user: mapUser(u) };
    } catch (error) {
      return { error: CatchError(error, "actualizar"), user: null };
    }
  }

  async delete(id: string): Promise<{ error: TError<IUserError> | null; user: IUser | null }> {
    try {
      const u = await prisma.user.delete({ where: { id } });
      return { error: null, user: mapUser(u) };
    } catch (error) {
      return { error: CatchError(error, "eliminar"), user: null };
    }
  }
}
