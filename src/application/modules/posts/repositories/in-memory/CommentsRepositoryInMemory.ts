import { IComment } from '@domain/entities/contracts/IComment';
import {
  ICreateCommentRequestDTO,
  ICreateCommentResponseDTO,
} from '../../dtos/CreateCommentDTO';
import { Comment } from '../../infra/typeorm/entities/Comment';
import { ICommentsRepository } from '../contracts/ICommentsRepository';

class CommentsRepositoryInMemory implements ICommentsRepository {
  private comment: Comment[] = [];

  async create({
    content,
    user_id,
    post_id,
  }: ICreateCommentRequestDTO): Promise<ICreateCommentResponseDTO> {
    const comment = new Comment();

    Object.assign(comment, {
      content,
      user_id,
      post_id,
      created_at: new Date(),
    });

    this.comment.push(comment);

    return comment;
  }

  async findAllCommentsByPost(post_id: string): Promise<IComment[]> {
    return this.comment.filter(comment => comment.post_id === post_id);
  }
}

export { CommentsRepositoryInMemory };
