import fetch from 'node-fetch'

export const uploadBufferToUrl = async (url: string, buffer: Buffer): Promise<void> => {
  await fetch(url, {
    method: 'PUT',
    body: buffer,
  })
}
