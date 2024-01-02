import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import fs from 'fs'
import path from 'path'
import AdmZip from 'adm-zip'

// Custom APIs for renderer
const api = {
  getAbsolutePath: (target: string) => {
    return path.join(path.resolve(), target)
  },
  pathJoin: (paths: string[]) => {
    return path.join(...paths)
  },
  readFileSync: (path: string, encoding: BufferEncoding) => {
    return fs.readFileSync(path, encoding)
  },
  createZip: (files: ZipFile[], outFileName: string) => {
    const zip = new AdmZip()
    files.forEach((element) => {
      zip.addFile(element.fileName, Buffer.from(element.fileContent, element.encode))
    })
    zip.writeZip(outFileName)
    console.log('zip ok' + outFileName)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('Buffer', Buffer)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
  window.Buffer = Buffer
}
