# TK700 Control Dashboard

Web control interface for BenQ TK700 projector via RS232-over-TCP. Built with Bun, Hono, Svelte, and fp-ts.

## Quick Start

```bash
nix run
```

Access at `http://localhost:3000`

## Environment Variables

| Variable        | Default | Description                              |
| --------------- | ------- | ---------------------------------------- |
| `TK700_HOST`    | -       | Projector IP address (required)          |
| `TK700_PORT`    | -       | Projector RS232-over-TCP port (required) |
| `TK700_TIMEOUT` | 5000    | Connection timeout in milliseconds       |
| `PORT`          | -       | Web server port (required)               |

## Systemd Deployment

Example service at `/etc/systemd/system/benq-control.service`:

```ini
[Unit]
Description=BenQ TK700 Control Dashboard
After=network-online.target

[Service]
ExecStart=/run/current-system/sw/bin/benq-control-server
Environment="TK700_HOST=192.168.1.80"
Environment="TK700_PORT=8234"
Environment="PORT=3000"
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Note: Server expects to run from its installation directory to serve static assets. The Nix package handles this via wrapper script.

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now benq-control
```

## Development

```bash
nix develop
cd server && pnpm install && pnpm start
```

Runs vite dev server (frontend with hot reload) + bun backend server separately. Check `./bin/develop` for ports.

## Features

- Power control with transition states
- Temperature and fan monitoring
- Volume and picture settings (brightness, contrast, sharpness)
- Real-time polling with RxJS observables

## Requirements

- Nix with flakes
- BenQ TK700 with RS232-Ethernet adapter
