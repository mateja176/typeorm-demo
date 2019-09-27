import * as express from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { createApp } from './app';
import { mongoConfig } from './config/mongo';
import { User, UserDto } from './entity/User';

describe('Server', () => {
  const mongod = new MongoMemoryServer();
  let connection: Connection;
  let app: express.Express;

  beforeAll(async () => {
    const uri = await mongod.getConnectionString();
    connection = await createConnection({
      ...mongoConfig,
      url: uri,
    });
    app = createApp(connection);
  });
  afterEach(async () => {
    await Promise.all(
      connection.entityMetadatas
        .map(({ tableName }) => tableName)
        .map(tableName => connection.manager.clear(tableName)),
    );
  });
  afterAll(async () => {
    await mongod.stop();
  });
  test('Hello World', done => {
    request(app)
      .get('/')
      .expect(200)
      .expect('Hello World')
      .end(done);
  });
  it('should return users', async done => {
    const testUser: UserDto = { email: 'test@test.com', password: '123' };
    const user = User.create(testUser);
    const userRepo = connection.getRepository(User);
    await userRepo.save(user);

    request(app)
      .get('/users')
      .expect(200)
      .expect(res =>
        res.body.forEach((u: User) => {
          delete u.id;
        }),
      )
      .expect([testUser])
      .end(done);
  });
});
