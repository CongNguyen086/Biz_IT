import Api from '../api'

class AppRepo {
  static async getContactList(listPhones) {
    try {
      const { data: { contactList } } = await Api({
        method: 'post',
        url: '/user/contact',
        body: {
          phoneList: listPhones
        }
      })

      return contactList;
    }
    catch(e) {
      console.log("AppRepo -> e?.response", e?.response.data)
      throw new Error(e?.response?.data?.message);
    }
  }
}

export default AppRepo;
