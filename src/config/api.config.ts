import convict from 'convict'

export const apiConfig = convict({
  port: {
    format: 'port',
    default: 3500,
    env: 'API_PORT',
  },
  url: {
    doc: 'API URL',
    format: String,
    default: 'http://localhost:3500',
    env: 'API_URL',
  },
  authorizedReferrers: {
    format: String,
    doc: 'List of authorized referrers allowed to access the service',
    env: 'API_AUTHORIZED_REFERRERS',
    // Default empty string bypasses CORS
    default: '',
  },
  imageApiKey: {
    format: String,
    doc: 'API key to access protected endpoints',
    env: 'IMAGE_API_KEY',
    default: 'dev-image-api-key',
  },
})
