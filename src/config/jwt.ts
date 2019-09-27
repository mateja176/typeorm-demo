import { v4 } from 'uuid';

export const jwtSecret = process.env.JWT_SECRET || v4();
