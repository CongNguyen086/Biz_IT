import { SET_CONTACTS, UPDATE_PENDING_APPOINTMENT } from "./constants";

export function setContactList({ contacts }) {
  return {
    type: SET_CONTACTS,
    payload: {
      contacts
    }
  }
}

export function addNewAppointment({store}) {
  return {
    type: UPDATE_PENDING_APPOINTMENT,
    payload: {
      isRemove: false,
      store,
    }
  }
}