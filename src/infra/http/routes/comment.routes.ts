import { CreateCommentController } from '@application/modules/posts/useCases/createComment/CreateCommentController';
import { ListCommentsController } from '@application/modules/posts/useCases/listComments/ListCommentsController';
import { Router } from 'express';
import ensureAuthenticate from '../middlewares/ensureAuthenticate';

const commentsRoutes = Router();
const createCommentController = new CreateCommentController();
const listCommentsController = new ListCommentsController();

commentsRoutes.get('/post/:id', listCommentsController.handle);
commentsRoutes.post('/', ensureAuthenticate, createCommentController.handle);

export { commentsRoutes };
