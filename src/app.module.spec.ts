import path from 'path'
import supertest from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from './app.module'
import pathStore from './store/path-store'
import { IServerImageHandlerConfig } from './interface/i-server-image-handler-config'
import { FileFormat } from './enum/file-format'
import { ProcessData } from './util/process-data'
import { JobService } from './job/job.service'
import { JobProcessor } from './job/job.processor'

describe('AppModule', () => {
  let app: INestApplication
  let api: supertest.SuperTest<supertest.Test>
  let jobService: JobService
  let jobProcessor: JobProcessor
  let config: IServerImageHandlerConfig
  let moduleRef: TestingModule
  let jobServiceMock: any
  let jobProcessorMock: any

  beforeAll(async () => {
    jobServiceMock = {
      add: jest.fn(() => 1),
      removeById: jest.fn(),
      getAll: jest.fn(),
      getById: jest.fn(() => ({
        tempInputPath: 'temp-input',
        tempOutputPath: 'temp-output',
      })),
    }
    jobProcessorMock = {
      add: jest.fn(() => 1),
    }
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(JobService)
      .useValue(jobServiceMock)
      .overrideProvider(JobProcessor)
      .useValue(jobProcessorMock)
      .compile()

    app = moduleRef.createNestApplication()
    await app.init()
    api = supertest(app.getHttpServer())

    jobService = moduleRef.get<JobService>(JobService)
    jobProcessor = moduleRef.get<JobProcessor>(JobProcessor)
  })

  beforeEach(async () => {
    config = {
      inputFormat: FileFormat.jpeg,
      width: 48,
      height: 48,
    }
  })

  afterAll(async () => {
    await moduleRef.close()
  })

  it('GET /ping', async () => {
    const rsp = await api.get('/ping').expect(200)

    expect(rsp.text).toEqual('pong')
  })

  it('POST /job', async () => {
    // Create a job
    const rsp = await api
      .post('/job')
      .attach('file', path.resolve(pathStore.testAsset, 'wtm_256x256.jpeg'))
      .field('config', JSON.stringify(config))
      .expect(201)

    expect(rsp.text).toEqual('1')
    expect(jobServiceMock.add).toHaveBeenCalledTimes(1)
  })

  it('DELETE /job/:id', async () => {
    // Create a job
    const { text } = await api
      .post('/job')
      .attach('file', path.resolve(pathStore.testAsset, 'wtm_256x256.jpeg'))
      .field('config', JSON.stringify(config))
      .expect(201)

    // Delete the job
    await api.delete(`/job/${text}`).expect(204)

    expect(jobServiceMock.removeById).toHaveBeenCalledTimes(1)
  })

  it('GET /job', async () => {
    // Create a job
    const { text } = await api
      .post('/job')
      .attach('file', path.resolve(pathStore.testAsset, 'wtm_256x256.jpeg'))
      .field('config', JSON.stringify(config))
      .expect(201)

    // Get the job
    const { body } = await api.get(`/job/${text}`).expect(200)

    expect(jobServiceMock.getById).toHaveBeenCalledTimes(1)

    const job = body as ProcessData
    expect(job.tempOutputPath).toBeDefined()
  })
})
