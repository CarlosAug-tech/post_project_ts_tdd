import { IPost } from '@domain/entities/contracts/IPost';
import { AppError } from '@infra/shared/errors/AppError';
import { CommentsRepositoryInMemory } from '../../repositories/in-memory/CommentsRepositoryInMemory';
import { PostsRepositoryInMemory } from '../../repositories/in-memory/PostsRepositoryInMemory';
import { CreateCommentUseCase } from './CreateCommentUseCase';

let postsRepositoryInMemory: PostsRepositoryInMemory;
let commentsRepositoryInMemory: CommentsRepositoryInMemory;
let createCommentUseCase: CreateCommentUseCase;

let post: IPost;

describe('Create Comment UseCase', () => {
  beforeAll(async () => {
    postsRepositoryInMemory = new PostsRepositoryInMemory();
    commentsRepositoryInMemory = new CommentsRepositoryInMemory();
    createCommentUseCase = new CreateCommentUseCase(
      commentsRepositoryInMemory,
      postsRepositoryInMemory,
    );

    post = await postsRepositoryInMemory.create({
      title: '',
      description: '',
      category_id: '',
      user_id: '',
    });
  });

  it('should not be able to create a new Comment if the field Content not is provided', async () => {
    const comment = {
      content: '',
      user_id: 'any_user',
      post_id: 'any_post',
    };

    await expect(createCommentUseCase.execute(comment)).rejects.toEqual(
      new AppError('The field content is required!'),
    );
  });

  it('should not be able to create a new Comment if the field User not is provided', async () => {
    const comment = {
      content: 'any_comment',
      user_id: '',
      post_id: 'any_post',
    };

    await expect(createCommentUseCase.execute(comment)).rejects.toEqual(
      new AppError('The field user_id is required!'),
    );
  });

  it('should not be able to create a new Comment if the field Post not is provided', async () => {
    const comment = {
      content: 'any_comment',
      user_id: 'any_user',
      post_id: '',
    };

    await expect(createCommentUseCase.execute(comment)).rejects.toEqual(
      new AppError('The field post_id is required!'),
    );
  });

  it('should not be able to create a new Comment if the Post not exists', async () => {
    const comment = {
      content: 'any_comment',
      user_id: 'any_user',
      post_id: 'invalid_post',
    };

    await expect(createCommentUseCase.execute(comment)).rejects.toEqual(
      new AppError('This post not exists!'),
    );
  });

  it('should be able to create a new Comment in a Post', async () => {
    const comment = {
      content: 'any_comment',
      user_id: 'any_user',
      post_id: post.id,
    };

    const newComment = await createCommentUseCase.execute(comment);

    expect(newComment).toHaveProperty('id');
    expect(newComment).toEqual({
      id: newComment.id,
      content: 'any_comment',
      user_id: 'any_user',
      post_id: newComment.post_id,
      created_at: newComment.created_at,
    });
  });
});
