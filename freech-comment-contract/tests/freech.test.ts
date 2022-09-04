import ArLocal from 'arlocal';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { LoggerFactory, Warp, WarpFactory, Contract } from 'warp-contracts';
import { FreechState, Comment } from '../src/contracts/types/types';
import fs from 'fs';
import path from 'path';

jest.setTimeout(30000);


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

describe('Testing the Atomic NFT Token', () => {
  let ownerWallet: JWKInterface;
  let owner: string;

  let user2Wallet: JWKInterface;
  let user2: string;

  let user3Wallet: JWKInterface;
  let user3: string;

  let initialState: FreechState;

  let arlocal: ArLocal;
  let warp: Warp;
  let freech: Contract<FreechState>;

  let contractSrc: string;

  let contractId: string;

  beforeAll(async () => {
    arlocal = new ArLocal(1820, false);
    await arlocal.start();

    LoggerFactory.INST.logLevel('error');
    //LoggerFactory.INST.logLevel('debug', 'WasmContractHandlerApi');

    warp = WarpFactory.forLocal(1820);

    ({jwk: ownerWallet, address: owner} = await warp.testing.generateWallet());

    ({jwk: user2Wallet, address: user2} = await warp.testing.generateWallet());

    ({jwk: user3Wallet, address: user3} = await warp.testing.generateWallet());

    initialState = {
      commentsCount: 0,
      siteComments: new Map<String, []>(),
      sites: new Map<String, Site> (),
      users: new Map<String, User> (),
    };

    contractSrc = fs.readFileSync(path.join(__dirname, '../dist/contract.js'), 'utf8');

    ({ contractTxId: contractId } = await warp.createContract.deploy({
      wallet: ownerWallet,
      initState: JSON.stringify(initialState),
      src: contractSrc,
    }));
    console.log('Deployed contract: ', contractId);
    freech = warp.contract<FreechState>(contractId).connect(ownerWallet);
  });

  afterAll(async () => {
    await arlocal.stop();
  });

  it('should properly deploy contract', async () => {
    const contractTx = await warp.arweave.transactions.get(contractId);

    expect(contractTx).not.toBeNull();
  });

  it('should read Freech state', async () => {
    expect((await freech.readState()).cachedValue.state).toEqual({commentsCount: 0, siteComments: {}, sites: {}, users: {}});
  });

  it('should properly post message', async () => {
    await freech.writeInteraction({ function: 'postComment', content: 'Hello world!', originHash: "hash1" });

    const { cachedValue } = await freech.readState();
    expect(cachedValue.state.siteComments["hash1"]).toEqual([{
      id: 1,
      creator: owner,
      content: 'Hello world!',
      timestamp: expect.any(Number),
      votes: { addresses: [], up: 0, down:0 },
    }]);
  });

  it('should not post message with no content', async () => {
    await expect(freech.writeInteraction({ function: 'postComment' }, { strict: true })).rejects.toThrow(
      'Cannot create interaction: Creator must provide a message content.'
    );
  });

  it('should not be possible for creator to vote for they message', async () => {
    await expect(freech.writeInteraction({ function: 'upvoteComment', originHash:'hash1', commentId: 1 }, { strict: true })).rejects.toThrow(
      'Cannot create interaction: Comment creator cannot vote for they own message.'
    );

    await expect(freech.writeInteraction({ function: 'downvoteComment', originHash:'hash1', commentId: 1 }, { strict: true })).rejects.toThrow(
      'Cannot create interaction: Comment creator cannot vote for they own message.'
    );
  });

  it('should not be possible to vote for non-existing message', async () => {
    freech = warp.contract<FreechState>(contractId).connect(user2Wallet);

    await expect(freech.writeInteraction({ function: 'upvoteComment', originHash:'hash1', commentId: 2 }, { strict: true })).rejects.toThrow(
      'Comment does not exist.'
    );
  });

  it('should properly upvote message', async () => {
    freech = warp.contract<FreechState>(contractId).connect(user2Wallet);

    await freech.writeInteraction({ function: 'upvoteComment', originHash:'hash1', commentId: 1 });

    const { cachedValue } = await freech.readState();
    expect(cachedValue.state.siteComments['hash1'][0].votes.up).toEqual(1);
  });

  it('should not be possible to vote for the same message twice', async () => {
    freech = warp.contract<FreechState>(contractId).connect(user2Wallet);

    await expect(freech.writeInteraction({  function: 'upvoteComment', originHash:'hash1', commentId: 1  }, { strict: true })).rejects.toThrow(
      'Cannot create interaction: Caller has already voted.'
    );

    await expect(freech.writeInteraction({ function: 'downvoteComment', originHash:'hash1', commentId: 1 }, { strict: true })).rejects.toThrow(
      'Caller has already voted.'
    );
  });

  it('should properly downvote message', async () => {
    freech = warp.contract<FreechState>(contractId).connect(user3Wallet);

    await freech.writeInteraction({ function: 'downvoteComment', originHash:'hash1', commentId: 1});

    const { cachedValue } = await freech.readState();
    expect(cachedValue.state.siteComments['hash1'][0].votes.down).toEqual(1);
  });

  it('should properly view comment', async () => {
    const { result } = await freech.viewState({ function: 'readComment', originHash: 'hash1', commentId: 1 });

    expect(result).toEqual({
      id: 1,
      creator: owner,
      content: 'Hello world!',
      timestamp: expect.any(Number),
      votes: { addresses: [user2, user3], up: 1, down: 1 },
    });
  });

  it('should properly view comments', async () => {
    const { result } = await freech.viewState({ function: 'readComments', originHash: 'hash1'});

    expect((result as []).length).toEqual(1);
    expect(result[0]).toEqual({
      id: 1,
      creator: owner,
      content: 'Hello world!',
      timestamp: expect.any(Number),
      votes: { addresses: [user2, user3], up: 1, down: 1 },
    });
  });

  it('should properly upvote site', async () => {
    freech = warp.contract<FreechState>(contractId).connect(user2Wallet);

    await freech.writeInteraction({ function: 'upvoteSite', originHash:'hash1'});

    const { cachedValue } = await freech.readState();
    expect(cachedValue.state.sites['hash1'].votes.up).toEqual(1);
  });

  it('should not be possible to vote for the same message twice', async () => {
    freech = warp.contract<FreechState>(contractId).connect(user2Wallet);

    await expect(freech.writeInteraction({ function: 'upvoteSite', originHash:'hash1'}, { strict: true })).rejects.toThrow(
        'Cannot create interaction: Caller has already voted.'
    );

    await expect(freech.writeInteraction({ function: 'downvoteSite', originHash:'hash1' }, { strict: true })).rejects.toThrow(
        'Caller has already voted.'
    );
  });

  it('should properly downvote site', async () => {
    freech = warp.contract<FreechState>(contractId).connect(user3Wallet);

    await freech.writeInteraction({ function: 'downvoteSite', originHash:'hash1' });

    const { cachedValue } = await freech.readState();
    expect(cachedValue.state.sites['hash1'].votes.down).toEqual(1);
  });

  it('should properly view site', async () => {
    const { result } = await freech.viewState({ function: 'readSite', originHash: 'hash1' });

    expect(result).toEqual({
      votes: { addresses: [user2, user3], up: 1, down: 1 },
    });
  });

  it('should properly view user', async () => {
    const { result, errorMessage } = await freech.viewState({ function: 'readUser', user: owner });
    expect(result).toEqual({
      comments: {
        "1": {
          id: 1,
          creator: owner,
          content: 'Hello world!',
          timestamp: expect.any(Number),
          votes: { addresses: [user2, user3], up: 1, down: 1 },}
      }
    });
  });

});
