function RGBToHex(rgb) {
	var split = rgb.split(',');
	var r = parseInt(split[0]), g = parseInt(split[1]), b = parseInt(split[2]);
    return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function hexToRGB(hex) {
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;
	//console.log (r + "," + g + "," + b);
    return r + "," + g + "," + b;
}
