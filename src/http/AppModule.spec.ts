import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import AppModule from './AppModule'
import fetch from 'node-fetch'
import FormData from 'form-data'
import { readFile } from 'node:fs/promises'
import pathStore from '../../pathStore'
import path from 'path'
import IServerImageHandlerConfig from '../Interface/IServerImageHandlerConfig'
import EnumFileFormat from '../Enum/EnumFileFormat'

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

  it('POST /job', async () => {
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

    expect(fetched.ok).toEqual(true)
    expect(fetched.status).toEqual(201)
    expect(typeof parseInt(text)).toEqual('number')
  })
})
