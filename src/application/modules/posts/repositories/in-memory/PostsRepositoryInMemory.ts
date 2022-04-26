import { IPost } from '@domain/entities/contracts/IPost';
import {
  ICreatePostRequestDTO,
  ICreatePostResponseDTO,
} from '../../dtos/CreatePostDTO';
import { Post } from '../../infra/typeorm/entities/Post';
import { IPostsRepository } from '../contracts/IPostsRepository';

class PostsRepositoryInMemory implements IPostsRepository {
  private post: Post[] = [];

  async create({
    title,
    description,
    user_id,
    category_id,
  }: ICreatePostRequestDTO): Promise<ICreatePostResponseDTO> {
    const post = new Post();

    Object.assign(post, {
      title,
      description,
      user_id,
      category_id,
      created_at: new Date(),
    });

    this.post.push(post);

    return post;
  }

  async findById(id: string): Promise<IPost> {
    return this.post.find(post => post.id === id);
  }
}

export { PostsRepositoryInMemory };
