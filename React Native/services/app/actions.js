import { SET_CONTACTS, UPDATE_PENDING_APPOINTMENT, REMOVE_ALL_PENDING_APPOINTMENT, SET_LOADING_APPOINTMENTS, ADD_APPOINTMENTS, UPDATE_APPOINTMENT } from "./constants";

export function setContactList({ contacts }) {
  return {
    type: SET_CONTACTS,
    payload: {
      contacts
    }
  }
}

function updatePendingAppointment({store, isRemove}) {
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

export function removeAllPendingAppointment() {
  return {
    type: REMOVE_ALL_PENDING_APPOINTMENT
  }
}

export function setLoadingAppointment({loading = true}) {
  return {
    type: SET_LOADING_APPOINTMENTS,
    payload: {
      appointmentLoading: loading
    }
  }
}

export function setAppointmentList({appointments}) {
  return {
    type: ADD_APPOINTMENTS,
    payload: {
      appointments,
    }
  }
}

export function updateAppointment({appointmentId, appointment}) {
  return {
    type: UPDATE_APPOINTMENT,
    payload: {
      appointmentId,
      appointment
    }
  }
}