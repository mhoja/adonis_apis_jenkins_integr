import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BbActivationCode from '../../Models/BbActivationCode'
import Database from '@ioc:Adonis/Lucid/Database'

export default class ActivationCodesController {
  /**function to generate and return rondam activation codes */
  private generateActivationCode(length: Number) {
    let source = '0123456789'
    let result = ''
    const codeLength = source.length
    for (let i = 0; i < length; i++) {
      if (i == 5) {
        result += `-${source.charAt(Math.floor(Math.random() * codeLength))}`
      } else {
        result += source.charAt(Math.floor(Math.random() * codeLength))
      }
    }
    return result
  }

  public async createActivationCode({ request, logger, response }: HttpContextContract) {
    //const activation_code = request.input('activation_code' || 'result')
    const received_amount = request.input('received_amount')
    const given_point = request.input('given_point')
    const description = request.input('description')
    const reason = request.input('reason')
    const input_by = request.input('input_by')
    const ref_trx_id = request.input('ref_trx_id')
    const status = request.input('status')
    const customer_id = request.input('customer_id')
    const user_id = request.input('user_id')
    const sent_time = request.input('sent_time')

    /**
     * create activation code
     */
    try {
      const NewCode = new BbActivationCode()
      NewCode.activation_code = this.generateActivationCode(10)
      NewCode.received_amount = received_amount
      NewCode.given_point = given_point
      NewCode.description = description
      NewCode.reason = reason
      NewCode.ref_trx_id = ref_trx_id
      NewCode.status = status
      NewCode.input_by = input_by
      NewCode.customer_id = customer_id
      NewCode.user_id = user_id
      NewCode.sent_time = sent_time

      await NewCode.save()
      logger.info(`registration code with id: ${NewCode.id} created successfully `)
      return response.json({ NewCode })
    } catch (error) {
      console.log(error)
    }
  }

  /**function to get customers with activation code */
  public async getcustomersWithActivationCode() {
    /**Query bulder to join two tables bb_activation_codes and bb_customers */
    const join_result = await Database.from('bb_customers as a')
      .innerJoin('bb_activation_codes as b', 'a.id', 'b.customer_id')
      .orderBy('b.id', 'asc')
    return join_result
  }
/**Functin block to update customer token(wassha_token in bb_customers table) */
  public async updateToken(customer_id, token) {
    await Database.from('bb_customers')
    .where('id',customer_id)
    .update('wassha_token', token)
   
  }

  /**function to check request and uptate token to user */
  public async registerToken({ request, response}: HttpContextContract) {
    const result = await this.getcustomersWithActivationCode()

    let params = {
      primary_phone: request.input('primary_phone'),
      activation_code: request.input('activation_code'),
    }

    let token = request.headers().token;


    let arrayLength = result.length;
    for (let i = 0; i < arrayLength; i++) {
      if (params.primary_phone == result[i].primary_phone
        && params.activation_code == result[i].activation_code
        && result[i].status == true) {
        /**function call to update token */
        await this.updateToken(result[i].customer_id,token)
       /**Code block to return formatted response to client */
        return response.status(200).json({
          OK: {
            status: "OK",
            agent_id: result[i].customer_id,
            request_date: new Date(),
            mobile_number: result[i].primary_phone
          }
        })

      }
      else {
        return response.status(500).json({
          NG: {
            status: "NG",
            request_date: new Date()
          }
        }
        )

      }
    }
  }
}
