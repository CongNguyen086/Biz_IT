import { SET_CURRENT_USER } from "./constants";

const initialState = {
  // currentUser: {
  //   "fullName": "Hahaa",
  //   "userId": "1000000000000000001",
  //   "userPassword": "123",
  //   "userPhone": "08088",
  // },
  currentUser: null,
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