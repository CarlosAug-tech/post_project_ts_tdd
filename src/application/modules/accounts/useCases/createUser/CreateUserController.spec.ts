import request from 'supertest';

import createConnection from '@infra/database/typeorm';
import { Connection } from 'typeorm';
import app from '@infra/http/app';

let connection: Connection;

describe('Create User Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should not be able to create a new User if the field Name not is provided and return 400 (BadRequest)', async () => {
    const response = await request(app).post('/users').send({
      name: '',
      email: 'valid_mail@email.com',
      password: 'valid_password',
      confirmPassword: 'valid_password',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('The field name is required!');
  });

  it('should not be able to create a new User if the field Email not is provided and return 400 (BadRequest)', async () => {
    const response = await request(app).post('/users').send({
      name: 'valid_name',
      email: '',
      password: 'valid_password',
      confirmPassword: 'valid_password',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('The field email is required!');
  });

  it('should not be able to create a new User if the field Password not is provided and return 400 (BadRequest)', async () => {
    const response = await request(app).post('/users').send({
      name: 'valid_name',
      email: 'valid_mail@email.com',
      password: '',
      confirmPassword: 'valid_password',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('The field password is required!');
  });

  it('should not be able to create a new User if the field ConfirmPassword not is provided and return 400 (BadRequest)', async () => {
    const response = await request(app).post('/users').send({
      name: 'valid_name',
      email: 'valid_mail@email.com',
      password: 'valid_password',
      confirmPassword: '',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual(
      'The field confirmPassword is required!',
    );
  });

  it('should not be able to create a new User if an Email already registred and so return 400 (BadRequest)', async () => {
    await request(app).post('/users').send({
      name: 'valid_name',
      email: 'valid_mail_exists@email.com',
      password: 'valid_password',
      confirmPassword: 'valid_password',
    });

    const response = await request(app).post('/users').send({
      name: 'valid_name',
      email: 'valid_mail_exists@email.com',
      password: 'valid_password',
      confirmPassword: 'valid_password',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('Email or password invalid!');
  });

  it('should not be able to create a new User if Password does not match with ConfirmPassword and so return 400 (BadRequest)', async () => {
    const response = await request(app).post('/users').send({
      name: 'valid_name',
      email: 'valid_mail@email.com',
      password: 'valid_password',
      confirmPassword: 'invalid_password',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('Password does not match');
  });

  it('should be able to create a new User', async () => {
    const response = await request(app).post('/users').send({
      name: 'valid_name',
      email: 'valid_mail@email.com',
      password: 'valid_password',
      confirmPassword: 'valid_password',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
});
