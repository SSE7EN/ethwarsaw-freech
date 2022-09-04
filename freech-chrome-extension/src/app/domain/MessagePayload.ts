import {ContractActionType} from "./contract/ContractActionType";

export class MessagePayload {
    customActionType: ContractActionType;
    textMessage: string | undefined;

    constructor(type: any, textMessage: string) {
        this.customActionType = type;
        this.textMessage = textMessage;
    }

}