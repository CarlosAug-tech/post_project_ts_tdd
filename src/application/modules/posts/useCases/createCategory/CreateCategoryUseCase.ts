import { AppError } from '@infra/shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import {
  ICreateCategoryRequestDTO,
  ICreateCategoryResponseDTO,
} from '../../dtos/CreateCategoryDTO';
import { ICategoriesRepository } from '../../repositories/contracts/ICategoriesRepository';

@injectable()
class CreateCategoryUseCase {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,
  ) {}

  async execute(
    data: ICreateCategoryRequestDTO,
  ): Promise<ICreateCategoryResponseDTO> {
    const { name } = data;
    const fieldsRequired = ['name'];

    for (const field of fieldsRequired) {
      if (!data[field]) {
        throw new AppError(`The field ${field} is required!`);
      }
    }

    const categoryExists = await this.categoriesRepository.findByName(name);

    if (categoryExists) {
      throw new AppError('This Category already exists');
    }

    const category = await this.categoriesRepository.create({ name });

    return category;
  }
}

export { CreateCategoryUseCase };
