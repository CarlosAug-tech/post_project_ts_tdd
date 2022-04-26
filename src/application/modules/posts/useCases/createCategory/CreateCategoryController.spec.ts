import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 } from 'uuid';
import { hash } from 'bcrypt';

import createConnection from '@infra/database/typeorm';
import app from '@infra/http/app';
import { sign } from 'jsonwebtoken';
import auth from '@infra/shared/config/auth';

let connection: Connection;
let token: string;

describe('Create Category Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const saltHash = 12;
    const id = v4();
    const passwordHash = await hash('admin', saltHash);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, "isAdmin", created_at)
    values('${id}', 'Admin', 'admin@posts.com.br', '${passwordHash}', true, 'now()')
    `,
    );

    token = sign({}, auth.jwt_token_secret, {
      subject: id,
    });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should not be able to create a new Category if the field Name not is provided and so return 400 (BadRequest)', async () => {
    const response = await request(app)
      .post('/categories')
      .send({
        name: '',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('The field name is required!');
  });

  it('should not be able to create a new Category if already exists with Name equal and so return 400 (BadRequest)', async () => {
    await request(app)
      .post('/categories')
      .send({
        name: 'category_exists',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app)
      .post('/categories')
      .send({
        name: 'category_exists',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('This Category already exists');
  });

  it('should be able to create a new Category', async () => {
    const response = await request(app)
      .post('/categories')
      .send({
        name: 'valid_category',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
});
