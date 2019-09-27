import { Router } from 'express';
import { User } from '../entity/User';
import { Request } from '../models';

const router = Router();

router.get('/', async (req: Request, res) => {
  // const user = req.db.getRepository(User).findOne({ id: req.user.id });

  // res.json(user);
  const users = await req.db.getRepository(User).find();
  res.json(users);
});

export default router;
