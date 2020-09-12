import Api from '../api'

class UserRepo {
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