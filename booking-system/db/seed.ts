import { seedRow } from 'better-sqlite3-proxy'
import { proxy } from './proxy'

// This file serve like the knex seed file.
//
// You can setup the database with initial config and sample data via the db proxy.

proxy.timeslot[1] = {
  date: '2024-02-26',
  from_time: '19:00',
  to_time: '21:30',
  title: 'Dev Workshop',
}
