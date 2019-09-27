import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { isNil } from 'lodash';
import * as passport from 'passport';
import { Connection } from 'typeorm';
import { jwtSecret } from './config/jwt';
import { Army } from './entity/Army';
import { User } from './entity/User';
import { Request } from './models';
import { passportInit } from './passport/init';
import profileRoute from './routes/profile';

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

  app.get('/error', (req, res, next) => {
    next('Hello World');
  });

  app.get('/open', (req, res) => {
    res.write('Opened connection');
    req.on('close', () => {
      console.log('closed');
    });
  });

  app.get('/users', async (req: Request, res) => {
    const users = await req.db.getRepository(User).find();

    res.json(users);
  });

  app.post(
    '/join',
    async (req: Request, res, next) => {
      const { headers } = req;
      if (!Object.keys(headers).includes('authorization')) {
        // user has joined
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
      // user has returned
      next('You have already joined');
    },
  );

  app.use('/profile', authenticate, profileRoute);

  return app;
};
