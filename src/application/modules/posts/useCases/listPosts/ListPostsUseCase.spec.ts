import { PostsRepositoryInMemory } from '../../repositories/in-memory/PostsRepositoryInMemory';
import { ListPostsUseCase } from './ListPostsUseCase';

let postsRepositoryInMemory: PostsRepositoryInMemory;
let listPostsUseCase: ListPostsUseCase;

describe('List Posts UseCase', () => {
  beforeAll(() => {
    postsRepositoryInMemory = new PostsRepositoryInMemory();
    listPostsUseCase = new ListPostsUseCase(postsRepositoryInMemory);
  });

  it('should be able to list all posts available', async () => {
    const post = await postsRepositoryInMemory.create({
      title: 'any_title',
      description: 'any_description',
      category_id: 'any_category',
      user_id: 'any_user',
    });

    const posts = await listPostsUseCase.execute();

    expect(posts).toHaveLength(1);
    expect(posts).toEqual([
      {
        id: post.id,
        title: 'any_title',
        description: 'any_description',
        category_id: 'any_category',
        user_id: 'any_user',
        created_at: post.created_at,
      },
    ]);
  });
});
