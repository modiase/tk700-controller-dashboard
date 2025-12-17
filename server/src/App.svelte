<script lang="ts">
  import TemperatureWidget from './components/TemperatureWidget.svelte';
  import FanSpeedWidget from './components/FanSpeedWidget.svelte';
  import PowerSwitch from './components/PowerSwitch.svelte';
  import PictureModeWidget from './components/PictureModeWidget.svelte';
  import PictureSettingsWidget from './components/PictureSettingsWidget.svelte';
  import projectorImage from './assets/projector.webp';
  import benqLogo from './assets/benq-logo.svg';
</script>

<section class="section">
  <div class="container">
    <div class="header-section">
      <img src={projectorImage} alt="BenQ TK700 Projector" class="projector-image" />
      <div class="header-text">
        <img src={benqLogo} alt="BenQ Logo" class="benq-logo" />
        <h1 class="title is-4 dashboard-title">TK700 Control Dashboard</h1>
      </div>
    </div>

    <div class="columns is-multiline widget-row">
      <div class="column is-4 widget-column">
        <PowerSwitch />
      </div>

      <div class="column is-4 widget-column">
        <TemperatureWidget />
      </div>

      <div class="column is-4 widget-column">
        <FanSpeedWidget />
      </div>
    </div>

    <div class="columns is-multiline widget-row">
      <div class="column is-6 widget-column">
        <PictureModeWidget />
      </div>

      <div class="column is-6 widget-column">
        <PictureSettingsWidget />
      </div>
    </div>
  </div>
</section>

<style lang="scss">
  .header-section {
    display: flex;
    align-items: center;
    gap: 2rem;
    margin-bottom: 2rem;
    padding-left: 1rem;
  }

  .projector-image {
    max-width: 200px;
    height: auto;
    opacity: 0.9;
    flex-shrink: 0;
  }

  .header-text {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .benq-logo {
    max-width: 150px;
    height: auto;
  }

  .dashboard-title {
    color: var(--color-text-primary);
    font-weight: 500;
    margin-bottom: 0;
  }

  .widget-row {
    display: flex;
  }

  .widget-column {
    display: flex;
    flex-direction: column;

    :global(.card) {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    :global(.card-content) {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    :global(.content) {
      width: 100%;
    }
  }
</style>
