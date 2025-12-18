<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { blank$, freeze$ } from '../lib/sse-bridge';
  import { setBlank, setFreeze } from '../lib/api';
  import type { Subscription } from 'rxjs';
  import WidgetCard from './WidgetCard.svelte';
  import LoadingSpinner from './LoadingSpinner.svelte';

  let blankOn: boolean | null = null;
  let freezeOn: boolean | null = null;
  let blankMutable = true;
  let freezeMutable = true;
  let loading = true;
  let blankSubscription: Subscription;
  let freezeSubscription: Subscription;

  async function toggleBlank() {
    if (!blankMutable || blankOn === null) return;

    try {
      const targetOn = !blankOn;
      await setBlank(targetOn);
    } catch (e) {
      console.error('Failed to toggle blank:', e);
    }
  }

  async function toggleFreeze() {
    if (!freezeMutable || freezeOn === null) return;

    try {
      const targetOn = !freezeOn;
      await setFreeze(targetOn);
    } catch (e) {
      console.error('Failed to toggle freeze:', e);
    }
  }

  onMount(() => {
    blankSubscription = blank$.subscribe(state => {
      blankOn = state.value;
      blankMutable = state.mutable;
      loading = false;
    });

    freezeSubscription = freeze$.subscribe(state => {
      freezeOn = state.value;
      freezeMutable = state.mutable;
      loading = false;
    });
  });

  onDestroy(() => {
    if (blankSubscription) blankSubscription.unsubscribe();
    if (freezeSubscription) freezeSubscription.unsubscribe();
  });
</script>

<WidgetCard title="Display Controls">
  {#if loading && blankOn === null && freezeOn === null}
    <LoadingSpinner />
  {:else}
    <div class="widget-content">
      <div class="controls-stack">
        <div class="control-item">
          <label class="control-label">Blank</label>
          <button
            class="toggle-button"
            class:is-on={blankOn === true}
            class:is-off={blankOn === false}
            on:click={toggleBlank}
            disabled={!blankMutable || blankOn === null}
          >
            <span class="toggle-slider"></span>
          </button>
        </div>

        <div class="control-item">
          <label class="control-label">Freeze</label>
          <button
            class="toggle-button"
            class:is-on={freezeOn === true}
            class:is-off={freezeOn === false}
            on:click={toggleFreeze}
            disabled={!freezeMutable || freezeOn === null}
          >
            <span class="toggle-slider"></span>
          </button>
        </div>
      </div>
    </div>
  {/if}
</WidgetCard>

<style lang="scss">
  .widget-content {
    justify-content: center;
    padding: 0.5rem;
  }

  .controls-stack {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
  }

  .control-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .control-label {
    font-weight: 500;
    font-size: 0.875rem;
    color: var(--color-value);
    flex: 1;
  }

  .toggle-button {
    position: relative;
    width: 60px;
    height: 32px;
    border-radius: 16px;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
    flex-shrink: 0;

    &.is-off {
      background-color: var(--color-gray);
    }

    &.is-on {
      background-color: var(--benq-purple);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &:hover:not(:disabled) {
      &.is-off {
        background-color: var(--color-gray-dark);
      }

      &.is-on {
        background-color: var(--benq-purple-dark);
      }
    }
  }

  .toggle-slider {
    position: absolute;
    top: 4px;
    left: 4px;
    width: 24px;
    height: 24px;
    background-color: white;
    border-radius: 50%;
    transition: transform 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

    .is-on & {
      transform: translateX(28px);
    }

    .is-off & {
      transform: translateX(0);
    }
  }
</style>
