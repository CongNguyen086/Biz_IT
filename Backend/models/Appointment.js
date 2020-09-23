export class Appointment {
    id;
    eventName;
    meetingDate;
    hostId;
    stores;
    members;
    statusId;

    constructor(
        id,
        eventName,
        meetingDate,
        hostId,
        stores,
        members,
        statusId,
    ) {
        this.id = id;
        this.eventName = eventName;
        this.meetingDate = meetingDate;
        this.hostId = hostId;
        this.stores = stores;
        this.members = members;
        this.statusId = statusId;
    }
}