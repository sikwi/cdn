var data = {s:0};

function initPage(receivedData)
{
    data = receivedData;
    $("h2").text(data.name);
    $(".json").text(JSON.stringify(data, undefined, 2));
}

function result(receivedData){
	console.log("receivedData", receivedData);
	Materialize.toast('Sended', 4000);
}
