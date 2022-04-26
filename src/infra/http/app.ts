import express, { NextFunction, Request, Response } from 'express';
import 'reflect-metadata';
import 'express-async-errors';

import { AppError } from '@infra/shared/errors/AppError';
import { routes } from './routes';
import createConnection from '../database/typeorm';

import '../container';

createConnection();
const app = express();

app.use(express.json());
app.use(routes);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: `${err.message}`,
    });
  }
  return res.status(500).json({
    status: 'error',
    message: `Internal server error: ${err.message}`,
  });
});

export default app;
