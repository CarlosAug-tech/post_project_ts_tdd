import request from 'supertest';
import { v4 } from 'uuid';
import { hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';

import { Connection } from 'typeorm';

import createConnection from '@infra/database/typeorm';
import app from '@infra/http/app';
import auth from '@infra/shared/config/auth';
import { resolve } from 'path';

let connection: Connection;

let idUserGeneric: string;
let token: string;

const user = {
  name: 'any_name',
  email: 'any_mail_valid@email.com',
  password: 'valid_password',
  confirmPassword: 'valid_password',
};

describe('Upload File Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    idUserGeneric = v4();

    const saltHash = 12;
    const passwordUserGenericHash = await hash(user.password, saltHash);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, "isAdmin", created_at)
    values('${idUserGeneric}', '${user.name}', '${user.email}', '${passwordUserGenericHash}', false, 'now()')
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

  it('should be able to upload a new File and return 201 (Created)', async () => {
    const path = resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      'tmp',
      '__test__',
    );
    const response = await request(app)
      .post('/files/upload')
      .attach('file', `${path}/image_test.png`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
});
