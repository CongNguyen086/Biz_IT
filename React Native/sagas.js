import { all } from 'redux-saga/effects'
import authSagas from './services/auth/sagas'
import appSagas from './services/app/sagas'

export default function* () {
  yield all([
    authSagas(),
    appSagas()
  ])
}