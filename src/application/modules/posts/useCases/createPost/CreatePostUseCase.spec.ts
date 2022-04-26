import { AppError } from '@infra/shared/errors/AppError';
import { CategoriesRepositoryInMemory } from '../../repositories/in-memory/CategoriesRepositoryInMemory';
import { PostsRepositoryInMemory } from '../../repositories/in-memory/PostsRepositoryInMemory';
import { CreatePostUseCase } from './CreatePostUseCase';

let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;
let postsRepositoryInMemory: PostsRepositoryInMemory;
let createPostUseCase: CreatePostUseCase;

describe('Create Post UseCase', () => {
  beforeAll(() => {
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
    postsRepositoryInMemory = new PostsRepositoryInMemory();
    createPostUseCase = new CreatePostUseCase(
      postsRepositoryInMemory,
      categoriesRepositoryInMemory,
    );
  });

  it('should not be able to create a new Post if the field Title is not provided', async () => {
    const post = {
      title: '',
      description: 'valid_description',
      user_id: 'valid_user_id',
      category_id: 'valid_category',
    };

    await expect(createPostUseCase.execute(post)).rejects.toEqual(
      new AppError('The field title is required'),
    );
  });

  it('should not be able to create a new Post if the field Description is not provided', async () => {
    const post = {
      title: 'valid_title',
      description: '',
      user_id: 'valid_user_id',
      category_id: 'valid_category',
    };

    await expect(createPostUseCase.execute(post)).rejects.toEqual(
      new AppError('The field description is required'),
    );
  });

  it('should not be able to create a new Post if the field User is not provided', async () => {
    const post = {
      title: 'valid_title',
      description: 'valid_description',
      user_id: '',
      category_id: 'valid_category',
    };

    await expect(createPostUseCase.execute(post)).rejects.toEqual(
      new AppError('The field user_id is required'),
    );
  });

  it('should not be able to create a new Post if the field Category is not provided', async () => {
    const post = {
      title: 'valid_title',
      description: 'valid_description',
      user_id: 'valid_user_id',
      category_id: '',
    };

    await expect(createPostUseCase.execute(post)).rejects.toEqual(
      new AppError('The field category_id is required'),
    );
  });

  it('should not be able to create a new Post if Category not exists', async () => {
    const post = {
      title: 'valid_title',
      description: 'valid_description',
      user_id: 'valid_user_id',
      category_id: 'invalid_category_id',
    };

    await expect(createPostUseCase.execute(post)).rejects.toEqual(
      new AppError('This category not exists'),
    );
  });

  it('should be able to create a new Post', async () => {
    const category = await categoriesRepositoryInMemory.create({
      name: 'valid_category',
    });

    const post = {
      title: 'valid_title',
      description: 'valid_description',
      user_id: 'valid_user_id',
      category_id: category.id,
    };

    const newPost = await createPostUseCase.execute(post);

    expect(newPost).toHaveProperty('id');
    expect(newPost).toEqual({
      id: newPost.id,
      title: 'valid_title',
      description: 'valid_description',
      user_id: 'valid_user_id',
      category_id: category.id,
      created_at: newPost.created_at,
    });
  });
});
