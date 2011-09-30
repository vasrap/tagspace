/**
 * Draws the space.
 */
function drawSpace() {
	pub.ctx.fillStyle = 'black';
	pub.ctx.fillRect(0, 0, pub.canvas.width, pub.canvas.height);
}

/**
 * Draws the stars.
 */
function drawStars() {
	for(var i = 0; i < pub.coordinates.length; i++) {
		var starSize = 0;
		if (i % 5 == 0) starSize = 1;
		else if (i % 3 == 0)starSize = 3;
		else if (i % 2 == 0) starSize = 5;
		else starSize = 6;

		var mainGlow = pub.starGlows[starSize].main;
		if (i == pub.clickedBody) mainGlow = pub.starGlows[starSize].selected;
		pub.ctx.drawImage(
			mainGlow, 
			(pub.coordinates[i].x * pub.canvas.width) - (starSize * 6.5), 
			(pub.coordinates[i].y * pub.canvas.height) - (starSize * 6.5));

		// Main body.
		pub.ctx.fillStyle = '#fdfdaa';
		pub.ctx.beginPath();
		pub.ctx.arc(pub.coordinates[i].x * pub.canvas.width, pub.coordinates[i].y * pub.canvas.height, starSize, 0, Math.PI * 2, true);
		pub.ctx.closePath();
		pub.ctx.fill(); 

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
 * Draws the star / tag labels (selected stars are shown in intervals).
 */
function drawLabels() {
	// Generate a random number per caption.
	// To be used as a criteria for the caption to be -
	// shown or not.
	var date = new Date();
	var now = date.getTime();
	if (now - pub.time.captions > 3000) {
		for(var i = 0; i < pub.coordinates.length; i++) {
			pub.r[i] = Math.random();
		}
		pub.time.captions = now;
	}
	// Count captions shown.
	var tagsCount = 0;

	pub.ctx.fillStyle = '#aaa';
	pub.ctx.font = '11px Courier';
	for(var i = 0; i < pub.coordinates.length; i++) {
		// Show random and up to 10 captions.
		if (tagsCount < 10 && pub.r[i] > 0.6) {
			var starSize = 0;
			if (i % 5 == 0) starSize = 1;
			else if (i % 3 == 0) starSize = 3;
			else if (i % 2 == 0) starSize = 5;
			else starSize = 6;

			tagsCount++;
			pub.ctx.fillText('tag-' + i, starSize+3 + (pub.coordinates[i].x * pub.canvas.width), -starSize-3 + (pub.coordinates[i].y * pub.canvas.height));
		}
	}
}

/**
 * Draws the space guy and alien images.
 *
 * TODO: Handle animation separately.
  */
var q = 0; var qq = 0; var qqq = 0;
function drawImages() {
	var date = new Date();
	var now = date.getTime();
	if (now - pub.time.spaceguy > 40) {
		if (++qqq / 360 == 0 && qqq > 1000) qqq = 0;

		if (++q > pub.canvas.height) {
			q = 0;
			qq += 100; 
			if (q + qq > pub.canvas.width) {
				qq = 0;
				q = 0;
			}
		}
		if (q + qq > pub.canvas.width) {
			q = qq = 0;
		}
		pub.time.spaceguy = now;
	}

	pub.ctx.drawImage(pub.spaceguy, qq + q, q);
	pub.ctx.drawImage(pub.alienguy, pub.canvas.width * 0.5 + (190 * Math.cos((Math.PI / 180) *  qqq) - 130 * Math.sin((Math.PI / 180) *  qqq)), pub.canvas.height * 0.5 + (190 * Math.sin((Math.PI / 180) * qqq) +  130 * Math.cos((Math.PI / 180) * qqq)));
}

/**
 * Draws the planet orbits.
 *
 * TODO: Handle animation separately.
 */
function drawOrbits() {
	var orbits = 9;

	for (var i = 1; i <= orbits; i++) {
		var x, y = 0;

		if (!pub.orbitsPhi[i]) {
			if (i == 1) pub.orbitsPhi[i] = Math.ceil(Math.random() * 100);
			else pub.orbitsPhi[i] = pub.orbitsPhi[i - 1] + ((360 / orbits) * i - (360 / orbits)) + (Math.random() * 100);
		}
		
		x = 0.5 + (i * (14 + i / 2) * Math.cos((Math.PI / 180) * pub.orbitsPhi[i]) - i * (14 + i / 2) * Math.sin((Math.PI / 180) * pub.orbitsPhi[i])) / pub.canvas.width;
		y = 0.5 + (i * (14 + i / 2) * Math.sin((Math.PI / 180) * pub.orbitsPhi[i]) + i * (14 + i / 2) * Math.cos((Math.PI / 180) * pub.orbitsPhi[i])) / pub.canvas.height;

		pub.orbitsPhi[i] += (orbits - i + 1) * 0.02;
		if (pub.orbitsPhi[i] > 1000 && pub.orbitsPhi[i] / 360 == 0) pub.orbitsPhi[i] = 1;
		
		pub.ctx.fillStyle = '#0' + (orbits - i) + '0';
		pub.ctx.beginPath();
		pub.ctx.arc(x * pub.canvas.width, y * pub.canvas.height, i + 1, 0, Math.PI * 2, true);
		pub.ctx.closePath();
		pub.ctx.fill(); 
	}
}

/**
 * Animates the clicked star to the canvas center.
 */
function starsCenter() {
	if (pub.clickedBody > -1 && !pub.starsCenterDone) {
			pub.starsCenterDone = easing(0.5, pub.clickedBody);
	} else {
		if (pub.clickedBody > -1 && pub.starsCenterDone) {
			drawOrbits();
		}
	}
}

/**
 * Animates the non-clicked stars in circle positions.
 */
function starsCircle() {
	if (pub.clickedBody > -1 && !pub.starsCircleDone) {
		var allDone = true;
		for (var i = 0; i < pub.circleCoords.length; i++) {
			if (i !== pub.clickedBody) {
				if(! easing(pub.circleCoords, i)) allDone = false;
			}
		}

		if (allDone == true) pub.starsCircleDone = true;
	}
}

/**
 * Animates the system reset.
 */
function starsReset() {
	if (pub.clickedBody == -1 && !pub.starsResetDone) {
		var allDone = true;
		for (var i = 0; i < pub.origCoords.length; i++) {
			if (! easing(pub.origCoords, i)) allDone = false;
		}

		if (allDone == true) pub.starsResetDone = true;
	}
}

/**
 * Checks if a star has been clicked.
 */
function bodyClicks() {
	for(var i = 0; i < pub.coordinates.length; i++) {
		if (pub.coordinates[i].x * pub.canvas.width > pub.mouse.x - 10 &&
			pub.coordinates[i].x * pub.canvas.width < pub.mouse.x + 10 &&
			pub.coordinates[i].y * pub.canvas.height > pub.mouse.y - 10 &&
			pub.coordinates[i].y * pub.canvas.height < pub.mouse.y + 10) 
		{
			pub.clickedBody = i;
			pub.starsCircleDone = false;
			pub.starsCenterDone = false;

			break;
		}
	}
}

/**
 * Check if a star is hovered.
 */
function starsHover() {
	var hover = false;

	for(var i = 0; i < pub.coordinates.length; i++) {
		if (pub.coordinates[i].x * pub.canvas.width > pub.mouse.x - 10 &&
			pub.coordinates[i].x * pub.canvas.width < pub.mouse.x + 10 &&
			pub.coordinates[i].y * pub.canvas.height > pub.mouse.y - 10 &&
			pub.coordinates[i].y * pub.canvas.height < pub.mouse.y + 10) 
		{
			hover = true;

			break;
		}
	}
	
	if (hover) pub.canvas.style.cursor = 'pointer'; else pub.canvas.style.cursor = 'default';
}

/**
 * Does simple animation easing.
 *
 * Returns true if easing is complete.
 *
 * TODO: Should probably use a library for this.
 */
function easing(targetCoords, i) {
	if (targetCoords instanceof Array === false) coords = {x: targetCoords, y: targetCoords};
	else coords = targetCoords[i];

	if (pub.coordinates[i].x > coords.x - 0.01 && pub.coordinates[i].x < coords.x + 0.01) {
		pub.coordinates[i].x = coords.x;
	} else if (pub.coordinates[i].x > coords.x) {
		if (pub.coordinates[i].x - coords.x < 0.1) {
			pub.coordinates[i].x -= 0.003;
		} else {
			pub.coordinates[i].x -= 0.01;
		}
	} else if (pub.coordinates[i].x < coords.x) {
		if (coords.x - pub.coordinates[i].x < 0.1) {
			pub.coordinates[i].x += 0.003;
		} else {
			pub.coordinates[i].x += 0.01;
		}
	}
	if (pub.coordinates[i].y > coords.y - 0.01 && pub.coordinates[i].y < coords.y + 0.01) {
		pub.coordinates[i].y = coords.y;
	} else if (pub.coordinates[i].y > coords.y) {
		if (pub.coordinates[i].y - coords.y < 0.1) {
			pub.coordinates[i].y -= 0.003;
		} else {
			pub.coordinates[i].y -= 0.01;
		}
	} else if (pub.coordinates[i].y < coords.y) {
		if (coords.y - pub.coordinates[i].y < 0.1) {
			pub.coordinates[i].y += 0.003;
		} else {
			pub.coordinates[i].y += 0.01;
		}
	}

	if (pub.coordinates[i].x == coords.x && pub.coordinates[i].y == coords.y) return true;

	return false;
}

function render() {
	requestAnimationFrame(render);
	animate();
}

function animate() {
	starsHover();
	starsReset();
	starsCenter();
	starsCircle();
		
	drawSpace();
	drawStars();
	drawLabels();
	drawImages();

	pub.fps.update();
}

/************************************************/
/***************** Init area ********************/
/************************************************/

/**
 * Public variable container.
 */
var pub = {
	clickedBody: -1,
	starsResetDone: false,
	starsCircleDone: false,
	orbitsPhi: [],
	starsCenterDone: false,
};

/**
 * The tag class.
 */
function tag(options) {
	if (options && options.name && options.total && options.articles && options.weight) {
		this.name = options.name;
		this.total = options.total;
		this.articles = options.articles;
		this.weight = options.weight;
	} else {
		this.name = '';
		this.total = 0;
		this.articles = [];
		this.weight = 0;
	}
}
/**
 * The article class.
 */
function article(options) {
	if (options && options.name && options.link && options.weight) {
		this.name = options.name;
		this.link = options.link;
		this.weight = options.weight;
	} else {
		this.name = '';
		this.link = '#';
		this.weight = 0;
	}
}
/**
 * Instantiate and associate article and tag objects from input.
 *
 * TODO: Implement this.
 */
function factory() {

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
	var dx = 12 / pub.canvas.width ;
	var dy = 12 / pub.canvas.height;

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
		coordinates[i].x = 0.5 + (140 * Math.cos((Math.PI / 180) * phi) - 190 * Math.sin((Math.PI / 180) * phi)) / pub.canvas.width;
		coordinates[i].y = 0.5 + (140 * Math.sin((Math.PI / 180) * phi) + 190 * Math.cos((Math.PI / 180) * phi)) / pub.canvas.height;
	}

	return coordinates;
}

/**
 * Initialize everything and then start rendering.
 */
function init() {
	// Frames per second stats.
	pub.fps = new Stats();
	pub.fps.domElement.id = 'fps-stats';
	pub.fps.domElement.style.position = 'absolute';
	pub.fps.domElement.style.top = '0';
	pub.fps.domElement.style.right = '0';
	pub.fps.domElement.style.zIndex = 100;
	document.getElementById('body').appendChild(pub.fps.domElement);

	// Time references.
	var date = new Date();
	pub.time = {};

	// The 2D canvas and context.
	pub.canvas = document.getElementById('tagspace');
	pub.ctx = pub.canvas.getContext('2d');

	// The helper canvas and context.
	pub.hcanvas = document.getElementById('hcanvas');
	pub.hctx = pub.hcanvas.getContext('2d');

	// Generate the glows.
	var starSizes = [1, 3, 5, 6];
	pub.starGlows = []
	for (var i = 0; i < starSizes.length; i++) {
		pub.hcanvas.width = starSizes[i] * 6.5 * 2;
		pub.hcanvas.height = starSizes[i] * 6.5 * 2;
		pub.hctx.canvas.width = starSizes[i] * 6.5 * 2;
		pub.hctx.canvas.height = starSizes[i] * 6.5 * 2;
		pub.hcanvas.style.background = 'transparent';

		pub.starGlows[starSizes[i]] = {};

		var sgColor = '#222';
		var glow = pub.hctx.createRadialGradient(
			0.5 * pub.hctx.canvas.width, 0.5 * pub.hctx.canvas.height, starSizes[i], 
			0.5 * pub.hctx.canvas.width, 0.5 * pub.hctx.canvas.height, starSizes[i] * 6.5);
		glow.addColorStop(0, sgColor);
		glow.addColorStop(1, 'transparent');
		pub.hctx.fillStyle = glow;
		pub.hctx.beginPath();
		pub.hctx.arc(0.5 * pub.hctx.canvas.width, 0.5 * pub.hctx.canvas.height, starSizes[i] * 6.5, 0, Math.PI * 2, true);
		pub.hctx.closePath();
		pub.hctx.fill();

		var img = new Image();
		img.src = pub.hcanvas.toDataURL();
		pub.starGlows[starSizes[i]].main = img;

		pub.hctx.canvas.width = pub.hctx.canvas.width;
		
		sgColor = '#f00';
		glow = pub.hctx.createRadialGradient(
			0.5 * pub.hctx.canvas.width, 0.5 * pub.hctx.canvas.height, starSizes[i], 
			0.5 * pub.hctx.canvas.width, 0.5 * pub.hctx.canvas.height, starSizes[i] * 6.5);
		glow.addColorStop(0, sgColor);
		glow.addColorStop(1, 'transparent');
		pub.hctx.fillStyle = glow;
		pub.hctx.beginPath();
		pub.hctx.arc(0.5 * pub.hctx.canvas.width, 0.5 * pub.hctx.canvas.height, starSizes[i] * 6.5, 0, Math.PI * 2, true);
		pub.hctx.closePath();
		pub.hctx.fill();

		img = new Image();
		img.src = pub.hcanvas.toDataURL();
		pub.starGlows[starSizes[i]].selected = img;

		pub.hcanvas.width = starSizes[i] * 1.8 * 2;
		pub.hcanvas.height = starSizes[i] * 1.8 * 2;
		pub.hctx.canvas.width = starSizes[i] * 1.8 * 2;
		pub.hctx.canvas.height = starSizes[i] * 1.8 * 2;
		pub.hcanvas.style.background = 'transparent';

		var o = 1.8 * starSizes[i];
		glow = pub.hctx.createRadialGradient(
			0.5 * pub.hctx.canvas.width, 0.5 * pub.hctx.canvas.height, starSizes[i], 
			0.5 * pub.hctx.canvas.width, 0.5 * pub.hctx.canvas.height, starSizes[i], o);
		glow.addColorStop(0, '#000');
		glow.addColorStop(1, '#000');
		pub.hctx.fillStyle = glow;
		pub.hctx.beginPath();
		pub.hctx.arc(0.5 * pub.hctx.canvas.width, 0.5 * pub.hctx.canvas.height, starSizes[i], o, 0, Math.PI * 2, true);
		pub.hctx.closePath();
		pub.hctx.fill();

		img = new Image();
		img.src = pub.hcanvas.toDataURL();
		pub.starGlows[starSizes[i]].blink = img;
	}
	pub.hctx.canvas.width = pub.hctx.canvas.height = 1;

	// Instantiate the images.
	pub.spaceguy = new Image();
	pub.spaceguy.src = 'spaceguy.png';
	pub.alienguy = new Image();
	pub.alienguy.src = 'alienguy.png';

	// The calculated canvas element offsets.
	pub.offsetLeft = 0;
	pub.offsetTop = 0;

	// Calculates the canvas offset left and top.
	// This helps when selecting a star.
	var tmpEl = pub.canvas;
	while (tmpEl instanceof HTMLBodyElement === false) {
		pub.offsetLeft += tmpEl.offsetLeft;
		pub.offsetTop += tmpEl.offsetTop;
		tmpEl = tmpEl.offsetParent;
	}

	// Mouse coordinates and mousedown flag.
	pub.mouse = {x: 0, y: 0};
	pub.mouseDown = false;			

	// Mouse state events.
	pub.canvas.onmousemove = function (e) {
		e.preventDefault();

		pub.mouse.x = e.clientX - pub.offsetLeft + document.body.scrollLeft;
		pub.mouse.y = e.clientY - pub.offsetTop + document.body.scrollTop;
	};
	pub.canvas.onmousedown = function (e) {
		e.preventDefault();
		e.stopPropagation();

		pub.mouseDown = !pub.mouseDown;
	};
	pub.canvas.onmouseup = function (e) {
		e.preventDefault();
		e.stopPropagation();

		pub.mouseDown = !pub.mouseDown;

		bodyClicks();
	};

	// Key up handler.
	// 1- On [enter] key press we reset the system.
	document.onkeyup = function (e) {
		if (e.keyCode === 13) {
			e.preventDefault();
			e.stopPropagation();

			// No star is clicked.
			pub.clickedBody = -1;
			pub.starsResetDone = false;
			pub.orbitsPhi = [];
		}
	}

	// The original star coordinates. Used to reset the system.
	pub.origCoords = generateStarCoords(30);

	// The circle position start coordinates.
	pub.circleCoords = generateCircleCoords(30 - 1);

	// The real star coordinates. We copy the original -
	// coordinates to start with.
	pub.coordinates = [];
	for(var f = 0; f < pub.origCoords.length; f++) {
		pub.coordinates[f] = {};
		pub.coordinates[f].x = pub.origCoords[f].x;
		pub.coordinates[f].y = pub.origCoords[f].y;
	}

	pub.time.captions = date.getTime();
	pub.time.spaceguy = date.getTime();
	pub.r = [];
	for(var i = 0; i < pub.coordinates.length; i++) {
		pub.r[i] = Math.random();
	}
	render();
}

/**
 * When page completes loading.
 */
window.onload = function() {
	init();
};
