;(function(factory) {
    if(typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    }
    else if(typeof exports === 'object') {
        module.exports = factory(require("jquery"));
    }
    else {
        factory(jQuery);
    }
}
(function($) {
    var pluginName = "tinycolorpicker"
    ,   defaults   = {
            colors : ["#ffffff", "#A7194B","#FE2712","#FB9902","#FABC02","#FEFE33","#D0EA2B","#66B032","#0391CE","#0247FE","#3D01A5","#8601AF"]
        ,   backgroundUrl : null
        }
    ;

    function Plugin($container, options) {
        /**
         * The options of the colorpicker extended with the defaults.
         *
         * @property options
         * @type Object
         */
        this.options = $.extend({}, defaults, options);

        /**
         * @property _defaults
         * @type Object
         * @private
         * @default defaults
         */
        this._defaults = defaults;

        /**
         * @property _name
         * @type String
         * @private
         * @final
         * @default 'tinycolorpicker'
         */
        this._name = pluginName;

        var self = this
        ,   $track = $container.find(".track")
        ,   $number = $container.find(".number")
        ,   $color = $container.find(".color")
        ,   $canvas = null
        ,   $colorInput = $container.find(".colorInput")
        ,   $dropdown = $container.find(".dropdown")
        ,   $dropdownItem = $dropdown.find("li").remove()

        ,   context = null
        ,   mouseIsDown = false
        ,   hasCanvas = !!document.createElement("canvas").getContext
        ,   touchEvents = "ontouchstart" in document.documentElement
        ;

        /**
         * The current active color in hex.
         *
         * @property colorHex
         * @type String
         * @default ""
         */
        this.colorHex = "";

        /**
         * The current active color in rgb.
         *
         * @property colorRGB
         * @type String
         * @default ""
         */
        this.colorRGB = "";

        /**
         * @method _initialize
         * @private
         */
        function _initialize() {
            if(hasCanvas) {
                $canvas = $("<canvas></canvas>");
                $track.append($canvas);

                context = $canvas[0].getContext( "2d" );

                _setImage();
            }
            else {
                $.each(self.options.colors, function(index, color) {
                    var $clone = $dropdownItem.clone();

                    $clone.css("backgroundColor", color);
                    $clone.attr("data-color", color);

                    $dropdown.append($clone);
                });
            }

            _setEvents();

            return self;
        }

        /**
         * @method _setImage
         * @private
         */
        function _setImage() {
            var colorPicker = new Image()
            ,   backgroundUrl = $track.css("background-image").replace(/"/g, "").replace(/url\(|\)$/ig, "")
            ;

            $track.css("background-image", "none");

            $(colorPicker).load(function() {
            	console.log(this);
                $canvas.attr("width", this.width);
                $canvas.attr("height", this.height);

                context.drawImage(colorPicker, 0, 0, this.width, this.height);
            });

            colorPicker.src = self.options.backgroundUrl || backgroundUrl;
        }

        /**
         * @method _setEvents
         * @private
         */
        function _setEvents() {
            var eventType = touchEvents ? "touchstart" : "mousedown";

            if(hasCanvas) {
                $color.bind(eventType, function(event) {
                    event.preventDefault();
                    event.stopPropagation();


                    if ( $track.is(":visible") === true ) {
					  $track.hide();
					  $color.removeClass("clicked");
					  $container.trigger("change", [self.colorHex, self.colorRGB]);

					} else{
					  $track.show();
					  $color.addClass("clicked");
					}

                    $(document).bind("mousedown.colorpicker", function(event) {
                        $(document).unbind(".colorpicker");
                        $track.hide();
                        $color.removeClass("clicked");
                        $container.trigger("change", [self.colorHex, self.colorRGB]);

                    });
                });

                if(!touchEvents) {
                    $canvas.mousedown(function(event) {
                        mouseIsDown = true;

                        _getColorCanvas(event);

                        $(document).bind("mouseup.colorpicker", function(event) {
                            mouseIsDown = false;

                            $(document).unbind(".colorpicker");

                            $track.hide();
							$color.removeClass("clicked");
							$container.trigger("change", [self.colorHex, self.colorRGB]);

                            return false;
                        });

                        return false;
                    });

                    $canvas.mousemove(_getColorCanvas);
                }
                else {
                    $canvas.bind("touchstart", function(event) {
                        mouseIsDown = true;

                        _getColorCanvas(event.originalEvent.touches[0]);

                        return false;
                    });

                    $canvas.bind("touchmove", function(event) {
                        _getColorCanvas(event.originalEvent.touches[0]);

                        return false;
                    });

                    $canvas.bind("touchend", function(event) {
                        mouseIsDown = false;

                        $track.hide();
                        $color.removeClass("clicked");
                        $container.trigger("change", [self.colorHex, self.colorRGB]);

                        return false;
                    });
                }
            }
            else {
                $color.bind("mousedown", function(event) {
                    event.preventDefault();
                    event.stopPropagation();

                    $dropdown.toggle();
                });

                $dropdown.delegate("li", "mousedown", function(event) {
                    event.preventDefault();
                    event.stopImmediatePropagation();

                    var color = $(this).attr("data-color");

                    self.setColor(color);
                    $container.trigger("change", [self.colorHex, self.colorRGB]);

                    $color.removeClass("clicked");
                    $dropdown.hide();
                });
            }
        }

        /**
         * @method _getColorCanvas
         * @private
         */
        function _getColorCanvas(event) {
            if(mouseIsDown) {
                var $target = $(event.target)
                ,   offset = $target.offset()
                ,   colorData = context.getImageData(event.pageX - offset.left, event.pageY - offset.top, 1, 1).data
                ;

                self.setColor("rgb(" + colorData[0] + "," + colorData[1] + "," + colorData[2] + ")");

                /**
                 * The change event will trigger when a new color is set.
                 *
                 * @event change
                 */
                //$container.trigger("change", [self.colorHex, self.colorRGB]);
            }
        }

        /**
         * Set the color to a given hex or rgb color.
         *
         * @method setColor
         * @chainable
         */
        this.setColor = function(color) {
            if(color.indexOf("#") >= 0) {
                self.colorHex = color;
                self.colorRGB = self.hexToRgb(self.colorHex);
            }
            else {
                self.colorRGB = color;
                self.colorHex = self.rgbToHex(self.colorRGB);
            }

            $color.find(".colorInner").css("backgroundColor", self.colorHex);
            $colorInput.val(self.colorHex);

            var colorData = self.hexToRgbArray(self.colorHex);
            
            $number.text(Math.ceil(colorData[0]/2.55)+"%");

            if(colorData[0]>127)
            	$number.css("color","#000000");
            else
            	$number.css("color","#FFFFFF");
        };

        /**
         * Convert hex to rgb
         *
         * @method hexToRgb
         * @chainable
         */
        this.hexToRgb = function(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

            return "rgb(" + parseInt(result[1], 16) + "," + parseInt(result[2], 16) + "," + parseInt(result[3], 16) + ")";
        };

        this.hexToRgbArray = function(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            result = [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
            return result;
        };

        /**
         * Convert rgb to hex
         *
         * @method rgbToHex
         * @chainable
         */
        this.rgbToHex = function(rgb) {
            var result = rgb.match(/\d+/g);

            function hex(x) {
                var digits = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F");
                return isNaN(x) ? "00" : digits[(x - x % 16 ) / 16] + digits[x % 16];
            }

            return "#" + hex(result[0]) + hex(result[1]) + hex(result[2]);
        };

       return _initialize();
    }

    /**
     * @class tinycolorpicker
     * @constructor
     * @param {Object} options
        @param {Array} [options.colors=[]] fallback colors for old browsers (ie8-).
        @param {String} [options.backgroundUrl=''] It will look for a css image on the track div. If not found it will look if there's a url in this property.
     */
    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if(!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin($(this), options));
            }
        });
    };
}));
var data = {r:10, g:30, b:100};

