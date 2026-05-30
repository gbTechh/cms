import { TError } from "~/admin/lib";
import { IUser, IUserCreate, IUserError, IUserUpdate } from "../entities";

export interface UserRepository {
  getAll(): Promise<IUser[]>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  count(): Promise<number>;
  create(data: IUserCreate): Promise<{ error: TError<IUserError> | null; user: IUser | null }>;
  update(id: string, data: IUserUpdate): Promise<{ error: TError<IUserError> | null; user: IUser | null }>;
  delete(id: string): Promise<{ error: TError<IUserError> | null; user: IUser | null }>;
}
