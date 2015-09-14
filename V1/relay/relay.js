function initPage(result)
{
	console.log("getDataFromServer : ", result," from url : ",url);

	$("#content.relay .switch #checkbox").prop("checked", result.s);
	$("#content.relay .switch #checkbox").on("change", function()
	{
		setTimeout(function(){
			setUrlPost("", {s:(+$("#content.relay .switch #checkbox").prop("checked"))});
		}, 300);
	});
	
	$("#content.relay .switch label .lever").addClass("needsclick");

	if(result.h && result.h.length>0)
	{
		$("#content.relay #chart").show();
		var ctx = $("#content.relay #chart").get(0).getContext("2d");
		var data3 = [
				{
					label: '',
					strokeColor: '#CCC',
					fillColor: "#CCC",
					data:[]
				}];
		
		for (var i = 0; i < result.h.length; i++) {
			data3[0].data.push({x:new Date(result.h[i].d * 1000), y:result.h[i].s});
		};
		
		var myDateLineChart = new Chart(ctx).Scatter(data3, {
			bezierCurve: false,
			scaleShowGridLines:false,
			showTooltips: true,
			scaleShowHorizontalLines: true,
			scaleShowLabels: true,
			stepLine:true,
			pointDot:true,
			pointHitDetectionRadius:20,
			scaleType: "date",
			scaleLabel: "<%if(value==1){%>On<%}else{%>Off<%}%>"
		});
	}
}