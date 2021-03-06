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

  // app.get('/sub', (req: Request) => {
  //   console.log(req.db.subscribers); // [ArmySubscriber]
  //   const armySubscriber = req.db.subscribers[0];
  //   armySubscriber.afterInsert(event);
  // });

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

          return res.send('"name" and "squadCount" parameters are required');
        }

        const armyRepo = req.db.getRepository(Army);

        await armyRepo.insert({ ...body, active: true });

        const activeArmies = await armyRepo.find({ active: true });

        const token = jwt.sign({ army: { name, squadCount } }, jwtSecret);
        return res.json({ token, armies: activeArmies });
      }

      return next();
    },
    authenticate,
    async (req: Request<Army>, res) => {
      const activeArmies = await req.db
        .getRepository(Army)
        .find({ active: true });

      return res.json({ armies: activeArmies });
    },
  );

  app.get('/armies', authenticate, async (req: Request, res) => {
    const armies = await req.db.getRepository(Army).find();

    res.json(armies);
  });

  return app;
};
