<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { keystone$ } from '../lib/sseBridge';
  import { adjustVerticalKeystone, adjustHorizontalKeystone } from '../lib/api';
  import type { Subscription } from 'rxjs';
  import WidgetCard from './WidgetCard.svelte';
  import LoadingSpinner from './LoadingSpinner.svelte';

  let horizontal: number | null = null;
  let vertical: number | null = null;
  let mutable = true;
  let loading = true;
  let subscription: Subscription;

  async function handleAdjust(axis: 'vertical' | 'horizontal', direction: '+' | '-') {
    if (!mutable) return;

    try {
      if (axis === 'vertical') {
        await adjustVerticalKeystone(direction);
      } else {
        await adjustHorizontalKeystone(direction);
      }
    } catch (e) {
      console.error(`Failed to adjust ${axis} keystone:`, e);
    }
  }

  onMount(() => {
    subscription = keystone$.subscribe(state => {
      if (state.value) {
        horizontal = state.value.horizontal;
        vertical = state.value.vertical;
      }
      mutable = state.mutable;
      loading = false;
    });
  });

  onDestroy(() => {
    if (subscription) subscription.unsubscribe();
  });
</script>

<WidgetCard title="Keystone">
  {#if loading}
    <LoadingSpinner />
  {:else}
    <div class="widget-content">
      <div class="keystone-grid">
        <div class="arrow-top">
          <button
            class="arrow-button"
            disabled={!mutable}
            on:click={() => handleAdjust('vertical', '+')}
            aria-label="Increase vertical keystone"
          >
            ▲
          </button>
        </div>

        <div class="arrow-left">
          <button
            class="arrow-button"
            disabled={!mutable}
            on:click={() => handleAdjust('horizontal', '-')}
            aria-label="Decrease horizontal keystone"
          >
            ◀
          </button>
        </div>

        <div class="center-display">
          <div class="value-label">H: {horizontal ?? '-'}</div>
          <div class="value-label">V: {vertical ?? '-'}</div>
        </div>

        <div class="arrow-right">
          <button
            class="arrow-button"
            disabled={!mutable}
            on:click={() => handleAdjust('horizontal', '+')}
            aria-label="Increase horizontal keystone"
          >
            ▶
          </button>
        </div>

        <div class="arrow-bottom">
          <button
            class="arrow-button"
            disabled={!mutable}
            on:click={() => handleAdjust('vertical', '-')}
            aria-label="Decrease vertical keystone"
          >
            ▼
          </button>
        </div>
      </div>
    </div>
  {/if}
</WidgetCard>

<style lang="scss">
  .widget-content {
    justify-content: center;
    padding: 1rem;
  }

  .keystone-grid {
    display: grid;
    grid-template-columns: 1fr 3fr 1fr;
    grid-template-rows: 1fr 3fr 1fr;
    gap: 0.5rem;
    width: 100%;
    max-width: 250px;
    margin: 0 auto;
  }

  .arrow-top {
    grid-column: 2;
    grid-row: 1;
    display: flex;
    justify-content: center;
  }

  .arrow-left {
    grid-column: 1;
    grid-row: 2;
    display: flex;
    align-items: center;
  }

  .center-display {
    grid-column: 2;
    grid-row: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem;
    border: 2px solid var(--gray-200);
    border-radius: 0.5rem;
    background-color: var(--color-background);
  }

  .arrow-right {
    grid-column: 3;
    grid-row: 2;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .arrow-bottom {
    grid-column: 2;
    grid-row: 3;
    display: flex;
    justify-content: center;
  }

  .arrow-button {
    width: 40px;
    height: 40px;
    border: 2px solid var(--gray-200);
    border-radius: 0.5rem;
    background-color: var(--color-background);
    color: var(--color-value);
    font-size: 1.25rem;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover:not(:disabled) {
      border-color: var(--benq-purple);
      background-color: var(--benq-purple);
      color: var(--color-background);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .value-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-value);
  }
</style>
