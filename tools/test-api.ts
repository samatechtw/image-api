import FormData from 'form-data'
import fetch from 'node-fetch'
import { readFile } from 'node:fs/promises'
import path from 'path'
import {
  EnumFileFormat,
  EnumOptimizationAlgorithm,
  IGetJobApiResponse,
  ProcessJobStatusEnum,
} from '../types'

const dev = {
  host: 'http://localhost:4100',
  apiKey: 'dev-image-api-key',
}
const prod = {
  host: 'http://image.samatech.tw:4100',
  apiKey: '949a922c-f039-43fd-b015-8398218a9b24',
}
const env = prod
const testAsset = path.resolve(__dirname, './test-assets/Rufina.jpg')
const authHeaders = {
  'X-IMAGE-API-KEY': env.apiKey,
}

const optimize = async () => {
  const fileBuffer = await readFile(testAsset)
  const formData = new FormData()
  formData.append('file', fileBuffer, 'Rufina.jpg')

  formData.append('inputFormat', EnumFileFormat.jpg)
  formData.append('optimizeAlgo', EnumOptimizationAlgorithm.mozjpeg)
  formData.append('quality', '80')

  const createRes = await fetch(`${env.host}/jobs`, {
    method: 'POST',
    body: formData,
    headers: authHeaders,
  })
  const json = await createRes.json()

  console.log('Created:', json)

  const startTime = Date.now()
  let time = startTime
  let data: IGetJobApiResponse
  while (time - startTime < 10000) {
    const res = await fetch(`${env.host}/jobs/${json.jobId}`, {
      method: 'GET',
      headers: authHeaders,
    })
    data = (await res.json()) as IGetJobApiResponse
    const { status } = data
    if (status === ProcessJobStatusEnum.Fail) {
      console.log('Success:', data)
      break
    } else if (status === ProcessJobStatusEnum.Complete) {
      console.log('Fail:', data)
      break
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1500))
    }
    time = Date.now()
  }
}

optimize()
