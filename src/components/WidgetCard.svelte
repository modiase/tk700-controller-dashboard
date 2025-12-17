<script lang="ts">
  export let title: string;
</script>

<div class="card">
  <header class="card-header">
    <p class="card-header-title">
      {title}
    </p>
  </header>
  <div class="card-content">
    <div class="content has-text-centered">
      <slot />
    </div>
  </div>
</div>
