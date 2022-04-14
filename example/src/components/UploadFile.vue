<template>
  <div :class="{ 'file-upload-wrap': true, dragging }" :style="{ width, height }">
    <form
      :id="id"
      class="file-upload-form"
      action=""
      enctype="multipart/form-data"
      @drop="dropUploadImage"
      @dragenter="dragStart"
      @dragleave="dragEnd"
      @dragend="dragEnd"
      @input="handleFileSelect"
    >
      <label class="file-upload-area" :for="`image-upload-input${id}`">
        <slot>
          <div
            v-if="preview"
            :style="{ backgroundImage: `url(${preview})` }"
            class="image-preview"
          />
          <div class="file-upload-button" :class="{ 'has-file': !!preview }">
            <img src="../assets/img/upload.svg" />
            <div v-if="text">{{ text }}</div>
          </div>
        </slot>
      </label>
      <input
        :id="`file-upload-input${id}`"
        class="file-upload overlay"
        type="file"
        :accept="accept"
        :disabled="isDisabled"
        @click="clickInputFile"
      />
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

withDefaults(
  defineProps<{
    id?: string
    isDisabled?: boolean
    preview?: string | null
    text?: string | null
    accept?: string
    width?: string
    height?: string
  }>(),
  {
    id: '',
    isDisabled: false,
    preview: null,
    text: null,
    accept: 'image/*',
    width: '100%',
    height: '182px',
  },
)
const emit = defineEmits<{
  (e: 'file-select', value: File): void
}>()

const dragging = ref(false)
const selectedFile = ref<File>()

const handleFileSelect = (e: InputEvent | Event) => {
  if (e && e.target && e.type === 'input') {
    const files = (e.target as HTMLInputElement).files
    if (files) {
      selectedFile.value = files[0]
      emit('file-select', selectedFile.value)
    }
  } else if (e && e.type === 'drop') {
    const files = (e as InputEvent).dataTransfer?.files
    if (files) {
      selectedFile.value = files[0]
      emit('file-select', selectedFile.value)
    }
  }
  dragging.value = false
}
const dragStart = (e: Event) => {
  e.preventDefault()
  dragging.value = true
}
const dragEnd = (e: Event) => {
  e.preventDefault()
  dragging.value = false
}
const dropUploadImage = (e: Event) => {
  e.preventDefault()
  handleFileSelect(e)
}
const clickInputFile = (e: MouseEvent) => {
  if (e && e.target) {
    ;(e.target as HTMLInputElement).value = ''
  }
}
</script>

<style lang="postcss">
$border-radius: 4px;
$background: #eae5ff;
$outline: #451dd6;

.file-upload-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: $border-radius;
  &.dragging {
    border-color: $outline;
  }
  .image-preview {
    width: 100%;
    height: 100%;
    border-radius: 16px;
    background-size: cover;
    background-position: center;
    position: absolute;
  }
}
.file-upload-form {
  position: relative;
  height: 100%;
  width: 100%;
}
.file-upload-background {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: $border-radius;
  background-color: transparent;
  background-size: cover;
  background-position: center;
}
.file-upload {
  position: absolute;
  cursor: pointer;
  opacity: 0;
}
.file-upload + label * {
  pointer-events: none;
}
.file-upload-button {
  font-size: 13px;
  padding: 0 24px;
  color: $outline;
  border-radius: $border-radius;
  border: 2px dashed $outline;
  background-color: $background;
  &.has-file {
    background-color: rgba($background, 0.5);
  }
}
.file-upload-button,
.file-upload-spinner {
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: $border-radius;
  align-items: center;
  text-align: center;
  pointer-events: none;
  z-index: 10;
  position: absolute;
  width: 100%;
  height: 100%;
  .loader {
    margin: 0;
  }
  img {
    width: 24px;
    margin-bottom: 6px;
  }
}
</style>
