import { IComment } from '@domain/entities/contracts/IComment';
import {
  ICreateCommentRequestDTO,
  ICreateCommentResponseDTO,
} from '../../dtos/CreateCommentDTO';

interface ICommentsRepository {
  create({
    content,
    user_id,
    post_id,
  }: ICreateCommentRequestDTO): Promise<ICreateCommentResponseDTO>;
  findAllCommentsByPost(post_id: string): Promise<IComment[]>;
}

export { ICommentsRepository };
