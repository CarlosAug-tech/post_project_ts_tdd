import { IEncryptProvider } from '@infra/container/providers/contracts/IEncryptProvider';
import { AppError } from '@infra/shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '../../repositories/contracts/IUsersRepository';

interface ICreateUserRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ICreateUserResponse {
  id: string;
  name: string;
  email: string;
  created_at: Date;
}

@injectable()
class CreateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('BcryptProvider')
    private bcryptProvider: IEncryptProvider,
  ) {}

  async execute(data: ICreateUserRequest): Promise<ICreateUserResponse> {
    const { name, email, password, confirmPassword } = data;
    const requiredFields = ['name', 'email', 'password', 'confirmPassword'];
    const saltHash = 12;

    for (const field of requiredFields) {
      if (!data[field]) {
        throw new AppError(`The field ${field} is required!`);
      }
    }

    const userExists = await this.usersRepository.findByEmail(email);

    if (userExists) {
      throw new AppError('Email or password invalid!');
    }

    if (password !== confirmPassword) {
      throw new AppError('Password does not match');
    }

    const passwordHash = await this.bcryptProvider.hash(password, saltHash);

    const user = await this.usersRepository.create({
      name,
      email,
      password: passwordHash,
    });

    return user;
  }
}

export { CreateUserUseCase };
