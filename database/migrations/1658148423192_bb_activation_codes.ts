import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BbActivationCodes extends BaseSchema {
  protected tableName = 'bb_activation_codes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('activation_code')
      // table.timestamp('createdAt', { useTz: true })
      // table.timestamp('updatedAt', { useTz: true })
      // table.string('sent_time').nullable()
      table.integer('received_amount').notNullable()
      table.integer('given_point').notNullable()
      table.string('description').nullable()
      table.string('reason').nullable()
      table.string('input_by')
      table.integer('ref_trx_id')
      table.boolean('status').defaultTo(true)
      table.integer('customer_id')
      table.integer('user_id')
      table.timestamp('sent_time').defaultTo(this.now())

      table
        .foreign('user_id', 'fk_act_user_id')
        .references('id')
        .inTable('bb_users')
        .onDelete('cascade')
      table
        .foreign('customer_id', 'fk_act_customer_id')
        .references('id')
        .inTable('bb_customers')
        .onDelete('cascade')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
