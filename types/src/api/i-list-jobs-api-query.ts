export enum WorkerJobStatusEnum {
  Completed = 'completed',
  Waiting = 'waiting',
  Active = 'active',
  Delayed = 'delayed',
  Failed = 'failed',
  Paused = 'paused',
}

export class IListJobsApiQuery {
  types?: WorkerJobStatusEnum[]
  start?: number
  end?: number
  asc?: boolean
}