function initPage(receivedData)
{
	console.log("getDataFromServer : ", receivedData ," from url : ", url);
	data = receivedData;

	var $box = $('#colorPicker');
    $box.tinycolorpicker();

    var decColor = "#"+((1 << 24) + (data.r << 16) + (data.g << 8) + data.b).toString(16).slice(1);
    var picker = $box.data("plugin_tinycolorpicker");
    console.log(decColor);
    picker.setColor(decColor);

    $box.on("change", function(e, hex, rgb)
    {
    	var result = picker.hexToRgbArray(hex);
    	data.r = result[0];
    	data.g = result[1];
    	data.b = result[2];
		sendPostData("", data);
    });
	/*
	initChart('.chartRed', "r");
	initChart('.chartGreen', "g");
	initChart('.chartBlue', "b");
	*/
/*
	var ctx = $("#content.dimmer #chart").get(0).getContext("2d");
	var data3 = [
			{
				label: '',
				strokeColor: '#CCC',
				fillColor: "#CCC",
				data: [
					{
						x: new Date('2011-04-11T11:45:00'),
						y: 25
					},
					{
						x: new Date('2011-04-11T12:51:00'),
						y: 100
					},
					{
						x: new Date('2011-04-11T14:10:00'),
						y: 0
					},
					{
						x: new Date('2011-04-11T15:15:00'),
						y: 34
					},
					{
						x: new Date('2011-04-11T17:00:00'),
						y: 36
					},
					{
						x: new Date('2011-04-11T21:00:00'),
						y: 0
					},
					{
						x: new Date('2011-04-12T13:00:00'),
						y: 100
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
*/
}

function result(receivedData){
	console.log("receivedData", receivedData);
	Materialize.toast('Sended', 4000);
}

function initChart(url, value)
{
	var chart = $(".chart"+url);
	var rangeField = $(".range-field"+url+" input");

	var min = +chart.data("min");
	var max = +chart.data("max");
	var range = max-min;
	var width = chart.width();

	chart.easyPieChart({
		barColor: chart.css( "color" ),
		trackColor: '#EEE',
		scaleColor: false,
		//rotate:-35,
		//angle:70,
		lineWidth: width/7,
		trackWidth: width/7,
		size:width,
		lineCap: 'butt',
		onStep: function(from, to, percent) {
			chart.find('.percent span').text(Math.round((percent/100)*range+min));
		}
	});

	chart.data('easyPieChart').update(data[value]/2.55);
	rangeField.val(data[value]/2.55);

	rangeField.on('input', function () {
		var gaugeChart = chart.data('easyPieChart');
		var percent = rangeField.val();
		gaugeChart.disableAnimation();
		gaugeChart.update(percent);
		gaugeChart.options.onStep(0,0,percent);
	});
	rangeField.trigger("input");

	rangeField.change(function()
	{
		data[value] = Math.round(+rangeField.val()*2.55);
		sendPostData("", data);
		//setUrlPost("", data);
	});
}