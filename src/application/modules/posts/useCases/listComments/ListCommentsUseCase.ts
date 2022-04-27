import { IComment } from '@domain/entities/contracts/IComment';
import { AppError } from '@infra/shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { ICommentsRepository } from '../../repositories/contracts/ICommentsRepository';
import { IPostsRepository } from '../../repositories/contracts/IPostsRepository';

@injectable()
class ListCommentsUseCase {
  constructor(
    @inject('PostsRepository')
    private postsRepository: IPostsRepository,
    @inject('CommentsRepository')
    private commentsRepository: ICommentsRepository,
  ) {}

  async execute(post_id: string): Promise<IComment[]> {
    const postExists = await this.postsRepository.findById(post_id);

    if (!postExists) {
      throw new AppError('This Post not found', 404);
    }

    const comments = await this.commentsRepository.findAllCommentsByPost(
      post_id,
    );

    return comments;
  }
}

export { ListCommentsUseCase };
