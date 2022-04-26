import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ListPostsUseCase } from './ListPostsUseCase';

class ListPostsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listPostsUseCase = container.resolve(ListPostsUseCase);

    const posts = await listPostsUseCase.execute();

    return response.status(200).json(posts);
  }
}

export { ListPostsController };
