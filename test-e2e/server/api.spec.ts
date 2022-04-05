import path from 'path'
import { readFile } from 'node:fs/promises'
import fetch from 'node-fetch'
import FormData from 'form-data'
import { IServerImageHandlerConfig } from '../../src/interface/i-server-image-handler-config'
import { ProcessData } from '../../src/helper'
import { pathUtil, apiConfig } from '../../src/config'
import { EnumFileFormat } from '../../src/enum/enum-file-format'
import { EnumOptimizationAlgorithm } from '../../src/enum/enum-optimization-algorithm'
import { EnumProcessJobStatus } from '../../src/enum/enum-process-job-status'

describe('api', () => {
  let apiHost: string
  let authHeaders: Record<string, string>

  beforeEach(() => {
    apiHost = apiConfig.get('url')
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
      const fileBuffer = await readFile(
        path.resolve(pathUtil.testAsset, 'wtm_256x256.jpg'),
      )
      jpegFormData = new FormData()
      jpegFormData.append('file', fileBuffer, {
        contentType: 'image/jpg',
        filename: 'wtm_256x256.jpg',
      })
    })

    it('POST /jobs convert format', async () => {
      const config: IServerImageHandlerConfig = {
        inputFormat: EnumFileFormat.jpg,
        outputFormat: EnumFileFormat.png,
      }
      jpegFormData.append('config', JSON.stringify(config))

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
      const config: IServerImageHandlerConfig = {
        inputFormat: EnumFileFormat.jpg,
        width: 128,
        height: 128,
      }
      jpegFormData.append('config', JSON.stringify(config))

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
      const config: IServerImageHandlerConfig = {
        inputFormat: EnumFileFormat.jpg,
        optimizeAlgo: EnumOptimizationAlgorithm.mozjpeg,
        quality: 90,
      }
      jpegFormData.append('config', JSON.stringify(config))

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

    it('POST /jobs upload to s3', async () => {
      // todo: wait for a real s3
    })

    it('GET /jobs all jobs', async () => {
      // todo: wait api impl
    })

    it('GET /jobs with job id', async () => {
      const config: IServerImageHandlerConfig = {
        inputFormat: EnumFileFormat.jpg,
        optimizeAlgo: EnumOptimizationAlgorithm.mozjpeg,
        quality: 90,
      }
      jpegFormData.append('config', JSON.stringify(config))

      const fetchedPost = await fetch(`${apiHost}/jobs`, {
        method: 'POST',
        body: jpegFormData,
        headers: authHeaders,
      })
      const jsonPost = await fetchedPost.json()
      const jobId = parseInt(jsonPost['jobId'])

      await new Promise((resolve) => setTimeout(resolve, 1000))

      const fetchedGet = await fetch(`${apiHost}/jobs/${jobId}`, { headers: authHeaders })
      const jsonGet: ProcessData = await fetchedGet.json()

      expect(jsonGet.status).toEqual(EnumProcessJobStatus.complete)
    })
  })
})
