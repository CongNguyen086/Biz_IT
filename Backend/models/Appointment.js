export class Appointment {
    id;
    eventName;
    meetingDate;
    hostId;
    hostName;
    stores;
    members;
    eventStatus;
    statusId;

    constructor(
        id,
        eventName,
        meetingDate,
        hostId,
        hostName,
        stores,
        members,
        eventStatus,
        statusId,
    ) {
        this.id = id;
        this.eventName = eventName;
        this.meetingDate = meetingDate;
        this.hostId = hostId;
        this.hostName = hostName;
        this.stores = stores;
        this.members = members;
        this.eventStatus = eventStatus;
        this.statusId = statusId;
    }
}