import fs from 'fs';
import path from 'path';
import { WarpFactory } from 'warp-contracts';


interface UserProfile {
  description: string;
  twitterUrl: string;
}

(async () => {
  const warp = WarpFactory.forMainnet();
  const jwk = await warp.arweave.wallets.generate();
  const walletAddress = await warp.arweave.wallets.jwkToAddress(jwk);
  const contractSrc = fs.readFileSync(path.join(__dirname, '../../../dist/contract.js'), 'utf8');

  const initialState = {
      users: new Map<String, UserProfile>
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
