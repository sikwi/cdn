var data = {s:0};

function initPage(receivedData)
{
    data = receivedData;
    $(".json").text(JSON.stringify(data, undefined, 2));
}

function result(receivedData){
	console.log("receivedData", receivedData);
	Materialize.toast('Sended', 4000);
}