import { SET_CONTACTS } from "./constants";

export function setContactList({ contacts }) {
  return {
    type: SET_CONTACTS,
    payload: {
      contacts
    }
  }
}