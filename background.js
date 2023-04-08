/**
* ---------------------------------------------------------------------------------
* | Background |
* ---------------------------------------------------------------------------------
* - content scropt와 통신하여 확장 프로그램 기능 ON/OFF 제어 
**/

const youtube = 'https://www.youtube.com'
var isNewest = false

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

chrome.runtime.onMessage.addListener(
  async (request, sender, sendResponse)=> {
    console.log(request.key);
    const currentTab = await getCurrentTab();
    isNewest = request.key
    if(!isNewest){
      chrome.scripting.removeCSS({
        files: ["oldest.css"],
        target: { tabId: currentTab.id },
      });
      chrome.action.setBadgeText({
        tabId: currentTab.id,
        text: "OFF",
      });
    }
  }
);

chrome.action.onClicked.addListener(async (tab) => {

  if ((tab.url.startsWith(youtube) && tab.url.includes('videos'))) {

    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    const nextState = isNewest && (prevState === 'OFF') ? 'ON' : 'OFF';

    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState,
    });

    if (nextState === "ON" && isNewest) {
      await chrome.scripting.insertCSS({
        files: ["oldest.css"],
        target: { tabId: tab.id },
      });
    } else if (nextState === "OFF") {
      await chrome.scripting.removeCSS({
        files: ["oldest.css"], 
        target: { tabId: tab.id },
      });
    }
  }
});
