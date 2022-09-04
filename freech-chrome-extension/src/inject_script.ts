import {FreechState} from "./app/types/types";
import {Contract, InteractionResult, WarpFactory, WriteInteractionResponse} from "warp-contracts";
import {MessagePayload} from "./app/domain/MessagePayload";
import {ContractActionType} from "./app/domain/contract/ContractActionType";
import {ActionCreateCommentCommand} from "./app/domain/contract/ActionCreateCommentCommand";
import {ActionReadAllCommand} from "./app/domain/contract/ActionReadAllCommand";
import {ActionUpvoteCommand} from "./app/domain/contract/ActionUpvoteCommand";
import crypto from "crypto";
import {MessageResponseGeneral} from "./app/domain/MessageResponseGeneral";
import {ResponseType} from "./app/domain/ResponseType";

console.log('Injected code works ¯\\_(ツ)_/¯');

//Hardcoded for now
const contractTxId: string = '0IBX6g9ee0KZGRETzYWj88bk-1R9tmo0kmUmmzRXvH8';
const warp = WarpFactory.forMainnet();
const ardit: Contract = warp.contract<FreechState>(contractTxId).connect(
    'use_wallet'//Use currently select account in the wallet
);


window.addEventListener("message", (evt) => {
    // console.log("IS: on msg");
    // console.log(evt.data);
    // Validate the message origin
    if (evt.origin === window.origin) {
        const message: MessagePayload = evt.data
        // Check the type to avoid noise from other scripts
        if (validateMessageSource(message)) {
            console.log(message.customActionType);
            console.log("IS: got message");
            console.log(message)

            let hash = crypto.createHash('md5')
                .update(window.location.href)
                .digest("hex");

            switch (message.customActionType) {
                case ContractActionType.UPVOTE_COMMENT:
                    console.log("Upvoting")
                    upvoteComment(ardit, new ActionUpvoteCommand(<string>message.textMessage, hash)).then(value => {
                    });
                    break;
                case ContractActionType.DOWNVOTE_COMMENT:
                    console.log("Downvoting")
                    downvoteComment(ardit, new ActionUpvoteCommand(<string>message.textMessage, hash)).then(value => {
                    });
                    break;
                case ContractActionType.READ_COMMENTS:
                    console.log("Reading comments for hash: " + hash);
                    readAllComments(ardit, new ActionReadAllCommand(hash)).then(value => {
                        window.postMessage(new MessageResponseGeneral(ResponseType.COMMENTS_LIST, value), '*');
                    })
                    break;
                case ContractActionType.POST_COMMENT:
                    console.log("Created");
                    if (message.textMessage != null) {
                        postComment(ardit, new ActionCreateCommentCommand(message.textMessage, hash)).then(value => {
                            console.log("Injected response")
                            // window.postMessage(new MessageResponseGeneral(ResponseType.COMMENTS_LIST, {}), '*');
                        })
                    }
            }


            // If you need to know the origin of the message in the backend,
            // set it from within the content script -- do not allow it to be
            // controlled via the DOM
            // message.origin = window.location.origin
        }
    }
})

function validateMessageSource(data: MessagePayload): boolean {
    return data.customActionType !== undefined;
}


console.log(window);
// @ts-ignore
console.log(window.Arweave);
// @ts-ignore
// @ts-ignore
// console.log(window.arweaveWallet.wallets);

/*
      case "postComment":
        return await postComment(state, action);
      case "upvoteComment":
        return await upvoteComment(state, action);
      case "downvoteComment":
        return await downvoteComment(state, action);
      case "upvoteSite":
        return await upvoteSite(state, action);
      case "downvoteSite":
        return await downvoteSite(state, action);
      case "readComment":
        return await readComment(state, action);
      case "readComments":
        return await readComments(state, action);
      case "readSite":
        return await readSite(state, action);
 */


function postComment(ctx: Contract, cmd: ActionCreateCommentCommand): Promise<WriteInteractionResponse | null> {
    return ctx.writeInteraction({
        function: ContractActionType.POST_COMMENT.toString(),
        content: cmd.message,
        originHash: cmd.hash,
    });
}

function upvoteComment(ctx: Contract, cmd: ActionUpvoteCommand): Promise<WriteInteractionResponse | null> {
    return ctx.writeInteraction({
        function: ContractActionType.UPVOTE_COMMENT.toString(),
        commentId: cmd.commentId,
        originHash: cmd.hash,
    });
}

function downvoteComment(ctx: Contract, cmd: ActionUpvoteCommand): Promise<WriteInteractionResponse | null> {
    return ctx.writeInteraction({
        function: ContractActionType.DOWNVOTE_COMMENT.toString(),
        commentId: cmd.commentId,
        originHash: cmd.hash,
    });
}

/**
 * Do you really need comments for this? ;)
 */
function readAllComments(ctx: Contract, cmd: ActionReadAllCommand): Promise<InteractionResult<any, any>> {
    return ctx.viewState({
        function: ContractActionType.READ_COMMENTS.toString(),
        originHash: cmd.hash,
    });
}

