import Api from '../api'

class UserRepo {
  static async register({
    fullName,
    phone,
    password
  }) {
    const { data } = await Api({
      method: 'post',
      url: '/user/register',
      body: {
        fullName,
        phone,
        password,
      }
    })

    return data
  }

  static async loginWithPhone({
    phoneNumber,
    password
  }) {
    const { data } = await Api({
      method: 'get',
      url: '/login',
      params: {
        phone: phoneNumber,
        password,
      }
    })

    return data
  }
}

export default UserRepo