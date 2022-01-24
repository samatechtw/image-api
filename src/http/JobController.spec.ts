import JobController from './JobController'
import JobService from './JobService'

describe('JobController', () => {
  let jobService = null
  let jobController: JobController = null

  beforeEach(async () => {
    jobService = new JobService()
    jobController = new JobController(jobService)
  })

  it('constructor()', async () => {
    expect(jobController).toBeInstanceOf(JobController)
  })

  it('add()', async () => {})
})
