import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import AppModule from './AppModule'
import fetch from 'node-fetch'
import FormData from 'form-data'

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
    formData.append('foo', 'bar')
    formData.append('file', 'hi')
    const fetched = await fetch('http://localhost:3001/job', {
      method: 'post',
      body: formData,
    })

    expect(fetched.ok).toEqual(true)
    expect(fetched.status).toEqual(200)
  })
})
