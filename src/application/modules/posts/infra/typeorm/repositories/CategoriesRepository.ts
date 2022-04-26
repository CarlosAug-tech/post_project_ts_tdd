import {
  ICreateCategoryRequestDTO,
  ICreateCategoryResponseDTO,
} from '@application/modules/posts/dtos/CreateCategoryDTO';
import { ICategoriesRepository } from '@application/modules/posts/repositories/contracts/ICategoriesRepository';
import { ICategory } from '@domain/entities/contracts/ICategory';
import { getRepository, Repository } from 'typeorm';
import { Category } from '../entities/Category';

class CategoriesRepository implements ICategoriesRepository {
  private repository: Repository<Category>;

  constructor() {
    this.repository = getRepository(Category);
  }

  async create({
    name,
  }: ICreateCategoryRequestDTO): Promise<ICreateCategoryResponseDTO> {
    const category = this.repository.create({ name });

    await this.repository.save(category);

    return category;
  }

  async findByName(name: string): Promise<ICategory> {
    const category = await this.repository.findOne({ name });
    return category;
  }

  async findById(id: string): Promise<ICategory> {
    const category = await this.repository.findOne(id);
    return category;
  }
}

export { CategoriesRepository };
