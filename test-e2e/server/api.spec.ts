import fetch from 'node-fetch'
import { IServerImageHandlerConfig } from '../../src/interface/i-server-image-handler-config'
import { EnumFileFormat } from '../../src/enum/enum-file-format'
import { readFile } from 'node:fs/promises'
import pathStore from '../../src/store/path-store'
import path from 'path'
import FormData from 'form-data'
import { EnumOptimizationAlgorithm } from '../../src/enum/enum-optimization-algorithm'
import jobService from '../../src/service/job-service'
import { ProcessData } from '../../src/klass/process-data'
import { EnumProcessJobStatus } from '../../src/enum/enum-process-job-status'
import workerService from '../../src/service/worker-service'

describe('api', () => {
  const apiHost = 'http://localhost:3500'

  it('GET /ping', async () => {
    const fetched = await fetch(`${apiHost}/ping`)
    const text = await fetched.text()

    expect(fetched.ok).toEqual(true)
    expect(text).toEqual('pong')
  })

  it('POST /jobs convert format', async () => {
    const fileBuffer = await readFile(
      path.resolve(pathStore.testAsset, 'wtm_256x256.jpg'),
    )
    const config: IServerImageHandlerConfig = {
      inputFormat: EnumFileFormat.jpg,
      outputFormat: EnumFileFormat.png,
    }
    const formData = new FormData()
    formData.append('file', fileBuffer, {
      contentType: 'image/jpg',
      filename: 'wtm_256x256.jpg',
    })
    formData.append('config', JSON.stringify(config))
    const fetched = await fetch(`${apiHost}/jobs`, {
      method: 'post',
      body: formData,
    })
    const json = await fetched.json()
    const jobId = parseInt(json['jobId'])

    expect(fetched.ok).toEqual(true)
    expect(jobId).toBeGreaterThan(0)
    expect(jobId).toBeLessThan(1000)
  })

  it('POST /jobs resize', async () => {
    const fileBuffer = await readFile(
      path.resolve(pathStore.testAsset, 'wtm_256x256.jpg'),
    )
    const config: IServerImageHandlerConfig = {
      inputFormat: EnumFileFormat.jpg,
      width: 128,
      height: 128,
    }
    const formData = new FormData()
    formData.append('file', fileBuffer, {
      contentType: 'image/jpg',
      filename: 'wtm_256x256.jpg',
    })
    formData.append('config', JSON.stringify(config))
    const fetched = await fetch(`${apiHost}/jobs`, {
      method: 'post',
      body: formData,
    })
    const json = await fetched.json()
    const jobId = parseInt(json['jobId'])

    expect(fetched.ok).toEqual(true)
    expect(jobId).toBeGreaterThan(0)
    expect(jobId).toBeLessThan(1000)
  })

  it('POST /jobs optimize', async () => {
    const fileBuffer = await readFile(
      path.resolve(pathStore.testAsset, 'wtm_256x256.jpg'),
    )
    const config: IServerImageHandlerConfig = {
      inputFormat: EnumFileFormat.jpg,
      optimizeAlgo: EnumOptimizationAlgorithm.mozjpeg,
      quality: 90,
    }
    const formData = new FormData()
    formData.append('file', fileBuffer, {
      contentType: 'image/jpg',
      filename: 'wtm_256x256.jpg',
    })
    formData.append('config', JSON.stringify(config))
    const fetched = await fetch(`${apiHost}/jobs`, {
      method: 'post',
      body: formData,
    })
    const json = await fetched.json()
    const jobId = parseInt(json['jobId'])

    expect(fetched.ok).toEqual(true)
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
    const fileBuffer = await readFile(
      path.resolve(pathStore.testAsset, 'wtm_256x256.jpg'),
    )
    const config: IServerImageHandlerConfig = {
      inputFormat: EnumFileFormat.jpg,
      optimizeAlgo: EnumOptimizationAlgorithm.mozjpeg,
      quality: 90,
    }
    const formData = new FormData()
    formData.append('file', fileBuffer, {
      contentType: 'image/jpg',
      filename: 'wtm_256x256.jpg',
    })
    formData.append('config', JSON.stringify(config))
    const fetchedPost = await fetch(`${apiHost}/jobs`, {
      method: 'post',
      body: formData,
    })
    const jsonPost = await fetchedPost.json()
    const jobId = parseInt(jsonPost['jobId'])

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const fetchedGet = await fetch(`${apiHost}/jobs/${jobId}`)
    const jsonGet: ProcessData = await fetchedGet.json()

    expect(jsonGet.status).toEqual(EnumProcessJobStatus.complete)
  })
})
