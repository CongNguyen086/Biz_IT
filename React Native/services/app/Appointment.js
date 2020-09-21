import {isDate} from 'lodash'

class Appointment {
  static Type = {
    SENT: 'sent',
    RECEIVED: 'received',
  }

  static Status = {
    WAITING: 'waiting', // both
    COMPLETED: 'completed',
    DECLINED: 'declined',
    CANCELED: 'canceled',
    SELECTED: 'selected',
  }

  static object(payload) {
    const {
      eventName,
      type,
      status,
      date,
      hostId,
      hostName,
      votedNumber,
      acceptedNumber,
      numberOfUsers,
    } = payload;

    if (!Object.values(Appointment.Type).includes(type)) {
      throw new Error('[Appointment] Type is not valid');
    }

    if (!Object.values(Appointment.Status).includes(status)) {
      throw new Error('[Appointment] Status is not valid');
    }

    if (type === Appointment.Type.SENT && ![Appointment.Status.WAITING,Appointment.Status.COMPLETED,Appointment.Status.CANCELED].includes(status)) {
      throw new Error('[Appointment] Status of `sent` is not valid');
    }

    if (type === Appointment.Type.RECEIVED && ![Appointment.Status.WAITING,Appointment.Status.SELECTED,Appointment.Status.DECLINED].includes(status)) {
      throw new Error('[Appointment] Status of `received` is not valid');
    }

    const meetingDate = new Date(date);
    if (!isDate(meetingDate)) {
      throw new Error('[Appointment] Meeting date is not valid');
    }

    if (votedNumber < 0) {
      throw new Error('[Appointment] VotedNumber is not valid');
    }

    if (acceptedNumber < 0) {
      throw new Error('[Appointment] AcceptedNumber is not valid');
    }

    return {
      eventName,
      type: type || Appointment.Type.SENT,
      status: status || Appointment.Status.WAITING,
      meetingDate,
      hostId,
      hostName,
      votedNumber,
      acceptedNumber,
      numberOfUsers,
    }
  }
}

export default Appointment;
