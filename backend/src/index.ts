import http from 'http';
import dotenv from 'dotenv';
import { createApp } from './server/app';
import { connectToDatabase } from './server/mongo';

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

async function start() {
  await connectToDatabase();
  const app = createApp();
  const server = http.createServer(app);

  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', err);
  process.exit(1);
});


