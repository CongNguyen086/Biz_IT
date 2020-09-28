import { call, put, takeLatest } from 'redux-saga/effects'
import AppNavigation from '../navigation'
import { updateCurrentUser } from './actions'
import { LOGIN_WITH_PHONE } from './constants'
import AuthRepo from './repo'

function* loginWithPhone({
  payload: {
    phoneNumber,
    password
  } = {},
  meta: {
    onFailed = () => { }
  } = {}
}) {
  try {
    const data = yield call(AuthRepo.loginWithPhone, { phoneNumber, password })

    if (data && data.length > 0) {
      yield put(updateCurrentUser({ user: data[0] }))

      yield call(AppNavigation.navigate, AppNavigation.Screens.App)
    }
    else {
      onFailed()
    }
  }
  catch (e) {
    console.log("function*loginWithPhone -> e", e.message)
    onFailed()
  }
}

export default function* () {
  yield takeLatest(LOGIN_WITH_PHONE, loginWithPhone)
}