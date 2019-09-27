import { Request as ExpressRequest } from 'express';
import { Connection } from 'typeorm';

export interface Request extends ExpressRequest {
  db: Connection;
}
