import { ICategory } from '@domain/entities/contracts/ICategory';
import { IPost } from '@domain/entities/contracts/IPost';
import { AppError } from '@infra/shared/errors/AppError';
import { CategoriesRepositoryInMemory } from '../../repositories/in-memory/CategoriesRepositoryInMemory';
import { CommentsRepositoryInMemory } from '../../repositories/in-memory/CommentsRepositoryInMemory';
import { PostsRepositoryInMemory } from '../../repositories/in-memory/PostsRepositoryInMemory';
import { ListCommentsUseCase } from './ListCommentsUseCase';

let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;
let postsRepositoryInMemory: PostsRepositoryInMemory;
let commentsRepositoryInMemory: CommentsRepositoryInMemory;
let listCommentsUseCase: ListCommentsUseCase;

let post: IPost;
let category: ICategory;

describe('List Comments UseCase', () => {
  beforeAll(async () => {
    commentsRepositoryInMemory = new CommentsRepositoryInMemory();
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
    postsRepositoryInMemory = new PostsRepositoryInMemory();
    listCommentsUseCase = new ListCommentsUseCase(
      postsRepositoryInMemory,
      commentsRepositoryInMemory,
    );

    category = await categoriesRepositoryInMemory.create({
      name: 'any_category',
    });

    post = await postsRepositoryInMemory.create({
      title: 'any_title',
      description: 'any_description',
      category_id: category.id,
      user_id: 'any_user',
    });

    await commentsRepositoryInMemory.create({
      content: 'any_comment',
      user_id: 'any_user',
      post_id: post.id,
    });
  });

  it('should not be able to list all comments if Post not exists', async () => {
    await expect(listCommentsUseCase.execute('invalid_post')).rejects.toEqual(
      new AppError('This Post not found', 404),
    );
  });

  it('should be able to list all comments of Post selected', async () => {
    const comments = await listCommentsUseCase.execute(post.id);

    expect(comments).toHaveLength(1);
  });
});
