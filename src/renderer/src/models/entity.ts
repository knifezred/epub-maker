export interface TocModel {
  title: string
  index: number
  text: string
}

export interface ZipFile {
  fileName: string
  fileContent: string
  encode: BufferEncoding
}
