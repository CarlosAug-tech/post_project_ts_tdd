import { getRepository, Repository } from 'typeorm';
import {
  ICreateCommentRequestDTO,
  ICreateCommentResponseDTO,
} from '@application/modules/posts/dtos/CreateCommentDTO';
import { ICommentsRepository } from '@application/modules/posts/repositories/contracts/ICommentsRepository';
import { Comment } from '../entities/Comment';

class CommentsRepository implements ICommentsRepository {
  private repository: Repository<Comment>;

  constructor() {
    this.repository = getRepository(Comment);
  }

  async create({
    content,
    user_id,
    post_id,
  }: ICreateCommentRequestDTO): Promise<ICreateCommentResponseDTO> {
    const comment = this.repository.create({
      content,
      user_id,
      post_id,
    });

    await this.repository.save(comment);

    return comment;
  }
}

export { CommentsRepository };
