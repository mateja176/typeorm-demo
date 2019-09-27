import * as express from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { createApp } from './app';
import { mongoConfig } from './config/mongo';

describe('Server', () => {
  const mongod = new MongoMemoryServer();
  let dbConnection: Connection;
  let app: express.Express;

  beforeAll(async () => {
    const uri = await mongod.getConnectionString();
    dbConnection = await createConnection({
      ...mongoConfig,
      url: uri,
    });
    app = createApp(dbConnection);
  });
  afterEach(async () => {
    await Promise.all(
      dbConnection.entityMetadatas
        .map(({ tableName }) => tableName)
        .map(tableName => dbConnection.manager.clear(tableName)),
    );
  });
  afterAll(async () => {
    await dbConnection.close();
    await mongod.stop();
  });
  test('Hello World', done => {
    request(app)
      .get('/')
      .expect(200)
      .expect('Hello World')
      .end(done);
  });
});
