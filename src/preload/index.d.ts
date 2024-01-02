import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: WindowApi
  }
}

export declare interface ZipFile {
  fileName: string
  fileContent: string
  encode: BufferEncoding
}

export declare interface WindowApi {
  pathJoin(...paths: string[])
  readFileSync(path: string, encoding: BufferEncoding)
  // 获取绝对路径
  getAbsolutePath(path: string)
  createZip(files: ZipFile[], outFileName: string)
}
