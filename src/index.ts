import { Hono, type Context } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/bun';
import { pipe } from 'fp-ts/function';
import { TK700Client } from './lib/tk700-client';
import * as AT from './lib/apiTask';
import { logger } from './lib/logger';

const app = new Hono();

app.use('/*', cors());

if (!process.env.TK700_HOST || !process.env.TK700_PORT) {
  throw new Error('TK700_HOST and TK700_PORT environment variables are required');
}

const tk700Client = new TK700Client(
  process.env.TK700_HOST,
  parseInt(process.env.TK700_PORT),
  parseInt(process.env.TK700_TIMEOUT || '5000')
);

const handleTask = async <T>(task: AT.ApiTask<T>, c: Context) =>
  pipe(await task(), AT.toApiResponse, response => c.json(response, response.error ? 500 : 200));

app.get('/api/power', async c => handleTask(tk700Client.getPowerStatus(), c));

app.post('/api/power', async c => {
  const { on } = await c.req.json();
  return handleTask(tk700Client.setPower(on), c);
});

app.get('/api/temperature', async c => handleTask(tk700Client.getTemperature(), c));

app.get('/api/fan', async c => handleTask(tk700Client.getFanSpeed(), c));

app.get('/api/volume', async c => handleTask(tk700Client.getVolume(), c));

app.post('/api/volume', async c => {
  const { level } = await c.req.json();
  return handleTask(tk700Client.setVolume(level), c);
});

app.get('/api/picture-mode', async c => handleTask(tk700Client.getPictureMode(), c));

app.post('/api/picture-mode', async c => {
  const { mode } = await c.req.json();
  return handleTask(tk700Client.setPictureMode(mode), c);
});

app.get('/api/brightness', async c => handleTask(tk700Client.getBrightness(), c));

app.post('/api/brightness', async c => {
  const body = await c.req.json();

  if (body.direction) {
    return handleTask(tk700Client.adjustBrightness(body.direction), c);
  } else if (body.value !== undefined) {
    return handleTask(tk700Client.setBrightness(body.value), c);
  }

  return c.json({ error: 'Invalid request', data: null }, 400);
});

app.get('/api/contrast', async c => handleTask(tk700Client.getContrast(), c));

app.post('/api/contrast', async c => {
  const { value } = await c.req.json();
  return handleTask(tk700Client.setContrast(value), c);
});

app.get('/api/sharpness', async c => handleTask(tk700Client.getSharpness(), c));

app.post('/api/sharpness', async c => {
  const { value } = await c.req.json();
  return handleTask(tk700Client.setSharpness(value), c);
});

app.use('/*', serveStatic({ root: './dist' }));
app.use('/*', serveStatic({ path: './dist/index.html' }));

if (!process.env.PORT) {
  throw new Error('PORT environment variable is required');
}

const port = parseInt(process.env.PORT);
logger.info({ port, host: process.env.TK700_HOST }, 'TK700 Control Server starting');

export default {
  port,
  fetch: app.fetch,
};
