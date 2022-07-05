#!/usr/bin/env ts-node

import fetch from 'node-fetch';
import { jwt, name, squadCount, origin } from './env';

fetch(`${origin}/join`, {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    ...(jwt ? { authorization: `bearer ${jwt}` } : {}),
  },
  body: JSON.stringify({
    name,
    squadCount,
  }),
})
  .then((res) => res.json())
  .then(console.log);
