import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { AuthenticationUserUseCase } from './AuthenticationUserUseCase';

class AuthenticationUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticationUserUseCase = container.resolve(
      AuthenticationUserUseCase,
    );

    const authUser = await authenticationUserUseCase.execute({
      email,
      password,
    });

    return response.status(200).json(authUser);
  }
}

export { AuthenticationUserController };
