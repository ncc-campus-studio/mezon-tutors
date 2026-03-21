import path from 'node:path';
import { loadEnvFile } from 'node:process';
import { defineConfig } from 'prisma/config';

loadEnvFile(path.resolve(__dirname, '.env'));

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
});
