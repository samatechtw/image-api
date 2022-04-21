export interface MediaRequirements {
  width?: number
  height?: number
  ext?: string[]
  size?: number
}

export interface ValidatedFile {
  file: File
  src?: string
}

interface ValidateMediaResult {
  file: ValidatedFile
  errors: string[] | null
}

export function validateMedia(
  requirements: MediaRequirements,
  file: File,
): Promise<ValidateMediaResult> {
  return new Promise((resolve) => {
    const errors: string[] = []
    const URL = window.URL || window.webkitURL
    let img: HTMLImageElement | null = null
    let video = null
    const result: ValidatedFile = { file }
    result.src = URL.createObjectURL(file)

    const { ext, size } = requirements
    const reqSize = size ?? 0
    if (file.size > reqSize) {
      errors.push('FILE_SIZE_BIG')
    }
    const fileExt = file.name.split('.').pop()
    if (ext && (!fileExt || !ext.includes(fileExt))) {
      errors.push('FILE_TYPE')
    }
    if (errors.length) {
      resolve({ file: result, errors })
    }

    try {
      const fileType = file.type || ''
      if (fileType.includes('image')) {
        img = new Image()
        img.src = result.src
      } else if (fileType.includes('vide')) {
        video = document.createElement('video')
        video.src = result.src
      }
    } catch (error) {
      errors.push('FILE_TYPE')
    }
    if (video) {
      video.addEventListener('loadeddata', (_e) => {
        resolve({ file: result, errors: null })
      })
    } else if (img) {
      img.onload = () => {
        const { width, height } = requirements
        if (width && height) {
          const minRatio = (width / height) * 0.95
          const maxRatio = (width / height) * 1.05
          const reqWidth = img?.width ?? 0
          const reqHeight = img?.height ?? 1
          const imageRatio = reqWidth / reqHeight
          if (imageRatio < minRatio || imageRatio > maxRatio) {
            errors.push('IMAGE_ASPECT_RATIO')
          }
          if (reqWidth < width || reqHeight < height) {
            errors.push('IMAGE_DIMENSIONS')
          }
        }
        if (errors.length) {
          resolve({ file: result, errors })
        } else {
          resolve({ file: result, errors: null })
        }
      }
    } else {
      resolve({ file: result, errors })
      return null
    }
  })
}
