#!/usr/bin/env ts-node

import fetch from 'node-fetch';
import { origin, jwt } from './env';

fetch(`${origin}/armies`, {
  headers: {
    authorization: `bearer ${jwt}`,
  },
})
  .then((res) => res.json())
  .then(console.log);
