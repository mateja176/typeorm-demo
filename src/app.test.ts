import * as express from 'express';
import * as http from 'http';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { createApp } from './app';
import { mongoConfig } from './config/mongo';

const port = process.env.PORT || 3000;

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
        .map(
          tableName => dbConnection.manager.clear(tableName).catch(() => {}), // handles ns not found errors
        ),
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
  test('Open connection', done => {
    app.listen(port);

    const messages = ['Connected', 'Hello'];
    http.get(`http://localhost:${port}/sse`, res => {
      res.on('data', data => {
        const asString = data.toString();
        const [firstMessage] = messages;

        expect(asString).toBe(firstMessage);

        messages.shift();
        if (messages.length === 1) {
          done();
        }
      });
    });
  });
});
