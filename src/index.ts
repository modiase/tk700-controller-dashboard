import { Hono, type Context } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/bun';
import { streamSSE } from 'hono/streaming';
import { pipe } from 'fp-ts/function';
import { TK700Client } from './lib/tk700-client';
import * as RT from './lib/resultTask';
import { logger } from './lib/logger';
import { StateRegistry, type State } from './lib/state-registry';
import { PowerController, type PowerStateData } from './lib/controllers/power-controller';
import { VolumeController } from './lib/controllers/volume-controller';
import { KeystoneController, type KeystoneValue } from './lib/controllers/keystone-controller';
import { BlankController } from './lib/controllers/blank-controller';
import { FreezeController } from './lib/controllers/freeze-controller';
import { TemperatureController } from './lib/controllers/temperature-controller';
import { FanController } from './lib/controllers/fan-controller';
import { PictureSettingsController, type PictureSettingsValue } from './lib/controllers/picture-settings-controller';
import { PictureModeController } from './lib/controllers/picture-mode-controller';
import { HdmiSourceController } from './lib/controllers/hdmi-source-controller';
import { MenuController } from './lib/controllers/menu-controller';

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

const stateRegistry = new StateRegistry();

const powerController = new PowerController(tk700Client, stateRegistry);
const volumeController = new VolumeController(tk700Client, stateRegistry);
const keystoneController = new KeystoneController(tk700Client, stateRegistry);
const blankController = new BlankController(tk700Client, stateRegistry);
const freezeController = new FreezeController(tk700Client, stateRegistry);
const temperatureController = new TemperatureController(tk700Client, stateRegistry);
const fanController = new FanController(tk700Client, stateRegistry);
const pictureSettingsController = new PictureSettingsController(tk700Client, stateRegistry);
const pictureModeController = new PictureModeController(tk700Client, stateRegistry);
const hdmiSourceController = new HdmiSourceController(tk700Client, stateRegistry);
const menuController = new MenuController(tk700Client, stateRegistry);

interface SSEData {
  powerState: PowerStateData;
  temperature: State<number | null>;
  fanSpeed: State<number | null>;
  volume: State<number | null>;
  pictureMode: State<string | null>;
  pictureSettings: State<PictureSettingsValue | null>;
  hdmiSource: State<string | null>;
  blank: State<boolean | null>;
  freeze: State<boolean | null>;
  keystone: State<KeystoneValue | null>;
  menu: State<string | null>;
}

class SSEBroadcaster {
  private clients = new Set<any>();
  private pollInterval: Timer | null = null;
  private readonly POLL_INTERVAL_MS = 2000;

  addClient(stream: any) {
    this.clients.add(stream);
    logger.info({ clientCount: this.clients.size }, 'SSE client connected');
    if (!this.pollInterval) {
      this.startPolling();
    }
  }

  removeClient(stream: any) {
    this.clients.delete(stream);
    logger.info({ clientCount: this.clients.size }, 'SSE client disconnected');
    if (this.clients.size === 0) {
      this.stopPolling();
    }
  }

  private startPolling() {
    logger.info('Starting server-side polling for SSE');
    this.pollInterval = setInterval(async () => {
      const data = await this.fetchAllData();
      this.broadcast(data);
    }, this.POLL_INTERVAL_MS);
  }

