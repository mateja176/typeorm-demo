import chalk from 'chalk';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { createApp } from './app';
import { mongoConfig } from './config/mongo';

const port = process.env.PORT || 3000;

createConnection(mongoConfig)
  .then(connection => {
    createApp(connection).listen(port, () => {
      console.log(`http://localhost:${port}`);
    });
  })
  .catch(error => console.log(chalk.magenta(error)));
