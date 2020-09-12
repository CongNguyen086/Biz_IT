import { all } from 'redux-saga/effects'
import authSagas from './services/auth/sagas'

export default function* () {
  yield all([
    authSagas()
  ])
}