  private stopPolling() {
    if (this.pollInterval) {
      logger.info('Stopping server-side polling (no SSE clients)');
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  async fetchAllData(): Promise<SSEData> {
    await powerController.fetchState();
    const powerState = stateRegistry.getState<PowerStateData>('powerState').value;

    if (!(powerState.powerOn === true && powerState.state === 'ON')) {
      return {
        powerState,
        temperature: { value: null, mutable: false },
        fanSpeed: { value: null, mutable: false },
        volume: { value: null, mutable: false },
        pictureMode: { value: null, mutable: false },
        pictureSettings: {
          value: {
            brightness: null,
            contrast: null,
            sharpness: null,
          },
          mutable: false,
        },
        hdmiSource: { value: null, mutable: false },
        blank: { value: null, mutable: false },
        freeze: { value: null, mutable: false },
        keystone: {
          value: {
            horizontal: null,
            vertical: null,
          },
          mutable: false,
        },
        menu: { value: null, mutable: false },
      };
    }

    await Promise.all([
      temperatureController.fetchState(),
      fanController.fetchState(),
      volumeController.fetchState(),
      pictureModeController.fetchState(),
      pictureSettingsController.fetchState(),
      hdmiSourceController.fetchState(),
      blankController.fetchState(),
      freezeController.fetchState(),
      keystoneController.fetchState(),
      menuController.fetchState(),
    ]);

    return {
      powerState,
      temperature: stateRegistry.getState('temperature'),
      fanSpeed: stateRegistry.getState('fanSpeed'),
      volume: stateRegistry.getState('volume'),
      pictureMode: stateRegistry.getState('pictureMode'),
      pictureSettings: stateRegistry.getState('pictureSettings'),
      hdmiSource: stateRegistry.getState('hdmiSource'),
      blank: stateRegistry.getState('blank'),
      freeze: stateRegistry.getState('freeze'),
      keystone: stateRegistry.getState('keystone'),
      menu: stateRegistry.getState('menu'),
    };
  }

  private broadcast(data: SSEData) {
    this.clients.forEach(async stream => {
      try {
        await stream.writeSSE({ data: JSON.stringify(data) });
      } catch (error) {
        logger.error({ error }, 'Failed to send SSE message to client');
        this.clients.delete(stream);
      }
    });
  }

  broadcastCurrentState() {
    const data: SSEData = {
      powerState: stateRegistry.getState<PowerStateData>('powerState').value,
      temperature: stateRegistry.getState('temperature'),
      fanSpeed: stateRegistry.getState('fanSpeed'),
      volume: stateRegistry.getState('volume'),
      pictureMode: stateRegistry.getState('pictureMode'),
      pictureSettings: stateRegistry.getState('pictureSettings'),
      hdmiSource: stateRegistry.getState('hdmiSource'),
      blank: stateRegistry.getState('blank'),
      freeze: stateRegistry.getState('freeze'),
      keystone: stateRegistry.getState('keystone'),
      menu: stateRegistry.getState('menu'),
    };
    this.broadcast(data);
  }

  async broadcastImmediate() {
    const data = await this.fetchAllData();
    this.broadcast(data);
  }
}

const sseBroadcaster = new SSEBroadcaster();

const handleTask = async <T>(task: RT.ResultTask<T>, c: Context) =>
  pipe(await task(), RT.toApiResponse, response => c.json(response, response.error ? 500 : 200));

app.get('/api/stream', c =>
  streamSSE(c, async stream => {
    sseBroadcaster.addClient(stream);

    const initialData = await sseBroadcaster.fetchAllData();
    await stream.writeSSE({
      data: JSON.stringify(initialData),
    });

    const keepAlive = setInterval(async () => {
      try {
        await stream.writeSSE({ data: ':keep-alive' });
      } catch {
        clearInterval(keepAlive);
      }
    }, 30000);

    stream.onAbort(() => {
      clearInterval(keepAlive);
      sseBroadcaster.removeClient(stream);
    });
  })
);

app.get('/api/power-state', async c => {
  await powerController.fetchState();
  const powerState = stateRegistry.getState<PowerStateData>('powerState').value;
  return c.json({ error: null, data: powerState });
});

app.get('/api/power', async c => handleTask(tk700Client.getPowerStatus(), c));

app.post('/api/power', async c => {
  const { on } = await c.req.json();

  const state = stateRegistry.getState('powerState');
  if (!state.mutable) {
    return c.json({ error: 'Request already in progress', data: null }, 429);
  }

  try {
    await powerController.setPower(on);
    sseBroadcaster.broadcastCurrentState();
    await sseBroadcaster.broadcastImmediate();
    return c.json({ error: null, data: null });
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : String(error), data: null }, 500);
  }
});

app.get('/api/temperature', async c => handleTask(tk700Client.getTemperature(), c));

