<template>
  <div class="image-upload-wrap">
    <UploadFile
      text="Upload a PNG or JPEG image"
      :preview="file?.src"
      accept="image/*"
      width="400px"
      height="140px"
      @file-select="handleFileSelect"
    />
  </div>
  <Actions />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { validateMedia, MediaRequirements, ValidatedFile } from '../utils/validate-media'
import UploadFile from './UploadFile.vue'
import Actions from './Actions.vue'
import * as imageApi from '../../../dist-web/image-rs-processor/pkg-web'

console.log(imageApi)

const file = ref()
const error = ref()

const requirements: MediaRequirements = {
  ext: ['jpg', 'jpeg', 'png'],
  size: 20000000000,
}

function base64ToUint8Array(str: string): Uint8Array {
  var raw = atob(str)
  var rawLength = raw.length
  var array = new Uint8Array(new ArrayBuffer(rawLength))
  for (var i = 0; i < rawLength; i += 1) {
    array[i] = raw.charCodeAt(i)
  }
  return array
}

const mediaValid = (validFile: ValidatedFile, errors: string[] | null) => {
  if (errors && errors.length) {
    error.value = errors[0]
  } else {
    file.value = validFile
    validFile.file.arrayBuffer().then((buff) => {
      const fileArr = new Uint8Array(buff) // x is your uInt8Array
      // perform all required operations with x here.
      const result = imageApi.convert(fileArr, 'jpg')
      console.log(result)
    })
  }
}

const handleFileSelect = (selectedFile: File) => {
  if (selectedFile) {
    error.value = ''
    validateMedia(requirements, selectedFile, mediaValid)
  }
}
</script>

<style lang="postcss" scoped>
.upload {
  margin-top: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}
button {
  margin-top: 16px;
}
.error {
  margin-top: 8px;
  color: red;
}
.image-upload-wrap {
  display: flex;
  justify-content: center;
}
</style>
