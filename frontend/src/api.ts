import {
  FetchApi,
  FetchRequestConfig,
  IJsonObject,
  transformRequestParams,
} from '@sampullman/fetch-api'
import { formatISO } from 'date-fns'
import { format, utcToZonedTime } from 'date-fns-tz'
import { computed, ComputedRef } from 'vue'

export interface ImageApiOptions {
  baseUrl: string
  apiKey: ComputedRef<string | null>
  responseInterceptors?: ((res: Response) => Promise<ApiResponse>)[]
}

export class ApiResponse extends Response {
  data!: IJsonObject
}

// See https://www.npmjs.com/package/date-fns-tz#time-zone-formatting
const formatInTimeZone = (date: Date, fmt: string, tz: string) =>
  format(utcToZonedTime(date, tz), fmt, { timeZone: tz })

export function date2str(date: Date, timezone?: string): string {
  if (timezone) {
    return formatInTimeZone(date, "yyyy-MM-dd'T'HH:mm:ssxxx", timezone)
  }
  return formatISO(date)
}

const transformApiDate = (date: Date): string => {
  return date2str(date, 'UTC')
}

// Convert request payload types to JSON
const transformRequestData = (
  data?: Record<string, unknown>,
): Record<string, unknown> | undefined => {
  if (!data) {
    return undefined
  }
  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Date) {
      data[key] = transformApiDate(value)
    }
  }
  return data
}

export class ImageApi extends FetchApi<ApiResponse> {
  apiKey: ComputedRef<string | null>

  constructor(options: ImageApiOptions) {
    const responseInterceptors = [...(options.responseInterceptors ?? [])]
    super({
      ...options,
      responseInterceptors,
    })
    this.apiKey = options.apiKey
  }

  authRequest(config: FetchRequestConfig): Promise<ApiResponse> {
    const { headers, ...rest } = config
    return this.request({
      ...rest,
      headers: {
        ...headers,
        'X-IMAGE-API-KEY': this.apiKey.value || '',
      },
    })
  }

  override async request(config: FetchRequestConfig): Promise<ApiResponse> {
    const finalConfig: FetchRequestConfig = {
      ...config,
      params: transformRequestParams(config.params),
      data: transformRequestData(config.data as Record<string, unknown>),
      mode: 'cors',
    }
    return super.request(finalConfig)
  }
}

export const api = new ImageApi({
  baseUrl: 'http://localhost:3500/',
  apiKey: computed(() => 'dev-image-api-key'),
  responseInterceptors: [
    async (res: Response): Promise<ApiResponse> => {
      if (!res) {
        throw new Error('NETWORK_FAILURE')
      }
      const { status } = res

      if (status >= 500) {
        throw new Error('NETWORK_FAILURE')
      } else if (status === 403) {
        // Permission denied
        throw res
      }
      let data: IJsonObject
      try {
        data = await res.json()
      } catch (_e) {
        // Avoid crashing on empty response
        data = {}
      }

      if (status === 400 || status === 404) {
        throw data
      }
      const apiRes = res as ApiResponse
      apiRes.data = data
      return apiRes
    },
  ],
})
