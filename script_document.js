console.log('--- Version 1.0 BiblioAutoValid --- SCRIPT_DOCUMENT')
chrome.runtime.sendMessage({action:"enable"})

setInterval(()=>{
    ID = "#ti_1-subField-010-0-mul-a-0-inputEl";
    if (!$(ID).length) ID = "#ti_1-subField-073-0-mul-a-0-inputEl"
    if (!$(ID).length) ID = '[id$=subField-010-0-mul-a-0-inputEl]';
    if (!$(ID).length) ID = '[id$=subField-073-0-mul-a-0-inputEl]';    
    if ($("#digitalCollection-orText").length && !$("#digitalCollection-orText").hasClass("RDDC") &&  $(ID) && $(ID).val().length) {
        var img = "https://api.birdywood.fr/api/ia/0f9b8e66-1da6-4b45-bd48-a18c98dbdadf/" + $(ID).val().replaceAll('-','')// + " filetype:jpg"
        var img_thumb = "https://api.birdywood.fr/api/ia/image/" + $(ID).val().replaceAll('-','')// + " filetype:jpg"
        $("#digitalCollection-orText").addClass("RDDC");
        $("#digitalCollection-orText").html(`<span class="btn btn-primary btn-decitre">Récupération automatique | Decitre <img src="${img}" style="height:23px;"/></span><span class="btn btn-primary btn-google">Mini <img src="${img_thumb}" style="height:23px;"/></span>`);
        $("#digitalCollection-orText .btn-decitre").click(()=>{
            toDataURL(img);
        })
        $("#digitalCollection-orText .btn-google").click(()=>{
            toDataURL(img_thumb);
        })        
    }
},1000);

async function toDataURL(url) {
    const blob = await fetch(url).then(res => res.blob());
    const file = new File([blob], "filename.jpg",{type:"image/jpeg", lastModified:new Date().getTime()});
    const dt = new DataTransfer();
    dt.items.add(file);
    document.getElementById('digitalCollection-photo-manager-fileupload').files = dt.files;

    var element = document.getElementById('digitalCollection-photo-manager-fileupload');
    var event = new Event('change');
    element.dispatchEvent(event);
}