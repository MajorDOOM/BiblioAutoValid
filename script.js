console.log('--- Version 1.0 BiblioAutoValid ---')
chrome.runtime.sendMessage({action:"enable"})
var n = 0;
var crtBoxText = "";
var arrBox = [];
chrome.runtime.sendMessage({action:"getBoxes"},(data)=>{
    console.log("Boxes received",data);
    arrBox = data;
});

setInterval(()=>{
    var findBox = false;
    for (var i in arrBox) {
        if ($(arrBox[i].mainBoxId).length && crtBoxText != $(arrBox[i].mainBoxId).text()) {
            crtBoxText = $(arrBox[i].mainBoxId).text();
            var regEx = new RegExp(arrBox[i].regEx);
            if (crtBoxText.match(regEx)) {
                chrome.runtime.sendMessage({action:"detectedBox",value:{box:arrBox[i],crtBoxText:crtBoxText}})
                chrome.runtime.sendMessage({action:"iconbadge",value:(++n).toString()})
                $(arrBox[i].btnId).click();                
                console.log(arrBox[i].name);
                findBox = true;
                return true;
            } else {
                chrome.runtime.sendMessage({action:"newBox",value:{txt:crtBoxText,html:$(arrBox[i].mainBoxId).html().toString()}})
                findBox = true;
            }
        }   
    }
    if (!findBox && arrBox[0] && $(arrBox[0].mainBoxId).length==0) crtBoxText = "";
},100);