import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import AppModule from './AppModule'
import fetch, { Response } from 'node-fetch'
import FormData from 'form-data'
import { readFile } from 'node:fs/promises'
import pathStore from '../store/pathStore'
import path from 'path'
import IServerImageHandlerConfig from '../Interface/IServerImageHandlerConfig'
import EnumFileFormat from '../Enum/EnumFileFormat'
import ProcessData from '../Klass/ProcessData'

describe('AppModule', () => {
  let app: INestApplication

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = module.createNestApplication()
    await app.init()
    await app.listen('3001')
  })

  afterAll(async () => {
    await app.close()
  })

  it('GET /ping', async () => {
    const fetched = await fetch('http://localhost:3001/ping')
    const text = await fetched.text()

    expect(fetched.ok).toEqual(true)
    expect(fetched.status).toEqual(200)
    expect(text).toEqual('pong')
  })

  const doPost = async (): Promise<[Response, number]> => {
    const formData = new FormData()
    const fileBuffer = await readFile(
      path.resolve(pathStore.testAsset, 'wtm_256x256.jpeg'),
    )
    formData.append('file', fileBuffer, {
      contentType: 'image/jpeg',
      filename: 'wtm_256x256.jpeg',
    })
    const config: IServerImageHandlerConfig = {
      inputFormat: EnumFileFormat.jpeg,
      width: 48,
      height: 48,
    }
    formData.append('config', JSON.stringify(config))

    const fetched = await fetch('http://localhost:3001/job', {
      method: 'post',
      body: formData,
    })
    const text = await fetched.text()
    const jobId = parseInt(text)

    return [fetched, jobId]
  }

  it('POST /job', async () => {
    const [fetched, jobId] = await doPost()

    expect(fetched.ok).toEqual(true)
    expect(fetched.status).toEqual(201)
    expect(typeof jobId).toEqual('number')
  })

  it('DELETE /job/:id', async () => {
    const [fetchedPost, jobId] = await doPost()
    const fetchedDelete = await fetch(`http://localhost:3001/job/${jobId}`, {
      method: 'delete',
    })

    expect(fetchedDelete.ok).toEqual(true)
    expect(fetchedDelete.status).toEqual(204)
  })

  it('GET /job', async () => {
    const [fetchedPost, jobId] = await doPost()
  })

  it('GET /job/:id', async () => {
    const [fetchedPost, jobId] = await doPost()
    const fetchedGet = await fetch(`http://localhost:3001/job/${jobId}`)
    const processData = (await fetchedGet.json()) as ProcessData

    expect(processData.tempOutputPath).toBeDefined()
  })
})
