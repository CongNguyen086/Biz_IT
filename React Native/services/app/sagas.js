import {call, put, select, takeEvery} from 'redux-saga/effects'
import { removeAllPendingAppointment, setAppointmentList, setLoadingAppointment } from './actions'
import { CREATE_NEW_APPOINTMENT, FETCH_APPOINTMENTS } from './constants'
import {getCurrentUser} from '../auth/getters'
import AppRepo from './repo'
import Appointment from './Appointment'

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

function* fetchAppointmentListSaga() {
  try {
    const currentUser = yield select(getCurrentUser);
    console.log("function*fetchAppointmentListSaga -> currentUser", currentUser)

    if (!currentUser?.userId) {
      yield put(setLoadingAppointment({loading: false}));
      return;
    }

    yield put(setLoadingAppointment({loading: true}));

    const appointments = yield call(AppRepo.getAppointments, {userId: currentUser.userId});

    yield put(setAppointmentList({appointments : appointments.map(val => Appointment.object(val))}))
  }
  catch(e) {
    console.log("function*fetchAppointmentListSaga -> e", e)
    yield put(setLoadingAppointment({loading: false}));
  }
}

export default function* () {
  yield takeEvery(CREATE_NEW_APPOINTMENT, createAppointment)
  yield takeEvery(FETCH_APPOINTMENTS, fetchAppointmentListSaga)
}