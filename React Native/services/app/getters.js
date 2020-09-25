export const getContactList = state => state.app.contacts
export const getPendingAppointments = state => state.app.pendingAppointmentStores
export const getAppointmentList = state => ({
  appointmentList: state.app.appointmentList,
  appointmentLoading: state.app.appointmentLoading
})