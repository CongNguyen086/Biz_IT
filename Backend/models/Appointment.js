export class Appointment {
    id;
    eventName;
    meetingDate;
    hostId;
    statusId;

    constructor(
        id,
        eventName,
        meetingDate,
        hostId,
        statusId,
    ) {
        this.id = id;
        this.eventName = eventName;
        this.meetingDate = meetingDate;
        this.hostId = hostId;
        this.statusId = statusId;
    }
}