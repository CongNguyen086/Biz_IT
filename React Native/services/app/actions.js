import { SET_CONTACTS, UPDATE_PENDING_APPOINTMENT } from "./constants";

export function setContactList({ contacts }) {
  return {
    type: SET_CONTACTS,
    payload: {
      contacts
    }
  }
}

function updatePendingAppointment({store, isRemove}) {
  console.log("updatePendingAppointment -> store", store)
  return {
    type: UPDATE_PENDING_APPOINTMENT,
    payload: {
      isRemove,
      store,
    }
  }
}

export function addNewAppointment({store}) {
  return updatePendingAppointment({store, isRemove: false})
}

export function removeAppointment({store}) {
  return updatePendingAppointment({store, isRemove: true})
}