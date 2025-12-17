const isDevelopment = process.env.NODE_ENV !== 'production';
const logLevel = process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info');

const levels = {
  trace: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
  fatal: 5,
};

const currentLevel = levels[logLevel as keyof typeof levels] ?? levels.info;

function createLogger(context?: Record<string, unknown>) {
  const log = (level: keyof typeof levels, message: string, ...args: unknown[]) => {
    if (levels[level] < currentLevel) return;

    const timestamp = new Date().toISOString();
    const contextStr = context ? ` [${Object.entries(context).map(([k, v]) => `${k}:${v}`).join(' ')}]` : '';
    const method = level === 'fatal' || level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';

    console[method](`[${timestamp}] [${level.toUpperCase()}]${contextStr} ${message}`, ...args);
  };

  return {
    trace: (message: string, ...args: unknown[]) => log('trace', message, ...args),
    debug: (message: string, ...args: unknown[]) => log('debug', message, ...args),
    info: (message: string, ...args: unknown[]) => log('info', message, ...args),
    warn: (message: string, ...args: unknown[]) => log('warn', message, ...args),
    error: (message: string, ...args: unknown[]) => log('error', message, ...args),
    fatal: (message: string, ...args: unknown[]) => log('fatal', message, ...args),
    child: (childContext: Record<string, unknown>) =>
      createLogger({ ...context, ...childContext }),
  };
}

export const logger = createLogger();
export const tk700Logger = logger.child({ component: 'tk700-client' });
