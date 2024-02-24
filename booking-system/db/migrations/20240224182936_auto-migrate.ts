import { Knex } from 'knex'

// prettier-ignore
export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('appointment'))) {
    await knex.schema.createTable('appointment', table => {
      table.increments('id')
      table.integer('timeslot_id').unsigned().notNullable().references('timeslot.id')
      table.text('email').notNullable()
      table.text('name').notNullable()
      table.text('remark').notNullable()
      table.timestamps(false, true)
    })
  }
}

// prettier-ignore
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('appointment')
}
