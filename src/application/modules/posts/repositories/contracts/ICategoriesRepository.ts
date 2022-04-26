import { ICategory } from '@domain/entities/contracts/ICategory';
import {
  ICreateCategoryRequestDTO,
  ICreateCategoryResponseDTO,
} from '../../dtos/CreateCategoryDTO';

interface ICategoriesRepository {
  create({
    name,
  }: ICreateCategoryRequestDTO): Promise<ICreateCategoryResponseDTO>;
  findByName(name: string): Promise<ICategory>;
  findById(id: string): Promise<ICategory>;
}

export { ICategoriesRepository };
