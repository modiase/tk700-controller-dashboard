<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { pictureSettings$ } from '../lib/sse-bridge';
  import { adjustBrightness, setBrightness, setContrast, setSharpness } from '../lib/api';
  import type { Subscription } from 'rxjs';
  import WidgetCard from './WidgetCard.svelte';
  import LoadingSpinner from './LoadingSpinner.svelte';

  const BRIGHTNESS_MIN = 0;
  const BRIGHTNESS_MAX = 100;
  const CONTRAST_MIN = 0;
  const CONTRAST_MAX = 100;
  const SHARPNESS_MIN = 0;
  const SHARPNESS_MAX = 15;

  let brightness: number | null = null;
  let contrast: number | null = null;
  let sharpness: number | null = null;
  let adjusting = { brightness: false, contrast: false, sharpness: false };
  let loading = true;
  let subscription: Subscription;

  let brightnessInput = '';
  let contrastInput = '';
  let sharpnessInput = '';

  $: if (brightness !== null) brightnessInput = brightness.toString();
  $: if (contrast !== null) contrastInput = contrast.toString();
  $: if (sharpness !== null) sharpnessInput = sharpness.toString();

  type PropertyKey = 'brightness' | 'contrast' | 'sharpness';

  function isAdjustDisabled(
    property: PropertyKey,
    value: number | null,
    direction: 'up' | 'down'
  ): boolean {
    if (adjusting[property] || value === null) return true;

    const limits = {
      brightness: { min: BRIGHTNESS_MIN, max: BRIGHTNESS_MAX },
      contrast: { min: CONTRAST_MIN, max: CONTRAST_MAX },
      sharpness: { min: SHARPNESS_MIN, max: SHARPNESS_MAX },
    };

    const { min, max } = limits[property];
    return direction === 'up' ? value >= max : value <= min;
  }

  $: brightnessUpDisabled = isAdjustDisabled('brightness', brightness, 'up');
  $: brightnessDownDisabled = isAdjustDisabled('brightness', brightness, 'down');
  $: contrastUpDisabled = isAdjustDisabled('contrast', contrast, 'up');
  $: contrastDownDisabled = isAdjustDisabled('contrast', contrast, 'down');
  $: sharpnessUpDisabled = isAdjustDisabled('sharpness', sharpness, 'up');
  $: sharpnessDownDisabled = isAdjustDisabled('sharpness', sharpness, 'down');

  function createAdjustHandler(
    property: PropertyKey,
    value: number | null,
    adjustFn: (dir: 'up' | 'down') => Promise<void>,
    setFn?: (val: number) => Promise<void>
  ) {
    return async (direction: 'up' | 'down') => {
      if (isAdjustDisabled(property, value, direction)) return;

      adjusting = { ...adjusting, [property]: true };
      try {
        if (adjustFn) {
          await adjustFn(direction);
        } else if (setFn && value !== null) {
          await setFn(direction === 'up' ? value + 1 : value - 1);
        }
      } catch (e) {
        console.error(`Failed to adjust ${property}:`, e);
      } finally {
        adjusting = { ...adjusting, [property]: false };
      }
    };
  }

  function createInputHandler(
    property: PropertyKey,
    inputValue: string,
    min: number,
    max: number,
    setFn: (val: number) => Promise<void>
  ) {
    return async (event: KeyboardEvent) => {
      if (event.key !== 'Enter') return;
      const value = parseInt(inputValue);
      if (isNaN(value)) return;

      const clampedValue = Math.max(min, Math.min(max, value));
      adjusting = { ...adjusting, [property]: true };
      try {
        await setFn(clampedValue);
      } catch (e) {
        console.error(`Failed to set ${property}:`, e);
      } finally {
        adjusting = { ...adjusting, [property]: false };
      }
    };
  }

  async function handleBrightnessAdjust(direction: 'up' | 'down') {
    await createAdjustHandler('brightness', brightness, adjustBrightness)(direction);
  }

  async function handleContrastAdjust(direction: 'up' | 'down') {
    await createAdjustHandler('contrast', contrast, async () => {}, setContrast)(direction);
  }

  async function handleSharpnessAdjust(direction: 'up' | 'down') {
    await createAdjustHandler('sharpness', sharpness, async () => {}, setSharpness)(direction);
  }

  async function handleBrightnessInput(event: KeyboardEvent) {
    await createInputHandler(
      'brightness',
      brightnessInput,
      BRIGHTNESS_MIN,
      BRIGHTNESS_MAX,
      setBrightness
    )(event);
  }

  async function handleContrastInput(event: KeyboardEvent) {
    await createInputHandler(
      'contrast',
      contrastInput,
      CONTRAST_MIN,
      CONTRAST_MAX,
      setContrast
    )(event);
  }

  async function handleSharpnessInput(event: KeyboardEvent) {
    await createInputHandler(
      'sharpness',
      sharpnessInput,
      SHARPNESS_MIN,
      SHARPNESS_MAX,
      setSharpness
    )(event);
  }

  onMount(() => {
    subscription = pictureSettings$.subscribe(state => {
      if (state.value === null) {
        brightness = null;
        contrast = null;
        sharpness = null;
      } else {
        brightness = state.value.brightness;
        contrast = state.value.contrast;
        sharpness = state.value.sharpness;
      }
      loading = false;
    });
  });

  onDestroy(() => {
    if (subscription) subscription.unsubscribe();
  });
