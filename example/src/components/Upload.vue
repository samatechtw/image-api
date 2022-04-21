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
import { WebImageHandler } from '../../../out-tsc/browser/web-image-handler'
import { EnumFileFormat } from '../../../out-tsc/enum'

const imageHandler = new WebImageHandler()

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

const handleMedia = async (validFile: ValidatedFile, errors: string[] | null) => {
  if (errors && errors.length) {
    error.value = errors[0]
  } else {
    file.value = validFile
    const buffer = await validFile.file.arrayBuffer()

    const fileArr = new Uint8Array(buffer)
    // perform all required operations with x here.
    // imageApi.
    // const result = imageApi.convert(fileArr, 'jpg')
    // console.log(result)
    await imageHandler.handleBuffer(fileArr, {
      inputFormat: EnumFileFormat.jpg,
      outputFormat: EnumFileFormat.png,
      // width: 64,
      // height: 64,
    })
  }
}

const handleFileSelect = async (selectedFile: File) => {
  if (selectedFile) {
    error.value = ''
    const { file, errors } = await validateMedia(requirements, selectedFile)
    await handleMedia(file, errors)
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