app.get('/api/fan', async c => handleTask(tk700Client.getFanSpeed(), c));

app.get('/api/volume', async c => handleTask(tk700Client.getVolume(), c));

app.post('/api/volume', async c => {
  const { level } = await c.req.json();

  const state = stateRegistry.getState('volume');
  if (!state.mutable) {
    return c.json({ error: 'Request already in progress', data: null }, 429);
  }

  try {
    await volumeController.setVolume(level);
    sseBroadcaster.broadcastCurrentState();
    await sseBroadcaster.broadcastImmediate();
    return c.json({ error: null, data: null });
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : String(error), data: null }, 500);
  }
});

app.get('/api/picture-mode', async c => handleTask(tk700Client.getPictureMode(), c));

app.post('/api/picture-mode', async c => {
  const { mode } = await c.req.json();

  const state = stateRegistry.getState('pictureMode');
  if (!state.mutable) {
    return c.json({ error: 'Request already in progress', data: null }, 429);
  }

  try {
    await pictureModeController.setPictureMode(mode);
    sseBroadcaster.broadcastCurrentState();
    await sseBroadcaster.broadcastImmediate();
    return c.json({ error: null, data: null });
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : String(error), data: null }, 500);
  }
});

app.get('/api/brightness', async c => handleTask(tk700Client.getBrightness(), c));

app.post('/api/brightness', async c => {
  const body = await c.req.json();

  const state = stateRegistry.getState('pictureSettings');
  if (!state.mutable) {
    return c.json({ error: 'Request already in progress', data: null }, 429);
  }

  try {
    if (body.direction) {
      await pictureSettingsController.adjustBrightness(body.direction);
    } else if (body.value !== undefined) {
      await pictureSettingsController.setBrightness(body.value);
    } else {
      return c.json({ error: 'Invalid request', data: null }, 400);
    }
    sseBroadcaster.broadcastCurrentState();
    await sseBroadcaster.broadcastImmediate();
    return c.json({ error: null, data: null });
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : String(error), data: null }, 500);
  }
});

app.get('/api/contrast', async c => handleTask(tk700Client.getContrast(), c));

app.post('/api/contrast', async c => {
  const { value } = await c.req.json();

  const state = stateRegistry.getState('pictureSettings');
  if (!state.mutable) {
    return c.json({ error: 'Request already in progress', data: null }, 429);
  }

  try {
    await pictureSettingsController.setContrast(value);
    sseBroadcaster.broadcastCurrentState();
    await sseBroadcaster.broadcastImmediate();
    return c.json({ error: null, data: null });
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : String(error), data: null }, 500);
  }
});

app.get('/api/sharpness', async c => handleTask(tk700Client.getSharpness(), c));

app.post('/api/sharpness', async c => {
  const { value } = await c.req.json();

  const state = stateRegistry.getState('pictureSettings');
  if (!state.mutable) {
    return c.json({ error: 'Request already in progress', data: null }, 429);
  }

  try {
    await pictureSettingsController.setSharpness(value);
    sseBroadcaster.broadcastCurrentState();
    await sseBroadcaster.broadcastImmediate();
    return c.json({ error: null, data: null });
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : String(error), data: null }, 500);
  }
});

app.get('/api/hdmi-source', async c => handleTask(tk700Client.getHdmiSource(), c));

app.post('/api/hdmi-source', async c => {
  const { source } = await c.req.json();

  const state = stateRegistry.getState('hdmiSource');
  if (!state.mutable) {
    return c.json({ error: 'Request already in progress', data: null }, 429);
  }

  try {
    await hdmiSourceController.setHdmiSource(source);
    sseBroadcaster.broadcastCurrentState();
    await sseBroadcaster.broadcastImmediate();
    return c.json({ error: null, data: null });
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : String(error), data: null }, 500);
  }
});

app.get('/api/blank', async c => handleTask(tk700Client.getBlankStatus(), c));

