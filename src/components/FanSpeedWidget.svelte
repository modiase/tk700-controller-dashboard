<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fanSpeed$ } from '../lib/polling-service';
  import FanIcon from '../assets/icons/fan.svg';
  import type { Subscription } from 'rxjs';
  import WidgetCard from './WidgetCard.svelte';
  import LoadingSpinner from './LoadingSpinner.svelte';

  let fanSpeed: number | null = null;
  let loading = true;
  let subscription: Subscription;

  onMount(() => {
    subscription = fanSpeed$.subscribe(speed => {
      if (speed !== null) {
        fanSpeed = speed;
      }
      loading = false;
    });
  });

  onDestroy(() => {
    if (subscription) subscription.unsubscribe();
  });
</script>

<WidgetCard title="Fan Speed">
  {#if loading && fanSpeed === null}
    <LoadingSpinner />
  {:else}
    <div class="widget-content">
      <div class="value-container">
        <div class="mb-4">
          <img
            src={FanIcon}
            alt="Fan"
            class="fan-icon"
            class:spinning={fanSpeed !== null && fanSpeed > 0}
          />
        </div>
        <p class="value" class:null-value={fanSpeed === null}>
          {fanSpeed !== null ? `${fanSpeed} RPM` : '- RPM'}
        </p>
      </div>
    </div>
  {/if}
</WidgetCard>

<style lang="scss">
  .fan-icon {
    width: 4rem;
    height: 4rem;
    display: inline-block;
    transition: all 0.3s ease;

    &.spinning {
      animation: spin 2s linear infinite;
    }
  }

  .value {
    font-size: 2.5rem;
    font-weight: 700;
    color: #374151;

    &.null-value {
      color: #9ca3af;
    }
  }
</style>
