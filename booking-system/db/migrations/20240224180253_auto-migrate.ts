import { Knex } from 'knex'

// prettier-ignore
export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('timeslot'))) {
    await knex.schema.createTable('timeslot', table => {
      table.increments('id')
      table.text('date').notNullable()
      table.text('from_time').notNullable()
      table.text('to_time').notNullable()
      table.text('title').notNullable()
      table.timestamps(false, true)
    })
  }
}

// prettier-ignore
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('timeslot')
}
