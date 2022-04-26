import { ICategory } from '@domain/entities/contracts/ICategory';
import {
  ICreateCategoryRequestDTO,
  ICreateCategoryResponseDTO,
} from '../../dtos/CreateCategoryDTO';
import { Category } from '../../infra/typeorm/entities/Category';
import { ICategoriesRepository } from '../contracts/ICategoriesRepository';

class CategoriesRepositoryInMemory implements ICategoriesRepository {
  private category: Category[] = [];

  async create({
    name,
  }: ICreateCategoryRequestDTO): Promise<ICreateCategoryResponseDTO> {
    const category = new Category();

    Object.assign(category, {
      name,
      created_at: new Date(),
    });

    this.category.push(category);

    return category;
  }

  async findByName(name: string): Promise<ICategory> {
    return this.category.find(
      category => category.name.toLowerCase() === name.toLowerCase(),
    );
  }

  async findById(id: string): Promise<ICategory> {
    return this.category.find(category => category.id === id);
  }
}

export { CategoriesRepositoryInMemory };
