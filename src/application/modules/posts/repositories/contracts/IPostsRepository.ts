import { IPost } from '@domain/entities/contracts/IPost';
import {
  ICreatePostRequestDTO,
  ICreatePostResponseDTO,
} from '../../dtos/CreatePostDTO';

interface IPostsRepository {
  create({
    title,
    description,
    user_id,
    category_id,
  }: ICreatePostRequestDTO): Promise<ICreatePostResponseDTO>;
  findById(id: string): Promise<IPost>;
}

export { IPostsRepository };
