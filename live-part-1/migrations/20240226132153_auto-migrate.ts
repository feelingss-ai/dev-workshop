import { Knex } from 'knex'

// prettier-ignore
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user', table => {
    table.renameColumn('nickanme', 'nickname')
  })
}

// prettier-ignore
export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user', table => {
    table.renameColumn('nickname', 'nickanme')
  })
}
