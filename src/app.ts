import path from 'node:path';
import fs from 'node:fs';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '100kb' }));

  // Interactive docs rendered from the same openapi.yaml deliverable
  const specPath = path.resolve(__dirname, '../openapi.yaml');
  if (fs.existsSync(specPath)) {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(YAML.parse(fs.readFileSync(specPath, 'utf8'))));
  }

  app.use(routes);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
