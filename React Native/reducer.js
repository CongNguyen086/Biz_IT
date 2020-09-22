import {combineReducers} from 'redux'
import auth from './services/auth/reducer'
import app from './services/app/reducer'
import socket from './services/socket/reducer'

export default combineReducers({
  auth,
  app,
  socket,
})