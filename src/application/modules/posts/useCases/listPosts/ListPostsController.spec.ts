import request from 'supertest';

import createConnection from '@infra/database/typeorm';
import { Connection } from 'typeorm';
import app from '@infra/http/app';
import { v4 } from 'uuid';
import { hash } from 'bcrypt';

let connection: Connection;

let idUserGeneric: string;
let idCategoryGeneric: string;
let idPostGeneric: string;

const user = {
  name: 'any_name',
  email: 'any_mail_valid@email.com',
  password: 'valid_password',
  confirmPassword: 'valid_password',
};

describe('List Posts Controller', () => {
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
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to return all Posts and so return 200(Success)', async () => {
    const response = await request(app).get('/posts');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });
});
