export class EmailAlreadyExistsError extends Error {
    constructor(email) {
        super(`The provided email ${email} already exists`);
        this.name = 'EmailAlreadyExistsError';
    }
}

