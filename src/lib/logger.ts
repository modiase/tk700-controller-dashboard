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
  const log = (level: keyof typeof levels, msgOrObj: string | Record<string, unknown>, ...args: unknown[]) => {
    if (levels[level] < currentLevel) return;

    const timestamp = new Date().toISOString();
    let message: string;
    let extraContext: Record<string, unknown> = {};

    if (typeof msgOrObj === 'string') {
      message = msgOrObj;
    } else {
      extraContext = msgOrObj;
      message = args[0] as string;
      args = args.slice(1);
    }

    const allContext = { ...context, ...extraContext };
    const contextStr = Object.keys(allContext).length > 0
      ? ` [${Object.entries(allContext).map(([k, v]) => `${k}:${v}`).join(' ')}]`
      : '';
    const method = level === 'fatal' || level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';

    console[method](`[${timestamp}] [${level.toUpperCase()}]${contextStr} ${message}`, ...args);
  };

  return {
    trace: (msgOrObj: string | Record<string, unknown>, ...args: unknown[]) => log('trace', msgOrObj, ...args),
    debug: (msgOrObj: string | Record<string, unknown>, ...args: unknown[]) => log('debug', msgOrObj, ...args),
    info: (msgOrObj: string | Record<string, unknown>, ...args: unknown[]) => log('info', msgOrObj, ...args),
    warn: (msgOrObj: string | Record<string, unknown>, ...args: unknown[]) => log('warn', msgOrObj, ...args),
    error: (msgOrObj: string | Record<string, unknown>, ...args: unknown[]) => log('error', msgOrObj, ...args),
    fatal: (msgOrObj: string | Record<string, unknown>, ...args: unknown[]) => log('fatal', msgOrObj, ...args),
    child: (childContext: Record<string, unknown>) =>
      createLogger({ ...context, ...childContext }),
  };
}

export const logger = createLogger();
export const tk700Logger = logger.child({ component: 'tk700-client' });
