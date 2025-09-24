import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { offeringRouter } from '../web/offering.routes.js';
import { healthRouter } from '../web/health.routes.js';

export function createApp() {
  const app = express();
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(morgan('dev'));

  app.use('/api/health', healthRouter);
  app.use('/api/offerings', offeringRouter);

  app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
  });

  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  return app;
}


