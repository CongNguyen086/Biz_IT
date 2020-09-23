import {call, put, takeEvery} from 'redux-saga/effects'
import { removeAllPendingAppointment } from './actions'
import { CREATE_NEW_APPOINTMENT } from './constants'
import AppRepo from './repo'

function* createAppointment({
  payload: {
    userId,
    storeIds,
    memberIds,
    eventName,
    meetingDate,
  },
  meta: {
    onSuccess = () => {},
    onFailed = () => {}
  } = {}
}) {
  try {
    yield call(AppRepo.createAppointment, 
      {
        userId,
        storeIds,
        memberIds,
        eventName,
        date: `${meetingDate.getFullYear()}-${meetingDate.getMonth() + 1}-${meetingDate.getDate() + 1}`,
      }
    )

    yield put(removeAllPendingAppointment())

    yield call(onSuccess)
  }
  catch(e) {
    yield call(onFailed)
  }
}

export default function* () {
  yield takeEvery(CREATE_NEW_APPOINTMENT, createAppointment)
}