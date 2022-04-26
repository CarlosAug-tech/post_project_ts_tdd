import { AppError } from '@infra/shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import {
  ICreatePostRequestDTO,
  ICreatePostResponseDTO,
} from '../../dtos/CreatePostDTO';
import { ICategoriesRepository } from '../../repositories/contracts/ICategoriesRepository';
import { IPostsRepository } from '../../repositories/contracts/IPostsRepository';

@injectable()
class CreatePostUseCase {
  constructor(
    @inject('PostsRepository')
    private postsRepository: IPostsRepository,
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,
  ) {}

  async execute(data: ICreatePostRequestDTO): Promise<ICreatePostResponseDTO> {
    const { title, description, user_id, category_id } = data;
    const fieldsRequired = ['title', 'description', 'user_id', 'category_id'];

    for (const field of fieldsRequired) {
      if (!data[field]) {
        throw new AppError(`The field ${field} is required`);
      }
    }

    const category = await this.categoriesRepository.findById(category_id);

    if (!category) {
      throw new AppError('This category not exists');
    }

    const post = await this.postsRepository.create({
      title,
      description,
      user_id,
      category_id,
    });

    return post;
  }
}

export { CreatePostUseCase };
