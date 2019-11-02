'use strict';
var colorPickerOpen = false;

function hslToRgb(_h, _s, _l)
{
	this.r = null;
	this.g = null;
	this.b = null;
	
	var h = _h / 360;
	var s = _s / 100;
	var l = _l / 100;
	
	var hue2rgb = function(p, q, t)
	{
		if(t < 0) t += 1;
		if(t > 1) t -= 1;
		if(t < 1/6) return p + (q - p) * 6 * t;
		if(t < 1/2) return q;
		if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
		return p;
	}

	this._init = function()
	{
		var r,g,b;
		if (s == 0)
		{
			r = g = b = l;
		}
		var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		var p = 2 * l - q;
		r = hue2rgb(p, q, h + 1/3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1/3);
		
		this.r = Math.round(r * 255);
		this.g = Math.round(g * 255);
		this.b = Math.round(b * 255);
	}
	this._init();
}

function rgbToHsl(_r, _g, _b)
{
	var h, s, l;
	
	var r = _r;
	var g = _g;
	var b = _b;

	this._init = function()
	{
		r /= 255, g /= 255, b /= 255;
		
		var max = Math.max(r,g,b), min = Math.min(r,g,b);
		
		var h, s, l = (max + min) / 2;
		
		if (max == min)
			h = s = 0;
		else
		{
			var d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			
			switch (max)
			{
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
					break;
				case g:
					h = (b - r) / d + 2;
					break;
				case b:
					h = (r - g) / d + 4;
					break;
			}
			h /= 6;
		}
		this.h = Math.round(h*360);
		this.s = Math.round(s*100);
		this.l = Math.round(l*100);
	}
	this._init();
}

function hexToRgb(hex)
{
	var r, g , b;
	
	this._init = function()
	{
		if (hex.length == 3)
		{
			hex = hex.substring(0,1) + hex.substring(0,1) + hex.substring(1,2) + hex.substring(1,2) + hex.substring(2,3) + hex.substring(2,3);
		}
		
		this.r = parseInt((hex.substring(0,2)),16);
		this.g = parseInt((hex.substring(2,4)),16);
		this.b = parseInt((hex.substring(4,6)),16);
	}
	this._init();
}

function rgbToHex(r,g,b)
{
	r = r.toString(16);
	g = g.toString(16);
	b = b.toString(16);
	
	while(r.length < 2)
		r = '0' + r;
	while(g.length < 2)
		g = '0' + g;
	while(b.length < 2)
		b = 0 + b;

	return (r + g + b);
}

