import { AppError } from '@infra/shared/errors/AppError';
import { CategoriesRepositoryInMemory } from '../../repositories/in-memory/CategoriesRepositoryInMemory';
import { CreateCategoryUseCase } from './CreateCategoryUseCase';

let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;
let createCategoryUseCase: CreateCategoryUseCase;

describe('Create Category UseCase', () => {
  beforeAll(() => {
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
    createCategoryUseCase = new CreateCategoryUseCase(
      categoriesRepositoryInMemory,
    );
  });

  it('should be not able to create a new Category is field Name is not provided', async () => {
    const category = {
      name: '',
    };

    await expect(createCategoryUseCase.execute(category)).rejects.toEqual(
      new AppError('The field name is required!'),
    );
  });

  it('should not be able to create a new Category if a Name of Category already exists', async () => {
    const category = {
      name: 'valid_name_exists',
    };

    await createCategoryUseCase.execute(category);

    await expect(createCategoryUseCase.execute(category)).rejects.toEqual(
      new AppError('This Category already exists'),
    );
  });

  it('should be able to create a new Category', async () => {
    const category = {
      name: 'valid_name',
    };

    const newCategory = await createCategoryUseCase.execute(category);

    expect(newCategory).toHaveProperty('id');
  });
});
