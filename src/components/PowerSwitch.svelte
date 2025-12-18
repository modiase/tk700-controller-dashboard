<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { setPower } from '../lib/api';
  import {
    PowerState,
    type PowerStateInfo,
    getPowerStateInfo,
  } from '../lib/powerState';
  import { powerState } from '../lib/sse-bridge';
  import type { Subscription } from 'rxjs';
  import WidgetCard from './WidgetCard.svelte';
  import LoadingSpinner from './LoadingSpinner.svelte';

  let powerOn: boolean | null = null;
  let powerStateValue: PowerState = PowerState.UNKNOWN;
  let stateInfo: PowerStateInfo = getPowerStateInfo(PowerState.UNKNOWN);
  let loading = true;
  let subscription: Subscription;

  $: stateInfo = getPowerStateInfo(powerStateValue);
  $: isTransitioning =
    powerStateValue === PowerState.WARMING_UP || powerStateValue === PowerState.COOLING_DOWN;
  $: actionMessage =
    powerStateValue === PowerState.WARMING_UP
      ? 'Turning on...'
      : powerStateValue === PowerState.COOLING_DOWN
        ? 'Turning off...'
        : null;

  async function togglePower() {
    if (powerOn === null || (!stateInfo.canTurnOn && !stateInfo.canTurnOff)) return;

    const targetOn = !powerOn;

    if (targetOn && !stateInfo.canTurnOn) {
      console.warn('Cannot turn on projector in current state:', powerStateValue);
      return;
    }
    if (!targetOn && !stateInfo.canTurnOff) {
      console.warn('Cannot turn off projector in current state:', powerStateValue);
      return;
    }

    try {
      await setPower(targetOn);
    } catch (e) {
      console.error('Failed to toggle power:', e);
    }
  }

  onMount(() => {
    subscription = powerState.subscribe(state => {
      if (state === null) return;

      powerOn = state.powerOn;
      powerStateValue = state.state as PowerState;
      loading = false;
    });
  });

  onDestroy(() => {
    if (subscription) subscription.unsubscribe();
  });
</script>

<WidgetCard title="Power Control">
  {#if loading && powerOn === null}
    <LoadingSpinner />
  {:else if powerOn !== null}
    <div class="widget-content">
      <div class="value-container">
        <button
          class="toggle-button"
          class:is-off={powerStateValue === PowerState.OFF}
          class:is-on={powerStateValue === PowerState.ON}
          class:is-warming={powerStateValue === PowerState.WARMING_UP}
          class:is-cooling={powerStateValue === PowerState.COOLING_DOWN}
          on:click={togglePower}
          disabled={isTransitioning || (!stateInfo.canTurnOn && !stateInfo.canTurnOff)}
        >
          <span class="toggle-slider"></span>
        </button>

        {#if actionMessage}
          <p class="text-sm text-gray-500 action-message">
            {actionMessage}
          </p>
        {/if}
      </div>
    </div>
  {/if}
</WidgetCard>

<style lang="scss">
  .value-container {
    gap: 1rem;
  }

  .action-message {
    font-style: italic;
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .toggle-button {
    position: relative;
    width: 80px;
    height: 40px;
    border-radius: 20px;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &.is-off {
      background-color: var(--color-gray);
    }

    &.is-on {
      background-color: var(--benq-purple);
    }

    &.is-warming {
      background-color: var(--color-warning);
    }

    &.is-cooling {
      background-color: var(--color-orange);
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

      &.is-warming {
        background-color: var(--color-warning-dark);
      }

      &.is-cooling {
        background-color: var(--color-orange-dark);
      }
    }
  }

  .toggle-slider {
    position: absolute;
    top: 4px;
    left: 4px;
    width: 32px;
    height: 32px;
    background-color: white;
    border-radius: 50%;
    transition: transform 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

    .is-on &,
    .is-warming & {
      transform: translateX(40px);
    }

    .is-off &,
    .is-cooling & {
      transform: translateX(0);
    }
  }
</style>
