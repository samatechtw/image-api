import convict from 'convict'

export const apiConfig = convict({
  port: {
    format: 'port',
    default: 4100,
    env: 'IMAGE_API_PORT',
  },
  url: {
    doc: 'API URL',
    format: String,
    default: 'http://localhost',
    env: 'IMAGE_API_URL',
  },
  authorizedReferrers: {
    format: String,
    doc: 'Comma separated list of authorized referrers allowed to access the API',
    env: 'API_AUTHORIZED_REFERRERS',
    default: 'http://localhost:3100,http://localhost:8000',
  },
  redisHost: {
    doc: 'Redis host',
    format: String,
    default: '127.0.0.1',
    env: 'IMAGE_API_REDIS_HOST',
  },
  redisPort: {
    doc: 'Redis port',
    format: Number,
    default: 6379,
    env: 'IMAGE_API_REDIS_PORT',
  },
  imageApiKey: {
    format: String,
    doc: 'API key to access protected endpoints',
    env: 'IMAGE_API_KEY',
    default: 'dev-image-api-key',
  },
})
