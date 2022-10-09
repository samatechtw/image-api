<template>
  <div class="job-list" v-if="jobs.length">
    <div class="job-list-title">History</div>
    <div v-for="job in jobs" :key="job.id" class="job-row">
      <div class="job-id">
        {{ job.jobId }}
      </div>
      <div class="job-name">
        {{ job.config.inputFormat }} -> {{ job.config.outputFormat }}
      </div>
      <div class="job-status">
        {{ job.status }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useJobs } from './use-jobs'

const { jobs, listJobs } = useJobs()

onMounted(() => {
  listJobs()
})
</script>

<style lang="postcss">
.job-list {
  width: 100%;
  margin-top: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .job-list-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 16px;
  }
  .job-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 12px 4px;
    border-top: 1px solid black;
    width: 400px;
    max-width: 100%;
    &:last-child {
      border-bottom: 1px solid black;
    }
  }
}
</style>
