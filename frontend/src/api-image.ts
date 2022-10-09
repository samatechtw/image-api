import {
  ICreateJobApiResponse,
  IGetJobApiResponse,
  IImageJobConfig,
  IListJobsApiQuery,
  IListJobsApiResponse,
} from '@samatech/image-api-types'
import { RequestParams } from '@sampullman/fetch-api'
import { api } from './api'

export interface IApiImage {
  getJob(jobId: number): Promise<IGetJobApiResponse>
  listJobs: (payload: IListJobsApiQuery) => Promise<IListJobsApiResponse>
  postJob: (file: Blob, payload: IImageJobConfig) => Promise<ICreateJobApiResponse>
  deleteJob: (jobId: string) => Promise<void>
}

export const useImageApi = (): IApiImage => {
  const getJob = async (jobId: number): Promise<IGetJobApiResponse> => {
    const { data } = await api.authRequest({
      url: `jobs/${jobId}`,
    })
    return data as unknown as IGetJobApiResponse
  }

  const listJobs = async (query: IListJobsApiQuery): Promise<IListJobsApiResponse> => {
    const response = await api.authRequest({
      url: 'jobs',
      params: query as unknown as RequestParams,
    })
    console.log(response.body, response.data)
    return response.data as unknown as IListJobsApiResponse
  }

  const postJob = async (
    file: Blob,
    payload: IImageJobConfig,
  ): Promise<ICreateJobApiResponse> => {
    const formData = new FormData()
    formData.append('file', file)
    for (const [key, value] of Object.entries(payload)) {
      formData.append(key, value)
    }
    // FIX: allow FormData in fetch-api
    /*
    const { data } = await api.authRequest({
      url: 'jobs',
      method: 'POST',
      data: formData,
    })
    */
    const response = await fetch('http://localhost:3500/jobs', {
      method: 'POST',
      body: formData,
      headers: { 'X-IMAGE-API-KEY': api.apiKey.value || '' },
    })
    const data = await response.json()
    console.log('postJob response', data)
    return data as unknown as ICreateJobApiResponse
  }

  const deleteJob = async (jobId: string): Promise<void> => {
    await api.authRequest({
      url: `jobs/${jobId}`,
      method: 'DELETE',
    })
  }

  return {
    getJob,
    listJobs,
    postJob,
    deleteJob,
  }
}
