<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { volume$ } from '../lib/sse-bridge';
  import { setVolume } from '../lib/api';
  import type { Subscription } from 'rxjs';
  import WidgetCard from './WidgetCard.svelte';
  import LoadingSpinner from './LoadingSpinner.svelte';

  let volume: number | null = null;
  let loading = true;
  let subscription: Subscription;
  let setting = false;

  async function handleVolumeChange(event: Event) {
    if (setting) return;

    const newVolume = parseInt((event.target as HTMLInputElement).value);

    setting = true;
    try {
      await setVolume(newVolume);
      volume = newVolume;
    } catch (e) {
      console.error('Failed to set volume:', e);
    } finally {
      setting = false;
    }
  }

  onMount(() => {
    subscription = volume$.subscribe(vol => {
      volume = vol;
      loading = false;
    });
  });

  onDestroy(() => {
    if (subscription) subscription.unsubscribe();
  });
</script>

<WidgetCard title="Volume">
  {#if loading && volume === null}
    <LoadingSpinner />
  {:else}
    <div class="widget-content">
      <div class="value-container">
        <div class="text-3xl text-gray-500">
          <i class="fa-solid fa-volume-high"></i>
        </div>
        <p class="text-3xl font-bold text-gray-700">{volume ?? '-'}</p>
        <input
          type="range"
          min="0"
          max="20"
          value={volume ?? 0}
          on:change={handleVolumeChange}
          disabled={setting || volume === null}
          class="volume-slider"
        />
      </div>
      <p class="label">Volume</p>
    </div>
  {/if}
</WidgetCard>

<style lang="scss">
  .value-container {
    gap: 0.5rem;
  }

  .volume-slider {
    width: 80%;
    height: 6px;
    border-radius: 3px;
    background: var(--gray-200);
    outline: none;
    -webkit-appearance: none;
    appearance: none;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--gray-700);
      cursor: pointer;

      &:hover {
        background: var(--gray-800);
      }
    }

    &::-moz-range-thumb {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--gray-700);
      cursor: pointer;
      border: none;

      &:hover {
        background: var(--gray-800);
      }
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .label {
    font-size: 0.875rem;
    color: var(--color-label);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    text-align: center;
    margin-top: 1.5rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--gray-200);
  }
</style>
