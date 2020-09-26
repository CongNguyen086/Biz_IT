export class ResponseError extends Error {
    error;
    message;
    details;
    constructor(message) {
        super(message);
        this.error = this.name,
        this.message = message,
        this.details = this.stack
    }
}