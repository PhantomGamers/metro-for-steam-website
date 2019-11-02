'use strict';

var selectedColor = 3;
var decalSelected = 0;
var fontSelected = 'Segoe UI';
var popupOpen = false;
var picker;

window.onload = function()
{
	_init();
};

function $(id)
{
	return document.getElementById(id);
}

function _init()
{
	var colors = ['#DC4FAD','#AC193D','#D24726','#FF8F32','#82BA00','#008A17','#03B3B2','#008298','#5DB2FF','#0072C6','#4617B4','#8C0095'];
	for (var i = 0; i <12; ++i)
	{
		var item = document.createElement('div');
		item.className = 'accentColor-div';
		item.setAttribute('number', i);
		item.style.backgroundColor = colors[i];
		$('colorContainer').appendChild(item);

		item.addEventListener('click', function()
			{
				if (this.getAttribute('selected'))
					return;
				for (var e = 0; e < 12; e++)
					$('colorContainer').children[e].removeAttribute('selected');
				$('customColorButton').removeAttribute('selected');
				this.setAttribute('selected', true);
				selectedColor = this.getAttribute('number');

				localStorage.accentColor = this.getAttribute('number');
				console.log('accent color clicked');
			}, false);
	}

	for (var i = 0; i < 9; ++i)
	{
		var item = document.createElement('div');
		item.className = 'decal-div ' + 'decal' + i;
		item.setAttribute('number', i);
		$('decalContainer').appendChild(item);

		item.addEventListener('click', function()
			{
				if (this.getAttribute('selected'))
					return;
				for (var e = 0; e < 9; e++)
					$('decalContainer').children[e].removeAttribute('selected');
				this.setAttribute('selected', true);
				decalSelected = this.getAttribute('number');

				localStorage.decalSelected = this.getAttribute('number');
				console.log('accent style clicked');
			}, false);
	}

	for (var i = 0; i < document.getElementsByClassName('checkbox').length; ++i)
	{
		document.getElementsByClassName('checkbox')[i].onclick = function()
		{
			if (this.hasAttribute('checked'))
				this.removeAttribute('checked');
			else
				this.setAttribute('checked', 'true');
		}
	}

	try
	{
		if (localStorage.accentColor != undefined)
			selectedColor = localStorage.accentColor;

		if (localStorage.decalSelected != undefined)
			decalSelected = localStorage.decalSelected;
	}
	catch(e)
	{
		console.log("Cookies are disabled. Your selected options will not be saved.");
	}

	// setup some default values
	$('colorContainer').children[selectedColor].setAttribute('selected', true);
	$('decalContainer').children[decalSelected].setAttribute('selected', true);

	picker = new colorPicker();

	populateFonts();
}

function compileStyles()
{
	var colors = ["220 79 173","172 25 61","210 71 38","225 143 50","130 186 0","0 138 23","3 179 178","0 130 153","93 178 255","0 114 198","70 23 180","140 0 149"];
	var decals = ['8="image( x1 - 821, y1 - 375, x1, y1, graphics/decal_steam_btmr)"', '1="image( x1 - 186, y0+40, x1, y0-176, graphics/backgrounds/1)"', '2="image( x1 - 900, y1 - 194, x1, y1, graphics/backgrounds/2)"','3="image( x1 - 603, y1 - 231, x1, y1, graphics/backgrounds/3)"','4="image( x1 - 506, y0+43, x1, y0-298, graphics/backgrounds/4)"','5="image( x1 - 684, y0+40, x1, y0-194, graphics/backgrounds/5_top)"','6="image( x1 - 508, y1 - 103, x1, y1, graphics/backgrounds/5_bot_sm)"','7="image( x1 - 688, y0+81, x1, y0-259, graphics/backgrounds/6)"',''];

	var out_color;
	var color_pickerRGB = picker.getRGB();

	if ($('customColorButton').hasAttribute('selected'))
		out_color = color_pickerRGB.r + ' ' + color_pickerRGB.g + ' ' + color_pickerRGB.b;
	else
		out_color = colors[selectedColor];

	var outFont;

	if (fontSelected == 'Segoe UI')
		outFont = 'basefont="Segoe UI" semibold="Segoe UI Semibold" semilight="Segoe UI Semilight" light="Segoe UI Light"';
	else
		outFont = 'basefont="' + fontSelected + '" semibold="' + fontSelected + '" semilight="' + fontSelected + '" light="' + fontSelected + '"';

	var uinstalledIndicator = $('uinstalledIndicator').hasAttribute('checked') ? '"GameItem_Uninstalled"{render{0="image(x1-18,y1-26,x1,y1,graphics/metro/icons/grid_uninstalled)"}}' : '';
	var uninstalledDimming = $('uninstalledDimming').hasAttribute('checked') ? '"GameItem_Uninstalled GGPlaceholderBG"{alpha 89.25} "GameItem_Uninstalled GamesGridImage"{alpha 89.25}' : '';

	var outString = '"custom.styles"{colors{Focus="' + out_color + ' 255"' + outFont + ' basefont="Helvetica Neue" [$OSX] semibold="Helvetica Neue Medium" [$OSX] semilight="Helvetica Neue Light" [$OSX] light="Helvetica Neue Thin" [$OSX] ' + '}styles{"CSteamRootDialog"{bgcolor=ClientBG render_bg{ 0="fill( x0, y0, x1, y1, ClientBG )" ' + decals[decalSelected] + ' 98="fill( x0, y0, x1, y0+40, FrameBorder)" 99="fill( x0, y0, x1, y0+39, Header_Dark )"}}' + uinstalledIndicator + ' ' + uninstalledDimming +'}}';

	exportStyle(outString);
	openPopup('downloadFilePopup');
}

function exportStyle(string)
{
	$('savepreset-button').href = 'data:text/plain;charset=utf-8;base64,' + btoa(string);
}

function openPopup(popup)
{
	if (popupOpen)
		return;

	$('popupContainer').hidden = false;

	$(popup).hidden = false;
}

function closePopup()
{
	$('popupContainer').hidden = true;

	$('colorPickerPopup').hidden = true;

	$('downloadFilePopup').hidden = true;
}

function populateFonts()
{
	var fonts = ['Segoe UI', 'Arial', 'Helvetica', 'HelveticaNeue', 'Ubuntu', 'Calibri', 'Verdana', 'Roboto', 'Segoe UI Semilight','Century Gothic','New Cicle Fina','Roboto Light', 'Roboto Thin', 'Open Sans', 'Candara'];

	fonts.sort();

	try
	{
		if (localStorage.fontSelected != undefined)
			fontSelected = localStorage.fontSelected;
	}
	catch(e)
	{
	}

	for (var font in fonts)
	{
		var item = document.createElement('button');
		item.className = 'font';
		item.style.fontFamily = fonts[font];
		item.innerHTML = fonts[font];

		if (fonts[font] == fontSelected)
			item.setAttribute('selected', true);

		item.addEventListener('click', function()
			{
				if (this.getAttribute('selected'))
					return;
				for (var e = 0; e < fonts.length; e++)
					$('fontList').children[e].removeAttribute('selected');
				this.setAttribute('selected', true);
				fontSelected = this.innerHTML;

				localStorage.fontSelected = this.innerHTML;
				console.log('font clicked');
			}, false);

		$('fontList').appendChild(item);
	}
}
