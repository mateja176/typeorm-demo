import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { isNil } from 'lodash';
import * as passport from 'passport';
import { Connection } from 'typeorm';
import { jwtSecret } from './config/jwt';
import { Army, ArmyDto } from './entity/Army';
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

  // TODO
  // app.get('/sub', (req: Request) => {
  //   const armySubscriber = req.db.subscribers[0];
  //   armySubscriber.afterInsert(event);
  // });

  app.get('/', (req, res) => {
    res.json('Hello World');
  });

  app.get('/sse', (req, res) => {
    // TODO
    res.write('Connected');
    res.write('Hello');
    req.on('close', () => {
      console.log('closed');
    });
  });

  app.post(
    '/join',
    async (req: Request<ArmyDto | undefined>, res, next) => {
      const { headers } = req;
      if (!Object.keys(headers).includes('authorization')) {
        const { body } = req;

        if (!body.name || isNil(body.squadCount)) {
          return res.status(400).json({
            message: '"name" and "squadCount" parameters are required',
          });
        }
        const squadCount = parseInt(body.squadCount, 10);
        if (Number.isNaN(squadCount)) {
          return res.status(400).json({
            message: '"squadCount" must be an integer',
          });
        }

        const armyRepo = req.db.getRepository(Army);

        await armyRepo.insert({ name: body.name, squadCount, active: true });

        const activeArmies = await armyRepo.find({ active: true });

        const token = jwt.sign({ name: body.name, squadCount }, jwtSecret);
        return res.json({ token, armies: activeArmies });
      }

      return next();
    },
    authenticate,
    async (req: Request<ArmyDto>, res) => {
      const activeArmies = await req.db
        .getRepository(Army)
        .find({ active: true });

      return res.json({ armies: activeArmies });
    },
  );

  app.get('/armies', authenticate, async (req: Request<ArmyDto>, res) => {
    const armies = await req.db.getRepository(Army).find();

    res.json(armies);
  });

  return app;
};
