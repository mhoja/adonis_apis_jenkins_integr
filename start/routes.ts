/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Database from '@ioc:Adonis/Lucid/Database'
import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('customers', async ({ request }) => {
    const limit = 200
    const page = request.input('page', 1)

    return Database.from('bb_customers').select('*').orderBy('id', 'asc').paginate(page, limit)
  })
  Route.post('register', 'AuthController.register')
  Route.post('login', 'AuthController.login')
  Route.post('activation-code', 'ActivationCodesController.createActivationCode')
  Route.get('check_activation_code', 'ActivationCodesController.getcustomersWithActivationCode')
  Route.post('token/register', 'ActivationCodesController.registerToken')

  Route.group(() => {
    Route.resource('customer', 'BbCustomersController').apiOnly()
  }).middleware('auth:api')
 
}).prefix('api/v1/')
