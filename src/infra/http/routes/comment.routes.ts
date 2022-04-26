import { CreateCommentController } from '@application/modules/posts/useCases/createComment/CreateCommentController';
import { Router } from 'express';
import ensureAuthenticate from '../middlewares/ensureAuthenticate';

const commentsRoutes = Router();
const createCommentController = new CreateCommentController();

commentsRoutes.post('/', ensureAuthenticate, createCommentController.handle);

export { commentsRoutes };
