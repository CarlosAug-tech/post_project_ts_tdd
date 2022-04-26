import { Router } from 'express';
import { authenticationRoutes } from './authentication.routes';
import { categoriesRoutes } from './category.routes';
import { postsRoutes } from './post.routes';
import { userRoutes } from './user.routes';

const routes = Router();

routes.use('/users', userRoutes);
routes.use('/categories', categoriesRoutes);
routes.use('/posts', postsRoutes);
routes.use(authenticationRoutes);

export { routes };
