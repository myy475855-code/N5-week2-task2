import { env } from './config/env';
import { createApp } from './app';
import { seed } from './data/seed';

async function main() {
  if (env.SEED_DATA) await seed();
  const server = createApp().listen(env.PORT, () => {
    console.log(`TalentBridge API (${env.NODE_ENV}) listening on http://localhost:${env.PORT}  |  docs: /docs`);
  });

  const shutdown = () => server.close(() => process.exit(0));
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
