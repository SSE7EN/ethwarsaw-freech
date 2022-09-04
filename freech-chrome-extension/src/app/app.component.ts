import {Component, OnInit} from '@angular/core';
import {GravatarGeneratorService} from "./gravatar-generator.service";
import {MessagePayload} from "./domain/MessagePayload";
import {ContractActionType} from "./domain/contract/ContractActionType";
import {pulseAnimation,} from 'angular-animations';
import {AnimationEvent} from '@angular/animations';
import {UserComment} from "./domain/UserComment";
import {CommentsUtilService} from "./comments-util.service";
import {MessageResponseGeneral} from "./domain/MessageResponseGeneral";


const updateBackgroundColor = (color: string) => document.body.style.backgroundColor = color;


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    animations: [
        pulseAnimation({direction: "=>"})
    ]
})
export class AppComponent implements OnInit {
    color = '#ffffff';
    commentInput: string = '';
    swingButtonWiggle: boolean = false;
    inputButtonClass: string = 'btn-original';

    commentBoxes: Array<UserComment> = [];

    constructor(
        private gravatarGeneratorService: GravatarGeneratorService,
        private commentsReadService: CommentsUtilService
    ) {
    }

    private loadComments(request: any): any {
        console.log("BACK GUI");
        console.log(request as MessageResponseGeneral);
        let tmp = this.commentsReadService.mapFromContractToDomain(request);
        this.commentBoxes = tmp.map(value => value);
        this.commentBoxes.sort(a => a.commentId).reverse();
        console.log(this.commentBoxes);
    }

    ngOnInit(): void {
        chrome.runtime.onMessage.addListener(this.loadComments.bind(this));
        this.setExtensionId();
        this.commentsReadService.sendReadCommentsRequest();


    }


    private setExtensionId() {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            const payload = new MessagePayload(ContractActionType.SET_EXT_ID, chrome.runtime.id);
            // @ts-ignore
            chrome.tabs.sendMessage(tabs[0].id, payload, function (response) {
            });
        });
    }

    onSave() {
        let userInput = this.commentInput;
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            console.log(tabs[0].id);
            const payload = new MessagePayload(ContractActionType.POST_COMMENT, userInput);
            console.log("Sending user comment: " + userInput);
            // @ts-ignore
            chrome.tabs.sendMessage(tabs[0].id, payload, function (response) {
                console.log("Got response");
                console.log(response);
            });
        });
        this.wiggleButtonOnSave();
        this.commentBoxes.push(new UserComment(
            0,
            "KGMFpvmZp9XDx8MJZJASt97PpBH4o18MXbLvQrQWA2I",
            userInput,
            0,
            0
        ));
        this.commentBoxes.sort(a => a.commentId).reverse();
        this.commentInput = '';
    }

    private wiggleButtonOnSave(): void {
        this.inputButtonClass = 'btn-green';
        this.swingButtonWiggle = true;
    }

    swingDone(event: AnimationEvent) {
        this.swingButtonWiggle = false;
        this.inputButtonClass = 'btn-original';
    }

}
