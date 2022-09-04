export class ActionUpvoteCommand {
    private readonly _commentId: string;
    private readonly _hash: string;

    constructor(message: string, hash: string) {
        this._commentId = message;
        this._hash = hash;
    }

    get commentId(): string {
        return this._commentId;
    }

    get hash(): string {
        return this._hash;
    }
}