<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { pictureMode$ } from '../lib/sseBridge';
  import { setPictureMode } from '../lib/api';
  import type { Subscription } from 'rxjs';
  import WidgetCard from './WidgetCard.svelte';
  import LoadingSpinner from './LoadingSpinner.svelte';

  type PictureMode = 'bright' | 'livingroom' | 'game' | 'cine' | 'user1' | 'sport';

  const PICTURE_MODES: { id: PictureMode; label: string }[] = [
    { id: 'bright', label: 'Bright' },
    { id: 'livingroom', label: 'Living Room' },
    { id: 'game', label: 'Game' },
    { id: 'cine', label: 'Cinema' },
    { id: 'user1', label: 'User 1' },
    { id: 'sport', label: 'Sport' },
  ];

  let currentMode: PictureMode | null = null;
  let mutable = true;
  let loading = true;
  let subscription: Subscription;

  async function handleModeChange(mode: PictureMode) {
    if (!mutable || currentMode === mode) return;

    try {
      await setPictureMode(mode);
    } catch (e) {
      console.error('Failed to set picture mode:', e);
    }
  }

  onMount(() => {
    subscription = pictureMode$.subscribe(state => {
      currentMode = state.value !== null ? (state.value as PictureMode) : null;
      mutable = state.mutable;
      loading = false;
    });
  });

  onDestroy(() => {
    if (subscription) subscription.unsubscribe();
  });
</script>

<WidgetCard title="Picture Mode">
  {#if loading && currentMode === null}
    <LoadingSpinner />
  {:else}
    <div class="widget-content">
      <div class="modes-grid">
        {#each PICTURE_MODES as mode}
          <button
            class="mode-button"
            class:active={currentMode === mode.id}
            disabled={!mutable || currentMode === null}
            on:click={() => handleModeChange(mode.id)}
          >
            {mode.label}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</WidgetCard>

<style lang="scss">
  .widget-content {
    justify-content: center;
    padding: 0.5rem;
  }

  .modes-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    width: 100%;
  }

  .mode-button {
    padding: 0.75rem 1rem;
    border: 2px solid var(--gray-200);
    border-radius: 0.5rem;
    background-color: var(--color-background);
    color: var(--color-value);
    font-weight: 500;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;

    &:hover:not(:disabled) {
      border-color: var(--gray-400);
      background-color: var(--gray-50);
    }

    &.active {
      border-color: var(--benq-purple);
      background-color: var(--benq-purple);
      color: var(--color-background);
      font-weight: 600;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
</style>
