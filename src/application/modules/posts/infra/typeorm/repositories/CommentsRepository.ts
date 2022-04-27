import { getRepository, Repository } from 'typeorm';
import {
  ICreateCommentRequestDTO,
  ICreateCommentResponseDTO,
} from '@application/modules/posts/dtos/CreateCommentDTO';
import { ICommentsRepository } from '@application/modules/posts/repositories/contracts/ICommentsRepository';
import { IComment } from '@domain/entities/contracts/IComment';
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

  async findAllCommentsByPost(post_id: string): Promise<IComment[]> {
    const comments = await this.repository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .select([
        'comment.id',
        'comment.content',
        'comment.created_at',
        'comment.user',
      ])
      .addSelect(['user.id', 'user.name'])
      .where('comment.post_id = :post_id', { post_id })
      .limit(10)
      .orderBy('comment.created_at', 'DESC')
      .getMany();

    return comments;
  }
}

export { CommentsRepository };
