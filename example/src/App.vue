<template>
  <div class="image-optimizer">
    <h1>Image Optimizer</h1>
    <Upload />
  </div>
</template>

<script setup lang="ts">
import Upload from './components/Upload.vue'
</script>

<style lang="postcss">
html,
body {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  background-color: #fbfaff;
  color: #242428;
  * {
    box-sizing: border-box;
  }
}

.image-optimizer {
  text-align: center;
  padding: 80px 40px;
}

.overlay {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>
