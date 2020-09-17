import {SET_CONTACTS} from './constants'

const initialState = {
  contacts: []
}

export default function(state = initialState, action) {
  switch(action.type) {
    case SET_CONTACTS:
      const {contacts = []} = action.payload

      return {
        ...state,
        contacts
      }
    default:
      return state
  }
}