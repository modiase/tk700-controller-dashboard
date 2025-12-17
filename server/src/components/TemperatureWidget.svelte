<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { temperature$ } from '../lib/polling-service';
  import type { Subscription } from 'rxjs';
  import WidgetCard from './WidgetCard.svelte';
  import LoadingSpinner from './LoadingSpinner.svelte';

  let temperature: number | null = null;
  let loading = true;
  let subscription: Subscription;

  $: tempColor = getTemperatureColor(temperature);

  function getTemperatureColor(temp: number | null): string {
    if (temp === null) return '#9ca3af'; // Gray - no data
    if (temp < 30) return '#10b981'; // Green - cool
    if (temp < 40) return '#f59e0b'; // Orange - normal
    return '#ef4444'; // Red - hot
  }

  onMount(() => {
    subscription = temperature$.subscribe(temp => {
      if (temp !== null) {
        temperature = temp;
      }
      loading = false;
    });
  });

  onDestroy(() => {
    if (subscription) subscription.unsubscribe();
  });
</script>

<WidgetCard title="Temperature">
  {#if loading && temperature === null}
    <LoadingSpinner />
  {:else}
    <div class="widget-content">
      <div class="dial-container">
        <svg class="dial" viewBox="0 0 200 200">
          <!-- Background circle -->
          <circle cx="100" cy="100" r="80" fill="none" stroke="#e5e7eb" stroke-width="12" />
          <!-- Progress circle (only show if we have temperature) -->
          {#if temperature !== null}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke={tempColor}
              stroke-width="12"
              stroke-dasharray="{(temperature / 50) * 502.65} 502.65"
              stroke-linecap="round"
              transform="rotate(-90 100 100)"
              style="transition: stroke 0.3s ease"
            />
          {/if}
          <!-- Temperature text -->
          <text x="100" y="95" text-anchor="middle" class="dial-value" fill={tempColor}>
            {temperature !== null ? temperature.toFixed(1) : '-'}
          </text>
          <text x="100" y="115" text-anchor="middle" class="dial-unit"> °C </text>
        </svg>
      </div>
    </div>
  {/if}
</WidgetCard>

<style lang="scss">
  .dial-container {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem 0;
  }

  .dial {
    width: 120px;
    height: 120px;
  }

  .dial-value {
    font-size: 1.75rem;
    font-weight: 700;
    transition: fill 0.3s ease;
  }

  .dial-unit {
    font-size: 1rem;
    font-weight: 400;
    fill: #6b7280;
  }
</style>
