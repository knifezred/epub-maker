import Dexie, { Table } from 'dexie'

export interface Archive {
  id?: number
  key: string
  value: string
}

export class DbDexie extends Dexie {
  archives!: Table<Archive>

  constructor(dbName: string) {
    super(dbName)
    this.version(5).stores({
      archives: 'id++, key, value'
    })
  }
}

export function connDb(dbName: string): DbDexie {
  const db = new DbDexie(dbName)
  db.archives.put({
    key: '',
    value: ''
  })
  return db
}
