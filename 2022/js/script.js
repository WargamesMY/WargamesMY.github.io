var scrollTextEls = document.querySelectorAll('.scroll-text');
function updateScrollText() {
	scrollTextEls.forEach(function (el) {
		el.style.width = el.children[0].clientWidth + 'px';
	});
}

var phrases = [];
document.querySelectorAll('.section').forEach(function (el) {
	phrases.push(el.getAttribute('data-tooltip'));
});
var phraseFxs = [];
document.querySelectorAll('.scroll-text span').forEach(function (el) {
	phraseFxs.push(new TextScramble(el));
});

var slideInterval;
var isMouseOverSlide;
var isMouseOverSlideNav;
var mouseTimeout;
var isMouseStale;
function resetMoveSlide() {
	clearInterval(slideInterval);
	slideInterval = setInterval(function () {
		if (!isMouseOverSlide || isMouseStale) {
			fullpage_api.moveSlideRight();
		}
	}, 3000);
}

var errFn = console.error;
console.error = function () { };
new fullpage('#fullpage', {
	scrollingSpeed: 300,
	recordHistory: false,
	navigation: true,
	slidesNavigation: true,
	controlArrowsHTML: ['<div class="arrow"></div>', '<div class="arrow"></div>'],
	credits: { enabled: false },
	afterRender: function () {
		var slide = document.querySelector('.fp-slides');
		slide.addEventListener('mouseleave', function () {
			isMouseOverSlide = false;
		});
		slide.addEventListener('mouseenter', function () {
			isMouseOverSlide = true;
		});
		document.addEventListener('mousemove', function () {
			clearTimeout(mouseTimeout);
			isMouseStale = false;
			mouseTimeout = setTimeout(function () {
				isMouseStale = true;
			}, 15000);
		});
		setTimeout(updateScrollText, 100);
	},
	onLeave: function (_, destination, _, _) {
		phraseFxs.forEach(function (fx) {
			fx.setText(phrases[destination.index]).then(updateScrollText);
		});
	},
	afterLoad: function (_, _, _, _) {
		resetMoveSlide();
	},
	onSlideLeave: function (_, _, _, _) {
		resetMoveSlide();
	}
});
console.error = errFn;
