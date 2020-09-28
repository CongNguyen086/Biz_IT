import Api from '../api'

class AppRepo {
  static async getContactList(listPhones) {
    try {
      const { data } = await Api({
        method: 'post',
        url: '/user/contact',
        body: {
          phoneList: listPhones
        }
      })

      return data;
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
          hostId: userId,
          stores: storeIds,
          members: memberIds,
          eventName,
          meetingDate: date
        }
      })

      return appointmentId;
    }
    catch(e) {
      console.log("AppRepo -> e?.response", JSON.stringify(e?.response.data))
      throw new Error(e?.response?.data?.message);
    }
  }

  static async getAppointments({userId}) {
    try {
      const { data } = await Api({
        method: 'get',
        url: '/appointment/list',
        params: {
          userId
        }
      })

      return data;
    }
    catch(e) {
      console.log("e", e.response.data)
      throw new Error(e?.response?.data.message);
    }
  }

  static async getAppointmentDetail({appointmentId}) {
    try {
      const { data } = await Api({
        method: 'get',
        url: '/appointment/store/details',
        params: {
          appointmentId
        }
      })

      return data;
    }
    catch(e) {
      console.log("e", e.response.data)
      throw new Error(e?.response?.data.message);
    }
  }

  static async selectAppointmentStores({appointmentId, userId, storeIds}) {
    try {
      const { data } = await Api({
        method: 'post',
        url: '/appointment/select',
        body: {
          appointmentId,
          userId,
          storeIds,
        }
      })

      return data;
    }
    catch(e) {
      throw new Error(e?.response?.data.message);
    }
  }

  static async declineAppointment({appointmentId, userId}) {
    try {
      const { data } = await Api({
        method: 'put',
        url: '/appointment/decline',
        body: {
          appointmentId,
          userId,
        }
      })

      return data;
    }
    catch(e) {
      throw new Error(e?.response?.data.message);
    }
  }

  static async updateEventStatus({appointmentId, userId, storeId, status}) {
    try {
      const { data } = await Api({
        method: 'put',
        url: '/appointment/update-status',
        body: {
          appointmentId, 
          userId, 
          storeId, 
          status
        }
      })
      console.log("declineAppointment -> data", data)

      return data;
    }
    catch(e) {
      throw new Error(e?.response?.data.message);
    }
  }
}

export default AppRepo;
