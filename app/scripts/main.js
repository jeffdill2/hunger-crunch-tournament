$(document).ready(function() {
	$('.header-ribbon').fitText(2);

	$('.scrolling-background').pan({fps: 20, speed: 3, dir: 'right', depth: 50});
	$('.scrolling-background').spRelSpeed(5);
});