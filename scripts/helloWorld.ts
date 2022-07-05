#!/usr/bin/env ts-node

import fetch from 'node-fetch';
import { origin } from './env';

fetch(origin)
  .then((res) => res.json())
  .then(console.log);
