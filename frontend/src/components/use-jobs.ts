import { computed, ref, Ref } from 'vue'
import {
  ICreateJobApiRequest,
  IJobData,
  IListJobsApiQuery,
  ProcessJobStatusEnum,
} from '@samatech/image-api-types'
import { useImageApi } from '../api-image'

export interface IUseJobs {
  jobs: Ref<IJobData[]>
  createJob: (file: Blob, payload: ICreateJobApiRequest) => Promise<void>
  listJobs: (query?: IListJobsApiQuery) => Promise<void>
  pollJobs: () => Promise<void>
}

const sleep = (waitTimeInMs: number) =>
  new Promise((resolve) => setTimeout(resolve, waitTimeInMs))

const jobStatusDone = [ProcessJobStatusEnum.Fail, ProcessJobStatusEnum.Complete]

const jobs: Ref<IJobData[]> = ref([])

const latestPendingJob = computed(() => {
  const pending = jobs.value
    .filter((job) => !jobStatusDone.includes(job.status))
    .sort((a, b) => ((a.jobId ?? 0) < (b.jobId ?? 0) ? -1 : 1))
  return pending[0]
})

export const useJobs = (): IUseJobs => {
  const api = useImageApi()

  const createJob = async (file: Blob, payload: ICreateJobApiRequest): Promise<void> => {
    try {
      await api.postJob(file, payload)
      return pollJobs()
    } catch (e) {
      console.log('Failed to create job' + e)
    }
  }

  const listJobs = async (query?: IListJobsApiQuery) => {
    try {
      jobs.value = await api.listJobs(query ?? {})
    } catch (e) {
      console.log('Failed to get jobs' + e)
    }
  }

  const pollJobs = async (): Promise<void> => {
    await listJobs()
    if (!latestPendingJob.value?.jobId) {
      return
    }
    let maxRetries = 50
    while (maxRetries > 0) {
      await sleep(2000)
      const job = await api.getJob(latestPendingJob.value.jobId)
      if (jobStatusDone.includes(job.status)) {
        return listJobs()
      }
      maxRetries -= 1
    }
    throw new Error('Poll job timeout')
  }

  return {
    jobs,
    createJob,
    listJobs,
    pollJobs,
  }
}
