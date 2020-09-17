import Api from '../api'

class AppRepo {
  static async getContactList() {
    try {
      const { data: { phoneList } } = await Api({
        method: 'get',
        url: '/user/contact',
      })

      return phoneList;
    }
    catch(e) {
      throw new Error(e?.response?.data?.message);
    }
  }
}

export default AppRepo;
