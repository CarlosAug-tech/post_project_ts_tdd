import { CreatePostController } from '@application/modules/posts/useCases/createPost/CreatePostController';
import { Router } from 'express';
import ensureAuthenticate from '../middlewares/ensureAuthenticate';

const postsRoutes = Router();
const createPostController = new CreatePostController();

postsRoutes.post('/', ensureAuthenticate, createPostController.handle);

export { postsRoutes };
