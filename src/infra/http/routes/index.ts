import { Router } from 'express';
import { authenticationRoutes } from './authentication.routes';
import { categoriesRoutes } from './category.routes';
import { commentsRoutes } from './comment.routes';
import { filesRoutes } from './file.routes';
import { postsRoutes } from './post.routes';
import { userRoutes } from './user.routes';

const routes = Router();

routes.use('/users', userRoutes);
routes.use('/categories', categoriesRoutes);
routes.use('/posts', postsRoutes);
routes.use('/comments', commentsRoutes);
routes.use('/files', filesRoutes);
routes.use(authenticationRoutes);

export { routes };
