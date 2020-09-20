export class User {
    userId;
    fullName;
    userPhone;
    userPassword;

    constructor(
        userId,
        fullName,
        userPhone,
        userPassword,
    ) {
        this.userId = userId;
        this.fullName = fullName;
        this.userPhone = userPhone;
        this.userPassword = userPassword;
    }
}