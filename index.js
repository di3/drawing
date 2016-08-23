var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var size = 10;
var dragging = false;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function putPoint(e) {
	if (dragging) {
		// take care of zoomed and canvas offsets
		var rect = canvas.getBoundingClientRect(),
				x = e.clientX - rect.left,
				y = e.clientY - rect.top;
		context.lineTo(x, y);
		context.stroke();
		context.beginPath();
		context.arc(x, y, (size/2), 0, Math.PI*2);
		context.fill();
		context.beginPath();
		context.moveTo(x, y);
	}
}

/* handle touchscreen */
function touchEngage(e) {
	touchPutPoint(e);
}
function touchPutPoint(e) {
	if (e.touches) {
		for (var i in e.touches) {
      var touch = e.touches[i]; // Get the information for finger #i
			// the putPoint function will handle offsets
			var touchX=touch.pageX;
			var touchY=touch.pageY;
			dragging = true;
			putPoint({clientX:touchX,clientY:touchY});
			dragging = false;
		}
	}
	e.preventDefault();
}
function touchDisengage(e) {
	context.beginPath();
	e.preventDefault();
}

// Prevent scrolling when touching the canvas
document.body.addEventListener("touchstart", function (e) {
  if (e.target == canvas) {
    e.preventDefault();
  }
}, false);
document.body.addEventListener("touchend", function (e) {
  if (e.target == canvas) {
    e.preventDefault();
  }
}, false);
document.body.addEventListener("touchmove", function (e) {
  if (e.target == canvas) {
    e.preventDefault();
  }
}, false);

/* handle mouse events */
function mouseEngage(e) {
	dragging = true;
	putPoint(e);
}

function mouseDisengage(e) {
	dragging = false;
	context.beginPath();
}

canvas.addEventListener('touchstart', touchEngage, false);
canvas.addEventListener('touchmove', touchPutPoint, false);
canvas.addEventListener('touchend', touchDisengage, false);

canvas.addEventListener('mousedown', mouseEngage);
canvas.addEventListener('mousemove', putPoint);
canvas.addEventListener('mouseup', mouseDisengage);

var colors = [
	'#000000',
	'#cecece',
	'#ffffff',
	'#ff0000',
	'#00ff00',
	'#0000ff',
	'#efef00',
	'#ffaf33',
	'#9f339f'
];

for (var i=0, n=colors.length; i<n; i++){
	var swatch = document.createElement('div');
	swatch.className = 'swatch';
	swatch.style.backgroundColor = colors[i];
	swatch.addEventListener('click', setSwatch);
	document.getElementById('colors').appendChild(swatch);
}

function setColor(color){
	context.fillStyle = color;
	context.strokeStyle = color;
	var active = document.getElementsByClassName('active')[0];
	if (active) {
		active.className = 'swatch';
	}
}

function setSwatch(e) {
	//identify swatch
	var swatch = e.target;
	//set color
	setColor(swatch.style.backgroundColor);
	//give active class
	swatch.className += ' active';
}

setSwatch({target: document.getElementsByClassName('swatch')[0]});

function incSize() {
	if (size == 1) {
		size = 10;
	} else if (size >= 190) {
		size = 200;
	} else {
		size += 10;
	}
	context.lineWidth = size;
	document.getElementById('valSize').innerHTML = size;
}
function decSize() {
	if (size <= 10) {
		size = 1;
	} else { 
		size -= 10;
	}
	context.lineWidth = size;
	document.getElementById('valSize').innerHTML = size;
}

document.getElementById('decSize').addEventListener('click', decSize);
document.getElementById('incSize').addEventListener('click', incSize);

incSize();

document.getElementById('save').addEventListener('click', saveImage);

function saveImage() {
	var data = canvas.toDataURL();
	window.open(data, '_blank', 'location=0, menubar=0');
}

document.getElementById('clear').addEventListener('click', clearImage);
function clearImage() {
	context.clearRect(0,0,canvas.width,canvas.height);
}
