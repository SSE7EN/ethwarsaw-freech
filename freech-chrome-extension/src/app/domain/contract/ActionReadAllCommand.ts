export class ActionReadAllCommand {
    private readonly _hash: string;

    constructor(hash: string) {
        this._hash = hash;
    }

    get hash(): string {
        return this._hash;
    }
}