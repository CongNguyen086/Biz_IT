import {ADD_APPOINTMENTS, MAX_PENDING_APPOINTMENTS, REMOVE_ALL_PENDING_APPOINTMENT, SET_CONTACTS, SET_LOADING_APPOINTMENTS, UPDATE_APPOINTMENT, UPDATE_PENDING_APPOINTMENT} from './constants'

const initialState = {
  contacts: [],
  pendingAppointmentStores: [],
  appointmentList: [],
  appointmentLoading: true,
}

export default function(state = initialState, action) {
  switch(action.type) {
    case SET_CONTACTS:
      const {contacts = []} = action.payload

      return {
        ...state,
        contacts
      }
    case UPDATE_PENDING_APPOINTMENT:
      const {store, isRemove = false} = action.payload;
      let list = [...(state.pendingAppointmentStores || [])]
      if (isRemove) {
        if (!!list.find(s => s.storeId === store.storeId)) {
          list = list.filter(s => s.storeId !== store.storeId);
        }
      } else {
        if (list.length < MAX_PENDING_APPOINTMENTS) {
          list = [...list, store]
        }
      }

      return {
        ...state,
        pendingAppointmentStores: list,
      }
    case REMOVE_ALL_PENDING_APPOINTMENT:
      return {
        ...state,
        pendingAppointmentStores: []
      }

    case SET_LOADING_APPOINTMENTS:
      const {appointmentLoading} = action.payload;
      return {
        ...state,
        appointmentLoading,
      }

    case ADD_APPOINTMENTS: 
      const {appointments} = action.payload;
      return {
        ...state,
        appointmentList: appointments,
        appointmentLoading: false,
      }

    case UPDATE_APPOINTMENT:
      const {appointmentId, appointment} = action.payload;
      const {appointmentList} = state;
      const newList = appointmentList.map(ap => {
        if (ap.id === appointmentId) {
          return {
            ...ap,
            ...appointment
          }
        }
        return ap;
      })
      return {
        ...state,
        appointmentList: newList,
      }
    default:
      return state
  }
}