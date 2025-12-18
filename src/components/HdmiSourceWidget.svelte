<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { hdmiSource$ } from '../lib/sse-bridge';
  import { setHdmiSource } from '../lib/api';
  import type { Subscription } from 'rxjs';
  import WidgetCard from './WidgetCard.svelte';
  import LoadingSpinner from './LoadingSpinner.svelte';

  type HdmiSource = 'hdmi' | 'hdmi2' | 'hdmi3';

  const HDMI_SOURCES: { id: HdmiSource; label: string }[] = [
    { id: 'hdmi', label: 'HDMI 1' },
    { id: 'hdmi2', label: 'HDMI 2' },
    { id: 'hdmi3', label: 'HDMI 3' },
  ];

  let currentSource: HdmiSource | null = null;
  let mutable = true;
  let loading = true;
  let subscription: Subscription;

  async function handleSourceChange(source: HdmiSource) {
    if (!mutable || currentSource === source) return;

    try {
      await setHdmiSource(source);
    } catch (e) {
      console.error('Failed to set HDMI source:', e);
    }
  }

  onMount(() => {
    subscription = hdmiSource$.subscribe(state => {
      currentSource = state.value !== null ? (state.value as HdmiSource) : null;
      mutable = state.mutable;
      loading = false;
    });
  });

  onDestroy(() => {
    if (subscription) subscription.unsubscribe();
  });
</script>

<WidgetCard title="HDMI Source">
  {#if loading && currentSource === null}
    <LoadingSpinner />
  {:else}
    <div class="widget-content">
      <div class="sources-stack">
        {#each HDMI_SOURCES as source}
          <button
            class="source-button"
            class:active={currentSource === source.id}
            disabled={!mutable || currentSource === null}
            on:click={() => handleSourceChange(source.id)}
          >
            {source.label}
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

  .sources-stack {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
  }

  .source-button {
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
