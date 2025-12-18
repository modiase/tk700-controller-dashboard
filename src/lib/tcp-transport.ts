import { connect, Socket } from 'net';

interface TransportConfig {
  host: string;
  port: number;
  timeout: number;
  minRequestIntervalMs: number;
  idleTimeoutMs: number;
}

export class TCPTransport {
  private config: TransportConfig;
  private socket: Socket | null = null;
  private connectionPromise: Promise<void> | null = null;
  private lastRequestTime = 0;
  private idleTimer: NodeJS.Timeout | null = null;
  private requestQueue: Promise<any> = Promise.resolve();

  constructor(config: TransportConfig) {
    this.config = config;
  }

  async sendRequest(data: string): Promise<string> {
    return this.enqueueRequest(async () => {
      await this.waitForThrottle();
      await this.ensureConnected();
      return this.executeRequest(data);
    });
  }

  close(): void {
    this.clearIdleTimer();
    if (this.socket && !this.socket.destroyed) {
      this.socket.destroy();
    }
    this.socket = null;
    this.connectionPromise = null;
  }

  private enqueueRequest<T>(task: () => Promise<T>): Promise<T> {
    const promise = this.requestQueue.then(
      () => task(),
      () => task()
    );
    this.requestQueue = promise.catch(() => {});
    return promise;
  }

  private async waitForThrottle(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const timeToWait = Math.max(0, this.config.minRequestIntervalMs - timeSinceLastRequest);

    if (timeToWait > 0) {
      await new Promise(resolve => setTimeout(resolve, timeToWait));
    }

    this.lastRequestTime = Date.now();
  }

  private async ensureConnected(): Promise<void> {
    if (this.socket && !this.socket.destroyed) {
      this.resetIdleTimer();
      return;
    }

    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      const socket = connect(this.config.port, this.config.host);

      socket.on('connect', () => {
        this.socket = socket;
        this.connectionPromise = null;
        this.resetIdleTimer();
        resolve();
      });

      socket.on('error', (error: Error) => {
        this.socket = null;
        this.connectionPromise = null;
        reject(error);
      });

      socket.on('close', () => {
        this.socket = null;
        this.connectionPromise = null;
        this.clearIdleTimer();
      });
    });

    return this.connectionPromise;
  }

  private executeRequest(data: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not connected'));
        return;
      }

      let responseData = '';
      let responseTimer: NodeJS.Timeout | null = null;

      const timeoutId = setTimeout(() => {
        cleanup();
        reject(new Error('Request timeout'));
      }, this.config.timeout);

      const onData = (chunk: Buffer) => {
        responseData += chunk.toString();

        if (!responseTimer) {
          responseTimer = setTimeout(() => {
            cleanup();
            resolve(responseData);
          }, 100);
        }
      };

      const onError = (error: Error) => {
        cleanup();
        reject(error);
      };

      const cleanup = () => {
        clearTimeout(timeoutId);
        if (responseTimer) clearTimeout(responseTimer);
        this.socket?.off('data', onData);
        this.socket?.off('error', onError);
      };

      this.socket.on('data', onData);
      this.socket.on('error', onError);
      this.socket.write(data);
    });
  }

  private resetIdleTimer(): void {
    this.clearIdleTimer();
    this.idleTimer = setTimeout(() => {
      this.close();
    }, this.config.idleTimeoutMs);
  }

  private clearIdleTimer(): void {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
  }
}
