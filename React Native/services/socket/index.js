import io from 'socket.io-client'
import config from '../../constants/config'
import { updateAppointment } from '../app/actions'
import Appointment from '../app/Appointment'
import { CONNTECT_SOCKET, CONNECT, DISCONNECT, APPOINTMENT_CHANGE } from './constants'


class AppSocket {
  static instance = null
  static reduxStore = null

  constructor() {
    throw new Error('AppSocket singleton cannot be instantiated.')
  }

  static get connected() {
    let connected = false
    try {
      connected = AppSocket.instance && AppSocket.instance.connected
    } catch (e) {
      console.log(e)
    } finally {
      return connected
    }
  }

  static connect() {
    try {
      AppSocket.instance = io(config.SERVER_SOCKET_URL, {
        reconnection: true,
        transports: ['websocket'],
        ws: true,
        requestTimeout: 4000,
        autoConnect: true,
      })
    } catch (e) {
      console.log(e)
    }
  }

  static disconnect() {
    try {
      if (AppSocket.instance) {
        AppSocket.instance.disconnect()
      }
    } catch (e) {
      console.log(e)
    }
  }

  static on(event, fn) {
    try {
      if (AppSocket.instance) {
        AppSocket.instance.on(event, fn)
      }
    } catch (e) {
      console.log(e)
    }
  }

  static off(event, fn) {
    try {
      if (AppSocket.instance) {
        AppSocket.instance.off(event, fn)
      }
    } catch (e) {
      console.log(e)
    }
  }

  static emit(event, ...args) {
    try {
      if (AppSocket.instance) {
        AppSocket.instance.emit(event, ...args)
      }
    } catch (e) {
      console.log(e)
    }
  }

  static onConnect() {
    try {
      console.log('Socket connected')
    } catch (e) {
      console.log(e)
    }
  }

  static onDisconnect(reason) {
    console.log(`Disconnected: ${reason}`)
  }

  static onAppointmentChange(payload) {
    try {
      const appointment = Appointment.object(payload)

      AppSocket.reduxStore.dispatch(updateAppointment({
        appointmentId: appointment.id,
        appointment
      }))
    }
    catch(e) {
      console.log("AppSocket -> onAppointmentChange -> e", e)
    }
  }

  static createSocketMiddleware() {
    return store => next => action => {
      switch(action.type) {
        case CONNTECT_SOCKET: {
          if (!AppSocket.connected) {
            AppSocket.reduxStore = store
            AppSocket.connect();

            AppSocket.on(CONNECT, AppSocket.onConnect)
            AppSocket.on(DISCONNECT, AppSocket.onDisconnect)
            AppSocket.on(APPOINTMENT_CHANGE, AppSocket.onAppointmentChange)
          }
        }
      }

      return next(action);
    }
  }
}

export const createSocketMiddleware = AppSocket.createSocketMiddleware

export default AppSocket