// Shorthand for $( document ).ready()
$(function() {
    chrome.runtime.sendMessage({action:"getDetectedBox"},(data)=>{
        console.log("getDetectedBox", data);
        $("#ndet").text(Object.keys(data).length);
        $("#downdet").click(()=>{
            saveTemplateAsFile("Det_"+new Date().getTime()+".json",data);
        });
    });
    
    chrome.runtime.sendMessage({action:"getNewBox"},(data)=>{
        console.log("getNewBox",data);
        $("#nnotdet").text(data.length);
        $("#downnotdet").click(()=>{
            saveTemplateAsFile("NotDet_"+new Date().getTime()+".json",data);
        });
    });

    
    
});


const saveTemplateAsFile = (filename, dataObjToWrite) => {
    const blob = new Blob([JSON.stringify(dataObjToWrite,null,3)], { type: "text/json" });
    const link = document.createElement("a");

    link.download = filename;
    link.href = window.URL.createObjectURL(blob);
    link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

    const evt = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
    });

    link.dispatchEvent(evt);
    link.remove()
};