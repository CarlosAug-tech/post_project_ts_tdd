import { container } from 'tsyringe';

import { UsersRepository } from '@application/modules/accounts/infra/typeorm/repositories/UsersRepository';
import { IUsersRepository } from '@application/modules/accounts/repositories/contracts/IUsersRepository';

import { ICategoriesRepository } from '@application/modules/posts/repositories/contracts/ICategoriesRepository';
import { CategoriesRepository } from '@application/modules/posts/infra/typeorm/repositories/CategoriesRepository';
import { IPostsRepository } from '@application/modules/posts/repositories/contracts/IPostsRepository';
import { PostsRepository } from '@application/modules/posts/infra/typeorm/repositories/PostsRepository';

import './providers';
import { CommentsRepository } from '@application/modules/posts/infra/typeorm/repositories/CommentsRepository';
import { ICommentsRepository } from '@application/modules/posts/repositories/contracts/ICommentsRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);
container.registerSingleton<ICategoriesRepository>(
  'CategoriesRepository',
  CategoriesRepository,
);
container.registerSingleton<IPostsRepository>(
  'PostsRepository',
  PostsRepository,
);
container.registerSingleton<ICommentsRepository>(
  'CommentsRepository',
  CommentsRepository,
);
