class Appointment {
  static Type = {
    SENT: 'sent',
    RECEIVED: 'received',
  }

  static Status = {
    WAITING: 'waiting',
    COMPLETED: 'completed',
    DECLINED: 'declined'
  }
}

export default Appointment;
