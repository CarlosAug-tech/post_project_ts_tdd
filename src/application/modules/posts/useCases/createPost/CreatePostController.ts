import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreatePostUseCase } from './CreatePostUseCase';

class CreatePostController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { title, description, category_id } = request.body;
    const { id: user_id } = request.user;

    const createPostUseCase = container.resolve(CreatePostUseCase);

    const post = await createPostUseCase.execute({
      title,
      description,
      category_id,
      user_id,
    });

    return response.status(201).json(post);
  }
}

export { CreatePostController };
