import { sign } from 'jsonwebtoken';

import { IEncryptProvider } from '@infra/container/providers/contracts/IEncryptProvider';
import auth from '@infra/shared/config/auth';

import { inject, injectable } from 'tsyringe';
import { AppError } from '@infra/shared/errors/AppError';
import { IUsersRepository } from '../../repositories/contracts/IUsersRepository';

interface IAuthenticationRequest {
  email: string;
  password: string;
}
interface IAuthenticationResponse {
  user: {
    id: string;
    email: string;
  };
  token: string;
}

@injectable()
class AuthenticationUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('BcryptProvider')
    private bcryptProvider: IEncryptProvider,
  ) {}

  async execute({
    email,
    password,
  }: IAuthenticationRequest): Promise<IAuthenticationResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Email or password invalid');
    }

    const passwordMatch = await this.bcryptProvider.compare(
      password,
      user.password,
    );

    if (!passwordMatch) {
      throw new AppError('Email or password invalid');
    }

    const token = sign({}, auth.jwt_token_secret, {
      subject: user.id,
      expiresIn: auth.jwt_experies_in,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    };
  }
}

export { AuthenticationUserUseCase };
