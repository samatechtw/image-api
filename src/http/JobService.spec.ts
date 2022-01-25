import JobService from './JobService'

describe('JobService', () => {
  let jobService: JobService = null

  beforeEach(async () => {
    jobService = new JobService()
  })

  it('constructor()', async () => {
    expect(jobService).toBeInstanceOf(JobService)
  })
})
