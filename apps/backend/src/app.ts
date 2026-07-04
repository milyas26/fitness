import Fastify from 'fastify';
import cors from '@fastify/cors';
import { responseWrapper } from './middleware/response-wrapper.js';
import { errorHandler } from './middleware/error-handler.js';
import { dashboardRoutes } from './modules/dashboard/dashboard.routes.js';
import { nutritionRoutes } from './modules/nutrition/nutrition.routes.js';
import { workoutRoutes } from './modules/workout/workout.routes.js';
import { recoveryRoutes } from './modules/recovery/recovery.routes.js';
import { bodyRoutes } from './modules/body/body.routes.js';
import { reportRoutes } from './modules/reports/reports.routes.js';
import { settingsRoutes } from './modules/settings/settings.routes.js';
import { hermesRoutes } from './modules/hermes/hermes.routes.js';

const app = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: { colorize: true },
    },
  },
});

await app.register(cors, {
  origin: ['http://localhost:5173', 'http://localhost:3000'],
});

app.setErrorHandler(errorHandler);
app.addHook('onSend', responseWrapper);

app.register(dashboardRoutes, { prefix: '/api/dashboard' });
app.register(nutritionRoutes, { prefix: '/api/nutrition' });
app.register(workoutRoutes, { prefix: '/api/workout' });
app.register(recoveryRoutes, { prefix: '/api/recovery' });
app.register(bodyRoutes, { prefix: '/api/body' });
app.register(reportRoutes, { prefix: '/api/reports' });
app.register(settingsRoutes, { prefix: '/api/settings' });
app.register(hermesRoutes, { prefix: '/api/hermes' });

const port = parseInt(process.env.BACKEND_PORT || '3000', 10);

try {
  await app.listen({ port, host: '0.0.0.0' });
  console.log(`Server running on http://localhost:${port}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

export { app };
