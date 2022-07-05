import { RequestHandler } from 'express';
import { PassportStatic } from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtSecret } from '../config/jwt';

export const passportInit = (passport: PassportStatic): RequestHandler => {
  passport.use(
    new Strategy(
      {
        secretOrKey: jwtSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      },
      (payload, done): void => {
        done(null, payload);
      },
    ),
  );

  const authenticate = passport.authenticate('jwt', { session: false });

  return authenticate;
};
