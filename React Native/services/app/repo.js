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

  static async createAppointment({userId, storeIds, memberIds, eventName, date}) {
    try {
      const { data: { appointmentId } } = await Api({
        method: 'post',
        url: '/appointment/create',
        body: {
          userId,
          stores: storeIds,
          members: memberIds,
          eventName,
          date
        }
      })

      return appointmentId;
    }
    catch(e) {
      console.log("AppRepo -> e?.response", JSON.stringify(e?.response.data))
      throw new Error(e?.response?.data?.message);
    }
  }
}

export default AppRepo;
