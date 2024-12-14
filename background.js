var detectedBox = {};
var newBox = [];
console.log("BIBLIO BACKGROUND")

chrome.storage.local.get(["detectedBox"]).then((items) => {
  console.log("detectedBox get", items.detectedBox)
  if (typeof items.detectedBox != "undefined") {
    detectedBox = JSON.parse(items.detectedBox);
  }
}).catch(error => console.log(error));;

chrome.storage.local.get(["newBox"]).then((items) => {
  console.log("newBox get",items.newBox)
  if (typeof items.newBox != "undefined") {
    newBox = JSON.parse(items.newBox);
  }
}).catch(error => console.log(error));;



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case "enable":
          console.log("Active Icon");
          doInCurrentTab((tab)=>{
              chrome.action.setIcon({tabId: sender.tab.id, path: "favicon_inuse.png"});
              sendResponse(sender.tab.id);
          });
        break;
        case "iconbadge": 
          console.log("Set badge",message.value)
          doInCurrentTab((tab)=>{
            chrome.action.setBadgeText({tabId: sender.tab.id, text: message.value});
            sendResponse(sender.tab.id);
          });
        break;
        case "getBoxes": 
          console.log("Get boxes");
          fetch("data.json").then(function (res) {
            return res.json();
          }).then(function (data) {
            sendResponse(data);
          })
        break;
        case "detectedBox": 
          console.log("Set Detected Box",message.value);
          if (!detectedBox[message.value.box.name]) {
            detectedBox[message.value.box.name] = message.value.box;
            detectedBox[message.value.box.name].detected = [];
          }
          detectedBox[message.value.box.name].detected.push(message.value.crtBoxText);
          chrome.storage.local.set({ "detectedBox": JSON.stringify(detectedBox) }).then(() => {console.log("detectedBox saved")});
        break;
        case "newBox": 
          console.log("Set New Box",message.value);
          if (!newBox.includes(message.value)) newBox.push(message.value)
          chrome.storage.local.set({ "newBox": JSON.stringify(newBox) }).then(() => {console.log("newBox saved")});
        break;
        case "getDetectedBox": 
          console.log("Get detectedBox",message.value);
          chrome.storage.local.get(["detectedBox"]).then((items) => {
            console.log("GET detectedBox", items.detectedBox)
            if (typeof items.detectedBox != "undefined") {
              detectedBox = JSON.parse(items.detectedBox);
              sendResponse(detectedBox);
            } else {
              sendResponse({});
            }
          });
        break;
        case "getNewBox": 
          console.log("Get newBox",message.value);
          chrome.storage.local.get(["newBox"]).then((items) => {
            console.log("GET newBox",items.newBox)
            if (typeof items.newBox != "undefined") {
              newBox = JSON.parse(items.newBox);
              sendResponse(newBox);
            } else {
              sendResponse([]);
            }
          });
        break;

    }
    console.log(message,message.action);
    return true;
});

function doInCurrentTab(tabCallback) {
    chrome.tabs.query(
        { currentWindow: true, active: true },
        function (tabArray) { tabCallback(tabArray[0]); }
    );
}