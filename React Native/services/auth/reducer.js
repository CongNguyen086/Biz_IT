import { SET_CURRENT_USER } from "./constants";

const initialState = {
  currentUser: {
    "fullName": "Khang",
    "userId": "8159657106479438377",
    "userPassword": "123",
    "userPhone": "123",
  },
}

export default function(state = initialState, action) {
  switch(action.type) {
    case SET_CURRENT_USER:
      if (!state.currentUser || !payload.user) {
        return {
          ...state,
          currentUser: action.payload.user
        }
      }
      return {
        ...state,
        currentUser: {...state.currentUser, ...action.payload.user}
      }
    default:
      return state
  }
}