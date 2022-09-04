export class ActionCreateCommentCommand {
    private readonly _message: string;
    private readonly _hash: string;

    constructor(message: string, hash: string) {
        this._message = message;
        this._hash = hash;
    }

    get message(): string {
        return this._message;
    }

    get hash(): string {
        return this._hash;
    }
}