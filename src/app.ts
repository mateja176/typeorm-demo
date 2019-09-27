import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { isNil } from 'lodash';
import * as passport from 'passport';
import { Connection } from 'typeorm';
import { jwtSecret } from './config/jwt';
import { Army } from './entity/Army';
import { Request } from './models';
import { passportInit } from './passport/init';

const authenticate = passportInit(passport);

export const createApp = (connection: Connection): express.Express => {
  const app = express();

  app.use((req: Request, res, next) => {
    req.db = connection;
    next();
  });

  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('Hello World');
  });

  app.get('/sse', (req, res) => {
    res.write('Connected');
    res.write('Hello');
    req.on('close', () => {
      console.log('closed');
    });
  });

  app.post(
    '/join',
    async (req: Request, res, next) => {
      const { headers } = req;
      if (!Object.keys(headers).includes('authorization')) {
        const { body } = req;

        const { name, squadCount } = body;

        // TODO validate args
        if (isNil(name) || isNil(squadCount)) {
          res.status(400);

          return next('"name" and "squadCount" parameters are required');
        }

        const army = Army.create(body);

        await req.db.getRepository(Army).save(army);

        const token = jwt.sign({ army: { name, squadCount } }, jwtSecret);
        return res.json({ token });
      }

      return next();
    },
    authenticate,
    (req, res, next) => {
      next('You have already joined');
    },
  );

  return app;
};
