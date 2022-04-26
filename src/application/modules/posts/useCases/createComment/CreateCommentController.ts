import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateCommentUseCase } from './CreateCommentUseCase';

class CreateCommentController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { content, post_id } = request.body;
    const { id: user_id } = request.user;

    const createCommentUseCase = container.resolve(CreateCommentUseCase);

    const comment = await createCommentUseCase.execute({
      content,
      post_id,
      user_id,
    });

    return response.status(201).json(comment);
  }
}

export { CreateCommentController };
