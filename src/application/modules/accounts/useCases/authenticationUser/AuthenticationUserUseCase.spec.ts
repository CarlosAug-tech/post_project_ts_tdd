import { BcryptProvider } from '@infra/container/providers/implementations/BcryptProvider';
import { AppError } from '@infra/shared/errors/AppError';
import { UsersRepositoryInMemory } from '../../repositories/in-memory/UsersRepositoryInMemory';
import { AuthenticationUserUseCase } from './AuthenticationUserUseCase';

const saltHash: number = 12;

let usersRepositoryInMemory: UsersRepositoryInMemory;
let bcryptProvider: BcryptProvider;
let authenticationUserUseCase: AuthenticationUserUseCase;

describe('Authentication User UseCase', () => {
  beforeAll(async () => {
    bcryptProvider = new BcryptProvider();
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    authenticationUserUseCase = new AuthenticationUserUseCase(
      usersRepositoryInMemory,
      bcryptProvider,
    );
  });

  it('should not be able to authenticate an user if Email is invalid', async () => {
    await expect(
      authenticationUserUseCase.execute({
        email: 'invalid_mail@notexists.com',
        password: 'valid_password',
      }),
    ).rejects.toEqual(new AppError('Email or password invalid'));
  });

  it('should not be able to authenticate an user if Password is invalid', async () => {
    const user = {
      name: 'valid_name',
      email: 'valid_email@pass_invalid.com',
      password: 'valid_password',
    };

    const passwordHash = await bcryptProvider.hash(user.password, saltHash);

    await usersRepositoryInMemory.create({
      ...user,
      password: passwordHash,
    });

    await expect(
      authenticationUserUseCase.execute({
        email: user.email,
        password: 'invalid_password',
      }),
    ).rejects.toEqual(new AppError('Email or password invalid'));
  });

  it('should be able to authenticate an user registred', async () => {
    const user = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    };

    const passwordHash = await bcryptProvider.hash(user.password, saltHash);

    await usersRepositoryInMemory.create({
      ...user,
      password: passwordHash,
    });

    const userAuth = await authenticationUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(userAuth).toHaveProperty('token');
  });
});
