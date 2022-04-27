import request from 'supertest';
import { v4 } from 'uuid';
import { hash } from 'bcrypt';
import { Connection } from 'typeorm';

import createConnection from '@infra/database/typeorm';
import app from '@infra/http/app';
import { AppError } from '@infra/shared/errors/AppError';

let connection: Connection;

let idUserGeneric: string;
let idCategoryGeneric: string;
let idPostGeneric: string;
let idCommentGeneric: string;

const user = {
  name: 'any_name',
  email: 'any_mail_valid@email.com',
  password: 'valid_password',
  confirmPassword: 'valid_password',
};

describe('List Comments Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    idUserGeneric = v4();
    idCategoryGeneric = v4();
    idPostGeneric = v4();
    idCommentGeneric = v4();

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

    await connection.query(
      `INSERT INTO COMMENTS(id, content, post_id, user_id, created_at)
    values('${idCommentGeneric}', 'any_comment', '${idPostGeneric}', '${idUserGeneric}', 'now()')
    `,
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should not be able to list all comments of Post, if the post not found and return 404 (Not Found)', async () => {
    const idPostNotRegistred = v4();

    const response = await request(app).get(
      `/comments/post/${idPostNotRegistred}`,
    );

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual('This Post not found');
  });

  it('should be able to list all comments of Post selected and return 200', async () => {
    const response = await request(app).get(`/comments/post/${idPostGeneric}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });
});
