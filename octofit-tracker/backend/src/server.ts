import express from 'express';
import type { Model } from 'mongoose';
import './config/database.js';
import { Activity, LeaderboardEntry, Team, User, Workout } from './models.js';

const app = express();
const port = Number(process.env.PORT ?? 8000);
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : `http://localhost:${port}`;

app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'octofit-tracker-api' });
});

app.get('/api', (_request, response) => {
  response.json({
    baseUrl: apiBaseUrl,
    endpoints: [
      '/api/users/',
      '/api/teams/',
      '/api/activities/',
      '/api/leaderboard/',
      '/api/workouts/',
    ],
  });
});

function registerCollectionRoutes<T>(path: string, model: Model<T>): void {
  app.get(path, async (_request, response, next) => {
    try {
      response.json(await model.find().lean());
    } catch (error) {
      next(error);
    }
  });

  app.post(path, async (request, response, next) => {
    try {
      const record = await model.create(request.body as T);
      response.status(201).json(record);
    } catch (error) {
      next(error);
    }
  });
}

registerCollectionRoutes('/api/users', User);
registerCollectionRoutes('/api/teams', Team);
registerCollectionRoutes('/api/activities', Activity);
registerCollectionRoutes('/api/workouts', Workout);

app.get('/api/leaderboard', async (_request, response, next) => {
  try {
    response.json(await LeaderboardEntry.find().sort({ points: -1 }).lean());
  } catch (error) {
    next(error);
  }
});

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  console.error('API request failed:', error);
  response.status(500).json({ error: 'Internal server error' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`OctoFit Tracker API listening at ${apiBaseUrl}`);
});