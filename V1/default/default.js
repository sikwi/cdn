var data = {s:0};

function initPage(receivedData)
{
    console.log("initPage", receivedData);
    data = receivedData;
    $(".name").text(data.name);
    $(".json").text(JSON.stringify(data, undefined, 2));
}

function result(receivedData){
	console.log("receivedData", receivedData);
	Materialize.toast('Sended', 4000);
}
