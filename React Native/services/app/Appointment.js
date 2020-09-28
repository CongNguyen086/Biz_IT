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
    isContain: (status) => {
      if ([
        Appointment.Status.WAITING,
        Appointment.Status.COMPLETED,
        Appointment.Status.DECLINED,
        Appointment.Status.CANCELED,
        Appointment.Status.SELECTED,
      ].includes(status)) {
        return true;
      }
      return false;
    },
    isVoted: (status) => {
      if ([
        Appointment.Status.COMPLETED,
        Appointment.Status.DECLINED,
        Appointment.Status.CANCELED,
        Appointment.Status.SELECTED,
      ].includes(status)) {
        return true;
      }
      return false;
    }
  }

  static object(payload) {
    const {
      appointmentId,
      eventName,
      type,
      memberStatus,
      meetingDate,
      hostId,
      hostName,
      votedNumber,
      selectedNumber,
      invitedNumber,
      eventStatus = Appointment.Status.WAITING,
      meetingPlace = null,
    } = payload;

    if (!Object.values(Appointment.Type).includes(type)) {
      throw new Error('[Appointment] Type is not valid');
    }

    if (![...Object.values(Appointment.Status), ""].includes(memberStatus)) {
      throw new Error('[Appointment] Status is not valid');
    }

    if (![Appointment.Status.WAITING, Appointment.Status.COMPLETED, Appointment.Status.CANCELED].includes(eventStatus)) {
      throw new Error('[Appointment] Event status is not valid');
    }

    if (type === Appointment.Type.SENT && ![Appointment.Status.WAITING,Appointment.Status.COMPLETED,Appointment.Status.CANCELED, ""].includes(memberStatus)) {
      throw new Error('[Appointment] Status of `sent` is not valid');
    }

    if (type === Appointment.Type.RECEIVED && ![Appointment.Status.WAITING,Appointment.Status.SELECTED,Appointment.Status.DECLINED].includes(memberStatus)) {
      throw new Error('[Appointment] Status of `received` is not valid');
    }

    const date = new Date(meetingDate);
    if (!isDate(date)) {
      throw new Error('[Appointment] Meeting date is not valid');
    }

    if (votedNumber < 0) {
      throw new Error('[Appointment] VotedNumber is not valid');
    }

    if (selectedNumber < 0) {
      throw new Error('[Appointment] SelectedNumber is not valid');
    }

    return {
      id: appointmentId,
      eventName,
      type: type || Appointment.Type.SENT,
      status: memberStatus || Appointment.Status.WAITING,
      meetingDate: date,
      hostId,
      hostName,
      votedNumber,
      selectedNumber,
      invitedNumber,
      eventStatus,
      meetingPlace,
    }
  }
}

export default Appointment;
