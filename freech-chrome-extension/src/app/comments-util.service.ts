import {Injectable} from '@angular/core';
import {UserComment} from "./domain/UserComment";
import {MessagePayload} from "./domain/MessagePayload";
import {ContractActionType} from "./domain/contract/ContractActionType";

@Injectable({
    providedIn: 'root'
})
export class CommentsUtilService {

    constructor() {
    }

    public sendReadCommentsRequest(): void {
        console.log("Requesting comments");
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            const payload = new MessagePayload(ContractActionType.READ_COMMENTS, '');
            // @ts-ignore
            chrome.tabs.sendMessage(tabs[0].id, payload, function (response) {
            });
        });
    }

    public mapFromContractToDomain(input: any): Array<UserComment> {
        let out: Array<UserComment> = [];

        input.data.result?.forEach((e: any) => {
            out.push(new UserComment(
                e.id,
                e.creator,
                e.content,
                e.votes.up,
                e.votes.down
            ));
        })

        return out;
    }


}
