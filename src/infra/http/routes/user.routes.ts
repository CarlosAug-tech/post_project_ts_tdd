import { CreateUserController } from '@application/modules/accounts/useCases/createUser/CreateUserController';
import { Router } from 'express';
import ensureAuthenticate from '../middlewares/ensureAuthenticate';

const userRoutes = Router();
const createUserController = new CreateUserController();

userRoutes.get('/', ensureAuthenticate, (req, res) =>
  res.status(200).json({ ok: 'success' }),
);
userRoutes.post('/', createUserController.handle);

export { userRoutes };
