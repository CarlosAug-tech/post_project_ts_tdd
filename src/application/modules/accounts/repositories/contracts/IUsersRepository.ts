import { IUser } from '@domain/entities/contracts/User';
import {
  ICreateUserDTO,
  ICreateUserResponseDTO,
} from '../../dtos/ICreateUserDTO';

interface IUsersRepository {
  create({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<ICreateUserResponseDTO>;
  findByEmail(email: string): Promise<IUser>;
  findById(id: string): Promise<IUser>;
}

export { IUsersRepository };
