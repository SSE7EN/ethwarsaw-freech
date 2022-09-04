import {Component} from '@angular/core';
import {WarpFactory} from "warp-contracts";
import {Comment, FreechState, FreechUserResult} from "./freechtypes";
import {State, UserProfileResult} from "./profiletypes";
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  walletId: String = '';
  comments: Comment[] = [];
  description: String = '';
  twitterUrl: String = '';

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const warp = WarpFactory.forMainnet();
    const freechContractTxId = 'YrN1hQ1ZscbTOOd_iSq26QK7Qzcr4wgCvnHdTVyLohk';
    const profileContractTxId = 'RKC6SbfL0klGHF-tCYNlSinZzYSKjvLgCgiWycVO9OE';
    let profile = warp.contract<State>(profileContractTxId).connect(
      'use_wallet'
    );
    let freech = warp.contract<FreechState>(freechContractTxId).connect(
      'use_wallet'
    );

    this.route.queryParams.subscribe((params) => {
      this.walletId = params["walletId"];
      if (this.walletId == undefined) return;
      const readUserResult = (async () => {
        const readUserRes = await freech.viewState({
          function: 'readUser',
          user: this.walletId,
        });
        const map = (readUserRes.result as FreechUserResult).comments;
        this.comments = Object.values(map) as Comment[];
      })()

      const readProfileResult = (async () => {
         const readProfileRes = await profile.viewState({
          function: 'readProfile',
          userId: this.walletId,
        });
         this.description = (readProfileRes.result as UserProfileResult).description;
         this.twitterUrl = (readProfileRes.result as UserProfileResult).twitterUrl;
      })()
    });

  }

  getNow():number {
    return Date.now() / 1000;
  }

  timeDifference(current:number, previous:number):String {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = (current - previous) * 1000;

    if (elapsed < msPerMinute) {
      return Math.round(elapsed/1000) + ' seconds ago';
    }

    else if (elapsed < msPerHour) {
      return Math.round(elapsed/msPerMinute) + ' minutes ago';
    }

    else if (elapsed < msPerDay ) {
      return Math.round(elapsed/msPerHour ) + ' hours ago';
    }

    else if (elapsed < msPerMonth) {
      return 'approximately ' + Math.round(elapsed/msPerDay) + ' days ago';
    }

    else if (elapsed < msPerYear) {
      return 'approximately ' + Math.round(elapsed/msPerMonth) + ' months ago';
    }

    else {
      return 'approximately ' + Math.round(elapsed/msPerYear ) + ' years ago';
    }
  }

}
