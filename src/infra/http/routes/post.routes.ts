import { CreatePostController } from '@application/modules/posts/useCases/createPost/CreatePostController';
import { ListPostsController } from '@application/modules/posts/useCases/listPosts/ListPostsController';
import { Router } from 'express';
import ensureAuthenticate from '../middlewares/ensureAuthenticate';

const postsRoutes = Router();
const createPostController = new CreatePostController();
const listPostController = new ListPostsController();

postsRoutes.get('/', listPostController.handle);
postsRoutes.post('/', ensureAuthenticate, createPostController.handle);

export { postsRoutes };
