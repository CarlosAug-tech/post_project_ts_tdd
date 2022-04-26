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
}

export { ICommentsRepository };
