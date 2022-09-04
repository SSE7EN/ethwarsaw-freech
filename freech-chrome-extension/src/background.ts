import unique from "uniq";

// chrome.runtime.onInstalled.addListener(() => {
//   // chrome.storage.sync.set({ color: '#3aa757' });
//   chrome.webNavigation.onCompleted.addListener(() => {
//     chrome.tabs.query({ active: true, currentWindow: true }, ([{ id }]) => {
//       if (id) {
//         chrome.action.disable(id);
//       }
//     });
//   }, { url: [{ hostContains: 'google.com' }] });
// });
var data = [1,1,1,1,1,2,2,2,2];

console.log(unique(data));
