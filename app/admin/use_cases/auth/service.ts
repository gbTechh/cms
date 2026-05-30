import bcrypt from "bcryptjs";
import { UserRepository, IUserError } from "~/admin/interfaces";
import { TError } from "~/admin/lib";

export class AuthService {
  private repo: UserRepository;

  constructor(repo: UserRepository) {
    this.repo = repo;
  }

  async login(email: string, password: string) {
    const user = await this.repo.findByEmail(email);
    const credentialsError: TError<IUserError> = {
      hasError: true,
      message: "Email o contraseña incorrectos",
      body: undefined,
    };

    if (!user) return { error: credentialsError, user: null };

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return { error: credentialsError, user: null };

    return { error: null, user };
  }

  async createUser(name: string, email: string, password: string) {
    const existing = await this.repo.findByEmail(email);
    if (existing) {
      return {
        error: {
          hasError: true,
          message: "El email ya está en uso",
          body: { email: "Este email ya está registrado" },
        } as TError<IUserError>,
        user: null,
      };
    }
    const hash = await bcrypt.hash(password, 10);
    return this.repo.create({ name, email, password: hash });
  }

  async updateUser(id: string, data: { name?: string; email?: string; password?: string }) {
    const update: typeof data = { ...data };
    if (update.password) {
      update.password = await bcrypt.hash(update.password, 10);
    }
    return this.repo.update(id, update);
  }

  async getAll() {
    return this.repo.getAll();
  }

  async count() {
    return this.repo.count();
  }

  async delete(id: string) {
    return this.repo.delete(id);
  }
}
