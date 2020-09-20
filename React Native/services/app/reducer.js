import {MAX_PENDING_APPOINTMENTS, SET_CONTACTS, UPDATE_PENDING_APPOINTMENT} from './constants'

const initialState = {
  contacts: [],
  pendingAppointmentStores: [],
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
    default:
      return state
  }
}