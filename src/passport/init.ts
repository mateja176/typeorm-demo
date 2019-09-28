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
      ({ army }, done): void => {
        if (!army) {
          return done('Invalid payload, army not found');
        }
        return done(null, army);
      },
    ),
  );

  const authenticate = passport.authenticate('jwt', { session: false });

  return authenticate;
};
