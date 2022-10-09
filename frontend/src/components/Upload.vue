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
import { EnumFileFormat, EnumOptimizationAlgorithm } from '@samatech/image-api-types'
import { validateMedia, MediaRequirements, ValidatedFile } from '../utils/validate-media'
import UploadFile from './UploadFile.vue'
import Actions from './Actions.vue'
import { useJobs } from './use-jobs'

const file = ref()
const error = ref()
const { createJob } = useJobs()

const requirements: MediaRequirements = {
  ext: ['jpg', 'jpeg', 'png'],
  size: 20000000000,
}

const handleMedia = async (validFile: ValidatedFile, errors: string[] | null) => {
  if (errors && errors.length) {
    error.value = errors[0]
  } else {
    file.value = validFile
    await createJob(validFile.file, {
      inputFormat: EnumFileFormat.jpg,
      outputFormat: EnumFileFormat.png,
      optimizeAlgo: EnumOptimizationAlgorithm.pngquant,
      width: 64,
      height: 64,
      // optimizeAlgo: EnumOptimizationAlgorithm
      // quality?: number;
      // uploadUrl?: string;
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
