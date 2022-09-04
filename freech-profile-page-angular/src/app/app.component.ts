import { Component } from '@angular/core';
import {WarpFactory} from "warp-contracts";
import {FreechState, Comment} from "./types";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  walletId:String='';
  profile:String='';//mock
  comments:Comment[]=[];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const warp = WarpFactory.forMainnet();
    const contractTxId = '30IK2TOGzEHm_73S0FjapOHs9EWEz21cFiBxHAYH61s';
    this.route.queryParams.subscribe((params) => {
      this.walletId = params["walletId"];
    });
    let freech = warp.contract<FreechState>(contractTxId).connect(
      'use_wallet'
    );
    const response = (async () => {
      const state = await freech.viewState({
        function: 'readComments',
        originHash: 'test1',
      });
      this.comments = state.result;
    })()
  }
}
