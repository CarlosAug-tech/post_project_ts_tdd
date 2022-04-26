import { BcryptProvider } from '@infra/container/providers/implementations/BcryptProvider';
import { AppError } from '@infra/shared/errors/AppError';
import { UsersRepositoryInMemory } from '../../repositories/in-memory/UsersRepositoryInMemory';
import { CreateUserUseCase } from './CreateUserUserCase';

let createUserUseCase: CreateUserUseCase;
let bcryptProvider: BcryptProvider;
let usersRepositoryInMemory: UsersRepositoryInMemory;

describe('Create User UseCase', () => {
  beforeAll(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    bcryptProvider = new BcryptProvider();
    createUserUseCase = new CreateUserUseCase(
      usersRepositoryInMemory,
      bcryptProvider,
    );
  });

  it('should not be able to create a new User if Name not is provided', async () => {
    const user = {
      name: '',
      email: 'valid_mail@email.com',
      password: 'valid_password',
      confirmPassword: 'valid_password',
    };

    await expect(createUserUseCase.execute(user)).rejects.toEqual(
      new AppError('The field name is required!'),
    );
  });

  it('should not be able to create a new User if Email not is provided', async () => {
    const user = {
      name: 'valid_name',
      email: '',
      password: 'valid_password',
      confirmPassword: 'valid_password',
    };

    await expect(createUserUseCase.execute(user)).rejects.toEqual(
      new AppError('The field email is required!'),
    );
  });

  it('should not be able to create a new User if Password not is provided', async () => {
    const user = {
      name: 'valid_name',
      email: 'valid_mail@email.com',
      password: '',
      confirmPassword: 'valid_password',
    };

    await expect(createUserUseCase.execute(user)).rejects.toEqual(
      new AppError('The field password is required!'),
    );
  });

  it('should not be able to create a new User if ConfirmPassword not is provided', async () => {
    const user = {
      name: 'valid_name',
      email: 'valid_mail@email.com',
      password: 'valid_password',
      confirmPassword: '',
    };

    await expect(createUserUseCase.execute(user)).rejects.toEqual(
      new AppError('The field confirmPassword is required!'),
    );
  });

  it('should not be able to create a new User if email already exists', async () => {
    const user = {
      name: 'valid_name',
      email: 'invalid_mail_exists@email.com',
      password: 'valid_password',
      confirmPassword: 'valid_password',
    };

    await createUserUseCase.execute(user);

    await expect(createUserUseCase.execute(user)).rejects.toEqual(
      new AppError('Email or password invalid!'),
    );
  });

  it('should not be able to create a new User if Password does not match with ConfirmPassword', async () => {
    const user = {
      name: 'valid_name',
      email: 'valid_mail_test_password@email.com',
      password: 'valid_password',
      confirmPassword: 'invalid_password',
    };

    await expect(createUserUseCase.execute(user)).rejects.toEqual(
      new AppError('Password does not match'),
    );
  });

  it('should be able to create a new User', async () => {
    const user = {
      name: 'valid_name',
      email: 'valid_mail@email.com',
      password: 'valid_password',
      confirmPassword: 'valid_password',
    };

    const newUser = await createUserUseCase.execute(user);

    expect(newUser).toHaveProperty('id');
    expect(newUser).toEqual({
      id: newUser.id,
      name: 'valid_name',
      email: 'valid_mail@email.com',
      created_at: newUser.created_at,
    });
  });
});
