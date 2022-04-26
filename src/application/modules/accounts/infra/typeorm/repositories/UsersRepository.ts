import {
  ICreateUserDTO,
  ICreateUserResponseDTO,
} from '@application/modules/accounts/dtos/ICreateUserDTO';
import { IUsersRepository } from '@application/modules/accounts/repositories/contracts/IUsersRepository';
import { IUser } from '@domain/entities/contracts/User';
import { getRepository, Repository } from 'typeorm';
import { User } from '../entities/User';

class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async create({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<ICreateUserResponseDTO> {
    const user = this.repository.create({
      name,
      email,
      password,
    });

    await this.repository.save(user);

    return user;
  }

  async findByEmail(email: string): Promise<IUser> {
    const user = await this.repository.findOne({ email });
    return user;
  }

  async findById(id: string): Promise<IUser> {
    const user = await this.repository.findOne(id);
    return user;
  }
}

export { UsersRepository };
