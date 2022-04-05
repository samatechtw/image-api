import convict from 'convict'

export const awsConfig = convict({
  // TODO -- may not be needed if we only implement asset forwarding, not custom S3 bucket uploads
  awsS3Key: {
    format: String,
    doc: 'AWS S3 access key',
    env: 'S3_KEY',
    default: '',
  },
})
