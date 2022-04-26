import { AppError } from '@infra/shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import {
  ICreateCommentRequestDTO,
  ICreateCommentResponseDTO,
} from '../../dtos/CreateCommentDTO';
import { ICommentsRepository } from '../../repositories/contracts/ICommentsRepository';
import { IPostsRepository } from '../../repositories/contracts/IPostsRepository';

@injectable()
class CreateCommentUseCase {
  constructor(
    @inject('CommentsRepository')
    private commentsRepository: ICommentsRepository,
    @inject('PostsRepository')
    private postsRepository: IPostsRepository,
  ) {}

  async execute(
    data: ICreateCommentRequestDTO,
  ): Promise<ICreateCommentResponseDTO> {
    const { content, user_id, post_id } = data;
    const requiredFields = ['content', 'user_id', 'post_id'];

    for (const field of requiredFields) {
      if (!data[field]) {
        throw new AppError(`The field ${field} is required!`);
      }
    }

    const postExists = await this.postsRepository.findById(post_id);

    if (!postExists) {
      throw new AppError('This post not exists!');
    }

    const comment = await this.commentsRepository.create({
      content,
      user_id,
      post_id,
    });

    return comment;
  }
}

export { CreateCommentUseCase };
