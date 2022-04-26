import request from 'supertest';

import createConnection from '@infra/database/typeorm';
import { Connection } from 'typeorm';
import { v4 } from 'uuid';
import { sign } from 'jsonwebtoken';
import auth from '@infra/shared/config/auth';
import { hash } from 'bcrypt';
import app from '@infra/http/app';

let connection: Connection;

let idUserGeneric: string;
let idCategoryGeneric: string;
let idPostGeneric: string;
let token: string;

const user = {
  name: 'any_name',
  email: 'any_mail_valid@email.com',
  password: 'valid_password',
  confirmPassword: 'valid_password',
};

describe('Create Comment Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    idUserGeneric = v4();
    idCategoryGeneric = v4();
    idPostGeneric = v4();

    const saltHash = 12;
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

    await connection.query(
      `INSERT INTO POSTS(id, title, description, category_id, user_id, created_at)
    values('${idPostGeneric}', 'valid_title', 'valid_description', '${idCategoryGeneric}', '${idUserGeneric}', 'now()')
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

  it('should not be able to create a new Comment if the field Content is not provided and so return 400 (BadRequest)', async () => {
    const response = await request(app)
      .post('/comments')
      .send({
        content: '',
        post_id: idPostGeneric,
        user_id: idUserGeneric,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('The field content is required!');
  });

  it('should not be able to create a new Comment if the field Post is not provided and so return 400 (BadRequest)', async () => {
    const response = await request(app)
      .post('/comments')
      .send({
        content: 'any_comment',
        post_id: '',
        user_id: idUserGeneric,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('The field post_id is required!');
  });

  it('should not be able to create a new Comment if the field User is not provided and so return 400 (BadRequest)', async () => {
    const newTokenWhioutUserId = sign({}, auth.jwt_token_secret, {
      subject: '',
    });

    const response = await request(app)
      .post('/comments')
      .send({
        content: 'any_comment',
        post_id: idPostGeneric,
        user_id: '',
      })
      .set({
        Authorization: `Bearer ${newTokenWhioutUserId}`,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('The field user_id is required!');
  });

  it('should not be able to create a new Comment if the Post not exists and so return 400 (BadRequest)', async () => {
    const invalidPostId = v4();

    const response = await request(app)
      .post('/comments')
      .send({
        content: 'any_comment',
        post_id: invalidPostId,
        user_id: idUserGeneric,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('This post not exists!');
  });

  it('should be able to create a new Comment and return 201 (CREATED)', async () => {
    const response = await request(app)
      .post('/comments')
      .send({
        content: 'any_comment',
        post_id: idPostGeneric,
        user_id: idUserGeneric,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
});
