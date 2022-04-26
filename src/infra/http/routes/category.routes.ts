import { Router } from 'express';

import { CreateCategoryController } from '@application/modules/posts/useCases/createCategory/CreateCategoryController';

import ensureAuthenticate from '../middlewares/ensureAuthenticate';
import ensureAdmin from '../middlewares/ensureAdmin';

const categoriesRoutes = Router();
const createCategoryController = new CreateCategoryController();

categoriesRoutes.post(
  '/',
  ensureAuthenticate,
  ensureAdmin,
  createCategoryController.handle,
);

export { categoriesRoutes };
