import { proxySchema } from 'better-sqlite3-proxy'
import { db } from './db'

export type User = {
  id?: null | number
  nickname: string
}

export type DBProxy = {
  user: User[]
}

export let proxy = proxySchema<DBProxy>({
  db,
  tableFields: {
    user: [],
  },
})
