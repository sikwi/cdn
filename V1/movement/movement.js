function initPage(data)
{
	console.log("getDataFromServer : "+ data+" from url : "+url);

	$('.pie').each(function()
	{
		var gauge = $( this );
		var min = +gauge.data("min");
		var max = +gauge.data("max");
		var range = max-min;
		var width = gauge.width();
		var barColor = gauge.hasClass("temp")?"#f44336":(gauge.hasClass("hum")?"#2196f3":"#ff9800");
		console.log(gauge, min, max, range, width);

		gauge.easyPieChart({
			barColor: barColor,
			trackColor: '#e0f2f1',
			scaleColor: false,
			rotate:-35,
			angle:70,
			lineWidth: width/7,
			trackWidth: width/7,
			size:width,
			lineCap: 'butt',
			onStep: function(from, to, percent) {
				gauge.find('.percent span').text(Math.round((percent/100)*range+min));
			}
		});
	})

	var ctx = $("#chart").get(0).getContext("2d");
	var data3 = [
		{
			label: '',
			strokeColor: '#CCC',
			fillColor: "#CCC",
			data: [
				{
					x: new Date('2011-04-11T11:45:00'),
					y: 1
				},
				{
					x: new Date('2011-04-11T12:51:00'),
					y: 1
				},
				{
					x: new Date('2011-04-11T14:10:00'),
					y: 0
				},
				{
					x: new Date('2011-04-11T15:15:00'),
					y: 1
				},
				{
					x: new Date('2011-04-11T17:00:00'),
					y: 1
				},
				{
					x: new Date('2011-04-11T21:00:00'),
					y: 0
				},
				{
					x: new Date('2011-04-12T13:00:00'),
					y: 1
				}
			]
		}];

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
		scaleLabel: "<%=value%>"
	});
}
