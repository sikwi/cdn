function initPage(data)
{
	console.log("getDataFromServer : "+ data+" from url : "+url);
	
	$("#content.keypad button").each(function(elm)
	{
		$( this ).addClass("waves-effect");
		$( this ).addClass("waves-light");
		$( this ).addClass("btn-large");
	})

	$("#content.keypad button.blue").each(function(elm)
	{
		$( this ).addClass("blue");
	})
}