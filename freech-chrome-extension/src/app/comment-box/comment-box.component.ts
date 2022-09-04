import {Component, Input, OnInit} from '@angular/core';
import {UserComment} from "../domain/UserComment";
import {fadeInOnEnterAnimation} from "angular-animations";
import {MessagePayload} from "../domain/MessagePayload";
import {ContractActionType} from "../domain/contract/ContractActionType";

@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.css'],
  animations:[
    fadeInOnEnterAnimation({duration: 1600, delay: 200}),
  ]
})
export class CommentBoxComponent implements OnInit {

  @Input()
  comment: UserComment = {} as UserComment;



  ngOnInit(): void {

  }

  public handleUpvote(commentId: number): void{
    console.log("Sending user comment: " + commentId);
    // @ts-ignore
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      const payload = new MessagePayload(ContractActionType.UPVOTE_COMMENT, commentId.toString());
      // @ts-ignore
      chrome.tabs.sendMessage(tabs[0].id, payload, function (response) {});
    });

    this.comment.likes++;

  }


  public handleDislike(commentId: number): void{
    console.log("Sending user comment: " + commentId);
    // @ts-ignore
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      const payload = new MessagePayload(ContractActionType.DOWNVOTE_COMMENT, commentId.toString());
      // @ts-ignore
      chrome.tabs.sendMessage(tabs[0].id, payload, function (response) {});
    });

    this.comment.dislikes++;

  }


}
