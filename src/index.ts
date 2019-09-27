import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { createApp } from './app';
import mongoConfig from './config/mongo';

createConnection(mongoConfig)
  .then(async connection => {
    const app = createApp(connection);

    const port = process.env.PORT || 3000;

    app.listen(port, () => {
      console.log(`http://localhost:${port}`);
    });
  })
  .catch(error => console.log(error));
