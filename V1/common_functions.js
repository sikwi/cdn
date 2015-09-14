var url = "";

window.addEventListener( "message",
function (e) {
	if(e.data.indexOf("sendURL")==0){
		url = e.data.split("sendURL:").join("");
	}else if(e.data.indexOf("data:")==0){
		initPage(JSON.parse(e.data.split("data:").join("")));
		$(".preloader").hide();
	}else if(e.data.indexOf("result:")==0){
		if(result)
		{
			$(".preloader").hide();
			result(JSON.parse(e.data.split("result:").join("")));
		}
	}else if(e.data.indexOf("title:")==0){
		var title = e.data.split("title:").join("");
		title = title.substr(0,1).toUpperCase()+title.substr(1);
		$("#hdr h1").text(title);
	}
},
false);

$(document).ready(function() {
	if(window.parent != window)
		window.parent.postMessage("getData", "*");
	FastClick.attach(document.body);
	$('select').material_select();
});

function setUrl(urlTo)
{
	window.parent.postMessage("setUrl:"+url+""+urlTo, "*");
}

function setUrlPost(urlTo, args){
	var form = '';
    $.each( args, function( key, value ) {
        form += '<input type="hidden" name="'+key+'" value="'+value+'">';
    });
    $('<form action="'+ url +""+ urlTo + '" method="POST">'+form+'</form>').appendTo('body').submit();
}

function sendPostData(urlTo, args){
	$(".preloader").show();
	window.parent.postMessage("sendPost:"+url+""+urlTo+";"+JSON.stringify(args), "*");
}