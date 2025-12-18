<script lang="ts">
  import { openMenu, closeMenu, menuNavigate, menuEnter, menuBack } from '../lib/api';
  import WidgetCard from './WidgetCard.svelte';

  async function handleOpenMenu() {
    try {
      await openMenu();
    } catch (e) {
      console.error('Failed to open menu:', e);
    }
  }

  async function handleCloseMenu() {
    try {
      await closeMenu();
    } catch (e) {
      console.error('Failed to close menu:', e);
    }
  }

  async function handleNavigation(direction: 'up' | 'down' | 'left' | 'right') {
    try {
      await menuNavigate(direction);
    } catch (e) {
      console.error(`Failed to navigate ${direction}:`, e);
    }
  }

  async function handleEnter() {
    try {
      await menuEnter();
    } catch (e) {
      console.error('Failed to press enter:', e);
    }
  }

  async function handleBack() {
    try {
      await menuBack();
    } catch (e) {
      console.error('Failed to go back:', e);
    }
  }
</script>

<WidgetCard title="Menu">
  <div class="widget-content">
    <div class="controls-stack">
      <!-- Open/Close buttons -->
      <div class="control-item">
        <button class="menu-action-button" on:click={handleOpenMenu} aria-label="Open menu">
          Open
        </button>
        <button class="menu-action-button" on:click={handleCloseMenu} aria-label="Close menu">
          Close
        </button>
      </div>

      <!-- Navigation grid (D-pad style) -->
      <div class="menu-navigation">
        <div class="arrow-top">
          <button class="arrow-button" on:click={() => handleNavigation('up')} aria-label="Menu up">
            <i class="fa-solid fa-chevron-up"></i>
          </button>
        </div>

        <div class="arrow-left">
          <button
            class="arrow-button"
            on:click={() => handleNavigation('left')}
            aria-label="Menu left"
          >
            <i class="fa-solid fa-chevron-left"></i>
          </button>
        </div>

        <div class="center-buttons">
          <button class="nav-button ok-button" on:click={handleEnter} aria-label="Menu enter">
            OK
          </button>
          <button class="nav-button back-button" on:click={handleBack} aria-label="Menu back">
            Back
          </button>
        </div>

        <div class="arrow-right">
          <button
            class="arrow-button"
            on:click={() => handleNavigation('right')}
            aria-label="Menu right"
          >
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>

        <div class="arrow-bottom">
          <button
            class="arrow-button"
            on:click={() => handleNavigation('down')}
            aria-label="Menu down"
          >
            <i class="fa-solid fa-chevron-down"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
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
    justify-content: center;
    gap: 0.75rem;
  }

  .menu-action-button {
    flex: 1;
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

    &:hover {
      border-color: var(--benq-purple);
      background-color: var(--benq-purple);
      color: var(--color-background);
    }

    &:active {
      transform: scale(0.95);
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