</script>

<WidgetCard title="Picture Settings">
  <div class="settings-wrapper">
    {#if loading && brightness === null && contrast === null && sharpness === null}
      <LoadingSpinner />
    {:else}
      <div class="settings-grid">
        <!-- Brightness -->
        <div class="setting-control">
          <button
            class="button is-primary is-rounded"
            disabled={brightnessUpDisabled}
            on:click={() => handleBrightnessAdjust('up')}
          >
            <span class="icon is-small">
              <i class="fa-solid fa-plus"></i>
            </span>
          </button>
          <div class="value-display">
            <input
              type="number"
              class="value-input"
              bind:value={brightnessInput}
              on:keydown={handleBrightnessInput}
              disabled={adjusting.brightness || brightness === null}
              min={BRIGHTNESS_MIN}
              max={BRIGHTNESS_MAX}
              placeholder="-"
            />
            <span class="label">Brightness</span>
          </div>
          <button
            class="button is-primary is-rounded"
            disabled={brightnessDownDisabled}
            on:click={() => handleBrightnessAdjust('down')}
          >
            <span class="icon is-small">
              <i class="fa-solid fa-minus"></i>
            </span>
          </button>
        </div>

        <!-- Contrast -->
        <div class="setting-control">
          <button
            class="button is-primary is-rounded"
            disabled={contrastUpDisabled}
            on:click={() => handleContrastAdjust('up')}
          >
            <span class="icon is-small">
              <i class="fa-solid fa-plus"></i>
            </span>
          </button>
          <div class="value-display">
            <input
              type="number"
              class="value-input"
              bind:value={contrastInput}
              on:keydown={handleContrastInput}
              disabled={adjusting.contrast || contrast === null}
              min={CONTRAST_MIN}
              max={CONTRAST_MAX}
              placeholder="-"
            />
            <span class="label">Contrast</span>
          </div>
          <button
            class="button is-primary is-rounded"
            disabled={contrastDownDisabled}
            on:click={() => handleContrastAdjust('down')}
          >
            <span class="icon is-small">
              <i class="fa-solid fa-minus"></i>
            </span>
          </button>
        </div>

        <!-- Sharpness -->
        <div class="setting-control">
          <button
            class="button is-primary is-rounded"
            disabled={sharpnessUpDisabled}
            on:click={() => handleSharpnessAdjust('up')}
          >
            <span class="icon is-small">
              <i class="fa-solid fa-plus"></i>
            </span>
          </button>
          <div class="value-display">
            <input
              type="number"
              class="value-input"
              bind:value={sharpnessInput}
              on:keydown={handleSharpnessInput}
              disabled={adjusting.sharpness || sharpness === null}
              min={SHARPNESS_MIN}
              max={SHARPNESS_MAX}
              placeholder="-"
            />
            <span class="label">Sharpness</span>
          </div>
          <button
            class="button is-primary is-rounded"
            disabled={sharpnessDownDisabled}
            on:click={() => handleSharpnessAdjust('down')}
          >
            <span class="icon is-small">
              <i class="fa-solid fa-minus"></i>
            </span>
          </button>
        </div>
      </div>
    {/if}
  </div>
</WidgetCard>

<style lang="scss">
  .settings-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    padding: 0.5rem;
  }

  .setting-control {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;

    .button.is-primary.is-rounded {
      background-color: var(--benq-purple);
      border-color: var(--benq-purple);
      color: white;

      &:hover:not(:disabled) {
        background-color: white;
        border-color: var(--benq-purple);
        color: var(--benq-purple);
      }

      &:active:not(:disabled) {
        transform: scale(0.95);
      }
    }
  }

  .value-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    min-height: 60px;
    justify-content: center;

    .value-input {
      font-size: 2rem;
      font-weight: 700;
      color: var(--color-value);
      line-height: 1;
      text-align: center;
      border: 2px solid transparent;
      border-radius: 0.375rem;
      padding: 0.25rem 0.5rem;
      width: 80px;
      background-color: transparent;
      transition: all 0.2s ease;

      &:hover:not(:disabled) {
        border-color: var(--gray-200);
        background-color: var(--gray-50);
      }

      &:focus {
        outline: none;
        border-color: var(--benq-purple);
        background-color: var(--color-background);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      &::placeholder {
        color: var(--color-value);
      }

      // Hide spinner arrows
      &::-webkit-inner-spin-button,
      &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      -moz-appearance: textfield;
      appearance: textfield;
    }

    .label {
      font-size: 0.75rem;
      color: var(--color-label);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 500;
    }
  }
</style>
