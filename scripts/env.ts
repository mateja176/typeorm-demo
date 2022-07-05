export const port = process.env.PORT || 3000;
export const origin = `http://localhost:${port}`;

export const jwt = process.env.JWT;

export const name = process.env.NAME;

const { SQUAD_COUNT } = process.env;
const parsedSquadCount = parseInt(SQUAD_COUNT || '', 10);
export const squadCount = Number.isNaN(parsedSquadCount)
  ? 10
  : parsedSquadCount;
