import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';

export default {
  type: 'mongodb',
  host: 'localhost',
  database: 'jwt',
  useNewUrlParser: true,
  useUnifiedTopology: true,
  synchronize: true,
  logging: false,
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
} as MongoConnectionOptions;