function colorPicker()
{
	var parent = $('colorPickerPopup');	
	var indicator = $('colorPicker-cursor');
	var stack = $('colorPicker-stack');
	
	var satBox = $('colorPicker-saturation');
	var hueBox = $('colorPicker-hue');
	
	var satStack = $('colorPicker-satStack');
	var satSlider = $('colorPicker-saturation-slider');
	
	var hexTextbox = $('colorPicker-hexTextbox');
	
	var rgbR = $('colorPicker-rgbR-textbox');
	var rgbG = $('colorPicker-rgbG-textbox');
	var rgbB = $('colorPicker-rgbB-textbox');
	
	var hslH = $('colorPicker-hslH-textbox');
	var hslS = $('colorPicker-hslS-textbox');
	var hslL = $('colorPicker-hslL-textbox');
	
	var _rgb, _hsl;
	
	var preview = $('colorPicker-preview');

	// variables to hold the events so we can remove them later
	var hueEvents, satEvents;
	
	var hsl = {};
		
	this.getHSL = function()
	{
		return hsl;
	}
	
	this.getRGB = function()
	{
		var rgb = new hslToRgb(hsl.h, hsl.s, hsl.l);
		return rgb;
	}
	
	var moveCursors = function()
	{
		if (isNaN(hsl.h) || isNaN(hsl.s) || isNaN(hsl.l) || isNaN(hsl.a))
			return;

		indicator.style.backgroundPosition = (parseInt(hsl.h)) + 'px ' + ((360 - parseInt(hsl.l) / .28) ) + 'px';
		satStack.style.backgroundPosition = 'center ' + ((360 - parseInt(hsl.s) / .28) + 2) + 'px';
	}
	
	var updatePreview = function()
	{
		if (isNaN(hsl.h) || isNaN(hsl.s) || isNaN(hsl.l) || isNaN(hsl.a))
			return;

		preview.style.backgroundColor = '';
		preview.style.backgroundColor = 'hsl(' + hsl.h + ',' + hsl.s + '%,' + hsl.l +'%)';


		satSlider.style.backgroundImage = 'linear-gradient(to top, hsl(' + hsl.h + ',0%,' + hsl.l +'%), hsl(' + hsl.h + ',100%,' + hsl.l + '%))';
	}
	
	var handleTextbox = function(evt)
	{
		
		var textbox = evt.target;
		var val = textbox.value;
		var max = parseInt(textbox.getAttribute('max'));
		
		if (val > max)
			evt.target.value = max;
		
		if (val < 0 || val == null)
			evt.target.value = 0;
		
		if (textbox.className != 'hex-textbox' && isNaN(val))
		{
			console.log("Textbox value is NaN");
			return;
		}
		
		switch (textbox.className)
		{
			case 'hex-textbox':
				var RGB = new hexToRgb(val);
				
				if (isNaN(RGB.r) | isNaN(RGB.g) | isNaN(RGB.b))
					break;
				
				rgbR.value = RGB.r;
				rgbG.value = RGB.g;
				rgbB.value = RGB.b;
				
				var HSL = new rgbToHsl(RGB.r, RGB.g, RGB.b);
				
				if (isNaN(HSL.h) | isNaN(HSL.s) | isNaN(HSL.l))
					break;
					
				hslH.value = HSL.h;
				hslS.value = HSL.s;
				hslL.value = HSL.l;
				
				hsl.h = HSL.h;
				hsl.s = HSL.s;
				hsl.l = HSL.l;
				break;

			case 'hsl-h-textbox':
				hsl.h = val;
				break;
			case 'hsl-s-textbox':
				hsl.s = val;
				break;
			case 'hsl-l-textbox':
				hsl.l = val;
				break;
				
			case 'rgb-r-textbox':
			case 'rgb-g-textbox':
			case 'rgb-b-textbox':
				var r = rgbR.value;
				var g = rgbG.value;
				var b = rgbB.value;
				
				// update HSL textboxes
				var HSL = new rgbToHsl(r,g,b);
				
				if (isNaN(HSL.h) | isNaN(HSL.s) | isNaN(HSL.l))
					break;

				hslH.value = HSL.h;
				hslS.value = HSL.s;
				hslL.value = HSL.l;
				
				hsl.h = HSL.h;
				hsl.s = HSL.s;
				hsl.l = HSL.l;
				
				
				// update hex textbox
				hexTextbox.value = rgbToHex(parseInt(r), parseInt(g), parseInt(b));
				break;
		}
		
		if (textbox.className == 'hsl-h-textbox' ||
			textbox.className == 'hsl-s-textbox' ||
			textbox.className == 'hsl-l-textbox')
		{
			var RGB = new hslToRgb(hsl.h, hsl.s, hsl.l);
			if (isNaN(RGB.r) | isNaN(RGB.g) | isNaN(RGB.b))
				return;
			rgbR.value = RGB.r;
			rgbR.value = RGB.g;
			rgbR.value = RGB.b;
			
			hexTextbox.value = rgbToHex(RGB.r, RGB.g, RGB.b);
		}
		
		moveCursors();
		updatePreview();
	}
	
	// a seperate class for the event listeners
	function mouseListeners(_target)
	{
		var target_el = _target;
		var target = target_el.className;
		var mouseDown = false;
		var mouseX, mouseY;
		
		var _mouseUp = function(evt)
		{
			indicator.hidden = false;
			satStack.removeAttribute('dragging');

			if (!mouseDown)
				return;
			
			mouseDown = false;
		
			_updateMousePos(evt);
			if (target == 'colorPicker-hue')
			{
				indicator.style.backgroundPosition = (mouseX) + 'px ' + (mouseY) + 'px';
			}
		}
		
		var _mouseDown = function(evt)
		{
			if (evt.target.className != target)
				return;
			
			evt.preventDefault();
			
			_updateMousePos(evt);

			if (evt.target == satStack)
				satStack.setAttribute('dragging', true);
			
			mouseDown = true;
		}
		
		var getMousePos = function(evt)
		{
			var rect = target_el.getBoundingClientRect();
			
			var _x, _y;
			
			_x = evt.clientX - rect.left;
			_y = evt.clientY - rect.top;
			
			if (_x < 0)
				_x = 0;
			if (_x > 360)
				_x = 360;
			
			if (_y < 0)
				_y = 0;
				
			if (_y > 358)
				_y = 358;
			
			mouseX = _x;
			mouseY = _y;
		}
		
		var _updateMousePos = function(evt)
		{
			getMousePos(evt);

			if (target == 'colorPicker-hue')
			{
			
				if(evt.target.className == 'colorPicker-hue')
				{
					indicator.hidden = true;
				}
				else
				{
					indicator.hidden = false;
					indicator.style.backgroundPosition = (mouseX) + 'px ' + (mouseY) + 'px';
				}
			
				hsl.h = Math.round(mouseX);
				hsl.l = 100 - Math.round(mouseY * 0.28);
			}
			if (target == 'colorPicker-satStack')
			{
				satStack.style.backgroundPosition = 'center ' + (mouseY + 4) + 'px';
				
				hsl.s = 100 - Math.round(mouseY * 0.28);
			}
			
			_rgb = new hslToRgb(hsl.h, hsl.s, hsl.l);
			
			rgbR.value = _rgb.r;
			rgbG.value = _rgb.g;
			rgbB.value = _rgb.b;
			
			hslH.value = hsl.h;
			hslS.value = Math.round(hsl.s);
			hslL.value = hsl.l;
			
			hexTextbox.value = rgbToHex(_rgb.r, _rgb.g, _rgb.b);
			
			
			updatePreview();
			satOpacity();
		}
		
		var _mouseMove = function(evt)
		{
			if (!mouseDown)
				return;
				
			_updateMousePos(evt);
		}
		
		this._uninit = function()
		{
			window.removeEventListener('mouseup', _mouseUp, false);
			window.removeEventListener('mousedown', _mouseDown, false);
			window.removeEventListener('mousemove', _mouseMove, false);
			
			console.log("removing mouse events");
		}
		
		var _init = function()
		{	
			window.addEventListener('mouseup', _mouseUp, false);
			window.addEventListener('mousedown', _mouseDown, false);
			window.addEventListener('mousemove', _mouseMove, false);
			
			console.log("adding mouse events");
		}
		_init();
	}
	
	var satOpacity = function()
	{
		satBox.style.opacity = (100 - hsl.s) / 100;
		updatePreview();
	}

	this.acceptDlg = function()
	{
		for (var e = 0; e < 12; e++)
			$('colorContainer').children[e].removeAttribute('selected');
		$('customColorButton').setAttribute('selected', true);
		
		closePopup();
	}
	
	var _uninit = function()
	{
		hueEvents._uninit();
		satEvents._uninit();
		
		colorPickerOpen = false;
	}

	this._init = function()
	{
		if (colorPickerOpen)
			return;
			
		var items = [hexTextbox, rgbR, rgbG, rgbB, hslH, hslS, hslL];
		for (var i in items)
			items[i].addEventListener('input', handleTextbox, false);


		hsl.h = 180;
		hsl.s = 50;
		hsl.l = 50;
		hsl.a = 100;

		moveCursors();
		updatePreview();
		satOpacity();

		hueEvents = new mouseListeners(hueBox);
		satEvents = new mouseListeners(satStack);

		colorPickerOpen = true;
	}
	
	this._init();
}