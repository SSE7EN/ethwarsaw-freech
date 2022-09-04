import {ResponseType} from "./ResponseType";

export class MessageResponseGeneral{

    dataType: ResponseType;
    data: any;

    constructor(dataType: ResponseType, data: any) {
        this.dataType = dataType;
        this.data = data;
    }

}