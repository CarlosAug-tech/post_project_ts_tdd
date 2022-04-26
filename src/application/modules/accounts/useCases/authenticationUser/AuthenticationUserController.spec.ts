import request from 'supertest';

import createConnection from '@infra/database/typeorm';
import { Connection } from 'typeorm';
import app from '@infra/http/app';

let connection: Connection;

const user = {
  name: 'valid_name',
  email: 'valid_mail@email.com',
  password: 'valid_password',
  confirmPassword: 'valid_password',
};

describe('Authentication User Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app).post('/users').send(user);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should not be able to authenticate User if Email not registred and so return 400 (BadRequest)', async () => {
    const response = await request(app).post('/sessions').send({
      email: 'invalid_mail@email.com',
      password: user.password,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('Email or password invalid');
  });

  it('should not be able to authenticate User if Password is invalid and so return 400 (BadRequest)', async () => {
    const response = await request(app).post('/sessions').send({
      email: user.email,
      password: 'invalid_password',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('Email or password invalid');
  });

  it('should be able to authenticate User and return token', async () => {
    const response = await request(app).post('/sessions').send({
      email: user.email,
      password: user.password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
