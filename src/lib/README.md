# Functional Result Type System

This codebase uses a functional programming pattern for error handling based on `Either<Error, Option<Result>>`.

## Type Structure

```typescript
type Option<T> =
  | { type: 'some'; value: T } // Has a value
  | { type: 'none' }; // No value available

type Either<L, R> =
  | { type: 'left'; value: L } // Error case
  | { type: 'right'; value: R }; // Success case

type ApiResult<T> = Either<string, Option<T>>;
```

## Three States

Every API operation can be in one of three states:

1. **Success with value**: `Success(value)` → `{ error: null, data: value }`
2. **Success with no data**: `NoData()` → `{ error: null, data: null }`
3. **Failure**: `Failure(error)` → `{ error: "message", data: null }`

## Why This Matters

### Before

- Errors were thrown as exceptions
- `null` returns were ambiguous (error? or just no data?)
- Widgets couldn't distinguish between errors and "Block item" responses
- Led to UI flicker when projector returned temporary "Block item" responses

### After

- Errors are values, not exceptions
- "Block item" responses return `NoData()` → `{ error: null, data: null }`
- Widgets check `if (data !== null)` and skip updates when data is unavailable
- No more UI flicker from temporary unavailable states

## Usage Example

```typescript
// In BenQ client
async getPowerStatus(): Promise<ApiResult<boolean>> {
  try {
    const response = await this.sendCommand('pow=?');

    if (response.includes('Block item')) {
      return NoData<boolean>();  // No data available
    }

    const isOn = response.includes('POW=ON');
    return Success(isOn);  // Success with value
  } catch (error) {
    return Failure('Connection failed');  // Error
  }
}

// In API handler
app.get('/api/power', async (c) => {
  const result = await benqClient.getPowerStatus();
  const response = toApiResponse(result);
  // response is { error: null, data: true } or
  //             { error: null, data: null } or
  //             { error: "message", data: null }
  return c.json(response);
});

// In widget
const { error, data } = await getPowerStatus();
if (error) {
  // Show error
} else if (data !== null) {
  // Update UI with data
  powerOn = data;
}
// If data === null, skip update (projector not ready)
```

## Benefits

1. **Explicit**: All possible outcomes are represented in types
2. **Safe**: No uncaught exceptions
3. **Composable**: Easy to chain operations
4. **Clear intent**: Code clearly shows what happens in each case
5. **Better UX**: Widgets handle temporary unavailability gracefully
