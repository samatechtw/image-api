import FormData from 'form-data'
import fetch from 'node-fetch'
import { readFile } from 'node:fs/promises'
import path from 'path'
import {
  EnumFileFormat,
  EnumOptimizationAlgorithm,
  IJobData,
  ProcessJobStatusEnum,
} from '@samatech/image-api-types'
import { apiConfig } from '../src/config'

describe('api', () => {
  let apiHost: string
  let testAsset: string
  let authHeaders: Record<string, string>

  beforeEach(() => {
    apiHost = apiConfig.get('url')
    testAsset = path.resolve(__dirname, '../../tools/test-assets')
    const imageApiKey = apiConfig.get('imageApiKey')
    authHeaders = {
      'X-IMAGE-API-KEY': imageApiKey,
    }
  })

  it('GET /ping', async () => {
    const fetched = await fetch(`${apiHost}/ping`)
    const text = await fetched.text()

    expect(fetched.status).toEqual(200)
    expect(text).toEqual('pong')
  })

  describe('test valid request with jpeg', () => {
    let jpegFormData: FormData

    beforeEach(async () => {
      const fileBuffer = await readFile(path.resolve(testAsset, 'wtm_256x256.jpg'))
      jpegFormData = new FormData()
      jpegFormData.append('file', fileBuffer, {
        contentType: 'image/jpg',
        filename: 'wtm_256x256.jpg',
      })
    })

    it('POST /jobs convert format', async () => {
      jpegFormData.append('inputFormat', EnumFileFormat.jpg)
      jpegFormData.append('outputFormat', EnumFileFormat.png)

      const fetched = await fetch(`${apiHost}/jobs`, {
        method: 'POST',
        body: jpegFormData,
        headers: authHeaders,
      })
      const json = await fetched.json()
      const jobId = parseInt(json['jobId'])

      expect(fetched.status).toEqual(201)
      expect(jobId).toBeGreaterThan(0)
      expect(jobId).toBeLessThan(1000)
    })

    it('POST /jobs resize', async () => {
      jpegFormData.append('inputFormat', EnumFileFormat.jpg)
      jpegFormData.append('width', 128)
      jpegFormData.append('height', 128)

      const fetched = await fetch(`${apiHost}/jobs`, {
        method: 'POST',
        body: jpegFormData,
        headers: authHeaders,
      })
      const json = await fetched.json()
      const jobId = parseInt(json['jobId'])

      expect(fetched.status).toEqual(201)
      expect(jobId).toBeGreaterThan(0)
      expect(jobId).toBeLessThan(1000)
    })

    it('POST /jobs optimize', async () => {
      jpegFormData.append('inputFormat', EnumFileFormat.jpg)
      jpegFormData.append('optimizeAlgo', EnumOptimizationAlgorithm.mozjpeg)
      jpegFormData.append('quality', 90)

      const fetched = await fetch(`${apiHost}/jobs`, {
        method: 'POST',
        body: jpegFormData,
        headers: authHeaders,
      })
      const json = await fetched.json()
      const jobId = parseInt(json['jobId'])

      expect(fetched.status).toEqual(201)
      expect(jobId).toBeGreaterThan(0)
      expect(jobId).toBeLessThan(1000)
    })

    it('POST /jobs upload to url', async () => {
      // TODO
    })

    it('GET /jobs all jobs', async () => {
      // todo: wait api impl
    })

    it('GET /jobs with job id', async () => {
      jpegFormData.append('inputFormat', EnumFileFormat.jpg)
      jpegFormData.append('optimizeAlgo', EnumOptimizationAlgorithm.mozjpeg)
      jpegFormData.append('quality', 90)

      const fetchedPost = await fetch(`${apiHost}/jobs`, {
        method: 'POST',
        body: jpegFormData,
        headers: authHeaders,
      })
      const jsonPost = await fetchedPost.json()
      const jobId = parseInt(jsonPost['jobId'])

      await new Promise((resolve) => setTimeout(resolve, 1000))

      const fetchedGet = await fetch(`${apiHost}/jobs/${jobId}`, { headers: authHeaders })
      const jsonGet: IJobData = await fetchedGet.json()

      expect(jsonGet.status).toEqual(ProcessJobStatusEnum.Complete)
    })
  })
})
