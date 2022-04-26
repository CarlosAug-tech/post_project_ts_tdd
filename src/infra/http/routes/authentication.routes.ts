import { AuthenticationUserController } from '@application/modules/accounts/useCases/authenticationUser/AuthenticationUserController';
import { Router } from 'express';

const authenticationRoutes = Router();
const authenticationUserController = new AuthenticationUserController();

authenticationRoutes.post('/sessions', authenticationUserController.handle);

export { authenticationRoutes };
