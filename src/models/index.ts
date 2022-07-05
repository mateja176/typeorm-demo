import { Request as ExpressRequest } from 'express';
import { Connection } from 'typeorm';
import { ArmyDto } from '../entity/Army';

export interface Request<User extends ArmyDto | undefined = undefined>
  extends ExpressRequest {
  db: Connection;
  user: User;
}
