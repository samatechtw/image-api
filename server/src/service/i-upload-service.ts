export interface IUploadService {
  /**
   * Check if url is suitable for this service.
   */
  matchUrl(url: string): boolean
  upload: (url: string, buffer: Buffer) => Promise<void>
}
