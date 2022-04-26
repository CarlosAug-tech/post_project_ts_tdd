import { UsersRepository } from '@application/modules/accounts/infra/typeorm/repositories/UsersRepository';
import { NextFunction, Request, Response } from 'express';

export default async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { id } = request.user;
  const usersRepository = new UsersRepository();

  const user = await usersRepository.findById(id);

  if (!user.isAdmin) {
    throw new Error("User isn't Admin");
  }

  return next();
};
