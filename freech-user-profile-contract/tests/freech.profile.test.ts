import ArLocal from 'arlocal';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { LoggerFactory, Warp, WarpFactory, Contract } from 'warp-contracts';

import fs from 'fs';
import path from 'path';
import {State} from "../src/contracts/types/types";

jest.setTimeout(30000);

interface UserProfile {
    description: string;
    twitterUrl: string;
}


describe('Testing the Atomic NFT Token', () => {
    let ownerWallet: JWKInterface;
    let owner: string;

    let user2Wallet: JWKInterface;
    let user2: string;

    let user3Wallet: JWKInterface;
    let user3: string;

    let initialState: State;

    let arlocal: ArLocal;
    let warp: Warp;
    let freech: Contract<State>;

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
            users: new Map<String, UserProfile>
        };

        contractSrc = fs.readFileSync(path.join(__dirname, '../dist/contract.js'), 'utf8');

        ({contractTxId: contractId} = await warp.createContract.deploy({
            wallet: ownerWallet,
            initState: JSON.stringify(initialState),
            src: contractSrc,
        }));
        console.log('Deployed contract: ', contractId);
        freech = warp.contract<State>(contractId).connect(ownerWallet);
    });

    afterAll(async () => {
        await arlocal.stop();
    });


    it('should properly deploy contract', async () => {
        const contractTx = await warp.arweave.transactions.get(contractId);

        expect(contractTx).not.toBeNull();
    });

    it('should read state', async () => {
        expect((await freech.readState()).cachedValue.state).toEqual({ users: {} });
    });

    it('should properly update profile', async () => {
        await freech.writeInteraction({ function: 'updateProfile', description: 'Hello world!', twitterUrl: "url1" });

        const { cachedValue } = await freech.readState();
        console.log("cachedValue");
        console.log(cachedValue);
        console.log(JSON.stringify(await freech.readState()))
        expect(cachedValue.state.users[owner]).toEqual({
            description: 'Hello world!',
            twitterUrl: "url1"
        });
    });

    it('should properly update profile 2', async () => {
        await freech.writeInteraction({ function: 'updateProfile', description: 'Hello world2!', twitterUrl: "url1" });

        const { cachedValue } = await freech.readState();
        expect(cachedValue.state.users[owner]).toEqual({
            description: 'Hello world2!',
            twitterUrl: "url1"
        });
    });

    it('should properly view profile', async () => {
        const { result } = await freech.viewState({ function: 'readProfile', userId: owner });

        expect(result).toEqual({
            description: 'Hello world2!',
            twitterUrl: "url1"
        });
    });


});
