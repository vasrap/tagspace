/**
 * Draws the space.
 */
function drawSpace() {
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * Draws the stars.
 */
function drawStars() {
	for(var i = 0; i < coordinates.length; i++) {
		var starSize = 0;
		if (i % 5 == 0) starSize = 1;
		else if (i % 3 == 0)starSize = 3;
		else if (i % 2 == 0) starSize = 5;
		else starSize = 6;

		staticGlow = starGlows[starSize].static;
		if (i == clickedBody) staticGlow = starGlows[starSize].selected;
		ctx.drawImage(
			staticGlow, 
			(coordinates[i].x * canvas.width) - (starSize * 6.5), 
			(coordinates[i].y * canvas.height) - (starSize * 6.5));

		// Main body.
		ctx.fillStyle = '#fdfdaa';
		ctx.beginPath();
		ctx.arc(coordinates[i].x * canvas.width, coordinates[i].y * canvas.height, starSize, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fill(); 

		// TODO: Fix blinking.
		/*if (Math.random() < 0.01) {
			ctx.drawImage(
				starGlows[starSize].blink, 
				(coordinates[i].x * canvas.width) - (starSize * 1.8), 
				(coordinates[i].y * canvas.height) - (starSize * 1.8));
		}*/
	}
}

/**
 * Draws the star / tag labels randomly.
 */
function drawLabels() {
	// Generate a random number per caption.
	// To be used as a criteria for the caption to be -
	// shown or not.
	var date = new Date();
	var now = date.getTime();
	if (now - time.captions > 3000) {
		for(var i = 0; i < coordinates.length; i++) {
			r[i] = Math.random();
		}
		time.captions = now;
	}
	// Count captions shown.
	var tagsCount = 0;

	ctx.fillStyle = '#aaa';
	ctx.font = '11px Courier';
	for(var i = 0; i < coordinates.length; i++) {
		// Show random and up to 10 captions.
		if (tagsCount < 10 && r[i] > 0.6) {
			var starSize = 0;
			if (i % 5 == 0) starSize = 1;
			else if (i % 3 == 0) starSize = 3;
			else if (i % 2 == 0) starSize = 5;
			else starSize = 6;

			tagsCount++;
			ctx.fillText('tag-' + i, starSize+3 + (coordinates[i].x * canvas.width), -starSize-3 + (coordinates[i].y * canvas.height));
		}
	}
}

/**
 * Draws the space guy and alien images.
 *
 * TODO: Handle position updates separately.
  */
var q = 0; var qq = 0; var qqq = 0;
function drawImages() {
	var date = new Date();
	var now = date.getTime();
	if (now - time.spaceguy > 40) {
		if (++qqq / 360 == 0 && qqq > 1000) qqq = 0;

		if (++q > canvas.height) {
			q = 0;
			qq += 100; 
			if (q + qq > canvas.width) {
				qq = 0;
				q = 0;
			}
		}
		if (q + qq > canvas.width) {
			q = qq = 0;
		}
		time.spaceguy = now;
	}

	ctx.drawImage(spaceguy, qq + q, q);
	ctx.drawImage(alienguy, canvas.width * 0.5 + (190 * Math.cos((Math.PI / 180) *  qqq) - 130 * Math.sin((Math.PI / 180) *  qqq)), canvas.height * 0.5 + (190 * Math.sin((Math.PI / 180) * qqq) +  130 * Math.cos((Math.PI / 180) * qqq)));
}

/**
 * Draws the planet orbits.
 */
var orbitsPhi = [];
function drawOrbits() {
	var orbits = 9;

	for (var i = 1; i <= orbits; i++) {
		var x, y = 0;

		if (!orbitsPhi[i]) {
			if (i == 1) orbitsPhi[i] = Math.ceil(Math.random() * 100);
			else orbitsPhi[i] = orbitsPhi[i - 1] + ((360 / orbits) * i - (360 / orbits)) + (Math.random() * 100);
		}
		
		x = 0.5 + (i * (14 + i / 2) * Math.cos((Math.PI / 180) * orbitsPhi[i]) - i * (14 + i / 2) * Math.sin((Math.PI / 180) * orbitsPhi[i])) / canvas.width;
		y = 0.5 + (i * (14 + i / 2) * Math.sin((Math.PI / 180) * orbitsPhi[i]) + i * (14 + i / 2) * Math.cos((Math.PI / 180) * orbitsPhi[i])) / canvas.height;

		orbitsPhi[i] += (orbits - i + 1) * 0.02;
		if (orbitsPhi[i] > 1000 && orbitsPhi[i] / 360 == 0) orbitsPhi[i] = 1;
		
		ctx.fillStyle = '#0' + (orbits - i) + '0';
		ctx.beginPath();
		ctx.arc(x * canvas.width, y * canvas.height, i + 1, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fill(); 
	}
}

/**
 * Animates a sigle star when it is clicked.
 */
var starsCenterDone = false;
function starsCenter() {
	if (clickedBody > -1 && !starsCenterDone) {
			starsCenterDone = easing(0.5, clickedBody);
	} else {
		if (clickedBody > -1 && starsCenterDone) {
			drawOrbits();
		}
	}
}

/**
 * Animates the non-clicked stars in circle positions.
 */
var starsCircleDone = false;
function starsCircle() {
	if (clickedBody > -1 && !starsCircleDone) {
		var allDone = true;
		for (var i = 0; i < circleCoords.length; i++) {
			if (i !== clickedBody) {
				if(! easing(circleCoords, i)) allDone = false;
			}
		}

		if (allDone == true) starsCircleDone = true;
	}
}

/**
 * Animates the system reset.
 */
var starsResetDone = false;
function starsReset() {
	if (clickedBody == -1 && !starsResetDone) {
		var allDone = true;
		for (var i = 0; i < origCoords.length; i++) {
			if (! easing(origCoords, i)) allDone = false;
		}

		if (allDone == true) starsResetDone = true;
	}
}

/**
 * Does simple animation easing.
 *
 * Returns true if easing is complete.
 */
function easing(targetCoords, i) {
	if (targetCoords instanceof Array === false) coords = {x: targetCoords, y: targetCoords};
	else coords = targetCoords[i];

	if (coordinates[i].x > coords.x - 0.01 && coordinates[i].x < coords.x + 0.01) {
		coordinates[i].x = coords.x;
	} else if (coordinates[i].x > coords.x) {
		if (coordinates[i].x - coords.x < 0.1) {
			coordinates[i].x -= 0.003;
		} else {
			coordinates[i].x -= 0.01;
		}
	} else if (coordinates[i].x < coords.x) {
		if (coords.x - coordinates[i].x < 0.1) {
			coordinates[i].x += 0.003;
		} else {
			coordinates[i].x += 0.01;
		}
	}
	if (coordinates[i].y > coords.y - 0.01 && coordinates[i].y < coords.y + 0.01) {
		coordinates[i].y = coords.y;
	} else if (coordinates[i].y > coords.y) {
		if (coordinates[i].y - coords.y < 0.1) {
			coordinates[i].y -= 0.003;
		} else {
			coordinates[i].y -= 0.01;
		}
	} else if (coordinates[i].y < coords.y) {
		if (coords.y - coordinates[i].y < 0.1) {
			coordinates[i].y += 0.003;
		} else {
			coordinates[i].y += 0.01;
		}
	}

	if (coordinates[i].x == coords.x && coordinates[i].y == coords.y) return true;

	return false;
}

function render() {
	requestAnimationFrame(render);
	animate();
}

function animate() {
	drawSpace();

	starsHover();
	starsReset();
	starsCenter();
	starsCircle();
		
	drawStars();
	drawLabels();
	drawImages();

	fps.update();
}

/************************************************/
/***************** Init area ********************/
/************************************************/

// Test data (not used yet).
var tags = [
	{'tag1':
		['art1','art1','art1','art1','art1','art1']
	},
	{'tag2':
		['art1','art1','art1','art1']
	},
	{'tag3':
		['art1','art1']
	},
	{'tag4':
		['art1','art1','art1','art1','art1']
	},
	{'tag5':
		['art1']
	}
];

// Frames per second stats.
fps = new Stats();
fps.domElement.id = 'fps-stats';
fps.domElement.style.position = 'absolute';
fps.domElement.style.top = '0';
fps.domElement.style.right = '0';
fps.domElement.style.zIndex = 100;
document.getElementById('body').appendChild(fps.domElement);

// Time references.
var date = new Date();
var time = {};

// The 2D canvas and context.
var canvas = document.getElementById('tagspace');
var ctx = canvas.getContext('2d');

// The helper canvas and context.
var hcanvas = document.getElementById('hcanvas');
var hctx = hcanvas.getContext('2d');

// Generate the glows.
var starSizes = [1, 3, 5, 6];
var starGlows = []
for (var i = 0; i < starSizes.length; i++) {
	hcanvas.width = starSizes[i] * 6.5 * 2;
	hcanvas.height = starSizes[i] * 6.5 * 2;
	hctx.canvas.width = starSizes[i] * 6.5 * 2;
	hctx.canvas.height = starSizes[i] * 6.5 * 2;
	hcanvas.style.background = 'transparent';

	starGlows[starSizes[i]] = {};

	var sgColor = '#222';
	var glow = ctx.createRadialGradient(
		0.5 * hctx.canvas.width, 0.5 * hctx.canvas.height, starSizes[i], 
		0.5 * hctx.canvas.width, 0.5 * hctx.canvas.height, starSizes[i] * 6.5);
	glow.addColorStop(0, sgColor);
	glow.addColorStop(1, 'transparent');
	hctx.fillStyle = glow;
	hctx.beginPath();
	hctx.arc(0.5 * hctx.canvas.width, 0.5 * hctx.canvas.height, starSizes[i] * 6.5, 0, Math.PI * 2, true);
	hctx.closePath();
	hctx.fill();

	var img = new Image();
	img.src = hcanvas.toDataURL();
	starGlows[starSizes[i]].static = img;

	hctx.canvas.width = hctx.canvas.width;
	
	sgColor = '#f00';
	glow = ctx.createRadialGradient(
		0.5 * hctx.canvas.width, 0.5 * hctx.canvas.height, starSizes[i], 
		0.5 * hctx.canvas.width, 0.5 * hctx.canvas.height, starSizes[i] * 6.5);
	glow.addColorStop(0, sgColor);
	glow.addColorStop(1, 'transparent');
	hctx.fillStyle = glow;
	hctx.beginPath();
	hctx.arc(0.5 * hctx.canvas.width, 0.5 * hctx.canvas.height, starSizes[i] * 6.5, 0, Math.PI * 2, true);
	hctx.closePath();
	hctx.fill();

	img = new Image();
	img.src = hcanvas.toDataURL();
	starGlows[starSizes[i]].selected = img;

	hcanvas.width = starSizes[i] * 1.8 * 2;
	hcanvas.height = starSizes[i] * 1.8 * 2;
	hctx.canvas.width = starSizes[i] * 1.8 * 2;
	hctx.canvas.height = starSizes[i] * 1.8 * 2;
	hcanvas.style.background = 'transparent';

	var o = 1.8 * starSizes[i];
	glow = hctx.createRadialGradient(
		0.5 * hctx.canvas.width, 0.5 * hctx.canvas.height, starSizes[i], 
		0.5 * hctx.canvas.width, 0.5 * hctx.canvas.height, starSizes[i], o);
	glow.addColorStop(0, '#000');
	glow.addColorStop(1, '#000');
	hctx.fillStyle = glow;
	hctx.beginPath();
	hctx.arc(0.5 * hctx.canvas.width, 0.5 * hctx.canvas.height, starSizes[i], o, 0, Math.PI * 2, true);
	hctx.closePath();
	hctx.fill();

	img = new Image();
	img.src = hcanvas.toDataURL();
	starGlows[starSizes[i]].blink = img;
}
hctx.canvas.width = hctx.canvas.height = 1;

// Instantiate the images.
var spaceguy = new Image();
spaceguy.src = 'spaceguy.png';
var alienguy = new Image();
alienguy.src = 'alienguy.png';

// The calculated canvas element offsets.
var offsetLeft = 0;
var offsetTop = 0;

// Mouse coordinates and mousedown flag.
var mouse = {x: 0, y: 0};
var mouseDown = false;			

// Mouse state events.
canvas.onmousemove = function (e) {
	e.preventDefault();

	mouse.x = e.clientX - offsetLeft + document.body.scrollLeft;
	mouse.y = e.clientY - offsetTop + document.body.scrollTop;
};
canvas.onmousedown = function (e) {
	e.preventDefault();
	e.stopPropagation();

	mouseDown = !mouseDown;
};
canvas.onmouseup = function (e) {
	e.preventDefault();
	e.stopPropagation();

	mouseDown = !mouseDown;

	bodyClicks();
};

// Key up handler.
// 1- On [enter] key press we reset the system.
document.onkeyup = function (e) {
	if (e.keyCode === 13) {
		e.preventDefault();
		e.stopPropagation();

		// No star is clicked.
		clickedBody = -1;
		starsResetDone = false;
		orbitsPhi = [];
	}
}

// The original star coordinates. Used to reset the system.
var origCoords = generateStarCoords(30);

// The circle position start coordinates.
var circleCoords = generateCircleCoords(30 - 1);

// The real star coordinates. We copy the original -
// coordinates to start with.
var coordinates = [];
for(var f = 0; f < origCoords.length; f++) {
	coordinates[f] = {};
	coordinates[f].x = origCoords[f].x;
	coordinates[f].y = origCoords[f].y;
}

var star = [];
time.captions = date.getTime();
time.spaceguy = date.getTime();
var r = [];
for(var i = 0; i < coordinates.length; i++) {
	r[i] = Math.random();
}
render();

/**
 * Checks if a star has been clicked.
 */
var clickedBody = -1;
function bodyClicks() {
	for(var i = 0; i < coordinates.length; i++) {
		if (coordinates[i].x * canvas.width > mouse.x - 10 &&
			coordinates[i].x * canvas.width < mouse.x + 10 &&
			coordinates[i].y * canvas.height > mouse.y - 10 &&
			coordinates[i].y * canvas.height < mouse.y + 10) 
		{
			clickedBody = i;
			starsCircleDone = false;
			starsCenterDone = false;

			break;
		}
	}
}

/**
 * Check if a star is hovered.
 */
function starsHover() {
	var hover = false;

	for(var i = 0; i < coordinates.length; i++) {
		if (coordinates[i].x * canvas.width > mouse.x - 10 &&
			coordinates[i].x * canvas.width < mouse.x + 10 &&
			coordinates[i].y * canvas.height > mouse.y - 10 &&
			coordinates[i].y * canvas.height < mouse.y + 10) 
		{
			hover = true;

			break;
		}
	}
	
	if (hover) canvas.style.cursor = 'pointer'; else canvas.style.cursor = 'default';
}

/**
 * Generates random, non overlapping coordinates for the stars / tags.
 *
 * TODO: Use better algorithm.
 * TODO: Fit more stars.
 * TODO: Remove hardcoded values.
 */
function generateStarCoords(tagCount) {
	var coordinates = [];
	var dx = 12 / canvas.width ;
	var dy = 12 / canvas.height;

	for(var i = 0; i < tagCount; i++) {
		var x = Math.random();
		var y = Math.random();

		if (i > 0) {
			var test = false;

			while(test === false) {
				test = true;
				for(var j = i - 1; j >= 0; j--) {
					if(((x < coordinates[j].x + dx && x > coordinates[j].x - dx) ||
					(y < coordinates[j].y + dy && y > coordinates[j].y - dy))) {
						x = Math.random();
						y = Math.random();

						test = false;
						break;
					}
				}
			}
		}

		coordinates[i] = {x: x, y: y};
	}

	return coordinates;
}

/**
 * Generates the circle coordinates for the stars.
 * Used for when a star is selected.
 *
 * TODO: Remove hardcoded values.
 */
function generateCircleCoords(tagCountM1) {
	var side1Count = Math.ceil(tagCountM1 / 2);
	var step = Math.floor(150 / side1Count);
	var coordinates = [];

	for(var i = 0; i <= tagCountM1; i++) {
		if (i < side1Count) {
			phi = 15 + (step * i);
		} else {
			phi = 195 + (step * (i - side1Count));
		}

		coordinates[i] = {};
		coordinates[i].x = 0.5 + (140 * Math.cos((Math.PI / 180) * phi) - 190 * Math.sin((Math.PI / 180) * phi)) / canvas.width;
		coordinates[i].y = 0.5 + (140 * Math.sin((Math.PI / 180) * phi) + 190 * Math.cos((Math.PI / 180) * phi)) / canvas.height;
	}

	return coordinates;
}

/**
 * Calculates the canvas offset left and top.
 * This helps when selecting a star.
 */ 
window.onload = function() {
	var tmpEl = canvas;
	while (tmpEl instanceof HTMLBodyElement === false) {
		offsetLeft += tmpEl.offsetLeft;
		offsetTop += tmpEl.offsetTop;
		tmpEl = tmpEl.offsetParent;
	}
};
