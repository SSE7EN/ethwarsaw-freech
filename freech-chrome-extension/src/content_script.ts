import random from "random";
import {MessagePayload} from "./app/domain/MessagePayload";
import {MessageResponseGeneral} from "./app/domain/MessageResponseGeneral";
import {ContractActionType} from "./app/domain/contract/ContractActionType";

let extID: string = chrome.runtime.id;


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ?
            "CS: from a content script:" + sender.tab.url :
            "CS: from the extension");
        if (sender.tab === undefined) {
            console.log("CS: Request redirected to IS");
            let requestData = request as MessagePayload;
            if(requestData.customActionType === ContractActionType.SET_EXT_ID){
                console.log("Setting extension id to: " + requestData.textMessage)
            }
            window.postMessage(requestData, '*');
        }

    }
);

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     console.log("Seconadary listener");
//     console.log(sender.tab);
// })

window.addEventListener("message", (evt) => {
    const data = evt.data as MessageResponseGeneral;
    if (data.dataType !== undefined) {
        console.log("Seconadary listener 2");
        console.log(extID);
        console.log(data);
        chrome.runtime.sendMessage(extID, data).catch(reason => {
            console.warn("Could not send :/");
        })
    }
    return true;
});


function injectScript(file_path: string, tag: string) {
    console.log("Injecting " + file_path);
    var node = document.getElementsByTagName(tag)[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', file_path);
    node.appendChild(script);
    console.log("injecting done");
}


console.log("Content script exec");
console.log(random.float()); // 0.2149383367670885
console.log(random.int(0, 100)); // 72
console.log(random.boolean()); // true

console.log(window)
// @ts-ignore
console.log(window.Arweave)
// @ts-ignore
console.log(window.arweaveWallet)


// window.addEventListener("arweaveWalletLoaded", () => {
//   // @ts-ignore
//   let t= window.arweaveWallet;
//   console.log(t);
//   // @ts-ignore
//   window.arweaveWallet.connect(['ACCESS_ADDRESS']);
// });


injectScript(chrome.runtime.getURL("inject.js"), "body")

console.log('content init done');

