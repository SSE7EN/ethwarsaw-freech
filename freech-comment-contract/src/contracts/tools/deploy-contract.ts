import fs from 'fs';
import path from 'path';
import { WarpFactory } from 'warp-contracts';
import {Comment} from "../types/types";

interface User {
  comments: Map<number, Comment>
}

interface Site {
  votes: {
    addresses: string[];
    up: number;
    down: number;
  };
}

(async () => {
  const warp = WarpFactory.forMainnet();
  const jwk = await warp.arweave.wallets.generate();
  const walletAddress = await warp.arweave.wallets.jwkToAddress(jwk);
  const contractSrc = fs.readFileSync(path.join(__dirname, '../../../dist/contract.js'), 'utf8');

  const initialState = {
      commentsCount: 0,
      siteComments: new Map<String, []>(),
      sites: new Map<String, Site> (),
      users: new Map<String, User> (),
  };

  console.log('Deployment started');
  console.log(JSON.stringify(jwk))
  const { contractTxId } = await warp.createContract.deploy({
    wallet: jwk,
    initState: JSON.stringify(initialState),
    src: contractSrc,
  });
  console.log('Deployment completed: ' + contractTxId);
})();
``;
