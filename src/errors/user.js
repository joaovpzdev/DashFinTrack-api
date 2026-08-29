export class EmailAlreadyExistsError extends Error {
    constructor(email) {
        super(`The provided email ${email} already exists`);
        this.name = 'EmailAlreadyExistsError';
    }
}

export class UserNotFoundError extends Error {
    constructor(userId) {
        super(`User with ID ${userId} not found`);
        this.name = 'UserNotFoundError';
    }
}