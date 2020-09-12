import { SET_CURRENT_USER } from "./constants";

export function updateCurrentUser({ user = null } = {}) {
  return {
    type: SET_CURRENT_USER,
    payload: {
      user
    }
  }
}