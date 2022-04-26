import request from 'supertest';
import { Connection } from 'typeorm';
import { hash } from 'bcrypt';
import { v4 } from 'uuid';
import { sign } from 'jsonwebtoken';

import createConnection from '@infra/database/typeorm';
import app from '@infra/http/app';
import auth from '@infra/shared/config/auth';

let connection: Connection;
let token: string;
let idUserGeneric: string;
let idCategoryGeneric: string;

const user = {
  name: 'valid_name',
  email: 'valid_mail@email.com',
  password: 'valid_password',
  confirmPassword: 'valid_password',
};

describe('Create Post Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const saltHash = 12;

    idUserGeneric = v4();
    idCategoryGeneric = v4();
    const passwordUserGenericHash = await hash(user.password, saltHash);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, "isAdmin", created_at)
    values('${idUserGeneric}', '${user.name}', '${user.email}', '${passwordUserGenericHash}', false, 'now()')
    `,
    );

    await connection.query(
      `INSERT INTO CATEGORIES(id, name, created_at)
    values('${idCategoryGeneric}', 'valid_category', 'now()')
    `,
    );

    token = sign({}, auth.jwt_token_secret, {
      subject: idUserGeneric,
    });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should not be able to create a new Post if the field Title is not provided and so return 400 (BadRequest)', async () => {
    const response = await request(app)
      .post('/posts')
      .send({
        title: '',
        description: 'valid_description',
        category_id: idCategoryGeneric,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('The field title is required');
  });

  it('should not be able to create a new Post if the field Description is not provided and so return 400 (BadRequest)', async () => {
    const response = await request(app)
      .post('/posts')
      .send({
        title: 'valid_title',
        description: '',
        user_id: idUserGeneric,
        category_id: idCategoryGeneric,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('The field description is required');
  });

  it('should not be able to create a new Post if the field User is not provided and so return 400 (BadRequest)', async () => {
    const newTokenWhioutUserId = sign({}, auth.jwt_token_secret, {
      subject: '',
    });

    const response = await request(app)
      .post('/posts')
      .send({
        title: 'valid_title',
        description: 'valid_description',
        user_id: '',
        category_id: idCategoryGeneric,
      })
      .set({
        Authorization: `Bearer ${newTokenWhioutUserId}`,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('The field user_id is required');
  });

  it('should not be able to create a new Post if the field Category is not provided and so return 400 (BadRequest)', async () => {
    const response = await request(app)
      .post('/posts')
      .send({
        title: 'valid_title',
        description: 'valid_description',
        category_id: '',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('The field category_id is required');
  });

  it('should not be able to create a new Post if the Category not registred and so return 400 (BadRequest)', async () => {
    const response = await request(app)
      .post('/posts')
      .send({
        title: 'valid_title',
        description: 'valid_description',
        category_id: v4(),
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('This category not exists');
  });

  it('should be able to create a new Post', async () => {
    const response = await request(app)
      .post('/posts')
      .send({
        title: 'valid_title',
        description: 'valid_description',
        category_id: idCategoryGeneric,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
});
