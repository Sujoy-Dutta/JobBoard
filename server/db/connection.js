import knex from 'knex';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const connection = knex({
  client: 'better-sqlite3',
  connection: {
    filename: join(__dirname, '..', 'data', 'db.sqlite3'),
  },
  useNullAsDefault: true,
});
