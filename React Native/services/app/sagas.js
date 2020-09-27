import {call, put, select, takeEvery} from 'redux-saga/effects'
import { removeAllPendingAppointment, setAppointmentList, setLoadingAppointment, updateAppointment } from './actions'
import { 
  CREATE_NEW_APPOINTMENT, 
  FETCH_APPOINTMENTS, 
  SELECT_APPOINTMENT_STORES,
  DECLINE_APPOINTMENT,
  UPDATE_APPOINTMENT_STATUS
} from './constants'
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

function* selectAppointmentStoresSaga({
  payload: {
    appointmentId,
    storeIds
  },
  meta: {
    onSuccess = () => {},
    onFailed = () => {},
  } = {}
}) {
  try {
    const currentUser = yield select(getCurrentUser);

    if (!currentUser || !currentUser.userId) {
      throw new Error('Not have current user');
    }

    const data = yield call(AppRepo.selectAppointmentStores, {appointmentId, userId: currentUser.userId, storeIds});

    // update appointment list in redux
    const appontmentItem = Appointment.object(data);
    if (appontmentItem) {
      yield put(updateAppointment({
        appointmentId,
        appointment: appontmentItem,
      }))
    }

    yield call(onSuccess, data)
  }
  catch(e) {
    yield call(onFailed)
  }
}

function* declineAppointmentSaga({
  payload: {
    appointmentId,
  },
  meta: {
    onSuccess = () => {},
    onFailed = () => {},
  } = {}
}) {
  try {
    const currentUser = yield select(getCurrentUser);

    if (!currentUser || !currentUser.userId) {
      throw new Error('Not have current user');
    }

    const data = yield call(AppRepo.declineAppointment, {appointmentId, userId: currentUser.userId});

    // update appointment list in redux
    const appontmentItem = Appointment.object(data);
    if (appontmentItem) {
      yield put(updateAppointment({
        appointmentId,
        appointment: appontmentItem,
      }))
    }

    yield call(onSuccess, data)
  }
  catch(e) {
    yield call(onFailed)
  }
}

function* updateAppointmentSaga({
  payload: {
    appointmentId,
    status = Appointment.Status.COMPLETED,
    storeId,
  },
  meta: {
    onSuccess = () => {},
    onFailed = () => {},
  } = {}
}) {
  try {
    const currentUser = yield select(getCurrentUser);

    if (!currentUser || !currentUser.userId) {
      throw new Error('Not have current user');
    }

    const data = yield call(AppRepo.updateEventStatus, {appointmentId, userId: currentUser.userId, storeId, status});

    // update appointment list in redux
    const appontmentItem = Appointment.object(data);
    if (appontmentItem) {
      yield put(updateAppointment({
        appointmentId,
        appointment: appontmentItem,
      }))
    }

    yield call(onSuccess, data)
  }
  catch(e) {
    yield call(onFailed)
  }
}

export default function* () {
  yield takeEvery(CREATE_NEW_APPOINTMENT, createAppointment)
  yield takeEvery(FETCH_APPOINTMENTS, fetchAppointmentListSaga)
  yield takeEvery(SELECT_APPOINTMENT_STORES, selectAppointmentStoresSaga)
  yield takeEvery(DECLINE_APPOINTMENT, declineAppointmentSaga)
  yield takeEvery(UPDATE_APPOINTMENT_STATUS, updateAppointmentSaga)
}