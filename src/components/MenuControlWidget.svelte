<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { menu$ } from '../lib/sse-bridge';
  import { setMenu, menuNavigate, menuEnter, menuBack } from '../lib/api';
  import type { Subscription } from 'rxjs';
  import WidgetCard from './WidgetCard.svelte';
  import LoadingSpinner from './LoadingSpinner.svelte';

  let menuOn: string | null = null;
  let mutable = true;
  let loading = true;
  let subscription: Subscription;

  async function toggleMenu() {
    if (!mutable || menuOn === null) return;
    try {
      const targetOn = menuOn !== 'on';
      await setMenu(targetOn);
    } catch (e) {
      console.error('Failed to toggle menu:', e);
    }
  }

  async function handleNavigation(direction: 'up' | 'down' | 'left' | 'right') {
    if (!mutable) return;
    try {
      await menuNavigate(direction);
    } catch (e) {
      console.error(`Failed to navigate ${direction}:`, e);
    }
  }

  async function handleEnter() {
    if (!mutable) return;
    try {
      await menuEnter();
    } catch (e) {
      console.error('Failed to press enter:', e);
    }
  }

  async function handleBack() {
    if (!mutable) return;
    try {
      await menuBack();
    } catch (e) {
      console.error('Failed to go back:', e);
    }
  }

  onMount(() => {
    subscription = menu$.subscribe(state => {
      menuOn = state.value;
      mutable = state.mutable;
      loading = false;
    });
  });

  onDestroy(() => {
    if (subscription) subscription.unsubscribe();
  });
</script>

<WidgetCard title="Menu Controls">
  {#if loading}
    <LoadingSpinner />
  {:else}
    <div class="widget-content">
      <div class="controls-stack">
        <!-- Toggle button -->
        <div class="control-item">
          <label class="control-label">Menu</label>
          <button
            class="toggle-button"
            class:is-on={menuOn === 'on'}
            class:is-off={menuOn === 'off'}
            on:click={toggleMenu}
            disabled={!mutable || menuOn === null}
            aria-label="Toggle menu"
          >
            <span class="toggle-slider"></span>
          </button>
        </div>

        <!-- Navigation grid (D-pad style) -->
        <div class="menu-navigation">
          <div class="arrow-top">
            <button
              class="arrow-button"
              disabled={!mutable}
              on:click={() => handleNavigation('up')}
              aria-label="Menu up"
            >
              <i class="fa-solid fa-chevron-up"></i>
            </button>
          </div>

          <div class="arrow-left">
            <button
              class="arrow-button"
              disabled={!mutable}
              on:click={() => handleNavigation('left')}
              aria-label="Menu left"
            >
              <i class="fa-solid fa-chevron-left"></i>
            </button>
          </div>

          <div class="center-buttons">
            <button
              class="nav-button ok-button"
              disabled={!mutable}
              on:click={handleEnter}
              aria-label="Menu enter"
            >
              OK
            </button>
            <button
              class="nav-button back-button"
              disabled={!mutable}
              on:click={handleBack}
              aria-label="Menu back"
            >
              Back
            </button>
          </div>

          <div class="arrow-right">
            <button
              class="arrow-button"
              disabled={!mutable}
              on:click={() => handleNavigation('right')}
              aria-label="Menu right"
            >
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>

          <div class="arrow-bottom">
            <button
              class="arrow-button"
              disabled={!mutable}
              on:click={() => handleNavigation('down')}
              aria-label="Menu down"
            >
              <i class="fa-solid fa-chevron-down"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
</WidgetCard>

<style lang="scss">
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
    width: 3.75rem;
    height: 2rem;
    border-radius: 1rem;
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
    top: 0.25rem;
    left: 0.25rem;
    width: 1.5rem;
    height: 1.5rem;
    background-color: white;
    border-radius: 50%;
    transition: transform 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

    .is-on & {
      transform: translateX(1.75rem);
    }

    .is-off & {
      transform: translateX(0);
    }
  }

  .menu-navigation {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    grid-template-rows: auto auto auto;
    gap: 0.5rem;
    width: 100%;
    max-width: 16.25rem;
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
    justify-content: flex-start;
  }

  .center-buttons {
    grid-column: 2;
    grid-row: 2;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    gap: 0.5rem;
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
    width: 3rem;
    height: 3rem;
    border: 2px solid var(--gray-200);
    border-radius: 0.75rem;
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

    &:active:not(:disabled) {
      transform: scale(0.95);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .nav-button {
    padding: 0.625rem 1rem;
    border: 2px solid var(--gray-200);
    border-radius: 0.5rem;
    background-color: var(--color-background);
    color: var(--color-value);
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;

    &.ok-button {
      border-color: var(--benq-purple);
      color: var(--benq-purple);

      &:hover:not(:disabled) {
        background-color: var(--benq-purple);
        color: var(--color-background);
      }
    }

    &.back-button:hover:not(:disabled) {
      border-color: var(--gray-400);
      background-color: var(--gray-100);
    }

    &:active:not(:disabled) {
      transform: scale(0.95);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
</style>
