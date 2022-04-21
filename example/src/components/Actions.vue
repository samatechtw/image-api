<template>
  <div class="actions">
    <IAButton text="Optimize" />
    <IAButton text="Resize" />
  </div>
</template>

<script lang="ts" setup>
import IAButton from './widgets/IAButton.vue'
</script>

<style lang="postcss">
.actions {
  margin-top: 24px;
  .ia-button:not(:first-child) {
    margin-left: 16px;
  }
}
</style>
