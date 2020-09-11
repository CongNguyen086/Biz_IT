import {combineReducers} from 'redux'
import auth from './services/auth/reducer'

export default combineReducers({
  auth,
})