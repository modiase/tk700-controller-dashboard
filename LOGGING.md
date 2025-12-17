# Logging Architecture

This application follows 12-factor app logging principles with structured logging via Pino.

## Log Levels

- **debug**: Detailed diagnostic information (raw responses, parsing steps)
- **info**: Important operational events (power toggled, volume changed)
- **warn**: Unexpected but recoverable issues (parse failures)
- **error**: Failures that prevent operations (connection errors, command failures)

## Configuration

### Environment Variables

- `LOG_LEVEL`: Set explicit log level (debug, info, warn, error)
- `NODE_ENV`: Controls output format
  - `development`: Pretty-printed, colorized logs to stderr
  - `production`: JSON structured logs to stderr

### Default Levels

- Development: `debug` (see everything)
- Production: `info` (operational events only)

## Output

**All logs go to stdout** (12-factor app principle):

- Logs are written unbuffered to stdout
- The execution environment (Docker, systemd, etc.) handles routing and storage
- This allows flexible log aggregation without the app managing logfiles

## Log Structure

### Development

```
[10:23:45.123] DEBUG (benq-client): Power status raw response
    response: "*POW=ON#"
```

### Production

```json
{
  "level": 20,
  "time": 1234567890,
  "component": "benq-client",
  "response": "*POW=ON#",
  "msg": "Power status raw response"
}
```

## Frontend Error Handling

Widgets handle errors gracefully:

- **Keep last known good value** - Don't flash empty/error states
- **Log to console** - Errors are visible in browser console for debugging
- **Continue polling** - Transient failures don't break the UI
- **No error UI** - Users see stable data instead of error messages

This creates a resilient UI that handles projector state transitions smoothly without flickering or showing unnecessary errors to users.

## Example Logs

### Successful Query

```
DEBUG: Power status raw response { response: "*POW=ON#" }
DEBUG: Parsed power status { cleaned: "*POW=ON#", isOn: true }
```

### Projector Not Ready

```
DEBUG: Power status raw response { response: "*Block item#" }
DEBUG: Power status unavailable: projector not ready
```

### Connection Error

```
ERROR: Failed to get power status { error: "Connection timeout", command: "pow=?" }
```

### User Action

```
INFO: Power command sent { on: true }
INFO: Volume command sent { level: 15 }
```
