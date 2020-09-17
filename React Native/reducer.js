import {combineReducers} from 'redux'
import auth from './services/auth/reducer'
import app from './services/app/reducer'

export default combineReducers({
  auth,
  app,
})