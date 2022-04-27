import { getRepository, Repository } from 'typeorm';

import {
  ICreatePostRequestDTO,
  ICreatePostResponseDTO,
} from '@application/modules/posts/dtos/CreatePostDTO';
import { IPostsRepository } from '@application/modules/posts/repositories/contracts/IPostsRepository';
import { IPost } from '@domain/entities/contracts/IPost';
import { Post } from '../entities/Post';

class PostsRepository implements IPostsRepository {
  private repository: Repository<Post>;

  constructor() {
    this.repository = getRepository(Post);
  }

  async create({
    title,
    description,
    user_id,
    category_id,
  }: ICreatePostRequestDTO): Promise<ICreatePostResponseDTO> {
    const post = this.repository.create({
      title,
      description,
      user_id,
      category_id,
    });

    await this.repository.save(post);

    return post;
  }

  async findById(id: string): Promise<IPost> {
    const post = await this.repository.findOne(id);
    return post;
  }

  async listAll(): Promise<IPost[]> {
    const posts = await this.repository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.user', 'user')
      .select(['post.id', 'post.title', 'post.description'])
      .addSelect(['category.id', 'category.name', 'user.id', 'user.name'])
      .orderBy('post.created_at', 'DESC')
      .limit(10)
      .getMany();

    return posts;
  }
}

export { PostsRepository };
