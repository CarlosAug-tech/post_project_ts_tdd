import { IUser } from '@domain/entities/contracts/User';
import {
  ICreateUserDTO,
  ICreateUserResponseDTO,
} from '../../dtos/ICreateUserDTO';
import { User } from '../../infra/typeorm/entities/User';
import { IUsersRepository } from '../contracts/IUsersRepository';

class UsersRepositoryInMemory implements IUsersRepository {
  private user: User[] = [];

  async create({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<ICreateUserResponseDTO> {
    const user = new User();

    Object.assign(user, {
      name,
      email,
      password,
      created_at: new Date(),
    });

    this.user.push(user);

    const { id, created_at } = user;

    return {
      id,
      name,
      email,
      created_at,
    };
  }

  async findByEmail(email: string): Promise<IUser> {
    return this.user.find(user => user.email === email);
  }

  async findById(id: string): Promise<IUser> {
    return this.user.find(user => user.id === id);
  }
}

export { UsersRepositoryInMemory };