app.post('/api/blank', async c => {
  const { on } = await c.req.json();

  const state = stateRegistry.getState('blank');
  if (!state.mutable) {
    return c.json({ error: 'Request already in progress', data: null }, 429);
  }

  try {
    await blankController.setBlank(on);
    sseBroadcaster.broadcastCurrentState();
    await sseBroadcaster.broadcastImmediate();
    return c.json({ error: null, data: null });
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : String(error), data: null }, 500);
  }
});

app.get('/api/freeze', async c => handleTask(tk700Client.getFreezeStatus(), c));

app.post('/api/freeze', async c => {
  const { on } = await c.req.json();

  const state = stateRegistry.getState('freeze');
  if (!state.mutable) {
    return c.json({ error: 'Request already in progress', data: null }, 429);
  }

  try {
    await freezeController.setFreeze(on);
    sseBroadcaster.broadcastCurrentState();
    await sseBroadcaster.broadcastImmediate();
    return c.json({ error: null, data: null });
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : String(error), data: null }, 500);
  }
});

app.post('/api/keystone/vertical', async c => {
  const { direction } = await c.req.json();

  const state = stateRegistry.getState('keystone');
  if (!state.mutable) {
    return c.json({ error: 'Request already in progress', data: null }, 429);
  }

  try {
    await keystoneController.adjustVertical(direction);
    sseBroadcaster.broadcastCurrentState();
    await sseBroadcaster.broadcastImmediate();
    return c.json({ error: null, data: null });
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : String(error), data: null }, 500);
  }
});

app.post('/api/keystone/horizontal', async c => {
  const { direction } = await c.req.json();

  const state = stateRegistry.getState('keystone');
  if (!state.mutable) {
    return c.json({ error: 'Request already in progress', data: null }, 429);
  }

  try {
    await keystoneController.adjustHorizontal(direction);
    sseBroadcaster.broadcastCurrentState();
    await sseBroadcaster.broadcastImmediate();
    return c.json({ error: null, data: null });
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : String(error), data: null }, 500);
  }
});

app.get('/api/menu', async c => handleTask(tk700Client.getMenuStatus(), c));

app.post('/api/menu', async c => {
  const { on } = await c.req.json();

  const state = stateRegistry.getState('menu');
  if (!state.mutable) {
    return c.json({ error: 'Request already in progress', data: null }, 429);
  }

  try {
    await menuController.setMenu(on);
    sseBroadcaster.broadcastCurrentState();
    await sseBroadcaster.broadcastImmediate();
    return c.json({ error: null, data: null });
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : String(error), data: null }, 500);
  }
});

app.post('/api/menu/up', async c => {
  try {
    await menuController.navigateUp();
    return c.json({ error: null, data: null });
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : String(error), data: null }, 500);
  }
});

app.post('/api/menu/down', async c => {
  try {
    await menuController.navigateDown();
    return c.json({ error: null, data: null });
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : String(error), data: null }, 500);
  }
});

app.post('/api/menu/right', async c => {
  try {
    await menuController.navigateRight();
    return c.json({ error: null, data: null });
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : String(error), data: null }, 500);
  }
});

app.post('/api/menu/left', async c => {
  try {
    await menuController.navigateLeft();
    return c.json({ error: null, data: null });
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : String(error), data: null }, 500);
  }
});

app.post('/api/menu/enter', async c => {
  try {
    await menuController.confirm();
    return c.json({ error: null, data: null });
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : String(error), data: null }, 500);
  }
});

app.post('/api/menu/back', async c => {
  try {
    await menuController.back();
    return c.json({ error: null, data: null });
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : String(error), data: null }, 500);
  }
});

app.use('/*', serveStatic({ root: './dist' }));
app.use('/*', serveStatic({ path: './dist/index.html' }));

if (!process.env.PORT) {
  throw new Error('PORT environment variable is required');
}

const port = parseInt(process.env.PORT);
const hostname = process.env.HOST;

const logConfig: any = { port, tk700Host: process.env.TK700_HOST };
if (hostname) {
  logConfig.hostname = hostname;
}
logger.info(logConfig, 'TK700 Control Server starting');

const serverConfig: any = { port, fetch: app.fetch };
if (hostname) {
  serverConfig.hostname = hostname;
}

export default serverConfig;
