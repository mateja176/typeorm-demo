import { Request as ExpressRequest } from 'express';
import { Connection } from 'typeorm';
import { Army, ArmyDto } from '../entity/Army';

export interface Request<User extends Army | ArmyDto | undefined = undefined>
  extends ExpressRequest {
  db: Connection;
  user: User;
}
