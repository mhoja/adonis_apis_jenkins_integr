import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'
import User from 'App/Models/User'

export default class AuthController {
  public async login({ request, auth }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    try {
      const token = await auth.use('api').attempt(email, password, {
        expiresIn: '2 days',
      })

      return token.toJSON()
    } catch (error) {
      // Logger.error({ err: new Error(error) }, "User login failed");
      return error.message
    }
  }

  public async register({ request, auth }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')
    const first_name = request.input('first_name')
    const last_name = request.input('last_name')

    /**Creating new user
     */
    const New_user = new User()
    New_user.email = email
    New_user.password = password
    New_user.first_name = first_name
    New_user.last_name = last_name

    await New_user.save()
    Logger.info({ user: New_user.id }, 'New User register successfully')

    try {
      const token = await auth.use('api').attempt(email, password, {
        expiresIn: '2 days',
      })

      Logger.info({ user: New_user.id }, 'User login successfully')
      return token.toJSON()
    } catch (error) {
      // Logger.error({ err: new Error(error) }, "User register failed");
      return error.message
    }
  }
}
