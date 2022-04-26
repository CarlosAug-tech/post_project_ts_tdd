import { hash } from 'bcrypt';
import { v4 } from 'uuid';
import createConnection from '../index';

async function create() {
  const connection = await createConnection();

  const saltHash = 12;
  const id = v4();
  const passwordHash = await hash('admin', saltHash);

  await connection.query(
    `INSERT INTO USERS(id, name, email, password, "isAdmin", created_at)
    values('${id}', 'Admin', 'admin@posts.com.br', '${passwordHash}', true, 'now()')
    `,
  );

  await connection.close();
}

create().then(() => console.log('User admin created!'));
