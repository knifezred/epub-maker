import { defineStore } from 'pinia'
import { store } from '../index'
import projectSetting from '@renderer/settings/projectSetting'
import { useDbStore } from './db'
import { Archive } from '@renderer/data/entities'

interface AppState {
  darkMode?: boolean
}
export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    darkMode: projectSetting.darkMode
  }),
  actions: {
    // 保存存档
    setSaveData(archive: Archive): void {
      const dbStore = useDbStore()
      dbStore.getDb.archives.put(archive)
    },
    // 读取存档
    async loadSaveData(key: string): Promise<Archive> {
      const dbStore = useDbStore()
      let archive = await dbStore.getDb.archives.get({ key: key })
      if (archive == undefined) {
        archive = {
          key
        } as Archive
      }
      return archive
    }
  }
})

export function useAppStoreWithOut() {
  return useAppStore(store)
}
