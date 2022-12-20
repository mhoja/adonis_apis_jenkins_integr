import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class BbActivationCode extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public activation_code: String
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
  @column()
  public sent_time: DateTime
  @column()
  public received_amount: number
  @column()
  public given_point: number
  @column()
  public description: string
  @column()
  public reason: string
  @column()
  public input_by: string
  @column()
  public ref_trx_id: number
  @column()
  public status: boolean
  @column()
  public customer_id: number
  @column()
  public user_id: number
}
