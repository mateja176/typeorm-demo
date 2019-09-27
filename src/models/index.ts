import { Request as ExpressRequest } from 'express';
import { Connection } from 'typeorm';
import { User } from '../entity/User';

export interface Request extends ExpressRequest {
  db: Connection;
  user: User;
}
